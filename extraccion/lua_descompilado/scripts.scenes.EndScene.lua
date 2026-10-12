local composer = require("composer")
local scene = composer.newScene()
local toast = require("plugin.toast")
local screenSizeX = display.contentWidth
local screenSizeY = display.contentHeight
local centerX = display.contentWidth * 0.5
local centerY = display.contentHeight * 0.5
local baseShareLink = applicationInfo.staticWebSourceAddres
local roundNumber = 0
local winningAmount
local screen_sheetData = require(assetsManager.sprites.SCREEN_5_SPRITE_HD.spriteMapper)
local screen_sheet = graphics.newImageSheet(assetsManager.sprites.SCREEN_5_SPRITE_HD.sprite, screen_sheetData.sheet)
local screen_sequenceData = {
  {
    name = "seq1",
    sheet = screen_sheet,
    start = 1,
    count = assetsManager.sprites.SCREEN_5_SPRITE_HD.frames,
    loopCount = 0
  }
}
local imageBg, imagePath, profileFrame, trophy, trophyImage, facebookTrophy, isMyUserTurn, restartBtn, shareBtn

local function moveToScreen(event)
  if event.phase == "began" then
    local options = {}
    if isMyUserTurn then
      options = {
        effect = "crossFade",
        time = 500,
        params = {isAddDiamonds = "true"}
      }
    else
      options = {
        effect = "crossFade",
        time = 500,
        params = {isAddDiamonds = "true"}
      }
    end
    if recordedGameUtil.isRecordedGame() then
      composer.gotoScene("scripts.scenes.GameSelect", options)
    else
      composer.gotoScene("scripts.scenes.Indoor", options)
    end
  end
end

local function shareOnFacebook(event)
  if event.phase == "began" then
    gameAnalytics.logEvent("shareOnFacebook", {roundNumber = roundNumber})
    log:log("shareOnFacebook")
    local attachment = {
      name = messagesUtil.Messges.APPLICATION_NAME,
      link = messagesUtil.Messges.SANGHAM_LINK,
      caption = messagesUtil.Messges.FACBOOK_CAPTION,
      picture = baseShareLink .. applicationInfo.productionName .. "/share/" .. facebookTrophy .. ".jpg"
    }
    facebookUtils.shareImage(attachment)
    toast.show(messagesUtil.Messges.FACEBOOK_SHARE, {duration = "short", gravity = "Center"})
  end
end

local function calcTrophyAndShare()
  if roundNumber < 3 then
    trophy = "1-2_graphic"
    facebookTrophy = "1-2_share"
  elseif roundNumber < 6 then
    trophy = "3-5_graphic"
    facebookTrophy = "3-5_share"
  elseif roundNumber < 8 then
    trophy = "6-7_graphic"
    facebookTrophy = "6-7_share"
  elseif roundNumber <= 10 and isMyUserTurn then
    trophy = "8-9_graphic"
    facebookTrophy = "8-9_share"
  else
    trophy = "10_graphic"
    facebookTrophy = "10_share"
  end
end

function scene:create(event)
  local group = self.view
  local canCompete = settingsUtil.getPalyerSettingByKey(settingsUtil.SettingsTable.canCompete)
  if canCompete == "false" then
    networkUtil.updateCompetitionScore(0)
  end
  achievementsManager.checkAndUpdateAchievementByName(achievementsManager.achievementsNames.play_20_games)
  achievementsManager.checkAndUpdateAchievementByName(achievementsManager.achievementsNames.win_the_game)
  achievementsManager.checkAndUpdateAchievementByName(achievementsManager.achievementsNames.win_the_game_no_help)
  winningAmount = event.params.winningAmount
  roundNumber = event.params.roundNumber
  isMyUserTurn = event.params.isMyUserTurn
  calcTrophyAndShare()
  questionsUtil.alignOppnentQuestionEndOfGame()
  showMode = nil
  saveUtil.deleteGame()
  composer.removeScene("scripts.scenes.DropScene")
  imageBg = gameUtils.createBgImage(assetsManager.bg.SCREEN_5_BACKGROUND_HD)
  trophyImage = display.newImage(screen_sheet, screen_sheetData:getFrameIndex(trophy), centerX, centerY)
  player.endImage = display.newCircle(0, 0, 57)
  player.endImage.fill = {
    type = "image",
    baseDir = player.baseDir,
    filename = player.picName
  }
  if gameUtils.isImageRotationAccordingToPlatform() then
    player.endImage.fill.rotation = 90
  else
    player.endImage.fill.rotation = 0
  end
  player.endImage.x = centerX + 5
  player.endImage.y = centerY - 175
  profileFrame = display.newImage(screen_sheet, screen_sheetData:getFrameIndex("profile_frame"), centerX, centerY)
  group:insert(imageBg)
  group:insert(trophyImage)
  group:insert(player.endImage)
  group:insert(profileFrame)
  local isFacebookShareEnabled = settingsUtil.getGameSettingByKey(settingsUtil.SettingsTable.isFacebookShareEnabled)
  log:log("isFacebookShareEnabled", isFacebookShareEnabled)
  if isFacebookShareEnabled == "true" then
    shareBtn = display.newImage(screen_sheet, screen_sheetData:getFrameIndex("button_share_win"), centerX, centerY)
    group:insert(shareBtn)
  end
  restartBtn = display.newImage(screen_sheet, screen_sheetData:getFrameIndex("button_restart"), centerX, centerY)
  group:insert(restartBtn)
end

function scene:show(event)
  local phase = event.phase
  if phase == "will" then
    restartBtn:addEventListener("touch", moveToScreen)
    if shareBtn then
      shareBtn:addEventListener("touch", shareOnFacebook)
    end
    adsUtil.showAd()
  end
end

function scene:hide(event)
  local group = self.view
  local phase = event.phase
  if phase == "did" then
    restartBtn:removeEventListener("touch", moveToScreen)
    if shareBtn then
      shareBtn:removeEventListener("touch", shareOnFacebook)
    end
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
