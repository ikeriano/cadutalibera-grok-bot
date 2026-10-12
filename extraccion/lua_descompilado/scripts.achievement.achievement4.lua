local achievement4 = {}
local name = "win_the_game"
achievement4.Frames = {
  EmptyStatus = "achievemen4.1_played",
  FullStatus = "achievemen4.2_played"
}
local info = {
  currentStatus = 0,
  numberOfWins = 0,
  diamondCredit = 0
}

function achievement4.init()
  log:log("achievement4 init")
  local dbResponse = persistenceUtil.getAchievementByName(name)
  if dbResponse then
    info.numberOfWins = dbResponse.wins_wumber
    info.currentStatus = achievementsManager.toBoolean(dbResponse.status)
    info.diamondCredit = dbResponse.diamond_credit
  end
end

function achievement4.setStatus()
  log:log("achievement4 setStatus currentStatus-", info.currentStatus, " numberOfWins", info.numberOfWins)
  local data = {}
  data.name = name
  data.currentStatus = achievementsManager.toInteger(info.currentStatus)
  data.numberOfWins = info.numberOfWins
  persistenceUtil.setAchievementByName(data)
end

function achievement4.checkAndUpdate()
  local isWinGame = settingsUtil.getPalyerSettingByKey(settingsUtil.SettingsTable.isWinGame)
  if isWinGame == "true" and info.currentStatus == false then
    info.currentStatus = true
    info.numberOfWins = info.numberOfWins + 1
    achievement4.setStatus()
    settingsUtil.setPalyerSettingByKey(settingsUtil.SettingsTable.isWinGame, "false")
    return true
  end
  return false
end

function achievement4.resetAchievement()
  info.currentStatus = false
  achievement4.setStatus()
end

function achievement4.getInfo()
  log:log("achievement4 getStatus", info.currentStatus)
  return info
end

return achievement4
