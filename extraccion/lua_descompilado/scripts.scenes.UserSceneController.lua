local composer = require("composer")
local widget = require("widget")
local scene = composer.newScene()
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
local loading_sheetData = require(assetsManager.sprites.LOADING_SPRITE_HD.spriteMapper)
local loading_sheet = graphics.newImageSheet(assetsManager.sprites.LOADING_SPRITE_HD.sprite, loading_sheetData.sheet)
local loading_sequenceData = {
  {
    name = "loading",
    sheet = loading_sheet,
    start = 2,
    count = 9,
    loopCount = 500,
    time = 1500
  }
}
local loadingSprint, loadingMessage, loadingGroup, sceneName, selectorGroup, achievementBtn, profileBtn, statisticBtn, statisticImage, statisticGamePlayed, statisticRoundsWins, statisticSport, statisticGeneral, statisticEntertainment, statisticHistory, statisticGeography, statisticScience, achievementLabel, achievementImage1, achievementImage3, achievementImage4, achievementImage5, achievementGroup, profileGroup, statisticGroup, radioBtnGroup, frameImage, closeBtn
local inMethod = 0
local pollingCounter = 1
local imageType, facebookBtn, facebookCameraBtn, cameraBtn, mainHeadPicFrame, mainHeadPicMan, mainHeadPicWoman, nameLabel, nameTextArea, textFieldName, genderTypeLabel, manRadioBtn, womanRadioBtn, gender, newImageName, customImageCircle, facebookConnectTimmer, facebookUpdateImageTimmer, nameTextPlaceholder
local fontName = native.systemFontBold
local fontSize = 20
local genderOffset = 50
local headImageGroup
local timerWaitTime = 500

local function setStatistic()
  log:log("setStatistic")
  local statistics = persistenceUtil.getStatistic()
  statisticGamePlayed.text = settingsUtil.getPalyerSettingByKey(settingsUtil.SettingsTable.GamesPlayed)
  statisticRoundsWins.text = settingsUtil.getPalyerSettingByKey(settingsUtil.SettingsTable.RoundsWins)
  statisticSport.text = statistics[persistenceUtil.categories.sport].percentage
  statisticGeneral.text = statistics[persistenceUtil.categories.general].percentage
  statisticEntertainment.text = statistics[persistenceUtil.categories.entertainment].percentage
  statisticHistory.text = statistics[persistenceUtil.categories.history].percentage
  statisticGeography.text = statistics[persistenceUtil.categories.geography].percentage
  statisticScience.text = statistics[persistenceUtil.categories.science].percentage
end

local function reloadGame(event)
  composer.removeScene("scripts.scenes.HeadToHead")
  composer.removeScene("scripts.scenes.DropScene")
  composer.removeScene("scripts.scenes.EndScene")
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

local function backToMenu(event)
  if event.phase == "began" then
    if sceneName == "menu" then
      composer.gotoScene("scripts.scenes.menu", "fade", 500)
    else
      local options = {
        effect = "fade",
        time = 500,
        params = {isAddDiamonds = "false"}
      }
      composer.gotoScene("scripts.scenes.Indoor", options)
    end
  end
end

local function onFieldEvent(event)
  if "began" == event.phase then
    native.setKeyboardFocus(event.target)
  end
end

local function removeTextFields()
  if textFieldName ~= nil then
    if textFieldName.text ~= "\215\169\215\158\215\154" then
      settingsUtil.setPalyerSettingByKey(settingsUtil.SettingsTable.PlayerName, textFieldName.text)
    end
    textFieldName:removeEventListener("userInput", onFieldEvent)
    native.setKeyboardFocus(nil)
    textFieldName:removeSelf()
    textFieldName = nil
  end
end

local function createTextFields()
  if textFieldName == nil then
    local frame = screen_sheetData.sheet.frames[screen_sheetData:getFrameIndex("manage_textbox_name_full")]
    textFieldName = native.newTextField(centerX, frame.sourceY + frame.height / 2, frame.width, frame.height)
    local name = settingsUtil.getPalyerSettingByKey(settingsUtil.SettingsTable.PlayerName)
    if name == "\215\170\215\149\215\168\215\154" or name == "" then
      textFieldName.text = "\215\169\215\158\215\154"
    else
      textFieldName.text = name
    end
    textFieldName.hasBackground = false
    textFieldName.align = "center"
    textFieldName:setTextColor(0.8, 0.8, 0.8)
    textFieldName.font = native.newFont(fontName, fontSize)
    profileGroup:insert(textFieldName)
  end
end

local function setGenderState()
  gender = settingsUtil.getPalyerSettingByKey(settingsUtil.SettingsTable.GenderType)
  if settingsUtil.getPalyerSettingByKey(settingsUtil.SettingsTable.CustomImage) == "false" then
    if gender == "male" then
      mainHeadPicMan.alpha = 1
      mainHeadPicWoman.alpha = 0
    else
      mainHeadPicMan.alpha = 0
      mainHeadPicWoman.alpha = 1
    end
  else
    mainHeadPicMan.alpha = 0
    mainHeadPicWoman.alpha = 0
    customImageCircle.alpha = 1
  end
end

local function onSwitchPress(event)
  if event.target.id == "male" then
    settingsUtil.setPalyerSettingByKey(settingsUtil.SettingsTable.GenderType, "male")
  else
    settingsUtil.setPalyerSettingByKey(settingsUtil.SettingsTable.GenderType, "female")
  end
  reloadGame()
  setGenderState()
end

local function isActive(genderToActive)
  gender = settingsUtil.getPalyerSettingByKey(settingsUtil.SettingsTable.GenderType)
  if genderToActive == gender then
    return true
  else
    return false
  end
end

local function setSelected(selected)
  if selected == 1 then
    achievementGroup.alpha = 1
    profileGroup.alpha = 0
    statisticGroup.alpha = 0
    achievementBtn:setFrame(screen_sheetData:getFrameIndex("manage_location_achievment_on"))
    profileBtn:setFrame(screen_sheetData:getFrameIndex("manage_location_profile_off"))
    statisticBtn:setFrame(screen_sheetData:getFrameIndex("manage_location_statistic_off"))
    removeTextFields()
  elseif selected == 2 then
    achievementGroup.alpha = 0
    profileGroup.alpha = 1
    statisticGroup.alpha = 0
    achievementBtn:setFrame(screen_sheetData:getFrameIndex("manage_location_achievment_off"))
    profileBtn:setFrame(screen_sheetData:getFrameIndex("manage_location_profile_on"))
    statisticBtn:setFrame(screen_sheetData:getFrameIndex("manage_location_statistic_off"))
    timer.performWithDelay(250, createTextFields, 1)
  else
    achievementGroup.alpha = 0
    profileGroup.alpha = 0
    statisticGroup.alpha = 1
    achievementBtn:setFrame(screen_sheetData:getFrameIndex("manage_location_achievment_off"))
    profileBtn:setFrame(screen_sheetData:getFrameIndex("manage_location_profile_off"))
    statisticBtn:setFrame(screen_sheetData:getFrameIndex("manage_location_statistic_on"))
    removeTextFields()
  end
end

local function changeTab(event)
  if event.phase == "ended" then
    setSelected(event.target.id)
  end
end

local function cleanPolling()
  if pollingCounter == 20 then
    inMethod = 0
    pollingCounter = 1
    loadingSprint:pause()
    loadingGroup.alpha = 0
    if facebookConnectTimmer ~= nil then
      timer.cancel(facebookConnectTimmer)
    end
    if facebookUpdateImageTimmer ~= nil then
      timer.cancel(facebookUpdateImageTimmer)
    end
  else
    pollingCounter = pollingCounter + 1
  end
end

local function setNewImage()
  log:log("setNewImage")
  reloadGame()
  mainHeadPicMan.alpha = 0
  mainHeadPicWoman.alpha = 0
  log:log("imageType ", imageType)
  settingsUtil.setPalyerSettingByKey(settingsUtil.SettingsTable.imageType, imageType)
  customImageCircle.fill = {
    type = "image",
    baseDir = system.DocumentsDirectory,
    filename = settingsUtil.getPalyerSettingByKey(settingsUtil.SettingsTable.LastImageName)
  }
  if gameUtils.isImageRotationAccordingToPlatform() then
    customImageCircle.fill.rotation = 90
  else
    customImageCircle.fill.rotation = 0
  end
  customImageCircle.alpha = 1
  loadingSprint:pause()
  loadingGroup.alpha = 0
  inMethod = 0
  if facebookConnectTimmer ~= nil then
    timer.cancel(facebookConnectTimmer)
  end
  if facebookUpdateImageTimmer ~= nil then
    timer.cancel(facebookUpdateImageTimmer)
  end
end

local function facebookPolling()
  log:log("enter facebookPolling")
  if settingsUtil.getPalyerSettingByKey(settingsUtil.SettingsTable.CustomImage) == "true" then
    log:log("facebookPolling CustomImage true")
    returnFromScreen = ""
    imageType = "facebook"
    timer.performWithDelay(timerWaitTime, setNewImage, 1)
    if textFieldName ~= nil then
      textFieldName.text = settingsUtil.getPalyerSettingByKey(settingsUtil.SettingsTable.PlayerName)
      local gender = settingsUtil.getPalyerSettingByKey(settingsUtil.SettingsTable.GenderType)
      if gender == "male" and manRadioBtn.isOn == false then
        manRadioBtn:setState({isOn = true})
        womanRadioBtn:setState({isOn = false})
      elseif gender ~= "male" and womanRadioBtn.isOn == false then
        manRadioBtn:setState({isOn = false})
        womanRadioBtn:setState({isOn = true})
      end
    end
    if facebookConnectTimmer ~= nil then
      timer.cancel(facebookConnectTimmer)
    end
    timer.performWithDelay(2000, setStatistic, 1)
  end
  cleanPolling()
end

local function connectToFacebook()
  inMethod = 1
  returnFromScreen = freePass.Facebook
  log:log("Connect To Facebook")
  gameAnalytics.logEvent("Connect_To_Facebook")
  facebookUtils.getUserData(true)
  facebookConnectTimmer = timer.performWithDelay(350, facebookPolling, 20)
  loadingSprint:play()
  loadingGroup.alpha = 1
end

local function connectToFacebookListner(event)
  if event.phase == "began" and inMethod == 0 then
    connectToFacebook()
  end
end

local function removeKeyboard(event)
  if event.phase == "began" then
    log:log("removeKeyboard")
    native.setKeyboardFocus(nil)
  end
end

local function updateFacebookImagePolling()
  if settingsUtil.getPalyerSettingByKey(settingsUtil.SettingsTable.UpdateFacebookImage) == "true" then
    log:log("updateFacebookImagePolling UpdateFacebookImage true")
    imageType = "facebook"
    timer.performWithDelay(timerWaitTime, setNewImage, 1)
    if facebookUpdateImageTimmer ~= nil then
      timer.cancel(facebookUpdateImageTimmer)
      returnFromScreen = ""
    end
  end
  cleanPolling()
end

local function updateFacebookImage(event)
  if event.phase == "began" and inMethod == 0 then
    inMethod = 1
    setAlphaOnPowerUpEvents(event)
    log:log("update facebook image")
    loadingSprint:play()
    loadingGroup.alpha = 1
    local facebookId = settingsUtil.getPalyerSettingByKey(settingsUtil.SettingsTable.FacebbokId)
    log:log("facebookId - " .. facebookId)
    if facebookId ~= nil and facebookId ~= "" then
      settingsUtil.setPalyerSettingByKey(settingsUtil.SettingsTable.UpdateFacebookImage, "false")
      facebookUtils.updateImage()
      facebookUpdateImageTimmer = timer.performWithDelay(350, updateFacebookImagePolling, 20)
    else
      log:log("Connect To Facebook")
      settingsUtil.setPalyerSettingByKey(settingsUtil.SettingsTable.UpdateFacebookImage, "false")
      gameAnalytics.logEvent("Connect_To_Facebook")
      facebookUtils.getUserData(true)
      facebookConnectTimmer = timer.performWithDelay(350, facebookPolling, 20)
    end
  end
end

local function onCapturePhotoComplete(event)
  log:log("onCapturePhotoComplete", event.completed)
  if event.completed == true then
    local oldImageFile = settingsUtil.getPalyerSettingByKey(settingsUtil.SettingsTable.LastImageName)
    if oldImageFile ~= nil and oldImageFile ~= "" then
      os.remove(system.pathForFile(oldImageFile, system.DocumentsDirectory))
    end
    settingsUtil.setPalyerSettingByKey(settingsUtil.SettingsTable.CustomImage, "true")
    settingsUtil.setPalyerSettingByKey(settingsUtil.SettingsTable.LastImageName, newImageName)
    imageType = "camera"
    timer.performWithDelay(timerWaitTime, setNewImage, 1)
    returnFromScreen = ""
  else
    loadingGroup.alpha = 0
  end
end

local function cameraImage(event)
  if event.phase == "began" then
    log:log("cameraImage")
    newImageName = "customImage_" .. tostring(os.time()) .. ".png"
    timer.performWithDelay(150, media.selectPhoto({
      listener = onCapturePhotoComplete,
      mediaSource = media.PhotoLibrary,
      destination = {
        baseDir = system.DocumentsDirectory,
        filename = newImageName,
        type = "image"
      }
    }))
    returnFromScreen = freePass.Facebook
    loadingSprint:play()
    loadingGroup.alpha = 1
  end
end

local function removeMe(event)
  if event.target ~= nil then
    event.target:removeSelf()
  end
end

local function showNewCredits(target, newCredit)
  local frame = screen_sheetData.sheet.frames[target.frame]
  local helpCostsOptions = {
    text = newCredit,
    x = frame.sourceX + frame.width / 2 - 150,
    y = frame.sourceY + frame.height / 2,
    fontSize = 27,
    align = "center"
  }
  local helpCosts = display.newText(helpCostsOptions)
  helpCosts.alpha = 0
  helpCosts:setFillColor(1, 1, 1)
  helpCosts.alpha = 1
  transition.to(helpCosts, {
    y = helpCosts.y - 300,
    alpha = 0,
    time = 2500,
    onComplete = removeMe
  })
end

local function onAchievementsTouchEvent(event)
  if event.phase == "began" then
    local name = event.target.name
    if achievementsManager.getAchievementStatusByName(name) then
      SoundUtil.play(SoundUtil.soundsTable.Correct_5)
      local info = achievementsManager.getAchievementInfoByName(name)
      local playerAchievementsCredit = tonumber(settingsUtil.getPalyerSettingByKey(settingsUtil.SettingsTable.playerAchievementsCredit))
      playerAchievementsCredit = playerAchievementsCredit + info.diamondCredit
      settingsUtil.setPalyerSettingByKey(settingsUtil.SettingsTable.playerAchievementsCredit, playerAchievementsCredit)
      achievementsManager.resetAchievementByName(name)
      showNewCredits(event.target, info.diamondCredit)
      event.target:setFrame(screen_sheetData:getFrameIndex(achievementsManager.setFrameByName(name)))
    end
  end
end

function scene:create(event)
  local group = self.view
  local background = gameUtils.createBgImage(assetsManager.bg.SCREEN_1_BACKGROUND_HD)
  group:insert(background)
  if settingsUtil.getPalyerSettingByKey(settingsUtil.SettingsTable.isProfileHelp) == "true" then
    settingsUtil.setPalyerSettingByKey(settingsUtil.SettingsTable.isProfileHelp, "false")
  end
  achievementGroup = display.newGroup()
  statisticGroup = display.newGroup()
  profileGroup = display.newGroup()
  headImageGroup = display.newGroup()
  loadingGroup = display.newGroup()
  selectorGroup = display.newGroup()
  achievementBtn = display.newSprite(screen_sheet, screen_sequenceData)
  achievementBtn.x = centerX
  achievementBtn.y = centerY
  achievementBtn.id = 1
  profileBtn = display.newSprite(screen_sheet, screen_sequenceData)
  profileBtn.x = centerX
  profileBtn.y = centerY
  profileBtn.id = 2
  statisticBtn = display.newSprite(screen_sheet, screen_sequenceData)
  statisticBtn.x = centerX
  statisticBtn.y = centerY
  statisticBtn.id = 3
  frameImage = display.newImage(screen_sheet, screen_sheetData:getFrameIndex("manage_frame"), centerX, centerY)
  closeBtn = display.newImage(screen_sheet, screen_sheetData:getFrameIndex("manage_button_close"), centerX, centerY)
  selectorGroup:insert(frameImage)
  selectorGroup:insert(closeBtn)
  selectorGroup:insert(profileBtn)
  selectorGroup:insert(achievementBtn)
  selectorGroup:insert(statisticBtn)
  local textOptions = {
    text = "",
    x = -100,
    y = -200,
    font = native.systemFontBold,
    fontSize = 30,
    align = "center"
  }
  statisticImage = display.newImage(screen_sheet, screen_sheetData:getFrameIndex("statistics_label"), centerX, centerY)
  statisticGamePlayed = display.newText(textOptions)
  statisticGamePlayed.x = 400
  statisticGamePlayed.y = 330
  statisticRoundsWins = display.newText(textOptions)
  statisticRoundsWins.x = 140
  statisticRoundsWins.y = 330
  statisticSport = display.newText(textOptions)
  statisticSport.x = 110
  statisticSport.y = 520
  statisticScience = display.newText(textOptions)
  statisticScience.x = 270
  statisticScience.y = 520
  statisticGeneral = display.newText(textOptions)
  statisticGeneral.x = 430
  statisticGeneral.y = 520
  statisticGeography = display.newText(textOptions)
  statisticGeography.x = 110
  statisticGeography.y = 750
  statisticEntertainment = display.newText(textOptions)
  statisticEntertainment.x = 270
  statisticEntertainment.y = 750
  statisticHistory = display.newText(textOptions)
  statisticHistory.x = 430
  statisticHistory.y = 750
  statisticGroup:insert(statisticImage)
  statisticGroup:insert(statisticGamePlayed)
  statisticGroup:insert(statisticRoundsWins)
  statisticGroup:insert(statisticSport)
  statisticGroup:insert(statisticEntertainment)
  statisticGroup:insert(statisticHistory)
  statisticGroup:insert(statisticGeography)
  statisticGroup:insert(statisticScience)
  statisticGroup:insert(statisticGeneral)
  facebookBtn = display.newImage(screen_sheet, screen_sheetData:getFrameIndex("manage_button_facebook_connect"), centerX, centerY)
  profileGroup:insert(facebookBtn)
  mainHeadPicMan = display.newImage(screen_sheet, screen_sheetData:getFrameIndex("avatar_man"), centerX, centerY)
  mainHeadPicMan.alpha = 0
  mainHeadPicWoman = display.newImage(screen_sheet, screen_sheetData:getFrameIndex("avatar_woman"), centerX, centerY)
  mainHeadPicWoman.alpha = 0
  headImageGroup:insert(mainHeadPicMan)
  headImageGroup:insert(mainHeadPicWoman)
  local circleFrame = screen_sheetData.sheet.frames[screen_sheetData:getFrameIndex("avatar_woman")]
  customImageCircle = display.newCircle(circleFrame.sourceX + 78, circleFrame.sourceY + 85, 77)
  local fileName = settingsUtil.getPalyerSettingByKey(settingsUtil.SettingsTable.LastImageName)
  customImageCircle.fill = {
    type = "image",
    baseDir = system.DocumentsDirectory,
    filename = fileName
  }
  if gameUtils.isImageRotationAccordingToPlatform() then
    customImageCircle.fill.rotation = 90
  else
    customImageCircle.fill.rotation = 0
  end
  customImageCircle.alpha = 0
  headImageGroup:insert(customImageCircle)
  nameLabel = display.newImage(screen_sheet, screen_sheetData:getFrameIndex("manage_label_name"), centerX, centerY)
  nameTextArea = display.newImage(screen_sheet, screen_sheetData:getFrameIndex("manage_textbox_name_full"), centerX, centerY)
  mainHeadPicFrame = display.newImage(screen_sheet, screen_sheetData:getFrameIndex("manage_avatar_frame"), centerX, centerY - 10)
  facebookCameraBtn = display.newImage(screen_sheet, screen_sheetData:getFrameIndex("manage_button_camera_fb-update"), centerX, centerY)
  cameraBtn = display.newImage(screen_sheet, screen_sheetData:getFrameIndex("manage_button_camera"), centerX, centerY)
  genderTypeLabel = display.newImage(screen_sheet, screen_sheetData:getFrameIndex("manage_label_gender"), centerX - genderOffset + 40, centerY)
  local frame2 = screen_sheetData.sheet.frames[screen_sheetData:getFrameIndex("manage_label_gender")]
  radioBtnGroup = display.newGroup()
  womanRadioBtn = widget.newSwitch({
    x = frame2.sourceX - genderOffset / 2 + 40,
    y = frame2.sourceY + 100,
    style = "radio",
    id = "female",
    initialSwitchState = isActive("female"),
    onPress = onSwitchPress,
    sheet = screen_sheet,
    frameOff = screen_sheetData:getFrameIndex("manage_button_gender_woman_off"),
    frameOn = screen_sheetData:getFrameIndex("manage_button_gender_woman_on")
  })
  womanRadioBtn:scale(3.5, 3.5)
  manRadioBtn = widget.newSwitch({
    x = frame2.sourceX - genderOffset / 2 + 190,
    y = frame2.sourceY + 100,
    style = "radio",
    id = "male",
    initialSwitchState = isActive("male"),
    onPress = onSwitchPress,
    sheet = screen_sheet,
    frameOff = screen_sheetData:getFrameIndex("manage_button_gender_man_off"),
    frameOn = screen_sheetData:getFrameIndex("manage_button_gender_man_on")
  })
  manRadioBtn:scale(3.5, 3.5)
  local placeholderOption = {
    text = "Il tuo nome",
    x = centerX,
    y = nameTextArea.y - 30,
    fontSize = 20,
    align = "center"
  }
  nameTextPlaceholder = display.newText(placeholderOption)
  nameTextPlaceholder.alpha = 0
  radioBtnGroup:insert(womanRadioBtn)
  radioBtnGroup:insert(manRadioBtn)
  profileGroup:insert(radioBtnGroup)
  profileGroup:insert(genderTypeLabel)
  headImageGroup:insert(mainHeadPicFrame)
  profileGroup:insert(nameLabel)
  profileGroup:insert(nameTextArea)
  profileGroup:insert(facebookCameraBtn)
  profileGroup:insert(cameraBtn)
  setGenderState()
  loadingMessage = display.newImage(loading_sheet, loading_sheetData:getFrameIndex("Loading2_background"), centerX, centerY - 150)
  loadingSprint = display.newSprite(loading_sheet, loading_sequenceData)
  loadingSprint:setFrame(loading_sheetData:getFrameIndex("Loading1_image1"))
  loadingSprint.x = centerX
  loadingSprint.y = centerY - 150
  loadingSprint:setSequence("loading")
  loadingGroup:insert(loadingMessage)
  loadingGroup:insert(loadingSprint)
  loadingGroup.alpha = 0
  group:insert(selectorGroup)
  group:insert(achievementGroup)
  group:insert(statisticGroup)
  group:insert(profileGroup)
  group:insert(headImageGroup)
  group:insert(loadingGroup)
end

function scene:show(event)
  log:log("UserSceneController enterScene")
  local group = self.view
  local phase = event.phase
  if phase == "will" then
    local group = self.view
    composer.removeScene("scripts.scenes.Indoor")
    achievementLabel = display.newImage(screen_sheet, screen_sheetData:getFrameIndex("achievemen_label"), centerX, centerY)
    achievementGroup:insert(achievementLabel)
    achievementImage1 = display.newSprite(screen_sheet, screen_sequenceData)
    achievementImage1.x = centerX
    achievementImage1.y = centerY
    achievementImage1.name = "win_50_opponents"
    achievementImage1:setFrame(screen_sheetData:getFrameIndex(achievementsManager.setFrameByName(achievementImage1.name)))
    achievementGroup:insert(achievementImage1)
    achievementImage3 = display.newSprite(screen_sheet, screen_sequenceData)
    achievementImage3.x = centerX
    achievementImage3.y = centerY
    achievementImage3.name = "play_20_games"
    achievementImage3:setFrame(screen_sheetData:getFrameIndex(achievementsManager.setFrameByName(achievementImage3.name)))
    achievementGroup:insert(achievementImage3)
    achievementImage4 = display.newSprite(screen_sheet, screen_sequenceData)
    achievementImage4.x = centerX
    achievementImage4.y = centerY
    achievementImage4.name = "win_the_game"
    achievementImage4:setFrame(screen_sheetData:getFrameIndex(achievementsManager.setFrameByName(achievementImage4.name)))
    achievementGroup:insert(achievementImage4)
    achievementImage5 = display.newSprite(screen_sheet, screen_sequenceData)
    achievementImage5.x = centerX
    achievementImage5.y = centerY
    achievementImage5.name = "win_the_game_no_help"
    achievementImage5:setFrame(screen_sheetData:getFrameIndex(achievementsManager.setFrameByName(achievementImage5.name)))
    achievementGroup:insert(achievementImage5)
    if event.params == nil or event.params.selected == nil then
      event.params = {}
      event.params.selected = 2
    end
    local selected = event.params.selected
    sceneName = event.params.sceneName
    setSelected(selected)
    setStatistic()
    frameImage:addEventListener("touch", removeKeyboard)
    achievementBtn:addEventListener("touch", changeTab)
    profileBtn:addEventListener("touch", changeTab)
    statisticBtn:addEventListener("touch", changeTab)
    closeBtn:addEventListener("touch", backToMenu)
    facebookBtn:addEventListener("touch", connectToFacebookListner)
    facebookCameraBtn:addEventListener("touch", updateFacebookImage)
    cameraBtn:addEventListener("touch", cameraImage)
    facebookBtn.alpha = 1
    facebookCameraBtn.alpha = 1
    cameraBtn.alpha = 1
    achievementImage1:addEventListener("touch", onAchievementsTouchEvent)
    achievementImage3:addEventListener("touch", onAchievementsTouchEvent)
    achievementImage4:addEventListener("touch", onAchievementsTouchEvent)
    achievementImage5:addEventListener("touch", onAchievementsTouchEvent)
  elseif phase == "did" then
    composer.removeScene("scripts.scenes.menu")
    adsUtil.loadAd()
    local isAutoFacebookConnect = event.params.autoFacebookConnect or false
    if isAutoFacebookConnect then
      connectToFacebook()
    end
  end
end

function scene:hide(event)
  log:log("UserSceneController exitScene")
  local group = self.view
  local phase = event.phase
  if phase == "will" then
    removeTextFields()
    frameImage:removeEventListener("touch", removeKeyboard)
    profileBtn:removeEventListener("touch", changeTab)
    statisticBtn:removeEventListener("touch", changeTab)
    achievementBtn:removeEventListener("touch", changeTab)
    closeBtn:removeEventListener("touch", backToMenu)
    facebookBtn:removeEventListener("touch", connectToFacebookListner)
    facebookCameraBtn:removeEventListener("touch", updateFacebookImage)
    cameraBtn:removeEventListener("touch", cameraImage)
    achievementImage1:removeEventListener("touch", onAchievementsTouchEvent)
    achievementImage3:removeEventListener("touch", onAchievementsTouchEvent)
    achievementImage4:removeEventListener("touch", onAchievementsTouchEvent)
    achievementImage5:removeEventListener("touch", onAchievementsTouchEvent)
  end
end

function scene:destroy(event)
  local group = self.view
  if facebookConnectTimmer ~= nil then
    timer.cancel(facebookConnectTimmer)
  end
  if facebookUpdateImageTimmer ~= nil then
    timer.cancel(facebookUpdateImageTimmer)
  end
end

scene:addEventListener("create", scene)
scene:addEventListener("show", scene)
scene:addEventListener("hide", scene)
scene:addEventListener("destroy", scene)
return scene
