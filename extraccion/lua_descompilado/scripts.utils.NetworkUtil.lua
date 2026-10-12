local NetworkUtil = {}
local json = require("json")
local playerInfoProcessor = require("scripts.utils.PlayerInfoProcessor")
local remoteHost = applicationInfo.remoteHost
local serviceContextRoot = applicationInfo.serviceContextRoot
local baseURL = remoteHost .. serviceContextRoot
local tokenType, secretToken, facebookAccessToken
local questionQuantityToPull = 50
local gotUnauthorizedResponse
local unauthorizedFlag = false
local unauthorizedHeader = "X-WSS-RESPONSE"
local xWssHeaderValue = {
  INACTIVE_SESSION = "INACTIVE-SESSION"
}
local lastUpdateUserData = 0
local lastUpdateScore = 0
local minInterval = 15
local NetworkUtilEnum = {
  USER_TYPE = "UserType",
  SECRET_TOKEN = "SecretToken",
  TOKEN_TYPE = "TokenType",
  IS_FACEBOOK_ACTIVE = "IsFacebookActive"
}
local TokenTypesEnum = {CLIENT = "CLIENT", PLAYER = "PLAYER"}

local function updateCompetitionScoreResponse(event)
  if event.status == 401 then
    gotUnauthorizedResponse(event)
  elseif event.status == 200 then
    log:log("updateCompetitionScoreResponse", event.response)
    local decoded, pos, msg = json.decode(event.response)
    if not decoded then
      log:log("Decode failed at ", pos, ": ", msg)
    else
      competitionManager.processCompetitionResponse(decoded)
    end
  end
  gameAnalytics.logEvent("updateCompetitionScoreResponse_response", {
    status = tostring(event.status)
  })
end

function NetworkUtil.updateCompetitionScore(deltaScore)
  if settingsUtil.getGameSettingByKey(settingsUtil.SettingsTable.isCompetitionRequestsEnabled) == "true" then
    local osTime = os.time()
    log:log("updateUserData", "osTime-", osTime, "lastUpdateScore", lastUpdateScore, "osTime - lastUpdateScore = ", osTime - lastUpdateScore)
    if lastUpdateScore == 0 or osTime - lastUpdateScore > minInterval then
      lastUpdateScore = osTime
      local headers = {}
      local params = {}
      headers["Content-Type"] = "application/json"
      headers.Authorization = secretToken
      params.headers = headers
      local url = baseURL .. applicationInfo.productionName .. "/competitions/update_score?change=" .. deltaScore
      network.request(url, "GET", updateCompetitionScoreResponse, params)
      gameAnalytics.logEvent("updateCompetitionScore", {deltaScore = deltaScore})
    else
      log:log("skip updateCompetitionScore()")
    end
  else
    log:log("NetworkUtil.updateCompetitionScore flaged as false")
  end
end

local function updateUserDataResponse(event)
  gameAnalytics.logEvent("updateUserData_response", {
    status = tostring(event.status)
  })
  if event.status == 401 then
    gotUnauthorizedResponse(event)
  elseif event.status == 200 then
    playerInfoProcessor.processUserData(event.response)
  end
end

function NetworkUtil.updateUserData()
  local osTime = os.time()
  log:log("updateUserData", "osTime-", osTime, "lastUpdateUserData", lastUpdateUserData, "osTime - lastUpdateUserData = ", osTime - lastUpdateUserData)
  if lastUpdateUserData == 0 or osTime - lastUpdateUserData > minInterval then
    lastUpdateUserData = osTime
    local headers = {}
    local params = {}
    headers["Content-Type"] = "application/json"
    headers.Authorization = secretToken
    params.headers = headers
    params.body = playerInfoProcessor.buildUpdateBody()
    local url = baseURL .. applicationInfo.productionName .. "/achievements"
    network.request(url, "POST", updateUserDataResponse, params)
  else
    log:log("skip updateUserData()")
  end
end

local function getProductionConfigurationResponse(event)
  log:log("getProductionConfiguration", event.status)
  if event.status == 401 then
    gotUnauthorizedResponse(event)
    return
  end
  if event.status ~= 200 then
    log:log("Network error!")
  elseif event.status == 200 then
    playerInfoProcessor.setProductionConfiguration(event.response)
  end
end

function NetworkUtil.getProductionConfiguration()
  log:log("Start getProductionConfiguration request")
  local headers = {}
  headers["Content-Type"] = "application/json"
  headers.Authorization = secretToken
  local params = {}
  params.headers = headers
  local url = baseURL .. applicationInfo.productionName
  network.request(url, "GET", getProductionConfigurationResponse, params)
end

local function getQuestionsResponse(event)
  log:log("getQuestionsResponse", event.status)
  if event.status == 401 then
    gotUnauthorizedResponse(event)
    return
  end
  if event.status ~= 200 then
    log:log("Network error!")
  elseif event.status == 200 then
    local decoded, pos, msg = json.decode(event.response)
    if not decoded then
      log:log("Decode failed at ", pos, ": ", msg)
    else
      persistenceUtil.insertQuestions(decoded.questions)
    end
  end
end

function NetworkUtil.getQuestions(numberOfQuestions)
  log:log("Start getQuestions request")
  local minQuestionsInDB = 250
  if minQuestionsInDB < persistenceUtil.countQuestions() then
    log:log("More the ", minQuestionsInDB, " question in DB , reqeust is skiped")
  else
    local headers = {}
    local body = {}
    headers["Content-Type"] = "application/json"
    headers.Authorization = secretToken
    body.quantity = numberOfQuestions or questionQuantityToPull
    local params = {}
    params.headers = headers
    params.body = json.encode(body)
    local url = baseURL .. applicationInfo.productionName .. "/questions/allocations"
    network.request(url, "POST", getQuestionsResponse, params)
  end
end

local function getRecordedGameResponse(event)
  log:log("getRecordedGameResponse", event.status)
  if event.status == 401 then
    gotUnauthorizedResponse(event)
    return
  elseif event.status ~= 200 then
    log:log("Network error!")
  elseif event.status == 200 then
    local decodedGame, pos, msg = json.decode(event.response)
    if not settingsUtil.getGameSettingByKey(settingsUtil.SettingsTable.recordedGameId) then
      log:log("RecordedGame decode failed at ", pos, ": ", msg)
    else
      persistenceUtil.insertRecordedGame(decodedGame)
      settingsUtil.setGameSettingByKey(settingsUtil.SettingsTable.recordedGameId, decodedGame.game_id)
    end
  end
end

function NetworkUtil.getRecordedGameById(gameId)
  if settingsUtil.getGameSettingByKey(settingsUtil.SettingsTable.isRecordedGameRequestsEnabled) == "true" then
    log:log("Start getRecordedGames request")
    local headers = {}
    local body = {}
    local params = {}
    headers["Content-Type"] = "application/json"
    headers.Authorization = secretToken
    params.headers = headers
    params.body = json.encode(body)
    local url = baseURL .. applicationInfo.productionName .. "/recorded_games/" .. gameId
    network.request(url, "GET", getRecordedGameResponse, params)
  else
    log:log("NetworkUtil.getRecordedGameById flaged as false")
  end
end

local function getGameImageResponse(event)
  log:log("getGameImageResponse")
  if event.isError then
    log:log(event.isError)
  elseif event.phase == "ended" and event.status == 200 then
    settingsUtil.setGameSettingByKey(settingsUtil.SettingsTable.recordedGameImageStatus, "true")
  end
end

function NetworkUtil.getGameImage(gameId)
  log:log("Start getGameImage request")
  local params = {}
  local newImageName = gameId .. ".png"
  local url = applicationInfo.staticWebSourceAddres .. applicationInfo.productionName .. "/shows/" .. gameId .. "/show_sprite.png"
  network.download(url, "GET", getGameImageResponse, params, newImageName, system.DocumentsDirectory, 0, 0)
end

local function getListRecordedGameResponse(event)
  log:log("getListRecordedGameResponse", event.status)
  if event.status == 401 then
    gotUnauthorizedResponse(event)
    return
  elseif event.status ~= 200 then
    log:log("Network error!")
  elseif event.status == 200 then
    local decodedGamesList, pos, msg = json.decode(event.response)
    if not decodedGamesList then
      log:log("RecordedGame decode failed at ", pos, ": ", msg)
    else
      log:log("getListRecordedGameResponse", event.response)
      recordedGameUtil.checkList(decodedGamesList)
    end
  end
end

function NetworkUtil.listRecordedGames()
  if settingsUtil.getGameSettingByKey(settingsUtil.SettingsTable.isRecordedGameRequestsEnabled) == "true" then
    log:log("Start getRecordedGames request")
    local headers = {}
    local body = {}
    headers["Content-Type"] = "application/json"
    headers.Authorization = secretToken
    local params = {}
    params.headers = headers
    params.body = json.encode(body)
    local url = baseURL .. applicationInfo.productionName .. "/recorded_games"
    network.request(url, "GET", getListRecordedGameResponse, params)
  else
    log:log("NetworkUtil.listRecordedGames flaged as false")
  end
end

local function loginPlayerResponse(event)
  log:log("loginPlayerResponse Status <" .. event.status .. ">")
  if event.status == 401 then
    gotUnauthorizedResponse(event)
    return
  end
  if event.isError or event.status ~= 200 then
    log:log("Network error!")
  else
    secretToken = event.response
    tokenType = TokenTypesEnum.PLAYER
    settingsUtil.setGameSettingByKey(NetworkUtilEnum.SECRET_TOKEN, secretToken)
    settingsUtil.setGameSettingByKey(NetworkUtilEnum.TOKEN_TYPE, tokenType)
    if facebookAccessToken ~= nil and facebookAccessToken ~= "" then
      settingsUtil.setPalyerSettingByKey(settingsUtil.SettingsTable.IsFacebbokActive, "true")
      lastUpdateUserData = 0
      lastUpdateScore = 0
      NetworkUtil.updateUserData()
      NetworkUtil.updateCompetitionScore(0)
    end
  end
end

local function loginPlayer()
  log:log("loginPlayer facebookAccessToken ", facebookAccessToken)
  local headers = {}
  local body = {}
  headers["Content-Type"] = "application/json"
  headers.Authorization = secretToken
  local params = {}
  params.headers = headers
  if facebookAccessToken == nil or facebookAccessToken == "" then
    params.body = "{\"facebook_access_token\":null}"
  else
    body.facebook_access_token = facebookAccessToken
    params.body = json.encode(body)
  end
  local url = baseURL .. applicationInfo.productionName .. "/gatekeeper/login_player"
  network.request(url, "POST", loginPlayerResponse, params)
end

local function registerClientResponse(event)
  log:log("registerClientResponse  <" .. event.status .. ">")
  if event.status == 401 then
    gotUnauthorizedResponse(event)
    return
  end
  if event.isError or event.status ~= 200 then
    log:log("Network error!")
  else
    secretToken = event.response
    tokenType = TokenTypesEnum.CLIENT
    settingsUtil.setGameSettingByKey(NetworkUtilEnum.SECRET_TOKEN, secretToken)
    settingsUtil.setGameSettingByKey(NetworkUtilEnum.TOKEN_TYPE, tokenType)
    loginPlayer()
  end
end

local function registerClient()
  local headers = {}
  local body = {}
  headers["Content-Type"] = "application/json"
  body.device_id = system.getInfo("deviceID")
  local params = {}
  params.headers = headers
  params.body = json.encode(body)
  local url = baseURL .. applicationInfo.productionName .. "/gatekeeper/register_client"
  network.request(url, "POST", registerClientResponse, params)
end

function NetworkUtil.setFacebookAccessToken(newFacebookAccessToken)
  facebookAccessToken = newFacebookAccessToken
end

function NetworkUtil.loginFacebookPlayer()
  loginPlayer()
end

function NetworkUtil.init()
  secretToken = settingsUtil.getGameSettingByKey(NetworkUtilEnum.SECRET_TOKEN)
  tokenType = settingsUtil.getGameSettingByKey(NetworkUtilEnum.TOKEN_TYPE)
  if secretToken == nil or secretToken == "" then
    registerClient()
  elseif tokenType == TokenTypesEnum.CLIENT then
    loginPlayer()
  end
end

local function facebookRelogin(event)
  facebookUtils.getUserData(false)
end

function gotUnauthorizedResponse(event)
  secretToken = ""
  tokenType = ""
  facebookAccessToken = ""
  settingsUtil.setGameSettingByKey(NetworkUtilEnum.SECRET_TOKEN, secretToken)
  settingsUtil.setGameSettingByKey(NetworkUtilEnum.TOKEN_TYPE, tokenType)
  settingsUtil.setPalyerSettingByKey(settingsUtil.SettingsTable.ServerVersion, "0")
  settingsUtil.setPalyerSettingByKey(settingsUtil.SettingsTable.GamesPlayed, "0")
  settingsUtil.setPalyerSettingByKey(settingsUtil.SettingsTable.RoundsWins, "0")
  settingsUtil.setPalyerSettingByKey(settingsUtil.SettingsTable.averageRound, "5")
  settingsUtil.setPalyerSettingByKey(settingsUtil.SettingsTable.userLevel, "2")
  persistenceUtil.initStatistics()
  log:log("gotUnauthorizedResponse")
  NetworkUtil.init()
  if event.responseHeaders[unauthorizedHeader] and event.responseHeaders[unauthorizedHeader] == xWssHeaderValue.INACTIVE_SESSION and settingsUtil.getPalyerSettingByKey(settingsUtil.SettingsTable.IsFacebbokActive) == "true" then
    lastUpdateUserData = 0
    lastUpdateScore = 0
    if unauthorizedFlag == false then
      unauthorizedFlag = true
      log:log("relogin to facebook alert")
      timer.performWithDelay(1500, facebookRelogin, 1)
    end
  end
end

return NetworkUtil
