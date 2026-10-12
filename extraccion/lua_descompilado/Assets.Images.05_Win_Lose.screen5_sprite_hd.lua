local SheetInfo = {}
SheetInfo.sheet = {
  frames = {
    {
      x = 525,
      y = 1224,
      width = 453,
      height = 523,
      sourceX = 56,
      sourceY = 81,
      sourceWidth = 541,
      sourceHeight = 960
    },
    {
      x = 2,
      y = 2,
      width = 541,
      height = 646,
      sourceX = 0,
      sourceY = 0,
      sourceWidth = 541,
      sourceHeight = 960
    },
    {
      x = 525,
      y = 650,
      width = 470,
      height = 572,
      sourceX = 31,
      sourceY = 33,
      sourceWidth = 541,
      sourceHeight = 960
    },
    {
      x = 2,
      y = 1297,
      width = 521,
      height = 631,
      sourceX = 14,
      sourceY = 0,
      sourceWidth = 541,
      sourceHeight = 960
    },
    {
      x = 2,
      y = 650,
      width = 521,
      height = 645,
      sourceX = 14,
      sourceY = 0,
      sourceWidth = 541,
      sourceHeight = 960
    },
    {
      x = 545,
      y = 124,
      width = 190,
      height = 65,
      sourceX = 175,
      sourceY = 823,
      sourceWidth = 541,
      sourceHeight = 960
    },
    {
      x = 545,
      y = 2,
      width = 422,
      height = 120,
      sourceX = 60,
      sourceY = 664,
      sourceWidth = 541,
      sourceHeight = 960
    },
    {
      x = 737,
      y = 124,
      width = 124,
      height = 128,
      sourceX = 214,
      sourceY = 241,
      sourceWidth = 541,
      sourceHeight = 960
    }
  },
  sheetContentWidth = 997,
  sheetContentHeight = 1930
}
SheetInfo.frameIndex = {
  ["1-2_graphic"] = 1,
  ["10_graphic"] = 2,
  ["3-5_graphic"] = 3,
  ["6-7_graphic"] = 4,
  ["8-9_graphic"] = 5,
  button_restart = 6,
  button_share_win = 7,
  profile_frame = 8
}

function SheetInfo:getSheet()
  return self.sheet
end

function SheetInfo:getFrameIndex(name)
  return self.frameIndex[name]
end

return SheetInfo
