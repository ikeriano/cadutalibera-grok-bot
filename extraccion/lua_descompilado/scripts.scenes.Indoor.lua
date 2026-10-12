local toast = require("plugin.toast")
local composer = require("composer")
local scene = composer.newScene()
local screenSizeX = display.contentWidth
local screenSizeY = display.contentHeight
local centerX = display.contentWidth * 0.5
local centerY = display.contentHeight * 0.5
local recordedGameUtil = require("scripts.utils.RecordedGameUtil")
local screen1_sheetData = require(assetsManager.sprites.SCREEN_2_SPRITE_HD.spriteMapper)
local screen_sheet = graphics.newImageSheet(assetsManager.sprites.SCREEN_2_SPRITE_HD.sprite, screen1_sheetData.sheet)
local screen_sequenceData = {
  {
    name = "seq1",
    sheet = screen_sheet,
    start = 1,
    count = assetsManager.sprites.SCREEN_2_SPRITE_HD.frames,
    loopCount = 0
  }
}
local ppl_sheetData, ppl_sheet, showModeAutoSelectOpponentTimer, background, boradView, leftOppBoardView, leftTextOppponents, leftTextOppponentsAmount
local boardStatus = 0
local boardTimer, compassPoint, compassPointHalo1, compassPointHalo2
local compassPointIterator = 0
local compassTran, profileHelpBg, profileHelpLable, profileHelpBtn, achievementBtn, statisticsBtn, profileHelpGroup, selectOppBg, selectOppLable, selectOppGroup, selectOppTimer
local livesManager = {}
local powerupsView, playerScoreImage, playerScoreImageR, playerScoreImageL, playerScoreView, creditsImage, creditsImageBg, creditsBox, creditsText
local lastSelected = 0
local infoBtn, infoGroup, body
local boradChange = 0
local homeBtn, emailGroup, touchEvent, angle
local r = 200
local isFacebookShareCredit, competitionGroup, joinCompetitionBtn, competitionScore, competitionScoreLabel, competitionTime, competitionTimeTimer, competitionTimeLabel, termsGroup, termsBg, termsCancelBtn, termsOklBtn, termsToTermsScreen, termsLabel, facebookGroup, facebookBg, facebookCancelBtn, facebookBtn, facebookLabel, touchCanCompete

local function shakeEasing(currentTime, duration, startValue, targetDelta)
  local shakeAmplitude = 12
  local timeFactor = (duration - currentTime) / duration
  local scaledShake = timeFactor * shakeAmplitude + 1
  local randomShake = math.random(scaledShake)
  return startValue + randomShake - scaledShake * 0.5
end

local function comma_value(amount)
  local formatted = amount
  while true do
    formatted, k = string.gsub(formatted, "^(-?%d+)(%d%d%d)", "%1,%2")
    if k == 0 then
      break
    end
  end
  return formatted
end

local function calcRemainingTimeListener()
  local isEnded
  competitionTime.text, isEnded = competitionManager.calcRemainingTime()
  if isEnded and competitionTimeTimer ~= nil then
    timer.cancel(competitionTimeTimer)
  end
end

local function termsListener(event)
  if event.phase == "began" then
    log:log("termsListener")
    if event.target.id == "Terms" then
      local options = {
        effect = "crossFade",
        time = 500,
        params = {
          lastScene = composer.getSceneName("current")
        }
      }
      composer.gotoScene("scripts.scenes.Terms", options)
    elseif event.target.id == "OK" then
      settingsUtil.setPalyerSettingByKey(settingsUtil.SettingsTable.isTerms, "true")
      termsGroup.alpha = 0
      local customeEvent = {}
      customeEvent.phase = "began"
      touchCanCompete(customeEvent)
      if joinCompetitionBtn ~= nil and settingsUtil.getPalyerSettingByKey(settingsUtil.SettingsTable.IsFacebbokActive) == "true" then
        joinCompetitionBtn.alpha = 0
      end
    else
      termsGroup.alpha = 0
    end
  end
end

local function facebookListener(event)
  if event.phase == "began" then
    log:log("facebookListener")
    if event.target.id == "Cancel" then
      facebookGroup.alpha = 0
    elseif event.target.id == "Facebook" then
      local options = {
        effect = "crossFade",
        time = 500,
        params = {
          selected = 2,
          sceneName = "indoor",
          autoFacebookConnect = true
        }
      }
      composer.gotoScene("scripts.scenes.UserSceneController", options)
    end
  end
end

local function buildFacebook(facebookGroup)
  facebookBg = display.newImage(screen_sheet, screen1_sheetData:getFrameIndex("message_3-contest_bg1"), centerX, centerY)
  facebookLabel = display.newImage(screen_sheet, screen1_sheetData:getFrameIndex("message_3-contest_label2"), centerX, centerY)
  facebookCancelBtn = display.newImage(screen_sheet, screen1_sheetData:getFrameIndex("message_3-contest_button_close"), centerX, centerY)
  facebookCancelBtn.id = "Cancel"
  facebookCancelBtn:addEventListener("touch", facebookListener)
  facebookBtn = display.newImage(screen_sheet, screen1_sheetData:getFrameIndex("message_3-contest_button2_facebook"), centerX, centerY)
  facebookBtn.id = "Facebook"
  facebookBtn:addEventListener("touch", facebookListener)
  facebookGroup:insert(facebookBg)
  facebookGroup:insert(facebookLabel)
  facebookGroup:insert(facebookBtn)
  facebookGroup:insert(facebookCancelBtn)
end

local function buildTerms(termsGroup)
  termsBg = display.newImage(screen_sheet, screen1_sheetData:getFrameIndex("message_3-contest_bg1"), centerX, centerY)
  termsLabel = display.newImage(screen_sheet, screen1_sheetData:getFrameIndex("message_3-contest_label1"), centerX, centerY)
  termsCancelBtn = display.newImage(screen_sheet, screen1_sheetData:getFrameIndex("message_3-contest_button_close"), centerX, centerY)
  termsCancelBtn.id = "Cancel"
  termsOklBtn = display.newImage(screen_sheet, screen1_sheetData:getFrameIndex("message_3-contest_button1_join"), centerX, centerY)
  termsOklBtn.id = "OK"
  termsToTermsScreen = display.newImage(screen_sheet, screen1_sheetData:getFrameIndex("message_3-contest_button1_disclaimer"), centerX, centerY)
  termsToTermsScreen.id = "Terms"
  termsOklBtn:addEventListener("touch", termsListener)
  termsCancelBtn:addEventListener("touch", termsListener)
  termsToTermsScreen:addEventListener("touch", termsListener)
  termsGroup:insert(termsBg)
  termsGroup:insert(termsLabel)
  termsGroup:insert(termsCancelBtn)
  termsGroup:insert(termsOklBtn)
  termsGroup:insert(termsToTermsScreen)
end

local function cancelGuideTimmers()
  if selectOppTimer ~= nil then
    timer.cancel(selectOppTimer)
  end
  selectOppGroup.alpha = 0
  profileHelpGroup.alpha = 0
end

local function canCompeteLogic()
  log:log("touchCanCompete")
  settingsUtil.setGameSettingByKey(settingsUtil.SettingsTable.isNewCompetition, "false")
  settingsUtil.setPalyerSettingByKey(settingsUtil.SettingsTable.isAllowedCompetition, "true")
  if settingsUtil.getPalyerSettingByKey(settingsUtil.SettingsTable.isTerms) ~= "true" then
    termsGroup.alpha = 1
    cancelGuideTimmers()
  elseif settingsUtil.getPalyerSettingByKey(settingsUtil.SettingsTable.IsFacebbokActive) ~= "true" then
    facebookGroup.alpha = 1
    cancelGuideTimmers()
  else
    competitionGroup.alpha = 1
    if joinCompetitionBtn ~= nil then
      joinCompetitionBtn.alpha = 0
    end
  end
end

function touchCanCompete(event)
  if event.phase == "began" then
    canCompeteLogic()
  end
end

local function showSelectOppMessage()
  transition.to(selectOppGroup, {time = 500, alpha = 1})
  if selectOppTimer then
    timer.cancel(selectOppTimer)
  end
end

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

local function moveScreenByEvent()
  if touchEvent.target.id == "email" then
    log:sendEmail(emailGroup)
  elseif touchEvent.target.id == "info" then
    gameAnalytics.logEvent("profileInfo", {
      useInfo = "statisticsInfo"
    })
    local options = {}
    options = {
      effect = "crossFade",
      time = 500,
      params = {selected = 2, sceneName = "indoor"}
    }
    composer.gotoScene("scripts.scenes.UserSceneController", options)
  elseif touchEvent.target.id == "statistics" then
    local options = {}
    options = {
      effect = "crossFade",
      time = 500,
      params = {selected = 3, sceneName = "indoor"}
    }
    composer.gotoScene("scripts.scenes.UserSceneController", options)
  elseif touchEvent.target.id == "achievement" then
    local options = {}
    options = {
      effect = "crossFade",
      time = 500,
      params = {selected = 1, sceneName = "indoor"}
    }
    composer.gotoScene("scripts.scenes.UserSceneController", options)
  elseif touchEvent.target.id == "Home" then
    local options = {effect = "crossFade", time = 500}
    recordedGameUtil.pushBackRound()
    composer.gotoScene("scripts.scenes.menu", options)
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

local function removeMe(event)
  if event.target ~= nil then
    event.target:removeSelf()
  end
end

local function showNewCredits(newCredit)
  local frame = screen1_sheetData.sheet.frames[screen1_sheetData:getFrameIndex("diamonds_count_bg")]
  local helpCostsOptions = {
    text = newCredit,
    x = frame.sourceX + frame.width / 2,
    y = frame.sourceY + frame.height / 2,
    fontSize = 27,
    align = "center"
  }
  local helpCosts = display.newText(helpCostsOptions)
  helpCosts.alpha = 0
  helpCosts:setFillColor(1, 1, 1)
  helpCosts.alpha = 1
  SoundUtil.play(SoundUtil.soundsTable.money_total)
  transition.to(helpCosts, {
    y = helpCosts.y - 300,
    alpha = 0,
    time = 2500,
    onComplete = removeMe
  })
end

local function replaceBoardStatus()
  if boardStatus == 0 then
    leftTextOppponentsAmount:setFrame(screen1_sheetData:getFrameIndex("to_million_label_" .. gameUtils.numberOfOppponentsLeft(oppponents)))
    boradView.alpha = 0
    leftOppBoardView.alpha = 1
    boardStatus = 1
    boradChange = 1
  else
    boradView.alpha = 1
    leftOppBoardView.alpha = 0
    boardStatus = 0
    if boradChange == 1 and boardTimer then
      timer.cancel(boardTimer)
    end
  end
end

local function goToH2H()
  composer.gotoScene("scripts.scenes.HeadToHead", "fade", 700)
end

local function selectOpponent(event)
  if event.phase == "began" and event.target ~= lastSelected then
    SoundUtil.play(SoundUtil.soundsTable.Correct_16)
    lastSelected = event.target.id
    oppponentId = lastSelected
    angle = event.target.angle - 180
    log:log("angle", angle)
    transition.to(compassPoint, {time = 300, rotation = angle})
    timer.performWithDelay(500, goToH2H, 1)
  end
end

local function showModeSelectOpponent()
  log:log("showModeSelectOpponent")
  local rival_position = recordedGameUtil.nextRivalPosition()
  local event = {
    name = "touch",
    phase = "began",
    target = oppponents[rival_position].image
  }
  if rival_position ~= nil then
    oppponents[rival_position].image:addEventListener("touch", selectOpponent)
    oppponents[rival_position].image:dispatchEvent(event)
  end
end

local function setUserImage()
  player.image.fill = {
    type = "image",
    baseDir = player.baseDir,
    filename = player.picName
  }
  if gameUtils.isImageRotationAccordingToPlatform() then
    player.image.fill.rotation = 90
  else
    player.image.fill.rotation = 0
  end
end

local function initIndoor(sceneGroup)
  if saveUtil.isSaveGame() == "true" then
    saveUtil.loadGame()
  elseif showMode == true then
    oppponents = gameUtils.initShowOpponents()
  else
    oppponents = gameUtils.initOppponents()
  end
  ppl_sheetData, ppl_sheet = gameUtils.loadPeopleSprite()
  local playerHeadFrame = display.newImage(screen_sheet, screen1_sheetData:getFrameIndex("head_frame"), centerX, screenSizeY * 0.705)
  playerHeadFrame:scale(1.2, 1.2)
  player.image = display.newCircle(centerX, screenSizeY * 0.705, 70)
  player.baseDir, player.picName = gameUtils.getPlayerImage()
  player.gender = gameUtils.getPlayerGender()
  gameUtils.setPlayerBody()
  player.image.fill = {
    type = "image",
    baseDir = player.baseDir,
    filename = player.picName
  }
  setUserImage()
  infoBtn = display.newImage(screen_sheet, screen1_sheetData:getFrameIndex("profile_frame"), centerX, centerY)
  statisticsBtn = display.newImage(screen_sheet, screen1_sheetData:getFrameIndex("statistics_frame"), centerX, centerY)
  achievementBtn = display.newImage(screen_sheet, screen1_sheetData:getFrameIndex("achievment_frame"), centerX, centerY)
  leftTextOppponentsAmount = display.newSprite(screen_sheet, screen_sequenceData)
  leftTextOppponentsAmount:setFrame(screen1_sheetData:getFrameIndex("to_million_label_" .. gameUtils.numberOfOppponentsLeft(oppponents)))
  body = display.newSprite(screen_sheet, screen_sequenceData)
  body.x = centerX
  body.y = centerY
  if player.stageBody == nil then
    if player.gender == "male" then
      body:setFrame(screen1_sheetData:getFrameIndex("player_body1"))
    else
      body:setFrame(screen1_sheetData:getFrameIndex("player_body2"))
    end
  else
    body:setFrame(screen1_sheetData:getFrameIndex(player.stageBody))
  end
  sceneGroup:insert(body)
  sceneGroup:insert(player.image)
  sceneGroup:insert(playerHeadFrame)
  for i = 1, 10 do
    local oppponentPosX = r * math.cos(math.rad(36 * i)) + centerX
    local oppponentPosY = r * math.sin(math.rad(36 * i)) + player.image.y
    oppponents[i].stage = display.newImage(screen_sheet, screen1_sheetData:getFrameIndex("otherman_fell_icon"), oppponentPosX, oppponentPosY)
    oppponents[i].stage.anchorX = 0.5
    oppponents[i].stage.anchorY = 0.5
    oppponents[i].stage.rotation = oppponents[i].angle
    sceneGroup:insert(oppponents[i].stage)
    if oppponents[i].playerStatus == true then
      oppponents[i].image = display.newCircle(oppponentPosX, oppponentPosY, 57.5)
      oppponents[i].image.fill = {
        type = "image",
        sheet = ppl_sheet,
        frame = ppl_sheetData:getFrameIndex(tostring(oppponents[i].imageFile))
      }
      oppponents[i].HeadFrame = display.newImage(screen_sheet, screen1_sheetData:getFrameIndex("head_frame"), oppponentPosX, oppponentPosY)
      oppponents[i].image.anchorX = 0.5
      oppponents[i].image.anchorY = 0.5
      oppponents[i].image.id = i
      oppponents[i].image.angle = oppponents[i].angle
      if showMode ~= true then
        oppponents[i].image:addEventListener("touch", selectOpponent)
      end
      sceneGroup:insert(oppponents[i].image)
      sceneGroup:insert(oppponents[i].HeadFrame)
    end
    oppponents[i].valueImageOff = display.newImage(screen_sheet, screen1_sheetData:getFrameIndex(oppponents[i].valueImageOffFrame), centerX, centerY)
    boradView:insert(oppponents[i].valueImageOff)
    if oppponents[i].playerStatus == true then
      oppponents[i].valueImage = display.newImage(screen_sheet, screen1_sheetData:getFrameIndex(oppponents[i].valueImageFrame), centerX, centerY)
      boradView:insert(oppponents[i].valueImage)
      oppponents[i].valueImageOff.alpha = 0
      oppponents[i].stage.alpha = 0
    end
  end
end

function compassTran()
  compassPointIterator = compassPointIterator + 1
  transition.to(compassPointHalo1, {
    time = 17000,
    rotation = -360 * compassPointIterator,
    onComplete = compassTran,
    tag = "compassPointHalo"
  })
  transition.to(compassPointHalo2, {
    time = 17000,
    rotation = 360 * compassPointIterator,
    tag = "compassPointHalo"
  })
end

local function removeProfileMessage(event)
  if event.phase == "began" then
    transition.to(profileHelpGroup, {time = 500, alpha = 0})
    profileHelpBtn:removeEventListener("touch", removeProfileMessage)
    selectOppTimer = timer.performWithDelay(10000, showSelectOppMessage, 1)
  end
end

function scene:create(event)
  local playerCredit = tonumber(settingsUtil.getPalyerSettingByKey(settingsUtil.SettingsTable.PlayerCredits))
  local initPlayerCredits = tonumber(settingsUtil.getGameSettingByKey(settingsUtil.SettingsTable.InitPlayerCredits))
  if playerCredit < initPlayerCredits and saveUtil.isSaveGame() == "false" and player.roundNumber == 0 then
    settingsUtil.setPalyerSettingByKey(settingsUtil.SettingsTable.PlayerCredits, initPlayerCredits)
  end
  local sceneGroup = self.view
  background = gameUtils.createBgImage(assetsManager.bg.SCREEN_2_BACKGROUND_HD)
  sceneGroup:insert(background)
  creditsBox = display.newImage(screen_sheet, screen1_sheetData:getFrameIndex("diamonds_count_bg"), centerX, centerY)
  local frame = screen1_sheetData.sheet.frames[screen1_sheetData:getFrameIndex("diamonds_count_bg")]
  local creditTextOption = {
    text = "",
    x = frame.sourceX + frame.width / 2,
    y = frame.sourceY + frame.height / 2,
    fontSize = 25,
    align = "center"
  }
  creditsText = display.newText(creditTextOption)
  creditsImageBg = display.newImage(screen_sheet, screen1_sheetData:getFrameIndex("diamonds_bg"), centerX, centerY)
  creditsImage = display.newImage(screen_sheet, screen1_sheetData:getFrameIndex("diamonds_on"), centerX, centerY)
  playerScoreImage = display.newImage(screen_sheet, screen1_sheetData:getFrameIndex("score_middle"), centerX, centerY)
  playerScoreImageR = display.newImage(screen_sheet, screen1_sheetData:getFrameIndex("score_right"), centerX, centerY)
  playerScoreImageL = display.newImage(screen_sheet, screen1_sheetData:getFrameIndex("score_left"), centerX, centerY)
  homeBtn = display.newImage(screen_sheet, screen1_sheetData:getFrameIndex("button_home"), centerX, centerY)
  homeBtn.id = "Home"
  homeBtn:addEventListener("touch", onBtnRelease)
  playerScoreView = display.newGroup()
  playerScoreView:insert(homeBtn)
  playerScoreView:insert(playerScoreImage)
  playerScoreView:insert(playerScoreImageR)
  playerScoreView:insert(playerScoreImageL)
  playerScoreView:insert(creditsBox)
  playerScoreView:insert(creditsText)
  playerScoreView:insert(creditsImageBg)
  playerScoreView:insert(creditsImage)
  local scoreMiddlePos = screen1_sheetData.sheet.frames[screen1_sheetData:getFrameIndex("score_middle")]
  local scoreOptions = {
    text = player.score .. messagesUtil.Messges.SPACE .. messagesUtil.Messges.CURRENCY,
    x = centerX,
    y = scoreMiddlePos.sourceY + scoreMiddlePos.height / 2,
    width = screenSizeX * 0.6,
    fontSize = 32,
    align = "center"
  }
  player.scoreText = display.newText(scoreOptions)
  player.scoreText:setFillColor(255, 255, 0)
  playerScoreView:insert(player.scoreText)
  playerScoreImage.alpha = 1
  playerScoreImageR.alpha = 1
  playerScoreImageL.alpha = 1
  player.scoreText.alpha = 1
  boradView = display.newGroup()
  leftOppBoardView = display.newGroup()
  powerupsView = display.newGroup()
  compassPoint = display.newImage(screen_sheet, screen1_sheetData:getFrameIndex("compass_point"), centerX, screenSizeY * 0.705)
  compassPointHalo1 = display.newImage(screen_sheet, screen1_sheetData:getFrameIndex("compass_point_halo1"), centerX, screenSizeY * 0.705)
  compassPointHalo2 = display.newImage(screen_sheet, screen1_sheetData:getFrameIndex("compass_point_halo2"), centerX, screenSizeY * 0.705)
  sceneGroup:insert(compassPointHalo1)
  sceneGroup:insert(compassPointHalo2)
  sceneGroup:insert(compassPoint)
  initIndoor(sceneGroup)
  player.scoreText.text = player.score .. messagesUtil.Messges.SPACE .. messagesUtil.Messges.CURRENCY
  leftTextOppponents = display.newImage(screen_sheet, screen1_sheetData:getFrameIndex("to_million_label_bg"), centerX, centerY)
  leftTextOppponentsAmount = display.newSprite(screen_sheet, screen_sequenceData)
  leftTextOppponentsAmount:setFrame(screen1_sheetData:getFrameIndex("to_million_label_" .. gameUtils.numberOfOppponentsLeft(oppponents)))
  leftTextOppponentsAmount.y = centerY
  leftTextOppponentsAmount.x = centerX
  infoGroup = display.newGroup()
  infoBtn.id = "info"
  infoBtn:addEventListener("touch", onBtnRelease)
  statisticsBtn.id = "statistics"
  statisticsBtn:addEventListener("touch", onBtnRelease)
  achievementBtn.id = "achievement"
  achievementBtn:addEventListener("touch", onBtnRelease)
  infoGroup:insert(infoBtn)
  infoGroup:insert(achievementBtn)
  infoGroup:insert(statisticsBtn)
  leftOppBoardView:insert(leftTextOppponents)
  leftOppBoardView:insert(leftTextOppponentsAmount)
  boradView.alpha = 1
  leftOppBoardView.alpha = 0
  selectOppGroup = display.newGroup()
  selectOppBg = display.newImage(screen_sheet, screen1_sheetData:getFrameIndex("message_1-choose-opponent_bg"), centerX, centerY)
  selectOppLable = display.newImage(screen_sheet, screen1_sheetData:getFrameIndex("message_1-choose-opponent_label"), centerX, centerY)
  selectOppGroup:insert(selectOppBg)
  selectOppGroup:insert(selectOppLable)
  profileHelpGroup = display.newGroup()
  profileHelpBg = display.newImage(screen_sheet, screen1_sheetData:getFrameIndex("message_2-click-profile_bg"), centerX, centerY)
  profileHelpLable = display.newImage(screen_sheet, screen1_sheetData:getFrameIndex("message_2-click-profile_label"), centerX, centerY)
  profileHelpBtn = display.newImage(screen_sheet, screen1_sheetData:getFrameIndex("message_2-click-profile_button"), centerX, centerY)
  profileHelpGroup:insert(profileHelpBg)
  profileHelpGroup:insert(profileHelpLable)
  profileHelpGroup:insert(profileHelpBtn)
  competitionGroup = display.newGroup()
  termsGroup = display.newGroup()
  facebookGroup = display.newGroup()
  local competitionOptionsPos = screen1_sheetData.sheet.frames[screen1_sheetData:getFrameIndex("label_total_amnt")]
  local competitionScoreOptions = {
    text = "",
    x = competitionOptionsPos.sourceX - competitionOptionsPos.width / 2 - 50,
    y = competitionOptionsPos.sourceY + competitionOptionsPos.height / 2,
    fontSize = 20,
    witdh = 250,
    align = "center"
  }
  competitionScore = display.newText(competitionScoreOptions)
  competitionGroup:insert(competitionScore)
  competitionScoreLabel = display.newImage(screen_sheet, screen1_sheetData:getFrameIndex("label_total_amnt"), centerX, centerY)
  competitionGroup:insert(competitionScoreLabel)
  competitionOptionsPos = screen1_sheetData.sheet.frames[screen1_sheetData:getFrameIndex("label_time_to_end")]
  local competitionTimeOptions = {
    text = "",
    x = competitionOptionsPos.sourceX - competitionOptionsPos.width / 2 - 10,
    y = competitionOptionsPos.sourceY + competitionOptionsPos.height / 2,
    fontSize = 20,
    align = "right"
  }
  competitionTime = display.newText(competitionTimeOptions)
  competitionGroup:insert(competitionTime)
  competitionTimeLabel = display.newImage(screen_sheet, screen1_sheetData:getFrameIndex("label_time_to_end"), centerX, centerY)
  competitionGroup:insert(competitionTimeLabel)
  competitionGroup.alpha = 0
  sceneGroup:insert(competitionGroup)
  buildTerms(termsGroup)
  buildFacebook(facebookGroup)
  termsGroup.alpha = 0
  facebookGroup.alpha = 0
  sceneGroup:insert(leftOppBoardView)
  sceneGroup:insert(boradView)
  sceneGroup:insert(playerScoreView)
  sceneGroup:insert(powerupsView)
  sceneGroup:insert(infoGroup)
  sceneGroup:insert(selectOppGroup)
  sceneGroup:insert(profileHelpGroup)
end

function scene:show(event)
  local group = self.view
  local phase = event.phase
  if phase == "will" then
    networkUtil.getQuestions(50)
    SoundUtil.play(SoundUtil.soundsTable.introSound)
    local canCompete = settingsUtil.getPalyerSettingByKey(settingsUtil.SettingsTable.canCompete)
    local isAllowedCompetition = settingsUtil.getPalyerSettingByKey(settingsUtil.SettingsTable.isAllowedCompetition)
    local isCompetition = competitionManager.isCompetition()
    log:log("isCompetition", isCompetition, "isAllowedCompetition", isAllowedCompetition, "canCompete", canCompete)
    if isCompetition and canCompete == "true" and isAllowedCompetition == "true" then
      competitionGroup.alpha = 1
      if joinCompetitionBtn ~= nil then
        joinCompetitionBtn.alpha = 0
      end
    elseif (canCompete == "false" or isAllowedCompetition == "false") and isCompetition then
      joinCompetitionBtn = display.newImage(screen_sheet, screen1_sheetData:getFrameIndex("button_join_contest"), centerX, centerY)
      joinCompetitionBtn:addEventListener("touch", touchCanCompete)
      group:insert(joinCompetitionBtn)
      competitionGroup.alpha = 0
    end
    group:insert(termsGroup)
    group:insert(facebookGroup)
    local competition = competitionManager.getCompetition()
    if competition ~= nil then
      competitionScore.text = comma_value(competition.score + competition.delta_score)
      competitionTime.text = competitionManager.calcRemainingTime()
      competitionTimeTimer = timer.performWithDelay(1000, calcRemainingTimeListener, -1)
    end
    transition.cancel("compassPointHalo")
    compassTran()
    profileHelpGroup.alpha = 0
    selectOppGroup.alpha = 0
    player.name = gameUtils.getPlayerName()
    local group = self.view
    player.gender = gameUtils.getPlayerGender()
    if player.stageBody == nil then
      if player.gender == "male" then
        body:setFrame(screen1_sheetData:getFrameIndex("player_body1"))
      else
        body:setFrame(screen1_sheetData:getFrameIndex("player_body2"))
      end
    else
      body:setFrame(screen1_sheetData:getFrameIndex(player.stageBody))
    end
    adsUtil.loadAd()
    emailGroup = group
    lastSelected = 0
    boardStatus = 1
    leftTextOppponentsAmount:setFrame(screen1_sheetData:getFrameIndex("to_million_label_" .. gameUtils.numberOfOppponentsLeft(oppponents)))
    boardTimer = timer.performWithDelay(2500, replaceBoardStatus, -1)
    creditsText.text = settingsUtil.getPalyerSettingByKey(settingsUtil.SettingsTable.PlayerCredits)
  elseif phase == "did" then
    composer.removeScene("scripts.scenes.HeadToHead")
    composer.removeScene("scripts.scenes.DropScene")
    composer.removeScene("scripts.scenes.EndScene")
    composer.removeScene("scripts.scenes.Terms")
    local isAddDiamonds
    if event.params == nil then
      isAddDiamonds = "false"
    else
      isAddDiamonds = event.params.isAddDiamonds or "false"
    end
    if 0 < player.roundNumber and (isAddDiamonds == "true" or saveUtil.isAddCreditForSaveGame() == "true") then
      saveUtil.setAddCreditForSaveGame("false")
      local playerCredit = tonumber(settingsUtil.getPalyerSettingByKey(settingsUtil.SettingsTable.PlayerCredits))
      local creditsFactor = tonumber(settingsUtil.getGameSettingByKey(settingsUtil.SettingsTable.CreditsFactor))
      local firstRoundCredit = tonumber(settingsUtil.getGameSettingByKey(settingsUtil.SettingsTable.FirstRoundCredit))
      local newCredit = creditsFactor * player.roundNumber + firstRoundCredit
      playerCredit = playerCredit + newCredit
      settingsUtil.setPalyerSettingByKey(settingsUtil.SettingsTable.PlayerCredits, playerCredit)
      showNewCredits(newCredit)
    end
    if isAddDiamonds == "true" or player.roundNumber == 0 then
      player.roundNumber = player.roundNumber + 1
    end
    if settingsUtil.getPalyerSettingByKey(settingsUtil.SettingsTable.isProfileHelp) == "true" and player.roundNumber == 3 then
      transition.to(profileHelpGroup, {alpha = 1, time = 500})
      profileHelpBtn:addEventListener("touch", removeProfileMessage)
    elseif player.roundNumber == 1 then
      selectOppTimer = timer.performWithDelay(45000, showSelectOppMessage, 1)
    end
    isFacebookShareCredit = settingsUtil.getPalyerSettingByKey(settingsUtil.SettingsTable.isFacebookShare)
    if isFacebookShareCredit == "true" then
      local playerCredit = tonumber(settingsUtil.getPalyerSettingByKey(settingsUtil.SettingsTable.PlayerCredits))
      local facebookShareCredit = tonumber(settingsUtil.getGameSettingByKey(settingsUtil.SettingsTable.facebookShareCredite))
      playerCredit = playerCredit + facebookShareCredit
      settingsUtil.setPalyerSettingByKey(settingsUtil.SettingsTable.PlayerCredits, playerCredit)
      showNewCredits(facebookShareCredit)
      settingsUtil.setPalyerSettingByKey(settingsUtil.SettingsTable.isFacebookShare, "false")
    end
    local playerAchievementsCredit = tonumber(settingsUtil.getPalyerSettingByKey(settingsUtil.SettingsTable.playerAchievementsCredit))
    if 0 < playerAchievementsCredit then
      local playerCredit = tonumber(settingsUtil.getPalyerSettingByKey(settingsUtil.SettingsTable.PlayerCredits))
      playerCredit = playerCredit + playerAchievementsCredit
      settingsUtil.setPalyerSettingByKey(settingsUtil.SettingsTable.PlayerCredits, playerCredit)
      showNewCredits(playerAchievementsCredit)
      settingsUtil.setPalyerSettingByKey(settingsUtil.SettingsTable.playerAchievementsCredit, 0)
    end
    if achievementsManager.checkForAchievements() then
      log:log("achievement in achievement page")
      toast.show(messagesUtil.Messges.DIAMONDS_MESSAGE, {duration = "long", gravity = "Center"})
    end
    creditsText.text = settingsUtil.getPalyerSettingByKey(settingsUtil.SettingsTable.PlayerCredits)
    saveUtil.saveGame()
    if event.params ~= nil and event.params.status == "CheckCompetition" then
      local customeEvent = {}
      customeEvent.phase = "began"
      touchCanCompete(customeEvent)
    end
    
    local function shakeIt()
      if joinCompetitionBtn then
        transition.to(joinCompetitionBtn, {
          time = 350,
          x = joinCompetitionBtn.x,
          y = joinCompetitionBtn.y,
          transition = shakeEasing
        })
      end
    end
    
    timer.performWithDelay(1000, shakeIt, 1)
    if showMode then
      recordedGameUtil.nextRoundAndQuestions()
      showModeAutoSelectOpponentTimer = timer.performWithDelay(2700, showModeSelectOpponent, 1)
      if selectOppTimer then
        timer.cancel(selectOppTimer)
      end
    end
    local canCompete = settingsUtil.getPalyerSettingByKey(settingsUtil.SettingsTable.canCompete)
    local gamesPlayed = tonumber(settingsUtil.getPalyerSettingByKey(settingsUtil.SettingsTable.GamesPlayed))
    local isCompetition = competitionManager.isCompetition()
    local isNewCompetition = settingsUtil.getGameSettingByKey(settingsUtil.SettingsTable.isNewCompetition)
    local isAllowedCompetition = settingsUtil.getPalyerSettingByKey(settingsUtil.SettingsTable.isAllowedCompetition)
    if showMode ~= true and isNewCompetition == "true" and isCompetition and (canCompete ~= "true" or isAllowedCompetition == "false") and 1 < gamesPlayed then
      log:log("showMode", showMode, "isNewCompetition", isNewCompetition, "isCompetition", isCompetition, "canCompete", canCompete, "isAllowedCompetition", isAllowedCompetition, "gamesPlayed", gamesPlayed)
      canCompeteLogic()
    end
  end
end

function scene:hide(event)
  local group = self.view
  local phase = event.phase
  if phase == "will" then
    if boardTimer then
      timer.cancel(boardTimer)
    end
    if selectOppTimer then
      timer.cancel(selectOppTimer)
    end
    if competitionTimeTimer ~= nil then
      timer.cancel(competitionTimeTimer)
    end
    if showModeAutoSelectOpponentTimer ~= nil then
      timer.cancel(showModeAutoSelectOpponentTimer)
    end
    boradChange = 0
  elseif phase == "did" then
    selectOppGroup.alpha = 0
    profileHelpGroup.alpha = 0
    transition.cancel("compassPointHalo")
  end
end

function scene:destroy(event)
  log:log("indoor destroy")
  local group = self.view
  homeBtn:removeEventListener("touch", onBtnRelease)
  infoBtn:removeEventListener("touch", onBtnRelease)
  statisticsBtn:removeEventListener("touch", onBtnRelease)
  achievementBtn:removeEventListener("touch", onBtnRelease)
  termsOklBtn:removeEventListener("touch", termsListener)
  termsCancelBtn:removeEventListener("touch", termsListener)
  termsToTermsScreen:removeEventListener("touch", termsListener)
  facebookCancelBtn:removeEventListener("touch", facebookListener)
  facebookBtn:removeEventListener("touch", facebookListener)
  if joinCompetitionBtn then
    joinCompetitionBtn:removeEventListener("touch", touchCanCompete)
  end
end

scene:addEventListener("create", scene)
scene:addEventListener("show", scene)
scene:addEventListener("hide", scene)
scene:addEventListener("destroy", scene)
return scene
