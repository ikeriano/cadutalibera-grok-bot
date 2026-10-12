local achievement1 = {}
local name = "win_50_opponents"
achievement1.Frames = {
  EmptyStatus = "achievemen1.1_million",
  FullStatus = "achievemen1.2_million"
}
local info = {
  currentStatus = 0,
  numberOfWins = 0,
  diamondCredit = 0
}

function achievement1.init()
  log:log("achievement1 init")
  local dbResponse = persistenceUtil.getAchievementByName(name)
  if dbResponse then
    info.numberOfWins = dbResponse.wins_wumber
    info.currentStatus = achievementsManager.toBoolean(dbResponse.status)
    info.diamondCredit = dbResponse.diamond_credit
  end
end

function achievement1.setStatus()
  log:log("achievement1 setStatus currentStatus-", info.currentStatus, " numberOfWins", info.numberOfWins)
  local data = {}
  data.name = name
  data.currentStatus = achievementsManager.toInteger(info.currentStatus)
  data.numberOfWins = info.numberOfWins
  persistenceUtil.setAchievementByName(data)
end

function achievement1.checkAndUpdate()
  local roundsWins = tonumber(settingsUtil.getPalyerSettingByKey(settingsUtil.SettingsTable.RoundsWins))
  if 0 < roundsWins and roundsWins % 50 == 0 and info.currentStatus == false then
    info.currentStatus = true
    info.numberOfWins = info.numberOfWins + 1
    achievement1.setStatus()
    return true
  end
  return false
end

function achievement1.resetAchievement()
  info.currentStatus = false
  achievement1.setStatus()
end

function achievement1.getInfo()
  log:log("achievement1 getStatus", info.currentStatus)
  return info
end

return achievement1
