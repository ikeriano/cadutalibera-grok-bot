local RecordedGameUtil = {}
local recorded_game = {}
local rounds, currentRound, currentQuestion, currentQuestions, rivals, currentRival
local rivalIsComputer = false

function RecordedGameUtil.doesOpponentSucceed()
  local gotQuestions = currentQuestions[2] ~= nil
  return gotQuestions
end

function RecordedGameUtil.getQuestions()
  local temp = {}
  log:log("RecordedGameUtil.getQuestions")
  for _, q in pairs(currentRound.questions) do
    table.insert(temp, q)
  end
  table.insert(temp, 1, nil)
  return temp
end

local function nextQuestion()
  local currentQuestion = table.remove(currentQuestions, 1)
  return currentQuestion
end

function RecordedGameUtil.popQuestion()
  nextQuestion()
  return true
end

function RecordedGameUtil.pushBackRound()
  if showMode then
    table.insert(rounds, 1, currentRound)
  end
  return true
end

function RecordedGameUtil.nextRoundAndQuestions()
  log:log("RecordedGameUtil.nextRoundAndQuestions")
  currentRound = table.remove(rounds, 1)
  currentQuestions = RecordedGameUtil.getQuestions()
  if next(currentQuestions) == nil then
    rivalIsComputer = true
    settingsUtil.setPalyerSettingByKey(settingsUtil.SettingsTable.outrunShowGuy, "true")
  end
  return currentRound
end

function RecordedGameUtil.rivalIsComputer()
  return rivalIsComputer
end

function RecordedGameUtil.isRealRival()
  return not RecordedGameUtil.rivalIsComputer()
end

function RecordedGameUtil.getQuestion(roundNumber, questionNumber)
  log:log("Start RecordedGameUtil.getQuestion")
  log:log("roundNumber - ", roundNumber, "  questionNumber - ", questionNumber)
  currentQuestion = nextQuestion()
  if currentQuestion ~= nil then
    currentQuestion.id = 0
    currentQuestion.category = "general"
    currentQuestion.roundNumber = roundNumber
    currentQuestion.questionNumber = questionNumber
  end
  return currentQuestion
end

function RecordedGameUtil.nextRivalPosition()
  local next_rival_name = currentRound.rival_name
  local position
  for i, rival in pairs(rivals) do
    if rival.name == next_rival_name then
      position = i
    end
  end
  return position
end

function RecordedGameUtil.setCurrentRounds()
  log:log("RecordedGameUtil.init")
  if rounds == nil then
    recorded_game = persistenceUtil.getRecordedGame()
    rounds = recorded_game.rounds
  end
  rivals = gameUtils.buildCastFromShow()
end

local function selectRelevantGame(gamesList)
  local now = os.time()
  local timezone = tonumber(os.date("%z")) / 100
  local t = os.date("*t")
  local currentTime = os.time(t)
  for k, v in pairs(gamesList) do
    local pattern = "(%d+)%-(%d+)%-(%d+)%a(%d+)%:(%d+)%:([%d%.]+)([Z%p])(%d*)%:?(%d*)"
    local year, month, day, hour, minute, seconds, tzoffset, offsethour, offsetmin = v.activation_time:match(pattern)
    local timestamp = os.time({
      year = year,
      month = month,
      day = day,
      hour = hour,
      min = minute,
      sec = seconds
    })
    local activation_timeTimestamp = timestamp + timezone * 3600
    year, month, day, hour, minute, seconds, tzoffset, offsethour, offsetmin = v.expiration_time:match(pattern)
    timestamp = os.time({
      year = year,
      month = month,
      day = day,
      hour = hour,
      min = minute,
      sec = seconds
    })
    local expiration_timeTimeStamp = timestamp + timezone * 3600
    if currentTime > activation_timeTimestamp and currentTime < expiration_timeTimeStamp then
      return v
    end
  end
  return nil
end

function RecordedGameUtil.checkList(gamesList)
  if gamesList ~= nil then
    local relevantGame = selectRelevantGame(gamesList)
    if relevantGame then
      local oldGame = settingsUtil.getGameSettingByKey(settingsUtil.SettingsTable.recordedGameId)
      local recordedGameImageStatus = settingsUtil.getGameSettingByKey(settingsUtil.SettingsTable.recordedGameImageStatus)
      if relevantGame.game_id ~= oldGame or recordedGameImageStatus == "false" then
        settingsUtil.setGameSettingByKey(settingsUtil.SettingsTable.recordedGameImageStatus, "false")
        settingsUtil.setGameSettingByKey(settingsUtil.SettingsTable.didPlayRecordedGame, "false")
        os.remove(system.pathForFile(oldGame .. ".png", system.DocumentsDirectory))
        settingsUtil.setGameSettingByKey(settingsUtil.SettingsTable.recordedGameId, "")
        persistenceUtil.deleteRecordedGames()
        networkUtil.getRecordedGameById(relevantGame.game_id)
        networkUtil.getGameImage(relevantGame.game_id)
      end
    end
  end
end

function RecordedGameUtil.isRecordedGame()
  local gameId = settingsUtil.getGameSettingByKey(settingsUtil.SettingsTable.recordedGameId)
  local recordedGameImageStatus = settingsUtil.getGameSettingByKey(settingsUtil.SettingsTable.recordedGameImageStatus)
  local didPlayRecordedGame = settingsUtil.getGameSettingByKey(settingsUtil.SettingsTable.didPlayRecordedGame)
  if gameId ~= "" and recordedGameImageStatus == "true" and didPlayRecordedGame == "false" then
    return true
  end
  return false
end

return RecordedGameUtil
