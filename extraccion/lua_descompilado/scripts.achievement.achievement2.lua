local achievement2 = {}
local name = "play_20_games"
achievement2.Frames = {
  EmptyStatus = "achievemen3.1_no-lose",
  FullStatus = "achievemen3.2_no-lose"
}
local info = {
  currentStatus = 0,
  numberOfWins = 0,
  diamondCredit = 0
}

function achievement2.init()
  log:log("achievement2 init")
  local dbResponse = persistenceUtil.getAchievementByName(name)
  if dbResponse then
    info.numberOfWins = dbResponse.wins_wumber
    info.currentStatus = achievementsManager.toBoolean(dbResponse.status)
    info.diamondCredit = dbResponse.diamond_credit
  end
end

function achievement2.setStatus()
  log:log("achievement2 setStatus currentStatus-", info.currentStatus, " numberOfWins", info.numberOfWins)
  local data = {}
  data.name = name
  data.currentStatus = achievementsManager.toInteger(info.currentStatus)
  data.numberOfWins = info.numberOfWins
  persistenceUtil.setAchievementByName(data)
end

function achievement2.checkAndUpdate()
  local gamesPlayed = tonumber(settingsUtil.getPalyerSettingByKey(settingsUtil.SettingsTable.GamesPlayed))
  if 0 < gamesPlayed and gamesPlayed % 20 == 0 and info.currentStatus == false then
    info.currentStatus = true
    info.numberOfWins = info.numberOfWins + 1
    achievement2.setStatus()
    return true
  end
  return false
end

function achievement2.resetAchievement()
  info.currentStatus = false
  achievement2.setStatus()
end

function achievement2.getInfo()
  log:log("achievement2 getStatus", info.currentStatus)
  return info
end

return achievement2
