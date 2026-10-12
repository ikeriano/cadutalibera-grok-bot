local Settings = {}
local GameSettings = {}
local PlayerSettings = {}
Settings.SettingsTable = {
  TimerHelp = "TimerHelp",
  PassHelp = "PassHelp",
  LettersHelp = "LettersHelp",
  PlayerCredits = "PlayerCredits",
  InitPlayerCredits = "InitPlayerCredits",
  CreditsFactor = "CreditsFactor",
  FirstRoundCredit = "FirstRoundCredit",
  GenderType = "GenderType",
  IsFacebookImage = "IsFacebookImage",
  CustomImage = "CustomImage",
  PlayerEmail = "PlayerEmail",
  PlayerName = "PlayerName",
  IsFacebbokActive = "IsFacebbokActive",
  FacebbokId = "FacebbokId",
  UpdateFacebookImage = "UpdateFacebookImage",
  LastImageName = "LastImageName",
  SaveGame = "SaveGame",
  isAddCreditForSavedGame = "isAddCreditForSavedGame",
  ServerVersion = "Server_Version",
  GamesPlayed = "GamesPlayed",
  RoundsWins = "RoundsWins",
  isProfileHelp = "isProfileHelp",
  isGameHelp = "isGameHelp",
  roundDifficulty = "roundDifficulty",
  isFacebookShare = "isFacebookShare",
  facebookShareCredite = "facebookShareCredite",
  canCompete = "canCompete",
  isFirstTime = "isFirstTime",
  playerAchievementsCredit = "playerAchievementsCredit",
  imageType = "imageType",
  isFacebookShareEnabled = "isFacebookShareEnabled",
  isTerms = "isTerms",
  isAllowedCompetition = "isAllowedCompetition",
  isShowAd = "isShowAd",
  adsRoundModulo = "adsRoundModulo",
  isWinGame = "isWinGame",
  isWinGameNoHelp = "isWinGameNoHelp",
  isUseHelp = "isUseHelp",
  averageRound = "averageRound",
  userLevel = "userLevel",
  recordedGameId = "recordedGameId",
  recordedGameImageStatus = "recordedGameImageStatus",
  didPlayRecordedGame = "didPlayRecordedGame",
  outrunShowGuy = "outrunShowGuy",
  isNewCompetition = "isNewCompetition",
  isCompetitionRequestsEnabled = "isCompetitionRequestsEnabled",
  isRecordedGameRequestsEnabled = "isRecordedGameRequestsEnabled"
}

function Settings.getGameSettingByKey(key)
  return GameSettings[key]
end

function Settings.getPalyerSettingByKey(key)
  return PlayerSettings[key]
end

function Settings.setPalyerSettingByKey(key, value)
  PlayerSettings[key] = value
  persistenceUtil.setSettingByKey(key, value)
  return PlayerSettings[key]
end

function Settings.setGameSettingByKey(key, value)
  GameSettings[key] = value
  persistenceUtil.setSettingByKey(key, value)
  return GameSettings[key]
end

function Settings.init()
  Settings = persistenceUtil.getSettings()
  for k, v in pairs(Settings) do
    if v.setting_Type == "GAME" then
      GameSettings[v.setting_key] = v.setting_value
    elseif v.setting_Type == "PLAYER" then
      PlayerSettings[v.setting_key] = v.setting_value
    end
  end
end

return Settings
