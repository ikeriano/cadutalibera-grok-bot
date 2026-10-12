local composer = require("composer")
local scene = composer.newScene()
local toast = require("plugin.toast")
local stopwatch = require("scripts.utils.Stopwatch")
local question = require("scripts.commons.Question")
local guideManager = require("scripts.utils.GuideManager")
local animationUtils = require("scripts.utils.AnimationUtils")
local recordedGameUtil = require("scripts.utils.RecordedGameUtil")
local playerTime = 30
local oppTime = 10
local screen_sheetData = require(assetsManager.sprites.SCREEN_3_SPRITE_HD.spriteMapper)
local screen_sheet = graphics.newImageSheet(assetsManager.sprites.SCREEN_3_SPRITE_HD.sprite, screen_sheetData.sheet)
local screen_sequenceData = {
  {
    name = "seq1",
    sheet = screen_sheet,
    start = 1,
    count = assetsManager.sprites.SCREEN_3_SPRITE_HD.frames,
    loopCount = 0
  }
}
local ppl_sheetData, ppl_sheet
ppl_sheetData, ppl_sheet = gameUtils.loadPeopleSprite()
local isTimesOverSoundIsPlay = false
local screenSizeX = display.contentWidth
local screenSizeY = display.contentHeight
local centerX = display.contentWidth * 0.5
local centerY = display.contentHeight * 0.5
local playerX = 365
local playerY = 150
local oppponentX = 192.5
local oppponentY = playerY
local clockY = playerY + 86
local clockX = playerX
local isReplaceQuestion = true
local screenAssest = "Screen_2/"
local background, textAnswer, clockM, clockR, clockL, clockGroup, upperBoardGroup, turnIndicator, nameIndicator, powerupPass, powerupLetter, powerupTimer, powerupsView
local livesManager = {}
local questionsGroup, questionText, creditsImage, creditsImageBg, creditsText, creditsBox
local oppponent = oppponents[oppponentId]
local isOpponentDecision, isOpponentAnswer, timeText, timerTime, timerGameLoop
local waitForNewTurn = false
local isMyTurn
local isNewTurn = true
local turnCounter = 0
local waitToEnd = false
local tstart, tend, emailGroup, touchEvent
local isAnswerd = true
local helpBg, helpLable, helpBtn, showSceneGroup, showSceneFunction

local function notEnoughCredits()
  toast.show(messagesUtil.Messges.DIAMONDS_FINISHED, {duration = "short", gravity = "Center"})
end

local function setAlphaOnPowerUpEvents(event)
  local tranTime = 60
  transition.scaleTo(event.target, {
    xScale = 0.67,
    yScale = 0.67,
    time = tranTime
  })
  transition.scaleTo(event.target, {
    xScale = 0.7,
    yScale = 0.7,
    time = tranTime,
    delay = tranTime + 20
  })
end

local function moveScreenByEvent()
  if touchEvent.target.id == "email" then
    log:sendEmail(emailGroup)
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

local helpCostsOptions = {
  text = "",
  width = screenSizeX * 0.2,
  fontSize = 27,
  align = "center"
}

local function removeMe(event)
  if event.target ~= nil then
    event.target:removeSelf()
  end
end

local function showHelpCosts(price)
  local helpCosts = display.newText(helpCostsOptions)
  helpCosts:setFillColor(1, 1, 1)
  helpCosts.alpha = 0
  helpCosts.text = "-" .. price
  helpCosts.x = 50
  helpCosts.y = 210
  helpCosts.alpha = 1
  transition.to(helpCosts, {
    y = helpCosts.y - 125,
    alpha = 0,
    time = 1500,
    onComplete = removeMe
  })
end

local function runAnswer()
  SoundUtil.play(SoundUtil.soundsTable.yes1)
  guideManager.setAnswer(question.answerText, isMyTurn)
end

local function setScaleOnPowerUpEvents(event)
  local tranTime = 60
  transition.scaleTo(event.target, {
    xScale = 0.98,
    yScale = 0.98,
    time = tranTime
  })
  transition.scaleTo(event.target, {
    xScale = 1,
    yScale = 1,
    time = tranTime,
    delay = tranTime + 20
  })
end

local function textListener(event)
  guideManager.textListener(event)
end

local function sendHelpEvent(helpType)
  local playerCredit = tonumber(settingsUtil.getPalyerSettingByKey(settingsUtil.SettingsTable.PlayerCredits))
  gameAnalytics.logEvent("HelpInfo_" .. tostring(player.roundNumber) .. "_" .. helpType, {
    helpType = helpType,
    roundNumber = player.roundNumber,
    numberOfQuestion = player.questionNumber,
    credits = playerCredit
  })
end

local function revealLetterOnHth(event)
  if event.phase == "ended" then
    setScaleOnPowerUpEvents(event)
    local playerCredit = tonumber(settingsUtil.getPalyerSettingByKey(settingsUtil.SettingsTable.PlayerCredits))
    local helpPrice = tonumber(settingsUtil.getGameSettingByKey(settingsUtil.SettingsTable.LettersHelp))
    if 0 <= playerCredit - helpPrice then
      if guideManager.revealLetter(question.answerText) then
        settingsUtil.setPalyerSettingByKey(settingsUtil.SettingsTable.isUseHelp, "true")
        SoundUtil.play(SoundUtil.soundsTable.Reveal)
        isAnswerd = false
        sendHelpEvent("revealLetterHelp")
        showHelpCosts(helpPrice)
        playerCredit = playerCredit - helpPrice
        settingsUtil.setPalyerSettingByKey(settingsUtil.SettingsTable.PlayerCredits, playerCredit)
        creditsText.text = playerCredit
      end
    else
      log:log("ToStore")
      notEnoughCredits()
    end
  end
end

local function changeIsMyTurnStat()
  if isMyTurn then
    isMyTurn = false
    isOpponentDecision = false
  else
    isMyTurn = true
  end
end

local function timerCheck(event)
  local isTimeOver
  isTimeOver, timeText.text = stopwatch:clock()
  return isTimeOver
end

local function addTime(event)
  if event.phase == "ended" then
    setScaleOnPowerUpEvents(event)
    local playerCredit = tonumber(settingsUtil.getPalyerSettingByKey(settingsUtil.SettingsTable.PlayerCredits))
    local helpPrice = tonumber(settingsUtil.getGameSettingByKey(settingsUtil.SettingsTable.TimerHelp))
    if 0 <= playerCredit - helpPrice then
      settingsUtil.setPalyerSettingByKey(settingsUtil.SettingsTable.isUseHelp, "true")
      SoundUtil.play(SoundUtil.soundsTable.Correct_7)
      isAnswerd = false
      sendHelpEvent("addTimeHelp")
      showHelpCosts(helpPrice)
      playerCredit = playerCredit - helpPrice
      settingsUtil.setPalyerSettingByKey(settingsUtil.SettingsTable.PlayerCredits, playerCredit)
      creditsText.text = playerCredit
      stopwatch:addTime(10)
      SoundUtil.stopTimeRunningOutSound()
      isTimesOverSoundIsPlay = false
    else
      log:log("ToStore")
      notEnoughCredits()
    end
  end
end

local function passTurn(event)
  if event.phase == "ended" then
    setScaleOnPowerUpEvents(event)
    local playerCredit = tonumber(settingsUtil.getPalyerSettingByKey(settingsUtil.SettingsTable.PlayerCredits))
    local helpPrice = tonumber(settingsUtil.getGameSettingByKey(settingsUtil.SettingsTable.PassHelp))
    if 0 <= playerCredit - helpPrice then
      settingsUtil.setPalyerSettingByKey(settingsUtil.SettingsTable.isUseHelp, "true")
      SoundUtil.play(SoundUtil.soundsTable.Pass_2)
      isAnswerd = false
      sendHelpEvent("passTurnHelp")
      showHelpCosts(helpPrice)
      guideManager.changeToOpponentLetters()
      playerCredit = playerCredit - helpPrice
      settingsUtil.setPalyerSettingByKey(settingsUtil.SettingsTable.PlayerCredits, playerCredit)
      creditsText.text = playerCredit
      powerupPass:removeEventListener("touch", passTurn)
      powerupLetter:removeEventListener("touch", revealLetterOnHth)
      powerupTimer:removeEventListener("touch", addTime)
      stopwatch:pause()
      SoundUtil.stopTimeRunningOutSound()
      isNewTurn = true
      changeIsMyTurnStat()
      textAnswer.text = " "
      waitForNewTurn = true
      isReplaceQuestion = false
      if showMode == true then
        isOpponentAnswer = recordedGameUtil.doesOpponentSucceed()
        recordedGameUtil.popQuestion()
      end
    else
      log:log("ToStore")
      notEnoughCredits()
    end
  end
end

local function restartWatch()
  if isMyTurn then
    stopwatch = stopwatch.new(playerTime)
    textAnswer.inputType = "default"
    textAnswer.text = " "
    textAnswer:setSelection(1, 1)
    textAnswer:addEventListener("userInput", textListener)
    powerupLetter:addEventListener("touch", revealLetterOnHth)
    powerupPass:addEventListener("touch", passTurn)
    powerupTimer:addEventListener("touch", addTime)
    oppponent.hthCoverImage:setFrame(screen_sheetData:getFrameIndex("head_frame_offturn"))
    player.hthCoverImage:setFrame(screen_sheetData:getFrameIndex("head_frame_onturn"))
  else
    stopwatch = stopwatch.new(oppTime)
    turnCounter = turnCounter + 1
    textAnswer:removeEventListener("userInput", textListener)
    powerupLetter:removeEventListener("touch", revealLetterOnHth)
    powerupPass:removeEventListener("touch", passTurn)
    powerupTimer:removeEventListener("touch", addTime)
    oppponent.hthCoverImage:setFrame(screen_sheetData:getFrameIndex("head_frame_onturn"))
    player.hthCoverImage:setFrame(screen_sheetData:getFrameIndex("head_frame_offturn"))
  end
  isTimesOverSoundIsPlay = false
end

local function getQuetionsAndGuide()
  transition.to(timeText, {alpha = 1, time = 250})
  if isMyTurn == false and question then
    persistenceUtil.updateCategoryStatistic(isAnswerd, question.category)
    isAnswerd = true
  end
  if isMyTurn then
    player.questionNumber = player.questionNumber + 1
  end
  if isReplaceQuestion == true then
    question = questionsUtil.getQuestion(player.roundNumber, player.questionNumber)
    questionText.text = question.questionText
    guideManager.reset()
    guideManager.setOrigAnswer(question.answerText)
    guideManager.showGuide(question.guide, isMyTurn)
  end
  isReplaceQuestion = true
  restartWatch()
  if isMyTurn then
    guideManager.setOnLetterImage()
  else
    guideManager.removeLetterImage()
  end
end

local function preFirstTrunOperations()
  isNewTurn = false
  animationUtils.openClock(clockM, clockL, clockR, timeText)
  timer.performWithDelay(1500, getQuetionsAndGuide, 1)
end

local function restartWatchWithDelay()
  getQuetionsAndGuide()
  waitForNewTurn = false
  stopwatch:resume()
end

local function preTurnOperations()
  isNewTurn = false
  animationUtils.setClockPosGame(isMyTurn)
  timer.performWithDelay(3700, restartWatchWithDelay, 1)
end

local function checkAnswer()
  if guideManager.getAnswer() == question.answerText then
    stopwatch:pause()
    SoundUtil.correctAnswerSeq()
    persistenceUtil.deleteQuestionById(question.id)
    isNewTurn = true
    isOpponentAnswer = false
    changeIsMyTurnStat()
    textAnswer.text = " "
    waitForNewTurn = true
    isErrorSound = true
  elseif isErrorSound and guideManager.isSameSize(question.answerText) then
    SoundUtil.play(SoundUtil.soundsTable.wrongAnswer)
    isErrorSound = false
  end
end

local function goToNextScene()
  local options
  if isMyTurn then
    options = {
      effect = "crossFade",
      time = 500,
      params = {isMyUserTurn = true, isCommercial = false}
    }
  else
    options = {
      effect = "crossFade",
      time = 500,
      params = {isMyUserTurn = false, isCommercial = false}
    }
  end
  composer.gotoScene("scripts.scenes.DropScene", options)
end

local function calcOppponentAnswer()
  math.randomseed(os.time())
  local number
  local roundDifficulty = tonumber(settingsUtil.getPalyerSettingByKey(settingsUtil.SettingsTable.roundDifficulty))
  local roundFactor = player.roundNumber * roundDifficulty
  if showMode and recordedGameUtil.isRealRival() then
    return isOpponentAnswer or recordedGameUtil.doesOpponentSucceed()
  end
  if turnCounter <= 1 then
    return true
  elseif turnCounter <= 3 then
    number = math.random(oppponent.level + 20 + roundFactor)
  elseif turnCounter <= 4 then
    number = math.random(oppponent.level + 15 + roundFactor)
  elseif turnCounter <= 5 then
    number = math.random(oppponent.level + 10 + roundFactor)
  elseif turnCounter <= 7 then
    number = math.random(oppponent.level - 20 + roundFactor)
  else
    return false
  end
  if 60 <= number then
    return true
  else
    return false
  end
end

local function sceneGameLoop()
  local timeLeft = stopwatch:getRemaining()
  local isTimeOver = timerCheck()
  if isOpponentDecision == false and isNewTurn == false then
    isOpponentDecision = true
    if calcOppponentAnswer() then
      math.randomseed(os.time())
      if math.random(100) > 20 then
        if player.questionNumber <= 2 then
          timer.performWithDelay(math.random(5500, 7500), runAnswer, 1)
        elseif player.questionNumber <= 5 then
          timer.performWithDelay(math.random(6500, 7500), runAnswer, 1)
        else
          timer.performWithDelay(math.random(7500, 8500), runAnswer, 1)
        end
      else
        timer.performWithDelay(math.random(8500, 10000), runAnswer, 1)
      end
    end
  end
  if timeLeft <= 5500 and isTimesOverSoundIsPlay == false and isNewTurn == false and waitToEnd ~= true then
    SoundUtil.play(SoundUtil.soundsTable.timeRunningOut)
    isTimesOverSoundIsPlay = true
  end
  if isTimeOver and waitToEnd ~= true then
    isTimesOverSoundIsPlay = false
    SoundUtil.stopHthMusic()
    native.setKeyboardFocus(nil)
    powerupLetter:removeEventListener("touch", revealLetterOnHth)
    powerupPass:removeEventListener("touch", passTurn)
    powerupTimer:removeEventListener("touch", addTime)
    timer.performWithDelay(1000, runAnswer, 1)
    timer.performWithDelay(3000, goToNextScene, 1)
    waitToEnd = true
  elseif isNewTurn and isTimeOver == false and waitToEnd ~= true then
    preTurnOperations()
  elseif waitForNewTurn == false and waitToEnd ~= true then
    checkAnswer()
  end
end

local function showThisScene()
  showSceneFunction(showSceneGroup)
end

local function removeHelpMessage(event)
  if event.phase == "began" then
    transition.to(helpBg, {time = 500, alpha = 0})
    transition.to(helpLable, {time = 500, alpha = 0})
    transition.to(helpBtn, {time = 500, alpha = 0})
    transition.to(powerupsView, {
      time = 1000,
      alpha = 1,
      delay = 700
    })
    helpBtn:removeEventListener("touch", removeHelpMessage)
    settingsUtil.setPalyerSettingByKey(settingsUtil.SettingsTable.isGameHelp, "false")
    timer.performWithDelay(700, showThisScene, 1)
  end
end

function scene:create(event)
  local sceneGroup = self.view
  questionsGroup = display.newGroup()
  background = gameUtils.createBgImage(assetsManager.bg.SCREEN_3_BACKGROUND_HD)
  sceneGroup:insert(background)
  local questionOptions = {
    text = "",
    x = centerX,
    y = centerY - 137.5,
    width = screenSizeX * 0.95,
    fontSize = 23,
    align = "center"
  }
  questionText = display.newText(questionOptions)
  powerupsView = display.newGroup()
  powerupPass = display.newImage(screen_sheet, screen_sheetData:getFrameIndex("powerup_passquestion"), centerX, centerY)
  powerupTimer = display.newImage(screen_sheet, screen_sheetData:getFrameIndex("powerup_moretime"), centerX, centerY)
  powerupLetter = display.newImage(screen_sheet, screen_sheetData:getFrameIndex("powerup_moreletter"), centerX, centerY)
  creditsImageBg = display.newImage(screen_sheet, screen_sheetData:getFrameIndex("diamonds_bg"), centerX, centerY)
  creditsImage = display.newImage(screen_sheet, screen_sheetData:getFrameIndex("diamonds_on"), centerX, centerY)
  creditsBox = display.newImage(screen_sheet, screen_sheetData:getFrameIndex("diamonds_count_bg"), centerX, centerY)
  local frame = screen_sheetData.sheet.frames[screen_sheetData:getFrameIndex("diamonds_count_bg")]
  local creditTextOption = {
    text = settingsUtil.getPalyerSettingByKey(settingsUtil.SettingsTable.PlayerCredits),
    x = frame.sourceX + frame.width / 2,
    y = frame.sourceY + frame.height / 2,
    fontSize = 22,
    align = "center"
  }
  creditsText = display.newText(creditTextOption)
  powerupsView:insert(creditsBox)
  powerupsView:insert(creditsImageBg)
  powerupsView:insert(creditsImage)
  powerupsView:insert(creditsText)
  powerupsView:insert(powerupPass)
  powerupsView:insert(powerupTimer)
  powerupsView:insert(powerupLetter)
  if settingsUtil.getPalyerSettingByKey(settingsUtil.SettingsTable.isGameHelp) == "true" then
    helpBg = display.newImage(screen_sheet, screen_sheetData:getFrameIndex("message_3-power-diamonds_bg"), centerX, centerY)
    helpLable = display.newImage(screen_sheet, screen_sheetData:getFrameIndex("message_3-power-diamonds_label"), centerX, centerY)
    helpBtn = display.newImage(screen_sheet, screen_sheetData:getFrameIndex("message_3-power-diamonds_button"), centerX, centerY)
    helpBtn:addEventListener("touch", removeHelpMessage)
    sceneGroup:insert(helpBg)
    sceneGroup:insert(helpLable)
    sceneGroup:insert(helpBtn)
    powerupsView.alpha = 0
  end
  questionsGroup:insert(questionText)
  sceneGroup:insert(powerupsView)
  sceneGroup:insert(questionsGroup)
end

local function nameVerticalAlign(nameLength)
  local height
  if 20 <= nameLength then
    height = 47
  elseif 12 <= nameLength then
    height = 62.5
  else
    height = 82.5
  end
  return height
end

function showSceneFunction(sceneGroup)
  tstart = os.time()
  local nameOptions = {
    text = player.name,
    x = playerX - 2.5,
    y = nameVerticalAlign(string.len(player.name)),
    width = 130,
    height = screenSizeY * 0.1,
    fontSize = 21,
    align = "center"
  }
  nameIndicator = display.newText(nameOptions)
  upperBoardGroup = display.newGroup()
  turnIndicator = display.newImage(screen_sheet, screen_sheetData:getFrameIndex("turn_indicator"), centerX, centerY)
  turnIndicator.x = playerX - 2.5
  turnIndicator.y = playerY
  upperBoardGroup:insert(turnIndicator)
  upperBoardGroup:insert(nameIndicator)
  local hthImageSize = 72.5
  player.hthImage = display.newCircle(playerX, playerY, hthImageSize)
  player.hthImage.fill = {
    type = "image",
    baseDir = player.baseDir,
    filename = player.picName
  }
  if gameUtils.isImageRotationAccordingToPlatform() then
    player.hthImage.fill.rotation = 90
  else
    player.hthImage.fill.rotation = 0
  end
  player.hthCoverImage = display.newSprite(screen_sheet, screen_sequenceData)
  player.hthCoverImage:setFrame(screen_sheetData:getFrameIndex("head_frame_onturn"))
  player.hthCoverImage.x = playerX
  player.hthCoverImage.y = playerY
  upperBoardGroup:insert(player.hthImage)
  upperBoardGroup:insert(player.hthCoverImage)
  sceneGroup:insert(upperBoardGroup)
  oppponent.hthImage = display.newCircle(oppponentX, oppponentY, hthImageSize)
  oppponent.hthImage.fill = {
    type = "image",
    sheet = ppl_sheet,
    frame = ppl_sheetData:getFrameIndex(tostring(oppponent.imageFile))
  }
  oppponent.hthCoverImage = display.newSprite(screen_sheet, screen_sequenceData)
  oppponent.hthCoverImage:setFrame(screen_sheetData:getFrameIndex("head_frame_offturn"))
  oppponent.hthCoverImage.x = oppponentX
  oppponent.hthCoverImage.y = oppponentY
  upperBoardGroup:insert(oppponent.hthImage)
  upperBoardGroup:insert(oppponent.hthCoverImage)
  clockGroup = display.newGroup()
  clockM = display.newImage(screen_sheet, screen_sheetData:getFrameIndex("timer_middle"), clockX, clockY)
  clockM:scale(0.1, 1)
  clockR = display.newImage(screen_sheet, screen_sheetData:getFrameIndex("timer_right"), clockX, clockY)
  clockL = display.newImage(screen_sheet, screen_sheetData:getFrameIndex("timer_left"), clockX, clockY)
  stopwatch = stopwatch.new(30)
  timeText = display.newText(stopwatch:toRemainingString(), clockX, clockY, "Helvetica", 25)
  timeText:setFillColor(255, 255, 0)
  timeText.align = "center"
  timeText.alpha = 0
  timeText.x = clockX
  clockGroup:insert(clockM)
  clockGroup:insert(clockR)
  clockGroup:insert(clockL)
  clockGroup:insert(timeText)
  sceneGroup:insert(clockGroup)
  animationUtils.setClockArgs(clockM, clockL, clockR, timeText, playerX, oppponentX, turnIndicator, nameIndicator, oppponent.name)
  isMyTurn = true
  textAnswer = native.newTextField(centerX, -500, screenSizeX * 0.7, screenSizeY * 0.06)
  textAnswer.text = " "
  sceneGroup:insert(textAnswer)
  guideManager.setGroupAndText(sceneGroup, textAnswer)
  guideManager.setPosY(centerY - 125)
  native.setKeyboardFocus(textAnswer)
  preFirstTrunOperations()
  waitForNewTurn = false
  timerGameLoop = timer.performWithDelay(150, sceneGameLoop, -1)
  timerTime = timer.performWithDelay(33, timerCheck, -1)
  SoundUtil.play(SoundUtil.soundsTable.hthMusic, -1)
  emailGroup = sceneGroup
  local playerCredit = tonumber(settingsUtil.getPalyerSettingByKey(settingsUtil.SettingsTable.PlayerCredits))
  gameAnalytics.logEvent("RoundStart" .. tostring(player.roundNumber), {credits = playerCredit})
end

function scene:show(event)
  local phase = event.phase
  if phase == "will" then
    showSceneGroup = self.view
    oppponent = oppponents[oppponentId]
    returnFromScreen = freePass.Ads
    adsUtil.loadAd()
    if settingsUtil.getPalyerSettingByKey(settingsUtil.SettingsTable.isGameHelp) == "false" then
      showSceneFunction(showSceneGroup)
    end
  end
end

function scene:hide(event)
  local phase = event.phase
  if phase == "will" then
    log:log("hide:will")
    persistenceUtil.deleteQuestionById(question.id)
    local group = self.view
    if timerGameLoop ~= nil then
      timer.cancel(timerGameLoop)
    end
    if timerTime ~= nil then
      timer.cancel(timerTime)
    end
    native.setKeyboardFocus(nil)
    guideManager.reset()
    isAnswerd = true
    if isMyTurn then
      persistenceUtil.updateCategoryStatistic(false, question.category)
      saveUtil.deleteGame()
    end
    if isMyTurn == false and waitToEnd == true then
      local roundsWins = settingsUtil.getPalyerSettingByKey(settingsUtil.SettingsTable.RoundsWins)
      roundsWins = roundsWins + 1
      settingsUtil.setPalyerSettingByKey(settingsUtil.SettingsTable.RoundsWins, roundsWins)
    end
    if isMyTurn or player.roundNumber == 10 and waitToEnd == true then
      gameUtils.updateGamePlayed()
      levelManager.calcLevel(player.roundNumber)
    end
    if isMyTurn == false and player.roundNumber == 10 and waitToEnd == true then
      if settingsUtil.getPalyerSettingByKey(settingsUtil.SettingsTable.isUseHelp) == "true" then
        settingsUtil.setPalyerSettingByKey(settingsUtil.SettingsTable.isWinGame, "true")
      else
        settingsUtil.setPalyerSettingByKey(settingsUtil.SettingsTable.isWinGameNoHelp, "true")
      end
    end
    achievementsManager.checkAndUpdateAchievementByName(achievementsManager.achievementsNames.win_50_opponents)
    tend = os.time()
    local roundTime = os.difftime(tend, tstart)
    local roundTimeParam
    if roundTime <= 20 then
      roundTimeParam = "1-20"
    elseif roundTime <= 40 then
      roundTimeParam = "20-40"
    elseif roundTime <= 60 then
      roundTimeParam = "40-60"
    elseif roundTime <= 80 then
      roundTimeParam = "60-80"
    elseif roundTime <= 100 then
      roundTimeParam = "80-100"
    elseif roundTime <= 120 then
      roundTimeParam = "100-120"
    elseif roundTime <= 140 then
      roundTimeParam = "120-140"
    else
      roundTimeParam = "+140"
    end
    local playerCredit = tonumber(settingsUtil.getPalyerSettingByKey(settingsUtil.SettingsTable.PlayerCredits))
    gameAnalytics.logEvent("RoundEnd" .. tostring(player.roundNumber), {
      credits = playerCredit,
      numberOfQuestion = player.questionNumber,
      roundTime = roundTimeParam,
      oppponentLevel = oppponent.level
    })
    if isMyTurn then
      gameAnalytics.logEvent("GameEnd" .. tostring(player.roundNumber), {
        roundNumber = player.roundNumber,
        numberOfQuestion = player.questionNumber,
        credits = playerCredit,
        questionLevel = question.level
      })
    end
    player.questionNumber = 0
    powerupLetter:removeEventListener("touch", revealLetterOnHth)
    powerupPass:removeEventListener("touch", passTurn)
    powerupTimer:removeEventListener("touch", addTime)
    SoundUtil.stopHthMusic()
    if waitToEnd == true and (player.roundNumber % 2 == 0 or isMyTurn) then
      networkUtil.updateUserData()
    end
    local canCompete = settingsUtil.getPalyerSettingByKey(settingsUtil.SettingsTable.canCompete)
    local isAllowedCompetition = settingsUtil.getPalyerSettingByKey(settingsUtil.SettingsTable.isAllowedCompetition)
    if competitionManager.isCompetition() and canCompete == "true" and isAllowedCompetition == "true" and isMyTurn == false and waitToEnd == true then
      local deltaScore = tonumber(competitionManager.getCompetition().delta_score)
      if player.roundNumber == 10 then
        deltaScore = deltaScore + (1000000 - player.score)
      else
        deltaScore = deltaScore + oppponent.value
      end
      competitionManager.setDeltaScore(deltaScore)
      networkUtil.updateCompetitionScore(deltaScore)
    end
    isTimesOverSoundIsPlay = false
    isNewTurn = true
    waitToEnd = false
  elseif phase == "did" then
    log:log("hide:did")
    clockGroup:removeSelf()
    upperBoardGroup:removeSelf()
    textAnswer:removeSelf()
    returnFromScreen = ""
  end
end

function scene:destroy(event)
  log:log("destroy")
  local group = self.view
end

scene:addEventListener("create", scene)
scene:addEventListener("show", scene)
scene:addEventListener("hide", scene)
scene:addEventListener("destroy", scene)
return scene
