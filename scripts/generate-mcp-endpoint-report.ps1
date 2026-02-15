$ErrorActionPreference = "Continue"

$root = (Get-Location).Path
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$reportPath = Join-Path $root ("docs/MCP_ENDPOINT_TEST_REPORT_" + $timestamp + ".md")
$mcpOut = Join-Path $root "mcp-server/mcp-test.out.log"
$mcpErr = Join-Path $root "mcp-server/mcp-test.err.log"
$beOut = Join-Path $root "backend/backend-test.out.log"
$beErr = Join-Path $root "backend/backend-test.err.log"

@($mcpOut, $mcpErr, $beOut, $beErr) | ForEach-Object {
  if (Test-Path $_) { Remove-Item $_ -Force }
}

$mcpCmd = '/d /c "chcp 65001>nul && set PYTHONIOENCODING=utf-8 && python server.py"'
$mcpProc = Start-Process -FilePath "cmd.exe" -ArgumentList $mcpCmd -WorkingDirectory (Join-Path $root "mcp-server") -PassThru -RedirectStandardOutput $mcpOut -RedirectStandardError $mcpErr
$beProc = Start-Process -FilePath "node" -ArgumentList "src/server.js" -WorkingDirectory (Join-Path $root "backend") -PassThru -RedirectStandardOutput $beOut -RedirectStandardError $beErr

function Wait-Ready($url, $maxSeconds = 70) {
  $start = Get-Date
  while (((Get-Date) - $start).TotalSeconds -lt $maxSeconds) {
    try {
      $resp = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 3
      if ($resp.StatusCode -ge 200 -and $resp.StatusCode -lt 500) { return $true }
    } catch {}
    Start-Sleep -Seconds 1
  }
  return $false
}

$backendReady = Wait-Ready "http://localhost:5000/api/mcp/health" 70

$script:results = @()
function Add-Result($name, $method, $endpoint, $status, $ok, $notes, $sample) {
  $script:results += [PSCustomObject]@{
    Name = $name
    Method = $method
    Endpoint = $endpoint
    HttpStatus = $status
    Result = $(if ($ok) { "PASS" } else { "FAIL" })
    Notes = $notes
    Sample = $sample
  }
}

function To-CompactJson($obj) {
  try {
    return ($obj | ConvertTo-Json -Depth 10 -Compress)
  } catch {
    return [string]$obj
  }
}

function Test-Endpoint($name, $method, $url, $body = $null) {
  try {
    if ($method -eq "GET") {
      $resp = Invoke-RestMethod -Method Get -Uri $url -TimeoutSec 45
      Add-Result $name $method ($url -replace "http://localhost:5000", "") 200 $true "OK" (To-CompactJson $resp)
      return $resp
    } else {
      $json = if ($null -ne $body) { $body | ConvertTo-Json -Depth 10 } else { "{}" }
      $wr = Invoke-WebRequest -Method Post -Uri $url -ContentType "application/json" -Body $json -TimeoutSec 90 -UseBasicParsing
      $status = $wr.StatusCode
      $respObj = $null
      try { $respObj = $wr.Content | ConvertFrom-Json } catch { $respObj = $wr.Content }
      Add-Result $name $method ($url -replace "http://localhost:5000", "") $status ($status -ge 200 -and $status -lt 300) "OK" (To-CompactJson $respObj)
      return $respObj
    }
  } catch {
    $status = "ERR"
    if ($_.Exception.Response -and $_.Exception.Response.StatusCode) {
      $status = [int]$_.Exception.Response.StatusCode
    }
    $raw = $_.Exception.Message
    try {
      if ($_.ErrorDetails.Message) { $raw = $_.ErrorDetails.Message }
    } catch {}
    Add-Result $name $method ($url -replace "http://localhost:5000", "") $status $false "Request failed" $raw
    return $null
  }
}

try {
  if (-not $backendReady) {
    Add-Result "Backend readiness" "GET" "/api/mcp/health" "ERR" $false "Backend not ready in time" ""
  } else {
    $base = "http://localhost:5000/api/mcp"

    $health = Test-Endpoint "Health" "GET" "$base/health"
    $search = Test-Endpoint "Search" "POST" "$base/search" @{ query = "seo" }

    $fetchBody = @{ id = "home" }
    try {
      if ($search.results -and $search.results.Count -gt 0 -and $search.results[0].id) {
        $fetchBody = @{ id = $search.results[0].id }
      }
    } catch {}
    $fetch = Test-Endpoint "Fetch" "POST" "$base/fetch" $fetchBody

    $chat = Test-Endpoint "Chat" "POST" "$base/chat" @{ message = "hello"; session_id = "" }
    $lead = Test-Endpoint "Lead" "POST" "$base/lead" @{ name = "Endpoint Test"; email = "endpoint.test@example.com"; message = "Need website and seo quote" }
    $webSearch = Test-Endpoint "Web Search" "POST" "$base/web-search" @{ query = "best web development agency"; maxResults = 3 }
    $quote = Test-Endpoint "Quote" "POST" "$base/quote" @{ services = "website,seo"; requirements = "test project" }
    $seo = Test-Endpoint "SEO Audit" "POST" "$base/seo-audit" @{ url = "https://codesunny.in" }
    $cloud = Test-Endpoint "Cloud Calculator" "POST" "$base/cloud-calculator" @{ traffic = "10000 visitors"; storage = "50GB"; region = "asia" }
    $meeting = Test-Endpoint "Schedule Meeting" "POST" "$base/schedule-meeting" @{ name = "Endpoint Test"; email = "endpoint.test@example.com"; preferred_datetime = (Get-Date).AddDays(2).ToString("o"); timezone = "Asia/Kolkata"; notes = "Automated endpoint test" }
    $proposal = Test-Endpoint "Proposal PDF" "POST" "$base/proposal" @{ client_name = "Endpoint Test"; client_email = "endpoint.test@example.com"; services = "Website Development,SEO"; total_amount = "75000"; timeline = "6 weeks"; send_email = $false }
    $leadStage = Test-Endpoint "Lead Stage" "POST" "$base/lead-stage" @{ lead_email = "endpoint.test@example.com"; new_stage = "qualified"; notes = "Automated endpoint stage update" }
    $pipeline = Test-Endpoint "Pipeline Stats" "GET" "$base/pipeline-stats"
    $dash = Test-Endpoint "Dashboard Summary" "POST" "$base/dashboard-summary" @{ client_email = "endpoint.test@example.com" }
    $healthCheck = Test-Endpoint "Health Check" "POST" "$base/health-check" @{ domain = "codesunny.in" }
    $project = Test-Endpoint "Project Status" "POST" "$base/project-status" @{ client_name = "Endpoint Test"; project_id = "" }
    $img = Test-Endpoint "Generate Image" "POST" "$base/generate-image" @{ prompt = "modern website hero banner for software company"; style = "realistic"; size = "1024x1024" }
    $unsub = Test-Endpoint "Unsubscribe" "GET" "$base/unsubscribe?email=endpoint.test@example.com"
  }
} finally {
  if ($mcpProc -and -not $mcpProc.HasExited) { Stop-Process -Id $mcpProc.Id -Force }
  if ($beProc -and -not $beProc.HasExited) { Stop-Process -Id $beProc.Id -Force }
}

$passCount = ($script:results | Where-Object { $_.Result -eq "PASS" }).Count
$failCount = ($script:results | Where-Object { $_.Result -eq "FAIL" }).Count

$lines = @()
$lines += "# MCP Endpoint-wise Test Report"
$lines += ""
$lines += "- Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss zzz')"
$lines += "- Backend base URL: http://localhost:5000/api/mcp"
$lines += "- MCP base URL: http://localhost:8001/mcp"
$lines += "- Total tests: $($script:results.Count)"
$lines += "- Passed: $passCount"
$lines += "- Failed: $failCount"
$lines += ""
$lines += "## Summary Table"
$lines += ""
$lines += "| Endpoint | Method | HTTP | Result | Notes |"
$lines += "|---|---|---:|---|---|"
foreach ($r in $script:results) {
  $notes = ($r.Notes -replace '\|', '/')
  $lines += "| $($r.Endpoint) | $($r.Method) | $($r.HttpStatus) | $($r.Result) | $notes |"
}

$lines += ""
$lines += "## Sample Responses"
$lines += ""
foreach ($r in $script:results) {
  $lines += "### $($r.Name) - $($r.Endpoint)"
  $lines += "- Method: $($r.Method)"
  $lines += "- HTTP: $($r.HttpStatus)"
  $lines += "- Result: $($r.Result)"
  $sample = [string]$r.Sample
  if ($sample.Length -gt 1200) { $sample = $sample.Substring(0, 1200) + "... (truncated)" }
  $lines += '```json'
  $lines += $sample
  $lines += '```'
  $lines += ""
}

$lines += "## Process Logs (tail)"
$lines += ""
$lines += "### mcp-server stderr"
$lines += '```text'
if (Test-Path $mcpErr) { $lines += (Get-Content $mcpErr -Tail 50) }
$lines += '```'
$lines += ""
$lines += "### backend stderr"
$lines += '```text'
if (Test-Path $beErr) { $lines += (Get-Content $beErr -Tail 50) }
$lines += '```'

Set-Content -Path $reportPath -Value $lines -Encoding UTF8

Write-Output "REPORT_PATH=$reportPath"
Write-Output "PASS=$passCount FAIL=$failCount TOTAL=$($script:results.Count)"
