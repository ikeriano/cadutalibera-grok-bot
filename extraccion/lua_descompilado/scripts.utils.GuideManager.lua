local Guide = require("scripts.commons.Guide")
local lmu = require("Assets.Images.Letters.LettersMappingUtil")
local guideManager = {}
local sheetData1 = require(assetsManager.sprites.LETTERS_SPRITE_HD.spriteMapper)
local sheet1 = graphics.newImageSheet(assetsManager.sprites.LETTERS_SPRITE_HD.sprite, sheetData1.sheet)
local sequenceData1 = {
  {
    name = "seq1",
    sheet = sheet1,
    start = 1,
    count = assetsManager.sprites.LETTERS_SPRITE_HD.frames,
    loopCount = 0
  }
}
local screenSizeX = display.contentWidth
local screenSizeY = display.contentHeight
local centerX = display.contentWidth * 0.5
local centerY = display.contentHeight * 0.5
local EMPTY_LETTER = "^"
local indexText, onLetter, textAnswer, letterImage
local scaleFactor = 1
local sizeX = display.contentWidth * 0.975
local startPosY = 400
local spriteXSize = 39
local spaceSize = spriteXSize * 0.7
local spriteYSize = 57.5
local spritsPerRow = math.floor(sizeX / spriteXSize)
local spriteTable = {}
local rowsTable = {}
local letersTable = {}
local letersTableOrig = {}
local spacesTable = {}
local group, spriteGroup

local function splitOrigAnswer(guideText)
  local text = guideText
  local counter = 1
  local i = 1
  local subtext
  letersTableOrig = {}
  while i <= #text do
    subtext = text:sub(i, i + 1)
    if string.byte(subtext) < 128 then
      subtext = text:sub(i, i)
      letersTableOrig[counter] = subtext
      i = i + 1
    else
      subtext = text:sub(i, i + 1)
      letersTableOrig[counter] = subtext
      i = i + 2
    end
    counter = counter + 1
  end
end

function guideManager.setOrigAnswer(answer)
  splitOrigAnswer(answer)
end

local function splitGuideTxt(guideText)
  local text = guideText
  local counter = 1
  local i = 1
  local subtext
  letersTable = {}
  while i <= #text do
    subtext = text:sub(i, i + 1)
    if string.byte(subtext) < 128 then
      subtext = text:sub(i, i)
      letersTable[counter] = subtext
      i = i + 1
    else
      subtext = text:sub(i, i + 1)
      letersTable[counter] = subtext
      i = i + 2
    end
    counter = counter + 1
  end
end

local function splitAnswerTxt(answer)
  local text = answer
  local counter = 1
  local i = 1
  local subtext
  local answerTable = {}
  while i <= #text do
    subtext = text:sub(i, i + 1)
    if string.byte(subtext) < 128 then
      subtext = text:sub(i, i)
      answerTable[counter] = subtext
      i = i + 1
    else
      subtext = text:sub(i, i + 1)
      answerTable[counter] = subtext
      i = i + 2
    end
    counter = counter + 1
  end
  return answerTable
end

local function moveToNewRow(index, row)
  for i = index, #spriteTable do
    if i == index then
      spriteTable[i].sprite:removeSelf()
    else
      spriteTable[i].row = row
    end
  end
end

local function calcRowSize(rowWordList)
  local rowSpriteCounter = 0
  for k, v in pairs(rowWordList) do
    rowSpriteCounter = rowSpriteCounter + v.wordSize
    if rowWordList[k + 1] ~= nil then
      rowSpriteCounter = rowSpriteCounter + 1
    end
  end
  return rowSpriteCounter
end

local function buildSpriteTable(isMyTurn)
  indexText = 0
  spriteTable = {}
  local wordsTable = {}
  local wordObj = {}
  local wordObjOrig = {}
  wordObj.word = ""
  wordObjOrig.word = ""
  wordObj.wordSize = 0
  local index = 1
  local guide
  for k, v in pairs(letersTable) do
    guide = Guide.New()
    guide.letter = v
    guide.sprite = display.newSprite(sheet1, sequenceData1)
    guide.sprite:scale(scaleFactor, scaleFactor)
    if isMyTurn == false then
      guide.sprite:setFrame(sheetData1:getFrameIndex(lmu.OpponentLetters[guide.letter]))
    elseif v ~= EMPTY_LETTER then
      guide.isConst = true
      guide.sprite:setFrame(sheetData1:getFrameIndex(lmu.FixedLetters[guide.letter]))
    else
      guide.sprite:setFrame(sheetData1:getFrameIndex(lmu.OnLetters[guide.letter]))
    end
    guide.sprite.x = guide.posX
    guide.sprite.y = guide.posY
    spriteTable[k] = guide
    spriteTable[k].sprite.id = k
    if guide.letter == " " then
      spacesTable[index] = k
      wordObj.word = wordObj.word .. guide.letter
      wordObjOrig.word = wordObjOrig.word .. letersTableOrig[k]
      local rowNumber = 1
      if tonumber(wordObjOrig.word) ~= nil then
        wordObj.isNumber = true
      else
        wordObj.isNumber = false
      end
      wordsTable[index] = wordObj
      index = index + 1
      wordObj = {}
      wordObj.word = ""
      wordObj.wordSize = 0
    elseif k == #letersTable then
      wordObj.word = wordObj.word .. guide.letter
      wordObjOrig.word = wordObjOrig.word .. letersTableOrig[k]
      wordObj.wordSize = wordObj.wordSize + 1
      if tonumber(wordObjOrig.word) ~= nil then
        wordObj.isNumber = true
      else
        wordObj.isNumber = false
      end
      wordsTable[index] = wordObj
    else
      wordObj.word = wordObj.word .. guide.letter
      wordObj.wordSize = wordObj.wordSize + 1
    end
  end
  rowsTable = {}
  local rowCounter = 0
  local rowObject = {}
  rowObject.wordsList = {}
  for k, v in pairs(wordsTable) do
    rowCounter = rowCounter + v.wordSize
    if wordsTable[k + 1] ~= nil then
      if rowCounter > spritsPerRow then
        rowObject.rowSize = calcRowSize(rowObject.wordsList)
        table.insert(rowsTable, rowObject)
        rowObject = {}
        rowObject.wordsList = {}
        rowCounter = v.wordSize
        table.insert(rowObject.wordsList, v)
      else
        table.insert(rowObject.wordsList, v)
        rowCounter = rowCounter + 1
      end
    elseif rowCounter > spritsPerRow then
      rowObject.rowSize = calcRowSize(rowObject.wordsList)
      table.insert(rowsTable, rowObject)
      rowObject = {}
      rowObject.wordsList = {}
      rowCounter = v.wordSize
      table.insert(rowObject.wordsList, v)
      rowObject.rowSize = calcRowSize(rowObject.wordsList)
      table.insert(rowsTable, rowObject)
    else
      table.insert(rowObject.wordsList, v)
      rowObject.rowSize = calcRowSize(rowObject.wordsList)
      table.insert(rowsTable, rowObject)
    end
  end
end

local function showOnScreen()
  local rowSize, numerOfSpacesPerRow, wordStartPosX, currentStartPosX
  local spritCounter = 1
  local localStartPosY = startPosY
  for k, v in pairs(rowsTable) do
    rowSize = v.rowSize
    numerOfSpacesPerRow = #v.wordsList - 1
    currentStartPosX = (sizeX - v.rowSize * spriteXSize) / 2 + spriteXSize * 0.7
    localStartPosY = localStartPosY + spriteYSize
    for k2, v2 in pairs(v.wordsList) do
      wordStartPosX = currentStartPosX
      currentStartPosX = wordStartPosX
      for i = 1, v2.wordSize do
        if spriteTable[spritCounter] ~= nil then
          spriteTable[spritCounter].sprite.x = currentStartPosX
          spriteTable[spritCounter].sprite.y = localStartPosY
          currentStartPosX = currentStartPosX + spriteXSize
          spritCounter = spritCounter + 1
        end
      end
      currentStartPosX = currentStartPosX + spriteXSize
      spritCounter = spritCounter + 1
    end
  end
  spriteGroup.alpha = 1
end

local function touchLetter(event)
  local xPos = event.target.x
  local yPos = event.target.y
  indexText = event.target.id
  transition.moveTo(onLetter, {
    x = xPos,
    y = yPos,
    time = 100
  })
end

local function setFocus(event)
  native.setKeyboardFocus(textAnswer)
  touchLetter(event)
end

local function getNextLetter()
  for k, v in pairs(spriteTable) do
    if k > indexText and v.letter == EMPTY_LETTER then
      return k
    end
  end
  for k, v in pairs(spriteTable) do
    if k < indexText and v.letter == EMPTY_LETTER then
      return k
    end
  end
  for k, v in pairs(spriteTable) do
    if k > indexText and v.isConst == false then
      return k
    end
  end
  return indexText
end

function guideManager.showGuide(guideText, isMyTurn)
  letersTable = guideText
  buildSpriteTable(isMyTurn)
  showOnScreen()
  for k, v in pairs(spriteTable) do
    spriteGroup:insert(v.sprite)
    if v.isConst == false then
      v.sprite:addEventListener("touch", setFocus)
    end
  end
  letterImage = display.newImage(sheet1, sheetData1:getFrameIndex("letters_on_light"))
  indexText = getNextLetter()
  letterImage.x = spriteTable[indexText].sprite.x
  letterImage.y = spriteTable[indexText].sprite.y
  letterImage:scale(scaleFactor, scaleFactor)
  spriteGroup:insert(letterImage)
  group:insert(spriteGroup)
end

function guideManager.setPosY(y)
  startPosY = y
end

function guideManager.setGroupAndText(storyGroup, externalTextAnswer)
  group = storyGroup
  spriteGroup = display.newGroup()
  textAnswer = externalTextAnswer
  textAnswer.text = " "
  textAnswer:setSelection(1, 1)
end

local function getPrevIndex()
  for i = indexText - 1, 1, -1 do
    if spriteTable[i].isConst == false then
      return i
    end
  end
  return indexText
end

function guideManager.getAnswer()
  local answer = ""
  for k, v in pairs(spriteTable) do
    answer = answer .. v.letter
  end
  return answer
end

local function setOnLetterImageLocation()
  if indexText == 0 then
    indexText = getNextLetter()
  end
  if indexText ~= -1 then
    local xPos = spriteTable[indexText].sprite.x
    local yPos = spriteTable[indexText].sprite.y
    transition.moveTo(onLetter, {
      x = xPos,
      y = yPos,
      time = 100
    })
  end
end

local function trim1(s)
  return (s:gsub("^%s*(.-)%s*$", "%1"))
end

function guideManager.textListener(event)
  local preTrimLen, letter, postTrimLen
  if event.phase == "editing" or event.phase == "submitted" then
    preTrimLen = string.len(textAnswer.text)
    letter = string.lower(trim1(textAnswer.text))
    postTrimLen = string.len(letter)
    if 0 < postTrimLen then
      if sheetData1:getFrameIndex(lmu.OnLetters[letter]) ~= nil then
        spriteTable[indexText].letter = letter
        spriteTable[indexText].sprite:setFrame(sheetData1:getFrameIndex(lmu.OnLetters[spriteTable[indexText].letter]))
        indexText = getNextLetter()
        setOnLetterImageLocation()
        isErrorSound = true
      end
    elseif postTrimLen == preTrimLen then
      spriteTable[indexText].letter = EMPTY_LETTER
      spriteTable[indexText].sprite:setFrame(sheetData1:getFrameIndex(lmu.OnLetters[spriteTable[indexText].letter]))
      isErrorSound = true
      indexText = getPrevIndex()
      setOnLetterImageLocation()
    end
  end
  textAnswer.text = " "
  textAnswer:setSelection(1, 1)
end

function guideManager.setOnLetterImage()
  onLetter = letterImage
  setOnLetterImageLocation()
end

function guideManager.reset()
  if spriteGroup then
    spriteGroup.alpha = 0
    for k, v in pairs(spriteTable) do
      if v.sprite ~= nil then
        v.sprite:removeEventListener("touch", setFocus)
        v.sprite:removeSelf()
      end
    end
    spriteTable = {}
    if letterImage ~= nil then
      letterImage:removeSelf()
      letterImage = nil
    end
  end
end

function guideManager.removeLetterImage()
  if letterImage ~= nil then
    letterImage:removeSelf()
    letterImage = nil
  end
end

function guideManager.setAnswer(answerText, isMyTurn)
  local answer = splitAnswerTxt(answerText)
  for k, v in pairs(spriteTable) do
    if v.isConst == false then
      v.letter = answer[k]
      if isMyTurn then
        v.sprite:setFrame(sheetData1:getFrameIndex(lmu.FixedLetters[v.letter]))
      else
        v.sprite:setFrame(sheetData1:getFrameIndex(lmu.OpponentLetters[v.letter]))
      end
    end
  end
end

local function isRevealLetter(answerText)
  local freeTable = {}
  local answer = splitAnswerTxt(answerText)
  local currentLetter = indexText
  local index = 1
  for k, v in pairs(spriteTable) do
    if v.letter == EMPTY_LETTER or v.letter ~= answer[k] then
      freeTable[index] = k
      index = index + 1
    end
  end
  if 1 < #freeTable then
    math.randomseed(os.time() + #freeTable)
    local rand = math.random(1, #freeTable)
    local key = freeTable[rand]
    spriteTable[key].letter = answer[key]
    spriteTable[key].isConst = true
    local oldSprite = spriteTable[key].sprite
    local newSprite = display.newSprite(sheet1, sequenceData1)
    newSprite:setFrame(sheetData1:getFrameIndex(lmu.FixedLetters[spriteTable[key].letter]))
    newSprite.alpha = 0
    newSprite.x = oldSprite.x
    newSprite.y = oldSprite.y
    newSprite:scale(scaleFactor, scaleFactor)
    transition.to(newSprite, {alpha = 1, time = 250})
    transition.to(oldSprite, {alpha = 0, time = 250})
    newSprite:removeSelf()
    spriteGroup:insert(newSprite)
    spriteTable[key].sprite = newSprite
    if key == currentLetter then
      indexText = getNextLetter()
      setOnLetterImageLocation()
    end
    return true
  end
  return false
end

function guideManager.revealLetter(answerText)
  return isRevealLetter(answerText)
end

function guideManager.isSameSize(answerText)
  local spriteTableSize = 0
  if answerText ~= nil and answerText ~= 0 then
    local answer = splitAnswerTxt(answerText)
    for k, v in pairs(spriteTable) do
      if v.letter ~= EMPTY_LETTER then
        spriteTableSize = spriteTableSize + 1
      end
    end
    if spriteTableSize == #answer then
      return true
    else
      return false
    end
  end
end

function guideManager.changeToOpponentLetters()
  for k, v in pairs(spriteTable) do
    if v.isConst == false then
      v.sprite:setFrame(sheetData1:getFrameIndex(lmu.OpponentLetters[EMPTY_LETTER]))
    else
      v.sprite:setFrame(sheetData1:getFrameIndex(lmu.OpponentLetters[v.letter]))
      v.sprite:removeEventListener("touch", setFocus)
    end
  end
  letterImage.alpha = 0
end

return guideManager
