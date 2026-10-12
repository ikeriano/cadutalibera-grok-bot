local achievement3 = {}
local name = "outrun_show_guy "
achievement3.Frames = {
  EmptyStatus = "achievemen2.1_no-help",
  FullStatus = "achievemen2.2_no-help"
}
local info = {
  currentStatus = 0,
  numberOfWins = 0,
  diamondCredit = 0
}

function achievement3.init()
  log:log("achievement3 init")
  local dbResponse = persistenceUtil.getAchievementByName(name)
  if dbResponse then
    info.numberOfWins = dbResponse.wins_wumber
    info.currentStatus = achievementsManager.toBoolean(dbResponse.status)
    info.diamondCredit = dbResponse.diamond_credit
  end
end

function achievement3.setStatus()
  log:log("achievement3 setStatus currentStatus-", info.currentStatus, " numberOfWins", info.numberOfWins)
  local data = {}
  data.name = name
  data.currentStatus = achievementsManager.toInteger(info.currentStatus)
  data.numberOfWins = info.numberOfWins
  persistenceUtil.setAchievementByName(data)
end

function achievement3.checkAndUpdate()
  local outrunShowGuy = settingsUtil.getPalyerSettingByKey(settingsUtil.SettingsTable.outrunShowGuy)
  if outrunShowGuy == "true" and info.currentStatus == false then
    info.currentStatus = true
    info.numberOfWins = info.numberOfWins + 1
    achievement3.setStatus()
    settingsUtil.setPalyerSettingByKey(settingsUtil.SettingsTable.outrunShowGuy, "false")
    return true
  end
  return false
end

function achievement3.resetAchievement()
  info.currentStatus = false
  achievement3.setStatus()
end

function achievement3.getInfo()
  log:log("achievement3 getStatus", info.currentStatus)
  return info
end

return achievement3
