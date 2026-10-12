local AnimationUtils = {}
local screenSizeX = display.contentWidth
local screenSizeY = display.contentHeight
local centerX = display.contentWidth * 0.5
local centerY = display.contentHeight * 0.5
local clockM, clockL, clockR, timeText, playerX, oppponentX, turnIndicator, nameIndicator, oppponentName

function AnimationUtils.setClockArgs(clockMExt, clockLExt, clockRExt, timeTextExt, playerXExt, oppponentXExt, turnIndicatorExt, nameIndicatorExt, oppponentNameExt)
  clockM = clockMExt
  clockL = clockLExt
  clockR = clockRExt
  timeText = timeTextExt
  playerX = playerXExt
  oppponentX = oppponentXExt
  turnIndicator = turnIndicatorExt
  nameIndicator = nameIndicatorExt
  oppponentName = oppponentNameExt
end

local function openClock()
  local tranTime = 500
  turnIndicator.alpha = 1
  transition.scaleTo(turnIndicator, {
    xScale = 1,
    x = clockM.x,
    time = tranTime,
    delay = 500
  })
  transition.scaleTo(clockM, {
    xScale = 1,
    x = clockM.x,
    time = tranTime,
    delay = 500
  })
  transition.to(clockR, {
    x = clockR.x + 50,
    time = tranTime,
    delay = 500
  })
  transition.to(clockL, {
    x = clockL.x - 50,
    time = tranTime,
    delay = 500
  })
  transition.to(nameIndicator, {
    alpha = 1,
    time = tranTime,
    delay = 800
  })
end

function AnimationUtils.openClock()
  openClock()
end

local function moveClockToMe()
  local tranTime = 500
  nameIndicator.x = playerX - 2.5
  nameIndicator.text = player.name
  transition.to(turnIndicator, {alpha = 0, time = 50})
  transition.to(turnIndicator, {
    x = playerX - 2.5,
    time = tranTime,
    delay = 500
  })
  transition.to(clockM, {
    x = playerX,
    time = tranTime,
    delay = 500
  })
  transition.to(clockR, {
    rotation = 0,
    x = playerX,
    time = tranTime,
    delay = 500
  })
  transition.to(clockL, {
    rotation = 0,
    x = playerX,
    time = tranTime,
    delay = 500
  })
  transition.to(timeText, {
    x = playerX,
    time = tranTime,
    delay = 500,
    onComplete = openClock
  })
end

local function moveClockToOpponent()
  local tranTime = 500
  nameIndicator.x = oppponentX - 2.5
  nameIndicator.text = oppponentName
  transition.to(turnIndicator, {alpha = 0, time = 50})
  transition.to(turnIndicator, {
    x = oppponentX - 2.5,
    time = tranTime,
    delay = 500
  })
  transition.to(clockM, {
    x = oppponentX,
    time = tranTime,
    delay = 500
  })
  transition.to(clockR, {
    rotation = -360,
    x = oppponentX,
    time = tranTime,
    delay = 500
  })
  transition.to(clockL, {
    rotation = -360,
    x = oppponentX,
    time = tranTime,
    delay = 500
  })
  transition.to(timeText, {
    x = oppponentX,
    time = tranTime,
    delay = 500,
    onComplete = openClock
  })
end

local function closeClock(isMyTurn)
  local tranTime = 500
  transition.to(nameIndicator, {alpha = 0, time = tranTime})
  transition.scaleTo(turnIndicator, {
    xScale = 1.0E-6,
    time = tranTime,
    delay = 500
  })
  transition.scaleTo(clockM, {
    xScale = 0.1,
    time = tranTime,
    delay = 500
  })
  transition.to(clockR, {
    x = clockM.x,
    time = tranTime,
    delay = 500
  })
  transition.to(clockL, {
    x = clockM.x,
    time = tranTime,
    delay = 500
  })
  if isMyTurn == true then
    transition.to(timeText, {
      alpha = 0,
      time = tranTime,
      delay = 500,
      onComplete = moveClockToMe
    })
  else
    transition.to(timeText, {
      alpha = 0,
      time = tranTime,
      delay = 500,
      onComplete = moveClockToOpponent
    })
  end
end

function AnimationUtils.setClockPosGame(isMyTurn)
  closeClock(isMyTurn)
end

return AnimationUtils
