local SheetInfo = {}
SheetInfo.sheet = {
  frames = {
    {
      x = 2,
      y = 722,
      width = 200,
      height = 200
    },
    {
      x = 204,
      y = 722,
      width = 200,
      height = 200
    },
    {
      x = 2,
      y = 924,
      width = 200,
      height = 200
    },
    {
      x = 204,
      y = 924,
      width = 200,
      height = 200
    },
    {
      x = 2,
      y = 1126,
      width = 200,
      height = 200
    },
    {
      x = 204,
      y = 1126,
      width = 200,
      height = 200
    },
    {
      x = 2,
      y = 1328,
      width = 200,
      height = 200
    },
    {
      x = 2,
      y = 1530,
      width = 200,
      height = 200
    },
    {
      x = 204,
      y = 1328,
      width = 200,
      height = 200
    },
    {
      x = 204,
      y = 1530,
      width = 200,
      height = 200
    },
    {
      x = 2,
      y = 2,
      width = 447,
      height = 718,
      sourceX = 64,
      sourceY = 888,
      sourceWidth = 1082,
      sourceHeight = 1924
    }
  },
  sheetContentWidth = 451,
  sheetContentHeight = 1732
}
SheetInfo.frameIndex = {
  ["1"] = 1,
  ["10"] = 2,
  ["2"] = 3,
  ["3"] = 4,
  ["4"] = 5,
  ["5"] = 6,
  ["6"] = 7,
  ["7"] = 8,
  ["8"] = 9,
  ["9"] = 10,
  split_program_label = 11
}

function SheetInfo:getSheet()
  return self.sheet
end

function SheetInfo:getFrameIndex(name)
  return self.frameIndex[name]
end

return SheetInfo
