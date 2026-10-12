local QuestionsUtil = {}
local Question = require("scripts.commons.Question")
local recordedGameUtil = require("scripts.utils.RecordedGameUtil")
local toast = require("plugin.toast")
local composer = require("composer")
local EMPTY_LETTER = "^"
local Questions = {
  {
    id = 1,
    questionText = "who are you ? ",
    answerText = "my test",
    baseLevel = 1,
    aggLevel = 2,
    guide = "m^ T^^^",
    category = "sport"
  }
}
local midLevels = {
  {
    {
      uplevel = 1,
      downLevel = 1,
      guideMod = 3
    },
    {
      uplevel = 1,
      downLevel = 1,
      guideMod = 3
    },
    {
      uplevel = 1,
      downLevel = 1,
      guideMod = 3
    },
    {
      uplevel = 1,
      downLevel = 1,
      guideMod = 4
    },
    {
      uplevel = 1,
      downLevel = 1,
      guideMod = 4
    },
    {
      uplevel = 1,
      downLevel = 1,
      guideMod = 4
    },
    {
      uplevel = 2,
      downLevel = 1,
      guideMod = 3
    },
    {
      uplevel = 2,
      downLevel = 1,
      guideMod = 3
    }
  },
  {
    {
      uplevel = 1,
      downLevel = 1,
      guideMod = 3
    },
    {
      uplevel = 1,
      downLevel = 1,
      guideMod = 3
    },
    {
      uplevel = 1,
      downLevel = 1,
      guideMod = 4
    },
    {
      uplevel = 2,
      downLevel = 1,
      guideMod = 3
    },
    {
      uplevel = 2,
      downLevel = 1,
      guideMod = 3
    },
    {
      uplevel = 2,
      downLevel = 1,
      guideMod = 4
    },
    {
      uplevel = 2,
      downLevel = 1,
      guideMod = 4
    },
    {
      uplevel = 2,
      downLevel = 1,
      guideMod = 4
    }
  },
  {
    {
      uplevel = 1,
      downLevel = 1,
      guideMod = 4
    },
    {
      uplevel = 1,
      downLevel = 1,
      guideMod = 4
    },
    {
      uplevel = 2,
      downLevel = 1,
      guideMod = 3
    },
    {
      uplevel = 1,
      downLevel = 1,
      guideMod = 6
    },
    {
      uplevel = 2,
      downLevel = 1,
      guideMod = 3
    },
    {
      uplevel = 2,
      downLevel = 1,
      guideMod = 3
    },
    {
      uplevel = 3,
      downLevel = 1,
      guideMod = 3
    },
    {
      uplevel = 3,
      downLevel = 1,
      guideMod = 3
    }
  },
  {
    {
      uplevel = 1,
      downLevel = 1,
      guideMod = 5
    },
    {
      uplevel = 2,
      downLevel = 1,
      guideMod = 4
    },
    {
      uplevel = 2,
      downLevel = 1,
      guideMod = 3
    },
    {
      uplevel = 2,
      downLevel = 1,
      guideMod = 3
    },
    {
      uplevel = 2,
      downLevel = 1,
      guideMod = 3
    },
    {
      uplevel = 2,
      downLevel = 1,
      guideMod = 3
    },
    {
      uplevel = 2,
      downLevel = 1,
      guideMod = 4
    },
    {
      uplevel = 2,
      downLevel = 1,
      guideMod = 4
    }
  },
  {
    {
      uplevel = 2,
      downLevel = 1,
      guideMod = 3
    },
    {
      uplevel = 2,
      downLevel = 1,
      guideMod = 3
    },
    {
      uplevel = 2,
      downLevel = 1,
      guideMod = 3
    },
    {
      uplevel = 2,
      downLevel = 1,
      guideMod = 4
    },
    {
      uplevel = 2,
      downLevel = 1,
      guideMod = 4
    },
    {
      uplevel = 3,
      downLevel = 2,
      guideMod = 3
    },
    {
      uplevel = 3,
      downLevel = 2,
      guideMod = 3
    },
    {
      uplevel = 3,
      downLevel = 2,
      guideMod = 4
    }
  },
  {
    {
      uplevel = 2,
      downLevel = 1,
      guideMod = 4
    },
    {
      uplevel = 2,
      downLevel = 1,
      guideMod = 4
    },
    {
      uplevel = 2,
      downLevel = 1,
      guideMod = 5
    },
    {
      uplevel = 3,
      downLevel = 2,
      guideMod = 4
    },
    {
      uplevel = 3,
      downLevel = 2,
      guideMod = 4
    },
    {
      uplevel = 3,
      downLevel = 2,
      guideMod = 4
    },
    {
      uplevel = 3,
      downLevel = 2,
      guideMod = 5
    },
    {
      uplevel = 3,
      downLevel = 2,
      guideMod = 5
    }
  },
  {
    {
      uplevel = 2,
      downLevel = 1,
      guideMod = 4
    },
    {
      uplevel = 3,
      downLevel = 2,
      guideMod = 3
    },
    {
      uplevel = 3,
      downLevel = 2,
      guideMod = 4
    },
    {
      uplevel = 3,
      downLevel = 2,
      guideMod = 4
    },
    {
      uplevel = 3,
      downLevel = 2,
      guideMod = 4
    },
    {
      uplevel = 3,
      downLevel = 2,
      guideMod = 5
    },
    {
      uplevel = 3,
      downLevel = 2,
      guideMod = 5
    },
    {
      uplevel = 4,
      downLevel = 3,
      guideMod = 3
    }
  },
  {
    {
      uplevel = 3,
      downLevel = 2,
      guideMod = 3
    },
    {
      uplevel = 3,
      downLevel = 2,
      guideMod = 4
    },
    {
      uplevel = 3,
      downLevel = 2,
      guideMod = 4
    },
    {
      uplevel = 3,
      downLevel = 2,
      guideMod = 5
    },
    {
      uplevel = 4,
      downLevel = 3,
      guideMod = 3
    },
    {
      uplevel = 4,
      downLevel = 3,
      guideMod = 4
    },
    {
      uplevel = 4,
      downLevel = 3,
      guideMod = 4
    },
    {
      uplevel = 4,
      downLevel = 3,
      guideMod = 4
    }
  },
  {
    {
      uplevel = 3,
      downLevel = 2,
      guideMod = 4
    },
    {
      uplevel = 3,
      downLevel = 2,
      guideMod = 4
    },
    {
      uplevel = 4,
      downLevel = 3,
      guideMod = 3
    },
    {
      uplevel = 4,
      downLevel = 3,
      guideMod = 4
    },
    {
      uplevel = 4,
      downLevel = 3,
      guideMod = 4
    },
    {
      uplevel = 4,
      downLevel = 3,
      guideMod = 5
    },
    {
      uplevel = 4,
      downLevel = 3,
      guideMod = 5
    },
    {
      uplevel = 4,
      downLevel = 3,
      guideMod = 5
    }
  },
  {
    {
      uplevel = 4,
      downLevel = 3,
      guideMod = 4
    },
    {
      uplevel = 4,
      downLevel = 3,
      guideMod = 4
    },
    {
      uplevel = 4,
      downLevel = 3,
      guideMod = 4
    },
    {
      uplevel = 4,
      downLevel = 3,
      guideMod = 5
    },
    {
      uplevel = 4,
      downLevel = 3,
      guideMod = 5
    },
    {
      uplevel = 4,
      downLevel = 3,
      guideMod = 6
    },
    {
      uplevel = 4,
      downLevel = 3,
      guideMod = 6
    },
    {
      uplevel = 4,
      downLevel = 3,
      guideMod = 6
    }
  }
}
local easyLevels = {
  {
    {
      uplevel = 1,
      downLevel = 0,
      guideMod = 2
    },
    {
      uplevel = 1,
      downLevel = 0,
      guideMod = 2
    },
    {
      uplevel = 1,
      downLevel = 0,
      guideMod = 2
    },
    {
      uplevel = 1,
      downLevel = 0,
      guideMod = 3
    },
    {
      uplevel = 1,
      downLevel = 0,
      guideMod = 4
    },
    {
      uplevel = 1,
      downLevel = 0,
      guideMod = 4
    },
    {
      uplevel = 2,
      downLevel = 0,
      guideMod = 3
    },
    {
      uplevel = 2,
      downLevel = 0,
      guideMod = 3
    }
  },
  {
    {
      uplevel = 1,
      downLevel = 0,
      guideMod = 2
    },
    {
      uplevel = 1,
      downLevel = 0,
      guideMod = 2
    },
    {
      uplevel = 1,
      downLevel = 0,
      guideMod = 3
    },
    {
      uplevel = 2,
      downLevel = 1,
      guideMod = 2
    },
    {
      uplevel = 2,
      downLevel = 1,
      guideMod = 3
    },
    {
      uplevel = 2,
      downLevel = 1,
      guideMod = 4
    },
    {
      uplevel = 2,
      downLevel = 1,
      guideMod = 4
    },
    {
      uplevel = 2,
      downLevel = 1,
      guideMod = 4
    }
  },
  {
    {
      uplevel = 1,
      downLevel = 0,
      guideMod = 3
    },
    {
      uplevel = 1,
      downLevel = 0,
      guideMod = 3
    },
    {
      uplevel = 2,
      downLevel = 1,
      guideMod = 2
    },
    {
      uplevel = 1,
      downLevel = 1,
      guideMod = 4
    },
    {
      uplevel = 2,
      downLevel = 1,
      guideMod = 3
    },
    {
      uplevel = 2,
      downLevel = 1,
      guideMod = 3
    },
    {
      uplevel = 3,
      downLevel = 1,
      guideMod = 3
    },
    {
      uplevel = 3,
      downLevel = 1,
      guideMod = 3
    }
  },
  {
    {
      uplevel = 1,
      downLevel = 1,
      guideMod = 4
    },
    {
      uplevel = 2,
      downLevel = 1,
      guideMod = 3
    },
    {
      uplevel = 2,
      downLevel = 1,
      guideMod = 3
    },
    {
      uplevel = 2,
      downLevel = 1,
      guideMod = 3
    },
    {
      uplevel = 2,
      downLevel = 1,
      guideMod = 3
    },
    {
      uplevel = 2,
      downLevel = 1,
      guideMod = 3
    },
    {
      uplevel = 2,
      downLevel = 1,
      guideMod = 4
    },
    {
      uplevel = 2,
      downLevel = 1,
      guideMod = 4
    }
  },
  {
    {
      uplevel = 2,
      downLevel = 1,
      guideMod = 3
    },
    {
      uplevel = 2,
      downLevel = 1,
      guideMod = 3
    },
    {
      uplevel = 2,
      downLevel = 1,
      guideMod = 3
    },
    {
      uplevel = 2,
      downLevel = 1,
      guideMod = 4
    },
    {
      uplevel = 2,
      downLevel = 1,
      guideMod = 4
    },
    {
      uplevel = 3,
      downLevel = 2,
      guideMod = 3
    },
    {
      uplevel = 3,
      downLevel = 2,
      guideMod = 3
    },
    {
      uplevel = 3,
      downLevel = 2,
      guideMod = 4
    }
  },
  {
    {
      uplevel = 2,
      downLevel = 1,
      guideMod = 4
    },
    {
      uplevel = 2,
      downLevel = 1,
      guideMod = 4
    },
    {
      uplevel = 2,
      downLevel = 1,
      guideMod = 5
    },
    {
      uplevel = 3,
      downLevel = 2,
      guideMod = 4
    },
    {
      uplevel = 3,
      downLevel = 2,
      guideMod = 4
    },
    {
      uplevel = 3,
      downLevel = 2,
      guideMod = 4
    },
    {
      uplevel = 3,
      downLevel = 2,
      guideMod = 5
    },
    {
      uplevel = 3,
      downLevel = 2,
      guideMod = 5
    }
  },
  {
    {
      uplevel = 2,
      downLevel = 1,
      guideMod = 4
    },
    {
      uplevel = 3,
      downLevel = 2,
      guideMod = 3
    },
    {
      uplevel = 3,
      downLevel = 2,
      guideMod = 4
    },
    {
      uplevel = 3,
      downLevel = 2,
      guideMod = 4
    },
    {
      uplevel = 3,
      downLevel = 2,
      guideMod = 4
    },
    {
      uplevel = 3,
      downLevel = 2,
      guideMod = 5
    },
    {
      uplevel = 3,
      downLevel = 2,
      guideMod = 5
    },
    {
      uplevel = 4,
      downLevel = 3,
      guideMod = 3
    }
  },
  {
    {
      uplevel = 3,
      downLevel = 2,
      guideMod = 3
    },
    {
      uplevel = 3,
      downLevel = 2,
      guideMod = 4
    },
    {
      uplevel = 3,
      downLevel = 2,
      guideMod = 4
    },
    {
      uplevel = 3,
      downLevel = 2,
      guideMod = 5
    },
    {
      uplevel = 4,
      downLevel = 3,
      guideMod = 3
    },
    {
      uplevel = 4,
      downLevel = 3,
      guideMod = 4
    },
    {
      uplevel = 4,
      downLevel = 3,
      guideMod = 4
    },
    {
      uplevel = 4,
      downLevel = 3,
      guideMod = 4
    }
  },
  {
    {
      uplevel = 3,
      downLevel = 2,
      guideMod = 4
    },
    {
      uplevel = 3,
      downLevel = 2,
      guideMod = 4
    },
    {
      uplevel = 4,
      downLevel = 3,
      guideMod = 3
    },
    {
      uplevel = 4,
      downLevel = 3,
      guideMod = 4
    },
    {
      uplevel = 4,
      downLevel = 3,
      guideMod = 4
    },
    {
      uplevel = 4,
      downLevel = 3,
      guideMod = 5
    },
    {
      uplevel = 4,
      downLevel = 3,
      guideMod = 5
    },
    {
      uplevel = 4,
      downLevel = 3,
      guideMod = 5
    }
  },
  {
    {
      uplevel = 4,
      downLevel = 3,
      guideMod = 4
    },
    {
      uplevel = 4,
      downLevel = 3,
      guideMod = 4
    },
    {
      uplevel = 4,
      downLevel = 3,
      guideMod = 4
    },
    {
      uplevel = 4,
      downLevel = 3,
      guideMod = 5
    },
    {
      uplevel = 4,
      downLevel = 3,
      guideMod = 5
    },
    {
      uplevel = 4,
      downLevel = 3,
      guideMod = 6
    },
    {
      uplevel = 4,
      downLevel = 3,
      guideMod = 6
    },
    {
      uplevel = 4,
      downLevel = 3,
      guideMod = 6
    }
  }
}
local hardLevels = {
  {
    {
      uplevel = 1,
      downLevel = 1,
      guideMod = 3
    },
    {
      uplevel = 1,
      downLevel = 1,
      guideMod = 3
    },
    {
      uplevel = 1,
      downLevel = 1,
      guideMod = 3
    },
    {
      uplevel = 2,
      downLevel = 1,
      guideMod = 4
    },
    {
      uplevel = 2,
      downLevel = 1,
      guideMod = 4
    },
    {
      uplevel = 2,
      downLevel = 1,
      guideMod = 3
    },
    {
      uplevel = 2,
      downLevel = 1,
      guideMod = 3
    },
    {
      uplevel = 2,
      downLevel = 1,
      guideMod = 3
    }
  },
  {
    {
      uplevel = 1,
      downLevel = 1,
      guideMod = 3
    },
    {
      uplevel = 2,
      downLevel = 1,
      guideMod = 3
    },
    {
      uplevel = 2,
      downLevel = 1,
      guideMod = 3
    },
    {
      uplevel = 2,
      downLevel = 1,
      guideMod = 3
    },
    {
      uplevel = 2,
      downLevel = 1,
      guideMod = 3
    },
    {
      uplevel = 2,
      downLevel = 1,
      guideMod = 3
    },
    {
      uplevel = 3,
      downLevel = 1,
      guideMod = 4
    },
    {
      uplevel = 3,
      downLevel = 1,
      guideMod = 4
    }
  },
  {
    {
      uplevel = 2,
      downLevel = 1,
      guideMod = 4
    },
    {
      uplevel = 2,
      downLevel = 1,
      guideMod = 3
    },
    {
      uplevel = 2,
      downLevel = 1,
      guideMod = 3
    },
    {
      uplevel = 2,
      downLevel = 1,
      guideMod = 4
    },
    {
      uplevel = 2,
      downLevel = 1,
      guideMod = 4
    },
    {
      uplevel = 2,
      downLevel = 1,
      guideMod = 4
    },
    {
      uplevel = 3,
      downLevel = 1,
      guideMod = 3
    },
    {
      uplevel = 3,
      downLevel = 1,
      guideMod = 3
    }
  },
  {
    {
      uplevel = 2,
      downLevel = 1,
      guideMod = 4
    },
    {
      uplevel = 2,
      downLevel = 1,
      guideMod = 4
    },
    {
      uplevel = 3,
      downLevel = 1,
      guideMod = 4
    },
    {
      uplevel = 3,
      downLevel = 2,
      guideMod = 4
    },
    {
      uplevel = 3,
      downLevel = 2,
      guideMod = 4
    },
    {
      uplevel = 3,
      downLevel = 2,
      guideMod = 4
    },
    {
      uplevel = 3,
      downLevel = 2,
      guideMod = 5
    },
    {
      uplevel = 3,
      downLevel = 2,
      guideMod = 5
    }
  },
  {
    {
      uplevel = 3,
      downLevel = 2,
      guideMod = 3
    },
    {
      uplevel = 3,
      downLevel = 2,
      guideMod = 3
    },
    {
      uplevel = 3,
      downLevel = 2,
      guideMod = 4
    },
    {
      uplevel = 3,
      downLevel = 2,
      guideMod = 4
    },
    {
      uplevel = 3,
      downLevel = 2,
      guideMod = 5
    },
    {
      uplevel = 3,
      downLevel = 2,
      guideMod = 5
    },
    {
      uplevel = 4,
      downLevel = 2,
      guideMod = 3
    },
    {
      uplevel = 4,
      downLevel = 2,
      guideMod = 3
    }
  },
  {
    {
      uplevel = 3,
      downLevel = 2,
      guideMod = 4
    },
    {
      uplevel = 3,
      downLevel = 2,
      guideMod = 4
    },
    {
      uplevel = 3,
      downLevel = 2,
      guideMod = 4
    },
    {
      uplevel = 3,
      downLevel = 2,
      guideMod = 5
    },
    {
      uplevel = 3,
      downLevel = 2,
      guideMod = 5
    },
    {
      uplevel = 3,
      downLevel = 2,
      guideMod = 5
    },
    {
      uplevel = 4,
      downLevel = 3,
      guideMod = 3
    },
    {
      uplevel = 4,
      downLevel = 3,
      guideMod = 3
    }
  },
  {
    {
      uplevel = 3,
      downLevel = 2,
      guideMod = 4
    },
    {
      uplevel = 3,
      downLevel = 2,
      guideMod = 5
    },
    {
      uplevel = 4,
      downLevel = 2,
      guideMod = 3
    },
    {
      uplevel = 4,
      downLevel = 2,
      guideMod = 3
    },
    {
      uplevel = 4,
      downLevel = 2,
      guideMod = 4
    },
    {
      uplevel = 4,
      downLevel = 3,
      guideMod = 4
    },
    {
      uplevel = 4,
      downLevel = 3,
      guideMod = 4
    },
    {
      uplevel = 4,
      downLevel = 3,
      guideMod = 4
    }
  },
  {
    {
      uplevel = 4,
      downLevel = 3,
      guideMod = 3
    },
    {
      uplevel = 4,
      downLevel = 3,
      guideMod = 4
    },
    {
      uplevel = 4,
      downLevel = 3,
      guideMod = 4
    },
    {
      uplevel = 4,
      downLevel = 3,
      guideMod = 4
    },
    {
      uplevel = 4,
      downLevel = 3,
      guideMod = 4
    },
    {
      uplevel = 4,
      downLevel = 3,
      guideMod = 5
    },
    {
      uplevel = 4,
      downLevel = 3,
      guideMod = 5
    },
    {
      uplevel = 4,
      downLevel = 3,
      guideMod = 5
    }
  },
  {
    {
      uplevel = 3,
      downLevel = 2,
      guideMod = 4
    },
    {
      uplevel = 3,
      downLevel = 2,
      guideMod = 4
    },
    {
      uplevel = 4,
      downLevel = 3,
      guideMod = 3
    },
    {
      uplevel = 4,
      downLevel = 3,
      guideMod = 4
    },
    {
      uplevel = 4,
      downLevel = 3,
      guideMod = 4
    },
    {
      uplevel = 4,
      downLevel = 3,
      guideMod = 5
    },
    {
      uplevel = 4,
      downLevel = 3,
      guideMod = 5
    },
    {
      uplevel = 4,
      downLevel = 3,
      guideMod = 5
    }
  },
  {
    {
      uplevel = 4,
      downLevel = 3,
      guideMod = 4
    },
    {
      uplevel = 4,
      downLevel = 3,
      guideMod = 4
    },
    {
      uplevel = 4,
      downLevel = 3,
      guideMod = 4
    },
    {
      uplevel = 4,
      downLevel = 3,
      guideMod = 5
    },
    {
      uplevel = 4,
      downLevel = 3,
      guideMod = 5
    },
    {
      uplevel = 4,
      downLevel = 3,
      guideMod = 6
    },
    {
      uplevel = 4,
      downLevel = 3,
      guideMod = 6
    },
    {
      uplevel = 4,
      downLevel = 3,
      guideMod = 6
    }
  }
}
local pairQuestions, category

function QuestionsUtil.splitAnswerTxt(answer)
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

function QuestionsUtil.setGuide(answer, guideMod)
  local answerTable = QuestionsUtil.splitAnswerTxt(answer)
  local index = 1
  local mod = guideMod
  if mod == nil or mod == 0 then
    mod = 3
  end
  for k, v in pairs(answerTable) do
    if answerTable[k] ~= " " then
      if index % mod ~= 0 then
        answerTable[k] = EMPTY_LETTER
      end
      index = index + 1
    end
  end
  return answerTable
end

local function printTable(tableToPrint)
  local printString = ""
  for k, v in pairs(tableToPrint) do
    printString = printString .. "| " .. k .. "<" .. v .. ">"
  end
  return printString
end

local function getPairQuestions(roundNumber, questionNumber)
  local maxlevel = 3
  local minLevel = 1
  local guideMod = 4
  log:log("roundNumber - ", roundNumber, "  questionNumber - ", questionNumber)
  local selectedLevel
  local level = levelManager.getLevel()
  log:log("level", level)
  if level == 1 then
    selectedLevel = easyLevels
  elseif level == 2 then
    selectedLevel = midLevels
  else
    selectedLevel = hardLevels
  end
  local questionCriteria = selectedLevel[roundNumber][questionNumber]
  if questionCriteria ~= nil then
    guideMod = questionCriteria.guideMod
    minLevel = questionCriteria.downLevel
    maxlevel = questionCriteria.uplevel
  else
    log:log("got nil value for questionCriteria", questionCriteria, " Round", roundNumber, " questionNumber", questionNumber)
  end
  local question
  if showMode then
    question = recordedGameUtil.getQuestion(roundNumber, questionNumber)
  end
  if question == nil then
    question = persistenceUtil.getQuestion(category, minLevel, maxlevel)
  end
  if question == nil or question.id == nil then
    question = persistenceUtil.getAnyQuestion(category, 1, 4)
  end
  if question == nil or question.id == nil then
    local numberOfQuestions = persistenceUtil.countQuestions()
    if 0 < numberOfQuestions then
      persistenceUtil.deleteQuestions()
    end
    toast.show(messagesUtil.Messges.NO_QUESTIONS_TO_DISPLAY, {duration = "short", gravity = "Center"})
  else
    log:log("questionId - ", question.id, "question server_id", question.server_id)
    pairQuestions = Question.New()
    pairQuestions.id = question.id
    pairQuestions.level = question.level
    pairQuestions.questionText = question.question
    pairQuestions.answerText = string.lower(question.answer)
    pairQuestions.category = question.category
  end
  if question.hint == nil or question.hint == "" then
    pairQuestions.guide = QuestionsUtil.setGuide(question.answer, guideMod)
  else
    question.hint = string.lower(question.hint)
    pairQuestions.guide = QuestionsUtil.splitAnswerTxt(question.hint)
  end
  return pairQuestions
end

function QuestionsUtil.getQuestion(roundNumber, questionNumber)
  return getPairQuestions(roundNumber, questionNumber)
end

function QuestionsUtil.alignOppnentQuestionEndOfGame()
  persistenceUtil.deleteExpiredQuestion()
end

return QuestionsUtil
