display.setStatusBar(display.HiddenStatusBar)
local composer = require("composer")
local centerX = display.contentWidth * 0.5
local centerY = display.contentHeight * 0.5
local lastSyncUser = 0
local loadingSprint, loadingMessage
applicationInfo = {
  productionName = "italy",
  applicationName = "Fly Milioni - ITA",
  androidStoreLink = "https://play.google.com/store/apps/details?id=it.mediaset.cadutalibera.android",
  iosStoreLink = "https://itunes.apple.com/app/caduta-libera/id1080581506",
  applicationVersion = "1.0.2",
  appSupportEmail = "sangham.apps@gmail.com",
  facebookAppId = "749888228477490",
  gameAnalyticsAndroid = "KK3H26KKWRVPY2W9T5JJ",
  gameAnalyticsIos = "75KXDQKVPZYN9W38TN2Q",
  androidInterstitialAppId = "ca-app-pub-7786359921563941/4470062710",
  iosInterstitialAppId = "ca-app-pub-7786359921563941/7423529119",
  adsTestMode = false,
  staticWebSourceAddres = "http://fly-to-million.netlify.com/",
  termsWebSourceAddres = "http://www.sangham-apps.com/#!itl-rules/u0rcd",
  remoteHost = "https://whosstillstanding.com:443",
  serviceContextRoot = "/wss/api/"
}
local sqlite3 = require("sqlite3")
local loggerDb = {}
local background
persistenceUtil = require("scripts.utils.PersistenceUtil")
log = require("scripts.thirdParty.log")
GGData = require("scripts.thirdParty.GGData")
inspect = require("scripts.thirdParty.inspect")
gameUtils = require("scripts.utils.GameUtils")
settingsUtil = require("scripts.utils.Settings")
gameAnalytics = require("scripts.utils.GameAnalyticsUtil")
adsUtil = require("scripts.utils.AdsUtil")
SoundUtil = require("scripts.utils.SoundUtil")
facebookUtils = require("scripts.utils.FacebookUtils")
networkUtil = require("scripts.utils.NetworkUtil")
questionsUtil = require("scripts.utils.QuestionsUtil")
saveUtil = require("scripts.utils.SaveUtil")
achievementsManager = require("scripts.achievement.achievementsManager")
competitionManager = require("scripts.utils.CompetitionManager")
recordedGameUtil = require("scripts.utils.RecordedGameUtil")
levelManager = require("scripts.utils.levelManager")
assetsManager = require("scripts.utils.AssetsManager")
messagesUtil = require("scripts.utils.MessagesUtil")
imagesAssets = "Assets/Images/"
freePass = {Facebook = "Facebook", Ads = "Ads"}
returnFromScreen = ""
local loading_sheetData = require(assetsManager.sprites.LOADING_SPRITE_HD.spriteMapper)
local loading_sheet = graphics.newImageSheet(assetsManager.sprites.LOADING_SPRITE_HD.sprite, loading_sheetData.sheet)
local loading_sequenceData = {
  {
    name = "loading",
    sheet = loading_sheet,
    start = 2,
    count = 9,
    loopCount = 500,
    time = 1500
  }
}
local pollingTimer
isErrorSound = false
bannerIsUp = true
oppponentId = 0
player = {}
oppponents = {}
showMode = nil
deviceModel = system.getInfo("model")
deviceId = system.getInfo("deviceID")
isSimulator = "simulator" == system.getInfo("environment")
platformName = system.getInfo("platformName")
platformVersion = system.getInfo("platformVersion")
prefs = nil

local function loadPrefs()
  prefs = GGData:new("prefs")
  prefs:set("facebookPic", false)
  isFacebook = prefs:get("isFacebook")
  userName = prefs:get("name")
  if userName == nil then
    userName = messagesUtil.Messges.YOUR_TURN
  end
  prefs:set("name", userName)
  prefs:save()
end

local function initApp()
  log:log("start App for Model -" .. deviceModel .. "  deviceId - " .. deviceId .. "  platformName - " .. platformName .. "  platformVersion - " .. platformVersion)
  saveUtil.init()
  persistenceUtil.init()
  gameAnalytics.init()
  adsUtil.initAds()
  settingsUtil.init()
  SoundUtil.init()
  networkUtil.init()
  achievementsManager.init()
end

local function closeLog()
  if loggerDb ~= nil then
    loggerDb:close()
    loggerDb = nil
  end
end

local function initLog()
  local path = system.pathForFile("logger.db", system.DocumentsDirectory)
  loggerDb = sqlite3.open(path)
  log:set(loggerDb, applicationInfo.appSupportEmail)
  log.debugCalls = false
  log.logInFiles = false
  log.alertErrors = false
  log.logInfoInConsole = false
  log:log("Advanced logging module is now ready")
end

local function goToNextSceneOnApplicationResume()
  local currScene = composer.getSceneName("current")
  log:log("currScene", currScene)
  if currScene == "scripts.scenes.HeadToHead" then
    local options = {
      effect = "crossFade",
      time = 100,
      params = {isAddDiamonds = "false"}
    }
    composer.gotoScene("scripts.scenes.Indoor", options)
  end
end

local function goToNextScene()
  if saveUtil.isSaveGame() == "true" then
    local options = {
      effect = "crossFade",
      time = 100,
      params = {isAddDiamonds = "false"}
    }
    composer.gotoScene("scripts.scenes.Indoor", options)
  else
    composer.gotoScene("scripts.scenes.menu")
  end
end

local function syncUser()
  local osTime = os.time()
  networkUtil.getQuestions(50)
  if lastSyncUser == 0 or 60 < osTime - lastSyncUser then
    lastSyncUser = osTime
    networkUtil.updateUserData()
    networkUtil.getProductionConfiguration()
    networkUtil.listRecordedGames()
    local competition = competitionManager.getCompetition()
    if competition then
      local deltaScore = tonumber(competition.delta_score)
      networkUtil.updateCompetitionScore(deltaScore)
    end
  end
end

local function showAd()
  adsUtil.showAd()
end

local function onSystemEvent(event)
  log:log("########### onSystemEvent -- ", event.type, "############")
  if event.type == "applicationExit" then
    system.setIdleTimer(true)
    native.setKeyboardFocus(nil)
    closeLog()
    persistenceUtil.closeDb()
  elseif event.type == "applicationSuspend" then
    networkUtil.updateUserData()
    system.setIdleTimer(true)
    native.setKeyboardFocus(nil)
    adsUtil.loadAd()
  elseif event.type == "applicationResume" then
    syncUser()
    local currScene = composer.getSceneName("current")
    if currScene == "scripts.scenes.HeadToHead" then
      timer.performWithDelay(500, showAd, 1)
      settingsUtil.setPalyerSettingByKey(settingsUtil.SettingsTable.isUseHelp, "true")
    end
    system.setIdleTimer(false)
    goToNextSceneOnApplicationResume()
  end
end

initLog()
messagesUtil.init()
loadPrefs()
initApp()
Runtime:addEventListener("system", onSystemEvent)
system.setIdleTimer(false)
player = gameUtils.initPlayer()
gameAnalytics.logEvent("ClientType", {
  osType = platformName,
  osVersion = platformVersion,
  deviceModel = deviceModel,
  deviceId = deviceId
})

local function removeDisplay()
  loadingSprint:removeSelf()
  loadingMessage:removeSelf()
  background:removeSelf()
end

local function pollingTimerForSplashScreen()
  log:log("pollingTimerForSplashScreen")
  local sessionSecret = settingsUtil.getGameSettingByKey("SecretToken")
  local tokenType = settingsUtil.getGameSettingByKey("TokenType")
  if sessionSecret ~= nil and sessionSecret ~= "" and tokenType == "PLAYER" then
    networkUtil.getProductionConfiguration()
    networkUtil.updateUserData()
    networkUtil.updateCompetitionScore(0)
    networkUtil.listRecordedGames()
    if settingsUtil.getGameSettingByKey(settingsUtil.SettingsTable.isFirstTime) == "true" then
      networkUtil.getQuestions(200)
      settingsUtil.setGameSettingByKey(settingsUtil.SettingsTable.isFirstTime, "false")
    end
    questionsUtil.alignOppnentQuestionEndOfGame()
    local tranTime = 2000
    transition.to(loadingSprint, {time = tranTime, alpha = 0})
    transition.to(loadingMessage, {time = tranTime, alpha = 0})
    transition.to(background, {time = tranTime, alpha = 0})
    timer.performWithDelay(2300, removeDisplay, 1)
    timer.performWithDelay(2500, goToNextScene, 1)
    if pollingTimer then
      timer.cancel(pollingTimer)
    end
  end
end

background = gameUtils.createBgImage(assetsManager.bg.SCREEN_1_BACKGROUND_HD)
loadingMessage = display.newImage(loading_sheet, loading_sheetData:getFrameIndex("Loading2_background"), centerX, centerY)
loadingSprint = display.newSprite(loading_sheet, loading_sequenceData)
loadingSprint:setFrame(loading_sheetData:getFrameIndex("Loading1_image1"))
loadingSprint.x = centerX
loadingSprint.y = centerY
loadingSprint:setSequence("loading")
loadingSprint:play()
pollingTimer = timer.performWithDelay(1500, pollingTimerForSplashScreen, -1)
