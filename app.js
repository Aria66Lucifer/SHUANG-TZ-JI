/**
 * Core Application Controller for ?Á•???& ?≠Ó´∞??Ë≥???App.
 * Implements states, rendering engines, business logic, and security workflows.
 */

// --- Global App State ---
let AppState = {
  accounts: [],
  transactions: [],
  categories: {
    expense: ['?åËÑ§?', '??õÀ?, '?øÓê±?', '?≠Êó•??, '???', '?∑Ê?Êº±ÊÜ°ÓÆ?', '?àÊ???, '???', '?ñË???, '???', '?ΩÓ?Ó™?, '?ÆË??', '???', '?‰∫¶Ó???, 'È¢≤Ë???, '?ÆÓ??õÈ??, '???'],
    income: ['????', '???', '?ùÂ??', '???', '?Ó∏ÇÊ???, '???']
  },
  recurring: [],
  splitPlans: [],
  carrierBarcode: '',
  carrierPin: '',
  carrierInvoices: [],
  lastRecurringCheckDate: '',
  inventory: [],
  inventoryIcons: ['?ÂÆ?, '?Â¶?, '?ÂÆ?, '????, '???, '??', '??', '?Â∏?, '???, '???],
  recurringIcons: ['???, '???, '?Â°?', '????, '?ÓΩ?', '???, '???, '??', '???, '?Ó∂?],
  dreams: [],
  inventoryCategories: {
    '?≠Á≤π??†Ô??': {
      '?ÖÔÜØ????': ['?µÓ????, '?àÓ????, '?∞Ôê•Ó≤ÉÈä¥?, '??????, '?àÓü°???, '?≠Êö∏???, '??áÈÉ®', '?È§?', '?Ó©?', '??µÓ???],
      '???????': ['???????, '?ÖÁêø????, '?ùÓ?ÁµïÈ??, '???Ó≤ÑÈ??, '?Ó©ìÔ?', '?????, '?Ó©?', '?ùÓ?Áµ??],
      '???Ôπ???': ['???Ôπ??, '???ÔπùË??, '?êÓ????, '?†Óê¥????', '???ÔπùËù¨???, '?????],
      '?úÔÜ∞????': ['?Â≠?', '?Ó∞???, '?úÔÜ∞??ÊπßÓØ¨', '???ÔπùÁ?Ó∏??èÓ??', '?êÁ??≤Á?????, '?ÊΩÆÓè≠?úÔÜ∞???, '????øÔ??', '?®Ô???ÊπßÓØ¨'],
      '?àÓ?Ó®?Ó§?': ['?Ë©®‚ñ≥??, '??µÓØµ?àÓ?Ó®ñÈà≠?],
      '?±Ó´±????': ['?óÓ???, '???Ó≠?, '??ùÔ?', '???', '???', '?ΩÓ????, '?ΩÓ??ÖÈã°?],
      '?ù¬Ä?à‚ä•??íÓ???: ['???', '?ûÊ?Â±Ä?àÊ???, '??Óæ??üÔÄ¥Ë??],
      '??????': ['?‰∫?', '?éÊ??', '?ÊπßÓØ¨', '?‰∫?', '?âÔê¶?åÁ??, 'ok??, '?âÔê•?', '?Ó¶???],
      '?ΩÓ????: ['??ßÔÄ∏ÈùΩÓ≥?', '?®Ê???ΩÓ??', '??†Èõ≤?ΩÓ??', '??ùÔÄ∏ÈùΩÓ≥?'],
      '?Ó°???: ['?éÔê£?', '??´Ó?', '???', '?éÔêß?'],
      '?åÓ??': ['??, '?ªË??/?ú‚äø??, '?åËÑ´?/???', '???', '?Á•?', '?Ó∏ÖÊ????'],
      '?å‰π©????': ['?°Ó°º?', '???']
    },
    '?ÓÆçÁ??†Ô??': {
      '?ñË?????': ['?åÊΩ≠?', '?µÓ?Óπ?, '???', '?ΩÓ?ÓªªÊ?Ó∏?'],
      '?úÔÜ∞????': ['?ãÊöπ??â‚ä•???, '?ùÓ?ÁµïÈ??, '?éÓöß?', '??πÔä±??, '?®Ô???ÊπßÓØ¨'],
      '?°Ó?????': ['?éÓö¶???, '??ôÔ?', '?éÓöß??, '?éÓö•?', '?éÓöß?']
    }
  },
  inventoryLocations: ['?∞Ôº∑Ëº?, '?±Ó´±??, '?öÊ∏∏??, '?‰∫ôÊ?', '?????, '?†Ôíø?', 'È¢≤Ë??∂Êë∞?, '?Ë≥¢Óèº'],
  inventoryUnits: ['??, '??, '??, '??, '??, '??, '??, '??, '??, '??, '??, '??],
  
  // Customization Preferences
  logoStyle: 'draftA',
  fontStyle: 'modern',
  chartType: 'pie',
  themeMode: 'auto',
  buttonTheme: 'ocean',
  devMode: false,
  petTheme: 'none',
  appName: '?Ó©???- ?ÆÓ¶∂??????
};

// Auth and navigation variables
let currentUser = '';
let inMemoryDecryptionKey = ''; // Holds password for encryption/decryption in session
let activeTab = 'tab-calendar';
let selectedDate = new Date().toISOString().split('T')[0]; // Default is today
let currentCalendarDate = new Date(); // Month/Year currently viewed
let loginFailCount = 0; // Track consecutive login failures to show recovery option

// --- Auto-lock Timer ---
let lastActivityTime = Date.now();
function resetActivityTimer() {
  lastActivityTime = Date.now();
}
document.addEventListener('click', resetActivityTimer);
document.addEventListener('keypress', resetActivityTimer);
document.addEventListener('touchstart', resetActivityTimer);

setInterval(async () => {
  // If app is unlocked and inactive for more than 5 minutes (300,000 ms), auto-lock
  if (inMemoryDecryptionKey && (Date.now() - lastActivityTime > 300000)) {
    console.log("App inactive for 5 minutes. Auto-locking...");
    lockApp();
  }
}, 30000);

// --- Initialization ---
window.addEventListener('DOMContentLoaded', async () => {
  setupAppNavigation();
  initFormEventListeners();
  
  // Populate day selectors 1-31
  let dayOptionsHtml = '';
  for(let i=1; i<=31; i++) {
    dayOptionsHtml += `<option value="${i}">${i}??/option>`;
  }
  document.querySelectorAll('.day-selector-1-31').forEach(select => {
    select.innerHTML = dayOptionsHtml;
  });
  
  // Prefill remembered username
  const remembered = localStorage.getItem('auth_remembered_user');
  if (remembered) {
    document.getElementById('auth-username').value = remembered;
    document.getElementById('auth-remember').checked = true;
  }
  
  // Startup: clean up any non-authorized accounts from local registry
  // Only keep 'aria_66_lucifer' (other accounts are removed until multi-user is officially opened)
  _cleanupUnauthorizedAccounts();
  
  // Render default logo
  renderAppLogo();
  showLockScreen();
});

// Remove any accounts from localStorage registry that aren't aria_66_lucifer
function _cleanupUnauthorizedAccounts() {
  const AUTHORIZED_USERS = ['aria_66_lucifer'];
  const registry = (window.Security && window.Security.getUserRegistry) ? window.Security.getUserRegistry() : [];
  const cleaned = registry.filter(u => AUTHORIZED_USERS.includes(u));
  if (cleaned.length !== registry.length) {
    // Remove unauthorized users' local data
    registry.forEach(u => {
      if (!AUTHORIZED_USERS.includes(u)) {
        localStorage.removeItem(`acc_u_${u}_salt`);
        localStorage.removeItem(`acc_u_${u}_cipher`);
        localStorage.removeItem(`acc_u_${u}_data`);
        console.log(`Removed unauthorized local account: ${u}`);
      }
    });
    localStorage.setItem('accounting_user_registry', JSON.stringify(cleaned));
  }
}

// --- Tab Navigation Setup ---
function setupAppNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const tabId = item.getAttribute('data-tab');
      switchTab(tabId);
    });
  });
}

function switchTab(tabId) {
  activeTab = tabId;
  
  // Update Navigation Active State
  document.querySelectorAll('.nav-item').forEach(el => {
    if (el.getAttribute('data-tab') === tabId) {
      el.classList.add('active');
    } else {
      el.classList.remove('active');
    }
  });

  // Show Active Tab View
  document.querySelectorAll('.tab-view').forEach(view => {
    if (view.id === tabId) {
      view.classList.add('active');
    } else {
      view.classList.remove('active');
    }
  });

  // Switch Right Panel Content
  const rightPanelSections = [
    'right-panel-calendar', 'right-panel-accounts', 'right-panel-inventory',
    'right-panel-recurring', 'right-panel-split'
  ];
  
  let targetRightPanel = 'right-panel-calendar'; // default
  if (tabId === 'tab-accounts') targetRightPanel = 'right-panel-accounts';
  if (tabId === 'tab-inventory') targetRightPanel = 'right-panel-inventory';
  if (tabId === 'tab-recurring') targetRightPanel = 'right-panel-recurring';
  if (tabId === 'tab-split') targetRightPanel = 'right-panel-split';

  rightPanelSections.forEach(panelId => {
    const el = document.getElementById(panelId);
    if (el) {
      if (panelId === targetRightPanel) {
        el.style.display = 'flex';
      } else {
        el.style.display = 'none';
      }
    }
  });

  // Render content depending on tab
  if (tabId === 'tab-calendar') {
    renderCalendar();
    renderDailyLedger();
  } else if (tabId === 'tab-accounts') {
    renderAccounts();
  } else if (tabId === 'tab-recurring') {
    renderRecurring();
  } else if (tabId === 'tab-inventory') {
    renderInventory();
  } else if (tabId === 'tab-split') {
    renderSplitPlans();
  } else if (tabId === 'tab-dream') {
    renderDreamList();
  } else if (tabId === 'tab-carrier') {
    renderCarrierInvoices();
  } else if (tabId === 'tab-categories') {
    renderCategories();
  }
  
  // Always update the right side panel estimates & alerts
  updateRightPanel();
}

// --- Multi-User Login / Register Controllers ---
function switchAuthTab(mode) {
  document.getElementById('auth-mode').value = mode;
  const loginTab = document.getElementById('auth-tab-login');
  const registerTab = document.getElementById('auth-tab-register');
  const submitBtn = document.getElementById('auth-submit-btn');
  const subtitle = document.getElementById('lock-subtitle');

  if (mode === 'login') {
    loginTab.classList.add('active');
    registerTab.classList.remove('active');
    submitBtn.innerText = '?È§ÉÔÖØ?∞Ôê£?≤Êí£?ÆÓØ±';
    subtitle.innerText = '?¢Ô???‰∫ôËë£?Ó∏??ñÔ???ñ´??????Ó∫???ñÆÓØ?;
    subtitle.style.color = 'var(--text-secondary)';
  } else {
    loginTab.classList.remove('active');
    registerTab.classList.add('active');
    submitBtn.innerText = '?ÆÈ?????ë£??;
    subtitle.innerText = '?ÆÈ??????????ÊπîÓ??øÓ∞¨Óæ?????çÓØµ?Ó∫?????¢Ô???πÔÜ≤??ÔΩ?';
    subtitle.style.color = 'var(--text-secondary)';
  }
}

function showLockScreen() {
  document.body.classList.add('locked-body');
  document.getElementById('lock-screen').style.display = 'flex';
  switchAuthTab('login');
  renderAppLogo();
}

function lockApp() {
  inMemoryDecryptionKey = '';
  currentUser = '';
  showLockScreen();
}

async function handleAuthSubmit(event) {
  event.preventDefault();
  
  const mode = document.getElementById('auth-mode').value;
  const username = document.getElementById('auth-username').value.trim().toLowerCase();
  const password = document.getElementById('auth-password').value;
  const remember = document.getElementById('auth-remember').checked;
  const lockBox = document.querySelector('.lock-box');

  if (!username || !password) return;

  if (mode === 'register') {
    // Registration Flow
    try {
      if (window.Security.userExists(username)) {
        alert("?ÆÈ???≠Ê???óÓ´≥Â∫úÊí£???åËÑ∞?§ÈñÆÈ§???);
        return;
      }
      
      await window.Security.registerUser(username, password);
      
      // Initialize default data database encrypted with user password
      currentUser = username;
      inMemoryDecryptionKey = password;
      createDefaultDatabase();
      await saveStateToStorage();
      
      alert(`??îæ? "${username}" ?ÆÈ??????óÓºªÊ≠?ÁÆ∏Ó?????È§ÉÔÖØ?ÓΩ?;
      
      if (remember) {
        localStorage.setItem('auth_remembered_user', username);
      } else {
        localStorage.removeItem('auth_remembered_user');
      }
      
      loginFailCount = 0;
      unlockApp();
    } catch (e) {
      alert("?ÆÈ???Á≤πÔ??? + e.message);
    }
  } else {
    // Login Flow
    const success = await window.Security.verifyUserLogin(username, password);
    if (success) {
      currentUser = username;
      inMemoryDecryptionKey = password;
      loginFailCount = 0;
      
      // Hide recovery hint on success
      const hint = document.getElementById('auth-recovery-hint');
      if (hint) hint.style.display = 'none';
      
      try {
        await loadStateFromStorage();
        
        if (remember) {
          localStorage.setItem('auth_remembered_user', username);
        } else {
          localStorage.removeItem('auth_remembered_user');
        }
        
        unlockApp();
      } catch (err) {
        const reset = confirm("?àÔã™?????≠Ê???óÓººÓæ??íÁø∞?Ó°ºÓèª?Ë≥¢Ê??Ó∫???õÔ??§Êñπ????•¬Ä?ÓΩ±n\n?¢Ô????¨Ó??¨Óºº?????•¬Ä??íÁø∞?Ó¢??ùË???ù°?ùÔÖ≤????õÁ???Á©?\n?óÔ?Ëø????†Ôã™??õÁ?Â∫úÊí£??????§ÓØ±????Ó©?");
        if (reset) {
          localStorage.removeItem(window.Security.getUserDataKey(currentUser));
          createDefaultDatabase();
          await saveStateToStorage();
          if (remember) {
            localStorage.setItem('auth_remembered_user', username);
          }
          unlockApp();
        }
      }
    } else {
      // Login failed
      loginFailCount++;
      lockBox.classList.add('shake');
      document.getElementById('lock-subtitle').innerText = '??îæ??Ó°???ΩÆ?ÑÈö§Ê≠??¢Ôï°???óÊ???;
      document.getElementById('lock-subtitle').style.color = 'var(--color-red)';
      setTimeout(() => {
        lockBox.classList.remove('shake');
      }, 400);
      
      // Show recovery hint after 2 consecutive failures
      if (loginFailCount >= 2) {
        const hint = document.getElementById('auth-recovery-hint');
        if (hint) hint.style.display = 'block';
      }
    }
  }
}

// Emergency account recovery: clears cipher + registry entry, keeps salt intact
// After this, user can re-register with the SAME password and all data remains decryptable
async function handleAccountRecovery() {
  const username = document.getElementById('auth-username').value.trim().toLowerCase();
  if (!username) {
    alert('?¢Ô??????Â≠µ‚ÄµÊ??•Ó???íËë£?Ó∏??îÊ˘Î???óÓ??µÔóæ?????∞Ó´Æ??);
    return;
  }
  
  const confirmed = confirm(
    `?Ó∫? ??òÓ??¨Óºª??È§ÉÔÖØ??? (?ΩÓ???????\n\n??îæ???{username}\n\n` +
    `?íÓ????Ω‚Ö°?∞Ó´∞???Ω≠Ëø§Ëù£Á∂??øÔ??ÇËùØ???ÊπßÔ??∑Á≤π?ÑÈö§Ê≠???™Ô???ê¬Ä?¥Ê???∏Áø∞?Ó°æÓû™??©ª?ÓΩ±n` +
    `?áÊ???Ë≥??úÔÜ≥Ó®??????ìÓØ±????ÖÔê≠??øÔ?Óæ?????îæ??Ó©??∞Ôó∫?≤ÈùΩÓ≥??ÓΩ±n\n` +
    `????∫Ô???¢Ô????∑¬Ä?ªÓ??Ó∏ÇÓØ±????????Ω¶????ÓÆçÔ???ΩÈ???ÅÓ???îæ?????êÊó•????????∞Ó´∫???≥Óèª?Ôº∑Â???????Ó©??Ó°∫¬ÄÓΩ±n\n` +
    `?????¨ÓºΩ?±Ëù•???óÓ?
  );
  
  if (!confirmed) return;
  
  try {
    await window.Security.clearUserCredentialsForRecovery(username);
    
    // Switch to register tab and pre-fill username
    switchAuthTab('register');
    document.getElementById('auth-username').value = username;
    document.getElementById('auth-password').value = '';
    document.getElementById('auth-password').focus();
    
    document.getElementById('lock-subtitle').innerText = '????åËÑ∞?æËù¨ÓΩ??¢Ô???‰∫§Ó?????™Ô????ΩÆ??????å¬Ä?ΩÈ???øË??¨Óºª???ñË??Ôº∑Â??àÔã™?';
    document.getElementById('lock-subtitle').style.color = 'var(--color-primary, #00F2FE)';
    
    // Rename register button temporarily
    const submitBtn = document.getElementById('auth-submit-btn');
    submitBtn.innerText = '?∞Ôóª???òÓ??¨Óºª?';
    
    // Hide recovery hint
    const hint = document.getElementById('auth-recovery-hint');
    if (hint) hint.style.display = 'none';
    loginFailCount = 0;
    
  } catch (e) {
    alert('??ôËî≠????ùÂ?Ó®?Ó∏ÖÔ??§Ê≠π?' + e.message);
  }
}

function unlockApp() {
  document.body.classList.remove('locked-body');
  document.getElementById('lock-screen').style.display = 'none';
  
  // Apply visual settings preferences
  applyFontStyle(AppState.fontStyle || 'modern');
  renderAppLogo();
  updateRightPanel();
  
  // Trigger auto recurring check
  processRecurringTransactions();
  // Switch to default tab
  switchTab('tab-calendar');
}

// --- Dynamic Logo Customizer (Draft Choices) ---
const LOGO_SVGS = {
  draftA: `
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      <defs>
        <linearGradient id="logoGradA" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#10B981" />
          <stop offset="100%" stop-color="#3B82F6" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="42" stroke="url(#logoGradA)" stroke-width="6" fill="none" opacity="0.3" />
      <circle cx="50" cy="50" r="35" stroke="url(#logoGradA)" stroke-width="2" stroke-dasharray="4 6" fill="none" />
      <circle cx="50" cy="50" r="26" fill="url(#logoGradA)" />
      <text x="50%" y="64%" font-family="Outfit, sans-serif" font-size="38" font-weight="900" fill="#FFFFFF" text-anchor="middle">$</text>
    </svg>
  `,
  draftB: `
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      <defs>
        <linearGradient id="logoGradB" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#6366F1" />
          <stop offset="100%" stop-color="#8B5CF6" />
        </linearGradient>
      </defs>
      <!-- Overlapping card shapes -->
      <rect x="18" y="28" width="50" height="34" rx="8" fill="url(#logoGradB)" opacity="0.6" stroke="rgba(255,255,255,0.2)" stroke-width="1.5" />
      <rect x="32" y="38" width="50" height="34" rx="8" fill="url(#logoGradB)" stroke="rgba(255,255,255,0.4)" stroke-width="1.5" />
      <!-- Small Chip detail -->
      <rect x="40" y="44" width="10" height="8" rx="2" fill="#F59E0B" />
      <!-- Arrow loop -->
      <path d="M72,25 C62,15 42,15 32,25" fill="none" stroke="#00F2FE" stroke-width="3" stroke-linecap="round" />
      <path d="M28,75 C38,85 58,85 68,75" fill="none" stroke="#00F2FE" stroke-width="3" stroke-linecap="round" />
    </svg>
  `,
  draftC: `
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      <defs>
        <linearGradient id="logoGradC" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FF5B94" />
          <stop offset="100%" stop-color="#FF0055" />
        </linearGradient>
      </defs>
      <!-- Hexagonal / Shield shape -->
      <polygon points="50,10 85,30 85,70 50,90 15,70 15,30" fill="none" stroke="url(#logoGradC)" stroke-width="4" />
      <!-- Intersecting M & S Letters -->
      <text x="50%" y="58%" font-family="Outfit, sans-serif" font-size="34" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="-2">M/S</text>
      <!-- Outer small dot -->
      <circle cx="50" cy="50" r="45" stroke="rgba(255,255,255,0.1)" stroke-width="1" fill="none" />
    </svg>
  `
};

function renderAppLogo() {
  const chosenStyle = AppState.logoStyle || 'draftA';
  const logoSvg = LOGO_SVGS[chosenStyle] || LOGO_SVGS.draftA;
  
  const displayLogin = document.getElementById('app-logo-display');
  const displaySidebar = document.getElementById('sidebar-logo-display');
  
  if (displayLogin) displayLogin.innerHTML = logoSvg;
  if (displaySidebar) displaySidebar.innerHTML = logoSvg;
}

async function changeLogoStyle(styleId) {
  AppState.logoStyle = styleId;
  await saveStateToStorage();
  
  // Update UI active buttons in settings
  const options = ['draftA', 'draftB', 'draftC'];
  options.forEach(opt => {
    const btn = document.getElementById(`btn-logo-${opt}`);
    if (btn) {
      if (opt === styleId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    }
  });

  renderAppLogo();
}

// --- Dynamic Font Customizer ---
function applyFontStyle(fontId) {
  document.body.classList.remove('font-rounded', 'font-elegant', 'font-geek');
  if (fontId !== 'modern') {
    document.body.classList.add(`font-${fontId}`);
  }
}

async function changeFontStyle(fontId) {
  AppState.fontStyle = fontId;
  await saveStateToStorage();

  // Update UI active buttons in settings
  const options = ['modern', 'rounded', 'elegant', 'geek'];
  options.forEach(opt => {
    const btn = document.getElementById(`btn-font-${opt}`);
    if (btn) {
      if (opt === fontId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    }
  });

  applyFontStyle(fontId);
}

// --- Dynamic Theme Customizer ---
let systemThemeMediaQuery = window.matchMedia('(prefers-color-scheme: light)');

function handleSystemThemeChange(e) {
  if (AppState.themeMode === 'auto') {
    if (e.matches) {
      document.documentElement.classList.add('theme-light');
    } else {
      document.documentElement.classList.remove('theme-light');
    }
  }
}
systemThemeMediaQuery.addEventListener('change', handleSystemThemeChange);

function applyThemeMode(themeMode) {
  document.documentElement.classList.remove('theme-light');
  if (themeMode === 'light') {
    document.documentElement.classList.add('theme-light');
  } else if (themeMode === 'auto') {
    if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      document.documentElement.classList.add('theme-light');
    }
  }
}

async function changeThemeMode(themeMode) {
  AppState.themeMode = themeMode;
  await saveStateToStorage();
  localStorage.setItem('app_global_theme', themeMode);

  const options = ['dark', 'light', 'auto'];
  options.forEach(opt => {
    const btn = document.getElementById(`btn-theme-${opt}`);
    if (btn) {
      if (opt === themeMode) btn.classList.add('active');
      else btn.classList.remove('active');
    }
  });

  applyThemeMode(themeMode);
}

async function changeButtonTheme(themeId) {
  AppState.buttonTheme = themeId;
  await saveStateToStorage();
  
  const themes = ['ocean', 'emerald', 'purple', 'sunset', 'obsidian', 'sakura', 'forest', 'cyberpunk'];
  themes.forEach(t => {
    document.documentElement.classList.remove(`btn-theme-${t}`);
  });
  document.documentElement.classList.add(`btn-theme-${themeId}`);
  
  themes.forEach(t => {
    const btn = document.getElementById(`btn-color-${t}`);
    if (btn) {
      if (t === themeId) btn.classList.add('active');
      else btn.classList.remove('active');
    }
  });
}

// --- Dynamic App Name Customizer ---
function applyAppName() {
  const sidebarBrand = document.querySelector('.brand-name');
  if (sidebarBrand) sidebarBrand.innerText = '?Ó©???;
  const lockTitle = document.querySelector('.lock-title');
  if (lockTitle) lockTitle.innerText = '?Ó©???- ?ÆÓ¶∂??????;
  document.title = '?Ó©???- ?ÆÓ¶∂??????;
}

async function changeAppName(name) {
  // Hardcoded
}

function saveCustomAppName() {
  // Hardcoded
}

// --- Sidebar Toggler ---
function toggleSidebar() {
  const container = document.getElementById('app-container');
  if (container) {
    container.classList.toggle('sidebar-collapsed');
    const isCollapsed = container.classList.contains('sidebar-collapsed');
    localStorage.setItem('sidebar_collapsed_pref', isCollapsed ? 'true' : 'false');
  }
}

// --- Font/Logo pref triggers on load ---
function syncVisualPreferencesUI() {
  // Sync Logo Setting buttons
  const logoStyle = AppState.logoStyle || 'draftA';
  ['draftA', 'draftB', 'draftC'].forEach(opt => {
    const btn = document.getElementById(`btn-logo-${opt}`);
    if (btn) {
      if (opt === logoStyle) btn.classList.add('active');
      else btn.classList.remove('active');
    }
  });

  // Sync Font Setting buttons
  const fontStyle = AppState.fontStyle || 'modern';
  ['modern', 'rounded', 'elegant', 'geek'].forEach(opt => {
    const btn = document.getElementById(`btn-font-${opt}`);
    if (btn) {
      if (opt === fontStyle) btn.classList.add('active');
      else btn.classList.remove('active');
    }
  });

  // Sync Theme Setting buttons
  const themeMode = AppState.themeMode || 'auto';
  ['dark', 'light', 'auto'].forEach(opt => {
    const btn = document.getElementById(`btn-theme-${opt}`);
    if (btn) {
      if (opt === themeMode) btn.classList.add('active');
      else btn.classList.remove('active');
    }
  });
  applyThemeMode(themeMode);

  // Sync Button Theme Setting buttons
  const buttonTheme = AppState.buttonTheme || 'ocean';
  const buttonThemes = ['ocean', 'emerald', 'purple', 'sunset', 'obsidian', 'sakura', 'forest', 'cyberpunk'];
  buttonThemes.forEach(t => {
    const btn = document.getElementById(`btn-color-${t}`);
    if (btn) {
      if (t === buttonTheme) btn.classList.add('active');
      else btn.classList.remove('active');
    }
    document.documentElement.classList.remove(`btn-theme-${t}`);
  });
  document.documentElement.classList.add(`btn-theme-${buttonTheme}`);

  // Hardcode App Name (Not customizable)
  applyAppName();

  // Apply CSS font
  applyFontStyle(fontStyle);
  renderAppLogo();

  // Sync Dev Mode
  updateDevModeVisibility();

  // Sync Pet Theme
  updatePetThemeUI();
  
  // Sync Settlement Day
  const settleDaySelect = document.getElementById('setting-settlement-day');
  if (settleDaySelect) {
    settleDaySelect.value = AppState.settlementDay || 1;
  }
}

async function saveSettlementDay() {
  const select = document.getElementById('setting-settlement-day');
  if (select) {
    AppState.settlementDay = Number(select.value);
    await saveStateToStorage();
    renderAccountsStatistics(); // Update the right panel immediately
  }
}



async function changeDevMode(enabled) {
  AppState.devMode = enabled;
  await saveStateToStorage();
  updateDevModeVisibility();
}

function updateDevModeVisibility() {
  const enabled = AppState.devMode || false;
  
  const onBtn = document.getElementById('btn-dev-on');
  const offBtn = document.getElementById('btn-dev-off');
  if (onBtn && offBtn) {
    if (enabled) {
      onBtn.classList.add('active');
      offBtn.classList.remove('active');
    } else {
      onBtn.classList.remove('active');
      offBtn.classList.add('active');
    }
  }

  const carrierSim = document.getElementById('carrier-simulator-section');
  if (carrierSim) {
    carrierSim.style.display = enabled ? 'flex' : 'none';
  }
  
  const settingsNotif = document.getElementById('settings-dev-notification-section');
  if (settingsNotif) {
    settingsNotif.style.display = enabled ? 'block' : 'none';
  }
  
  const qrMockBtn = document.getElementById('qr-mock-buttons-section');
  if (qrMockBtn) {
    qrMockBtn.style.display = enabled ? 'block' : 'none';
  }
}

async function changePetTheme(theme) {
  AppState.petTheme = theme;
  await saveStateToStorage();
  updatePetThemeUI();
}

function getThemeEmoji(theme) {
  const map = {
    'cat': '???, 'dog': '???, 'rabbit': '???,
    'zodiac-rat': '???, 'zodiac-ox': '???, 'zodiac-tiger': '???, 'zodiac-rabbit': '???,
    'zodiac-dragon': '???, 'zodiac-snake': '??', 'zodiac-horse': '???, 'zodiac-goat': '??',
    'zodiac-monkey': '???, 'zodiac-rooster': '??', 'zodiac-dog': '???, 'zodiac-pig': '???,
    'const-aries': '??, 'const-taurus': '??, 'const-gemini': '??, 'const-cancer': '??,
    'const-leo': '??, 'const-virgo': '??, 'const-libra': '??, 'const-scorpio': '??,
    'const-sagittarius': '??, 'const-capricorn': '??, 'const-aquarius': '??, 'const-pisces': '??
  };
  return map[theme] || '';
}

function getThemeWatermark(theme) {
  if (theme === 'cat') return '?????????;
  if (theme === 'dog') return '?????????;
  if (theme === 'rabbit') return '?????????;
  
  const emoji = getThemeEmoji(theme);
  if (emoji) {
    return `??${emoji} ???
  }
  return '';
}

function getMascotSvg(theme, size = 80) {
  if (theme === 'cat') {
    return `
      <svg class="minimalist-cat" viewBox="0 0 100 100" width="${size}" height="${size}">
        <g stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <!-- Minimalist continuous line cat -->
          <path d="M30,50 Q25,30 35,20 Q40,15 45,25 Q50,20 55,25 Q60,15 65,20 Q75,30 70,50 Q75,70 65,80 Q50,90 35,80 Q25,70 30,50 Z" />
          <!-- Squinty eyes -->
          <path d="M40,45 Q42,42 45,45 M55,45 Q58,42 60,45" />
          <!-- Cute nose -->
          <path d="M48,55 L50,57 L52,55 Z" fill="currentColor" />
          <!-- Whiskers -->
          <path d="M25,50 L35,52 M22,57 L34,57 M75,50 L65,52 M78,57 L66,57" />
        </g>
      </svg>
    `;
  }
  if (theme === 'dog') {
    return `
      <svg class="minimalist-dog" viewBox="0 0 100 100" width="${size}" height="${size}">
        <g stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <!-- Floppy ears dog -->
          <path d="M40,30 Q50,20 60,30 Q70,40 65,60 Q50,75 35,60 Q30,40 40,30 Z" />
          <path d="M38,35 Q20,30 25,60 Q30,65 35,55 M62,35 Q80,30 75,60 Q70,65 65,55" />
          <circle cx="43" cy="45" r="2" fill="currentColor" stroke="none" />
          <circle cx="57" cy="45" r="2" fill="currentColor" stroke="none" />
          <path d="M47,52 L50,55 L53,52 Z" fill="currentColor" />
          <path d="M50,55 V60 Q45,60 40,55 M50,60 Q55,60 60,55" />
        </g>
      </svg>
    `;
  }
  if (theme === 'rabbit') {
    return `
      <svg class="minimalist-rabbit" viewBox="0 0 100 100" width="${size}" height="${size}">
        <g stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <!-- Long ears rabbit -->
          <path d="M35,60 Q50,80 65,60 Q70,45 60,35 Q50,40 40,35 Q30,45 35,60 Z" />
          <path d="M42,36 Q35,5 45,25 M58,36 Q65,5 55,25" />
          <path d="M43,50 L45,50 M55,50 L57,50" />
          <path d="M50,55 V58 Q47,58 45,55 M50,58 Q53,58 55,55" />
        </g>
      </svg>
    `;
  }

  if (theme.startsWith('zodiac-')) {
    const emoji = getThemeEmoji(theme);
    return `
      <svg class="minimalist-zodiac" viewBox="0 0 100 100" width="${size}" height="${size}" style="overflow: visible;">
        <g style="transform-origin: 50px 50px; ${size < 50 ? '' : 'animation: wiggle-pig 2s infinite ease-in-out;'}">
          <text x="50" y="65" font-size="60" text-anchor="middle" style="user-select: none;">${emoji}</text>
        </g>
      </svg>
    `;
  }
  if (theme.startsWith('const-')) {
    const constPaths = {
      'const-aries': 'M 30 60 L 50 35 L 70 65',
      'const-taurus': 'M 35 65 L 45 45 L 65 40 L 75 60',
      'const-gemini': 'M 35 35 L 35 65 M 65 35 L 65 65 M 30 35 L 70 35 M 30 65 L 70 65',
      'const-cancer': 'M 40 40 L 60 40 M 60 40 L 50 60 M 50 60 L 40 40',
      'const-leo': 'M 70 35 L 50 45 L 35 35 L 45 65 L 65 65 L 70 35',
      'const-virgo': 'M 30 35 L 50 70 L 70 35 M 50 70 L 50 50 L 30 35',
      'const-libra': 'M 30 60 L 70 60 M 40 50 L 60 50 M 50 50 L 50 40 L 60 40',
      'const-scorpio': 'M 30 45 L 40 65 L 50 45 L 60 65 L 70 35',
      'const-sagittarius': 'M 35 65 L 65 35 M 50 35 L 65 35 L 65 50 M 35 65 L 45 65 M 35 65 L 35 55',
      'const-capricorn': 'M 35 65 L 50 35 L 65 65 L 50 55 L 35 65',
      'const-aquarius': 'M 30 45 L 40 35 L 50 45 L 60 35 L 70 45 M 30 65 L 40 55 L 50 65 L 60 55 L 70 65',
      'const-pisces': 'M 30 50 L 70 50 M 35 35 L 35 65 M 65 35 L 65 65'
    };
    
    const pathData = constPaths[theme] || 'M 30 50 L 70 50';
    const points = pathData.match(/\d+ \d+/g) || [];
    const starsHtml = Array.from(new Set(points)).map((pt, i) => {
      const [x, y] = pt.split(' ');
      const animDelay = (i * 0.2).toFixed(1);
      return `<circle cx="${x}" cy="${y}" r="2.5" fill="#FFF" style="${size < 50 ? '' : `animation: twinkle 1.5s infinite alternate ${animDelay}s;`}" />`;
    }).join('');

    return `
      <svg class="constellation-disk" viewBox="0 0 100 100" width="${size}" height="${size}" style="overflow: visible;">
        <defs>
          <radialGradient id="nebula-${theme}" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#4F46E5" stop-opacity="0.9"/>
            <stop offset="70%" stop-color="#7C3AED" stop-opacity="0.6"/>
            <stop offset="100%" stop-color="#0F172A" stop-opacity="0.9"/>
          </radialGradient>
        </defs>
        <style>
          @keyframes twinkle {
            0% { opacity: 0.3; transform: scale(0.8); }
            100% { opacity: 1; transform: scale(1.2); }
          }
        </style>
        <circle cx="50" cy="50" r="42" fill="url(#nebula-${theme})" stroke="#00F2FE" stroke-width="2" style="filter: drop-shadow(0 4px 10px rgba(0, 242, 254, 0.4));" />
        <circle cx="50" cy="50" r="38" fill="none" stroke="#00F2FE" stroke-width="0.8" stroke-dasharray="2 4" />
        <g style="transform-origin: 50px 50px;">
          <path d="${pathData}" fill="none" stroke="#00F2FE" stroke-width="1.5" stroke-dasharray="3 3" style="filter: drop-shadow(0 0 3px rgba(0, 242, 254, 0.8));" />
          ${starsHtml}
        </g>
      </svg>
    `;
  }
  return '';
}

function syncMascotDropdownsUI(theme) {
  const typeSelector = document.getElementById('mascot-type-selector');
  const petSub = document.getElementById('mascot-sub-pet');
  const zodiacSub = document.getElementById('mascot-sub-zodiac');
  const constSub = document.getElementById('mascot-sub-constellation');
  
  if (!typeSelector) return;
  
  if (theme === 'none') {
    typeSelector.value = 'none';
    petSub.style.display = 'none';
    zodiacSub.style.display = 'none';
    constSub.style.display = 'none';
  } else if (theme.startsWith('zodiac-')) {
    typeSelector.value = 'zodiac';
    document.getElementById('mascot-select-zodiac').value = theme;
    petSub.style.display = 'none';
    zodiacSub.style.display = 'block';
    constSub.style.display = 'none';
  } else if (theme.startsWith('const-')) {
    typeSelector.value = 'constellation';
    document.getElementById('mascot-select-constellation').value = theme;
    petSub.style.display = 'none';
    zodiacSub.style.display = 'none';
    constSub.style.display = 'block';
  } else {
    // Default to pet for all other themes (cat, dog, rabbit, etc.)
    typeSelector.value = 'pet';
    document.getElementById('mascot-select-pet').value = theme;
    petSub.style.display = 'block';
    zodiacSub.style.display = 'none';
    constSub.style.display = 'none';
  }
}

function handleMascotTypeChange() {
  const type = document.getElementById('mascot-type-selector').value;
  let nextTheme = 'none';
  
  if (type === 'pet') {
    nextTheme = document.getElementById('mascot-select-pet').value || 'cat';
  } else if (type === 'zodiac') {
    nextTheme = document.getElementById('mascot-select-zodiac').value || 'zodiac-rat';
  } else if (type === 'constellation') {
    nextTheme = document.getElementById('mascot-select-constellation').value || 'const-gemini';
  }
  
  changePetTheme(nextTheme);
}

function handleMascotSelectionChange() {
  const type = document.getElementById('mascot-type-selector').value;
  let nextTheme = 'none';
  
  if (type === 'pet') {
    nextTheme = document.getElementById('mascot-select-pet').value;
  } else if (type === 'zodiac') {
    nextTheme = document.getElementById('mascot-select-zodiac').value;
  } else if (type === 'constellation') {
    nextTheme = document.getElementById('mascot-select-constellation').value;
  }
  
  changePetTheme(nextTheme);
}

function updatePetThemeUI() {
  const theme = AppState.petTheme || 'none';
  
  // Set class on body
  document.body.classList.remove('pet-cat', 'pet-dog', 'pet-rabbit', 'pet-horns', 'pet-halo', 'has-pet-theme');
  
  if (theme !== 'none') {
    document.body.classList.add('has-pet-theme');
    
    if (theme === 'cat') {
      document.body.classList.add('pet-cat');
    } else if (theme === 'dog') {
      document.body.classList.add('pet-dog');
    } else if (theme === 'rabbit' || theme === 'zodiac-rabbit') {
      document.body.classList.add('pet-rabbit');
    } else if (['zodiac-ox', 'zodiac-dragon', 'zodiac-goat', 'const-taurus', 'const-aries', 'const-capricorn'].includes(theme)) {
      document.body.classList.add('pet-horns');
    }
    
    if (theme.startsWith('const-')) {
      document.body.classList.add('pet-halo');
      // Inject SVG into halos
      document.querySelectorAll('.logo-decor-ear.halo').forEach(el => {
        el.innerHTML = getMascotSvg(theme, 40);
        el.style.opacity = '1';
      });
    } else {
      document.querySelectorAll('.logo-decor-ear.halo').forEach(el => el.innerHTML = '');
    }
    
    // Set CSS properties on body
    const emoji = getThemeEmoji(theme);
    const watermark = getThemeWatermark(theme);
    document.body.style.setProperty('--pet-emoji', `"${emoji}"`);
    document.body.style.setProperty('--pet-watermark', `"${watermark}"`);
  } else {
    document.body.style.setProperty('--pet-emoji', '""');
    document.body.style.setProperty('--pet-watermark', '""');
    document.querySelectorAll('.logo-decor-ear.halo').forEach(el => el.innerHTML = '');
  }
  
  // Sync selectors
  syncMascotDropdownsUI(theme);
  
  // Trigger calendar ledger re-render to update empty state illustration or header mascot icon
  const container = document.getElementById('daily-ledger-list');
  if (container) {
    renderDailyLedger();
  }
}

// --- Data Storage Layers ---
function createDefaultDatabase() {
  AppState = {
    accounts: [],
    transactions: [],
    categories: {
      expense: ['?åËÑ§?', '??õÀ?, '?ÖÔÜÆ?', '?≠Êó•??, '?Ó©ñÓæ•', '?∑Ê?Êº±ÊÜ°ÓÆ?', '?àÊ???, '???', '?ñË???, '?ΩÓ?Ó™?, '?ÆË??', '???', '?Ω‚????ìÁã°', 'È¢≤Ë???, '?ÆÓ??õÈ??, '???'],
      income: ['????', '???', '?ùÂ??', '???', '??ÄÂπ??ÖÔÖØ', '???']
    },
    recurring: [],
    splitPlans: [],
    inventory: [],
    carrierBarcode: '',
    carrierPin: '',
    carrierInvoices: [],
    lastRecurringCheckDate: new Date().toISOString().split('T')[0],
    
    // Default preferences
    logoStyle: 'draftA',
    fontStyle: 'modern',
    chartType: 'pie',
    themeMode: 'auto',
    appName: '?Ó∏ÉÂ??ÆÓ¶∂??,
    globalMonthlyBudget: 20000
  };
}

async function saveStateToStorage() {
  if (!inMemoryDecryptionKey || !currentUser) return;
  try {
    const rawText = JSON.stringify(AppState);
    const encryptedText = await window.Security.encryptForUser(rawText, currentUser, inMemoryDecryptionKey);
    localStorage.setItem(window.Security.getUserDataKey(currentUser), encryptedText);
    
    // Auto sync & backup to server
    try {
      if (window.db) {
        await window.db.collection('users').doc(currentUser).set({
          data: encryptedText,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
      } else {
        const serverUrl = window.getServerBaseUrl ? window.getServerBaseUrl() : 'http://localhost:8080';
        await fetch(`${serverUrl}/api/save?username=${encodeURIComponent(currentUser)}`, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain' },
          body: encryptedText
        });
      }
    } catch (e) {
      console.warn("Auto sync to server/Firebase failed:", e);
    }
  } catch (err) {
    console.error("Error saving state:", err);
  }
}

async function loadStateFromStorage() {
  if (!inMemoryDecryptionKey || !currentUser) return;
  
  let encryptedText = null;
  // Try to load from server or Firebase first
  try {
    if (window.db) {
      const docSnap = await window.db.collection('users').doc(currentUser).get();
      if (docSnap.exists) {
        encryptedText = docSnap.data().data;
        // Update local storage with Firebase version just in case
        localStorage.setItem(window.Security.getUserDataKey(currentUser), encryptedText);
      }
    } else {
      const serverUrl = window.getServerBaseUrl ? window.getServerBaseUrl() : 'http://localhost:8080';
      const res = await fetch(`${serverUrl}/api/load?username=${encodeURIComponent(currentUser)}`);
      if (res.ok) {
        encryptedText = await res.text();
        // Update local storage with server version just in case
        localStorage.setItem(window.Security.getUserDataKey(currentUser), encryptedText);
      }
    }
  } catch (e) {
    console.warn("Failed to load state from server/Firebase, falling back to local storage:", e);
  }

  // Fallback to local storage if server load fails or returns nothing
  if (!encryptedText) {
    encryptedText = localStorage.getItem(window.Security.getUserDataKey(currentUser));
  }
  
  if (encryptedText) {
    try {
      const decryptedText = await window.Security.decryptForUser(encryptedText, currentUser, inMemoryDecryptionKey);
      AppState = JSON.parse(decryptedText);
      
      // Repair logic for backward compatibility/missing properties
      if (!AppState.categories) {
        AppState.categories = {
          expense: ['?åËÑ§?', '??õÀ?, '?øÓê±?', '?≠Êó•??, '???', '?∑Ê?Êº±ÊÜ°ÓÆ?', '?àÊ???, '???', '?ñË???, '???', '?ΩÓ?Ó™?, '?ÆË??', '???', '?‰∫¶Ó???, 'È¢≤Ë???, '?ÆÓ??õÈ??, '???'],
          income: ['????', '???', '?ùÂ??', '???', '?Ó∏ÇÊ???, '???']
        };
      }
      if (!AppState.recurring) AppState.recurring = [];
      if (!AppState.splitPlans) AppState.splitPlans = [];
      if (!AppState.carrierInvoices) AppState.carrierInvoices = [];
      if (!AppState.logoStyle) AppState.logoStyle = 'draftA';
      if (!AppState.inventory) AppState.inventory = [];
      if (!AppState.inventoryIcons) AppState.inventoryIcons = ['?ÂÆ?, '?Â¶?, '?ÂÆ?, '????, '???, '??', '??', '?Â∏?, '???, '???];
      if (!AppState.recurringIcons) AppState.recurringIcons = ['???, '???, '?Â°?', '????, '?ÓΩ?', '???, '???, '??', '???, '?Ó∂?];
      if (!AppState.dreams) AppState.dreams = [];
      if (!AppState.inventoryCategories) {
        AppState.inventoryCategories = {
          '?≠Á≤π??†Ô??': {
            '?ÖÔÜØ????': ['?µÓ????, '?àÓ????, '?∞Ôê•Ó≤ÉÈä¥?, '??????, '?àÓü°???, '?≠Êö∏???, '??áÈÉ®', '?È§?', '?Ó©?', '??µÓ???],
            '???????': ['???????, '?ÖÁêø????, '?ùÓ?ÁµïÈ??, '???Ó≤ÑÈ??, '?Ó©ìÔ?', '?????, '?Ó©?', '?ùÓ?Áµ??],
            '???Ôπ???': ['???Ôπ??, '???ÔπùË??, '?êÓ????, '?†Óê¥????', '???ÔπùËù¨???, '?????],
            '?úÔÜ∞????': ['?Â≠?', '?Ó∞???, '?úÔÜ∞??ÊπßÓØ¨', '???ÔπùÁ?Ó∏??èÓ??', '?êÁ??≤Á?????, '?ÊΩÆÓè≠?úÔÜ∞???, '????øÔ??', '?®Ô???ÊπßÓØ¨'],
            '?àÓ?Ó®?Ó§?': ['?Ë©®‚ñ≥??, '??µÓØµ?àÓ?Ó®ñÈà≠?],
            '?±Ó´±????': ['?óÓ???, '???Ó≠?, '??ùÔ?', '???', '???', '?ΩÓ????, '?ΩÓ??ÖÈã°?],
            '?ù¬Ä?à‚ä•??íÓ???: ['???', '?ûÊ?Â±Ä?àÊ???, '??Óæ??üÔÄ¥Ë??],
            '??????': ['?‰∫?', '?éÊ??', '?ÊπßÓØ¨', '?‰∫?', '?âÔê¶?åÁ??, 'ok??, '?âÔê•?', '?Ó¶???],
            '?ΩÓ????: ['??ßÔÄ∏ÈùΩÓ≥?', '?®Ê???ΩÓ??', '??†Èõ≤?ΩÓ??', '??ùÔÄ∏ÈùΩÓ≥?'],
            '?Ó°???: ['?éÔê£?', '??´Ó?', '???', '?éÔêß?'],
            '?åÓ??': ['??, '?ªË??/?ú‚äø??, '?åËÑ´?/???', '???', '?Á•?', '?Ó∏ÖÊ????'],
            '?å‰π©????': ['?°Ó°º?', '???']
          },
          '?ÓÆçÁ??†Ô??': {
            '?ñË?????': ['?åÊΩ≠?', '?µÓ?Óπ?, '???', '?ΩÓ?ÓªªÊ?Ó∏?'],
            '?úÔÜ∞????': ['?ãÊöπ??â‚ä•???, '?ùÓ?ÁµïÈ??, '?éÓöß?', '??πÔä±??, '?®Ô???ÊπßÓØ¨'],
            '?°Ó?????': ['?éÓö¶???, '??ôÔ?', '?éÓöß??, '?éÓö•?', '?éÓöß?']
          }
        };
      }
      if (!AppState.fontStyle) AppState.fontStyle = 'modern';
      if (!AppState.chartType) AppState.chartType = 'pie';
      if (!AppState.themeMode) AppState.themeMode = 'auto';
      if (!AppState.buttonTheme) AppState.buttonTheme = 'ocean';
      if (AppState.devMode === undefined) AppState.devMode = false;
      if (AppState.petTheme === undefined) AppState.petTheme = 'none';
      if (AppState.globalMonthlyBudget === undefined) AppState.globalMonthlyBudget = 20000;
      if (!AppState.inventory) AppState.inventory = [];
      if (AppState.accounts) {
        AppState.accounts.forEach(acc => {
          if (acc.type === 'credit') {
            if (acc.warningThreshold === undefined) acc.warningThreshold = 5000;
          }
        });
      }
      AppState.appName = '?ôÂ?Ë®?App';
      
      // Sync styles immediately
      syncVisualPreferencesUI();
    } catch (e) {
      console.error("Failed to decrypt database:", e);
      throw e;
    }
  } else {
    createDefaultDatabase();
    await saveStateToStorage();
    syncVisualPreferencesUI();
  }
}

// --- Formatting Helpers (Accounting standard) ---
function formatAccounting(amount, currency = 'NT$') {
  const isNegative = amount < 0;
  const absVal = Math.abs(amount).toLocaleString('zh-TW', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  if (isNegative) {
    return `(${currency} ${absVal})`;
  }
  return `${currency} ${absVal}`;
}

// Render dynamic colored amount
function getAccountingSpan(amount, type) {
  const formatted = formatAccounting(amount);
  let colorClass = '';
  
  if (type === 'income' || amount > 0) {
    colorClass = 'income';
  } else if (type === 'expense' || amount < 0) {
    colorClass = 'expense';
  } else if (type === 'transfer') {
    colorClass = 'transfer';
  }
  
  return `<span class="ledger-amount ${colorClass}">${formatted}</span>`;
}

// --- Financial State Calculations ---
/**
 * Calculates current running balance for all accounts at a given date.
 * If targetDate is null, returns today's current running balances.
 */
function calculateBalancesAtDate(targetDate = null) {
  const balances = {};
  const creditSpent = {}; // Total spent in billing period

  // Initialize
  AppState.accounts.forEach(acc => {
    balances[acc.id] = {
      balance: Number(acc.initialBalance || 0),
      securitiesInvested: Number(acc.securitiesInvested || 0)
    };
    creditSpent[acc.id] = 0;
  });

  // Sort transactions by date (important for historical balances)
  const sortedTx = [...AppState.transactions].sort((a, b) => a.date.localeCompare(b.date));

  // Process ledger sequentially
  sortedTx.forEach(tx => {
    if (targetDate && tx.date > targetDate) return;

    let amount = Number(tx.amount);
    
    if (tx.type === 'expense' && tx.isInstallment) {
      const P = Number(tx.installmentPeriods) || 1;
      const type = tx.installmentType;
      const rate = Number(tx.installmentRate || 0);
      let totalInterest = 0;
      if (type === 'interest-bearing') {
        totalInterest = Math.round(amount * (rate / 100) * (P / 12));
      }
      amount = amount + totalInterest;
    }
    
    if (tx.type === 'income') {
      if (balances[tx.accountId]) {
        balances[tx.accountId].balance += amount;
      }
    } else if (tx.type === 'expense') {
      if (balances[tx.accountId]) {
        const acc = AppState.accounts.find(a => a.id === tx.accountId);
        if (acc && acc.type === 'credit') {
          // Spent increases on credit card
          balances[tx.accountId].balance += amount; // We model card balance as negative liability
          creditSpent[tx.accountId] += amount;
        } else {
          balances[tx.accountId].balance -= amount;
        }
      }
    } else if (tx.type === 'transfer') {
      // Source Account subtracts balance
      if (tx.accountId) {
        if (tx.accountId.endsWith('_invested')) {
          // Securities account invested funds transfer
          const rootSecId = tx.accountId.replace('_invested', '');
          if (balances[rootSecId]) {
            balances[rootSecId].securitiesInvested -= amount;
          }
        } else {
          const srcAcc = AppState.accounts.find(a => a.id === tx.accountId);
          if (srcAcc && srcAcc.type === 'credit') {
            balances[tx.accountId].balance += amount;
            creditSpent[tx.accountId] += amount;
          } else if (balances[tx.accountId]) {
            balances[tx.accountId].balance -= amount;
          }
        }
      }

      // Destination Account adds balance
      if (tx.destAccountId) {
        if (tx.destAccountId.endsWith('_invested')) {
          // Securities account invested funds transfer
          const rootSecId = tx.destAccountId.replace('_invested', '');
          if (balances[rootSecId]) {
            balances[rootSecId].securitiesInvested += amount;
          }
        } else {
          const destAcc = AppState.accounts.find(a => a.id === tx.destAccountId);
          if (destAcc && destAcc.type === 'credit') {
            // Paying off credit card (transfer to credit card decreases liability)
            balances[tx.destAccountId].balance -= amount;
            creditSpent[tx.destAccountId] -= amount;
          } else if (balances[tx.destAccountId]) {
            balances[tx.destAccountId].balance += amount;
          }
        }
      }
    }
  });

  return { balances, creditSpent };
}

// --- Credit Card Cycle and Installment Helpers ---
function getClippedDate(year, month, day, isEnd = false) {
  const lastDay = new Date(year, month + 1, 0).getDate();
  const safeDay = Math.min(day, lastDay);
  const d = new Date(year, month, safeDay);
  if (isEnd) {
    d.setHours(23, 59, 59, 999);
  } else {
    d.setHours(0, 0, 0, 0);
  }
  return d;
}

function getCardBillingCycle(card, refDate) {
  const B = Number(card.billingDay) || 10;
  const y = refDate.getFullYear();
  const m = refDate.getMonth();
  const d = refDate.getDate();

  // Determine the last day of this month
  const lastDayOfCurrentMonth = new Date(y, m + 1, 0).getDate();
  const effectiveB = Math.min(B, lastDayOfCurrentMonth);

  let startYear, startMonth, endYear, endMonth;

  if (d <= effectiveB) {
    endYear = y;
    endMonth = m;
    
    const prev = new Date(y, m - 1, 1);
    startYear = prev.getFullYear();
    startMonth = prev.getMonth();
  } else {
    const next = new Date(y, m + 1, 1);
    endYear = next.getFullYear();
    endMonth = next.getMonth();
    
    startYear = y;
    startMonth = m;
  }

  const startDate = getClippedDate(startYear, startMonth, B + 1, false);
  const endDate = getClippedDate(endYear, endMonth, B, true);

  return { startDate, endDate };
}

function getCashBillingCycle(acc, refDate) {
  const N = Number(acc.budgetResetDay) || 1;
  const y = refDate.getFullYear();
  const m = refDate.getMonth();
  const d = refDate.getDate();

  if (N === 1) {
    const startDate = new Date(y, m, 1, 0, 0, 0, 0);
    const endDate = new Date(y, m + 1, 0, 23, 59, 59, 999);
    return { startDate, endDate };
  }

  // Determine last day of this month
  const lastDayOfCurrentMonth = new Date(y, m + 1, 0).getDate();
  const effectiveN = Math.min(N, lastDayOfCurrentMonth);

  let startYear, startMonth, endYear, endMonth;

  if (d < effectiveN) {
    const prev = new Date(y, m - 1, 1);
    startYear = prev.getFullYear();
    startMonth = prev.getMonth();
    endYear = y;
    endMonth = m;
  } else {
    startYear = y;
    startMonth = m;
    const next = new Date(y, m + 1, 1);
    endYear = next.getFullYear();
    endMonth = next.getMonth();
  }

  const startDate = getClippedDate(startYear, startMonth, N, false);
  const endDate = getClippedDate(endYear, endMonth, N - 1, true);

  return { startDate, endDate };
}

function getInstallmentOccurrences(tx, card) {
  if (!tx.isInstallment || !tx.installmentPeriods || tx.installmentPeriods <= 1) {
    return [{
      period: 1,
      amount: Number(tx.amount),
      interest: 0,
      total: Number(tx.amount),
      date: tx.date
    }];
  }

  const P = Number(tx.installmentPeriods);
  const type = tx.installmentType;
  const rate = Number(tx.installmentRate || 0);
  const principal = Number(tx.amount);

  let monthlyPrincipal = Math.floor(principal / P);
  let monthlyInterest = 0;

  if (type === 'interest-bearing') {
    // Flat rate: Total Interest = Principal * (Annual Rate / 100) * (Periods / 12)
    // Interest Per Period = Total Interest / Periods
    const totalInterest = Math.round(principal * (rate / 100) * (P / 12));
    monthlyInterest = Math.round(totalInterest / P);
  }

  const occurrences = [];
  let principalSum = 0;
  let interestSum = 0;

  const purchaseDate = new Date(tx.date);

  for (let k = 1; k <= P; k++) {
    // Find the date for the k-th cycle
    const refDate = new Date(purchaseDate.getFullYear(), purchaseDate.getMonth() + k - 1, purchaseDate.getDate());
    const { endDate } = getCardBillingCycle(card, refDate);
    const dateStr = endDate.toISOString().split('T')[0];

    let pAmt = monthlyPrincipal;
    let iAmt = monthlyInterest;

    if (k === P) {
      pAmt = principal - principalSum;
      if (type === 'interest-bearing') {
        const totalInterestExpected = Math.round(principal * (rate / 100) * (P / 12));
        iAmt = totalInterestExpected - interestSum;
      }
    }

    principalSum += pAmt;
    interestSum += iAmt;

    occurrences.push({
      period: k,
      amount: pAmt,
      interest: iAmt,
      total: pAmt + iAmt,
      date: dateStr
    });
  }

  return occurrences;
}

function getCreditCardCycleStatus(card, refDate) {
  const { startDate, endDate } = getCardBillingCycle(card, refDate);
  
  let spent = 0;
  let repaid = 0;
  
  AppState.transactions.forEach(tx => {
    const txDate = new Date(tx.date);
    txDate.setHours(12, 0, 0, 0); // Safe mid-day comparison
    
    if (tx.accountId === card.id && tx.type === 'expense') {
      if (tx.isInstallment) {
        const occurrences = getInstallmentOccurrences(tx, card);
        occurrences.forEach(occ => {
          const occDate = new Date(occ.date);
          occDate.setHours(12, 0, 0, 0);
          if (occDate >= startDate && occDate <= endDate) {
            spent += occ.total;
          }
        });
      } else {
        if (txDate >= startDate && txDate <= endDate) {
          spent += Number(tx.amount);
        }
      }
    } else if (tx.destAccountId === card.id && tx.type === 'transfer') {
      // Repayments (transfer to card)
      if (txDate >= startDate && txDate <= endDate) {
        repaid += Number(tx.amount);
      }
    }
  });
  
  const limit = Number(card.creditLimit) || 100000;
  const availableLimit = limit - (spent - repaid);
  const warningThreshold = Number(card.warningThreshold) || 0;
  
  return {
    startDate,
    endDate,
    spent,
    repaid,
    netSpent: spent - repaid,
    availableLimit,
    isBelowThreshold: availableLimit <= warningThreshold
  };
}

// --- Credit Card Installment Form UI Helpers ---
function resetCcInstallmentFields() {
  document.getElementById('cc-installment-type').value = 'single';
  document.getElementById('cc-installment-periods').value = '3';
  document.getElementById('cc-installment-rate').value = '6.0';
  
  const typeBtns = document.querySelectorAll('#cc-installment-type-buttons button');
  typeBtns.forEach(btn => {
    if (btn.id === 'btn-cc-inst-single') btn.classList.add('active');
    else btn.classList.remove('active');
  });

  const periodBtns = document.querySelectorAll('#cc-installment-periods-buttons button');
  periodBtns.forEach(btn => {
    if (btn.id === 'btn-cc-period-3') btn.classList.add('active');
    else btn.classList.remove('active');
  });

  document.getElementById('cc-installment-periods-row').style.display = 'none';
  document.getElementById('cc-installment-rate-row').style.display = 'none';
  document.getElementById('cc-installment-preview').style.display = 'none';
  document.getElementById('cc-installment-preview').innerHTML = '';
}

function setCcInstallmentType(type) {
  document.getElementById('cc-installment-type').value = type;
  
  const buttons = document.querySelectorAll('#cc-installment-type-buttons button');
  buttons.forEach(btn => {
    const mapping = { 'single': 'btn-cc-inst-single', 'interest-free': 'btn-cc-inst-free', 'interest-bearing': 'btn-cc-inst-bearing' };
    if (btn.id === mapping[type]) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  updateCcInstallmentSubfields();
  calculateCcInstallmentPreview();
}

function setCcInstallmentPeriod(period) {
  document.getElementById('cc-installment-periods').value = period;
  
  const buttons = document.querySelectorAll('#cc-installment-periods-buttons button');
  buttons.forEach(btn => {
    if (btn.id === `btn-cc-period-${period}`) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  calculateCcInstallmentPreview();
}

function updateCcInstallmentSubfields() {
  const type = document.getElementById('cc-installment-type').value;
  const periodsRow = document.getElementById('cc-installment-periods-row');
  const rateRow = document.getElementById('cc-installment-rate-row');
  
  if (type === 'single') {
    periodsRow.style.display = 'none';
    rateRow.style.display = 'none';
  } else {
    periodsRow.style.display = 'block';
    rateRow.style.display = type === 'interest-bearing' ? 'block' : 'none';
  }
}

function checkShowCcInstallmentOptions() {
  const transType = document.getElementById('trans-type').value;
  const srcAccountId = document.getElementById('trans-account').value;
  const srcAcc = AppState.accounts.find(a => a.id === srcAccountId);
  
  const installmentGrp = document.getElementById('form-group-cc-installment');
  if (installmentGrp) {
    if (transType === 'expense' && srcAcc && srcAcc.type === 'credit') {
      installmentGrp.style.display = 'block';
      updateCcInstallmentSubfields();
      calculateCcInstallmentPreview();
    } else {
      installmentGrp.style.display = 'none';
    }
  }
}

let ccInstallmentTimeout = null;
function calculateCcInstallmentPreview() {
  clearTimeout(ccInstallmentTimeout);
  ccInstallmentTimeout = setTimeout(() => {
  const amount = Number(document.getElementById('trans-amount').value) || 0;
  const type = document.getElementById('cc-installment-type').value;
  const periods = Number(document.getElementById('cc-installment-periods').value) || 3;
  const rate = Number(document.getElementById('cc-installment-rate').value) || 0;
  const previewDiv = document.getElementById('cc-installment-preview');

  if (!previewDiv) return;

  if (amount <= 0 || type === 'single') {
    previewDiv.style.display = 'none';
    previewDiv.innerHTML = '';
    return;
  }

  previewDiv.style.display = 'block';
  let principalPerPeriod = Math.floor(amount / periods);
  let interestPerPeriod = 0;
  
  if (type === 'interest-bearing') {
    const totalInterest = Math.round(amount * (rate / 100) * (periods / 12));
    interestPerPeriod = Math.round(totalInterest / periods);
  }

  const firstTotal = principalPerPeriod + interestPerPeriod + (amount - principalPerPeriod * periods);
  const regularTotal = principalPerPeriod + interestPerPeriod;

  if (firstTotal !== regularTotal) {
    previewDiv.innerHTML = `
      <div style="line-height: 1.4;">
        ????∞Ë°£??óÓ´¥??Ó∏Ä???<strong>${formatAccounting(firstTotal)}</strong> (??†Â?????
        ?∫Ôóº??•Óê≤? <strong>${formatAccounting(regularTotal)}</strong>?óÔó∫??<strong>${periods}</strong> ?Ó∑ø¬Ä?
        ${type === 'interest-bearing' ? `<br>(????Ó∏ÅÔ???${formatAccounting(interestPerPeriod)}?óÔó∫???? ${rate}%)` : ''}
      </div>
    `;
  } else {
    previewDiv.innerHTML = `
      <div style="line-height: 1.4;">
        ????∞Ë°£??óÓ´±??Ó∏Ä???<strong>${formatAccounting(regularTotal)}</strong>?óÔó∫??<strong>${periods}</strong> ?Ó∑ø¬Ä?
        ${type === 'interest-bearing' ? `<br>(????Ó∏ÅÔ???${formatAccounting(interestPerPeriod)}?óÔó∫???? ${rate}%)` : ''}
      </div>
    `;
  }
}

// --- RENDER 1: Calendar View ---
function prevMonth() {
  currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
  renderCalendar();
}

function nextMonth() {
  currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
  renderCalendar();
}

function selectCalendarDay(dateStr) {
  selectedDate = dateStr;
  
  // Rerender Calendar to highlight active day
  renderCalendar();
  renderDailyLedger();
  updateRightPanel();
}

function renderCalendar() {
  const container = document.getElementById('calendar-grid-days');
  const monthYearLabel = document.getElementById('calendar-current-month-year');
  
  // Set month label
  const localeMonths = ['?ù¬Ä??, '?≠Ôóª?', '?ùÔê§?', '?ÓÆ?', '?≠Ó??', '???', '?ùÔÅ∂?', '???', '?ãÓ??', '?Óº?', '?Óº???, '?Óº???];
  monthYearLabel.innerText = `${currentCalendarDate.getFullYear()}??${localeMonths[currentCalendarDate.getMonth()]}`;

  container.innerHTML = '';
  
  // Render Day Labels (Sun - Sat)
  const daysLabels = ['??, '?ù¬Ä', '??, '??, '??, '??, '??];
  daysLabels.forEach(lbl => {
    const dayLabelEl = document.createElement('div');
    dayLabelEl.className = 'calendar-day-label';
    dayLabelEl.innerText = lbl;
    container.appendChild(dayLabelEl);
  });

  // Calculate start day of month and total days
  const year = currentCalendarDate.getFullYear();
  const month = currentCalendarDate.getMonth();
  
  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const prevMonthTotalDays = new Date(year, month, 0).getDate();

  // 1. Render previous month's trailing days
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const prevDayNum = prevMonthTotalDays - i;
    const prevMonthVal = month === 0 ? 11 : month - 1;
    const prevYearVal = month === 0 ? year - 1 : year;
    const dateStr = `${prevYearVal}-${String(prevMonthVal + 1).padStart(2, '0')}-${String(prevDayNum).padStart(2, '0')}`;
    
    createDayCell(container, prevDayNum, dateStr, true);
  }

  // 2. Render current month days
  for (let d = 1; d <= totalDays; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    createDayCell(container, d, dateStr, false);
  }

  // 3. Render next month's leading days to fill grid (6 rows * 7 days = 42 cells total)
  const totalCellsRendered = firstDayIndex + totalDays;
  const trailingCells = 42 - totalCellsRendered;
  for (let n = 1; n <= trailingCells; n++) {
    const nextMonthVal = month === 11 ? 0 : month + 1;
    const nextYearVal = month === 11 ? year + 1 : year;
    const dateStr = `${nextYearVal}-${String(nextMonthVal + 1).padStart(2, '0')}-${String(n).padStart(2, '0')}`;
    
    createDayCell(container, n, dateStr, true);
  }
}

function createDayCell(container, dayNum, dateStr, isOtherMonth) {
  const cell = document.createElement('div');
  cell.className = `calendar-day-cell ${isOtherMonth ? 'other-month' : ''}`;
  if (dateStr === selectedDate) {
    cell.classList.add('active');
  }
  
  cell.onclick = () => selectCalendarDay(dateStr);

  // Day Number
  const numEl = document.createElement('div');
  numEl.className = 'calendar-day-num';
  numEl.innerText = dayNum;
  cell.appendChild(numEl);

  // Check transactions for dot drawing
  const dayTx = AppState.transactions.filter(t => t.date === dateStr);
  const upcomingTx = getUpcomingForDate(dateStr);
  
  if (dayTx.length > 0 || upcomingTx.length > 0) {
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'calendar-dots';
    
    const hasIncome = dayTx.some(t => t.type === 'income');
    const hasExpense = dayTx.some(t => t.type === 'expense');
    const hasTransfer = dayTx.some(t => t.type === 'transfer');
    
    if (hasIncome) {
      const dot = document.createElement('div');
      dot.className = 'dot income';
      dotsContainer.appendChild(dot);
    }
    if (hasExpense) {
      const dot = document.createElement('div');
      dot.className = 'dot expense';
      dotsContainer.appendChild(dot);
    }
    if (hasTransfer) {
      const dot = document.createElement('div');
      dot.className = 'dot transfer';
      dotsContainer.appendChild(dot);
    }
    if (upcomingTx.length > 0) {
      const uniqueIcons = [...new Set(upcomingTx.map(t => t.icon || '?Ó∂?))];
      uniqueIcons.slice(0, 3).forEach(ic => {
        const dot = document.createElement('div');
        if (ic === '?Ó∂?) {
          dot.className = 'dot';
          dot.style.background = 'var(--color-purple)';
        } else {
          dot.style.fontSize = '12px';
          dot.style.lineHeight = '1';
          dot.style.margin = '0 -1px';
          dot.innerText = ic;
        }
        dotsContainer.appendChild(dot);
      });
    }
    
    cell.appendChild(dotsContainer);
  }

  container.appendChild(cell);
}

// --- RENDER 2: Daily Ledger List ---
function renderDailyLedger() {
  const container = document.getElementById('daily-ledger-list');
  const netLabel = document.getElementById('selected-date-net-label');
  const dateLabel = document.getElementById('selected-date-label');
  
  // Format selected date description
  const d = new Date(selectedDate);
  const weekDay = ['??, '?ù¬Ä', '??, '??, '??, '??, '??][d.getDay()];
  dateLabel.innerText = `${d.getFullYear()}??{d.getMonth()+1}??{d.getDate()}???Ó∏?${weekDay})`;

  container.innerHTML = '';
  container.style.position = 'relative';
  
  const petTheme = AppState.petTheme || 'none';
  const dayTx = AppState.transactions.filter(t => t.date === selectedDate);
  const upcomingTx = getUpcomingForDate(selectedDate);
  
  if (petTheme !== 'none' && (dayTx.length > 0 || upcomingTx.length > 0)) {
    const watermark = document.createElement('div');
    watermark.style.cssText = "position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); opacity: 0.05; pointer-events: none; z-index: 0; color: var(--color-primary);";
    watermark.innerHTML = getMascotSvg(petTheme, 200);
    container.appendChild(watermark);
  }
  
  // Calculate daily totals
  let dailyIncome = 0;
  let dailyExpense = 0;
  
  dayTx.forEach(t => {
    if (t.type === 'income') dailyIncome += Number(t.amount);
    if (t.type === 'expense') dailyExpense += Number(t.amount);
  });
  
  const net = dailyIncome - dailyExpense;
  netLabel.innerHTML = '';

  const headerMascot = document.getElementById('ledger-header-mascot');
  
  if (headerMascot) {
    if ((dayTx.length > 0 || upcomingTx.length > 0) && petTheme !== 'none') {
      headerMascot.innerHTML = getMascotSvg(petTheme, 30);
    } else {
      headerMascot.innerHTML = '';
    }
  }

  if (dayTx.length === 0 && upcomingTx.length === 0) {
    let emptyStateHtml = '';
    if (petTheme !== 'none') {
      emptyStateHtml = `
        <div style="display: flex; justify-content: center; align-items: flex-end; gap: 1rem; margin-bottom: 1rem; height: 100px;">
          ${getMascotSvg(petTheme, 80)}
        </div>
        <p style="color: var(--text-secondary); font-size: 0.875rem;">${getMascotDescription(petTheme)}</p>
      `;
    } else {
      emptyStateHtml = `
        <div style="display: flex; justify-content: center; align-items: flex-end; gap: 1rem; margin-bottom: 1rem; height: 100px;">
          <svg class="piggy-bank pig-wiggle" viewBox="0 0 100 100" width="70" height="70">
            <ellipse cx="50" cy="55" rx="35" ry="28" fill="#fbcfe8" stroke="#f472b6" stroke-width="2" />
            <polygon points="30,34 20,15 40,25" fill="#fbcfe8" stroke="#f472b6" stroke-width="2" />
            <polygon points="70,34 80,15 60,25" fill="#fbcfe8" stroke="#f472b6" stroke-width="2" />
            <rect x="30" y="78" width="12" height="12" rx="4" fill="#fbcfe8" stroke="#f472b6" stroke-width="2" />
            <rect x="58" y="78" width="12" height="12" rx="4" fill="#fbcfe8" stroke="#f472b6" stroke-width="2" />
            <ellipse cx="50" cy="62" rx="10" ry="7" fill="#f472b6" />
            <circle cx="46" cy="62" r="2" fill="#be185d" />
            <circle cx="54" cy="62" r="2" fill="#be185d" />
            <circle cx="36" cy="48" r="3" fill="#1e293b" />
            <circle cx="64" cy="48" r="3" fill="#1e293b" />
            <rect x="44" y="24" width="12" height="4" rx="1" fill="#be185d" />
          </svg>
        </div>
        <p style="color: var(--text-secondary); font-size: 0.875rem;">?Á•ÜÓ?????ûÈ¢±??≠Ê???ù¬Ä????∫Óµ•?????ù¬Ä?ëÔ?????™Ô????ñ≥?êÂ??/p>
      `;
    }
    
    container.innerHTML = `
      <div class="empty-state" style="padding: 2rem 1rem; text-align: center;">
        ${emptyStateHtml}
      </div>
    `;
    return;
  }

  // Render upcoming hints first
  upcomingTx.forEach(rule => {
    const item = document.createElement('div');
    item.className = 'ledger-item';
    item.style.opacity = '0.7';
    item.style.border = '1px dashed var(--color-purple)';
    
    // Find account name
    const acc = AppState.accounts.find(a => a.id === rule.sourceAccountId);
    const accName = acc ? acc.name : '??∞Ó???ñÆ??;
    
      const iconToUse = rule.icon || '?Ó∂?;
      let iconHtml = '';
      if (iconToUse === '?Ó∂?) {
        iconHtml = `<div class="ledger-icon" style="background: rgba(168, 85, 247, 0.2); color: var(--color-purple);"><svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg></div>`;
      } else {
        iconHtml = `<div class="ledger-icon" style="background: rgba(168, 85, 247, 0.1); font-size: 1.25rem;">${iconToUse}</div>`;
      }
      
      item.innerHTML = `
        <div class="ledger-left">
          ${iconHtml}
          <div class="ledger-info">
          <div class="ledger-title" style="color: var(--color-purple);">???????- ${escapeHtml(rule.name)}</div>
          <div class="ledger-account-tag">?†Ôã´??${escapeHtml(accName)} ???</div>
        </div>
      </div>
      <div class="ledger-right">
        ${getAccountingSpan(rule.amount, rule.type)}
        <div class="ledger-account-tag">?üÈ?ÁµûÊ??¨ÔäÆ??†Ôè°??/div>
      </div>
    `;
    container.appendChild(item);
  });

  dayTx.forEach(t => {
    const item = document.createElement('div');
    item.className = `ledger-item ${t.type}`;
    
    // Find account name
    const acc = AppState.accounts.find(a => a.id === t.accountId);
    const destAcc = t.destAccountId ? AppState.accounts.find(a => a.id === t.destAccountId) : null;
    
    let accountInfo = '';
    let categoryIcon = '??';
    
    if (t.type === 'transfer') {
      const srcName = acc ? acc.name : (t.accountId.endsWith('_invested') ? '??†Â∑®?àÔã≠?' : '??∞Ó?');
      const destName = destAcc ? destAcc.name : (t.destAccountId.endsWith('_invested') ? '??†Â∑®?àÔã≠?' : '??∞Ó?');
      accountInfo = `${srcName} ??${destName}`;
      categoryIcon = '???;
    } else {
      accountInfo = acc ? acc.name : '??∞Ó???ñÆ??;
      // Icon selection based on category
      categoryIcon = getCategoryEmoji(t.category);
    }
    
    // Parse Hashtags
    const rawTitle = escapeHtml(t.notes || t.category);
    const parsedTitle = rawTitle.replace(/#([\w\u4e00-\u9fa5]+)/g, '<span class="hashtag" onclick="openHashtagModal(\'$1\')" style="color: var(--color-purple); font-weight: 600; cursor: pointer;">#$1</span>');

    item.innerHTML = `
      <div class="ledger-left">
        <div class="category-icon-wrapper">${categoryIcon}</div>
        <div class="ledger-info">
          <div class="ledger-title">${parsedTitle}</div>
          <div class="ledger-account-tag">${accountInfo}</div>
        </div>
      </div>
      <div class="ledger-right">
        ${getAccountingSpan(t.type === 'expense' ? -Number(t.amount) : Number(t.amount), t.type)}
        <div class="ledger-actions" style="display: flex; gap: 0.25rem;">
          <button class="btn-icon-action" onclick="editTransaction('${t.id}')" title="?∫Âàª??>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
          </button>
          <button class="btn-icon-action" onclick="deleteTransaction('${t.id}')" title="??∑Ó?">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
          </button>
        </div>
      </div>
    `;
    
    // Setup long press (for delete/edit flow later)
    item.addEventListener('dblclick', () => {
      openAddTransactionModal(t.id);
    });

    container.appendChild(item);
  });
    
    // Add watermark background if has transactions and theme is pet
    if (dayTx.length > 0) {
      const petTheme = AppState.petTheme || 'none';
      if (petTheme !== 'none') {
        const watermarkSvg = getMascotSvg(petTheme, 200);
        if (watermarkSvg) {
          const bg = document.createElement('div');
          bg.style.cssText = "position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); opacity: 0.05; pointer-events: none; z-index: 0;";
          bg.innerHTML = watermarkSvg;
          container.appendChild(bg);
        }
      }
    }
  }

function openHashtagModal(tag) {
  const container = document.getElementById('hashtag-search-results');
  document.getElementById('hashtag-search-title').innerText = `#${tag} ?ÖÓ??úË?????
  
  // Find all transactions with this tag
  const matchingTx = AppState.transactions.filter(t => t.notes && t.notes.includes(`#${tag}`));
  
  if (matchingTx.length === 0) {
    container.innerHTML = `<div style="text-align: center; padding: 2rem; color: var(--text-muted);">??†Ó??Ó∞???/div>`;
  } else {
    let totalIncome = 0;
    let totalExpense = 0;
    let html = `<ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.5rem;">`;
    
    matchingTx.sort((a,b) => new Date(b.date) - new Date(a.date)).forEach(t => {
      if (t.type === 'income') totalIncome += Number(t.amount);
      if (t.type === 'expense') totalExpense += Number(t.amount);
      
      const acc = AppState.accounts.find(a => a.id === t.accountId);
      const accName = acc ? acc.name : '??∞Ó?';
      html += `
        <li style="display: flex; justify-content: space-between; padding: 0.75rem; background: rgba(255,255,255,0.05); border-radius: 8px;">
          <div style="display: flex; flex-direction: column; gap: 0.25rem;">
            <span style="font-weight: 600; color: var(--text-primary);">${escapeHtml(t.notes || t.category)}</span>
            <span style="font-size: 0.75rem; color: var(--text-muted);">${t.date} Áπ?${accName}</span>
          </div>
          <div style="font-family: var(--font-title); font-weight: 700; color: ${t.type === 'income' ? 'var(--color-green)' : t.type === 'expense' ? 'var(--color-red)' : 'var(--text-secondary)'};">
            ${getAccountingSpan(t.amount, t.type)}
          </div>
        </li>
      `;
    });
    
    html += `</ul>
      <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border-color); display: flex; justify-content: space-between; font-size: 0.9rem; font-weight: 600;">
        <span>?ÖÓ??úËùÆË≥??ØÓ????/span>
        <span style="color: ${(totalIncome - totalExpense) >= 0 ? 'var(--color-green)' : 'var(--color-red)'};">${formatAccounting(totalIncome - totalExpense)}</span>
      </div>
    `;
    container.innerHTML = html;
  }
  
  document.getElementById('modal-hashtag-search').style.display = 'flex';
}

function getCategoryEmoji(cat) {
  const emojis = {
    // Expense
    '?åËÑ§?': '??', '??õÀ?: '??', '?øÓê±?': '??', '?≠Êó•??: '??', '???': '???, 
    '?∑Ê?Êº±ÊÜ°ÓÆ?': '??', '?àÊ???: '????, '???': '???, '?ñË???: '???, '???': '??', 
    '?ΩÓ?Ó™?: '?Ó≠âÂÑ≠?, '?ÆË??': '??', '???': '??', '?‰∫¶Ó???: '?Â¶?, 'È¢≤Ë???: '???, 
    '?ÆÓ??õÈ??: '???, '???': '???,
    // Income
    '????': '???, '?ùÂ??': '???, '???': '??', '?Ó∏ÇÊ???: '???
  };
  return emojis[cat] || '??';
}

// --- RENDER 3: Accounts Page ---
function renderAccounts() {
  const container = document.getElementById('accounts-cards-container');
  container.innerHTML = '';
  
  const { balances, creditSpent } = calculateBalancesAtDate();
  
  // Calculate aggregate net worth (Assets - Credit Card Debt)
  let totalAssets = 0;
  let totalLiabilities = 0;
  
  AppState.accounts.forEach(acc => {
    const accState = balances[acc.id];
    if (acc.type === 'credit') {
      // Credit card spent is a liability
      totalLiabilities += creditSpent[acc.id];
    } else if (acc.type === 'securities') {
      totalAssets += accState.balance + accState.securitiesInvested;
    } else {
      totalAssets += accState.balance;
    }
  });
  
  const netWorth = totalAssets - totalLiabilities;

  // Add Aggregate Net Worth Header Card
  const netWorthCard = document.createElement('div');
  netWorthCard.className = 'glass-card';
  netWorthCard.style.gridColumn = '1 / -1';
  netWorthCard.style.display = 'flex';
  netWorthCard.style.justifyContent = 'space-between';
  netWorthCard.style.alignItems = 'center';
  netWorthCard.style.background = 'linear-gradient(135deg, rgba(0, 242, 254, 0.08) 0%, rgba(79, 172, 254, 0.03) 100%)';
  netWorthCard.style.borderColor = 'rgba(0, 242, 254, 0.2)';
  
  netWorthCard.innerHTML = `
    <div>
      <div style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 0.25rem;">?àÔã´?øÁ??∏¬ÄÊΩõË???/div>
      <div style="font-family: var(--font-title); font-size: 2.25rem; font-weight: 900; background: linear-gradient(90deg, #00F2FE, #4FACFE); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
        ${formatAccounting(netWorth)}
      </div>
    </div>
    <div style="text-align: right; font-size: 0.875rem; color: var(--text-secondary);">
      <div>?ÆË≥™??ÔΩ?${formatAccounting(totalAssets)}</div>
      <div>?ÆË≥™????${formatAccounting(-totalLiabilities)}</div>
    </div>
  `;
  container.appendChild(netWorthCard);

  // Add Action Buttons Row
  const actionCard = document.createElement('div');
  actionCard.style.gridColumn = '1 / -1';
  actionCard.style.display = 'flex';
  actionCard.style.gap = '1rem';
  actionCard.innerHTML = `
    <button class="btn-primary" onclick="openAddAccountModal('cash')" style="flex: 1; padding: 0.8rem; justify-content: center;">
      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
      ?????ñÆ??
    </button>
    <button class="btn-primary" onclick="openAddAccountModal('credit')" style="flex: 1; padding: 0.8rem; justify-content: center;">
      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
      ????Ω‚????
    </button>
  `;
  container.appendChild(actionCard);

  // Render Individual Accounts
  AppState.accounts.forEach(acc => {
    const card = document.createElement('div');
    card.className = `account-card ${acc.type}`;
    
    const accState = balances[acc.id];
    let balanceValHtml = '';
    let extraDetailsHtml = '';
    
    if (acc.type === 'credit') {
      // Credit card available limit and details
      const cycleStatus = getCreditCardCycleStatus(acc, new Date());
      const spent = cycleStatus.spent;
      const repaid = cycleStatus.repaid;
      const availableLimit = cycleStatus.availableLimit;
      const limit = Number(acc.creditLimit) || 100000;
      
      balanceValHtml = `<span style="font-size: 0.75rem; color: var(--text-secondary); display: block; margin-bottom: 0.25rem;">??êÓ??øÔ?Êº?/span>` + getAccountingSpan(availableLimit, 'income');
      
      let warningHtml = '';
      if (cycleStatus.isBelowThreshold) {
        warningHtml = `
          <div class="credit-card-warning">
            <span>?Ó∫? ?øÔ?Êº≤È?Ë°?Öß?óÓºª?ßÊ?Ó¶??®Ëô´??ÊΩ???${formatAccounting(acc.warningThreshold || 0)}</span>
          </div>
        `;
      }

      extraDetailsHtml = `
        <div class="credit-details-grid">
          <div>
            <div class="sub-balance-label">?Á•??ùËà™??®Ô?Á•?/div>
            <div class="sub-balance-val" style="color: var(--color-red);">${formatAccounting(spent)}</div>
          </div>
          <div>
            <div class="sub-balance-label">?Á•??åËÑ§???/div>
            <div class="sub-balance-val" style="color: var(--color-green);">${formatAccounting(repaid)}</div>
          </div>
          <div>
            <div class="sub-balance-label">?•Óê≤??Ω‚??ÖÊÜø?óÊº≤</div>
            <div class="sub-balance-val">${formatAccounting(limit)}</div>
          </div>
          <div>
            <div class="sub-balance-label">?????ñ≥Ó°ÖÊ?Ó¶?</div>
            <div class="sub-balance-val">${formatAccounting(creditSpent[acc.id])}</div>
          </div>
        </div>
        <div class="card-billing-details" style="margin-top: 0.75rem;">
          <span>?ØÓ???? ?•Óê≤? ${acc.billingDay} ??/span>
          <span>???ø´?? ?•Óê≤? ${acc.dueDay} ??/span>
        </div>
        ${warningHtml}
      `;
    } else if (acc.type === 'securities') {
      // Securities
      const totalSecVal = accState.balance + accState.securitiesInvested;
      balanceValHtml = getAccountingSpan(totalSecVal, 'income');
      
      extraDetailsHtml = `
        <div class="securities-sub-balances">
          <div>
            <div class="sub-balance-label">??ñÆ??????/div>
            <div class="sub-balance-val">${formatAccounting(accState.balance)}</div>
          </div>
          <div>
            <div class="sub-balance-label">?åËÑ´??‰∫•Ó??°Âàª???/div>
            <div class="sub-balance-val">${formatAccounting(accState.securitiesInvested)}</div>
          </div>
        </div>
        <button class="btn-select-option" style="width: 100%; margin-top: 1rem; border-color: var(--color-gold); color: var(--color-gold);" onclick="openSecuritiesTransferModal('${acc.id}')">
          ?àÔã≠??≠Ó?? (?éÁ???????
        </button>
      `;
    } else {
      // Cash / Bank
      balanceValHtml = getAccountingSpan(accState.balance, 'income');
      
      // Cash Account Budget
      if (acc.type === 'cash' && acc.budget) {
        const now = new Date();
        const cycle = getCashBillingCycle(acc, now);
        
        const currentMonthCashExpenses = AppState.transactions
          .filter(t => {
            if (t.accountId !== acc.id || t.type !== 'expense') return false;
            const txDate = new Date(t.date + 'T00:00:00');
            return txDate >= cycle.startDate && txDate <= cycle.endDate;
          })
          .reduce((sum, t) => sum + Number(t.amount), 0);
          
        const budgetPercent = Math.min((currentMonthCashExpenses / acc.budget) * 100, 100);
        const overBudget = currentMonthCashExpenses > acc.budget;
        
        const formatDateMD = d => (d.getMonth() + 1) + '/' + d.getDate();
        const cycleRangeStr = `${formatDateMD(cycle.startDate)} ~ ${formatDateMD(cycle.endDate)}`;
        
        extraDetailsHtml = `
          <div class="budget-progress-container">
            <div class="budget-progress-header">
              <span>?Á•??åËÑ∞??(${cycleRangeStr}): ${formatAccounting(currentMonthCashExpenses)}</span>
              <span>????ùÔ??: ${formatAccounting(acc.budget)}</span>
            </div>
            <div class="budget-progress-bar">
              <div class="budget-progress-fill ${overBudget ? 'overbudget' : ''}" style="width: ${budgetPercent}%"></div>
            </div>
          </div>
        `;
      }
    }

    card.innerHTML = `
      <div class="account-card-header">
        <span class="account-card-name">${escapeHtml(acc.name)}</span>
        <span class="account-card-type">${acc.type === 'credit' ? '?Ω‚???? : acc.type === 'securities' ? '?ÖÔê£??? : acc.type === 'bank' ? '???? : '???'}</span>
      </div>
      <div class="account-card-balance">
        ${balanceValHtml}
      </div>
      ${extraDetailsHtml}
      
      <div style="margin-top: 1rem; display: flex; justify-content: flex-end; gap: 0.5rem;">
        <button class="btn-icon-action" onclick="openEditAccountModal('${acc.id}')" title="?∫Âàª?©Êí£?ÆÔ???ôË??????>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
        </button>
        <button class="btn-icon-action" onclick="deleteAccount('${acc.id}')" title="??∑Ó???ñÆ??>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
        </button>
      </div>
    `;
    
    container.appendChild(card);
  });

  // Render spending charts
  renderAccountsStatistics();
}

function renderAccountsStatistics() {
  const cashflowContainer = document.getElementById('cashflow-bars-container');
  const categoryContainer = document.getElementById('category-breakdown-container');
  
  if (!cashflowContainer || !categoryContainer) return;
  
  // Calculate current month date range based on settlementDay
  const settlementDay = Number(AppState.settlementDay || 1);
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  
  let startMonth = currentMonth;
  let startYear = currentYear;
  
  // If today is before settlementDay, we belong to the previous month's cycle
  if (now.getDate() < settlementDay) {
    startMonth -= 1;
    if (startMonth < 0) {
      startMonth = 11;
      startYear -= 1;
    }
  }
  
  // Create start date. Cap to last day of month if necessary.
  let startDate = new Date(startYear, startMonth, settlementDay);
  if (startDate.getMonth() !== startMonth) {
    startDate = new Date(startYear, startMonth + 1, 0);
  }
  
  let endMonth = startMonth + 1;
  let endYear = startYear;
  if (endMonth > 11) {
    endMonth = 0;
    endYear += 1;
  }
  
  let nextStartDate = new Date(endYear, endMonth, settlementDay);
  if (nextStartDate.getMonth() !== endMonth) {
    nextStartDate = new Date(endYear, endMonth + 1, 0);
  }
  
  const endDate = new Date(nextStartDate);
  endDate.setDate(endDate.getDate() - 1);
  
  const formatYMD = d => {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };
  
  const startStr = formatYMD(startDate);
  const endStr = formatYMD(endDate);
  
  // Update Title
  const panelTitle = document.querySelector('#right-panel-accounts .panel-title');
  if (panelTitle && panelTitle.innerText.includes('?¨Ê??∂ÊîØÊ¶ÇÊ?')) {
    panelTitle.innerHTML = `?¨Ê??∂ÊîØÊ¶ÇÊ? <span style="font-size:0.75rem; color:var(--text-muted); font-weight:normal; margin-left:0.5rem;">(${startStr} ~ ${endStr})</span>`;
  }
  
  // Filter transactions for this cycle
  const thisMonthTx = AppState.transactions.filter(t => t.date >= startStr && t.date <= endStr);
  
  let incomeTotal = 0;
  let expenseTotal = 0;
  const categorySum = {};
  
  thisMonthTx.forEach(t => {
    const amount = Number(t.amount);
    if (t.type === 'income') {
      incomeTotal += amount;
    } else if (t.type === 'expense') {
      expenseTotal += amount;
      categorySum[t.category] = (categorySum[t.category] || 0) + amount;
    }
  });

  // 1. Draw Cashflow Summary Bars & Net Balance
  const maxFlow = Math.max(incomeTotal, expenseTotal, 1);
  const incPercent = (incomeTotal / maxFlow) * 100;
  const expPercent = (expenseTotal / maxFlow) * 100;
  const balance = incomeTotal - expenseTotal;
  
  cashflowContainer.innerHTML = `
    <!-- Net Balance -->
    <div style="margin-bottom: 0.5rem; padding: 1rem; background: rgba(255,255,255,0.02); border-radius: 12px; border: 1px solid rgba(255,255,255,0.05); text-align: center;">
      <div style="font-size: 0.8125rem; color: var(--text-muted); margin-bottom: 0.25rem;">?¨Ê?ÁµêÈ?</div>
      <div style="font-family: var(--font-title); font-size: 1.75rem; font-weight: bold; color: ${balance >= 0 ? 'var(--color-green)' : 'var(--color-red)'};">${formatAccounting(balance)}</div>
    </div>
    <!-- Income Bar -->
    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
      <div style="display: flex; justify-content: space-between; font-size: 0.875rem;">
        <span style="font-weight: 600;">?ì• ?¨Ê?Á∏ΩÊî∂??/span>
        <span style="font-family: var(--font-title); font-weight: 700; color: var(--color-green);">${formatAccounting(incomeTotal)}</span>
      </div>
      <div style="height: 12px; background: rgba(255,255,255,0.05); border-radius: 6px; overflow: hidden;">
        <div style="height: 100%; width: ${incPercent}%; background: var(--color-green); border-radius: 6px; box-shadow: var(--glow-green);"></div>
      </div>
    </div>
    <!-- Expense Bar -->
    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
      <div style="display: flex; justify-content: space-between; font-size: 0.875rem;">
        <span style="font-weight: 600;">?ì§ ?¨Ê?Á∏ΩÊîØ??/span>
        <span style="font-family: var(--font-title); font-weight: 700; color: var(--color-red);">${formatAccounting(expenseTotal)}</span>
      </div>
      <div style="height: 12px; background: rgba(255,255,255,0.05); border-radius: 6px; overflow: hidden;">
        <div style="height: 100%; width: ${expPercent}%; background: var(--color-red); border-radius: 6px; box-shadow: var(--glow-red);"></div>
      </div>
    </div>
  `;

  // 2. Draw Category Ranking
  categoryContainer.innerHTML = '';
  
  const chartType = AppState.chartType || 'pie';
  
  // Group categories and sort them
  const sortedCategories = Object.keys(categorySum)
    .map(cat => ({ name: cat, amount: categorySum[cat] }))
    .sort((a, b) => b.amount - a.amount);
    
  if (sortedCategories.length === 0) {
    categoryContainer.innerHTML = `
      <div style="text-align: center; color: var(--text-muted); font-size: 0.875rem; padding: 3rem 0;">
        ?Á•???©È??øÓ???ÁÆ∏Óû≤??
      </div>
    `;
    return;
  }

  // Update toggle button states in UI
  const pieBtn = document.getElementById('chart-type-pie');
  const barBtn = document.getElementById('chart-type-bar');
  if (pieBtn && barBtn) {
    if (chartType === 'pie') {
      pieBtn.classList.add('active');
      barBtn.classList.remove('active');
    } else {
      pieBtn.classList.remove('active');
      barBtn.classList.add('active');
    }
  }

  const totalExpense = sortedCategories.reduce((sum, c) => sum + c.amount, 0);

  if (chartType === 'pie') {
    // RENDER DONUT PIE CHART
    let circlesHtml = '';
    let cumulativePercent = 0;
    
    // Modern harmonious colors for chart
    const colors = [
      '#6366F1', // indigo
      '#8B5CF6', // purple
      '#EC4899', // pink
      '#3B82F6', // blue
      '#10B981', // emerald
      '#F59E0B', // amber
      '#EF4444'  // red
    ];

    sortedCategories.forEach((cat, index) => {
      const share = cat.amount / totalExpense;
      const percentValue = share * 100;
      
      const circumference = 314; // circumference for r=50 is 314.16
      const strokeDashArray = circumference;
      const strokeDashOffset = circumference - (circumference * share);
      const rotation = (cumulativePercent / 100) * 360 - 90; // Start at top
      
      const color = colors[index % colors.length];
      
      circlesHtml += `
        <circle cx="70" cy="70" r="50" 
          fill="none" 
          stroke="${color}" 
          stroke-width="14" 
          stroke-dasharray="${strokeDashArray}" 
          stroke-dashoffset="${strokeDashOffset}" 
          transform="rotate(${rotation} 70 70)" 
          stroke-linecap="round"
          style="transition: stroke-dashoffset 0.6s ease; filter: drop-shadow(0 0 2px rgba(0,0,0,0.5));">
        </circle>
      `;
      
      cumulativePercent += percentValue;
    });

    // Make Legend list next to SVG
    let legendHtml = '<div style="display: flex; flex-direction: column; gap: 0.5rem; flex: 1; justify-content: center;">';
    sortedCategories.slice(0, 5).forEach((cat, index) => {
      const percentText = ((cat.amount / totalExpense) * 100).toFixed(1);
      const color = colors[index % colors.length];
      const emoji = getCategoryEmoji(cat.name);
      legendHtml += `
        <div style="display: flex; align-items: center; justify-content: space-between; font-size: 0.8125rem;">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span style="width: 8px; height: 8px; border-radius: 50%; background-color: ${color}; display: inline-block;"></span>
            <span>${emoji} ${escapeHtml(cat.name)}</span>
          </div>
          <span style="color: var(--text-secondary); font-weight: 600;">${percentText}% (${formatAccounting(cat.amount)})</span>
        </div>
      `;
    });
    
    if (sortedCategories.length > 5) {
      const otherSum = sortedCategories.slice(5).reduce((sum, c) => sum + c.amount, 0);
      const otherPercent = ((otherSum / totalExpense) * 100).toFixed(1);
      legendHtml += `
        <div style="display: flex; align-items: center; justify-content: space-between; font-size: 0.8125rem;">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span style="width: 8px; height: 8px; border-radius: 50%; background-color: #6B7280; display: inline-block;"></span>
            <span>??????</span>
          </div>
          <span style="color: var(--text-secondary); font-weight: 600;">${otherPercent}% (${formatAccounting(otherSum)})</span>
        </div>
      `;
    }
    legendHtml += '</div>';

    categoryContainer.style.flexDirection = 'row';
    categoryContainer.style.alignItems = 'center';
    categoryContainer.style.gap = '1.5rem';
    
    categoryContainer.innerHTML = `
      <div style="position: relative; width: 140px; height: 140px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
        <svg width="140" height="140" viewBox="0 0 140 140">
          <circle cx="70" cy="70" r="50" fill="none" stroke="rgba(255,255,255,0.02)" stroke-width="14"></circle>
          ${circlesHtml}
        </svg>
        <div style="position: absolute; text-align: center; pointer-events: none;">
          <div style="font-size: 0.65rem; color: var(--text-muted); text-transform: uppercase;">?ÆË≥£???/div>
          <div style="font-family: var(--font-title); font-size: 0.95rem; font-weight: 800;">${formatAccounting(totalExpense)}</div>
        </div>
      </div>
      ${legendHtml}
    `;

  } else {
    // RENDER BAR CHART (Neon progress bars list)
    categoryContainer.style.flexDirection = 'column';
    categoryContainer.style.alignItems = 'stretch';
    categoryContainer.style.gap = '1rem';
    
    const maxCategoryAmount = sortedCategories[0].amount;
    
    sortedCategories.slice(0, 5).forEach(cat => {
      const percent = (cat.amount / maxCategoryAmount) * 100;
      const item = document.createElement('div');
      item.style.display = 'flex';
      item.style.flexDirection = 'column';
      item.style.gap = '0.35rem';
      
      const emoji = getCategoryEmoji(cat.name);

      item.innerHTML = `
        <div style="display: flex; justify-content: space-between; font-size: 0.8125rem;">
          <span>${emoji} ${escapeHtml(cat.name)}</span>
          <span style="font-family: var(--font-title); font-weight: 600; color: var(--text-secondary);">${formatAccounting(cat.amount)}</span>
        </div>
        <div style="height: 8px; background: rgba(255,255,255,0.03); border-radius: 4px; overflow: hidden;">
          <div style="height: 100%; width: ${percent}%; background: linear-gradient(90deg, var(--color-indigo), var(--color-purple)); border-radius: 4px; box-shadow: 0 0 8px rgba(139, 92, 246, 0.4);"></div>
        </div>
      `;
      categoryContainer.appendChild(item);
    });
  }

  // --- Render Global Budget Tracker ---
  renderGlobalBudgetTracker(expenseTotal);
  // --- Render Financial Health Score ---
  renderFinancialHealth(incomeTotal, expenseTotal);
  // --- Render Asset Trend ---
  renderAssetTrend();
}

function renderAssetTrend() {
  const container = document.getElementById('asset-trend-chart-container');
  if (!container) return;
  
  // Calculate current net worth
  let currentNetWorth = 0;
  AppState.accounts.forEach(acc => {
    if (acc.type !== 'credit') {
      currentNetWorth += Number(acc.balance);
    } else {
      currentNetWorth -= Number(acc.balance);
    }
  });

  // Calculate average monthly savings from transactions
  // For simplicity, we just take all income minus all expenses, divided by number of unique months in transactions.
  // If not enough data, default to 5000.
  let totalIncome = 0;
  let totalExpense = 0;
  const months = new Set();
  
  AppState.transactions.forEach(t => {
    if (t.type === 'income') totalIncome += Number(t.amount);
    if (t.type === 'expense') totalExpense += Number(t.amount);
    if (t.date) {
      months.add(t.date.substring(0, 7)); // YYYY-MM
    }
  });
  
  let monthCount = months.size || 1;
  let avgSavings = (totalIncome - totalExpense) / monthCount;
  if (avgSavings < 0) avgSavings = 0; // If burning money, forecast flat or 0 growth for simplicity to not scare user too much
  if (totalIncome === 0 && totalExpense === 0) avgSavings = 5000; // Mock data if empty
  
  let html = '';
  let maxVal = currentNetWorth + (avgSavings * 12);
  
  for (let i = 1; i <= 12; i++) {
    const projected = currentNetWorth + (avgSavings * i);
    const heightPct = maxVal > 0 ? (projected / maxVal) * 100 : 0;
    
    html += `
      <div style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: flex-end; position: relative; group">
        <div style="width: 100%; background: linear-gradient(to top, rgba(0, 242, 254, 0.2), rgba(79, 172, 254, 0.8)); border-radius: 4px 4px 0 0; height: ${heightPct}%; min-height: 5px; transition: height 0.5s ease; position: relative;">
          <div style="position: absolute; top: -25px; left: 50%; transform: translateX(-50%); font-size: 0.7rem; color: var(--text-primary); opacity: 0; transition: opacity 0.2s;" class="trend-tooltip">
            ${formatAccounting(projected).replace('NT$ ', '')}
          </div>
        </div>
        <div style="font-size: 0.6rem; color: var(--text-muted); margin-top: 4px;">+${i}M</div>
      </div>
    `;
  }
  
  container.innerHTML = html;
  
  // Add quick hover CSS logic for tooltips
  if (!document.getElementById('trend-tooltip-style')) {
    const style = document.createElement('style');
    style.id = 'trend-tooltip-style';
    style.innerHTML = `
      #asset-trend-chart-container > div:hover .trend-tooltip {
        opacity: 1 !important;
      }
    `;
    document.head.appendChild(style);
  }
}

function renderFinancialHealth(income, expense) {
  const container = document.getElementById('financial-health-section');
  if (!container) return;
  
  if (income === 0 && expense === 0) {
    container.innerHTML = `<div style="width: 100%; text-align: center; color: var(--text-muted); padding: 1rem;">??éÔ??Á•??Ë±??û‰∫•??°Â???é‚à™ÓªªÊë®?ïÊº≤</div>`;
    return;
  }
  
  const savings = income - expense;
  const savingsRate = income > 0 ? (savings / income) * 100 : 0;
  
  let score = 50; // Base score
  if (income > 0) {
    if (savingsRate >= 30) score += 40;
    else if (savingsRate >= 15) score += 20;
    else if (savingsRate > 0) score += 10;
    else score -= 20; // negative savings
  } else {
    score -= 30; // no income, only expense
  }
  
  // Cap at 0-100
  score = Math.max(0, Math.min(100, Math.round(score)));
  
  let gradeColor = 'var(--color-green)';
  let gradeText = '?é‚à™????úÓºº?îÈõø???úÊ???ΩÓ??';
  if (score < 40) {
    gradeColor = 'var(--color-red)';
    gradeText = '?‰π???ïÔäæ?óÔóæ??úÂÜΩ???°Ô???;
  } else if (score < 70) {
    gradeColor = 'var(--color-gold)';
    gradeText = '?µÂáΩ?äÊ??üÂ??óÔó∫??????©Ô????';
  }

  container.innerHTML = `
    <div style="flex: 0 0 100px; height: 100px; border-radius: 50%; display: flex; align-items: center; justify-content: center; position: relative; background: conic-gradient(${gradeColor} ${score}%, rgba(255,255,255,0.05) 0); box-shadow: 0 0 20px ${gradeColor}40;">
      <div style="position: absolute; inset: 10px; background: var(--bg-card); border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-direction: column;">
        <span style="font-family: var(--font-title); font-size: 1.5rem; font-weight: 800; color: var(--text-primary); line-height: 1;">${score}</span>
        <span style="font-size: 0.6rem; color: var(--text-muted);">??/span>
      </div>
    </div>
    <div style="flex: 1;">
      <h3 style="font-family: var(--font-title); font-size: 1.125rem; font-weight: 700; margin: 0 0 0.25rem 0;">?Á•???èÁì∑?‰∫ôÁ???/h3>
      <p style="font-size: 0.85rem; color: ${gradeColor}; font-weight: 600; margin: 0 0 0.5rem 0;">${gradeText}</p>
      <div style="display: flex; gap: 1rem; font-size: 0.8125rem; color: var(--text-secondary);">
        <div>?Á•??????span style="color: ${savings >= 0 ? 'var(--color-green)' : 'var(--color-red)'}; font-weight: bold;">${formatAccounting(savings)}</span></div>
        <div>??????<span style="color: var(--text-primary); font-weight: bold;">${income > 0 ? savingsRate.toFixed(1) : 0}%</span></div>
      </div>
    </div>
  `;
}

function renderGlobalBudgetTracker(expenseTotal) {
  const container = document.getElementById('global-budget-tracker-container');
  if (!container) return;
  
  const budget = Number(AppState.globalMonthlyBudget) || 20000;
  let percent = (expenseTotal / budget) * 100;
  if (percent > 100) percent = 100;
  
  let color = 'var(--color-green)'; // Safe
  if (percent >= 90) {
    color = 'var(--color-red)'; // Danger
  } else if (percent >= 70) {
    color = 'var(--color-gold)'; // Warning
  }
  
  const remaining = budget - expenseTotal;
  const remainingText = remaining >= 0 ? `??? ${formatAccounting(remaining)}` : `?ûÔÜ∞??${formatAccounting(Math.abs(remaining))}`;

  container.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: baseline;">
      <h3 style="font-family: var(--font-title); font-size: 1rem; font-weight: 700; color: var(--text-secondary); margin: 0;">?Á•??ÆË≥°???/h3>
      <span style="font-size: 0.85rem; color: ${color}; font-weight: 600;">${remainingText}</span>
    </div>
    <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-muted);">
      <span>?åËÑ©??${formatAccounting(expenseTotal)}</span>
      <span>?ÆË≥°? ${formatAccounting(budget)}</span>
    </div>
    <div style="height: 10px; background: rgba(255,255,255,0.05); border-radius: 5px; overflow: hidden; margin-top: 0.25rem;">
      <div style="height: 100%; width: ${percent}%; background: ${color}; border-radius: 5px; transition: width var(--transition-normal); box-shadow: 0 0 10px ${color}80;"></div>
    </div>
  `;
}

function openBudgetSettingModal() {
  document.getElementById('global-budget-amount').value = AppState.globalMonthlyBudget || 20000;
  document.getElementById('modal-global-budget').style.display = 'flex';
}

async function handleGlobalBudgetSubmit(event) {
  event.preventDefault();
  const amount = Number(document.getElementById('global-budget-amount').value);
  if (amount > 0) {
    AppState.globalMonthlyBudget = amount;
    await saveStateToStorage();
    renderAccountsStatistics();
    closeModal('modal-global-budget');
  }
}

async function toggleChartType(type) {
  AppState.chartType = type;
  await saveStateToStorage();
  renderAccountsStatistics();
}

// --- RENDER 4: Recurring Transactions ---
function renderRecurring() {
  const tbody = document.getElementById('recurring-tbody');
  tbody.innerHTML = '';
  
  if (AppState.recurring.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="padding: 3rem; text-align: center; color: var(--text-muted);">
          ?†Ó´±ÓØØÈñÆ???ûÈ¢±??ÁÆ???ÜÓ??¨Óê±?
        </td>
      </tr>
    `;
    return;
  }

  AppState.recurring.forEach(r => {
    const tr = document.createElement('tr');
    tr.style.borderBottom = '1px solid rgba(255, 255, 255, 0.04)';
    tr.style.fontSize = '0.9rem';
    
    const srcAcc = AppState.accounts.find(a => a.id === r.sourceAccountId);
    const destAcc = AppState.accounts.find(a => a.id === r.destAccountId);
    
    let typeLabel = '';
    if (r.type === 'income') typeLabel = '<span style="color: var(--color-green)">?ÁÆ???ÖÔÖØ</span>';
    if (r.type === 'expense') typeLabel = '<span style="color: var(--color-red)">?ÁÆ???¨Ôäæ</span>';
    if (r.type === 'transfer') typeLabel = '<span style="color: var(--color-blue)">?ÁÆ??ßÔê£??/span>';

    let freqText = '';
    if (r.frequency === 'daily') freqText = '?•Óê±‰∫?;
    if (r.frequency === 'weekly') freqText = `?•Óêµ??(??${r.dayAnchor})`;
    if (r.frequency === 'monthly') freqText = `?•Óê≤? ${r.dayAnchor} ???
    if (r.frequency === 'yearly') freqText = `?•Óê±??${r.monthAnchor} ??${r.dayAnchor} ???

    tr.innerHTML = `
      <td style="padding: 1.25rem; font-weight: 600;">${escapeHtml(r.name)}</td>
      <td style="padding: 1.25rem;">${typeLabel}</td>
      <td style="padding: 1.25rem; font-family: var(--font-title); font-weight: 700;">${formatAccounting(r.amount)}</td>
      <td style="padding: 1.25rem; color: var(--text-secondary);">${srcAcc ? escapeHtml(srcAcc.name) : '-'}</td>
      <td style="padding: 1.25rem; color: var(--text-secondary);">${destAcc ? escapeHtml(destAcc.name) : '-'}</td>
      <td style="padding: 1.25rem; color: var(--text-secondary);">${freqText}</td>
      <td style="padding: 1.25rem; text-align: right;">
        <button class="btn-icon-action" onclick="deleteRecurringRule('${r.id}')" title="??∑Ó?">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
  
  if (typeof renderRecurringRightPanel === 'function') {
    renderRecurringRightPanel();
  }
}

// --- RENDER 5: Inventory Management ---
function renderInventory() {
  const container = document.getElementById('inventory-grid-container');
  if (!container) return;
  container.innerHTML = '';
  
  if (!AppState.inventory || AppState.inventory.length === 0) {
    container.innerHTML = `<div style="grid-column: 1/-1; padding: 3rem; text-align: center; color: var(--text-muted); background: var(--bg-card); border-radius: 16px;">?Ê°Ä??ùÓ???ûÈ¢±?????ù¬Ä??ê¬ÄÓø???æ¬Ä?ªÓ??ìÓµ¶?ßÈ??ß¬Ä???™Ô?????</div>`;
    return;
  }
  
  AppState.inventory.forEach(item => {
    const isLowStock = item.threshold && item.quantity <= item.threshold;
    const card = document.createElement('div');
    card.className = 'glass-card account-card';
    card.style.position = 'relative';
    if (isLowStock) {
      card.style.border = '2px solid var(--color-red)';
      card.style.boxShadow = '0 0 15px rgba(239, 68, 68, 0.2)';
    }
    
    card.innerHTML = `
      ${isLowStock ? '<div style="position: absolute; top: -10px; right: -10px; background: var(--color-red); color: white; font-size: 0.7rem; padding: 2px 8px; border-radius: 10px; font-weight: bold; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">?®ÊÄ????</div>' : ''}
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
        <h3 style="font-family: var(--font-title); font-size: 1.25rem; font-weight: 700; margin: 0;">${item.icon || '???} ${escapeHtml(item.name)}</h3>
        <div style="display: flex; gap: 0.5rem;">
          <button class="btn-icon-action" onclick="openEditInventoryModal('${item.id}')" title="?∫Âàª??>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
          </button>
          <button class="btn-icon-action" style="color: var(--color-red);" onclick="deleteInventoryItem('${item.id}')" title="??∑Ó?">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
          </button>
        </div>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.5rem;">
        <span style="font-size: 0.85rem; color: var(--text-secondary);">????Ë≥?</span>
        <span style="font-family: var(--font-title); font-size: 1.5rem; font-weight: 700; color: ${isLowStock ? 'var(--color-red)' : 'var(--text-primary)'};">
          ${item.quantity} <span style="font-size: 0.9rem; font-weight: normal; color: var(--text-muted);">${escapeHtml(item.unit)}</span>
        </span>
      </div>
      <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
        <button class="btn-outline" style="flex: 1; padding: 0.5rem; display: flex; justify-content: center; align-items: center; border-radius: 8px;" onclick="updateInventoryQuantity('${item.id}', -1)">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M19 13H5v-2h14v2z"/></svg>
        </button>
        <button class="btn-outline" style="flex: 1; padding: 0.5rem; display: flex; justify-content: center; align-items: center; border-radius: 8px;" onclick="updateInventoryQuantity('${item.id}', 1)">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
        </button>
      </div>
      ${isLowStock ? `
      <div style="margin-top: 0.5rem;">
        <button class="btn-primary" style="width: 100%; font-size: 0.85rem; padding: 0.5rem; background: var(--color-green); border-color: var(--color-green);" onclick="openRestockModal('${item.id}')">????åËÑ∞???/button>
      </div>` : ''}
    `;
    container.appendChild(card);
  });
  
  if (typeof renderInventoryRightPanel === 'function') {
    renderInventoryRightPanel();
  }
}

function selectInventoryIcon(icon) {
  document.getElementById('inventory-icon').value = icon;
  const container = document.getElementById('inventory-icon-selector');
  if (container) {
    Array.from(container.children).forEach(b => b.classList.remove('active'));
    Array.from(container.children).forEach(b => {
      if (b.innerText.includes(icon)) b.classList.add('active');
    });
  }
}

function selectRecurIcon(icon) {
  document.getElementById('recur-icon').value = icon;
  const container = document.getElementById('recur-icon-selector');
  if (container) {
    Array.from(container.children).forEach(b => b.classList.remove('active'));
    Array.from(container.children).forEach(b => {
      if (b.innerText.includes(icon)) b.classList.add('active');
    });
  }
}

function renderInventoryIconsDropdown() {
  const container = document.getElementById('inventory-icon-selector');
  if (!container) return;
  container.innerHTML = '';
  AppState.inventoryIcons.forEach(icon => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn-select-option';
    btn.onclick = () => selectInventoryIcon(icon);
    btn.innerText = icon;
    container.appendChild(btn);
  });
}

function populateInventoryCategories() {
  const areaSelect = document.getElementById('inventory-user-area');
  if (!areaSelect) return;
  areaSelect.innerHTML = '<option value="">?¢Ôï°Óº??®Ë???ª¬Ä??</option>';
  Object.keys(AppState.inventoryCategories).forEach(area => {
    const opt = document.createElement('option');
    opt.value = area;
    opt.innerText = area;
    areaSelect.appendChild(opt);
  });
}

function handleUserAreaChange() {
  const area = document.getElementById('inventory-user-area').value;
  const mainSelect = document.getElementById('inventory-main-category');
  const subSelect = document.getElementById('inventory-sub-category');
  
  mainSelect.innerHTML = '<option value="">?¢Ôï°Óº??©‰???/option>';
  subSelect.innerHTML = '<option value="">?¢Ô???Ë±??≠Ê??</option>';
  
  if (area && AppState.inventoryCategories[area]) {
    Object.keys(AppState.inventoryCategories[area]).forEach(main => {
      const opt = document.createElement('option');
      opt.value = main;
      opt.innerText = main;
      mainSelect.appendChild(opt);
    });
  }
}

function handleMainCategoryChange() {
  const area = document.getElementById('inventory-user-area').value;
  const main = document.getElementById('inventory-main-category').value;
  const subSelect = document.getElementById('inventory-sub-category');
  
  subSelect.innerHTML = '<option value="">?¢Ôï°Óº??´Êï¶??/option>';
  
  if (area && main && AppState.inventoryCategories[area][main]) {
    AppState.inventoryCategories[area][main].forEach(sub => {
      const opt = document.createElement('option');
      opt.value = sub;
      opt.innerText = sub;
      subSelect.appendChild(opt);
    });
  }
}

function handleSubCategoryChange() {
  const sub = document.getElementById('inventory-sub-category').value;
  if (sub && !document.getElementById('inventory-name').value) {
    document.getElementById('inventory-name').value = sub;
  }
}

function handleNotifyTypeChange() {
  const type = document.getElementById('inventory-notify-type').value;
  const group = document.getElementById('notify-value-group');
  if (type) {
    group.style.display = 'block';
    if (type === 'days') document.getElementById('inventory-notify-value').placeholder = '1-6';
    else if (type === 'weeks') document.getElementById('inventory-notify-value').placeholder = '1-4';
    else if (type === 'months') document.getElementById('inventory-notify-value').placeholder = '1-12';
    else document.getElementById('inventory-notify-value').placeholder = '????õË©®??;
  } else {
    group.style.display = 'none';
  }
}

let inventorySearchTimeout = null;
function handleInventorySearch(event) {
  const query = event.target.value.trim().toLowerCase();
  
  clearTimeout(inventorySearchTimeout);
  inventorySearchTimeout = setTimeout(() => {
    const resultsDiv = document.getElementById('inventory-search-results');
    
    if (!query) {
      resultsDiv.style.display = 'none';
      return;
    }
    
    resultsDiv.innerHTML = '';
    let found = false;
    
    Object.keys(AppState.inventoryCategories).forEach(area => {
      Object.keys(AppState.inventoryCategories[area]).forEach(main => {
        AppState.inventoryCategories[area][main].forEach(sub => {
          if (sub.toLowerCase().includes(query)) {
            found = true;
            const item = document.createElement('div');
            item.className = 'dropdown-item';
            item.style.cursor = 'pointer';
            item.innerText = `${area} > ${main} > ${sub}`;
            item.onclick = () => {
              document.getElementById('inventory-user-area').value = area;
              handleUserAreaChange();
              document.getElementById('inventory-main-category').value = main;
              handleMainCategoryChange();
              document.getElementById('inventory-sub-category').value = sub;
              handleSubCategoryChange();
              resultsDiv.style.display = 'none';
              document.getElementById('inventory-search').value = '';
            };
            resultsDiv.appendChild(item);
          }
        });
      });
    });
    
    if (found) {
      resultsDiv.style.display = 'block';
    } else {
    resultsDiv.style.display = 'none';
  }
}

function openAddInventoryModal() {
  document.getElementById('form-inventory').reset();
  document.getElementById('inventory-edit-id').value = '';
  document.getElementById('modal-inventory-title').innerText = '??????';
  
  renderInventoryIconsDropdown();
  selectInventoryIcon(AppState.inventoryIcons.length > 0 ? AppState.inventoryIcons[0] : '???);
  
  populateInventoryCategories();
  populateInventoryLocationsAndUnits();
  initExpiryDateSelects();
  
  document.getElementById('inventory-user-area').value = '';
  handleUserAreaChange();
  
  document.getElementById('inventory-notify-type').value = '';
  handleNotifyTypeChange();
  document.getElementById('inventory-in-date').value = new Date().toISOString().split('T')[0];
  
  openModal('modal-inventory');
}

function openEditInventoryModal(id) {
  const item = AppState.inventory.find(i => i.id === id);
  if (!item) return;
  document.getElementById('inventory-edit-id').value = item.id;
  
  populateInventoryCategories();
  populateInventoryLocationsAndUnits();
  initExpiryDateSelects();
  
  document.getElementById('inventory-user-area').value = item.userArea || '';
  handleUserAreaChange();
  document.getElementById('inventory-main-category').value = item.mainCategory || '';
  handleMainCategoryChange();
  document.getElementById('inventory-sub-category').value = item.subCategory || '';
  
  document.getElementById('inventory-store').value = item.store || '';
  document.getElementById('inventory-name').value = item.name || '';
  document.getElementById('inventory-in-date').value = item.inDate || new Date().toISOString().split('T')[0];
  document.getElementById('inventory-location').value = item.location || '';
  document.getElementById('inventory-quantity').value = item.quantity;
  document.getElementById('inventory-unit').value = item.unit || '';
  document.getElementById('inventory-threshold').value = item.threshold || '';
  
  if (item.expiryDate) {
    document.getElementById('inventory-expiry-date').value = item.expiryDate;
    const [y, m, d] = item.expiryDate.split('-');
    document.getElementById('inventory-expiry-year').value = y || '';
    document.getElementById('inventory-expiry-month').value = m ? parseInt(m, 10).toString() : '';
    document.getElementById('inventory-expiry-day').value = d ? parseInt(d, 10).toString() : '';
  } else {
    document.getElementById('inventory-expiry-date').value = '';
    document.getElementById('inventory-expiry-year').value = '';
    document.getElementById('inventory-expiry-month').value = '';
    document.getElementById('inventory-expiry-day').value = '';
  }
  
  document.getElementById('inventory-notify-type').value = item.notifyType || '';
  handleNotifyTypeChange();
  document.getElementById('inventory-notify-value').value = item.notifyValue || '';

  document.getElementById('modal-inventory-title').innerText = '?∫Âàª????';
  renderInventoryIconsDropdown();
  selectInventoryIcon(item.icon || (AppState.inventoryIcons.length > 0 ? AppState.inventoryIcons[0] : '???));
  openModal('modal-inventory');
  
  const menus = document.querySelectorAll('.dropdown-menu');
  menus.forEach(m => m.classList.remove('show'));
}

async function handleInventorySubmit(event) {
  event.preventDefault();
  const id = document.getElementById('inventory-edit-id').value;
  const userArea = document.getElementById('inventory-user-area').value;
  const mainCategory = document.getElementById('inventory-main-category').value;
  const subCategory = document.getElementById('inventory-sub-category').value;
  const store = document.getElementById('inventory-store').value;
  let name = document.getElementById('inventory-name').value.trim();
  
  // Requirement #2: If name is empty, use subcategory name
  if (!name) {
    name = subCategory;
  }
  
  const inDate = document.getElementById('inventory-in-date').value;
  const location = document.getElementById('inventory-location').value;
  const quantity = Number(document.getElementById('inventory-quantity').value);
  const unit = document.getElementById('inventory-unit').value;
  const threshold = Number(document.getElementById('inventory-threshold').value) || 0;
  const expiryDate = document.getElementById('inventory-expiry-date').value;
  const notifyType = document.getElementById('inventory-notify-type').value;
  const notifyValue = Number(document.getElementById('inventory-notify-value').value) || 0;
  const icon = document.getElementById('inventory-icon').value || '???;
  
  const payload = {
    userArea, mainCategory, subCategory, store, name, inDate, location, quantity, unit, threshold, expiryDate, notifyType, notifyValue, icon
  };
  
  if (id) {
    const idx = AppState.inventory.findIndex(i => i.id === id);
    if (idx !== -1) {
      AppState.inventory[idx] = { ...AppState.inventory[idx], ...payload };
    }
  } else {
    AppState.inventory.push({
      id: `inv_${Date.now()}`,
      ...payload
    });
  }
  
  await saveStateToStorage();
  renderInventory();
  closeModal('modal-inventory');
}

async function deleteInventoryItem(id) {
  if (confirm('?????¨Óºª???óËø®????ù¬Ä?????)) {
    AppState.inventory = AppState.inventory.filter(i => i.id !== id);
    await saveStateToStorage();
    renderInventory();
  }
}

async function updateInventoryQuantity(id, delta) {
  const item = AppState.inventory.find(i => i.id === id);
  if (item) {
    item.quantity = Math.max(0, item.quantity + delta);
    await saveStateToStorage();
    renderInventory();
  }
}

function generateShoppingList() {
  const container = document.getElementById('shopping-list-container');
  const lowStockItems = AppState.inventory.filter(i => i.threshold && i.quantity <= i.threshold);
  
  if (lowStockItems.length === 0) {
    alert('?Ê°Ä??ÆÓ¶π???≤Èõ≤?óÔóº?éÊï∫???Óº???);
    return;
  } else {
    let html = `<ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.5rem;">`;
    lowStockItems.forEach(item => {
      const needed = item.threshold - item.quantity + 1;
      html += `
        <li style="display: flex; justify-content: space-between; padding: 0.75rem; background: rgba(255,255,255,0.05); border-radius: 8px;">
          <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
            <input type="checkbox" checked class="shopping-item-check" data-id="${item.id}">
            <span>${item.icon || '???} ${escapeHtml(item.name)}</span>
          </label>
          <span style="color: var(--text-secondary); font-size: 0.85rem;">?±Á??çÈ?ÊΩ∏Áú∫??? ${needed} ${escapeHtml(item.unit)}</span>
        </li>
      `;
    });
    html += `</ul>`;
    container.innerHTML = html;
  }
  
  const splitSelect = document.getElementById('shopping-split-plan');
  splitSelect.innerHTML = `<option value="">-- ?Ë±???åËë£?ÆÔ???(??´Ó?) --</option>`;
  AppState.splitPlans.forEach(plan => {
    splitSelect.innerHTML += `<option value="${plan.id}">${escapeHtml(plan.name)}</option>`;
  });
  
  document.getElementById('shopping-total-amount').value = '';
  openModal('modal-shopping-list');
}

function openRestockModal(id) {
  openEditInventoryModal(id);
  document.getElementById('inventory-in-date').value = new Date().toISOString().split('T')[0];
  const qtyInput = document.getElementById('inventory-quantity');
  qtyInput.value = '';
  qtyInput.focus();
}

async function executeShoppingSplit() {
  const checks = document.querySelectorAll('.shopping-item-check:checked');
  if (checks.length === 0) {
    alert("?¢Ô??∑Ê??´Ôî∂?Ë®???∞Ó??éÁ???ÓΩ?");
    return;
  }
  
  const amount = Number(document.getElementById('shopping-total-amount').value);
  if (!amount || amount <= 0) {
    alert("?¢Ô???‰∫??????üÁú∫?ÆË≥°??øÔö°?");
    return;
  }
  
  const planId = document.getElementById('shopping-split-plan').value;
  
  checks.forEach(chk => {
    const id = chk.getAttribute('data-id');
    const item = AppState.inventory.find(i => i.id === id);
    if (item) {
      const needed = item.threshold - item.quantity + 1;
      item.quantity += needed;
    }
  });
  
  if (planId) {
    const plan = AppState.splitPlans.find(p => p.id === planId);
    if (plan) {
      const itemNames = Array.from(checks).map(c => {
        const id = c.getAttribute('data-id');
        const item = AppState.inventory.find(i => i.id === id);
        return item ? item.name : '';
      }).filter(n => n).join(', ');
      
      plan.transactions.push({
        id: `sptx_${Date.now()}`,
        name: `??üÁú∫: ${itemNames}`,
        amount: amount,
        paidBy: currentUser,
        date: new Date().toISOString().split('T')[0]
      });
      alert(`?åËÑ´??Ó∏???ØÊ??ÆÓ???ùË?? ${formatAccounting(amount)} ?ßÔê£???åËë£?ÆÔ????{plan.name}???`);
    }
  } else {
    alert(`?åËÑ´??Ó∏???ØÊ??ÆÓ??(????óÓ´±Óæ??∑Ó??????îæ???`);
  }
  
  await saveStateToStorage();
  renderInventory();
  if (planId) renderSplitPlans();
  closeModal('modal-shopping-list');
}

// --- RENDER 6: Split Bill ---
function renderSplitPlans() {
  const container = document.getElementById('split-plans-container');
  container.innerHTML = '';
  
  if (AppState.splitPlans.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <svg viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 1.34 5 3s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V20h14v-3.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
        <p>?Ê°Ä??ùÓ???ûÈ¢±???åËë£?ÆÔ???/p>
      </div>
    `;
    return;
  }

  AppState.splitPlans.forEach(plan => {
    const card = document.createElement('div');
    card.className = 'split-plan-card';
    
    // Status text
    const statusLabel = plan.status === 'settled' ? '?åËÑ©??? : '??åËë£??;
    const statusClass = plan.status === 'settled' ? 'settled' : 'active';

    // Summary of total spend
    const totalSpend = plan.transactions.reduce((sum, tx) => sum + Number(tx.amount), 0);

    // Member chips are built later

    // Generate settlement UI if settled
    let settlementHtml = '';
    if (plan.status === 'settled' && plan.settlement) {
      const instructions = plan.settlement.map(inst => `
        <div style="display: flex; justify-content: space-between; font-size: 0.8125rem; border-bottom: 1px dashed rgba(255,255,255,0.05); padding: 0.25rem 0;">
          <span>?? <strong>${escapeHtml(inst.from)}</strong> ?????<strong>${escapeHtml(inst.to)}</strong></span>
          <span style="color: var(--color-purple); font-weight: bold;">${formatAccounting(inst.amount)}</span>
        </div>
      `).join('');

      // Generate Visual repayment map
      let diagramSvg = '';
      if (plan.settlement.length > 0) {
        const center = 80;
        const radius = 50;
        const coords = {};
        const count = plan.members.length;
        
        plan.members.forEach((m, idx) => {
          const angle = (idx / count) * 2 * Math.PI - Math.PI/2;
          coords[m] = {
            x: center + radius * Math.cos(angle),
            y: center + radius * Math.sin(angle)
          };
        });

        let lines = '';
        plan.settlement.forEach((inst) => {
          const fromC = coords[inst.from];
          const toC = coords[inst.to];
          if (fromC && toC) {
            const dx = toC.x - fromC.x;
            const dy = toC.y - fromC.y;
            const len = Math.sqrt(dx*dx + dy*dy) || 1;
            const startX = fromC.x + (dx / len) * 12;
            const startY = fromC.y + (dy / len) * 12;
            const endX = toC.x - (dx / len) * 15;
            const endY = toC.y - (dy / len) * 15;
            
            const midX = (startX + endX) / 2;
            const midY = (startY + endY) / 2 - 4;

            lines += `
              <line x1="${startX}" y1="${startY}" x2="${endX}" y2="${endY}" 
                stroke="var(--color-purple)" stroke-width="2" marker-end="url(#arrow)" />
              <text x="${midX}" y="${midY}" font-family="var(--font-title)" font-size="7" font-weight="bold" fill="#00F2FE" text-anchor="middle">
                $${inst.amount}
              </text>
            `;
          }
        });

        let nodes = '';
        plan.members.forEach(m => {
          const c = coords[m];
          const isMe = m === '?? || m === currentUser;
          const color = isMe ? '#00F2FE' : '#FF5B94';
          nodes += `
            <circle cx="${c.x}" cy="${c.y}" r="11" fill="var(--bg-card-solid)" stroke="${color}" stroke-width="1.5" />
            <text x="${c.x}" y="${c.y + 3}" font-family="sans-serif" font-size="8" font-weight="bold" fill="#FFF" text-anchor="middle">
              ${escapeHtml(m.slice(0, 1))}
            </text>
            <text x="${c.x}" y="${c.y > center ? c.y + 18 : c.y - 14}" font-family="sans-serif" font-size="7" fill="var(--text-secondary)" text-anchor="middle">
              ${escapeHtml(m)}
            </text>
          `;
        });

        diagramSvg = `
          <div style="display: flex; justify-content: center; background: rgba(0,0,0,0.15); border-radius: 12px; padding: 0.5rem; margin: 0.75rem 0;">
            <svg width="160" height="160" viewBox="0 0 160 160" style="overflow: visible;">
              <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="var(--color-purple)"/>
                </marker>
              </defs>
              ${lines}
              ${nodes}
            </svg>
          </div>
        `;
      }

      const rawReport = generateSplitPlanReportText(plan);

      settlementHtml = `
        <div class="split-settlement-results">
          <div class="settlement-title">????ØÓ????ñÊï¶??????</div>
          ${diagramSvg}
          ${instructions || '<div style="font-size: 0.75rem; color: var(--text-muted);">????åËÑ£?????üÂ??????????/div>'}
          <button class="btn-select-option" style="margin-top: 0.5rem; width: 100%; border-color: var(--color-purple); color: var(--color-purple);" onclick="copyToClipboard(\`${rawReport}\`)">
            ?¥Ôã¨??ØÓ????? (??ãÊ?Line)
          </button>
        </div>
      `;
    } else {
      // Active plan controls
      settlementHtml = `
        <div style="display: flex; gap: 0.5rem; margin-top: auto; align-items: flex-end;">
          <button class="btn-primary" style="flex: 1; padding: 0.75rem 0.5rem; justify-content: center; font-size: 0.875rem; border-radius: 14px;" onclick="openAddSplitTransModal('${plan.id}')">
            ?ÆÓ¶∂???ñÆ??
          </button>
          <div class="settle-btn-wrapper" style="position: relative; display: inline-flex; flex: 1;">
            <div class="peeking-cat" style="display: flex; align-items: flex-end; justify-content: center; width: 40px; height: 32px; overflow: hidden; position: absolute; top: -20px; left: 10px;">
              ${getMascotSvg(AppState.petTheme, 40)}
            </div>
            <button class="btn-settle-celebrate" onclick="settleSplitPlan('${plan.id}')" style="border: 2px solid var(--theme-color) !important; color: var(--text-primary) !important; box-shadow: none !important;">
              ?ØÓ???áÊñπ???
            </button>
          </div>
        </div>
      `;
    }

    // List of internal transactions
    let txLogList = '';
    if (plan.transactions.length > 0) {
      txLogList = plan.transactions.map(t => `
        <div style="display: flex; justify-content: space-between; font-size: 0.8125rem; color: var(--text-secondary); margin-bottom: 0.25rem;">
          <span>${t.date ? `<span style="font-size:0.75rem; color:var(--text-muted); margin-right:0.4rem;">[${t.date}]</span>` : ''}${escapeHtml(t.name)} (??${escapeHtml(t.payer)} ?ìÔíø?)</span>
          <span>${formatAccounting(t.amount)}</span>
        </div>
      `).slice(0, 3).join('') + (plan.transactions.length > 3 ? '<div style="font-size: 0.75rem; color: var(--text-muted); text-align: center;">... ??Ä?Ä?ûÓ°Ω???/div>' : '');
    } else {
      txLogList = '<div style="font-size: 0.75rem; color: var(--text-muted);">??©È??øÓ???????/div>';
    }

    // Build member chips (Single line with icons)
    const memberChips = plan.members.map(m => `
      <div class="split-member-item" style="background: rgba(255,255,255,0.05); padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.8125rem; flex-shrink: 0;">
        <span>${escapeHtml(m)}</span>
      </div>
    `).join('');

    card.innerHTML = `
      <div class="split-plan-header">
        <span class="split-plan-title">${escapeHtml(plan.name)}</span>
        <span class="split-plan-status ${statusClass}">${statusLabel}</span>
      </div>
      <div class="split-plan-meta">
        <div>?‰∫????? ${plan.startDate} ~ ${plan.endDate}</div>
        <div style="font-weight: 700; margin-top: 0.25rem;">?ÆÔ??•ËùÆË≥™Ô??? <span style="color: var(--color-purple); font-size: 1.1rem;">${formatAccounting(totalSpend)}</span></div>
      </div>
      
      <div class="split-plan-members" style="display: flex; gap: 0.5rem; overflow-x: auto; padding-bottom: 0.5rem; scrollbar-width: thin; -webkit-overflow-scrolling: touch;">
        ${memberChips}
      </div>

      <div style="background: rgba(255,255,255,0.01); border: 1px solid rgba(255,255,255,0.02); padding: 0.75rem; border-radius: 10px; display: flex; flex-direction: column; gap: 0.35rem;">
        <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: bold; border-bottom: 1px solid rgba(255,255,255,0.04); padding-bottom: 0.25rem;">?àÊö∏??ù¬Ä??/div>
        ${txLogList}
      </div>

      ${settlementHtml}

      <div style="display: flex; justify-content: flex-end; margin-top: 0.25rem;">
        <button class="btn-icon-action" onclick="deleteSplitPlan('${plan.id}')" title="??∑Ó??áÊñπ???>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
        </button>
      </div>
    `;
    
    container.appendChild(card);
  });
  
  if (typeof renderSplitRightPanel === 'function') {
    renderSplitRightPanel();
  }
}

function generateSplitPlanReportText(plan) {
  const totalSpend = plan.transactions.reduce((sum, tx) => sum + Number(tx.amount), 0);
  let rText = `?? ${plan.name} ?ØÓ????? ??\n`;
  rText += `?????Ó∏???{plan.startDate} ??${plan.endDate}\n`;
  rText += `?ÆË≥™??Ê¢ØÁ••??{formatAccounting(totalSpend)}\n`;
  rText += `--------------------\n`;
  rText += `??ìÁã°?úÔÜ±??Â≠??íÓ???óÓ?n`;
  
  if (plan.settlement && plan.settlement.length > 0) {
    plan.settlement.forEach(inst => {
      rText += `?? ??{inst.from}????????Á≠???{inst.to}??${formatAccounting(inst.amount)}\n`;
    });
  } else {
    rText += `??™Óæ®?Ó©??ΩÓø¢?????ßÔê£???Óªîn`;
  }
  rText += `--------------------\n`;
  rText += `?Ó∏??≠Êâπ???????`;
  return rText;
}

// --- RENDER 6: Carrier Invoices Simulator ---
function renderCarrierInvoices() {
  const displayBarcode = document.getElementById('display-carrier-barcode');
  const setupBtn = document.getElementById('btn-setup-carrier-text');
  
  if (AppState.carrierBarcode) {
    displayBarcode.innerText = AppState.carrierBarcode;
    setupBtn.innerText = '?ΩÊ†º?ñÈ????';
  } else {
    displayBarcode.innerText = '?†Ó´±ÓØØÈñÆ???õÔê£??;
    setupBtn.innerText = '?ÆÂ???õÔê£??;
  }

  const container = document.getElementById('carrier-invoices-review-list');
  container.innerHTML = '';
  
  const unconfirmed = AppState.carrierInvoices.filter(inv => !inv.paymentConfirmed);
  
  if (unconfirmed.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="padding: 2rem;">
        <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
        <p>?Ê°Ä??ùÓ???∫ÔÜØÁ•?Ë≤??õÔê£??ÊΩõÂ∑®</p>
      </div>
    `;
    return;
  }

  unconfirmed.forEach(inv => {
    const card = document.createElement('div');
    card.className = 'invoice-item-card';

    const itemsText = inv.items.map(it => `${it.name}($${it.price})`).join('??);
    
    // Construct account choices dropdown
    const selectOptions = AppState.accounts.map(acc => {
      const selected = acc.id === inv.suggestedAccount ? 'selected' : '';
      return `<option value="${acc.id}" ${selected}>${escapeHtml(acc.name)}</option>`;
    }).join('');

    card.innerHTML = `
      <div class="invoice-details">
        <div class="invoice-store">${escapeHtml(inv.store)}</div>
        <div class="invoice-date">${inv.date} ???ÊΩõÂ∑®?Ó∏É‚Ö£??{inv.invoiceNo || '??} ??????õÔê£???¨ÔÖØ</div>
        <div class="invoice-items-summary">??ñÊï¶??{escapeHtml(itemsText)}</div>
      </div>
      <div class="invoice-action-panel">
        <div class="invoice-amount">${formatAccounting(inv.amount)}</div>
        <div style="display: flex; gap: 0.5rem; align-items: center;">
          <select id="inv-pay-acc-${inv.id}" style="padding: 0.25rem 0.5rem; font-size: 0.8125rem; border-radius: 6px; width: auto; background: var(--bg-input);">
            ${selectOptions}
          </select>
          <button class="btn-primary" style="padding: 0.25rem 0.75rem; font-size: 0.8125rem; box-shadow: none;" onclick="confirmCarrierInvoice('${inv.id}')">
            ?????ÆÓ¶∂??
          </button>
        </div>
      </div>
    `;
    
    container.appendChild(card);
  });
}

// --- RENDER 7: Categories chips ---
function renderCategories() {
  const expContainer = document.getElementById('expense-categories-chips');
  const incContainer = document.getElementById('income-categories-chips');
  
  if (!expContainer || !incContainer) return;
  
  expContainer.innerHTML = '';
  incContainer.innerHTML = '';

  const expSearchInput = document.getElementById('search-expense-cat');
  const incSearchInput = document.getElementById('search-income-cat');
  
  const expQuery = expSearchInput ? expSearchInput.value.trim().toLowerCase() : '';
  const incQuery = incSearchInput ? incSearchInput.value.trim().toLowerCase() : '';

  AppState.categories.expense.forEach(cat => {
    if (expQuery && !cat.toLowerCase().includes(expQuery)) {
      return;
    }
    const chip = document.createElement('div');
    chip.className = 'category-editable-chip';
    chip.innerHTML = `
      <span>${escapeHtml(cat)}</span>
      <button class="btn-del-cat" onclick="deleteCategory('expense', '${cat}')">?</button>
    `;
    expContainer.appendChild(chip);
  });

  AppState.categories.income.forEach(cat => {
    if (incQuery && !cat.toLowerCase().includes(incQuery)) {
      return;
    }
    const chip = document.createElement('div');
    chip.className = 'category-editable-chip';
    chip.innerHTML = `
      <span>${escapeHtml(cat)}</span>
      <button class="btn-del-cat" onclick="deleteCategory('income', '${cat}')">?</button>
    `;
    incContainer.appendChild(chip);
  });

  // Render Inventory Icons
  const invIconsContainer = document.getElementById('inventory-icons-chips');
  if (invIconsContainer) {
    invIconsContainer.innerHTML = '';
    AppState.inventoryIcons.forEach(icon => {
      const chip = document.createElement('div');
      chip.className = 'category-editable-chip';
      chip.innerHTML = `
        <span>${escapeHtml(icon)}</span>
        <button class="btn-del-cat" onclick="deleteIcon('inventory', '${icon}')">?</button>
      `;
      invIconsContainer.appendChild(chip);
    });
  }

  // Render Recurring Icons
  const recIconsContainer = document.getElementById('recurring-icons-chips');
  if (recIconsContainer) {
    recIconsContainer.innerHTML = '';
    AppState.recurringIcons.forEach(icon => {
      const chip = document.createElement('div');
      chip.className = 'category-editable-chip';
      chip.innerHTML = `
        <span>${escapeHtml(icon)}</span>
        <button class="btn-del-cat" onclick="deleteIcon('recurring', '${icon}')">?</button>
      `;
      recIconsContainer.appendChild(chip);
    });
  }

  // Render Wishlist Icons
  const wishlistIconsContainer = document.getElementById('wishlist-icons-chips');
  if (wishlistIconsContainer) {
    wishlistIconsContainer.innerHTML = '';
    if (!AppState.wishlistIcons) AppState.wishlistIcons = ['??', '?àÔ?', '??', '??', '?ì±']; // default fallback
    AppState.wishlistIcons.forEach(icon => {
      const chip = document.createElement('div');
      chip.className = 'category-editable-chip';
      chip.innerHTML = `
        <span>${escapeHtml(icon)}</span>
        <button class="btn-del-cat" onclick="deleteIcon('wishlist', '${icon}')">?</button>
      `;
      wishlistIconsContainer.appendChild(chip);
    });
  }

  // Render Inventory Locations
  const locationChipsContainer = document.getElementById('location-chips');
  if (locationChipsContainer) {
    locationChipsContainer.innerHTML = '';
    if (!AppState.inventoryLocations) AppState.inventoryLocations = ['ÂÆ¢Âª≥', 'ÂªöÊàø', 'Êµ¥ÂÆ§', '?•ÂÆ§', '?≤Ë?ÂÆ?, 'Ëªä‰?', 'Ëæ¶ÂÖ¨ÂÆ?, '?ΩÂè∞'];
    AppState.inventoryLocations.forEach(loc => {
      const chip = document.createElement('div');
      chip.className = 'category-editable-chip';
      chip.innerHTML = `
        <span>${escapeHtml(loc)}</span>
        <button class="btn-del-cat" onclick="deleteInventoryLocation('${loc}')">?</button>
      `;
      locationChipsContainer.appendChild(chip);
    });
  }

  // Render Inventory Units
  const unitChipsContainer = document.getElementById('unit-chips');
  if (unitChipsContainer) {
    unitChipsContainer.innerHTML = '';
    if (!AppState.inventoryUnits) AppState.inventoryUnits = ['??, '??, '??, '??, 'Ë¢?, 'ÁΩ?, 'Ê¢?, '??, 'Áµ?, '??, '??, 'Âº?];
    AppState.inventoryUnits.forEach(u => {
      const chip = document.createElement('div');
      chip.className = 'category-editable-chip';
      chip.innerHTML = `
        <span>${escapeHtml(u)}</span>
        <button class="btn-del-cat" onclick="deleteInventoryUnit('${u}')">?</button>
      `;
      unitChipsContainer.appendChild(chip);
    });
  }
}

let filterCatTimeout = null;
function filterCategories(type) {
  clearTimeout(filterCatTimeout);
  filterCatTimeout = setTimeout(() => {
    renderCategories();
  }, 250);
}

function addIcon(type) {
  let inputId;
  if (type === 'inventory') inputId = 'new-inventory-icon-input';
  else if (type === 'wishlist') inputId = 'new-wishlist-icon-input';
  else inputId = 'new-recurring-icon-input';
  
  const inputEl = document.getElementById(inputId);
  if (!inputEl) return;
  const newIcon = inputEl.value.trim();
  if (!newIcon) return;
  
  if (type === 'inventory') {
    if (!AppState.inventoryIcons.includes(newIcon)) {
      AppState.inventoryIcons.push(newIcon);
    }
  } else if (type === 'wishlist') {
    if (!AppState.wishlistIcons) AppState.wishlistIcons = ['??', '?àÔ?', '??', '??', '?ì±'];
    if (!AppState.wishlistIcons.includes(newIcon)) {
      AppState.wishlistIcons.push(newIcon);
    }
  } else {
    if (!AppState.recurringIcons.includes(newIcon)) {
      AppState.recurringIcons.push(newIcon);
    }
  }
  
  inputEl.value = '';
  saveStateToStorage();
  renderCategories();
}

function deleteIcon(type, icon) {
  if (!confirm(`Á¢∫Â?Ë¶ÅÂà™?§Â?Ê®?[${icon}] ?éÔ?`)) return;
  if (type === 'inventory') {
    AppState.inventoryIcons = AppState.inventoryIcons.filter(i => i !== icon);
  } else if (type === 'wishlist') {
    AppState.wishlistIcons = AppState.wishlistIcons.filter(i => i !== icon);
  } else {
    AppState.recurringIcons = AppState.recurringIcons.filter(i => i !== icon);
  }
  saveStateToStorage();
  renderCategories();
}

function addInventoryLocation() {
  const inputEl = document.getElementById('new-location-input');
  if (!inputEl) return;
  const val = inputEl.value.trim();
  if (!val) return;
  
  if (!AppState.inventoryLocations) AppState.inventoryLocations = ['ÂÆ¢Âª≥', 'ÂªöÊàø', 'Êµ¥ÂÆ§', '?•ÂÆ§', '?≤Ë?ÂÆ?, 'Ëªä‰?', 'Ëæ¶ÂÖ¨ÂÆ?, '?ΩÂè∞'];
  if (!AppState.inventoryLocations.includes(val)) {
    AppState.inventoryLocations.push(val);
  }
  inputEl.value = '';
  saveStateToStorage();
  renderCategories();
  populateInventoryLocationsAndUnits(); // Update any dropdowns if rendered
}

function deleteInventoryLocation(loc) {
  if (!confirm(`Á¢∫Â?Ë¶ÅÂà™?§ÂÖ•?â‰?ÁΩ?[${loc}] ?éÔ?`)) return;
  AppState.inventoryLocations = AppState.inventoryLocations.filter(i => i !== loc);
  saveStateToStorage();
  renderCategories();
  populateInventoryLocationsAndUnits();
}

function addInventoryUnit() {
  const inputEl = document.getElementById('new-unit-input');
  if (!inputEl) return;
  const val = inputEl.value.trim();
  if (!val) return;
  
  if (!AppState.inventoryUnits) AppState.inventoryUnits = ['??, '??, '??, '??, 'Ë¢?, 'ÁΩ?, 'Ê¢?, '??, 'Áµ?, '??, '??, 'Âº?];
  if (!AppState.inventoryUnits.includes(val)) {
    AppState.inventoryUnits.push(val);
  }
  inputEl.value = '';
  saveStateToStorage();
  renderCategories();
  populateInventoryLocationsAndUnits();
}

function deleteInventoryUnit(unit) {
  if (!confirm(`Á¢∫Â?Ë¶ÅÂà™?§ÂñÆ‰Ω?[${unit}] ?éÔ?`)) return;
  AppState.inventoryUnits = AppState.inventoryUnits.filter(i => i !== unit);
  saveStateToStorage();
  renderCategories();
  populateInventoryLocationsAndUnits();
}

// --- RENDER 8: Side Panel Updates ---
function updateRightPanel() {
  const incomeVal = document.getElementById('right-day-income');
  const expenseVal = document.getElementById('right-day-expense');
  const netVal = document.getElementById('right-day-net');
  
  // 1. Day totals
  const dayTx = AppState.transactions.filter(t => t.date === selectedDate);
  const upcomingTx = getUpcomingForDate(selectedDate);
  
  const titleEl = document.getElementById('right-panel-title');
  const todayStr = new Date().toISOString().split('T')[0];
  if (titleEl) {
    titleEl.innerText = selectedDate === todayStr ? '?ûÔ?Ó£??ÜÓ??ÆË≥™?' : `${selectedDate.replace(/-/g, '/')} ??ÜÓ??ÆË≥™?`;
  }

  let incSum = 0;
  let expSum = 0;
  dayTx.forEach(t => {
    if (t.type === 'income') incSum += Number(t.amount);
    if (t.type === 'expense') expSum += Number(t.amount);
  });
  
  incomeVal.innerText = formatAccounting(incSum);
  expenseVal.innerText = formatAccounting(-expSum);
  netVal.innerText = formatAccounting(incSum - expSum);

  // 2. Account balances calculated dynamically up to selected date
  const estimatesList = document.getElementById('right-accounts-estimates');
  estimatesList.innerHTML = '';
  
  const { balances, creditSpent } = calculateBalancesAtDate(selectedDate);
  
  AppState.accounts.forEach(acc => {
    const item = document.createElement('div');
    item.className = 'estimate-item';
    
    let dotClass = 'cash';
    if (acc.type === 'bank') dotClass = 'bank';
    if (acc.type === 'securities') dotClass = 'securities';
    
    let valText = '';
    if (acc.type === 'credit') {
      const cycleStatus = getCreditCardCycleStatus(acc, new Date());
      valText = `??êÓ?: ${formatAccounting(cycleStatus.availableLimit)}`;
    } else if (acc.type === 'securities') {
      const total = balances[acc.id].balance + balances[acc.id].securitiesInvested;
      valText = formatAccounting(total);
    } else {
      valText = formatAccounting(balances[acc.id].balance);
    }

    item.innerHTML = `
      <span class="estimate-name">
        <span class="account-dot ${dotClass}"></span>
        ${escapeHtml(acc.name)}
      </span>
      <span class="estimate-val">${valText}</span>
    `;
    estimatesList.appendChild(item);
  });

  // 3. Credit Card billing/due reminders
  const ccAlerts = document.getElementById('right-cc-alerts');
  ccAlerts.innerHTML = '';

  const creditCards = AppState.accounts.filter(acc => acc.type === 'credit');
  const today = new Date();
  const currentDayNum = today.getDate();

  let hasAlerts = false;

  creditCards.forEach(card => {
    const cycleStatus = getCreditCardCycleStatus(card, today);
    const spent = creditSpent[card.id];
    // Check if tomorrow is billing or payment due
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDayNum = tomorrow.getDate();

    const billingDay = Number(card.billingDay);
    const dueDay = Number(card.dueDay);

    const isTomorrowBilling = tomorrowDayNum === billingDay;
    const isTomorrowDue = tomorrowDayNum === dueDay;
    const isLowLimit = cycleStatus.isBelowThreshold;

    if (isTomorrowBilling || isTomorrowDue || spent > 0 || isLowLimit) {
      hasAlerts = true;
      const alertCard = document.createElement('div');
      alertCard.className = 'cc-alert-card';
      
      let alertTitle = escapeHtml(card.name);
      let alertContent = `?Ê°Ä??????ñ≥Ó°?????{formatAccounting(spent)}<br>??êÓ??øÔ?Êº≤Â??{formatAccounting(cycleStatus.availableLimit)} / ${formatAccounting(Number(card.creditLimit) || 100000)}<br>?•Óê≤???${card.billingDay} ?Ó∏ÉÓæ≠?ØÓ???‰º??•Óê≤???${card.dueDay} ?Ó∏ÉÓæ≠?úÂîæÁ•???ø´?‰πì¬ÄÓΩ?
      
      if (isTomorrowBilling) {
        alertTitle = `?Ó∫? ??ïÓ??ØÓ????- ${card.name}`;
        alertContent = `????????î‰?????ØÓ?????ºÊ??ÆÔ?ÓØØËùØ???????${formatAccounting(spent)}?ÓΩ?
      } else if (isTomorrowDue) {
        alertTitle = `?Ó™???ïÓ??úÂîæÁ•???ø´??- ${card.name}`;
        alertContent = `?∫Ô??‰º???î‰???????ø´?úÂîæÁ••Â????????åËÑ∞???????${formatAccounting(spent)} ???`;
      } else if (isLowLimit) {
        alertTitle = `?Ó∫? ?øÔ?Êº????Ó§õÓ? - ${card.name}`;
        alertCard.style.borderColor = 'rgba(239, 68, 68, 0.4)';
        alertCard.style.background = 'rgba(239, 68, 68, 0.08)';
        alertContent = `?ÖË°£?ßÂ?ÓºªÓèª????®Ë??ßÊ??<strong>${formatAccounting(cycleStatus.availableLimit)}</strong>?óÔóπ??ÊΩ∏È??∑Á≤π???${formatAccounting(card.warningThreshold || 0)}?óÓ?;
      }

      alertCard.innerHTML = `
        <div class="cc-alert-header" style="${isLowLimit ? 'color: var(--color-red);' : ''}">
          <span>${alertTitle}</span>
        </div>
        <div class="cc-alert-info">
          ${alertContent}
        </div>
      `;
      ccAlerts.appendChild(alertCard);
    }
  });

  if (!hasAlerts) {
    ccAlerts.innerHTML = `
      <div style="font-size: 0.8125rem; color: var(--text-muted); text-align: center; padding: 1rem;">
        ????‰∫¶Â??éÈ???ØÓ???????
      </div>
    `;
  }
}

// --- Forms Event Listeners and Modals logic ---
function openModal(modalId) {
  document.getElementById(modalId).classList.add('open');
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove('open');
}

// Handle transaction input types switching (expense, income, transfer)
function setTransType(type) {
  document.getElementById('trans-type').value = type;
  
  // Toggle Active style on selector buttons
  const buttons = document.querySelectorAll('#trans-type-selector button');
  buttons.forEach(btn => {
    if (btn.innerText === (type === 'expense' ? '??¨Ôäæ' : type === 'income' ? '??ÖÔÖØ' : '?ßÔê£??)) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Adjust Form elements based on type
  const srcGrp = document.getElementById('form-group-source-account');
  const dstGrp = document.getElementById('form-group-dest-account');
  const catGrp = document.getElementById('form-group-category');
  const labelSrc = document.getElementById('label-source-account');

  if (type === 'transfer') {
    srcGrp.style.display = 'block';
    dstGrp.style.display = 'block';
    catGrp.style.display = 'none';
    labelSrc.innerText = '?ßÔê£?æÊí£?ÆÔ?';
  } else {
    srcGrp.style.display = 'block';
    dstGrp.style.display = 'none';
    catGrp.style.display = 'block';
    labelSrc.innerText = type === 'expense' ? '???°Êí£?ÆÔ?' : '??ÜÁã°??ñÆ??;
  }

  // Update amount input color based on transaction type
  const amountInput = document.getElementById('trans-amount');
  if (amountInput) {
    if (type === 'expense') {
      amountInput.style.color = 'var(--color-red)';
      amountInput.style.borderColor = 'var(--color-red)';
      amountInput.style.boxShadow = '0 0 0 2px rgba(239, 68, 68, 0.2)';
    } else if (type === 'income') {
      amountInput.style.color = 'var(--color-green)';
      amountInput.style.borderColor = 'var(--color-green)';
      amountInput.style.boxShadow = '0 0 0 2px rgba(16, 185, 129, 0.2)';
    } else {
      amountInput.style.color = 'var(--color-purple)';
      amountInput.style.borderColor = 'var(--color-purple)';
      amountInput.style.boxShadow = '0 0 0 2px rgba(139, 92, 246, 0.2)';
    }
  }

  // Reload category dropdown based on type
  populateCategoryDropdown(type);
  
  checkShowCcInstallmentOptions();
}

function populateCategoryDropdown(type) {
  const select = document.getElementById('trans-category');
  select.innerHTML = '';
  const cats = AppState.categories[type] || [];
  cats.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c;
    opt.innerText = c;
    select.appendChild(opt);
  });
}

function populateAccountDropdowns() {
  const srcSel = document.getElementById('trans-account');
  const dstSel = document.getElementById('trans-dest-account');
  
  srcSel.innerHTML = '';
  dstSel.innerHTML = '';

  AppState.accounts.forEach(acc => {
    // Source Account Options
    const opt1 = document.createElement('option');
    opt1.value = acc.id;
    opt1.innerText = acc.name;
    srcSel.appendChild(opt1);

    // Destination Account Options (transfers)
    const opt2 = document.createElement('option');
    opt2.value = acc.id;
    opt2.innerText = acc.name;
    dstSel.appendChild(opt2);
  });
}

// --- Popover and Account selection helpers ---
function handleAccountTypeSelectBtn(direction, type) {
  const filtered = AppState.accounts.filter(a => a.type === type);
  const popover = document.getElementById(`popover-${direction}`);
  
  closeAllAccountPopovers();
  
  if (filtered.length === 0) {
    alert(`????????ìÓµ£?ôÈõø?ù¬Ä?{getAccountTypeChineseName(type)}??óËë£?Â°??¢Ô???????∫Ëë£???????û‚??????ÓººÓ??ìÓµÆ?`);
    return;
  }
  
  const mainBtn = document.getElementById(`btn-${direction}-${type}`);
  
  if (filtered.length === 1) {
    selectAccount(direction, type, filtered[0].id, filtered[0].name);
  } else {
    popover.innerHTML = '';
    popover.classList.add('open');
    
    // Add header to popover
    const header = document.createElement('div');
    header.className = 'account-popover-header';
    header.innerText = `?Ë±?${getAccountTypeChineseName(type)}`;
    popover.appendChild(header);

    filtered.forEach(acc => {
      const item = document.createElement('div');
      item.className = 'account-popover-item';
      item.innerText = acc.name;
      item.onclick = (e) => {
        e.stopPropagation();
        selectAccount(direction, type, acc.id, acc.name);
        popover.classList.remove('open');
      };
      popover.appendChild(item);
    });
    
    const handler = (e) => {
      if (!popover.contains(e.target) && e.target !== mainBtn) {
        popover.classList.remove('open');
        document.removeEventListener('click', handler);
      }
    };
    setTimeout(() => {
      document.addEventListener('click', handler);
    }, 50);
  }
}

function selectAccount(direction, type, accountId, accountName) {
  const inputEl = document.getElementById(direction === 'src' ? 'trans-account' : 'trans-dest-account');
  if (inputEl) {
    inputEl.value = accountId;
  }
  
  const buttons = document.querySelectorAll(`#trans-account-type-buttons-${direction} button`);
  buttons.forEach(btn => {
    btn.classList.remove('active');
  });
  
  const activeBtn = document.getElementById(`btn-${direction}-${type}`);
  if (activeBtn) {
    activeBtn.classList.add('active');
    activeBtn.innerText = accountName;
  }
  
  if (direction === 'src') {
    checkShowCcInstallmentOptions();
  }
}

function closeAllAccountPopovers() {
  const p1 = document.getElementById('popover-src');
  const p2 = document.getElementById('popover-dst');
  if (p1) p1.classList.remove('open');
  if (p2) p2.classList.remove('open');
}

function getAccountTypeChineseName(type) {
  const mapping = { cash: '???', bank: '????, credit: '?Ω‚????, securities: '?ÖÔê£??? };
  return mapping[type] || '??ñÆ??;
}

function resetAccountButtons() {
  document.getElementById('btn-src-cash').innerText = "????Ôº?";
  document.getElementById('btn-src-bank').innerText = "???µÔó∫???;
  document.getElementById('btn-src-credit').innerText = "?Ω‚????;
  document.getElementById('btn-src-securities').innerText = "?ÖÔê£???;

  document.getElementById('btn-dst-cash').innerText = "????Ôº?";
  document.getElementById('btn-dst-bank').innerText = "???µÔó∫???;
  document.getElementById('btn-dst-credit').innerText = "?Ω‚????;
  document.getElementById('btn-dst-securities').innerText = "?ÖÔê£???;

  const btns = document.querySelectorAll('.btn-account-select');
  btns.forEach(btn => btn.classList.remove('active'));

  document.getElementById('trans-account').value = '';
  document.getElementById('trans-dest-account').value = '';

  closeAllAccountPopovers();
}

function updateAccountButtonsFromInputs() {
  closeAllAccountPopovers();

  // For source account
  const srcId = document.getElementById('trans-account').value;
  const srcAcc = AppState.accounts.find(a => a.id === srcId);
  
  document.getElementById('btn-src-cash').innerText = "????Ôº?";
  document.getElementById('btn-src-bank').innerText = "???µÔó∫???;
  document.getElementById('btn-src-credit').innerText = "?Ω‚????;
  document.getElementById('btn-src-securities').innerText = "?ÖÔê£???;
  
  const srcBtns = document.querySelectorAll('#trans-account-type-buttons-src button');
  srcBtns.forEach(btn => btn.classList.remove('active'));

  if (srcAcc) {
    const activeBtn = document.getElementById(`btn-src-${srcAcc.type}`);
    if (activeBtn) {
      activeBtn.classList.add('active');
      activeBtn.innerText = srcAcc.name;
    }
  }

  // For destination account
  const dstId = document.getElementById('trans-dest-account').value;
  const dstAcc = AppState.accounts.find(a => a.id === dstId);

  document.getElementById('btn-dst-cash').innerText = "????Ôº?";
  document.getElementById('btn-dst-bank').innerText = "???µÔó∫???;
  document.getElementById('btn-dst-credit').innerText = "?Ω‚????;
  document.getElementById('btn-dst-securities').innerText = "?ÖÔê£???;

  const dstBtns = document.querySelectorAll('#trans-account-type-buttons-dst button');
  dstBtns.forEach(btn => btn.classList.remove('active'));

  if (dstAcc) {
    const activeBtn = document.getElementById(`btn-dst-${dstAcc.type}`);
    if (activeBtn) {
      activeBtn.classList.add('active');
      activeBtn.innerText = dstAcc.name;
    }
  }
}

function editTransaction(id) {
  const t = AppState.transactions.find(tx => tx.id === id);
  if (!t) return;
  
  document.getElementById('trans-id').value = t.id;
  document.getElementById('trans-type').value = t.type;
  document.getElementById('trans-amount').value = t.amount;
  document.getElementById('trans-date').value = t.date;
  document.getElementById('trans-notes').value = t.notes || '';
  
  setTransType(t.type);
  
  document.getElementById('trans-account').value = t.accountId;
  if (t.destAccountId) {
    document.getElementById('trans-dest-account').value = t.destAccountId;
  } else {
    document.getElementById('trans-dest-account').value = '';
  }
  
  populateCategoryDropdown(t.type);
  document.getElementById('trans-category').value = t.category;
  
  updateAccountButtonsFromInputs();
  
  // Load installment details
  if (t.isInstallment) {
    setCcInstallmentType(t.installmentType || 'single');
    setCcInstallmentPeriod(t.installmentPeriods || 3);
    if (t.installmentType === 'interest-bearing') {
      document.getElementById('cc-installment-rate').value = t.installmentRate !== undefined ? t.installmentRate : 6.0;
    }
  } else {
    resetCcInstallmentFields();
  }
  checkShowCcInstallmentOptions();
  
  document.getElementById('modal-transaction-title').innerText = "?∫Âàª?©ÈñÆÓ¶∂Ëë£";
  openModal('modal-transaction');
}

function openAddTransactionModal() {
  document.getElementById('form-transaction').reset();
  document.getElementById('trans-id').value = '';
  document.getElementById('trans-date').value = selectedDate;
  document.getElementById('modal-transaction-title').innerText = "????ÆÓ¶∂??;

  resetAccountButtons();
  resetCcInstallmentFields();
  setTransType('expense'); // Default
  
  const cashAccounts = AppState.accounts.filter(a => a.type === 'cash');
  if (cashAccounts.length > 0) {
    selectAccount('src', 'cash', cashAccounts[0].id, cashAccounts[0].name);
  }

  checkShowCcInstallmentOptions();
  openModal('modal-transaction');
}

async function handleTransactionSubmit(event) {
  event.preventDefault();
  
  const id = document.getElementById('trans-id').value || `tx_${Date.now()}`;
  const type = document.getElementById('trans-type').value;
  const amount = Number(document.getElementById('trans-amount').value);
  const accountId = document.getElementById('trans-account').value;
  const destAccountId = type === 'transfer' ? document.getElementById('trans-dest-account').value : null;
  const category = type === 'transfer' ? '?ßÔê£?? : document.getElementById('trans-category').value;
  const date = document.getElementById('trans-date').value;
  const notes = document.getElementById('trans-notes').value;

  if (amount <= 0) {
    alert("?ÆÓ¶∂?????πÔÜ≥??≠Êâ≥Ó°?0 ???");
    return;
  }

  if (!accountId) {
    alert("?¢Ôï°Óº??™Ôè°????ÜÁã°??ñÆ?óÂ??);
    return;
  }

  if (type === 'transfer' && accountId === destAccountId) {
    alert("?ßÔê£?????‰∫ôËë£?????êÓ????");
    return;
  }

  const newTx = { id, type, amount, accountId, destAccountId, category, date, notes };
  
  const acc = AppState.accounts.find(a => a.id === accountId);
  const isCc = acc && acc.type === 'credit';
  const instType = document.getElementById('cc-installment-type').value;

  if (type === 'expense' && isCc && instType !== 'single') {
    newTx.isInstallment = true;
    newTx.installmentType = instType;
    newTx.installmentPeriods = Number(document.getElementById('cc-installment-periods').value) || 3;
    if (instType === 'interest-bearing') {
      newTx.installmentRate = Number(document.getElementById('cc-installment-rate').value) || 0;
    } else {
      newTx.installmentRate = 0;
    }
  }
  
  const existingIdx = AppState.transactions.findIndex(t => t.id === id);
  if (existingIdx !== -1) {
    AppState.transactions[existingIdx] = newTx;
  } else {
    AppState.transactions.push(newTx);
  }

  await saveStateToStorage();
  closeModal('modal-transaction');
  switchTab(activeTab); // Rerender
}

async function deleteTransaction(id) {
  if (confirm("??Ω‚Ö°?∞Ó´≥???∑Ó??áÊñ§??ÆÓ¶∂?????????)) {
    AppState.transactions = AppState.transactions.filter(t => t.id !== id);
    await saveStateToStorage();
    switchTab(activeTab);
  }
}

// --- Accounts Modals Controllers ---
function setAccountType(type) {
  document.getElementById('account-type').value = type;
  
  const buttons = document.querySelectorAll('#account-type-selector button');
  buttons.forEach(btn => {
    const mapping = { cash: '???', bank: '????, credit: '?Ω‚????, securities: '?ÖÔê£??? };
    if (btn.innerText === mapping[type]) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Toggle dynamic settings fields
  document.getElementById('budget-settings-row').style.display = type === 'cash' ? 'block' : 'none';
  document.getElementById('cc-settings-row').style.display = type === 'credit' ? 'grid' : 'none';
  document.getElementById('securities-settings-row').style.display = type === 'securities' ? 'block' : 'none';
  document.getElementById('account-initial-balance-group').style.display = type === 'credit' ? 'none' : 'block';
}

function openAddAccountModal(defaultType = 'cash') {
  document.getElementById('form-account').reset();
  setAccountType(defaultType);
  openModal('modal-account');
}

async function handleAccountSubmit(event) {
  event.preventDefault();
  
  const name = document.getElementById('account-name').value;
  const type = document.getElementById('account-type').value;
  let initialBalance = Number(document.getElementById('account-initial-balance').value) || 0;
  
  if (type === 'credit') {
    initialBalance = 0; // Credit cards do not have initial balance
  }

  if (initialBalance < 0) {
    alert("?Ó≥??óÓ¶∫??ùÔ???ÁÆ??Ë≥?");
    return;
  }

  const id = `acc_${type}_${Date.now()}`;
  
  const newAcc = { id, name, type, balance: initialBalance, initialBalance };
  
  if (type === 'cash') {
    const budgetVal = document.getElementById('account-budget').value;
    newAcc.budget = budgetVal ? Number(budgetVal) : null;
    if (newAcc.budget !== null && newAcc.budget <= 0) {
      alert("??¨Ôäæ????πÔÜ≥??≠Êâ≥Ó°?0 ???");
      return;
    }
    newAcc.budgetResetDay = Number(document.getElementById('account-budget-reset-day').value) || 1;
  } else if (type === 'credit') {
    newAcc.billingDay = Number(document.getElementById('account-billing-day').value) || 10;
    newAcc.dueDay = Number(document.getElementById('account-due-day').value) || 25;
    newAcc.creditLimit = Number(document.getElementById('account-credit-limit').value) || 100000;
    newAcc.warningThreshold = Number(document.getElementById('account-warning-threshold').value) || 0;
  } else if (type === 'securities') {
    newAcc.securitiesInvested = Number(document.getElementById('account-securities-invested').value) || 0;
  }

  AppState.accounts.push(newAcc);
  await saveStateToStorage();
  closeModal('modal-account');
  switchTab(activeTab);
}

function openEditAccountModal(id) {
  const acc = AppState.accounts.find(a => a.id === id);
  if (!acc) return;
  
  document.getElementById('account-edit-id').value = acc.id;
  document.getElementById('account-edit-type').value = acc.type;
  document.getElementById('account-edit-name').value = acc.name;
  
  const budgetRow = document.getElementById('budget-edit-settings-row');
  const ccRow = document.getElementById('cc-edit-settings-row');
  
  budgetRow.style.display = 'none';
  ccRow.style.display = 'none';
  
  if (acc.type === 'cash') {
    budgetRow.style.display = 'flex';
    document.getElementById('account-edit-budget').value = acc.budget || '';
    document.getElementById('account-edit-budget-reset-day').value = acc.budgetResetDay || 1;
  } else if (acc.type === 'credit') {
    ccRow.style.display = 'flex';
    document.getElementById('account-edit-billing-day').value = acc.billingDay || 10;
    document.getElementById('account-edit-due-day').value = acc.dueDay || 25;
    document.getElementById('account-edit-credit-limit').value = acc.creditLimit || 100000;
    document.getElementById('account-edit-warning-threshold').value = acc.warningThreshold || 0;
  }
  
  openModal('modal-account-edit');
}

async function handleAccountEditSubmit(event) {
  event.preventDefault();
  
  const id = document.getElementById('account-edit-id').value;
  const type = document.getElementById('account-edit-type').value;
  const name = document.getElementById('account-edit-name').value;
  
  const acc = AppState.accounts.find(a => a.id === id);
  if (!acc) return;
  
  acc.name = name;
  if (type === 'cash') {
    const budgetVal = document.getElementById('account-edit-budget').value;
    const budget = budgetVal ? Number(budgetVal) : null;
    if (budget !== null && budget <= 0) {
      alert("??¨Ôäæ????πÔÜ≥??≠Êâ≥Ó°?0 ???");
      return;
    }
    acc.budget = budget;
    acc.budgetResetDay = Number(document.getElementById('account-edit-budget-reset-day').value) || 1;
  } else if (type === 'credit') {
    acc.billingDay = Number(document.getElementById('account-edit-billing-day').value) || 10;
    acc.dueDay = Number(document.getElementById('account-edit-due-day').value) || 25;
    acc.creditLimit = Number(document.getElementById('account-edit-credit-limit').value) || 100000;
    acc.warningThreshold = Number(document.getElementById('account-edit-warning-threshold').value) || 0;
  }
  
  await saveStateToStorage();
  closeModal('modal-account-edit');
  switchTab(activeTab);
}

async function deleteAccount(id) {
  if (confirm("??∑Ó???ñÆ?óÊ??≠¬Ä???????????≠Ê???ù¬Ä????øË???Ê≠??????¨ÓºΩ?±Ëù•????)) {
    AppState.accounts = AppState.accounts.filter(a => a.id !== id);
    AppState.transactions = AppState.transactions.filter(t => t.accountId !== id && t.destAccountId !== id);
    await saveStateToStorage();
    switchTab(activeTab);
  }
}

// --- Securities Funds Inter-transfer Modal ---
function openSecuritiesTransferModal(secId) {
  const acc = AppState.accounts.find(a => a.id === secId);
  if (!acc) return;
  
  document.getElementById('sec-trans-account-id').value = secId;
  document.getElementById('sec-trans-account-name').innerText = acc.name;
  
  // Set default direction to buy
  setSecDirection('buy');
  document.getElementById('sec-trans-amount').value = '';
  document.getElementById('sec-trans-notes').value = '';
  
  openModal('modal-securities-transfer');
}

function setSecDirection(dir) {
  document.getElementById('sec-direction').value = dir;
  const buyBtn = document.getElementById('btn-sec-buy');
  const sellBtn = document.getElementById('btn-sec-sell');
  if (buyBtn && sellBtn) {
    if (dir === 'buy') {
      buyBtn.classList.add('active');
      sellBtn.classList.remove('active');
    } else {
      buyBtn.classList.remove('active');
      sellBtn.classList.add('active');
    }
  }
}

async function handleSecuritiesTransferSubmit(event) {
  event.preventDefault();
  
  const secId = document.getElementById('sec-trans-account-id').value;
  const dir = document.getElementById('sec-direction').value;
  const amount = Number(document.getElementById('sec-trans-amount').value);
  const userNotes = document.getElementById('sec-trans-notes').value.trim();
  
  if (amount <= 0) {
    alert("?ßÔê•ÂÆ????πÔÜ≥??≠Êâ≥Ó°?0");
    return;
  }

  const { balances } = calculateBalancesAtDate();
  const accState = balances[secId];
  
  // Validate if they have enough balance to transfer
  if (dir === 'buy' && accState.balance < amount) {
    alert("?óÓ¶∫??ùÔ??≤Â?ÓºªËë£??ÖÔÖ±????ùÔ??≤È?‰∫•Áú∫?‰∫•Ó??°ÂÖ∑??);
    return;
  }
  if (dir === 'sell' && accState.securitiesInvested < amount) {
    alert("?åËÑ´??‰∫•Ó??°Âà∏??øÔ???ûÂ?Ë™ëÈ†ß??äæ??);
    return;
  }

  // Create special internal transfer transaction
  // Buy: accountId = secId, destAccountId = secId + "_invested"
  // Sell: accountId = secId + "_invested", destAccountId = secId
  const source = dir === 'buy' ? secId : `${secId}_invested`;
  const dest = dir === 'buy' ? `${secId}_invested` : secId;
  const noteStr = dir === 'buy' ? '????éÁ????†Â∑®?àÔã≠?' : '?????†Â∑®?àÔã≠?È§àÓ??';
  const customNotes = userNotes ? `${noteStr} - ${userNotes}` : noteStr;

  const newTx = {
    id: `tx_sec_${Date.now()}`,
    type: 'transfer',
    amount,
    accountId: source,
    destAccountId: dest,
    category: '?ÖÔê£?ôÈà≠??',
    date: new Date().toISOString().split('T')[0],
    notes: customNotes
  };

  AppState.transactions.push(newTx);
  await saveStateToStorage();
  closeModal('modal-securities-transfer');
  switchTab(activeTab);
}

// --- Recurring Rules Modal logic ---
function toggleRecurTypeFields() {
  const type = document.getElementById('recur-type').value;
  const srcGrp = document.getElementById('recur-source-group');
  const dstGrp = document.getElementById('recur-dest-group');
  const srcLbl = document.getElementById('recur-source-label');

  if (type === 'transfer') {
    srcGrp.style.display = 'block';
    dstGrp.style.display = 'block';
    srcLbl.innerText = '?ßÔê£?æÊí£?ÆÔ?';
  } else {
    srcGrp.style.display = 'block';
    dstGrp.style.display = 'none';
    srcLbl.innerText = type === 'expense' ? '???°Êí£?ÆÔ?' : '??ÜÁã°??ñÆ??;
  }
}

function openAddRecurringModal() {
  document.getElementById('form-recurring').reset();
  selectRecurIcon('?Ó∂?);

  
  // Build fast button list of accounts for source & destination
  const srcContainer = document.getElementById('recur-source-buttons');
  const dstContainer = document.getElementById('recur-dest-buttons');
  srcContainer.innerHTML = '';
  dstContainer.innerHTML = '';

  document.getElementById('recur-source-account').value = '';
  document.getElementById('recur-dest-account').value = '';

  AppState.accounts.forEach(acc => {
    // Source buttons
    const btn1 = document.createElement('button');
    btn1.type = 'button';
    btn1.className = 'btn-select-option';
    btn1.innerText = acc.name;
    btn1.onclick = () => {
      document.getElementById('recur-source-account').value = acc.id;
      Array.from(srcContainer.children).forEach(b => b.classList.remove('active'));
      btn1.classList.add('active');
    };
    srcContainer.appendChild(btn1);

    // Dest buttons
    const btn2 = document.createElement('button');
    btn2.type = 'button';
    btn2.className = 'btn-select-option';
    btn2.innerText = acc.name;
    btn2.onclick = () => {
      document.getElementById('recur-dest-account').value = acc.id;
      Array.from(dstContainer.children).forEach(b => b.classList.remove('active'));
      btn2.classList.add('active');
    };
    dstContainer.appendChild(btn2);
  });

  toggleRecurTypeFields();
  openModal('modal-recurring');
}

async function handleRecurringSubmit(event) {
  event.preventDefault();
  
  const name = document.getElementById('recur-name').value;
  const type = document.getElementById('recur-type').value;
  const amount = Number(document.getElementById('recur-amount').value);
  const sourceAccountId = document.getElementById('recur-source-account').value;
  const destAccountId = type === 'transfer' ? document.getElementById('recur-dest-account').value : null;
  const frequency = document.getElementById('recur-frequency').value;
  const dayAnchor = Number(document.getElementById('recur-day-anchor').value) || 1;
  const icon = document.getElementById('recur-icon').value || '?Ó∂?;

  if (!sourceAccountId) {
    alert("?¢Ôï°??Ë≥äÓ???™Ôè°?àÊ???Â°?");
    return;
  }
  if (type === 'transfer' && !destAccountId) {
    alert("?¢Ôï°??Ë≥äÓ?????‰∫ôËë£?Â°?");
    return;
  }
  if (type === 'transfer' && sourceAccountId === destAccountId) {
    alert("?ßÔê£?????‰∫ôËë£?????êÓ????");
    return;
  }

  const newRule = {
    id: `recur_${Date.now()}`,
    name, type, amount, sourceAccountId, destAccountId, frequency, dayAnchor, icon
  };

  AppState.recurring.push(newRule);
  await saveStateToStorage();
  closeModal('modal-recurring');
  switchTab(activeTab);
}

async function deleteRecurringRule(id) {
  if (confirm("?????¨Óºª???óËø®?ÁÆ???ÜÓ??¨Óê±????")) {
    AppState.recurring = AppState.recurring.filter(r => r.id !== id);
    await saveStateToStorage();
    switchTab(activeTab);
  }
}

  // Check for upcoming recurring items on a specific date
  function getUpcomingForDate(dateStr) {
    const upcoming = [];
    const evalDate = new Date(dateStr);
    const todayDate = new Date();
    todayDate.setHours(0,0,0,0);
    if (evalDate < todayDate) return upcoming;
    const evalDay = evalDate.getDate();
    const evalDayOfWeek = evalDate.getDay();
    const daysInMonth = new Date(evalDate.getFullYear(), evalDate.getMonth() + 1, 0).getDate();
    AppState.recurring.forEach(rule => {
      let isTriggered = false;
      if (rule.frequency === 'daily') isTriggered = true;
      else if (rule.frequency === 'weekly' && rule.dayAnchor === evalDayOfWeek) isTriggered = true;
      else if (rule.frequency === 'monthly') {
        if (rule.dayAnchor === evalDay || (rule.dayAnchor > daysInMonth && evalDay === daysInMonth)) isTriggered = true;
      } else if (rule.frequency === 'yearly') {
        if (rule.monthAnchor === (evalDate.getMonth() + 1)) {
          if (rule.dayAnchor === evalDay || (rule.dayAnchor > daysInMonth && evalDay === daysInMonth)) isTriggered = true;
        }
      }
      if (isTriggered) {
        const txId = `tx_recur_run_${rule.id}_${dateStr}`;
        if (!AppState.transactions.some(t => t.id === txId)) upcoming.push(rule);
      }
    });
    return upcoming;
  }

// Automated Recurring Execution check
async function processRecurringTransactions() {
  const todayStr = new Date().toISOString().split('T')[0];
  const lastCheck = AppState.lastRecurringCheckDate || todayStr;
  
  if (lastCheck === todayStr) return; // Checked today already
  
  const lastCheckDate = new Date(lastCheck);
  const todayDate = new Date(todayStr);

  let runCount = 0;

  // Process day by day from lastCheck + 1 day to today
  for (let d = new Date(lastCheckDate.getTime() + 86400000); d <= todayDate; d.setDate(d.getDate() + 1)) {
    const evalDateStr = d.toISOString().split('T')[0];
    const evalDay = d.getDate();
    const evalDayOfWeek = d.getDay(); // 0 is Sunday, 1 is Monday...

    AppState.recurring.forEach(rule => {
      let isTriggered = false;

      if (rule.frequency === 'daily') {
        isTriggered = true;
      } else if (rule.frequency === 'weekly' && rule.dayAnchor === evalDayOfWeek) {
        isTriggered = true;
      } else if (rule.frequency === 'monthly') {
        // If anchor day is e.g. 31st and this month has 30 days, trigger on last day
        const maxDaysInMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
        if (rule.dayAnchor === evalDay || (rule.dayAnchor > maxDaysInMonth && evalDay === maxDaysInMonth)) {
          isTriggered = true;
        }
      } else if (rule.frequency === 'yearly') {
        const evalMonth = d.getMonth() + 1; // 1-12
        if (rule.monthAnchor === evalMonth) {
          const maxDaysInMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
          if (rule.dayAnchor === evalDay || (rule.dayAnchor > maxDaysInMonth && evalDay === maxDaysInMonth)) {
            isTriggered = true;
          }
        }
      }

      if (isTriggered) {
        const newTx = {
          id: `tx_recur_run_${rule.id}_${evalDateStr}`,
          type: rule.type,
          amount: rule.amount,
          accountId: rule.sourceAccountId,
          destAccountId: rule.destAccountId,
          category: rule.type === 'transfer' ? '?ßÔê£?? : '?ÁÆ???ÜÓ?',
          date: evalDateStr,
          notes: `[?ÁÆ???ÜÓ???????] ${rule.name}`
        };

        // Avoid duplication
        if (!AppState.transactions.some(t => t.id === newTx.id)) {
          AppState.transactions.push(newTx);
          runCount++;
        }
      }
    });
  }

  AppState.lastRecurringCheckDate = todayStr;
  await saveStateToStorage();
  
  if (runCount > 0) {
    setTimeout(() => {
      alert(`?åËÑ©Óæ??ªÔäÆ??üÓ??µÔóπ? ${runCount} ?ëÔ?Ó≠¢Êë∞Ó´±Ó????????`);
    }, 1000);
  }
}

// --- Split Bill Methods ---
let tempSplitMembers = [];

function populateUserLinkDropdown() {
  const dropdown = document.getElementById('split-member-input-user-link');
  if (!dropdown) return;
  
  dropdown.innerHTML = '<option value="">(?ùÔ?????üÈ?ÁµûÈõøËºªÓ???</option>';
  
  const users = window.Security.getUserRegistry();
  users.forEach(username => {
    const opt = document.createElement('option');
    opt.value = username;
    opt.innerText = `?????îæ???{username}`;
    dropdown.appendChild(opt);
  });
}

function toggleMemberInputs(show) {
  const container = document.getElementById('split-member-inputs-container');
  const btnRow = document.getElementById('split-member-btn-row');
  if (container && btnRow) {
    if (show) {
      container.style.display = 'flex';
      btnRow.style.display = 'none';
      const nameInput = document.getElementById('split-member-input-name');
      if (nameInput) nameInput.focus();
    } else {
      container.style.display = 'none';
      btnRow.style.display = 'flex';
      document.getElementById('split-member-input-name').value = '';
      document.getElementById('split-member-input-avatar').selectedIndex = 0;
      document.getElementById('split-member-input-user-link').selectedIndex = 0;
    }
  }
}

function addMemberToBuilder() {
  const nameInput = document.getElementById('split-member-input-name');
  const avatarInput = document.getElementById('split-member-input-avatar');
  const linkInput = document.getElementById('split-member-input-user-link');
  
  const name = nameInput.value.trim();
  const avatar = avatarInput.value;
  const userLink = linkInput.value;
  
  if (!name) {
    alert("?¢Ô???‰∫?????ÆÓ§£?");
    return;
  }
  
  if (tempSplitMembers.some(m => m.name === name)) {
    alert("??éÓô°????ùÔ???????);
    return;
  }
  
  tempSplitMembers.push({ name, avatar, userLink });
  
  nameInput.value = '';
  avatarInput.selectedIndex = 0;
  linkInput.selectedIndex = 0;
  
  renderSplitMembersBuilder();
  toggleMemberInputs(false);
}

function removeMemberFromBuilder(index) {
  tempSplitMembers.splice(index, 1);
  renderSplitMembersBuilder();
}

function renderSplitMembersBuilder() {
  const listContainer = document.getElementById('split-members-list');
  listContainer.innerHTML = '';
  
  tempSplitMembers.forEach((m, idx) => {
    const item = document.createElement('div');
    item.style.display = 'flex';
    item.style.justifyContent = 'space-between';
    item.style.alignItems = 'center';
    item.style.padding = '0.35rem 0.5rem';
    item.style.background = 'var(--bg-card)';
    item.style.borderRadius = '8px';
    item.style.border = '1px solid var(--border-color)';
    
    item.innerHTML = `
      <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.8125rem;">
        <span style="font-size: 1.15rem;">${m.avatar}</span>
        <span style="font-weight: 600;">${escapeHtml(m.name)}</span>
        ${m.userLink ? `<span style="font-size: 0.75rem; color: var(--color-purple); background: rgba(139, 92, 246, 0.1); padding: 0.15rem 0.35rem; border-radius: 4px;">@${m.userLink}</span>` : ''}
      </div>
      <button type="button" class="btn-icon-action" onclick="removeMemberFromBuilder(${idx})" style="color: var(--color-red); border: none; background: none; cursor: pointer; font-size: 1rem;">?</button>
    `;
    listContainer.appendChild(item);
  });
  
  document.getElementById('split-plan-members-data').value = JSON.stringify(tempSplitMembers);
}

function openAddSplitPlanModal() {
  document.getElementById('form-split-plan').reset();
  tempSplitMembers = [];
  
  if (currentUser) {
    tempSplitMembers.push({
      name: currentUser,
      avatar: '??',
      userLink: currentUser
    });
  }
  
  renderSplitMembersBuilder();
  populateUserLinkDropdown();
  toggleMemberInputs(false);
  
  const today = new Date().toISOString().split('T')[0];
  const nextWeek = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];
  
  document.getElementById('split-plan-start').value = today;
  document.getElementById('split-plan-end').value = nextWeek;
  
  openModal('modal-split-plan');
}

async function handleSplitPlanSubmit(event) {
  event.preventDefault();
  
  const name = document.getElementById('split-plan-name').value;
  const rawMembersData = document.getElementById('split-plan-members-data').value;
  const startDate = document.getElementById('split-plan-start').value;
  const endDate = document.getElementById('split-plan-end').value;

  let memberList = [];
  try {
    memberList = JSON.parse(rawMembersData);
  } catch (e) {
    memberList = [];
  }

  if (memberList.length < 2) {
    alert("??åËë£?ÆÔ??•Êïπ????ØÓ?????????éÓô°??);
    return;
  }

  // Prepend avatar emoji to make them look rich, e.g. "?? user"
  const members = memberList.map(m => `${m.avatar} ${m.name}`);

  const newPlan = {
    id: `split_${Date.now()}`,
    name,
    members,
    startDate,
    endDate,
    transactions: [],
    status: 'active',
    settlement: null
  };

  AppState.splitPlans.push(newPlan);
  await saveStateToStorage();
  closeModal('modal-split-plan');
  switchTab(activeTab);
}

function openAddSplitTransModal(planId) {
  const plan = AppState.splitPlans.find(p => p.id === planId);
  if (!plan) return;

  document.getElementById('form-split-trans').reset();
  document.getElementById('split-trans-plan-id').value = planId;
  
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('split-trans-date').value = today;
  
  const payerSel = document.getElementById('split-trans-payer');
  payerSel.innerHTML = '';
  let foundMe = false;
  plan.members.forEach(m => {
    const opt = document.createElement('option');
    opt.value = m;
    opt.innerText = m;
    if (m === '?? || m === (AppState.profile?.name || '??)) {
      opt.selected = true;
      foundMe = true;
    }
    payerSel.appendChild(opt);
  });
  if (!foundMe && payerSel.options.length > 0) {
    payerSel.selectedIndex = 0;
  }

  // Populate splits checkboxes with equal shares settings
  const container = document.getElementById('split-members-list-checkboxes');
  container.innerHTML = '';

  plan.members.forEach(m => {
    const row = document.createElement('div');
    row.style.display = 'flex';
    row.style.alignItems = 'center';
    row.style.justifyContent = 'space-between';
    row.style.marginBottom = '0.5rem';

    row.innerHTML = `
      <label style="display: flex; align-items: center; gap: 0.5rem;">
        <input type="checkbox" class="split-member-check" value="${escapeHtml(m)}" checked>
        <span>${escapeHtml(m)}</span>
      </label>
      <div style="display: flex; align-items: center; gap: 0.25rem;">
        <input type="number" class="split-member-weight" value="1" min="0" style="width: 60px; padding: 0.25rem; font-size: 0.8125rem;" title="??çÓ??àÔ??">
        <span style="font-size: 0.75rem; color: var(--text-muted);">??/span>
      </div>
    `;
    container.appendChild(row);
  });

  openModal('modal-split-trans');
}

async function handleSplitTransSubmit(event) {
  event.preventDefault();
  
  const planId = document.getElementById('split-trans-plan-id').value;
  const plan = AppState.splitPlans.find(p => p.id === planId);
  if (!plan) return;

  const name = document.getElementById('split-trans-name').value;
  const amount = Number(document.getElementById('split-trans-amount').value);
  const payer = document.getElementById('split-trans-payer').value;

  if (amount <= 0) {
    alert("??åËë£????πÔÜ≥??≠Êâ≥Ó°?0");
    return;
  }

  // Gather splits participants
  const participants = [];
  const checkBoxes = document.querySelectorAll('.split-member-check');
  const weights = document.querySelectorAll('.split-member-weight');

  let totalWeight = 0;

  checkBoxes.forEach((cb, index) => {
    if (cb.checked) {
      const member = cb.value;
      const weight = Number(weights[index].value) || 0;
      if (weight > 0) {
        participants.push({ member, weight });
        totalWeight += weight;
      }
    }
  });

  if (participants.length === 0) {
    alert("?¢Ô??∑Ê??ØÓ????????????©Ë??õÊÄ†ÔÖØ?≠Êâ≥Ó°???????");
    return;
  }

  // Calculate actual splits amount per member
  const splits = participants.map(part => {
    const shareAmount = Math.round((amount * part.weight) / totalWeight);
    return {
      member: part.member,
      weight: part.weight,
      amount: shareAmount
    };
  });

  // Adjust last element rounding error if necessary
  const sumSplits = splits.reduce((sum, s) => sum + s.amount, 0);
  const diff = amount - sumSplits;
  if (diff !== 0 && splits.length > 0) {
    splits[splits.length - 1].amount += diff;
  }

  const date = document.getElementById('split-trans-date').value || new Date().toISOString().split('T')[0];

  const newSplitTx = {
    id: `split_tx_${Date.now()}`,
    name,
    amount,
    payer,
    date,
    splits
  };

  plan.transactions.push(newSplitTx);
  await saveStateToStorage();
  closeModal('modal-split-trans');
  switchTab(activeTab);
}

// Settle Split Plan Engine: Greedy Path Solver (Minimizing transaction count)
async function settleSplitPlan(planId) {
  const plan = AppState.splitPlans.find(p => p.id === planId);
  if (!plan) return;

  if (plan.transactions.length === 0) {
    alert("?????îæ???éÔ??ûÈ¢±??Ê¢ØÁ••?ù¬Ä??????????ØÓ????);
    return;
  }

  if (!confirm("?????¨Óºø??????ØÓ???ûÓ???óÓ???ûÓ???†Ôã´?éÁ????????åËë£??ñÊï¶??)) {
    return;
  }

  // Calculate net balances: Net[m] = Total Paid - Total Owed
  const nets = {};
  plan.members.forEach(m => {
    nets[m] = 0;
  });

  plan.transactions.forEach(tx => {
    // Add paid amount
    nets[tx.payer] += Number(tx.amount);
    // Subtract split shares
    tx.splits.forEach(s => {
      if (nets[s.member] !== undefined) {
        nets[s.member] -= Number(s.amount);
      }
    });
  });

  // Split members into Creditors (net > 0) and Debtors (net < 0)
  const creditors = [];
  const debtors = [];

  for (const m in nets) {
    const val = nets[m];
    // Avoid float rounding errors, count if deviation > 0.5 TWD
    if (val > 0.5) {
      creditors.push({ name: m, amount: val });
    } else if (val < -0.5) {
      debtors.push({ name: m, amount: -val }); // Keep positive debit amount
    }
  }

  // Sort: Largest first
  creditors.sort((a, b) => b.amount - a.amount);
  debtors.sort((a, b) => b.amount - a.amount);

  const settlementInstructions = [];

  let cIdx = 0;
  let dIdx = 0;

  // Greedy match creditors and debtors
  while (cIdx < creditors.length && dIdx < debtors.length) {
    const creditor = creditors[cIdx];
    const debtor = debtors[dIdx];

    const transferAmount = Math.min(creditor.amount, debtor.amount);
    
    settlementInstructions.push({
      from: debtor.name,
      to: creditor.name,
      amount: Math.round(transferAmount)
    });

    creditor.amount -= transferAmount;
    debtor.amount -= transferAmount;

    if (creditor.amount < 0.5) cIdx++;
    if (debtor.amount < 0.5) dIdx++;
  }

  plan.settlement = settlementInstructions;
  plan.status = 'settled';

  await saveStateToStorage();
  switchTab(activeTab);
  alert("?ØÓ???????);
}

async function deleteSplitPlan(id) {
  if (confirm("?????¨Óºª???óËø®??åËë£?ÆÔ????????????ñÆ??ùÂï£?????≠Ê˘Î?")) {
    AppState.splitPlans = AppState.splitPlans.filter(p => p.id !== id);
    await saveStateToStorage();
    switchTab(activeTab);
  }
}

// --- E-Invoice (????õÔê£?? Controllers ---
function openSetupCarrierModal() {
  document.getElementById('carrier-barcode-input').value = AppState.carrierBarcode || '';
  document.getElementById('carrier-pin-input').value = AppState.carrierPin || '';
  openModal('modal-carrier-setup');
}

async function handleCarrierSetupSubmit(event) {
  event.preventDefault();
  
  const barcode = document.getElementById('carrier-barcode-input').value.trim();
  const pin = document.getElementById('carrier-pin-input').value.trim();

  AppState.carrierBarcode = barcode;
  AppState.carrierPin = pin;

  await saveStateToStorage();
  closeModal('modal-carrier-setup');
  switchTab(activeTab);
  alert("?õÔê£?ÅÈñÆ???????);
}

function generateMockInvoiceNo() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const char1 = letters[Math.floor(Math.random() * letters.length)];
  const char2 = letters[Math.floor(Math.random() * letters.length)];
  const num = Math.floor(10000000 + Math.random() * 90000000);
  return `${char1}${char2}-${num}`;
}

// Trigger simulated API download of carrier invoices
async function triggerMockInvoiceDownload() {
  if (!AppState.carrierBarcode) {
    alert("?¢Ô???ÆÂ?????????õÔê£?ÅÁ?Ó≥â‚Ö£??öÔ??ùÔ???ÊΩõÂ∑®??);
    switchTab('tab-carrier');
    openSetupCarrierModal();
    return;
  }

  // Pre-generate standard mock invoice records
  const stores = ['?ØÊõπ??ûÔÜØ? (7-11)', '??∏ÊåØ?òË∏π????', '?Ó∏ÅÊ??????, '?∞Â????, 'Uber Eats', 'UNIQLO'];
  const itemsPreset = {
    '?ØÊõπ??ûÔÜØ? (7-11)': [
      [{ name: '?∫‚äø?ûË??, price: 35 }, { name: '????äÔ???, price: 25 }],
      [{ name: '?òËºª??, price: 89 }, { name: '?ùÓ?Ó°??, price: 25 }]
    ],
    '??∏ÊåØ?òË∏π????': [
      [{ name: '?Ó∞???, price: 49 }, { name: '?¢Ó???Ó°ºÓ?', price: 35 }]
    ],
    '?Ó∏ÅÊ??????: [
      [{ name: '?Â≠µ‰?????, price: 150 }, { name: '?èÁ?????', price: 100 }]
    ],
    '?∞Â????: [
      [{ name: '?µÓ???ùÓ????, price: 249 }, { name: '???Ó≤ÑÈ??, price: 120 }, { name: '?ÓÆçÊ?', price: 150 }]
    ],
    'Uber Eats': [
      [{ name: '?ÓÆ???, price: 180 }, { name: '?≠Ó??ÓºæÁ••', price: 30 }]
    ],
    'UNIQLO': [
      [{ name: '????°ÓïØ???Å‰?', price: 790 }]
    ]
  };

  const store = stores[Math.floor(Math.random() * stores.length)];
  const pool = itemsPreset[store];
  const items = pool[Math.floor(Math.random() * pool.length)];
  const amount = items.reduce((sum, i) => sum + i.price, 0);

  // Suggest accounts based on store
  let suggested = 'acc_cash_1'; // Cash default
  const hasCards = AppState.accounts.some(a => a.type === 'credit');
  const hasBank = AppState.accounts.some(a => a.type === 'bank');

  if (['?Ó∏ÅÊ??????, 'Uber Eats', 'UNIQLO'].includes(store) && hasCards) {
    const card = AppState.accounts.find(a => a.type === 'credit');
    suggested = card.id;
  } else if (hasBank) {
    const bank = AppState.accounts.find(a => a.type === 'bank');
    suggested = bank.id;
  }

  const newInvoice = {
    id: `inv_${Date.now()}`,
    invoiceNo: generateMockInvoiceNo(),
    store,
    amount,
    date: new Date().toISOString().split('T')[0],
    items,
    suggestedAccount: suggested,
    paymentConfirmed: false
  };

  AppState.carrierInvoices.unshift(newInvoice);
  await saveStateToStorage();
  switchTab(activeTab);
  
  alert(`?? ?ùÔ???ÊΩõÂ∑®????óÓººÓ°áÊ?Óµ??ëÔ????${store} ????????$${amount}?óÔóΩ?????Ê°êË??Ë©??ùË°£?°Èö§?óÔ??‰∫?????ÓΩ?;
}

let html5Qrcode = null;

function parseTaiwanInvoiceQr(text) {
  if (!text || text.length < 53) return null;
  
  const invoiceNoPattern = /^[A-Z]{2}\d{8}/;
  if (!invoiceNoPattern.test(text)) return null;
  
  const invoiceNo = text.substring(0, 10);
  const minguoDate = text.substring(10, 17);
  const minguoYear = parseInt(minguoDate.substring(0, 3));
  const month = minguoDate.substring(3, 5);
  const day = minguoDate.substring(5, 7);
  const solarYear = minguoYear + 1911;
  const dateStr = `${solarYear}-${month}-${day}`;
  
  const totalAmountHex = text.substring(29, 37);
  const amount = parseInt(totalAmountHex, 16) || 0;
  
  const items = [];
  const detailsPart = text.substring(77);
  if (detailsPart.includes(':')) {
    const tokens = detailsPart.split(':');
    let idx = 1;
    while (idx < tokens.length) {
      const itemName = tokens[idx]?.trim();
      const qty = parseInt(tokens[idx + 1]) || 1;
      const unitPrice = parseInt(tokens[idx + 2]) || 0;
      if (itemName && itemName !== '**' && !/^\d+$/.test(itemName)) {
        items.push({ name: itemName, price: unitPrice * qty });
        idx += 3;
      } else {
        idx++;
      }
    }
  }
  
  if (items.length === 0) {
    items.push({ name: '?ÊΩõÂ∑®?®Ô?Á•?Óº?', price: amount });
  }
  
  return {
    invoiceNo,
    date: dateStr,
    amount,
    items,
    store: '?È§??ÊΩõÂ∑® (???????'
  };
}

function openQrScanner() {
  openModal('modal-qr-simulation');
  initRealQrScanner();
}

function initRealQrScanner() {
  if (html5Qrcode) {
    closeRealQrScanner();
  }
  
  html5Qrcode = new Html5Qrcode("qr-reader");
  
  const qrSuccessCallback = async (decodedText, decodedResult) => {
    console.log(`Scan result: ${decodedText}`);
    const parsed = parseTaiwanInvoiceQr(decodedText);
    
    if (parsed) {
      closeRealQrScanner();
      closeModal('modal-qr-simulation');
      
      const newInvoice = {
        id: `inv_qr_${Date.now()}`,
        invoiceNo: parsed.invoiceNo,
        store: parsed.store,
        amount: parsed.amount,
        date: parsed.date,
        items: parsed.items,
        suggestedAccount: AppState.accounts[0] ? AppState.accounts[0].id : 'acc_cash_1',
        paymentConfirmed: false
      };
      
      AppState.carrierInvoices.unshift(newInvoice);
      await saveStateToStorage();
      switchTab('tab-carrier');
      alert(`?? ???????óÓºΩÓ®™Ëü°??????${parsed.invoiceNo}?óÔóæ??øÔö°?$${parsed.amount}?óÔó∫Ê≠??¨ÔÖØ?∫ÔÜ±?°Èö§??????ùÂ??`);
    }
  };
  
  const config = { fps: 10, qrbox: { width: 250, height: 250 } };
  
  html5Qrcode.start({ facingMode: "environment" }, config, qrSuccessCallback)
    .catch(err => {
      console.warn("Camera access failed", err);
    });
}

function closeRealQrScanner() {
  if (html5Qrcode) {
    html5Qrcode.stop().then(() => {
      html5Qrcode = null;
    }).catch(err => {
      console.warn("Failed to stop scanner", err);
      html5Qrcode = null;
    });
  }
}

async function simulateQrScanSuccess(preset) {
  closeRealQrScanner();
  closeModal('modal-qr-simulation');
  
  let newInvoice = null;
  const todayStr = new Date().toISOString().split('T')[0];

  const hasCards = AppState.accounts.some(a => a.type === 'credit');
  const cardId = hasCards ? AppState.accounts.find(a => a.type === 'credit').id : 'acc_cash_1';

  if (preset === 'starbucks') {
    newInvoice = {
      id: `inv_${Date.now()}`,
      invoiceNo: generateMockInvoiceNo(),
      store: '?Ó∏ÅÊ??????(?????¨ÔÖØ)',
      amount: 245,
      date: todayStr,
      items: [{ name: '?¨Óö•?????, price: 150 }, { name: '??µÊ????', price: 95 }],
      suggestedAccount: cardId,
      paymentConfirmed: false
    };
  } else if (preset === 'carrefour') {
    newInvoice = {
      id: `inv_${Date.now()}`,
      invoiceNo: generateMockInvoiceNo(),
      store: '?∞Â????(?????¨ÔÖØ)',
      amount: 1280,
      date: todayStr,
      items: [{ name: '??????º∏??, price: 280 }, { name: '?üÂñ≥???, price: 1000 }],
      suggestedAccount: cardId,
      paymentConfirmed: false
    };
  } else if (preset === 'uniqlo') {
    newInvoice = {
      id: `inv_${Date.now()}`,
      invoiceNo: generateMockInvoiceNo(),
      store: 'UNIQLO (?????¨ÔÖØ)',
      amount: 990,
      date: todayStr,
      items: [{ name: '?ùÓ∏Ø', price: 390 }, { name: '??åÓªø??õ‰?', price: 600 }],
      suggestedAccount: cardId,
      paymentConfirmed: false
    };
  }

  if (newInvoice) {
    AppState.carrierInvoices.unshift(newInvoice);
    await saveStateToStorage();
    switchTab(activeTab);
    alert(`????ÊΩõÂ∑®????óÓºªÊ≠?Ó∫ûÔÖØ?∫ÔÜ±?°Èö§??????ùÂ??`);
  }
}

// Confirming and moving invoice to main ledger
async function confirmCarrierInvoice(id) {
  const inv = AppState.carrierInvoices.find(i => i.id === id);
  if (!inv) return;

  const chosenAccount = document.getElementById(`inv-pay-acc-${inv.id}`).value;
  
  const itemsText = inv.items.map(it => `${it.name}`).join('??);
  
  const newTx = {
    id: `tx_carrier_${inv.id}`,
    type: 'expense',
    amount: inv.amount,
    accountId: chosenAccount,
    destAccountId: null,
    category: '?åËÑ§?', // Default categorization, user can edit on ledger if needed
    date: inv.date,
    notes: `[?ÊΩõÂ∑®?õÔê£?Å][?ÊΩõÂ∑®?Ó∏É‚Ö£:${inv.invoiceNo || '??}] ${inv.store} - ${itemsText}`
  };

  // Add to main transactions
  AppState.transactions.push(newTx);

  // Mark invoice as confirmed (removed from view)
  inv.paymentConfirmed = true;

  await saveStateToStorage();
  switchTab(activeTab);
  alert("?åËÑ´??Ó∏ÅÔ??‰π©Ë??¨Óºæ???ñ≥???åË???);
}

function parseCsvLine(text) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

function parseSimpleCsv(lines) {
  let importedCount = 0;
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const parts = line.split(',');
    if (parts.length >= 3) {
      const date = parts[0].trim();
      const store = parts[1].trim();
      const amount = Number(parts[2].trim()) || 0;
      const itemDesc = parts[3] ? parts[3].trim() : '?ÊΩõÂ∑®?????ñÊï¶';

      if (amount > 0 && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
        const newInvoice = {
          id: `inv_csv_${Date.now()}_${i}`,
          invoiceNo: generateMockInvoiceNo(),
          store,
          amount,
          date,
          items: [{ name: itemDesc, price: amount }],
          suggestedAccount: AppState.accounts[0] ? AppState.accounts[0].id : 'acc_cash_1',
          paymentConfirmed: false
        };
        AppState.carrierInvoices.push(newInvoice);
        importedCount++;
      }
    }
  }

  if (importedCount > 0) {
    saveStateToStorage().then(() => {
      switchTab(activeTab);
      alert(`???????ùË???‰π? ${importedCount} ?ëÔ?Ó®™Ëü°???ùÂ??∑Êï∫?∞Óπ±?†Ô??????ÊÆ?`);
    });
  }
}

// Upload and Parse CSV exported from Ministry of Finance
async function handleInvoiceCsvUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (e) => {
    const text = e.target.result;
    const lines = text.split('\n');
    if (lines.length <= 1) {
      alert("CSV ?ºÓ???ÁÆáÂ??Ó°ΩÓπµ?òÓê∞????°Â??);
      return;
    }

    const headerLine = lines[0].replace(/"/g, '').trim();
    const headers = headerLine.split(',');

    const dateIdx = headers.findIndex(h => h.includes('?‰∫?') || h.includes('Date'));
    const noIdx = headers.findIndex(h => h.includes('?Ó∏É‚Ö£') || h.includes('No'));
    const itemIdx = headers.findIndex(h => h.includes('?Óº?') || h.includes('??ñÊï¶') || h.includes('Item'));
    const amtIdx = headers.findIndex(h => h.includes('???') || h.includes('?†Óê¥?') || h.includes('Amount') || h.includes('?ÆË≥°?'));
    const storeIdx = headers.findIndex(h => h.includes('??ôË?') || h.includes('??åÊåØ') || h.includes('???') || h.includes('Store'));

    if (dateIdx === -1 || amtIdx === -1) {
      alert("???????†Ô???é‚ä•???CSV ?àÔ???óÔó∫??øËºª???ëË∫´?Êæ???? (?àÔ????????Á∂??‰∫?,??åÊåØ,???,?Óº?)");
      parseSimpleCsv(lines);
      return;
    }

    let importedCount = 0;
    const invoiceGroups = {};

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const parts = parseCsvLine(line);
      if (parts.length <= Math.max(dateIdx, amtIdx)) continue;

      const dateRaw = parts[dateIdx].trim();
      const amount = Number(parts[amtIdx].trim()) || 0;
      const store = storeIdx !== -1 ? parts[storeIdx].trim() : '??∞Ó???åÊåØ';
      const invoiceNo = noIdx !== -1 ? parts[noIdx].trim() : `M-${Date.now()}-${i}`;
      const itemName = itemIdx !== -1 ? parts[itemIdx].trim() : '?ÊΩõÂ∑®??ñÊï¶?Óº?';

      let formattedDate = dateRaw.replace(/\//g, '-').replace(/"/g, '');
      if (/^\d{3}-\d{2}-\d{2}$/.test(formattedDate)) {
        const parts = formattedDate.split('-');
        formattedDate = `${parseInt(parts[0]) + 1911}-${parts[1]}-${parts[2]}`;
      } else if (/^\d{7}$/.test(formattedDate)) {
        const y = parseInt(formattedDate.substring(0, 3)) + 1911;
        const m = formattedDate.substring(3, 5);
        const d = formattedDate.substring(5, 7);
        formattedDate = `${y}-${m}-${d}`;
      }

      if (!/^\d{4}-\d{2}-\d{2}$/.test(formattedDate)) {
        continue;
      }

      if (!invoiceGroups[invoiceNo]) {
        invoiceGroups[invoiceNo] = {
          invoiceNo,
          date: formattedDate,
          store,
          amount: 0,
          items: []
        };
      }
      
      invoiceGroups[invoiceNo].items.push({ name: itemName, price: amount });
      invoiceGroups[invoiceNo].amount += amount;
    }

    for (const key in invoiceGroups) {
      const inv = invoiceGroups[key];
      const newInvoice = {
        id: `inv_csv_${Date.now()}_${key}`,
        invoiceNo: inv.invoiceNo,
        store: inv.store,
        amount: inv.amount,
        date: inv.date,
        items: inv.items,
        suggestedAccount: AppState.accounts[0] ? AppState.accounts[0].id : 'acc_cash_1',
        paymentConfirmed: false
      };
      AppState.carrierInvoices.push(newInvoice);
      importedCount++;
    }

    if (importedCount > 0) {
      await saveStateToStorage();
      switchTab(activeTab);
      alert(`???????ùË???‰π? ${importedCount} ?ëÔ?Ó®™Ëü°???ùÂ??∑Êï∫?∞Óπ±?†Ô??????ÊÆ?`);
    } else {
      alert("CSV ?ºÓ???ùÂ?ÓØ?ÊΩõÓ?????ÊΩõÂ∑®?àÔã™???);
    }
  };
  reader.readAsText(file);
}

// --- Categories Manager ---
async function addCategory(type, name = null) {
  const inputId = type === 'expense' ? 'new-expense-cat-input' : 'new-income-cat-input';
  const val = name || document.getElementById(inputId).value.trim();
  
  if (!val) return;
  
  if (AppState.categories[type].includes(val)) {
    alert("?∞ËÑ§??‰∫ôÊ??ÆÓ¶∂ÓØ≠Â??);
    return;
  }

  AppState.categories[type].push(val);
  
  if (!name) {
    document.getElementById(inputId).value = '';
  }

  await saveStateToStorage();
  renderCategories();
}

async function deleteCategory(type, cat) {
  const defaultCats = {
    expense: ['?åËÑ§?', '???'],
    income: ['????', '???']
  };
  
  if (defaultCats[type].includes(cat)) {
    alert("?Ë©???ëË∫´?øÓµ§??????∑Ó???);
    return;
  }

  if (confirm(`??∑Ó??øÓµ§???{cat}?????µËî£?Ë∏πÊ??????ñÆ??ùÂ????????∑Ó????`)) {
    AppState.categories[type] = AppState.categories[type].filter(c => c !== cat);
    await saveStateToStorage();
    renderCategories();
  }
}

// --- Systems Setting Utilities ---
async function changePinCode() {
  if (!currentUser) return;
  const oldPassword = prompt("?¢Ô???‰∫¶Ó???óËë£?Ó∏???Ä?????");
  const verified = await window.Security.verifyUserLogin(currentUser, oldPassword);
  if (!verified) {
    alert("??Ä???ΩÆ??ÖÔêß?ÑÈö§Ê≠?????ΩÊ†º?ñÂ??);
    return;
  }
  
  const newPassword = prompt("?¢Ô???‰∫§Ó??ñÔ?????);
  if (!newPassword || newPassword.length < 4) {
    alert("?ñÔ????ñÓ??óÔóΩ??õË©®???? 4 ????");
    return;
  }

  const confirmPassword = prompt("?¢Ô???à‚???‰∫§Ó??ñÔ????‰∫¶‚Ö°?§Ôö°?");
  if (newPassword !== confirmPassword) {
    alert("??áÊ¥ª?ñÔ????Ë©®ÔÖØ?ùÔ???Êπ??ΩÊ†º?ñÊÜ≠????);
    return;
  }

  // Re-register verification and save
  try {
    const cipherKey = `acc_u_${currentUser}_cipher`;
    const verificationCipher = await window.Security.encryptForUser("VERIFIED", currentUser, newPassword);
    localStorage.setItem(cipherKey, verificationCipher);
    
    inMemoryDecryptionKey = newPassword;
    await saveStateToStorage();
    alert("?ñÔ???ùΩ?ºÓ?????óÓº∫??à‚?Ó®?‰∫??øËºª??????Ω¶??);
  } catch (err) {
    alert("?ΩÊ†º?ñÊÜ≠???? + err.message);
  }
}

function resetAllApp() {
  if (confirm("?Ó∫? ?úÂÜΩ??óÓºº????????Ó©??ûË®æ???∑Ó???∏Ô??ÆÓ¶∂ÓØ?Á•???????ë£?Ê°????????óÓ?n?????¨Óºª??????App ???")) {
    localStorage.clear();
    location.reload();
  }
}

// Export database encrypted as a downloadable JSON file
async function exportEncryptedBackup() {
  if (!inMemoryDecryptionKey || !currentUser) return;
  try {
    const rawText = JSON.stringify(AppState);
    const encryptedText = await window.Security.encryptForUser(rawText, currentUser, inMemoryDecryptionKey);
    
    // Download logic
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(encryptedText);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `accounting_backup_${currentUser}_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  } catch (err) {
    alert("??¨Ôäæ?Ó©íÈÅ¢?≠Ê???? + err.message);
  }
}

// Upload encrypted backup file and restore
async function importEncryptedBackup(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  const password = prompt("?¢Ô???‰∫•Â??Ó©íÈÅ¢?ºÓ???†Ô?????????");
  if (!password) return;

  const reader = new FileReader();
  reader.onload = async (e) => {
    const cipherText = e.target.result.trim();
    try {
      const decrypted = await window.Security.decryptForUser(cipherText, currentUser, password);
      const parsedData = JSON.parse(decrypted);
      
      if (parsedData.accounts && parsedData.transactions) {
        AppState = parsedData;
        inMemoryDecryptionKey = password;
        
        const cipherKey = `acc_u_${currentUser}_cipher`;
        const verificationCipher = await window.Security.encryptForUser("VERIFIED", currentUser, password);
        localStorage.setItem(cipherKey, verificationCipher);
        
        await saveStateToStorage();
        
        alert("?àÔã™??®Ê???Ó∏??Ó∏?");
        location.reload();
      } else {
        alert("?Ó©íÈÅ¢?ºÓ???Êæ??ùÔ?Ëø§Ëù£Á∂?");
      }
    } catch (error) {
      alert("????≠Ê???óÓºª?????????Ó°??ûË≥£??¢Ô?Ê≠?????);
    }
  };
  reader.readAsText(file);
}

// Export raw ledger to Excel (CSV)
function exportLedgerToCsv() {
  let csvContent = "\ufeff"; // BOM for Excel UTF-8 display
  csvContent += "?‰∫?,??ÜÓ??øÓµ§?,???,??ñÆ???ßÔê£?ØÊí£?ÆÔ?,?øÓµ§???Ó©ñÈ?\n";
  
  AppState.transactions.forEach(t => {
    const acc = AppState.accounts.find(a => a.id === t.accountId);
    const destAcc = t.destAccountId ? AppState.accounts.find(a => a.id === t.destAccountId) : null;
    
    const accName = acc ? acc.name : '';
    const destAccName = destAcc ? destAcc.name : '';
    const notes = t.notes ? t.notes.replace(/"/g, '""') : '';

    csvContent += `"${t.date}","${t.type === 'income' ? '??ÖÔÖØ' : t.type === 'expense' ? '??¨Ôäæ' : '?ßÔê£??}",${t.amount},"${accName}","${destAccName}","${t.category}","${notes}"\n`;
  });

  const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `Ledger_Export_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
}

// --- Browser Notifications Center ---
function triggerNotificationTest() {
  if (!("Notification" in window)) {
    alert("?????¥Ê??????Ä?Ä?¢ÔóæÓ≤?Ó´≤Ó??Ó∏ÑÔ?");
    return;
  }

  Notification.requestPermission().then(permission => {
    if (permission === "granted") {
      new Notification("?Ó©??ÆÓ¶∫?Ó´≤Ó????", {
        body: "?úÁ?Â≤????óÓºº??≠Ê???Ω‚????™Ëë£?Ê°Ä?•Ê??©Ô??Ó∏?",
        icon: "./icon.svg"
      });
    } else {
      alert("?Ó´≤Ó?????°ÊÄ??ØÓü©??¢Ô?ÓØ??¥Ê???ªË∫´?∞Ó´Ø?????Ó´≤Ó??àÔ????);
    }
  });
}

// --- Helper Utilities ---
function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    alert("?åËÑ∞??ÜË???ûÓ?Óπ??ÉÔä∑??æÁ•®?™ÈÅ∏???êÓ??‰∫•Á•®?ùÔ???Line ?¢Êñ§???ãÊ???);
  }).catch(err => {
    console.error('Could not copy text: ', err);
  });
}

// Init Form Events
function initFormEventListeners() {
  const carrierInput = document.getElementById('carrier-barcode-input');
  if (carrierInput) {
    carrierInput.addEventListener('input', (e) => {
      let val = e.target.value;
      if (val === '') return;
      
      // Remove all slashes
      let clean = val.replace(/\//g, '');
      
      // Auto-uppercase
      clean = clean.toUpperCase();
      
      // Prepend exactly one slash
      e.target.value = '/' + clean;
    });
  }
}
window.switchAuthTab = switchAuthTab;
window.handleAuthSubmit = handleAuthSubmit;
window.changeLogoStyle = changeLogoStyle;
window.changeFontStyle = changeFontStyle;
window.toggleChartType = toggleChartType;
window.openBudgetSettingModal = openBudgetSettingModal;
window.handleGlobalBudgetSubmit = handleGlobalBudgetSubmit;
window.prevMonth = prevMonth;
window.nextMonth = nextMonth;
window.lockApp = lockApp;
window.openAddTransactionModal = openAddTransactionModal;
window.closeModal = closeModal;
window.setTransType = setTransType;
window.handleTransactionSubmit = handleTransactionSubmit;
window.deleteTransaction = deleteTransaction;
window.editTransaction = editTransaction;
window.openAddAccountModal = openAddAccountModal;
window.openEditAccountModal = openEditAccountModal;
window.handleAccountEditSubmit = handleAccountEditSubmit;
window.setAccountType = setAccountType;
window.handleAccountSubmit = handleAccountSubmit;
window.deleteAccount = deleteAccount;
window.openSecuritiesTransferModal = openSecuritiesTransferModal;
window.setSecDirection = setSecDirection;
window.handleSecuritiesTransferSubmit = handleSecuritiesTransferSubmit;
window.openAddRecurringModal = openAddRecurringModal;
window.handleRecurringSubmit = handleRecurringSubmit;
window.deleteRecurringRule = deleteRecurringRule;
window.toggleRecurTypeFields = toggleRecurTypeFields;
window.openAddSplitPlanModal = openAddSplitPlanModal;
window.handleSplitPlanSubmit = handleSplitPlanSubmit;
window.addMemberToBuilder = addMemberToBuilder;
window.toggleMemberInputs = toggleMemberInputs;
window.removeMemberFromBuilder = removeMemberFromBuilder;
window.openAddSplitTransModal = openAddSplitTransModal;
window.handleSplitTransSubmit = handleSplitTransSubmit;
// calculateRealtimeSplitPreview removed to prevent ReferenceError
window.settleSplitPlan = settleSplitPlan;
window.deleteSplitPlan = deleteSplitPlan;
window.openSetupCarrierModal = openSetupCarrierModal;
window.handleCarrierSetupSubmit = handleCarrierSetupSubmit;
window.triggerMockInvoiceDownload = triggerMockInvoiceDownload;
window.openQrScanner = openQrScanner;
window.initRealQrScanner = initRealQrScanner;
window.closeRealQrScanner = closeRealQrScanner;
window.simulateQrScanSuccess = simulateQrScanSuccess;
window.confirmCarrierInvoice = confirmCarrierInvoice;
window.handleInvoiceCsvUpload = handleInvoiceCsvUpload;
window.addCategory = addCategory;
window.deleteCategory = deleteCategory;
window.filterCategories = filterCategories;
window.openAddInventoryModal = openAddInventoryModal;
window.openEditInventoryModal = openEditInventoryModal;
window.handleInventorySubmit = handleInventorySubmit;
window.deleteInventoryItem = deleteInventoryItem;
window.updateInventoryQuantity = updateInventoryQuantity;
window.generateShoppingList = generateShoppingList;
window.executeShoppingSplit = executeShoppingSplit;
window.changePinCode = changePinCode;
window.resetAllApp = resetAllApp;
window.exportEncryptedBackup = exportEncryptedBackup;
window.importEncryptedBackup = importEncryptedBackup;
window.exportLedgerToCsv = exportLedgerToCsv;
window.triggerNotificationTest = triggerNotificationTest;

// Visual Customizer & Layout exports
window.changeThemeMode = changeThemeMode;
window.saveSettlementDay = saveSettlementDay;
window.changeButtonTheme = changeButtonTheme;
window.changeDevMode = changeDevMode;
window.changePetTheme = changePetTheme;
window.handleMascotTypeChange = handleMascotTypeChange;
window.handleMascotSelectionChange = handleMascotSelectionChange;
window.changeAppName = changeAppName;
window.saveCustomAppName = saveCustomAppName;
window.toggleSidebar = toggleSidebar;
window.handleAccountTypeSelectBtn = handleAccountTypeSelectBtn;

// Credit Card Installment UI exposures
window.setCcInstallmentType = setCcInstallmentType;
window.setCcInstallmentPeriod = setCcInstallmentPeriod;
window.calculateCcInstallmentPreview = calculateCcInstallmentPreview;

// Dream/Wish List exposures (previously missing - caused buttons to not respond)
window.openAddDreamModal = openAddDreamModal;
window.openEditDreamModal = openEditDreamModal;
window.handleDreamSubmit = handleDreamSubmit;
window.handleDreamProgressSubmit = handleDreamProgressSubmit;
window.deleteDream = deleteDream;
window.openDreamProgressModal = openDreamProgressModal;
window.renderDreamList = renderDreamList;

// Inventory helper exposures (previously missing)
window.handleInventorySearch = handleInventorySearch;
window.handleUserAreaChange = handleUserAreaChange;
window.handleMainCategoryChange = handleMainCategoryChange;
window.handleSubCategoryChange = handleSubCategoryChange;
window.handleNotifyTypeChange = handleNotifyTypeChange;
window.addInventoryLocation = addInventoryLocation;
window.deleteInventoryLocation = deleteInventoryLocation;
window.addInventoryUnit = addInventoryUnit;
window.deleteInventoryUnit = deleteInventoryUnit;

// Category icon management exposures
window.addIcon = addIcon;
window.deleteIcon = deleteIcon;

// Auth recovery exposure
window.handleAccountRecovery = handleAccountRecovery;

// Dropdown toggle exposure
if (typeof toggleDropdown === 'function') window.toggleDropdown = toggleDropdown;


// Chart toggle exposure
async function toggleChartType(type) {
  AppState.chartType = type;
  await saveStateToStorage();
  renderAccountsStatistics();
}
window.toggleChartType = toggleChartType;

// Dynamic day selection for recurring transactions
function handleRecurFrequencyChange() {
  const freq = document.getElementById('recur-frequency').value;
  const group = document.getElementById('recur-day-anchor-group');
  
  let dayOptions = '';
  for(let i=1; i<=31; i++) dayOptions += `<option value="${i}">${i}??/option>`;
  
  if (freq === 'daily') {
    group.style.display = 'none';
    group.innerHTML = `<input type="hidden" id="recur-day-anchor" value="1">`;
  } else if (freq === 'weekly') {
    group.style.display = 'block';
    group.innerHTML = `
      <label>?????/label>
      <select id="recur-day-anchor" required class="form-control">
        <option value="1">?Ó∏??ù¬Ä</option>
        <option value="2">?Ó∏???/option>
        <option value="3">?Ó∏???/option>
        <option value="4">?Ó∏???/option>
        <option value="5">?Ó∏???/option>
        <option value="6">?Ó∏???/option>
        <option value="0">?Ó∏???/option>
      </select>
    `;
  } else if (freq === 'monthly') {
    group.style.display = 'block';
    group.innerHTML = `
      <label>?????/label>
      <select id="recur-day-anchor" required class="form-control">
        ${dayOptions}
      </select>
    `;
  } else if (freq === 'yearly') {
    group.style.display = 'block';
    
    let monthOptions = '';
    for(let i=1; i<=12; i++) monthOptions += `<option value="${i}">${i}??/option>`;
    
    group.innerHTML = `
      <label>?????/label>
      <div style="display: flex; gap: 0.5rem;">
        <select id="recur-month-anchor" required class="form-control" style="flex:1;">
          ${monthOptions}
        </select>
        <select id="recur-day-anchor" required class="form-control" style="flex:1;">
          ${dayOptions}
        </select>
      </div>
    `;
  }
}
window.handleRecurFrequencyChange = handleRecurFrequencyChange;

// --- RENDER X: Dream List ---
function renderDreamList() {
  const container = document.getElementById('dream-list-container');
  if (!container) return;
  container.innerHTML = '';
  
  if (!AppState.dreams || AppState.dreams.length === 0) {
    container.innerHTML = `<div style="padding: 3rem; text-align: center; color: var(--text-muted); background: var(--bg-card); border-radius: 16px;">?Ê°Ä??ùÓ???ûÈ¢±??øÓ¶∑??ÆÔ???Óø???æ¬Ä?ªÓ??ìÓµ®??ÓÆã¬Ä???™Ô???ù°??</div>`;
    return;
  }
  
  AppState.dreams.forEach(dream => {
    const progress = Math.min(100, Math.floor((dream.current / dream.target) * 100));
    const isCompleted = progress >= 100;
    
    const card = document.createElement('div');
    card.className = 'glass-card split-plan-card';
    card.style.position = 'relative';
    if (isCompleted) {
      card.style.border = '2px solid var(--color-green)';
      card.style.boxShadow = '0 0 15px rgba(16, 185, 129, 0.2)';
    }
    
    card.innerHTML = `
      ${isCompleted ? '<div style="position: absolute; top: -10px; right: -10px; background: var(--color-green); color: white; font-size: 0.7rem; padding: 2px 8px; border-radius: 10px; font-weight: bold; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">?åËÑ§?????</div>' : ''}
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
        <h3 style="font-family: var(--font-title); font-size: 1.25rem; font-weight: 700; margin: 0;">${escapeHtml(dream.icon)} ${escapeHtml(dream.name)}</h3>
        <div class="dropdown-container">
          <button class="btn-icon-toggle" onclick="toggleDropdown(event, 'dream-menu-${dream.id}')">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="var(--text-secondary)"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
          </button>
          <div class="dropdown-menu" id="dream-menu-${dream.id}">
            <button class="dropdown-item" onclick="openEditDreamModal('${dream.id}')">?∫Âàª??/button>
            <button class="dropdown-item text-danger" onclick="deleteDream('${dream.id}')">??∑Ó?</button>
          </div>
        </div>
      </div>
      
      <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.5rem;">
        <span style="font-size: 0.85rem; color: var(--text-secondary);">?Ê°Ä????º≤</span>
        <span style="font-family: var(--font-title); font-size: 1.25rem; font-weight: 700; color: ${isCompleted ? 'var(--color-green)' : 'var(--text-primary)'};">
          ${formatAccounting(dream.current)} <span style="font-size: 0.9rem; font-weight: normal; color: var(--text-muted);">/ ${formatAccounting(dream.target)}</span>
        </span>
      </div>
      
      <div class="split-progress-container" style="margin-bottom: 1rem;">
        <div class="split-progress-bar" style="width: ${progress}%; background: ${isCompleted ? 'var(--color-green)' : 'var(--color-indigo)'};"></div>
      </div>
      <div style="text-align: right; font-size: 0.8rem; color: var(--text-muted); margin-top: -0.5rem; margin-bottom: 1rem;">${progress}%</div>
      
      ${!isCompleted ? `
      <button class="btn-primary" style="width: 100%; font-size: 0.85rem; padding: 0.5rem;" onclick="openDreamProgressModal('${dream.id}')">?ÆÓ¶∂?ØÈ???</button>
      ` : ''}
    `;
    container.appendChild(card);
  });
}

function openAddDreamModal() {
  document.getElementById('form-dream').reset();
  document.getElementById('dream-edit-id').value = '';
  document.getElementById('modal-dream-title').innerText = '????øÓ¶∑?';
  openModal('modal-dream');
}

function openEditDreamModal(id) {
  const dream = AppState.dreams.find(d => d.id === id);
  if (!dream) return;
  document.getElementById('dream-edit-id').value = dream.id;
  document.getElementById('dream-icon').value = dream.icon;
  document.getElementById('dream-name').value = dream.name;
  document.getElementById('dream-target').value = dream.target;
  document.getElementById('dream-current').value = dream.current;
  document.getElementById('modal-dream-title').innerText = '?∫Âàª?©ÊÜøÓ¶?';
  openModal('modal-dream');
  const menus = document.querySelectorAll('.dropdown-menu');
  menus.forEach(m => m.classList.remove('show'));
}

async function handleDreamSubmit(event) {
  event.preventDefault();
  const id = document.getElementById('dream-edit-id').value;
  const icon = document.getElementById('dream-icon').value;
  const name = document.getElementById('dream-name').value;
  const target = Number(document.getElementById('dream-target').value);
  const current = Number(document.getElementById('dream-current').value);
  
  if (id) {
    const idx = AppState.dreams.findIndex(d => d.id === id);
    if (idx !== -1) {
      AppState.dreams[idx] = { ...AppState.dreams[idx], icon, name, target, current };
    }
  } else {
    AppState.dreams.push({
      id: `dream_${Date.now()}`,
      icon, name, target, current
    });
  }
  
  await saveStateToStorage();
  renderDreamList();
  closeModal('modal-dream');
}

async function deleteDream(id) {
  if (confirm('Á¢∫Â?Ë¶ÅÂà™?§Ê≠§È°òÊ?Ê∏ÖÂñÆ?éÔ?')) {
    AppState.dreams = AppState.dreams.filter(d => d.id !== id);
    await saveStateToStorage();
    renderDreamList();
  }
}

function openDreamProgressModal(id) {
  document.getElementById('form-dream-progress').reset();
  document.getElementById('dream-progress-id').value = id;
  openModal('modal-dream-progress');
}

async function handleDreamProgressSubmit(event) {
  event.preventDefault();
  const id = document.getElementById('dream-progress-id').value;
  const amount = Number(document.getElementById('dream-progress-amount').value);
  
  const dream = AppState.dreams.find(d => d.id === id);
  if (dream) {
    dream.current += amount;
    if (dream.current >= dream.target) {
      dream.current = dream.target;
      setTimeout(() => {
        alert(`?? ?≠Â??®Ô??îÊ?È°òÊ?Ôº?{dream.icon} ${dream.name} ??`);
      }, 300);
    }
    await saveStateToStorage();
    renderDreamList();
  }
  closeModal('modal-dream-progress');
}

// --- Additional Inventory Helper Functions ---
function populateInventoryLocationsAndUnits() {
  const locationSelect = document.getElementById('inventory-location');
  const unitSelect = document.getElementById('inventory-unit');
  if (!locationSelect || !unitSelect) return;
  
  locationSelect.innerHTML = '<option value="">Ë´ãÈÅ∏??/option>';
  unitSelect.innerHTML = '<option value="">?∏Ê?</option>';
  
  const locations = AppState.inventoryLocations || ['ÂÆ¢Âª≥', 'ÂªöÊàø', 'Êµ¥ÂÆ§', '?•ÂÆ§', '?≤Ë?ÂÆ?, 'Ëªä‰?', 'Ëæ¶ÂÖ¨ÂÆ?, '?ΩÂè∞'];
  locations.forEach(loc => {
    const opt = document.createElement('option');
    opt.value = loc;
    opt.innerText = loc;
    locationSelect.appendChild(opt);
  });
  
  const units = AppState.inventoryUnits || ['??, '??, '??, '??, 'Ë¢?, 'ÁΩ?, 'Ê¢?, '??, 'Áµ?, '??, '??, 'Âº?];
  units.forEach(u => {
    const opt = document.createElement('option');
    opt.value = u;
    opt.innerText = u;
    unitSelect.appendChild(opt);
  });
}

function initExpiryDateSelects() {
  const ySelect = document.getElementById('inventory-expiry-year');
  const mSelect = document.getElementById('inventory-expiry-month');
  const dSelect = document.getElementById('inventory-expiry-day');
  if (!ySelect || !mSelect || !dSelect) return;
  
  ySelect.innerHTML = '<option value="">Âπ?/option>';
  mSelect.innerHTML = '<option value="">??/option>';
  dSelect.innerHTML = '<option value="">??/option>';
  
  const currentYear = new Date().getFullYear();
  for (let i = currentYear; i <= currentYear + 20; i++) {
    const opt = document.createElement('option');
    opt.value = i;
    opt.innerText = i + 'Âπ?;
    ySelect.appendChild(opt);
  }
  
  for (let i = 1; i <= 12; i++) {
    const opt = document.createElement('option');
    opt.value = i;
    opt.innerText = i + '??;
    mSelect.appendChild(opt);
  }
  
  for (let i = 1; i <= 31; i++) {
    const opt = document.createElement('option');
    opt.value = i;
    opt.innerText = i + '??;
    dSelect.appendChild(opt);
  }
}

function syncExpiryDate() {
  const ySelect = document.getElementById('inventory-expiry-year').value;
  const mSelect = document.getElementById('inventory-expiry-month').value;
  const dSelect = document.getElementById('inventory-expiry-day').value;
  if (ySelect && mSelect && dSelect) {
    const m = mSelect.padStart(2, '0');
    const d = dSelect.padStart(2, '0');
    document.getElementById('inventory-expiry').value = `${ySelect}-${m}-${d}`;
  } else {
    document.getElementById('inventory-expiry').value = '';
  }
}

function renderSplitRightPanel() {
  const container = document.getElementById('right-split-summary');
  if (!container) return;
  
  const selectedId = window.selectedSplitPlanId;
  const plan = AppState.splitPlans.find(p => p.id === selectedId);
  
  if (!plan) {
    // Default summary
    const activePlans = AppState.splitPlans.filter(p => p.status !== 'settled').length;
    const settledPlans = AppState.splitPlans.filter(p => p.status === 'settled').length;
    
    let totalSpendAll = 0;
    AppState.splitPlans.forEach(p => {
      totalSpendAll += p.transactions.reduce((sum, tx) => sum + Number(tx.amount), 0);
    });
    
    container.innerHTML = `
      <div class="day-summary-grid">
        <div class="summary-card">
          <div class="summary-label">?≤Ë?‰∏≠Ë???/div>
          <div class="summary-val total" style="color: var(--color-green);">${activePlans}</div>
        </div>
        <div class="summary-card">
          <div class="summary-label">Â∑≤Á?ÁÆóË???/div>
          <div class="summary-val total">${settledPlans}</div>
        </div>
      </div>
      <div style="margin-top: 1rem; padding: 1rem; background: rgba(255,255,255,0.02); border-radius: 12px; border: 1px solid rgba(255,255,255,0.05); text-align: center;">
        <div style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.5rem;">ÈªûÊ?Â∑¶ÂÅ¥?ÜÂ∏≥Ë®àÁï´?°Á?Ôºå‰ª•?•Á?Á¥∞È??±Ë≤ª</div>
        <div style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.25rem;">?Ä?âË??´Á∏Ω?±Ë≤ª</div>
        <div style="font-family: var(--font-title); font-size: 1.5rem; font-weight: bold; color: var(--color-purple);">${formatAccounting(totalSpendAll)}</div>
      </div>
    `;
    return;
  }

  // Calculate detailed costs for the selected plan
  const totalSpend = plan.transactions.reduce((sum, tx) => sum + Number(tx.amount), 0);
  
  // Calculate who paid what
  const paidAmounts = {};
  plan.members.forEach(m => paidAmounts[m] = 0);
  plan.transactions.forEach(tx => {
    if (!paidAmounts[tx.payer]) paidAmounts[tx.payer] = 0;
    paidAmounts[tx.payer] += Number(tx.amount);
  });
  
  let membersDetailHtml = plan.members.map(m => `
    <div style="display: flex; justify-content: space-between; border-bottom: 1px dashed rgba(255,255,255,0.1); padding-bottom: 0.25rem; margin-bottom: 0.25rem;">
      <span>${escapeHtml(m)} ‰ª??</span>
      <span style="font-weight: bold; color: var(--color-green);">${formatAccounting(paidAmounts[m] || 0)}</span>
    </div>
  `).join('');

  container.innerHTML = `
    <div style="margin-bottom: 1rem;">
      <div style="font-size: 0.9rem; font-weight: bold; color: var(--theme-color); margin-bottom: 0.25rem;">${escapeHtml(plan.name)}</div>
      <div style="font-size: 0.75rem; color: var(--text-muted);">Á∏ΩÁ¥∞?ÖËä±Ë≤ªÊ?Ê≥?/div>
    </div>
    
    <div style="padding: 1rem; background: rgba(255,255,255,0.02); border-radius: 12px; border: 1px solid rgba(255,255,255,0.05); margin-bottom: 1rem;">
      <div style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.25rem;">Ê≠§Ë??´Á∏Ω?±Ë≤ª</div>
      <div style="font-family: var(--font-title); font-size: 1.5rem; font-weight: bold; color: var(--color-purple);">${formatAccounting(totalSpend)}</div>
    </div>
    
    <div style="padding: 1rem; background: rgba(255,255,255,0.02); border-radius: 12px; border: 1px solid rgba(255,255,255,0.05);">
      <div style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.75rem; font-weight: bold;">?ÑÊ??°‰ª£Â¢äÁ?Ê≥?/div>
      <div style="display: flex; flex-direction: column; gap: 0.25rem; font-size: 0.8125rem;">
        ${membersDetailHtml}
      </div>
    </div>
  `;
}

let splitPreviewTimeout = null;
function calculateRealtimeSplitPreview() {
  clearTimeout(splitPreviewTimeout);
  splitPreviewTimeout = setTimeout(() => {
    const amountStr = document.getElementById('split-trans-amount').value;
    const amount = Number(amountStr) || 0;
    
    const container = document.getElementById('split-members-list-checkboxes');
    if (!container) return;
    
    const rows = container.querySelectorAll('div');
    let selectedMembers = [];
    rows.forEach(row => {
       const cb = row.querySelector('input[type="checkbox"]');
       if (cb && cb.checked) {
          selectedMembers.push(cb.value);
       }
    });

    const previewList = document.getElementById('split-preview-list');
    if (!previewList) return;
    
    if (selectedMembers.length === 0 || amount === 0) {
      previewList.innerHTML = '<div style="color:var(--text-muted); font-size:0.8rem; text-align:center;">?°Â??§Á???/div>';
      return;
    }
    
    const share = amount / selectedMembers.length;
    let html = '';
    selectedMembers.forEach(m => {
      html += `
        <div style="display: flex; justify-content: space-between; border-bottom: 1px dashed rgba(255,255,255,0.1); padding-bottom: 0.25rem; margin-bottom: 0.25rem;">
          <span>${escapeHtml(m)} ?â‰?</span>
          <span style="font-weight: bold; color: var(--color-purple);">${formatAccounting(share)}</span>
        </div>
      `;
    });
    
    previewList.innerHTML = html;
  }, 250);
}

window.calculateRealtimeSplitPreview = calculateRealtimeSplitPreview;




// --- Date Wheel Picker Logic ---
let wheelPickerCallback = null;
let wheelYear = new Date().getFullYear();
let wheelMonth = new Date().getMonth() + 1;
let wheelDay = new Date().getDate();

function openWheelPicker(currentDateStr, callback) {
  wheelPickerCallback = callback;
  const overlay = document.getElementById('wheel-date-picker');
  
  if (currentDateStr) {
    const d = new Date(currentDateStr);
    if (!isNaN(d.getTime())) {
      wheelYear = d.getFullYear();
      wheelMonth = d.getMonth() + 1;
      wheelDay = d.getDate();
    }
  } else {
    const d = new Date();
    wheelYear = d.getFullYear();
    wheelMonth = d.getMonth() + 1;
    wheelDay = d.getDate();
  }
  
  initWheelData();
  overlay.classList.add('open');
  
  // Need to wait for rendering to apply scroll
  setTimeout(() => {
    scrollToWheelItem('wheel-col-year', wheelYear);
    scrollToWheelItem('wheel-col-month', wheelMonth);
    scrollToWheelItem('wheel-col-day', wheelDay);
  }, 50);
}

function closeWheelPicker() {
  document.getElementById('wheel-date-picker').classList.remove('open');
}

function confirmWheelPicker() {
  const y = getSelectedWheelValue('wheel-col-year');
  const m = getSelectedWheelValue('wheel-col-month');
  const d = getSelectedWheelValue('wheel-col-day');
  
  if (wheelPickerCallback) {
    const paddedM = String(m).padStart(2, '0');
    const paddedD = String(d).padStart(2, '0');
    wheelPickerCallback(`${y}-${paddedM}-${paddedD}`);
  }
  closeWheelPicker();
}

function initWheelData() {
  // Years (e.g., 2010 to 2040)
  const colYear = document.getElementById('wheel-col-year');
  let yHtml = '';
  for(let i = 2010; i <= 2040; i++) {
    yHtml += `<div class="wheel-item" data-val="${i}">${i}Âπ?/div>`;
  }
  colYear.innerHTML = yHtml;
  
  // Months
  const colMonth = document.getElementById('wheel-col-month');
  let mHtml = '';
  for(let i = 1; i <= 12; i++) {
    mHtml += `<div class="wheel-item" data-val="${i}">${String(i).padStart(2, '0')}??/div>`;
  }
  colMonth.innerHTML = mHtml;
  
  // Days (initial)
  updateWheelDays();
  
  // Add scroll listeners
  [colYear, colMonth, document.getElementById('wheel-col-day')].forEach(col => {
    col.addEventListener('scroll', () => {
      clearTimeout(col.snapTimeout);
      col.snapTimeout = setTimeout(() => handleWheelScrollDone(col), 150);
      updateWheelVisuals(col);
    });
  });
}

function updateWheelDays() {
  const y = getSelectedWheelValue('wheel-col-year') || wheelYear;
  const m = getSelectedWheelValue('wheel-col-month') || wheelMonth;
  const daysInMonth = new Date(y, m, 0).getDate();
  
  const colDay = document.getElementById('wheel-col-day');
  let dHtml = '';
  for(let i = 1; i <= daysInMonth; i++) {
    dHtml += `<div class="wheel-item" data-val="${i}">${String(i).padStart(2, '0')}??/div>`;
  }
  colDay.innerHTML = dHtml;
  
  // Re-attach scroll listener if replaced
  colDay.onscroll = () => {
    clearTimeout(colDay.snapTimeout);
    colDay.snapTimeout = setTimeout(() => handleWheelScrollDone(colDay), 150);
    updateWheelVisuals(colDay);
  };
  
  // Ensure day selection is valid
  let currentD = getSelectedWheelValue('wheel-col-day') || wheelDay;
  if (currentD > daysInMonth) currentD = daysInMonth;
  
  setTimeout(() => scrollToWheelItem('wheel-col-day', currentD), 10);
}

function handleWheelScrollDone(col) {
  updateWheelVisuals(col);
  if (col.id === 'wheel-col-year' || col.id === 'wheel-col-month') {
    updateWheelDays();
  }
}

function updateWheelVisuals(col) {
  const items = col.querySelectorAll('.wheel-item');
  const center = col.scrollTop + col.clientHeight / 2;
  
  let closestItem = null;
  let minDiff = Infinity;
  
  items.forEach(item => {
    item.classList.remove('selected');
    const itemCenter = item.offsetTop + item.clientHeight / 2 - col.offsetTop; // relative to col
    const diff = Math.abs(center - itemCenter);
    if (diff < minDiff) {
      minDiff = diff;
      closestItem = item;
    }
  });
  
  if (closestItem) {
    closestItem.classList.add('selected');
  }
}

function scrollToWheelItem(colId, val) {
  const col = document.getElementById(colId);
  if(!col) return;
  const item = col.querySelector(`.wheel-item[data-val="${val}"]`);
  if (item) {
    // 40 is item height. Center item: scrollTop = item.offsetTop - col.clientHeight/2 + item.clientHeight/2
    const targetScroll = item.offsetTop - col.clientHeight / 2 + 20;
    col.scrollTo({ top: targetScroll, behavior: 'smooth' });
    setTimeout(() => updateWheelVisuals(col), 300);
  }
}

function getSelectedWheelValue(colId) {
  const col = document.getElementById(colId);
  if(!col) return null;
  const selected = col.querySelector('.wheel-item.selected');
  if (selected) return Number(selected.getAttribute('data-val'));
  
  // Fallback if not updated yet
  const items = col.querySelectorAll('.wheel-item');
  const center = col.scrollTop + col.clientHeight / 2;
  let closestItem = null;
  let minDiff = Infinity;
  items.forEach(item => {
    const itemCenter = item.offsetTop + 20 - col.offsetTop;
    const diff = Math.abs(center - itemCenter);
    if (diff < minDiff) {
      minDiff = diff;
      closestItem = item;
    }
  });
  if (closestItem) return Number(closestItem.getAttribute('data-val'));
  return null;
}

window.openWheelPicker = openWheelPicker;
window.closeWheelPicker = closeWheelPicker;
window.confirmWheelPicker = confirmWheelPicker;
