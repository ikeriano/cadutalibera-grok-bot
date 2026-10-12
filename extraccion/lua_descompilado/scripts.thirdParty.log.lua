local log = {}
local lfs = require("lfs")
log.fileNamePrefix = "log"
log.directory = system.DocumentsDirectory
log.numberOfRollingFiles = 6
log.debugCalls = true
log.logInfoInFiles = true
log.logInfoInConsole = true
log.debugCallDepth = 4
log.maxFileSizeInBytes = 102400
log.tableName = "log_params"
log.alertErrors = true
log.alertTitle = "Oops, an error occurred"
log.alertText = [[
Please report this error to administrator on email:

]]
log.alertButtonReport = "Report on email"
log.alertButtonDismiss = "Dismiss"
log.alertEmail = ""
log.emailSubjectError = "Error report"
log.emailSubjectLog = "Log report"
log.emailPreText = [[
Hi

I want to report an error in application. ]] .. "Logs files are attached. Here is my device info: \n"
log.emailPostText = [[


 Thank you.]]
log.separator = ", "
log.currentFileIndex = nil
log.db = nil

local function logInFile(message, level, callerInfo, stackTrace)
  if log.currentFileIndex == nil then
    if log.db == nil then
      print("ADVANCED LOGGING MODULE - internal error - no referece to database set")
      return
    end
    local q1 = "CREATE TABLE IF NOT EXISTS " .. log.tableName .. " (id INTEGER PRIMARY KEY autoincrement, name, value);"
    log.db:exec(q1)
    local value
    for row in log.db:nrows("SELECT * FROM " .. log.tableName .. " WHERE name = 'lastFileIndex'") do
      value = row.value
    end
    if value == nil then
      local q2 = "INSERT INTO " .. log.tableName .. " VALUES (NULL, 'lastFileIndex', '1');"
      log.db:exec(q2)
      log.currentFileIndex = 1
    else
      log.currentFileIndex = value
    end
  end
  local fileName = log.fileNamePrefix .. "_" .. log.currentFileIndex .. ".txt"
  local path = system.pathForFile(fileName, log.directory)
  local size = lfs.attributes(path, "size")
  if size ~= nil and size > log.maxFileSizeInBytes then
    log.currentFileIndex = log.currentFileIndex + 1
    if log.currentFileIndex > log.numberOfRollingFiles then
      log.currentFileIndex = 1
    end
    local q3 = "UPDATE " .. log.tableName .. " SET value = '" .. log.currentFileIndex .. "' WHERE name = 'lastFileIndex';"
    log.db:exec(q3)
    fileName = log.fileNamePrefix .. "_" .. log.currentFileIndex .. ".txt"
    path = system.pathForFile(fileName, log.directory)
    os.remove(path)
  end
  local now = os.date("%d.%m.%Y. %H:%M:%S")
  local timestamp = system.getTimer()
  local file = io.open(path, "a")
  local text = now .. " - " .. timestamp .. " - " .. level .. " - " .. message
  if callerInfo ~= nil and callerInfo ~= "" then
    text = text .. [[

	]] .. callerInfo
  end
  if stackTrace ~= nil and stackTrace ~= "" then
    text = text .. stackTrace
  end
  file:write(text .. "\n")
  io.close(file)
  file = nil
end

local function fileExists(fileName, base)
  local base = base or system.DocumentsDirectory
  local filePath = system.pathForFile(fileName, base)
  local exists = false
  if filePath then
    local fileHandle = io.open(filePath, "r")
    if fileHandle then
      exists = true
      io.close(fileHandle)
    end
  end
  return exists
end

local function sendEmail(isError, group)
  local deviceInfo = "Platform: " .. system.getInfo("platformName") .. " " .. system.getInfo("platformVersion") .. ", Device: " .. system.getInfo("name") .. " - " .. system.getInfo("model") .. ", Arhitecure: " .. system.getInfo("architectureInfo")
  local prevLogIndex = log.currentFileIndex - 1
  if prevLogIndex < 1 then
    prevLogIndex = log.numberOfRollingFiles
  end
  local fileName1 = log.fileNamePrefix .. "_" .. log.currentFileIndex .. ".txt"
  local fileName2 = log.fileNamePrefix .. "_" .. prevLogIndex .. ".txt"
  local attachments
  if fileExists(fileName2, log.directory) then
    attachments = {
      {
        baseDir = log.directory,
        filename = fileName1,
        type = "text/plain"
      },
      {
        baseDir = log.directory,
        filename = fileName2,
        type = "text/plain"
      }
    }
  else
    attachments = {
      {
        baseDir = log.directory,
        filename = fileName1,
        type = "text/plain"
      }
    }
  end
  local messageBody = ""
  local messageSubject = ""
  if isError == true then
    messageBody = log.emailPreText .. deviceInfo .. log.emailPostText
    messageSubject = log.emailSubjectError .. " - " .. applicationInfo.applicationName
  else
    messageBody = deviceInfo
    messageSubject = log.emailSubjectLog .. " - " .. applicationInfo.applicationName
  end
  local options = {
    to = {
      log.alertEmail
    },
    subject = messageSubject,
    isBodyHtml = false,
    body = messageBody,
    attachment = attachments
  }
  native.showPopup("mail", options)
end

local function onAlertComplete(event)
  if "clicked" == event.action then
    local i = event.index
    if 1 == i then
      sendEmail(true, nil)
    end
  end
end

local function unhandledErrorListener(event)
  logInFile(event.errorMessage, "ERROR", nil, event.stackTrace)
  if log.alertErrors == true then
    native.showAlert(log.alertTitle, log.alertText .. event.errorMessage, {
      log.alertButtonReport,
      log.alertButtonDismiss
    }, onAlertComplete)
  end
  return true
end

local function strIndexOf(s1, s2)
  return string.find(s1, s2)
end

local function strLastIndexOf(haystack, needle)
  local found = haystack:reverse():find(needle:reverse(), nil, true)
  if found then
    return haystack:len() - needle:len() - found + 2
  else
    return found
  end
end

local function strSubstring(s, from, to)
  return string.sub(s, from, to)
end

local function strLength(s)
  return string.len(s)
end

local function doLog(message)
  local callerInfo = ""
  if log.debugCalls == true then
    for i = 2, log.debugCallDepth + 1 do
      local debugInfo = debug.getinfo(i)
      if debugInfo == nil or debugInfo.name == nil and debugInfo.source == nil then
        break
      else
        if debugInfo.name == nil then
          local name = debugInfo.source
          local index = strLastIndexOf(name, "\\")
          if index == nil or index == -1 then
            break
          else
            name = strSubstring(name, index + 1, strLength(name))
          end
          debugInfo.name = name
        end
        if callerInfo ~= "" then
          callerInfo = callerInfo .. " <- "
        end
        callerInfo = callerInfo .. debugInfo.name
        if debugInfo.currentline ~= nil then
          callerInfo = callerInfo .. " (line " .. debugInfo.currentline .. ")"
        end
      end
    end
  end
  if log.logInfoInFiles == true then
    logInFile(message, "INFO", callerInfo, nil)
  end
  if log.logInfoInConsole == true then
    print(message)
  end
end

function log:set(db, alertEmail, alertErrors, fileNamePrefix, directory, numberOfRollingFiles, debugCalls, debugCallDepth, maxFileSizeInBytes)
  log.db = db or nil
  log.alertEmail = alertEmail or ""
  log.alertErrors = alertErrors or true
  log.fileNamePrefix = fileNamePrefix or "log"
  log.directory = directory or system.DocumentsDirectory
  log.numberOfRollingFiles = numberOfRollingFiles or 4
  log.debugCalls = debugCalls or true
  log.debugCallDepth = debugCallDepth or 3
  log.maxFileSizeInBytes = maxFileSizeInBytes or 102400
end

function log:log(...)
  local message = ""
  local numOfArguments = arg.n
  for i = 1, numOfArguments do
    if log.separator == "\n" then
      message = tostring(arg[i])
      doLog(message)
    else
      if i == 1 then
        message = tostring(arg[i])
      else
        message = message .. log.separator .. tostring(arg[i])
      end
      if i == numOfArguments then
        doLog(message)
      end
    end
  end
end

function log:sendEmail(group)
  sendEmail(false, group)
end

Runtime:addEventListener("unhandledError", unhandledErrorListener)
return log
