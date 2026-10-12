local composer = require("composer")
local scene = composer.newScene()
local screenAssest = "Bodies/"
local win_sheetData, win_sheet, win_sequenceData, lose_sheetData, lose_sheet, lose_sequenceData
local screen_sheetData = require(assetsManager.sprites.SCREEN_4_SPRITE_HD.spriteMapper)
local screen_sheet = graphics.newImageSheet(assetsManager.sprites.SCREEN_4_SPRITE_HD.sprite, screen_sheetData.sheet)
local screen_sequenceData = {
  {
    name = "seq1",
    sheet = screen_sheet,
    start = 1,
    count = assetsManager.sprites.SCREEN_4_SPRITE_HD.frames,
    loopCount = 0
  }
}
local ppl_sheetData, ppl_sheet
ppl_sheetData, ppl_sheet = gameUtils.loadPeopleSprite()
local screenSizeX = display.contentWidth
local screenSizeY = display.contentHeight
local centerX = display.contentWidth * 0.5
local centerY = display.contentHeight * 0.5
local oppponent = oppponents[oppponentId]
local isMyUserTurn, background, tubes, winGroup, cover1Group, tube1CoverL, tube1CoverR, winBody, winHead, winHeands, loseBody, loseHead, loseHeands, loseGroup, cover2Group, tube2CoverL, tube2CoverR, machine, amount, amountCircle, roundNumberForNextScene, winningAmountroundForNextScene, playerGender, oppGender

local function moveScreenWithDelay()
  composer.removeScene("scripts.scenes.HeadToHead")
  if gameUtils.numberOfOppponentsLeft(oppponents) ~= "0" then
    local options = {
      effect = "crossFade",
      time = 500,
      params = {isMyUserTurn = isMyUserTurn, isAddDiamonds = "true"}
    }
    composer.gotoScene("scripts.scenes.Indoor", options)
  else
    roundNumberForNextScene = player.roundNumber
    winningAmountroundForNextScene = "1000000"
    local options = {
      effect = "crossFade",
      time = 500,
      params = {
        isMyUserTurn = isMyUserTurn,
        isAddDiamonds = "true",
        roundNumber = roundNumberForNextScene,
        winningAmount = winningAmountroundForNextScene
      }
    }
    composer.removeScene("scripts.scenes.Indoor")
    composer.removeScene("scripts.scenes.menu")
    gameUtils.endGame()
    composer.gotoScene("scripts.scenes.EndScene", options)
  end
end

local function moveScreen()
  if isMyUserTurn == false then
    timer.performWithDelay(1500, moveScreenWithDelay, 1)
  else
    composer.removeScene("scripts.scenes.HeadToHead")
    composer.removeScene("scripts.scenes.Indoor")
    composer.removeScene("scripts.scenes.menu")
    roundNumberForNextScene = player.roundNumber
    winningAmountroundForNextScene = player.score
    local options = {
      effect = "crossFade",
      time = 500,
      params = {
        isMyUserTurn = isMyUserTurn,
        roundNumber = roundNumberForNextScene,
        winningAmount = winningAmountroundForNextScene
      }
    }
    gameUtils.endGame()
    composer.gotoScene("scripts.scenes.EndScene", options)
  end
end

local function playSound()
  SoundUtil.play(SoundUtil.soundsTable.openCoin)
end

local function winner(winBody, winHead, winHeands)
  transition.to(winHead, {
    y = winHead.y + 10,
    time = 400,
    transition = easing.inOutBack
  })
  transition.to(winHead, {
    y = winHead.y - 20,
    x = winHead.x - 5,
    rotation = winHead.rotation - 10,
    time = 500,
    delay = 300,
    transition = easing.inOutBack
  })
  winBody:setSequence("win_body")
  winBody:play()
  winHeands:setSequence("win_hands")
  winHeands:play()
  transition.to(winHead, {
    xScale = 1.1,
    yScale = 0.9,
    time = 600,
    delay = 300,
    transition = easing.inOutBack
  })
  transition.to(winHead, {
    xScale = 1,
    yScale = 1,
    time = 600,
    delay = 700,
    transition = easing.outCubic
  })
end

local function loser(loseBody, loseHead, loseHeands)
  transition.to(loseHead, {
    y = loseHead.y - 25,
    time = 400,
    transition = easing.outQuart
  })
  transition.to(loseHeands, {
    y = loseHeands.y - 25,
    time = 400,
    transition = easing.outQuart
  })
  transition.to(loseBody, {
    y = loseBody.y - 25,
    time = 400,
    transition = easing.outQuart
  })
  loseBody:setSequence("lose_body")
  loseHeands:setSequence("lose_hands1")
  loseBody:play()
  loseHeands:play()
  
  local function swapSheet1()
    loseHeands:setSequence("lose_hands2")
    loseHeands:play()
  end
  
  timer.performWithDelay(400, swapSheet1)
  local yMove = 325
  transition.to(loseHead, {
    y = loseHead.y + yMove,
    time = 1500,
    delay = 350,
    transition = easing.inOutQuart
  })
  transition.to(loseHeands, {
    y = loseHeands.y + yMove,
    time = 1500,
    delay = 350,
    transition = easing.inOutQuart
  })
  transition.to(loseBody, {
    y = loseBody.y + yMove,
    time = 1500,
    delay = 350,
    transition = easing.inOutQuart
  })
  
  local function swapSheet2()
    loseHeands:setSequence("lose_hands3")
    loseHeands:play()
  end
  
  timer.performWithDelay(1400, swapSheet2)
  transition.to(loseHead, {
    xScale = 0.7,
    yScale = 1.3,
    time = 500,
    delay = 800,
    transition = easing.inQuint
  })
  transition.to(loseHead, {
    y = screenSizeY + 500,
    time = 1000,
    delay = 2200,
    transition = easing.inQuart
  })
  transition.to(loseHeands, {
    xScale = 0.7,
    y = screenSizeY + 500,
    time = 1000,
    delay = 2200,
    transition = easing.inQuart
  })
  transition.to(loseBody, {
    y = screenSizeY + 500 + (loseBody.contentBounds.yMax - loseBody.contentBounds.yMin) / 2,
    time = 1000,
    delay = 2200,
    transition = easing.inQuart
  })
end

local function drop(winBody, winHead, winHeands, loseBody, loseHead, loseHeands)
  winner(winBody, winHead, winHeands)
  loser(loseBody, loseHead, loseHeands)
  local TranstionTime1 = 1500
  local delaytime = 3000
  if isMyUserTurn == false then
    timer.performWithDelay(delaytime + TranstionTime1 + 500, playSound, 1)
    transition.to(machine, {
      time = TranstionTime1,
      delay = delaytime,
      y = centerY
    })
    transition.to(amountCircle, {
      time = TranstionTime1,
      delay = delaytime,
      y = centerY - machine.contentHeight + 25
    })
    transition.to(amount, {
      time = TranstionTime1,
      delay = delaytime,
      y = centerY - machine.contentHeight + 25
    })
    transition.to(amountCircle, {
      time = TranstionTime1 * 1.5,
      delay = delaytime + TranstionTime1 + 500,
      rotation = 360
    })
    transition.to(amount, {
      time = TranstionTime1 * 1.5,
      delay = delaytime + TranstionTime1 + 500,
      rotation = 360,
      onComplete = moveScreen
    })
  else
    timer.performWithDelay(delaytime + TranstionTime1, moveScreen, 1)
  end
end

local function dropAction()
  SoundUtil.play(SoundUtil.soundsTable.contestant_Lock_2_A)
  if isMyUserTurn == false then
    transition.to(cover1Group, {alpha = 0, time = 100})
  else
    transition.to(cover2Group, {alpha = 0, time = 100})
  end
  drop(winBody, winHead, winHeands, loseBody, loseHead, loseHeands)
end

local function killOppponent()
  oppponents[oppponentId].image:removeSelf()
  oppponents[oppponentId].HeadFrame:removeSelf()
  oppponents[oppponentId].valueImage.alpha = 0
  oppponents[oppponentId].stage.alpha = 1
  oppponents[oppponentId].valueImageOff.alpha = 1
  oppponents[oppponentId].playerStatus = false
  player.score = player.score + oppponents[oppponentId].value
  player.scoreText.text = player.score .. messagesUtil.Messges.SPACE .. messagesUtil.Messges.CURRENCY
  oppponentId = 0
  saveUtil.saveGame()
  saveUtil.setAddCreditForSaveGame("true")
end

function scene:create(event)
  local sceneGroup = self.view
  winGroup = display.newGroup()
  loseGroup = display.newGroup()
  cover1Group = display.newGroup()
  cover2Group = display.newGroup()
  background = gameUtils.createBgImage(assetsManager.bg.SCREEN_4_BACKGROUND_HD)
  sceneGroup:insert(background)
  isMyUserTurn = event.params.isMyUserTurn
  playerGender = gameUtils.getPlayerGender()
  oppGender = oppponent.gender
  if oppponent.body == nil then
    if oppGender == "male" then
      oppponent.body = "seq1_suit-hd"
    else
      oppponent.body = "seq2_hasuda-hd"
    end
  end
  if player.body == nil then
    if playerGender == "male" then
      player.body = "seq1_suit-hd"
    else
      player.body = "seq2_hasuda-hd"
    end
  end
  local winner, loser
  if isMyUserTurn == false then
    winner = player.body
    loser = oppponent.body
  else
    winner = oppponent.body
    loser = player.body
  end
  win_sheetData = require("scripts.bodies.win-" .. winner)
  win_sheet = graphics.newImageSheet(imagesAssets .. screenAssest .. "win-" .. winner .. ".png", win_sheetData.sheet)
  win_sequenceData = {
    {
      name = "all_win_body",
      sheet = win_sheet,
      start = 1,
      count = 34
    },
    {
      name = "win_body",
      sheet = win_sheet,
      start = 1,
      count = 17,
      loopCount = 1,
      time = 600
    },
    {
      name = "win_hands",
      sheet = win_sheet,
      start = 18,
      count = 17,
      loopCount = 1,
      time = 850
    }
  }
  lose_sheetData = require("scripts.bodies.lose-" .. loser)
  lose_sheet = graphics.newImageSheet(imagesAssets .. screenAssest .. "lose-" .. loser .. ".png", lose_sheetData.sheet)
  lose_sequenceData = {
    {
      name = "all_lose_body",
      sheet = lose_sheet,
      start = 1,
      count = 26
    },
    {
      name = "lose_body",
      sheet = lose_sheet,
      start = 1,
      count = 3,
      loopCount = 1,
      time = 400
    },
    {
      name = "lose_hands1",
      sheet = lose_sheet,
      start = 4,
      count = 1,
      loopCount = 1,
      time = 400
    },
    {
      name = "lose_hands2",
      sheet = lose_sheet,
      start = 5,
      count = 11,
      loopCount = 1,
      time = 1500
    },
    {
      name = "lose_hands3",
      sheet = lose_sheet,
      start = 16,
      count = 11,
      loopCount = 1,
      time = 750,
      loopCount = 3
    }
  }
  loseBody = display.newSprite(lose_sheet, lose_sequenceData)
  loseHeands = display.newSprite(lose_sheet, lose_sequenceData)
  winBody = display.newSprite(win_sheet, win_sequenceData)
  winHeands = display.newSprite(win_sheet, win_sequenceData)
  loseHeands:setFrame(4)
  loseBody:setFrame(1)
  winBody:setFrame(1)
  winHeands:setFrame(18)
  if isMyUserTurn == false then
    loseBody.x = 150
    loseHeands.x = 150
    winBody.x = 405
    winHeands.x = 397.5
  else
    loseBody.x = 405
    loseHeands.x = 405
    winBody.x = 150
    winHeands.x = 142.5
  end
  loseBody.y = screenSizeY * 0.29
  loseHeands.y = screenSizeY * 0.285
  winBody.y = loseBody.y
  winHeands.y = loseHeands.y
  oppponent.dropImage = display.newCircle(142.5, 175, 74)
  oppponent.dropImage.fill = {
    type = "image",
    sheet = ppl_sheet,
    frame = ppl_sheetData:getFrameIndex(tostring(oppponent.imageFile))
  }
  player.dropImage = display.newCircle(405, 175, 74)
  player.dropImage.fill = {
    type = "image",
    baseDir = player.baseDir,
    filename = player.picName
  }
  if gameUtils.isImageRotationAccordingToPlatform() then
    player.dropImage.fill.rotation = 90
  else
    player.dropImage.fill.rotation = 0
  end
  if isMyUserTurn == false then
    loseHead = oppponent.dropImage
    winHead = player.dropImage
  else
    loseHead = player.dropImage
    winHead = oppponent.dropImage
  end
  tube1CoverL = display.newImage(screen_sheet, screen_sheetData:getFrameIndex("left_tube_cover_l"), centerX, centerY)
  tube1CoverR = display.newImage(screen_sheet, screen_sheetData:getFrameIndex("left_tube_cover_r"), centerX, centerY)
  cover1Group:insert(tube1CoverL)
  cover1Group:insert(tube1CoverR)
  tube2CoverL = display.newImage(screen_sheet, screen_sheetData:getFrameIndex("right_tube_cover_l"), centerX, centerY)
  tube2CoverR = display.newImage(screen_sheet, screen_sheetData:getFrameIndex("right_tube_cover_r"), centerX, centerY)
  cover2Group:insert(tube2CoverL)
  cover2Group:insert(tube2CoverR)
  tubes = display.newImage(screen_sheet, screen_sheetData:getFrameIndex("tubes_front"), centerX, centerY + 100)
  winGroup:insert(winBody)
  winGroup:insert(winHead)
  winGroup:insert(winHeands)
  loseGroup:insert(loseBody)
  loseGroup:insert(loseHead)
  loseGroup:insert(loseHeands)
  sceneGroup:insert(cover1Group)
  sceneGroup:insert(cover2Group)
  sceneGroup:insert(loseGroup)
  sceneGroup:insert(winGroup)
  machine = display.newImage(screen_sheet, screen_sheetData:getFrameIndex("prize_machine"), centerX, screenSizeY * 2)
  amountCircle = display.newImage(screen_sheet, screen_sheetData:getFrameIndex("number_circle_background"), 150, screenSizeY * 2 - machine.contentHeight + 25)
  amountCircle:rotate(180)
  amount = display.newImage(screen_sheet, screen_sheetData:getFrameIndex("number_circle_prize_" .. oppponent.value), 150, amountCircle.y)
  amount:rotate(180)
  sceneGroup:insert(amountCircle)
  sceneGroup:insert(amount)
  sceneGroup:insert(machine)
  sceneGroup:insert(tubes)
end

function scene:show(event)
  local group = self.view
  local phase = event.phase
  if phase == "wil" then
    native.setKeyboardFocus(nil)
  elseif phase == "did" then
    local timmer = 1500
    local mod = tonumber(settingsUtil.getGameSettingByKey(settingsUtil.SettingsTable.adsRoundModulo))
    if mod == nil or mod < 1 then
      mod = 3
    end
    log:log("Ads mod", mod)
    if player.roundNumber % mod == 0 and isMyUserTurn == false then
      adsUtil.showAd()
      timmer = 2750
    end
    if event.params ~= nil then
      if isMyUserTurn == false then
        killOppponent()
      else
        local canCompete = settingsUtil.getPalyerSettingByKey(settingsUtil.SettingsTable.canCompete)
        if canCompete ~= "true" then
          competitionManager.setDeltaScore(0)
        end
      end
    end
    timer.performWithDelay(timmer, dropAction, 1)
  end
end

function scene:hide(event)
  local group = self.view
end

function scene:destroy(event)
  local group = self.view
end

scene:addEventListener("create", scene)
scene:addEventListener("show", scene)
scene:addEventListener("hide", scene)
scene:addEventListener("destroy", scene)
return scene
