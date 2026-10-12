local PlayerInfoProcessor = {}
local json = require("json")

local function getCategories(categories)
  local localCategories = {}
  localCategories.science = {}
  localCategories.general = {}
  localCategories.entertainment = {}
  localCategories.history = {}
  localCategories.geography = {}
  localCategories.sport = {}
  localCategories.science.questions_presented = categories.science.questions_presented
  localCategories.science.questions_solved = categories.science.questions_solved
  localCategories.science.category = "science"
  localCategories.general.questions_presented = categories.general.questions_presented
  localCategories.general.questions_solved = categories.general.questions_solved
  localCategories.general.category = "general"
  localCategories.entertainment.questions_presented = categories.entertainment.questions_presented
  localCategories.entertainment.questions_solved = categories.entertainment.questions_solved
  localCategories.entertainment.category = "entertainment"
  localCategories.history.questions_presented = categories.history.questions_presented
  localCategories.history.questions_solved = categories.history.questions_solved
  localCategories.history.category = "history"
  localCategories.geography.questions_presented = categories.geography.questions_presented
  localCategories.geography.questions_solved = categories.geography.questions_solved
  localCategories.geography.category = "geography"
  localCategories.sport.questions_presented = categories.sport.questions_presented
  localCategories.sport.questions_solved = categories.sport.questions_solved
  localCategories.sport.category = "sport"
  return localCategories
end

function PlayerInfoProcessor.setProductionConfiguration(data)
  log:log("setProductionConfiguration", data)
  local body, pos, msg = json.decode(data)
  if not body then
    log:log("Decode failed at ", pos, ": ", msg)
  else
    local isFacebookShare = body.is_facebook_share_enabled
    if isFacebookShare ~= nil then
      settingsUtil.setGameSettingByKey(settingsUtil.SettingsTable.isFacebookShareEnabled, tostring(isFacebookShare))
    end
    local is_show_ad = body.is_show_ad
    if is_show_ad ~= nil then
      settingsUtil.setGameSettingByKey(settingsUtil.SettingsTable.isShowAd, tostring(is_show_ad))
    end
    local mod = body.ad_round_modulo
    if mod ~= nil then
      settingsUtil.setGameSettingByKey(settingsUtil.SettingsTable.adsRoundModulo, tostring(mod))
    end
    local is_competition_enabled = body.is_competition_enabled
    if is_competition_enabled ~= nil then
      settingsUtil.setGameSettingByKey(settingsUtil.SettingsTable.isCompetitionRequestsEnabled, tostring(is_competition_enabled))
    else
      settingsUtil.setGameSettingByKey(settingsUtil.SettingsTable.isCompetitionRequestsEnabled, "false")
    end
    local is_recorded_game_enabled = body.is_recorded_game_enabled
    if is_recorded_game_enabled ~= nil then
      settingsUtil.setGameSettingByKey(settingsUtil.SettingsTable.isRecordedGameRequestsEnabled, tostring(is_recorded_game_enabled))
    else
      settingsUtil.setGameSettingByKey(settingsUtil.SettingsTable.isRecordedGameRequestsEnabled, "false")
    end
    local timerHelpPrice = body.timer_help_price
    if timerHelpPrice ~= nil then
      settingsUtil.setGameSettingByKey(settingsUtil.SettingsTable.TimerHelp, tostring(timerHelpPrice))
    else
      settingsUtil.setGameSettingByKey(settingsUtil.SettingsTable.TimerHelp, "100")
    end
    local passHelpPrice = body.pass_help_price
    if passHelpPrice ~= nil then
      settingsUtil.setGameSettingByKey(settingsUtil.SettingsTable.PassHelp, tostring(passHelpPrice))
    else
      settingsUtil.setGameSettingByKey(settingsUtil.SettingsTable.PassHelp, "150")
    end
    local lettersHelpPrice = body.letters_help_price
    if lettersHelpPrice ~= nil then
      settingsUtil.setGameSettingByKey(settingsUtil.SettingsTable.LettersHelp, tostring(lettersHelpPrice))
    else
      settingsUtil.setGameSettingByKey(settingsUtil.SettingsTable.LettersHelp, "100")
    end
    local creditsFactor = body.credits_factor
    if creditsFactor ~= nil then
      settingsUtil.setGameSettingByKey(settingsUtil.SettingsTable.CreditsFactor, tostring(creditsFactor))
    else
      settingsUtil.setGameSettingByKey(settingsUtil.SettingsTable.CreditsFactor, "10")
    end
    local firstRoundCredit = body.first_round_credit
    if firstRoundCredit ~= nil then
      settingsUtil.setGameSettingByKey(settingsUtil.SettingsTable.FirstRoundCredit, tostring(firstRoundCredit))
    else
      settingsUtil.setGameSettingByKey(settingsUtil.SettingsTable.FirstRoundCredit, "90")
    end
    local init_player_credit = body.init_client_credit
    if init_player_credit ~= nil then
      settingsUtil.setGameSettingByKey(settingsUtil.SettingsTable.InitPlayerCredits, tostring(init_player_credit))
    else
      settingsUtil.setGameSettingByKey(settingsUtil.SettingsTable.InitPlayerCredits, "500")
    end
  end
end

function PlayerInfoProcessor.processUserData(data)
  log:log("processUserData", data)
  local body, pos, msg = json.decode(data)
  if not body then
    log:log("Decode failed at ", pos, ": ", msg)
  else
    local localVersion = settingsUtil.getGameSettingByKey(settingsUtil.SettingsTable.ServerVersion)
    settingsUtil.setPalyerSettingByKey(settingsUtil.SettingsTable.PlayerCredits, body.credits.diamonds)
    settingsUtil.setPalyerSettingByKey(settingsUtil.SettingsTable.ServerVersion, body.version)
    settingsUtil.setPalyerSettingByKey(settingsUtil.SettingsTable.canCompete, tostring(body.can_compete))
    settingsUtil.setPalyerSettingByKey(settingsUtil.SettingsTable.roundDifficulty, body.round_difficulty_factor)
    settingsUtil.setPalyerSettingByKey(settingsUtil.SettingsTable.GamesPlayed, body.statistics.games_played)
    settingsUtil.setPalyerSettingByKey(settingsUtil.SettingsTable.RoundsWins, body.statistics.games_won)
    persistenceUtil.syncStatistic(getCategories(body.statistics.categories))
    log:log("Exit processUserData")
  end
end

function PlayerInfoProcessor.buildUpdateBody()
  local body = {}
  log:log("Enter buildUpdateBody")
  body.version = settingsUtil.getPalyerSettingByKey(settingsUtil.SettingsTable.ServerVersion)
  local isTerms = settingsUtil.getPalyerSettingByKey(settingsUtil.SettingsTable.isTerms)
  local IsFacebbokActive = settingsUtil.getPalyerSettingByKey(settingsUtil.SettingsTable.IsFacebbokActive)
  local isAllowedCompetition = settingsUtil.getPalyerSettingByKey(settingsUtil.SettingsTable.isAllowedCompetition)
  if isTerms == "true" and IsFacebbokActive == "true" and isAllowedCompetition == "true" then
    body.can_compete = true
    settingsUtil.setPalyerSettingByKey(settingsUtil.SettingsTable.canCompete, "true")
  else
    body.can_compete = false
    settingsUtil.setPalyerSettingByKey(settingsUtil.SettingsTable.canCompete, "false")
  end
  body.credits = {}
  body.credits.diamonds = settingsUtil.getPalyerSettingByKey(settingsUtil.SettingsTable.PlayerCredits)
  body.statistics = {}
  body.statistics.games_played = settingsUtil.getPalyerSettingByKey(settingsUtil.SettingsTable.GamesPlayed)
  body.statistics.games_won = settingsUtil.getPalyerSettingByKey(settingsUtil.SettingsTable.RoundsWins)
  local categoriesStatistics = persistenceUtil.getStatistic()
  body.statistics.categories = {}
  for k, v in pairs(categoriesStatistics) do
    body.statistics.categories[v.category] = {}
    body.statistics.categories[v.category].questions_presented = v.number_of_questions
    body.statistics.categories[v.category].questions_solved = v.number_of_right_answers
  end
  local requestJson = json.encode(body)
  return requestJson
end

return PlayerInfoProcessor
