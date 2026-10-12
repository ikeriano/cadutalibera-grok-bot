local composer = require("composer")
local scene = composer.newScene()
local widget = require("widget")
local log = require("scripts.thirdParty.log")
local screenSizeX = display.contentWidth
local screenSizeY = display.contentHeight
local centerX = display.contentWidth * 0.5
local centerY = display.contentHeight * 0.5
local screen_sheetData = require(assetsManager.sprites.SCREEN_1_SPRITE_HD.spriteMapper)
local screen_sheet = graphics.newImageSheet(assetsManager.sprites.SCREEN_1_SPRITE_HD.sprite, screen_sheetData.sheet)
local screen_sequenceData = {
  {
    name = "seq1",
    sheet = screen_sheet,
    start = 1,
    count = assetsManager.sprites.SCREEN_1_SPRITE_HD.frames,
    loopCount = 0
  }
}
local playBtn, instructionsBtn, resetGameBtn, rateUs, profileInfo, achievementInfo, statisticsInfo, onOffSwitch, touchEvent
local androidStoreLink = applicationInfo.androidStoreLink
local iosStoreLink = applicationInfo.iosStoreLink
local storeReviewURL

local function setAlphaOnPowerUpEvents(event)
  local tranTime = 60
  transition.scaleTo(event.target, {
    xScale = 0.95,
    yScale = 0.95,
    time = tranTime
  })
  transition.scaleTo(event.target, {
    xScale = 1,
    yScale = 1,
    time = tranTime,
    delay = tranTime + 20
  })
end

local function endThisGame(event)
  if event.action == "clicked" then
    local i = event.index
    if i == 1 then
      gameUtils.endGame()
      saveUtil.deleteGame()
      composer.removeScene("scripts.scenes.HeadToHead")
      composer.removeScene("scripts.scenes.DropScene")
      composer.removeScene("scripts.scenes.EndScene")
      composer.removeScene("scripts.scenes.Indoor")
      resetGameBtn.alpha = 0
    end
  end
end

local function moveScreenByEvent()
  if touchEvent.target.id == "play" then
    local options = {
      effect = "crossFade",
      time = 500,
      params = {isAddDiamonds = "false"}
    }
    if recordedGameUtil.isRecordedGame() and saveUtil.isSaveGame() ~= "true" then
      composer.gotoScene("scripts.scenes.GameSelect", options)
    else
      gameAnalytics.logEvent("GameType", {
        gameType = "Single Player"
      })
      composer.gotoScene("scripts.scenes.Indoor", options)
    end
  elseif touchEvent.target.id == "rateUs" then
    if platformName == "Android" then
      storeReviewURL = androidStoreLink
    else
      storeReviewURL = iosStoreLink
    end
    system.openURL(storeReviewURL)
  elseif touchEvent.target.id == "profileInfo" then
    gameAnalytics.logEvent("profileInfo", {
      useInfo = "profileInfo"
    })
    local options = {
      effect = "crossFade",
      time = 500,
      params = {selected = 2, sceneName = "menu"}
    }
    composer.gotoScene("scripts.scenes.UserSceneController", options)
  elseif touchEvent.target.id == "achievementInfo" then
    gameAnalytics.logEvent("profileInfo", {
      useInfo = "achievementInfo"
    })
    local options = {
      effect = "crossFade",
      time = 500,
      params = {selected = 1, sceneName = "menu"}
    }
    composer.gotoScene("scripts.scenes.UserSceneController", options)
  elseif touchEvent.target.id == "statisticsInfo" then
    gameAnalytics.logEvent("profileInfo", {
      useInfo = "statisticsInfo"
    })
    local options = {
      effect = "crossFade",
      time = 500,
      params = {selected = 3, sceneName = "menu"}
    }
    composer.gotoScene("scripts.scenes.UserSceneController", options)
  elseif touchEvent.target.id == "resetGame" then
    native.showAlert(messagesUtil.Messges.END_GAME, messagesUtil.Messges.END_GAME_MESSAGE, {
      messagesUtil.Messges.YES,
      messagesUtil.Messges.NO
    }, endThisGame)
  elseif touchEvent.target.id == "instructions" then
    local options = {effect = "crossFade", time = 500}
    composer.gotoScene("scripts.scenes.InfoScene", options)
  elseif touchEvent.target.id == "terms" then
    local options = {
      effect = "crossFade",
      time = 500,
      params = {
        lastScene = composer.getSceneName("current")
      }
    }
    composer.gotoScene("scripts.scenes.Terms", options)
  else
    native.showAlert("Coming Soon", "Sorry , this page will be available soon!", {"OK"})
  end
end

local function onBtnRelease(event)
  if event.phase == "began" then
    log:log("onBtnRelease - " .. event.target.id)
    setAlphaOnPowerUpEvents(event)
    touchEvent = event
    timer.performWithDelay(300, moveScreenByEvent, 1)
  end
end

function scene:create(event)
  local group = self.view
  log:log("Start Menu Scene")
  userName = userName
  composer.removeScene("scripts.scenes.HeadToHead")
  composer.removeScene("scripts.scenes.Indoor")
  composer.removeScene("scripts.scenes.DropScene")
  composer.removeScene("scripts.scenes.HeadToHead")
  composer.removeScene("scripts.scenes.Commercial")
  composer.removeScene("scripts.scenes.EndScene")
  local background = gameUtils.createBgImage(assetsManager.bg.SCREEN_1_BACKGROUND_HD)
  group:insert(background)
  playBtn = display.newImage(screen_sheet, screen_sheetData:getFrameIndex("button1_play"), centerX, centerY)
  playBtn.id = "play"
  resetGameBtn = display.newImage(screen_sheet, screen_sheetData:getFrameIndex("button_reset-game"), centerX, centerY)
  resetGameBtn.id = "resetGame"
  instructionsBtn = display.newImage(screen_sheet, screen_sheetData:getFrameIndex("button_instructions"), centerX, centerY)
  instructionsBtn.id = "instructions"
  rateUs = display.newImage(screen_sheet, screen_sheetData:getFrameIndex("button_rate"), centerX, centerY)
  rateUs.id = "rateUs"
  profileInfo = display.newImage(screen_sheet, screen_sheetData:getFrameIndex("button_profile"), centerX, centerY)
  profileInfo.id = "profileInfo"
  achievementInfo = display.newImage(screen_sheet, screen_sheetData:getFrameIndex("button_achievment"), centerX, centerY)
  achievementInfo.id = "achievementInfo"
  statisticsInfo = display.newImage(screen_sheet, screen_sheetData:getFrameIndex("button_statistics"), centerX, centerY)
  statisticsInfo.id = "statisticsInfo"
  onOffSwitch = widget.newSwitch({
    left = 350,
    top = 775,
    style = "checkbox",
    id = "Checkbox",
    width = 110,
    height = 71,
    onPress = SoundUtil.setSoundStatus,
    sheet = screen_sheet,
    frameOff = screen_sheetData:getFrameIndex("button_sound_off"),
    frameOn = screen_sheetData:getFrameIndex("button_sound_on")
  })
  onOffSwitch:setState({
    isOn = SoundUtil.getSoundStatus()
  })
  group:insert(resetGameBtn)
  group:insert(playBtn)
  group:insert(instructionsBtn)
  group:insert(onOffSwitch)
  group:insert(rateUs)
  group:insert(profileInfo)
  group:insert(achievementInfo)
  group:insert(statisticsInfo)
end

local function willEnterScene()
  if saveUtil.isSaveGame() == "true" then
    resetGameBtn.alpha = 1
  else
    resetGameBtn.alpha = 0
  end
end

function scene:show(event)
  local group = self.view
  local phase = event.phase
  if phase == "will" then
    willEnterScene()
  elseif phase == "did" then
    composer.removeScene("scripts.scenes.Terms")
    adsUtil.loadAd()
    playBtn:addEventListener("touch", onBtnRelease)
    instructionsBtn:addEventListener("touch", onBtnRelease)
    rateUs:addEventListener("touch", onBtnRelease)
    profileInfo:addEventListener("touch", onBtnRelease)
    achievementInfo:addEventListener("touch", onBtnRelease)
    statisticsInfo:addEventListener("touch", onBtnRelease)
    resetGameBtn:addEventListener("touch", onBtnRelease)
  end
end

function scene:hide(event)
  local group = self.view
  local phase = event.phase
  if phase == "did" then
    playBtn:removeEventListener("touch", onBtnRelease)
    instructionsBtn:removeEventListener("touch", onBtnRelease)
    rateUs:removeEventListener("touch", onBtnRelease)
    profileInfo:removeEventListener("touch", onBtnRelease)
    achievementInfo:removeEventListener("touch", onBtnRelease)
    statisticsInfo:removeEventListener("touch", onBtnRelease)
    resetGameBtn:removeEventListener("touch", onBtnRelease)
  end
end

function scene:destroy(event)
  local group = self.view
end

scene:addEventListener("create", scene)
scene:addEventListener("show", scene)
scene:addEventListener("hide", scene)
scene:addEventListener("destroy", scene)
return scene
