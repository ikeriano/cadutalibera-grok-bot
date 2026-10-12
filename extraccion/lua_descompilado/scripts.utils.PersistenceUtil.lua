local sqlite3 = require("sqlite3")
local json = require("json")
local db, path
local PersistenceUtil = {}
PersistenceUtil.categories = {
  general = "general",
  entertainment = "entertainment",
  history = "history",
  geography = "geography",
  sport = "sport",
  science = "science"
}

function PersistenceUtil.closeDb()
  log:log("PersistenceUtil closeDb")
  if db ~= nil then
    db:close()
    db = nil
  end
end

local function createTables()
  log:log("createTables")
  local tablesetup = "CREATE TABLE IF NOT EXISTS CATEGORY (id INTEGER PRIMARY KEY, category);"
  db:exec(tablesetup)
  local insertValue = "INSERT INTO CATEGORY VALUES (NULL, 'sport' );"
  db:exec(insertValue)
  tablesetup = "CREATE TABLE IF NOT EXISTS GAME_SETTINGS (id INTEGER PRIMARY KEY, setting_key, setting_value , setting_Type);"
  db:exec(tablesetup)
  insertValue = "INSERT INTO GAME_SETTINGS VALUES (NULL, 'TimerHelp' , '100' , 'GAME');"
  db:exec(insertValue)
  insertValue = "INSERT INTO GAME_SETTINGS VALUES (NULL, 'PassHelp' , '150', 'GAME');"
  db:exec(insertValue)
  insertValue = "INSERT INTO GAME_SETTINGS VALUES (NULL, 'LettersHelp' , '100', 'GAME');"
  db:exec(insertValue)
  insertValue = "INSERT INTO GAME_SETTINGS VALUES (NULL, 'PlayerCredits' , '500', 'PLAYER');"
  db:exec(insertValue)
  insertValue = "INSERT INTO GAME_SETTINGS VALUES (NULL, 'CreditsFactor' , '10', 'GAME');"
  db:exec(insertValue)
  insertValue = "INSERT INTO GAME_SETTINGS VALUES (NULL, 'FirstRoundCredit' , '90', 'GAME');"
  db:exec(insertValue)
end

local function addSeetings()
  log:log("addSeetings")
  local insertValue = "INSERT INTO GAME_SETTINGS VALUES (NULL, 'SecretToken' , '', 'GAME');"
  db:exec(insertValue)
  insertValue = "INSERT INTO GAME_SETTINGS VALUES (NULL, 'TokenType' , '', 'GAME');"
  db:exec(insertValue)
  insertValue = "INSERT INTO GAME_SETTINGS VALUES (NULL, 'IsFacebbokActive' , 'false', 'PLAYER');"
  db:exec(insertValue)
  insertValue = "INSERT INTO GAME_SETTINGS VALUES (NULL, 'PlayerName' , '" .. messagesUtil.Messges.YOUR_TURN .. "', 'PLAYER');"
  db:exec(insertValue)
  insertValue = "INSERT INTO GAME_SETTINGS VALUES (NULL, 'PlayerEmail' , '', 'PLAYER');"
  db:exec(insertValue)
  insertValue = "INSERT INTO GAME_SETTINGS VALUES (NULL, 'GenderType' , 'male', 'PLAYER');"
  db:exec(insertValue)
  insertValue = "INSERT INTO GAME_SETTINGS VALUES (NULL, 'CustomImage' , 'false', 'PLAYER');"
  db:exec(insertValue)
  insertValue = "INSERT INTO GAME_SETTINGS VALUES (NULL, 'FacebbokId' , '', 'PLAYER');"
  db:exec(insertValue)
  insertValue = "INSERT INTO GAME_SETTINGS VALUES (NULL, 'LastImageName' , '', 'PLAYER');"
  db:exec(insertValue)
  insertValue = "INSERT INTO GAME_SETTINGS VALUES (NULL, 'UpdateFacebookImage' , 'false', 'PLAYER');"
  db:exec(insertValue)
  local tablesetup = "CREATE TABLE IF NOT EXISTS GAME_QUESTIONS (id INTEGER PRIMARY KEY,  category TEXT, question TEXT ,answer TEXT , level INTEGER, hint TEXT ,priority INTEGER,experarion_date TEXT,activation_date TEXT,is_appeared INTEGER, is_answered INTEGER);"
  db:exec(tablesetup)
end

local function addSeetings2()
  local insertValue
  insertValue = "INSERT INTO GAME_SETTINGS VALUES (NULL, 'SaveGame' , 'false', 'PLAYER');"
  db:exec(insertValue)
  insertValue = "INSERT INTO GAME_SETTINGS VALUES (NULL, 'isAddCreditForSavedGame' , 'false', 'PLAYER');"
  db:exec(insertValue)
  insertValue = "ALTER TABLE GAME_QUESTIONS ADD server_id TEXT;"
  db:exec(insertValue)
  insertValue = " CREATE INDEX server_id_idx ON GAME_QUESTIONS (server_id);"
  db:exec(insertValue)
  insertValue = " DELETE FROM GAME_QUESTIONS;"
  db:exec(insertValue)
end

local function addSeetings3()
  log:log("PersistenceUtil init addSeetings3")
  local insertValue
  insertValue = "INSERT INTO GAME_SETTINGS VALUES (NULL, 'DB_Version' , '1.0.0.0', 'GAME');"
  db:exec(insertValue)
  insertValue = "INSERT INTO GAME_SETTINGS VALUES (NULL, 'Server_Version' , '-1', 'PLAYER');"
  db:exec(insertValue)
  local tablesetup = "CREATE TABLE IF NOT EXISTS USER_STATISTICS (category TEXT, number_of_questions INTEGER, number_of_right_answers INTEGER);"
  db:exec(tablesetup)
  insertValue = "INSERT INTO USER_STATISTICS VALUES ('general', 0 , 0);"
  db:exec(insertValue)
  insertValue = "INSERT INTO USER_STATISTICS VALUES ('entertainment', 0 , 0);"
  db:exec(insertValue)
  insertValue = "INSERT INTO USER_STATISTICS VALUES ('history', 0 , 0);"
  db:exec(insertValue)
  insertValue = "INSERT INTO USER_STATISTICS VALUES ('geography', 0 , 0);"
  db:exec(insertValue)
  insertValue = "INSERT INTO USER_STATISTICS VALUES ('sport', 0 , 0);"
  db:exec(insertValue)
  insertValue = "INSERT INTO USER_STATISTICS VALUES ('science', 0 , 0);"
  db:exec(insertValue)
  insertValue = "INSERT INTO GAME_SETTINGS VALUES (NULL, 'RoundsWins' , '0', 'PLAYER');"
  db:exec(insertValue)
  insertValue = "INSERT INTO GAME_SETTINGS VALUES (NULL, 'GamesPlayed' , '0', 'PLAYER');"
  db:exec(insertValue)
end

local function dbUpdate4()
  log:log("PersistenceUtil init dbUpdate4")
  local insertValue
  insertValue = "update GAME_SETTINGS set setting_value='1001' WHERE setting_key='DB_Version' ;"
  db:exec(insertValue)
  insertValue = "INSERT INTO GAME_SETTINGS VALUES (NULL, 'isProfileHelp' , 'true', 'PLAYER');"
  db:exec(insertValue)
  insertValue = "INSERT INTO GAME_SETTINGS VALUES (NULL, 'isGameHelp' , 'true', 'PLAYER');"
  db:exec(insertValue)
  insertValue = "INSERT INTO GAME_SETTINGS VALUES (NULL, 'roundDifficulty' , '4', 'PLAYER');"
  db:exec(insertValue)
end

local function dbUpdate5()
  log:log("PersistenceUtil init dbUpdate5")
  local insertValue
  insertValue = "INSERT INTO GAME_SETTINGS VALUES (NULL, 'isFacebookShare' , 'false', 'PLAYER');"
  db:exec(insertValue)
  insertValue = "INSERT INTO GAME_SETTINGS VALUES (NULL, 'canCompete' , 'false', 'PLAYER');"
  db:exec(insertValue)
  insertValue = "INSERT INTO GAME_SETTINGS VALUES (NULL, 'isTerms' , 'false', 'PLAYER');"
  db:exec(insertValue)
  insertValue = "INSERT INTO GAME_SETTINGS VALUES (NULL, 'playerAchievementsCredit' , '0', 'PLAYER');"
  db:exec(insertValue)
  insertValue = "INSERT INTO GAME_SETTINGS VALUES (NULL, 'facebookShareCredite' , '150', 'GAME');"
  db:exec(insertValue)
  insertValue = "INSERT INTO GAME_SETTINGS VALUES (NULL, 'isFirstTime' , 'true', 'GAME');"
  db:exec(insertValue)
  insertValue = "INSERT INTO GAME_SETTINGS VALUES (NULL, 'imageType' , '', 'PLAYER');"
  db:exec(insertValue)
  insertValue = "INSERT INTO GAME_SETTINGS VALUES (NULL, 'isFacebookShareEnabled' , 'false', 'GAME');"
  db:exec(insertValue)
  insertValue = "INSERT INTO GAME_SETTINGS VALUES (NULL, 'isAllowedCompetition' , 'false', 'PLAYER');"
  db:exec(insertValue)
  local tablesetup = "CREATE TABLE IF NOT EXISTS ACHIEVEMENTS (id INTEGER PRIMARY KEY, name TEXT , status INTEGER , wins_wumber , diamond_credit);"
  db:exec(tablesetup)
  insertValue = "INSERT INTO ACHIEVEMENTS VALUES (NULL, 'win_50_opponents' , 0, 0 , 200);"
  db:exec(insertValue)
  tablesetup = "CREATE TABLE IF NOT EXISTS COMPETITION (name TEXT PRIMARY KEY, display_name TEXT , start_time TEXT , end_time TEXT,score INTEGER , delta_score INTEGER);"
  db:exec(tablesetup)
  insertValue = "update GAME_SETTINGS set setting_value='1002' WHERE setting_key='DB_Version' ;"
  db:exec(insertValue)
end

local function dbUpdate6()
  log:log("PersistenceUtil init dbUpdate6")
  local insertValue
  insertValue = "INSERT INTO ACHIEVEMENTS VALUES (NULL, 'play_20_games' , 0, 0 , 300);"
  db:exec(insertValue)
  insertValue = "update GAME_SETTINGS set setting_value='1003' WHERE setting_key='DB_Version' ;"
  db:exec(insertValue)
end

local function dbUpdate7()
  log:log("PersistenceUtil init dbUpdate7")
  local insertValue
  insertValue = "INSERT INTO GAME_SETTINGS VALUES (NULL, 'isShowAd' , 'true', 'GAME');"
  db:exec(insertValue)
  insertValue = "INSERT INTO GAME_SETTINGS VALUES (NULL, 'adsRoundModulo' , '3', 'GAME');"
  db:exec(insertValue)
  insertValue = "update GAME_SETTINGS set setting_value='1004' WHERE setting_key='DB_Version' ;"
  db:exec(insertValue)
end

local function dbUpdate8()
  log:log("PersistenceUtil init dbUpdate8")
  local insertValue
  insertValue = "INSERT INTO ACHIEVEMENTS VALUES (NULL, 'better_than_show' , 0, 0 , 250);"
  db:exec(insertValue)
  insertValue = "INSERT INTO ACHIEVEMENTS VALUES (NULL, 'win_the_game' , 0, 0 , 400);"
  db:exec(insertValue)
  insertValue = "INSERT INTO ACHIEVEMENTS VALUES (NULL, 'win_the_game_no_help' , 0, 0 , 500);"
  db:exec(insertValue)
  insertValue = "INSERT INTO GAME_SETTINGS VALUES (NULL, 'isWinGame' , 'false', 'PLAYER');"
  db:exec(insertValue)
  insertValue = "INSERT INTO GAME_SETTINGS VALUES (NULL, 'isWinGameNoHelp' , 'false', 'PLAYER');"
  db:exec(insertValue)
  insertValue = "INSERT INTO GAME_SETTINGS VALUES (NULL, 'isUseHelp' , 'false', 'PLAYER');"
  db:exec(insertValue)
  insertValue = "INSERT INTO GAME_SETTINGS VALUES (NULL, 'averageRound' , '5', 'PLAYER');"
  db:exec(insertValue)
  insertValue = "INSERT INTO GAME_SETTINGS VALUES (NULL, 'userLevel' , '2', 'PLAYER');"
  db:exec(insertValue)
  insertValue = "update GAME_SETTINGS set setting_value='1005' WHERE setting_key='DB_Version' ;"
  db:exec(insertValue)
end

local function addRecordedGamesTable()
  log:log("PersistenceUtil init addRecordedGamesTable")
  local tablesetup = "CREATE TABLE IF NOT EXISTS RECORDED_GAMES (show_name TEXT, game_date TEXT, recorded_game TEXT);"
  db:exec(tablesetup)
  local insertValue = "INSERT INTO GAME_SETTINGS VALUES (NULL, 'recordedGameId' , '', 'GAME');"
  db:exec(insertValue)
  insertValue = "INSERT INTO GAME_SETTINGS VALUES (NULL, 'recordedGameImageStatus' , 'false', 'GAME');"
  db:exec(insertValue)
  insertValue = "INSERT INTO GAME_SETTINGS VALUES (NULL, 'didPlayRecordedGame' , 'false', 'GAME');"
  db:exec(insertValue)
  insertValue = "INSERT INTO GAME_SETTINGS VALUES (NULL, 'outrunShowGuy' , 'false', 'PLAYER');"
  db:exec(insertValue)
  insertValue = "update GAME_SETTINGS set setting_value='1006' WHERE setting_key='DB_Version' ;"
  db:exec(insertValue)
end

local function dbUpdate10()
  log:log("PersistenceUtil init dbUpdate10")
  local insertValue = "INSERT INTO GAME_SETTINGS VALUES (NULL, 'isNewCompetition' , 'false', 'GAME');"
  db:exec(insertValue)
  insertValue = "update GAME_SETTINGS set setting_value='1007' WHERE setting_key='DB_Version' ;"
  db:exec(insertValue)
end

local function dbUpdate11()
  log:log("PersistenceUtil init dbUpdate11")
  local insertValue = "INSERT INTO GAME_SETTINGS VALUES (NULL, 'isCompetitionRequestsEnabled' , 'false', 'GAME');"
  db:exec(insertValue)
  local insertValue = "INSERT INTO GAME_SETTINGS VALUES (NULL, 'isRecordedGameRequestsEnabled' , 'false', 'GAME');"
  db:exec(insertValue)
  insertValue = "update GAME_SETTINGS set setting_value='1008' WHERE setting_key='DB_Version' ;"
  db:exec(insertValue)
end

local function dbUpdate12()
  log:log("PersistenceUtil init dbUpdate12")
  local insertValue = "INSERT INTO GAME_SETTINGS VALUES (NULL, 'InitPlayerCredits' , '500', 'GAME');"
  db:exec(insertValue)
  insertValue = "update GAME_SETTINGS set setting_value='1009' WHERE setting_key='DB_Version' ;"
  db:exec(insertValue)
end

function PersistenceUtil.init()
  log:log("PersistenceUtil init")
  if db == nil then
    path = system.pathForFile("game.db", system.DocumentsDirectory)
    db = sqlite3.open(path)
    local ifExistsQuery = "SELECT count(name) as isExists FROM sqlite_master WHERE type='table' AND name='GAME_SETTINGS';"
    local row
    for row in db:nrows(ifExistsQuery) do
      if row.isExists == 0 then
        createTables()
      end
    end
    local ifExistsQuery = "SELECT count(setting_key) as isExists FROM GAME_SETTINGS WHERE setting_key='SecretToken';"
    for row in db:nrows(ifExistsQuery) do
      if row.isExists == 0 then
        addSeetings()
      end
    end
    local ifExistsQuery = "SELECT count(setting_key) as isExists FROM GAME_SETTINGS WHERE setting_key='isAddCreditForSavedGame';"
    for row in db:nrows(ifExistsQuery) do
      if row.isExists == 0 then
        addSeetings2()
      end
    end
    local ifExistsQuery = "SELECT count(setting_key) as isExists FROM GAME_SETTINGS WHERE setting_key='DB_Version';"
    for row in db:nrows(ifExistsQuery) do
      if row.isExists == 0 then
        addSeetings3()
      end
    end
    local ifExistsQuery = "SELECT setting_value  FROM GAME_SETTINGS WHERE setting_key='DB_Version';"
    for row in db:nrows(ifExistsQuery) do
      if row.setting_value == "1.0.0.0" then
        dbUpdate4()
      end
    end
    local ifExistsQuery = "SELECT setting_value FROM GAME_SETTINGS WHERE setting_key='DB_Version';"
    for row in db:nrows(ifExistsQuery) do
      if row.setting_value == "1001" then
        dbUpdate5()
      end
    end
    local ifExistsQuery = "SELECT setting_value FROM GAME_SETTINGS WHERE setting_key='DB_Version';"
    for row in db:nrows(ifExistsQuery) do
      if row.setting_value == "1002" then
        dbUpdate6()
      end
    end
    local ifExistsQuery = "SELECT setting_value FROM GAME_SETTINGS WHERE setting_key='DB_Version';"
    for row in db:nrows(ifExistsQuery) do
      if row.setting_value == "1003" then
        dbUpdate7()
      end
    end
    local ifExistsQuery = "SELECT setting_value FROM GAME_SETTINGS WHERE setting_key='DB_Version';"
    for row in db:nrows(ifExistsQuery) do
      if row.setting_value == "1004" then
        dbUpdate8()
      end
    end
    ifExistsQuery = "SELECT setting_value FROM GAME_SETTINGS WHERE setting_key='DB_Version';"
    for row in db:nrows(ifExistsQuery) do
      if row.setting_value == "1005" then
        addRecordedGamesTable()
      end
    end
    ifExistsQuery = "SELECT setting_value FROM GAME_SETTINGS WHERE setting_key='DB_Version';"
    for row in db:nrows(ifExistsQuery) do
      if row.setting_value == "1006" then
        dbUpdate10()
      end
    end
    ifExistsQuery = "SELECT setting_value FROM GAME_SETTINGS WHERE setting_key='DB_Version';"
    for row in db:nrows(ifExistsQuery) do
      if row.setting_value == "1007" then
        dbUpdate11()
      end
    end
    ifExistsQuery = "SELECT setting_value FROM GAME_SETTINGS WHERE setting_key='DB_Version';"
    for row in db:nrows(ifExistsQuery) do
      if row.setting_value == "1008" then
        saveUtil.deleteGame()
        dbUpdate12()
      end
    end
  end
end

local function getCategoryInfo(category)
  local query = "select number_of_questions , number_of_right_answers from USER_STATISTICS where category ='" .. category .. "' ;"
  local row
  for row in db:nrows(query) do
    return row
  end
end

function PersistenceUtil.updateCategoryStatistic(isRightAnswer, category)
  log:log("Start PersistenceUtil.updateCategoryStatistic")
  local data = getCategoryInfo(category)
  local number_of_questions = data.number_of_questions + 1
  local number_of_right_answers = data.number_of_right_answers
  if isRightAnswer then
    number_of_right_answers = number_of_right_answers + 1
  end
  local query = "update USER_STATISTICS set number_of_questions = " .. number_of_questions .. ",number_of_right_answers = " .. number_of_right_answers .. "  where category ='" .. category .. "' ;"
  db:exec(query)
end

function PersistenceUtil.initStatistics()
  local query = "update USER_STATISTICS set number_of_questions = 0,number_of_right_answers = 0;"
  db:exec(query)
end

function PersistenceUtil.syncStatistic(newStatistic)
  log:log("Start PersistenceUtil.syncStatistic")
  for k, v in pairs(newStatistic) do
    local query = "update USER_STATISTICS set number_of_questions = " .. v.questions_presented .. ",number_of_right_answers = " .. v.questions_solved .. "  where category ='" .. v.category .. "' ;"
    db:exec(query)
  end
end

function PersistenceUtil.getStatistic()
  log:log("Start PersistenceUtil.getStatistic")
  local statistics = {}
  local query = "select category , number_of_questions , number_of_right_answers from USER_STATISTICS;"
  local row
  for row in db:nrows(query) do
    local category = row.category
    local number_of_questions = row.number_of_questions
    local number_of_right_answers = row.number_of_right_answers
    statistics[category] = {}
    local percentage
    if number_of_questions == 0 then
      percentage = "0%"
    else
      percentage = tostring(math.floor(number_of_right_answers / number_of_questions * 100)) .. "%"
    end
    statistics[category].percentage = percentage
    statistics[category].number_of_questions = number_of_questions
    statistics[category].number_of_right_answers = number_of_right_answers
    statistics[category].category = category
  end
  return statistics
end

function PersistenceUtil.getGmaeSettings()
  local query = " select * from GAME_SETTINGS;"
  return db:nrows(query)
end

function PersistenceUtil.getGmaeSettingByKey(name)
  local query = " select setting_value from GAME_SETTINGS where setting_key = '" .. name .. "';"
  local row
  for row in db:nrows(query) do
    return row.setting_value
  end
  return nil
end

local function checkIfQuestionExists(question)
  local ifExistsQuery = "SELECT count(server_id) as isExists FROM GAME_QUESTIONS WHERE server_id='" .. question.id .. "';"
  for row in db:nrows(ifExistsQuery) do
    if row.isExists == 0 then
      return true
    else
      log:log("Question already exists in the DB question.id - <" .. question.id .. ">")
      return false
    end
  end
  return false
end

function PersistenceUtil.insertQuestions(questions)
  log:log("Start PersistenceUtil.insertQuestions")
  local stmt = db:prepare("INSERT INTO GAME_QUESTIONS VALUES (NULL,?,?,?,?,?,?,?,?,0,0,?);")
  local responseCode
  for k, v in pairs(questions) do
    if checkIfQuestionExists(v) then
      if v.experation_date == nil then
        v.experation_date = "3000-01-01"
      end
      if v.activation_date == nil then
        v.activation_date = "2000-01-01"
      end
      v.category = v.category
      v.answer = string.gsub(v.answer, "'", "")
      v.answer = string.gsub(v.answer, "\"", "")
      v.answer = string.lower(v.answer)
      stmt:reset()
      stmt:bind_values(v.category, v.question, v.answer, v.level, v.hint, v.priority, v.experation_date, v.activation_date, v.id)
      responseCode = stmt:step()
      if responseCode ~= sqlite3.DONE then
        log:log("DB Error")
        log:log(responseCode)
      end
    end
  end
  log:log("Done inserting Questions")
end

function PersistenceUtil.deleteRecordedGames()
  log:log("Start PersistenceUtil.deleteRecordedGames")
  local insertValue = " delete from RECORDED_GAMES"
  db:exec(insertValue)
end

function PersistenceUtil.insertRecordedGame(recordedGame)
  log:log("Start PersistenceUtil.insertRecordedGame")
  local insertValue = " INSERT INTO RECORDED_GAMES VALUES ('" .. recordedGame.player_name .. "', date('now'),'" .. json.encode(recordedGame) .. "');"
  db:exec(insertValue)
  recordedGameUtil.setCurrentRounds()
end

function PersistenceUtil.getRecordedGame()
  log:log("getRecordedGame: Request recorded_game of latest RecordedGame game.")
  local recorded_game
  local query = "SELECT recorded_game FROM RECORDED_GAMES ORDER BY game_date DESC LIMIT 1;"
  db:exec(query)
  local row
  for row in db:nrows(query) do
    recorded_game = json.decode(row.recorded_game)
  end
  return recorded_game
end

function PersistenceUtil.countQuestions()
  local row
  local countQuestionsQuery = "SELECT count(*) as numberOfQuestions FROM GAME_QUESTIONS;"
  for row in db:nrows(countQuestionsQuery) do
    log:log("row.numberOfQuestions ", row.numberOfQuestions)
    return row.numberOfQuestions
  end
end

function PersistenceUtil.getQuestion(category, minLevel, maxLevel)
  local row
  log:log("Start PersistenceUtil.getQuestion")
  local questions = {}
  local currentday = os.date("%Y-%m-%d")
  local query = "select  q.* from  GAME_QUESTIONS q where q.level between " .. minLevel .. "  and " .. maxLevel .. " and is_appeared = 0 and date(\"" .. currentday .. "\") <= date(q.experarion_date) and date(\"" .. currentday .. "\") >= date(q.activation_date) ORDER BY q.level desc, q.priority desc, RANDOM() LIMIT 1;"
  log:log("query", query)
  for row in db:nrows(query) do
    log:log(row)
    questions = row
  end
  return questions
end

function PersistenceUtil.getAnyQuestion(category, minLevel, maxLevel)
  local row
  log:log("Start PersistenceUtil.getQuestion")
  local questions = {}
  local currentday = os.date("%Y-%m-%d")
  local query = "select  q.* from  GAME_QUESTIONS q where q.level between " .. minLevel .. "  and " .. maxLevel .. " and is_appeared = 0 and date(\"" .. currentday .. "\") <= date(q.experarion_date) and date(\"" .. currentday .. "\") >= date(q.activation_date) ORDER BY q.level asc, q.priority desc, RANDOM() LIMIT 1;"
  log:log("query", query)
  for row in db:nrows(query) do
    log:log(row)
    questions = row
  end
  return questions
end

function PersistenceUtil.getCategory()
  local row
  local query = "select category from CATEGORY ORDER BY RANDOM() LIMIT 1;"
  local category = {}
  for row in db:nrows(query) do
    category = row
  end
  return category.category
end

function PersistenceUtil.deleteQuestionById(id)
  log:log("start deleteQuestionById")
  local deleteQuestionById = "delete from GAME_QUESTIONS where id =" .. id .. " ;"
  local errorCode = db:exec(deleteQuestionById)
  if errorCode ~= 0 then
    log:log("Faild to delete GAME_QUESTIONS id -" .. tostring(id))
  end
end

function PersistenceUtil.updateQuestionById(id)
  log:log("start updateQuestionById")
  local updateQuestionById = "update GAME_QUESTIONS set is_appeared = 1 where id =" .. id .. " ;"
  local errorCode = db:exec(updateQuestionById)
  if errorCode ~= 0 then
    log:log("Faild to update GAME_QUESTIONS id -" .. tostring(id))
  end
end

function PersistenceUtil.deleteExpiredQuestion()
  log:log("start deleteExpiredQuestion")
  local currentday = os.date("%Y-%m-%d")
  local deleteQuestionById = "delete from GAME_QUESTIONS where date(experarion_date) <= date(\"" .. currentday .. "\") ;"
  local errorCode = db:exec(deleteQuestionById)
  if errorCode ~= 0 then
    log:log("Faild to deleteExpiredQuestion GAME_QUESTIONS")
  end
end

function PersistenceUtil.deleteQuestions()
  log:log("start deleteQuestions")
  local deleteQuestionById = "delete from GAME_QUESTIONS;"
  local errorCode = db:exec(deleteQuestionById)
  if errorCode ~= 0 then
    log:log("Faild to deleteQuestions GAME_QUESTIONS")
  end
end

function PersistenceUtil.getSettings()
  local row
  local query = "select setting_key, setting_value ,setting_Type from GAME_SETTINGS"
  local settings = {}
  local index = 1
  for row in db:nrows(query) do
    local element = {}
    element.setting_key = row.setting_key
    element.setting_value = row.setting_value
    element.setting_Type = row.setting_Type
    settings[index] = element
    index = index + 1
  end
  return settings
end

function PersistenceUtil.setSettingByKey(key, value)
  local updateSetting = "update GAME_SETTINGS set setting_value ='" .. value .. "' where setting_key ='" .. key .. "';"
  local errorCode = db:exec(updateSetting)
  if errorCode ~= 0 then
    log:log("Faild to update GAME_SETTINGS id -" .. tostring(key))
  end
end

function PersistenceUtil.getAchievementByName(name)
  log:log("PersistenceUtil getAchievementByName", name)
  local query = "SELECT * from ACHIEVEMENTS where name = '" .. name .. "';"
  local row
  for row in db:nrows(query) do
    return row
  end
  return nil
end

function PersistenceUtil.setAchievementByName(achievementData)
  log:log("PersistenceUtil getAchievementByName", achievementData.name)
  local query = "update ACHIEVEMENTS set status = " .. achievementData.currentStatus .. " ,wins_wumber = " .. achievementData.numberOfWins .. " where name = '" .. achievementData.name .. "';"
  log:log("query - ", query)
  local errorCode = db:exec(query)
  if errorCode ~= 0 then
    log:log("Faild to update setAchievementByName id -", achievementData)
  end
end

function PersistenceUtil.setCompetition(competition)
  log:log("PersistenceUtil setCompetition", competition.name)
  local query = "insert into COMPETITION VALUES ('" .. competition.name .. "','" .. competition.display_name .. "','" .. competition.start_time .. "','" .. competition.end_time .. "'," .. tostring(competition.score) .. " , " .. tostring(competition.delta_score) .. ");"
  log:log("query - ", query)
  local errorCode = db:exec(query)
  if errorCode ~= 0 then
    log:log("Faild to update setCompetition id -", competition.name)
  end
end

function PersistenceUtil.getCompetition()
  log:log("PersistenceUtil getCompetition")
  local query = "SELECT * from COMPETITION;"
  local row
  for row in db:nrows(query) do
    return row
  end
  return nil
end

function PersistenceUtil.deleteCompetition()
  log:log("PersistenceUtil deleteCompetition")
  local query = "delete from COMPETITION ;"
  log:log("query - ", query)
  local errorCode = db:exec(query)
  if errorCode ~= 0 then
    log:log("Faild to deleteCompetition")
  end
end

function PersistenceUtil.updateDeltaScore(deltaScore)
  log:log("PersistenceUtil updateDeltaScore")
  local query = "update COMPETITION set delta_score = " .. tostring(deltaScore) .. ";"
  log:log("query - ", query)
  local errorCode = db:exec(query)
  if errorCode ~= 0 then
    log:log("Faild to updateDeltaScore")
  end
end

function PersistenceUtil.updateCompetition(competition)
  log:log("PersistenceUtil updateCompetition")
  local query = "update COMPETITION set   end_time= '" .. competition.end_time .. "' ,score=" .. tostring(competition.score) .. " ,  delta_score = " .. tostring(competition.delta_score) .. ";"
  log:log("query - ", query)
  local errorCode = db:exec(query)
  if errorCode ~= 0 then
    log:log("Faild to updateCompetition")
  end
end

function PersistenceUtil.isVAlid()
  local query = "SELECT date('now') as 'idValid';"
  log:log("PersistenceUtil isVAlid")
  local isValidStatus = false
  for row in db:nrows(query) do
    log:log(row.idValid)
    isValidStatus = ture
  end
  if isValidStatus == false then
    PersistenceUtil.closeDb()
    PersistenceUtil.init()
  end
end

return PersistenceUtil
