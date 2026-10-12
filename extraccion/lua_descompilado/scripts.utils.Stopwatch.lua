local stopwatch = {}
local stopwatch_mt = {__index = stopwatch}
local floor, getTime = math.floor, system.getTimer

local function timeFormat(time)
  if 0 < time then
    local sec = floor(time / 1000)
    local tenthOfSec = floor(time % 1000 / 10)
    if floor(tenthOfSec / 10) == 0 then
      tenthOfSec = "0" .. tenthOfSec
    end
    if sec < 10 then
      sec = "0" .. sec
    end
    return sec .. ":" .. tenthOfSec
  else
    return "00:00"
  end
end

function stopwatch:getElapsed()
  if self._pauseStart then
    return self._pauseStart - self._startTime
  end
  return getTime() - self._startTime
end

function stopwatch:getElapsedSeconds()
  return floor(self:getElapsed() / 1000)
end

function stopwatch:getRemaining()
  if self._pauseStart then
    return self._endTime - self._pauseStart
  end
  return self._endTime - getTime()
end

function stopwatch:getRemainingSeconds()
  return floor(self:getRemaining() / 1000)
end

function stopwatch:isElapsed()
  if self._endTime then
    return self:getRemaining() <= 0
  end
end

function stopwatch:addTime(seconds)
  if self._endTime then
    self._endTime = self._endTime + seconds * 1000
  else
    self._startTime = self._startTime - seconds * 1000
  end
end

function stopwatch:isPaused()
  return self._pauseStart ~= nil
end

function stopwatch:pause()
  if not self:isPaused() then
    self._pauseStart = getTime()
  end
end

function stopwatch:resume()
  if self:isPaused() then
    if self._endTime then
      self._endTime = self._endTime + (getTime() - self._pauseStart)
    else
      self._startTime = self._startTime + (getTime() - self._pauseStart)
    end
    self._pauseStart = nil
  end
end

function stopwatch:toElapsedString()
  return timeFormat(self:getElapsedSeconds())
end

function stopwatch:toRemainingString()
  if not self._endTime then
    return "99:99"
  end
  return timeFormat(self:getRemaining())
end

function stopwatch.new(countdown)
  local newTimer = {}
  local startTime = getTime()
  if countdown then
    newTimer._endTime = startTime + countdown * 1000
  end
  newTimer._startTime = startTime
  return setmetatable(newTimer, stopwatch_mt)
end

function stopwatch:clock()
  local text = self:toRemainingString()
  if self:getRemaining() < 0 then
    self:pause()
    return true, text
  else
    return false, text
  end
end

stopwatch.format = timeFormat
return stopwatch
