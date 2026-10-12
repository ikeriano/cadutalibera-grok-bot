local achievement5 = {}
local name = "win_the_game_no_help"
achievement5.Frames = {
  EmptyStatus = "achievemen2.1_no-help",
  FullStatus = "achievemen2.2_no-help"
}
local info = {
  currentStatus = 0,
  numberOfWins = 0,
  diamondCredit = 0
}

function achievement5.init()
  log:log("achievement5 init")
  local dbResponse = persistenceUtil.getAchievementByName(name)
  if dbResponse then
    info.numberOfWins = dbResponse.wins_wumber
    info.currentStatus = achievementsManager.toBoolean(dbResponse.status)
    info.diamondCredit = dbResponse.diamond_credit
  end
end

function achievement5.setStatus()
  log:log("achievement5 setStatus currentStatus-", info.currentStatus, " numberOfWins", info.numberOfWins)
  local data = {}
  data.name = name
  data.currentStatus = achievementsManager.toInteger(info.currentStatus)
  data.numberOfWins = info.numberOfWins
  persistenceUtil.setAchievementByName(data)
end

function achievement5.checkAndUpdate()
  local isWinGameNoHelp = settingsUtil.getPalyerSettingByKey(settingsUtil.SettingsTable.isWinGameNoHelp)
  if isWinGameNoHelp == "true" and info.currentStatus == false then
    info.currentStatus = true
    info.numberOfWins = info.numberOfWins + 1
    achievement5.setStatus()
    settingsUtil.setPalyerSettingByKey(settingsUtil.SettingsTable.isWinGameNoHelp, "false")
    return true
  end
  return false
end

function achievement5.resetAchievement()
  info.currentStatus = false
  achievement5.setStatus()
end

function achievement5.getInfo()
  log:log("achievement5 getStatus", info.currentStatus)
  return info
end

return achievement5
