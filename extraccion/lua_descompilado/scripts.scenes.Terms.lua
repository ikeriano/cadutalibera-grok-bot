local composer = require("composer")
local scene = composer.newScene()
local widget = require("widget")
local screenSizeX = display.contentWidth
local screenSizeY = display.contentHeight
local centerX = display.contentWidth * 0.5
local centerY = display.contentHeight * 0.5
local webView, okBtn, noBtn
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
local lastScene

local function handleButtonEvent(event)
  if event.phase == "began" then
    log:log(event.target.id)
    webView:removeSelf()
    local options
    if event.target.id == "yes" then
      settingsUtil.setPalyerSettingByKey(settingsUtil.SettingsTable.isTerms, "true")
      options = {
        effect = "crossFade",
        time = 500,
        params = {
          status = "CheckCompetition"
        }
      }
    else
      options = {effect = "crossFade", time = 500}
    end
    composer.gotoScene(lastScene, options)
  end
end

local function webListener(event)
  if event.url then
    log:log("You are visiting: ", event.url)
  end
  if event.type then
    log:log("The event.type is ", event.type)
  end
  if event.errorCode then
    log:log("Error!", event.errorMessage)
  end
end

function scene:create(event)
  local group = self.view
  if event.params ~= nil and event.params.lastScene ~= nil then
    lastScene = event.params.lastScene
  end
  composer.removeScene("scripts.scenes.Indoor")
  local background = gameUtils.createBgImage(assetsManager.bg.SCREEN_1_BACKGROUND_HD)
  group:insert(background)
  okBtn = widget.newButton({
    x = centerX + 150,
    y = 900,
    id = "yes",
    label = messagesUtil.Messges.CONFIRM,
    fontSize = 24,
    shape = "roundedRect",
    width = 200,
    height = 50,
    cornerRadius = 2,
    fillColor = {
      default = {
        1,
        1,
        1,
        1
      },
      over = {
        0.195,
        0.144,
        0.212,
        1
      }
    },
    strokeWidth = 4,
    onEvent = handleButtonEvent
  })
  noBtn = widget.newButton({
    x = centerX - 150,
    y = 900,
    id = "no",
    label = messagesUtil.Messges.NOT_CONFIRM,
    fontSize = 24,
    shape = "roundedRect",
    width = 200,
    height = 50,
    cornerRadius = 2,
    fillColor = {
      default = {
        1,
        1,
        1,
        1
      },
      over = {
        0.195,
        0.144,
        0.212,
        1
      }
    },
    strokeWidth = 4,
    onEvent = handleButtonEvent
  })
  webView = native.newWebView(centerX, centerY - 50, screenSizeX, screenSizeY - 100)
  webView:request(applicationInfo.termsWebSourceAddres)
  group:insert(webView)
  group:insert(noBtn)
  group:insert(okBtn)
  webView:addEventListener("urlRequest", webListener)
end

function scene:show(event)
  local phase = event.phase
  composer.removeScene("scripts.scenes.menu")
end

function scene:hide(event)
  local phase = event.phase
end

function scene:destroy(event)
end

scene:addEventListener("create", scene)
scene:addEventListener("show", scene)
scene:addEventListener("hide", scene)
scene:addEventListener("destroy", scene)
return scene
