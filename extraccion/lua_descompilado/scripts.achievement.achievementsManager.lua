local achievement1 = require("scripts.achievement.achievement1")
local achievement2 = require("scripts.achievement.achievement2")
local achievement3 = require("scripts.achievement.achievement3")
local achievement4 = require("scripts.achievement.achievement4")
local achievement5 = require("scripts.achievement.achievement5")
local achievementsManager = {}
achievementsManager.achievementsNames = {
  win_50_opponents = "win_50_opponents",
  play_20_games = "play_20_games",
  win_the_game = "win_the_game",
  win_the_game_no_help = "win_the_game_no_help"
}
local achievementsTable = {}

function achievementsManager.init()
  achievementsTable[achievementsManager.achievementsNames.win_50_opponents] = achievement1
  achievementsTable[achievementsManager.achievementsNames.play_20_games] = achievement2
  achievementsTable[achievementsManager.achievementsNames.win_the_game] = achievement4
  achievementsTable[achievementsManager.achievementsNames.win_the_game_no_help] = achievement5
  achievementsTable.win_50_opponents.init()
  achievementsTable.play_20_games.init()
  achievementsTable.win_the_game.init()
  achievementsTable.win_the_game_no_help.init()
end

function achievementsManager.checkForAchievements()
  for k, v in pairs(achievementsTable) do
    local info = v.getInfo()
    if info.currentStatus then
      return true
    end
  end
  return false
end

function achievementsManager.getAchievementStatusByName(name)
  local currentStatus = achievementsTable[name].getInfo().currentStatus
  return currentStatus
end

function achievementsManager.getAchievementInfoByName(name)
  return achievementsTable[name].getInfo()
end

function achievementsManager.checkAndUpdateAchievementByName(name)
  local achievementStatus = achievementsTable[name].checkAndUpdate()
  if achievementStatus then
    gameAnalytics.logEvent("Achievement_UNLOCK_" .. name, nil)
  end
end

function achievementsManager.setFrameByName(name)
  local achievementStatus = achievementsTable[name].getInfo()
  local frame
  if achievementStatus.currentStatus then
    frame = achievementsTable[name].Frames.FullStatus
  else
    frame = achievementsTable[name].Frames.EmptyStatus
  end
  return frame
end

function achievementsManager.resetAchievementByName(name)
  achievementsTable[name].resetAchievement()
end

function achievementsManager.toBoolean(dbStatus)
  if dbStatus == 0 then
    return false
  else
    return true
  end
end

function achievementsManager.toInteger(currentStatus)
  if currentStatus then
    return 1
  else
    return 0
  end
end

return achievementsManager
