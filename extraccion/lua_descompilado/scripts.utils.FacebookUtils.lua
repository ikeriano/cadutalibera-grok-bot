local json = require("json")
local facebook = require("plugin.facebook.v4")
local network = require("network")
local toast = require("plugin.toast")
local fbCommand
local LOGOUT = 1
local LOGIN = 2
local POST_PHOTO = 3
local GET_DATA = 4
local isNewImageStatus = true
local isPublicActoins = false
local FacebookUtils = {}
local share, newImageName
local shareAttachment = {}

local function networkListenerFB(event)
  log:log("networkListenerFB")
  if event.isError then
    log:log(event)
  elseif event.phase == "ended" then
    local oldImageFile = settingsUtil.getPalyerSettingByKey(settingsUtil.SettingsTable.LastImageName)
    if oldImageFile ~= nil and oldImageFile ~= "" then
      os.remove(system.pathForFile(oldImageFile, system.DocumentsDirectory))
    end
    settingsUtil.setPalyerSettingByKey(settingsUtil.SettingsTable.LastImageName, newImageName)
    settingsUtil.setPalyerSettingByKey(settingsUtil.SettingsTable.CustomImage, "true")
    settingsUtil.setPalyerSettingByKey(settingsUtil.SettingsTable.UpdateFacebookImage, "true")
  end
end

local function saveFacebookData(response)
  log:log("saveFacebookData isNewImageStatus", tostring(isNewImageStatus))
  if isNewImageStatus then
    log:log("get new Facebook Image", tostring(isNewImageStatus))
    local params = {}
    local headers = {}
    headers["Accept-Encoding"] = "gzip, deflate"
    params.headers = headers
    newImageName = "customImage_" .. tostring(os.time()) .. ".png"
    network.download("https://graph.facebook.com/" .. response.id .. "/picture?type=large", "GET", networkListenerFB, params, newImageName, system.DocumentsDirectory, 0, 0)
  end
  log:log("name - " .. response.name)
  local name = tostring(response.name)
  if string.len(name) > 9 then
    name = name:sub(1, 7) .. "..."
  end
  settingsUtil.setPalyerSettingByKey(settingsUtil.SettingsTable.PlayerName, name)
  settingsUtil.setPalyerSettingByKey(settingsUtil.SettingsTable.FacebbokId, response.id)
  if response.gender ~= nil and response.gender ~= "" then
    settingsUtil.setPalyerSettingByKey(settingsUtil.SettingsTable.GenderType, response.gender)
  end
end

function listener(event)
  log:log("listener event.type", event.type)
  log:log("listener event.phase", event.phase)
  log:log("event.isError - ", event.isError)
  log:log("response - ", event.response)
  log:log("fbCommand - ", fbCommand)
  if "session" == event.type then
    if event.phase ~= "login" then
      return
    end
    if isPublicActoins == false then
      facebook.login(listener, {
        "publish_actions"
      })
      isPublicActoins = true
    else
      isPublicActoins = false
    end
    if fbCommand == GET_DATA then
      log:log("login Done")
      networkUtil.setFacebookAccessToken(event.token)
      networkUtil.loginFacebookPlayer()
      facebook.request("me")
    elseif fbCommand == POST_PHOTO then
      share()
    elseif fbCommand == "POST_PHOTO_callback" then
      log:log("response POST_PHOTO_callback")
      settingsUtil.setPalyerSettingByKey(settingsUtil.SettingsTable.isFacebookShare, "true")
      toast.show(messagesUtil.Messges.FACEBOOK_SHARE_PASS, {duration = "short", gravity = "Center"})
      fbCommand = ""
    end
  elseif "request" == event.type then
    local response = event.response
    if not event.isError then
      response = json.decode(event.response)
      if fbCommand == GET_DATA then
        saveFacebookData(response)
        fbCommand = ""
      elseif fbCommand == POST_PHOTO then
        share()
      elseif fbCommand == "POST_PHOTO_callback" then
        log:log("response POST_PHOTO_callback- ", response)
        settingsUtil.setPalyerSettingByKey(settingsUtil.SettingsTable.isFacebookShare, "true")
        toast.show(messagesUtil.Messges.FACEBOOK_SHARE_PASS, {duration = "short", gravity = "Center"})
        fbCommand = ""
      end
    elseif fbCommand == "POST_PHOTO_callback" then
      settingsUtil.setPalyerSettingByKey(settingsUtil.SettingsTable.isFacebookShare, "false")
      toast.show(messagesUtil.Messges.FACEBOOK_SHARE_FAIL, {duration = "short", gravity = "Center"})
      fbCommand = ""
    end
  end
end

function share()
  log:log("share start")
  facebook.request("me/feed", "POST", shareAttachment)
  fbCommand = "POST_PHOTO_callback"
end

function FacebookUtils.getUserData(isDownloadNewImage)
  log:log("isDownloadNewImage", tostring(isDownloadNewImage))
  isNewImageStatus = isDownloadNewImage
  if isNewImageStatus == nil then
    isNewImageStatus = true
  end
  log:log("isNewImageStatus", tostring(isNewImageStatus))
  fbCommand = GET_DATA
  facebook.login(listener)
end

function FacebookUtils.updateImage()
  log:log("FacebookUtils.updateImage")
  local facebookId = settingsUtil.getPalyerSettingByKey(settingsUtil.SettingsTable.FacebbokId)
  if facebookId ~= nil and facebookId ~= "" then
    local params = {}
    local headers = {}
    newImageName = "customImage_" .. tostring(os.time()) .. ".png"
    headers["Accept-Encoding"] = "gzip, deflate"
    params.headers = headers
    network.download("https://graph.facebook.com/" .. facebookId .. "/picture?type=large", "GET", networkListenerFB, params, newImageName, system.DocumentsDirectory, 0, 0)
  end
end

function FacebookUtils.shareImage(attachment)
  log:log("shareImage getCurrentAccessToken ", facebook.getCurrentAccessToken())
  fbCommand = POST_PHOTO
  shareAttachment = attachment
  if facebook.getCurrentAccessToken() == nil then
    facebook.login(listener)
  else
    facebook.setFBConnectListener(listener)
    share()
  end
end

return FacebookUtils
