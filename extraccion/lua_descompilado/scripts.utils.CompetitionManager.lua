local CompetitionManager = {}
local myCompetition

function CompetitionManager.calcRemainingTime()
  local endTime
  if myCompetition == nil then
    return ""
  else
    endTime = myCompetition.end_time
  end
  endTime = tonumber(endTime) / 1000
  local t = os.date("*t")
  local utcTime = os.time(t)
  local calcSecondsLeft = endTime - utcTime
  if calcSecondsLeft <= 0 then
    return "00:00:00:00", true
  end
  local days = math.floor(calcSecondsLeft / 86400)
  if 0 < days then
    calcSecondsLeft = calcSecondsLeft - 86400 * days
  end
  local hours = math.floor(calcSecondsLeft / 3600)
  if 0 < hours then
    calcSecondsLeft = calcSecondsLeft - 3600 * hours
  end
  local minutes = math.floor(calcSecondsLeft / 60)
  if 0 < minutes then
    calcSecondsLeft = calcSecondsLeft - 60 * minutes
  end
  local seconds = calcSecondsLeft % 60
  local timeDisplay = string.format("%02d:%02d:%02d:%02d", days, hours, minutes, seconds)
  return timeDisplay, false
end

function CompetitionManager.cleanCompetition()
  persistenceUtil.deleteCompetition()
  myCompetition = nil
end

local function findReleventCompetition(data)
  local competition
  for k, v in pairs(data) do
    if v.end_time == nil then
      v.end_time = 1575064800000
    end
    if competition == nil then
      competition = v
    elseif competition.end_time == nil or competition.end_time > v.end_time then
      competition = v
    end
  end
  log:log("ReleventCompetition ", competition.name, competition.end_time)
  return competition
end

local function setReleventCompetition(data)
  local competition = findReleventCompetition(data)
  local currentCompetition = persistenceUtil.getCompetition()
  if currentCompetition == nil or currentCompetition.name ~= competition.name then
    log:log("Got new Competition")
    CompetitionManager.cleanCompetition()
    competition.delta_score = 0
    persistenceUtil.setCompetition(competition)
    myCompetition = competition
    settingsUtil.setGameSettingByKey(settingsUtil.SettingsTable.isNewCompetition, "true")
  else
    competition.delta_score = 0
    myCompetition = competition
    persistenceUtil.updateCompetition(competition)
  end
end

function CompetitionManager.processCompetitionResponse(data)
  log:log("processCompetitionResponse - ", data)
  if data == nil or #data == 0 then
    log:log("Empty Competitions")
    CompetitionManager.cleanCompetition()
  else
    setReleventCompetition(data)
  end
end

function CompetitionManager.isCompetition()
  log:log("isCompetition")
  local currentCompetition = persistenceUtil.getCompetition()
  if currentCompetition ~= nil then
    return true
  end
  return false
end

function CompetitionManager.getCompetition()
  log:log("isCompetition")
  myCompetition = persistenceUtil.getCompetition()
  if myCompetition ~= nil then
    return myCompetition
  end
  return nil
end

function CompetitionManager.setDeltaScore(deltaScore)
  log:log("setDeltaScore")
  persistenceUtil.updateDeltaScore(deltaScore)
end

return CompetitionManager
