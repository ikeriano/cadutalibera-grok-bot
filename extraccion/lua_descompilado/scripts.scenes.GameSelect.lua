local composer = require("composer")
local scene = composer.newScene()
local screenSizeX = display.contentWidth
local screenSizeY = display.contentHeight
local centerX = display.contentWidth * 0.5
local centerY = display.contentHeight * 0.5
local bgImage1, bgImage2, playOrigGame, playShowGame, lable
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

local function moveToScreen(event)
  if "began" == event.phase then
    if event.target.id == "show" then
      showMode = true
      gameAnalytics.logEvent("GameType", {gameType = "Show Mode"})
      settingsUtil.setGameSettingByKey(settingsUtil.SettingsTable.didPlayRecordedGame, "true")
    else
      gameAnalytics.logEvent("GameType", {gameType = "One Player"})
    end
    local options = {
      effect = "crossFade",
      time = 500,
      params = {isAddDiamonds = "true"}
    }
    composer.gotoScene("scripts.scenes.Indoor", options)
  end
end

function scene:create(event)
  local group = self.view
  local background = gameUtils.createBgImage(assetsManager.bg.SCREEN_1_BACKGROUND_HD)
  group:insert(background)
  bgImage1 = display.newImage(screen_sheet, screen_sheetData:getFrameIndex("split_program_bg"), centerX, centerY)
  bgImage1.x = centerX - 130
  bgImage1.y = centerY + 100
  group:insert(bgImage1)
  bgImage2 = display.newImage(screen_sheet, screen_sheetData:getFrameIndex("split_program_bg"), centerX, centerY)
  bgImage2.x = centerX + 130
  bgImage2.y = centerY + 100
  group:insert(bgImage2)
  playOrigGame = display.newImage(screen_sheet, screen_sheetData:getFrameIndex("split_regular_button"), centerX, centerY)
  playOrigGame.id = "orig"
  group:insert(playOrigGame)
  playShowGame = display.newImage(screen_sheet, screen_sheetData:getFrameIndex("split_program_button"), centerX, centerY)
  playShowGame.id = "show"
  group:insert(playShowGame)
  local ppl_sheetData = require("scripts.utils.show_sprite")
  local fileName = settingsUtil.getGameSettingByKey(settingsUtil.SettingsTable.recordedGameId) .. ".png"
  local ppl_sheet = graphics.newImageSheet(fileName, system.DocumentsDirectory, ppl_sheetData.sheet)
  lable = display.newImage(ppl_sheet, ppl_sheetData:getFrameIndex("split_program_label"), centerX, centerY)
  lable:scale(0.5, 0.5)
  group:insert(lable)
end

function scene:show(event)
  local phase = event.phase
  if phase == "will" then
    playOrigGame:addEventListener("touch", moveToScreen)
    playShowGame:addEventListener("touch", moveToScreen)
  end
end

function scene:hide(event)
  local phase = event.phase
  if phase == "did" then
    playOrigGame:removeEventListener("touch", moveToScreen)
    playShowGame:removeEventListener("touch", moveToScreen)
  end
end

function scene:destroy(event)
end

scene:addEventListener("create", scene)
scene:addEventListener("show", scene)
scene:addEventListener("hide", scene)
scene:addEventListener("destroy", scene)
return scene
