/**
 * Security Module for Multi-User Local Data Encryption using AES-GCM via Web Crypto API.
 */

const USER_REGISTRY_KEY = 'accounting_user_registry';

// Helper: Convert ArrayBuffer to Base64 String
function arrayBufferToBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

// Helper: Convert Base64 String to ArrayBuffer
function base64ToArrayBuffer(base64) {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

// --- Multi-User Registry Helpers ---
function getUserRegistry() {
  const raw = localStorage.getItem(USER_REGISTRY_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

function addToUserRegistry(username) {
  const registry = getUserRegistry();
  if (!registry.includes(username)) {
    registry.push(username);
    localStorage.setItem(USER_REGISTRY_KEY, JSON.stringify(registry));
  }
}

function userExists(username) {
  return getUserRegistry().includes(username);
}

// Helper: Get server base URL (same origin)
function getServerBaseUrl() {
  return window.location.origin;
}

// --- Cryptographic Context and Helpers ---
const useNativeCrypto = !!(window.crypto && window.crypto.subtle);

// Safe getRandomValues wrapper (secure or insecure contexts)
function getRandomValues(array) {
  const cryptoObj = window.crypto || window.msCrypto;
  if (cryptoObj && cryptoObj.getRandomValues) {
    return cryptoObj.getRandomValues(array);
  }
  // Math.random fallback for environments where window.crypto is missing (unlikely, but safe)
  for (let i = 0; i < array.length; i++) {
    array[i] = Math.floor(Math.random() * 256);
  }
  return array;
}

// Convert Uint8Array to Forge binary string
function uint8ArrayToForgeString(arr) {
  let str = '';
  for (let i = 0; i < arr.length; i++) {
    str += String.fromCharCode(arr[i]);
  }
  return str;
}

// Convert Forge binary string to Uint8Array
function forgeStringToUint8Array(str) {
  const arr = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) {
    arr[i] = str.charCodeAt(i);
  }
  return arr;
}

// Get or create unique salt for a specific user
function getOrCreateUserSalt(username) {
  const key = `acc_u_${username}_salt`;
  let saltBase64 = localStorage.getItem(key);
  if (!saltBase64) {
    const saltBytes = getRandomValues(new Uint8Array(16));
    saltBase64 = arrayBufferToBase64(saltBytes.buffer);
    localStorage.setItem(key, saltBase64);
  }
  return new Uint8Array(base64ToArrayBuffer(saltBase64));
}

// Derive AES-GCM 256 key from Password and user-specific Salt using PBKDF2
async function deriveUserKey(username, password) {
  const salt = getOrCreateUserSalt(username);
  if (useNativeCrypto) {
    const encoder = new TextEncoder();
    const baseKey = await window.crypto.subtle.importKey(
      "raw",
      encoder.encode(password),
      "PBKDF2",
      false,
      ["deriveKey"]
    );
    return window.crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: salt,
        iterations: 50000,
        hash: "SHA-256"
      },
      baseKey,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"]
    );
  } else {
    // Forge fallback: derives raw 256-bit key (32 bytes)
    const saltString = uint8ArrayToForgeString(salt);
    const derivedKeyBytes = window.forge.pkcs5.pbkdf2(
      password,
      saltString,
      50000,
      32, // 32 bytes = 256 bits
      window.forge.md.sha256.create()
    );
    return derivedKeyBytes;
  }
}

/**
 * Encrypt plain text for a specific user.
 */
async function encryptForUser(plainText, username, password) {
  const key = await deriveUserKey(username, password);
  
  if (useNativeCrypto) {
    const iv = getRandomValues(new Uint8Array(12));
    const encoder = new TextEncoder();
    const encodedData = encoder.encode(plainText);
    
    const ciphertextBuffer = await window.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv
      },
      key,
      encodedData
    );

    const combined = new Uint8Array(iv.length + ciphertextBuffer.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(ciphertextBuffer), iv.length);

    return arrayBufferToBase64(combined.buffer);
  } else {
    // Forge fallback (AES-GCM 256)
    const ivBytes = getRandomValues(new Uint8Array(12));
    const ivString = uint8ArrayToForgeString(ivBytes);
    
    const cipher = window.forge.cipher.createCipher('AES-GCM', key);
    cipher.start({ iv: ivString });
    cipher.update(window.forge.util.createBuffer(plainText, 'utf8'));
    cipher.finish();
    
    const ciphertextString = cipher.output.getBytes();
    const tagString = cipher.mode.tag.getBytes(); // 16 bytes auth tag
    
    const ivLength = ivBytes.length; // 12
    const cipherLength = ciphertextString.length;
    const tagLength = tagString.length; // 16
    
    const combined = new Uint8Array(ivLength + cipherLength + tagLength);
    combined.set(ivBytes, 0);
    combined.set(forgeStringToUint8Array(ciphertextString), ivLength);
    combined.set(forgeStringToUint8Array(tagString), ivLength + cipherLength);
    
    return arrayBufferToBase64(combined.buffer);
  }
}

/**
 * Decrypt ciphertext for a specific user.
 */
async function decryptForUser(ciphertextBase64, username, password) {
  try {
    const key = await deriveUserKey(username, password);
    const combinedBuffer = base64ToArrayBuffer(ciphertextBase64);
    const combinedBytes = new Uint8Array(combinedBuffer);
    
    const iv = combinedBytes.slice(0, 12);
    const ciphertext = combinedBytes.slice(12);
    
    if (useNativeCrypto) {
      const decryptedBuffer = await window.crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv: iv
        },
        key,
        ciphertext.buffer
      );
      
      const decoder = new TextDecoder();
      return decoder.decode(decryptedBuffer);
    } else {
      // Forge fallback
      const ivString = uint8ArrayToForgeString(iv);
      
      // Separate ciphertext and tag (tag is the last 16 bytes)
      const cipherLength = ciphertext.length - 16;
      if (cipherLength < 0) {
        throw new Error("Invalid ciphertext structure.");
      }
      const rawCiphertext = ciphertext.slice(0, cipherLength);
      const tag = ciphertext.slice(cipherLength);
      
      const ciphertextString = uint8ArrayToForgeString(rawCiphertext);
      const tagString = uint8ArrayToForgeString(tag);
      
      const decipher = window.forge.cipher.createDecipher('AES-GCM', key);
      decipher.start({
        iv: ivString,
        tag: window.forge.util.createBuffer(tagString)
      });
      decipher.update(window.forge.util.createBuffer(ciphertextString));
      const pass = decipher.finish();
      
      if (pass) {
        return decipher.output.toString('utf8');
      } else {
        throw new Error("Decryption failed. Authentication tag mismatch.");
      }
    }
  } catch (error) {
    throw new Error("Decryption failed. Incorrect credentials.");
  }
}

/**
 * Register a new user profile with password.
 * Also syncs salt + cipher to server for cross-device login support.
 */
async function registerUser(username, password) {
  if (userExists(username)) {
    throw new Error("該帳號名稱已被註冊！");
  }
  
  // Check if username already exists on server (prevent overwriting another device's account)
  try {
    const metaUrl = `${getServerBaseUrl()}/api/load_user_meta?username=${encodeURIComponent(username)}`;
    const res = await fetch(metaUrl);
    if (res.ok) {
      const existingMeta = await res.json().catch(() => null);
      // Allow re-registration if meta was cleared by recovery (has _cleared flag or null salt)
      const isClearedMeta = !existingMeta || existingMeta._cleared === true || !existingMeta.salt;
      if (!isClearedMeta) {
        throw new Error("該帳號名稱已被註冊！（伺服器上已有此帳號）");
      }
    }
  } catch (e) {
    // If error is our own "already registered" message, re-throw it
    if (e.message && e.message.includes('已被註冊')) throw e;
    // Otherwise, server check failed (offline/not running), continue with local registration
    console.warn("Server meta check failed, proceeding with local registration:", e);
  }
  
  // Encrypt verification cipher (this also creates the salt in localStorage)
  const cipherKey = `acc_u_${username}_cipher`;
  const verificationCipher = await encryptForUser("VERIFIED", username, password);
  localStorage.setItem(cipherKey, verificationCipher);
  
  // Add user to registry
  addToUserRegistry(username);
  
  // Sync salt + cipher to server for cross-device login support
  try {
    const saltKey = `acc_u_${username}_salt`;
    const saltBase64 = localStorage.getItem(saltKey);
    const metaPayload = JSON.stringify({ salt: saltBase64, cipher: verificationCipher });
    const saveUrl = `${getServerBaseUrl()}/api/save_user_meta?username=${encodeURIComponent(username)}`;
    await fetch(saveUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: metaPayload
    });
    console.log(`User meta for "${username}" synced to server.`);
  } catch (syncErr) {
    console.warn("Failed to sync user meta to server (will work locally only):", syncErr);
  }
}

/**
 * Verify user login.
 * If user not found locally, tries to fetch credentials from server (cross-device support).
 */
async function verifyUserLogin(username, password) {
  const saltKey = `acc_u_${username}_salt`;
  const cipherKey = `acc_u_${username}_cipher`;
  
  // Check if we have local credentials
  const hasLocalUser = userExists(username);
  const hasLocalSalt = !!localStorage.getItem(saltKey);
  const hasLocalCipher = !!localStorage.getItem(cipherKey);
  
  // If local credentials are missing, try to pull from server
  if (!hasLocalUser || !hasLocalSalt || !hasLocalCipher) {
    try {
      const metaUrl = `${getServerBaseUrl()}/api/load_user_meta?username=${encodeURIComponent(username)}`;
      const res = await fetch(metaUrl);
      if (res.ok) {
        const meta = await res.json();
        if (meta && meta.salt && meta.cipher) {
          // Restore credentials to localStorage
          localStorage.setItem(saltKey, meta.salt);
          localStorage.setItem(cipherKey, meta.cipher);
          addToUserRegistry(username);
          console.log(`Credentials for "${username}" restored from server.`);
        }
      }
    } catch (fetchErr) {
      console.warn("Could not fetch user meta from server:", fetchErr);
    }
  }
  
  // Now verify with local credentials (possibly just restored from server)
  if (!userExists(username)) return false;
  
  const testCipher = localStorage.getItem(cipherKey);
  if (!testCipher) return false;
  
  try {
    const decrypted = await decryptForUser(testCipher, username, password);
    return decrypted === "VERIFIED";
  } catch (error) {
    return false;
  }
}

/**
 * Remove a user completely.
 */
function deleteUser(username) {
  localStorage.removeItem(`acc_u_${username}_salt`);
  localStorage.removeItem(`acc_u_${username}_cipher`);
  localStorage.removeItem(`acc_u_${username}_data`);
  
  const registry = getUserRegistry().filter(u => u !== username);
  localStorage.setItem(USER_REGISTRY_KEY, JSON.stringify(registry));
}

/**
 * Emergency recovery: clears only the cipher + registry entry, KEEPS the salt.
 * After calling this, re-registering with the SAME password regenerates an identical key,
 * making all old encrypted data (which used the same salt+password) still decryptable.
 */
async function clearUserCredentialsForRecovery(username) {
  // Remove cipher and registry entry, but KEEP the salt so old data stays decryptable
  localStorage.removeItem(`acc_u_${username}_cipher`);
  
  const registry = getUserRegistry().filter(u => u !== username);
  localStorage.setItem(USER_REGISTRY_KEY, JSON.stringify(registry));
  
  // Also clear server meta so re-registration is allowed
  try {
    const metaUrl = `${getServerBaseUrl()}/api/load_user_meta?username=${encodeURIComponent(username)}`;
    const checkRes = await fetch(metaUrl);
    if (checkRes.ok) {
      // Delete by saving empty marker (server doesn't support DELETE; save empty to prevent 404 skip)
      await fetch(`${getServerBaseUrl()}/api/save_user_meta?username=${encodeURIComponent(username)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({ salt: null, cipher: null, _cleared: true })
      });
    }
  } catch (e) {
    console.warn('Could not clear server meta:', e);
  }
  
  console.log(`Recovery: cleared cipher+registry for "${username}". Salt preserved. Re-register to restore access.`);
}

// Export functions to global scope for SPA access
window.Security = {
  getUserRegistry,
  userExists,
  registerUser,
  verifyUserLogin,
  encryptForUser,
  decryptForUser,
  deleteUser,
  clearUserCredentialsForRecovery,
  getUserDataKey: (username) => `acc_u_${username}_data`
};
