local AdsUtil = {}
ads = require("ads")
local adsTestMode = applicationInfo.adsTestMode
local adsInterstitialType = "interstitial"
local adsProviderName = "admob"
local lastAdTime = 0
local adsInterstitialAppId
local isLoaded = false

local function initAdsPlatform()
  log:log("initPlatform")
  if platformName == "Android" then
    log:log("Android")
    adsInterstitialAppId = applicationInfo.androidInterstitialAppId
  elseif platformName == "iPhone OS" or platformName == "Mac OS X" then
    log:log("iPhone OS")
    adsInterstitialAppId = applicationInfo.iosInterstitialAppId
  else
    log:log("Default")
    adsInterstitialAppId = applicationInfo.androidInterstitialAppId
  end
end

local function adListener(event)
  if event.isError then
    log:log("ads error")
  else
    isLoaded = ads.isLoaded(adsInterstitialType)
    log:log("isLoaded  ", isLoaded)
  end
end

function AdsUtil.initAds()
  if isSimulator then
    log:log("simulator Maode")
  else
    initAdsPlatform()
    log:log("real Maode")
    ads.init(adsProviderName, adsInterstitialAppId, adListener)
  end
end

function AdsUtil.loadAd()
  log:log("loadAd")
  if isSimulator == false and isLoaded == false then
    ads.load(adsInterstitialType, {appId = adsInterstitialAppId, testMode = adsTestMode})
  end
end

function AdsUtil.showAd()
  local isShowAd = settingsUtil.getGameSettingByKey(settingsUtil.SettingsTable.isShowAd)
  if isShowAd == "true" then
    local gamesPlayed = tonumber(settingsUtil.getPalyerSettingByKey(settingsUtil.SettingsTable.GamesPlayed))
    log:log("enter showAd function gamesPlayed", gamesPlayed)
    local osTime = os.time()
    if isLoaded == true and (lastAdTime == 0 or 10 < osTime - lastAdTime) and 1 < gamesPlayed then
      log:log("isLoaded true showAd")
      lastAdTime = osTime
      ads.show(adsInterstitialType, {
        x = 0,
        y = 0,
        testMode = adsTestMode,
        appId = adsInterstitialAppId
      })
      isLoaded = false
    end
  end
end

return AdsUtil
