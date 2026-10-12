local SaveUtil = {}
local json = require("json")
local recordedGameUtil = require("scripts.utils.RecordedGameUtil")
local gameSaver, saveObject

function SaveUtil.init()
  log:log("SaveUtil.init")
  gameSaver = GGData:new("saveGame")
end

local function savePlayerData()
  local playerForSave = {}
  playerForSave.id = player.id
  playerForSave.picName = player.picName
  playerForSave.baseDir = player.baseDir
  playerForSave.score = player.score
  playerForSave.level = player.level
  playerForSave.hthImage = player.hthImage
  playerForSave.dropImage = player.dropImage
  playerForSave.endImage = player.endImage
  playerForSave.hthCoverImage = player.hthCoverImage
  playerForSave.playerStatus = player.playerStatus
  playerForSave.gender = player.gender
  playerForSave.roundNumber = player.roundNumber
  playerForSave.name = player.name
  playerForSave.body = player.body
  playerForSave.stageBody = player.stageBody
  playerForSave.questionNumber = player.questionNumber
  return playerForSave
end

local function saveOppponentsData()
  local oppponentsData = {}
  for k, v in pairs(oppponents) do
    local oppponent = {}
    oppponent.id = v.id
    oppponent.name = v.name
    oppponent.body = v.body
    oppponent.value = v.value
    oppponent.valueImageFrame = v.valueImageFrame
    oppponent.valueImageOffFrame = v.valueImageOffFrame
    oppponent.level = v.level
    oppponent.playerStatus = v.playerStatus
    oppponent.angle = v.angle
    oppponent.hthImage = v.hthImage
    oppponent.dropImage = v.dropImage
    oppponent.hthCoverImage = v.hthCoverImage
    oppponent.gender = v.gender
    oppponent.imageFile = v.imageFile
    oppponentsData[k] = oppponent
  end
  return oppponentsData
end

function SaveUtil.saveGame()
  log:log("SaveUtil.saveGame")
  saveObject = {}
  saveObject.player = savePlayerData()
  saveObject.oppponents = saveOppponentsData()
  if showMode then
    saveObject.showMode = showMode
    saveObject.rounds = rounds
  end
  gameSaver:set("savedGame", json.encode(saveObject))
  gameSaver:save()
  settingsUtil.setPalyerSettingByKey(settingsUtil.SettingsTable.SaveGame, "true")
end

local function loadPlayer()
  local playerToLoad = saveObject.player
  player.id = playerToLoad.id
  player.stageBody = playerToLoad.stageBody
  player.baseDir, player.picName = gameUtils.getPlayerImage()
  player.gender = gameUtils.getPlayerGender()
  player.score = playerToLoad.score
  player.level = playerToLoad.level
  player.hthImage = playerToLoad.hthImage
  player.dropImage = playerToLoad.dropImage
  player.endImage = playerToLoad.endImage
  player.hthCoverImage = playerToLoad.hthCoverImage
  player.body = playerToLoad.body
  player.playerStatus = playerToLoad.playerStatus
  player.roundNumber = playerToLoad.roundNumber
  player.name = playerToLoad.name
  player.questionNumber = playerToLoad.questionNumber
end

function SaveUtil.loadGame()
  log:log("SaveUtil.loadGame")
  saveObject = {}
  saveObject = json.decode(gameSaver:get("savedGame"))
  loadPlayer()
  oppponents = saveObject.oppponents
  showMode = saveObject.showMode
  if showMode == true then
    recordedGameUtil.setCurrentRounds()
    for i, v in pairs(oppponents) do
      if v.playerStatus == false then
        recordedGameUtil.nextRoundAndQuestions()
      end
    end
  end
end

function SaveUtil.deleteGame()
  log:log("SaveUtil.deleteGame")
  saveObject = {}
  gameSaver:set("savedGame", json.encode(saveObject))
  gameSaver:save()
  settingsUtil.setPalyerSettingByKey(settingsUtil.SettingsTable.SaveGame, "false")
end

function SaveUtil.isSaveGame()
  return settingsUtil.getPalyerSettingByKey(settingsUtil.SettingsTable.SaveGame)
end

function SaveUtil.isAddCreditForSaveGame()
  return settingsUtil.getPalyerSettingByKey(settingsUtil.SettingsTable.isAddCreditForSavedGame)
end

function SaveUtil.setAddCreditForSaveGame(addCreditStatus)
  return settingsUtil.setPalyerSettingByKey(settingsUtil.SettingsTable.isAddCreditForSavedGame, addCreditStatus)
end

return SaveUtil
