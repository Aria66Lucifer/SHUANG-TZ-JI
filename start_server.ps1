# App Local Server Startup Script (Pure ASCII to avoid Windows PowerShell encoding issues)

# Detect Local IP Address dynamically with strict validation
$localIP = ""

# Method 1: Get-NetIPAddress (simple, no exotic filters)
try {
    $ip1 = Get-NetIPAddress -AddressFamily IPv4 -ErrorAction Stop |
        Where-Object {
            $_.IPAddress -notlike "127.*" -and
            $_.IPAddress -notlike "169.254.*" -and
            $_.InterfaceAlias -notlike "*Loopback*"
        } | Select-Object -First 1 -ExpandProperty IPAddress
    if ($ip1) { $localIP = $ip1 }
} catch {}

# Method 2: DNS resolution fallback
if ([string]::IsNullOrEmpty($localIP)) {
    try {
        $ip2 = [System.Net.Dns]::GetHostAddresses([System.Net.Dns]::GetHostName()) |
            Where-Object {
                $_.AddressFamily -eq 'InterNetwork' -and
                $_.ToString() -notlike '127.*' -and
                $_.ToString() -notlike '169.254.*'
            } | Select-Object -First 1
        if ($ip2) { $localIP = $ip2.IPAddressToString }
    } catch {}
}

# Method 3: Parse ipconfig output (most reliable fallback)
if ([string]::IsNullOrEmpty($localIP)) {
    try {
        $ipcfgLines = & cmd /c ipconfig 2>$null
        foreach ($line in $ipcfgLines) {
            if ($line -match 'IPv4[^:]*:\s*((?!127\.|169\.254\.)\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})') {
                $localIP = $Matches[1].Trim()
                break
            }
        }
    } catch {}
}

# Strict IPv4 format validation
$ipv4Regex = '^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$'
$isValidIP = (-not [string]::IsNullOrEmpty($localIP)) -and ($localIP -match $ipv4Regex) -and ($localIP -ne '127.0.0.1')

# --- Firewall and Admin Check ---
$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
$firewallRuleName = "Accounting App Server (Port 8080)"

if ($isAdmin) {
    # Check and add firewall rule
    $ruleExists = Get-NetFirewallRule -DisplayName $firewallRuleName -ErrorAction SilentlyContinue
    if (-not $ruleExists) {
        try {
            New-NetFirewallRule -DisplayName $firewallRuleName -Direction Inbound -LocalPort 8080 -Protocol TCP -Action Allow -Profile Any | Out-Null
            Write-Host "  [System] Successfully added firewall rule for mobile access (Port 8080)" -ForegroundColor Green
        } catch {
            Write-Host "  [Warning] Failed to add firewall rule automatically." -ForegroundColor Yellow
        }
    }
}

$port80Success = $false

# --- Attempt Port 80 binding (requires elevated netsh ACL) ---
try {
    $listener80 = New-Object System.Net.HttpListener
    $listener80.Prefixes.Add("http://localhost:80/")
    $listener80.Prefixes.Add("http://127.0.0.1:80/")
    $listener80.Prefixes.Add("http://shuangziji.local:80/")
    $listener80.Prefixes.Add("http://suhangziyi.local:80/")
    # NOTE: binding raw IP on port 80 requires admin netsh, skip to avoid crash
    $listener80.Start()
    $port80Success = $true
} catch {
    # Port 80 not available, will use 8080 only
    try { $listener80.Stop() } catch {}
    $listener80 = $null
}

# --- Bind Port 8080 (primary reliable port) ---
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:8080/")
$listener.Prefixes.Add("http://127.0.0.1:8080/")
$listener.Prefixes.Add("http://shuangziji.local:8080/")
$listener.Prefixes.Add("http://suhangziyi.local:8080/")
if ($isValidIP) {
    try {
        $listener.Prefixes.Add("http://${localIP}:8080/")
    } catch {
        Write-Host "  [Warning] Could not bind IP $localIP on port 8080: $_" -ForegroundColor Yellow
    }
}
if ($isAdmin) {
    try {
        $listener.Prefixes.Add("http://+:8080/")
    } catch {}
}
$listener.Start()


Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  Accounting App Local Server Started" -ForegroundColor Green
if ($port80Success) {
    Write-Host "  [Port 80 & 8080 Active for Data Migration]" -ForegroundColor Cyan
    Write-Host "  Recommended App Address: http://suhangziyi.local/" -ForegroundColor Yellow
    Write-Host "  Alternative App Address: http://shuangziji.local/" -ForegroundColor Yellow
    Write-Host "  Local Secure Address   : http://localhost/" -ForegroundColor Cyan
} else {
    Write-Host "  [Port 8080 Active Only]" -ForegroundColor Cyan
    Write-Host "  Recommended App Address: http://suhangziyi.local:8080/" -ForegroundColor Yellow
    Write-Host "  Alternative App Address: http://shuangziji.local:8080/" -ForegroundColor Yellow
    Write-Host "  Local Secure Address   : http://localhost:8080/" -ForegroundColor Cyan
}
if ($isValidIP) {
    $ipDisplay = [string]$localIP
    Write-Host "  --------------------------------------------------------" -ForegroundColor Gray
    Write-Host ("  Mobile/Tablet Link  : http://{0}:8080/" -f $ipDisplay) -ForegroundColor Green
    if (-not $isAdmin) {
        Write-Host "  [!] Cannot connect from mobile? Right-click start_server.ps1" -ForegroundColor Yellow
        Write-Host "      -> 'Run with PowerShell' as Administrator to allow firewall." -ForegroundColor Yellow
    } else {
        Write-Host "  (Ensure mobile device is connected to the same Wi-Fi)" -ForegroundColor White
    }
} else {
    Write-Host "  --------------------------------------------------------" -ForegroundColor Gray
    Write-Host "  [Wi-Fi IP not detected. Mobile access via IP unavailable]" -ForegroundColor Yellow
    Write-Host "  Tip: Check your network adapter and retry." -ForegroundColor White
}

Write-Host "----------------------------------------------------------" -ForegroundColor Gray
Write-Host "  To use custom domains, make sure your Windows hosts file" -ForegroundColor White
Write-Host "  (C:\Windows\System32\drivers\etc\hosts) contains:" -ForegroundColor White
Write-Host "  127.0.0.1 suhangziyi.local" -ForegroundColor Green
Write-Host "  127.0.0.1 shuangziji.local" -ForegroundColor Green
Write-Host "----------------------------------------------------------" -ForegroundColor Gray
Write-Host "  Press Ctrl + C to stop the server" -ForegroundColor Red
Write-Host "==========================================================" -ForegroundColor Cyan

$currentDir = $PSScriptRoot
if ([string]::IsNullOrEmpty($currentDir)) {
    $currentDir = Get-Location
}

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        $path = $request.Url.LocalPath
        if ($path -eq "/") { $path = "/index.html" }

        # Handle CORS Preflight OPTIONS requests
        if ($request.HttpMethod -eq "OPTIONS") {
            $response.Headers.Add("Access-Control-Allow-Origin", "*")
            $response.Headers.Add("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
            $response.Headers.Add("Access-Control-Allow-Headers", "Content-Type")
            $response.StatusCode = 200
            $response.Close()
            continue
        }

        # API Save Data Endpoint
        if ($request.HttpMethod -eq "POST" -and $path -eq "/api/save") {
            $username = $request.QueryString["username"]
            if ([string]::IsNullOrEmpty($username)) {
                $username = "default"
            }
            # Clean username to prevent path injection
            $usernameClean = [regex]::Replace($username, "[^a-zA-Z0-9_\-]", "")
            $dataFile = Join-Path $currentDir "data_${usernameClean}.json"
            
            $reader = New-Object System.IO.StreamReader($request.InputStream, [System.Text.Encoding]::UTF8)
            $body = $reader.ReadToEnd()
            $reader.Close()
            
            [System.IO.File]::WriteAllText($dataFile, $body, [System.Text.Encoding]::UTF8)
            
            $response.ContentType = "application/json; charset=utf-8"
            $response.Headers.Add("Access-Control-Allow-Origin", "*")
            $response.Headers.Add("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
            $response.Headers.Add("Access-Control-Allow-Headers", "Content-Type")
            
            $resBytes = [System.Text.Encoding]::UTF8.GetBytes('{"status":"success"}')
            $response.ContentLength64 = $resBytes.Length
            $response.OutputStream.Write($resBytes, 0, $resBytes.Length)
            $response.Close()
            continue
        }

        # API Load Data Endpoint
        if ($request.HttpMethod -eq "GET" -and $path -eq "/api/load") {
            $username = $request.QueryString["username"]
            if ([string]::IsNullOrEmpty($username)) {
                $username = "default"
            }
            $usernameClean = [regex]::Replace($username, "[^a-zA-Z0-9_\-]", "")
            $dataFile = Join-Path $currentDir "data_${usernameClean}.json"
            
            $response.ContentType = "application/json; charset=utf-8"
            $response.Headers.Add("Access-Control-Allow-Origin", "*")
            $response.Headers.Add("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
            $response.Headers.Add("Access-Control-Allow-Headers", "Content-Type")
            
            if (Test-Path $dataFile) {
                $bytes = [System.IO.File]::ReadAllBytes($dataFile)
                $response.ContentLength64 = $bytes.Length
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
            } else {
                $response.StatusCode = 404
                $resBytes = [System.Text.Encoding]::UTF8.GetBytes('{"error":"not_found"}')
                $response.ContentLength64 = $resBytes.Length
                $response.OutputStream.Write($resBytes, 0, $resBytes.Length)
            }
            $response.Close()
            continue
        }
        
        # API Save User Meta (salt + cipher) Endpoint - for cross-device login
        if ($request.HttpMethod -eq "POST" -and $path -eq "/api/save_user_meta") {
            $username = $request.QueryString["username"]
            if ([string]::IsNullOrEmpty($username)) {
                $response.StatusCode = 400
                $resBytes = [System.Text.Encoding]::UTF8.GetBytes('{"error":"missing_username"}')
                $response.ContentType = "application/json; charset=utf-8"
                $response.Headers.Add("Access-Control-Allow-Origin", "*")
                $response.Headers.Add("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
                $response.Headers.Add("Access-Control-Allow-Headers", "Content-Type")
                $response.ContentLength64 = $resBytes.Length
                $response.OutputStream.Write($resBytes, 0, $resBytes.Length)
                $response.Close()
                continue
            }
            $usernameClean = [regex]::Replace($username, "[^a-zA-Z0-9_\-]", "")
            $metaFile = Join-Path $currentDir "meta_${usernameClean}.json"
            
            $reader = New-Object System.IO.StreamReader($request.InputStream, [System.Text.Encoding]::UTF8)
            $body = $reader.ReadToEnd()
            $reader.Close()
            
            [System.IO.File]::WriteAllText($metaFile, $body, [System.Text.Encoding]::UTF8)
            
            $response.ContentType = "application/json; charset=utf-8"
            $response.Headers.Add("Access-Control-Allow-Origin", "*")
            $response.Headers.Add("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
            $response.Headers.Add("Access-Control-Allow-Headers", "Content-Type")
            $resBytes = [System.Text.Encoding]::UTF8.GetBytes('{"status":"success"}')
            $response.ContentLength64 = $resBytes.Length
            $response.OutputStream.Write($resBytes, 0, $resBytes.Length)
            $response.Close()
            continue
        }
        
        # API Load User Meta (salt + cipher) Endpoint - for cross-device login
        if ($request.HttpMethod -eq "GET" -and $path -eq "/api/load_user_meta") {
            $username = $request.QueryString["username"]
            if ([string]::IsNullOrEmpty($username)) {
                $response.StatusCode = 400
                $resBytes = [System.Text.Encoding]::UTF8.GetBytes('{"error":"missing_username"}')
                $response.ContentType = "application/json; charset=utf-8"
                $response.Headers.Add("Access-Control-Allow-Origin", "*")
                $response.Headers.Add("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
                $response.Headers.Add("Access-Control-Allow-Headers", "Content-Type")
                $response.ContentLength64 = $resBytes.Length
                $response.OutputStream.Write($resBytes, 0, $resBytes.Length)
                $response.Close()
                continue
            }
            $usernameClean = [regex]::Replace($username, "[^a-zA-Z0-9_\-]", "")
            $metaFile = Join-Path $currentDir "meta_${usernameClean}.json"
            
            $response.ContentType = "application/json; charset=utf-8"
            $response.Headers.Add("Access-Control-Allow-Origin", "*")
            $response.Headers.Add("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
            $response.Headers.Add("Access-Control-Allow-Headers", "Content-Type")
            
            if (Test-Path $metaFile) {
                $bytes = [System.IO.File]::ReadAllBytes($metaFile)
                $response.ContentLength64 = $bytes.Length
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
            } else {
                $response.StatusCode = 404
                $resBytes = [System.Text.Encoding]::UTF8.GetBytes('{"error":"not_found"}')
                $response.ContentLength64 = $resBytes.Length
                $response.OutputStream.Write($resBytes, 0, $resBytes.Length)
            }
            $response.Close()
            continue
        }
        
        $cleanPath = $path.Replace("/", "\").TrimStart('\')
        $localPath = Join-Path $currentDir $cleanPath
        
        if (Test-Path $localPath -PathType Leaf) {
            $bytes = [System.IO.File]::ReadAllBytes($localPath)
            
            $ext = [System.IO.Path]::GetExtension($localPath).ToLower()
            $contentType = "text/plain"
            if ($ext -eq ".html") { $contentType = "text/html; charset=utf-8" }
            elseif ($ext -eq ".css") { $contentType = "text/css" }
            elseif ($ext -eq ".js") { $contentType = "application/javascript" }
            elseif ($ext -eq ".svg") { $contentType = "image/svg+xml" }
            elseif ($ext -eq ".json") { $contentType = "application/json" }
            elseif ($ext -eq ".png") { $contentType = "image/png" }
            
            $response.ContentType = $contentType
            $response.ContentLength64 = $bytes.Length
            
            $response.Headers.Add("Access-Control-Allow-Origin", "*")
            
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $errBytes = [System.Text.Encoding]::UTF8.GetBytes("404 - File Not Found")
            $response.OutputStream.Write($errBytes, 0, $errBytes.Length)
        }
        $response.Close()
    }
} catch {
    Write-Host "Server Error: $_" -ForegroundColor Red
} finally {
    $listener.Stop()
    Write-Host "Server stopped." -ForegroundColor Yellow
}
