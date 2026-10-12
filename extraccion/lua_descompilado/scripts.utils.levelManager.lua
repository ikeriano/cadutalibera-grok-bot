local levelManager = {}
local Levels = {
  START = 1,
  MID = 2,
  EXPERT = 3
}
local level = tonumber(settingsUtil.getPalyerSettingByKey(settingsUtil.SettingsTable.userLevel))

function levelManager.calcLevel(currentRound)
  local averageRound = tonumber(settingsUtil.getPalyerSettingByKey(settingsUtil.SettingsTable.averageRound))
  local newAverage
  if averageRound == nil or averageRound == 0 then
    level = Levels.START
  else
    newAverage = math.floor((averageRound + currentRound) / 2)
    settingsUtil.setPalyerSettingByKey(settingsUtil.SettingsTable.averageRound, newAverage)
    log:log("calc Average", newAverage)
    if newAverage < 4 then
      level = Levels.START
    elseif newAverage < 7 then
      level = Levels.MID
    else
      level = Levels.EXPERT
    end
  end
  settingsUtil.setPalyerSettingByKey(settingsUtil.SettingsTable.userLevel, level)
  log:log("Level", level)
end

function levelManager.getLevel()
  local level = tonumber(settingsUtil.getPalyerSettingByKey(settingsUtil.SettingsTable.userLevel))
  if level == nil or level ~= 1 and level ~= 2 and level ~= 3 then
    level = Levels.MID
  end
  return level
end

return levelManager
