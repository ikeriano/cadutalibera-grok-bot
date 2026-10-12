local composer = require("composer")
local scene = composer.newScene()
local screenSizeX = display.contentWidth
local screenSizeY = display.contentHeight
local centerX = display.contentWidth * 0.5
local centerY = display.contentHeight * 0.5
local manageFrame, infoImage, buttonConfirm, buttonHowToPlay
local instructionsURL = applicationInfo.termsWebSourceAddres
local buttonExit
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
    local options = {effect = "crossFade", time = 500}
    composer.gotoScene("scripts.scenes.menu", options)
  end
end

local function howToPlayLink(event)
  if "began" == event.phase then
    system.openURL(instructionsURL)
  end
end

function scene:create(event)
  local group = self.view
  local background = gameUtils.createBgImage(assetsManager.bg.SCREEN_1_BACKGROUND_HD)
  group:insert(background)
  manageFrame = display.newImage(screen_sheet, screen_sheetData:getFrameIndex("manage_frame"), centerX, centerY)
  manageFrame.alpha = 0.9
  group:insert(manageFrame)
  buttonConfirm = display.newImage(screen_sheet, screen_sheetData:getFrameIndex("info_button_close"), centerX, centerY)
  group:insert(buttonConfirm)
  buttonHowToPlay = display.newImage(screen_sheet, screen_sheetData:getFrameIndex("info_button_howtoplay"), centerX, centerY)
  group:insert(buttonHowToPlay)
  infoImage = display.newImage(screen_sheet, screen_sheetData:getFrameIndex("info_label"), centerX, centerY)
  group:insert(infoImage)
  buttonExit = display.newImage(screen_sheet, screen_sheetData:getFrameIndex("manage_button_close"), centerX, centerY)
  group:insert(buttonExit)
end

function scene:show(event)
  local phase = event.phase
  if phase == "will" then
    buttonConfirm:addEventListener("touch", moveToScreen)
    buttonExit:addEventListener("touch", moveToScreen)
    buttonHowToPlay:addEventListener("touch", howToPlayLink)
  end
end

function scene:hide(event)
  local phase = event.phase
  if phase == "did" then
    buttonConfirm:removeEventListener("touch", moveToScreen)
    buttonExit:removeEventListener("touch", moveToScreen)
    buttonHowToPlay:removeEventListener("touch", howToPlayLink)
  end
end

function scene:destroy(event)
end

scene:addEventListener("create", scene)
scene:addEventListener("show", scene)
scene:addEventListener("hide", scene)
scene:addEventListener("destroy", scene)
return scene
