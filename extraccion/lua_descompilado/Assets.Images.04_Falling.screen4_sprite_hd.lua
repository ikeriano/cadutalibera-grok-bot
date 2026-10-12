local SheetInfo = {}
SheetInfo.sheet = {
  frames = {
    {
      x = 338,
      y = 858,
      width = 89,
      height = 51,
      sourceX = 67,
      sourceY = 453,
      sourceWidth = 540,
      sourceHeight = 960
    },
    {
      x = 139,
      y = 952,
      width = 89,
      height = 54,
      sourceX = 155,
      sourceY = 450,
      sourceWidth = 540,
      sourceHeight = 960
    },
    {
      x = 201,
      y = 644,
      width = 212,
      height = 212,
      sourceX = 3,
      sourceY = 4,
      sourceWidth = 217,
      sourceHeight = 220
    },
    {
      x = 201,
      y = 858,
      width = 135,
      height = 39,
      sourceX = 47,
      sourceY = 50,
      sourceWidth = 217,
      sourceHeight = 220
    },
    {
      x = 2,
      y = 949,
      width = 135,
      height = 39,
      sourceX = 47,
      sourceY = 50,
      sourceWidth = 217,
      sourceHeight = 220
    },
    {
      x = 2,
      y = 908,
      width = 140,
      height = 39,
      sourceX = 44,
      sourceY = 50,
      sourceWidth = 217,
      sourceHeight = 220
    },
    {
      x = 322,
      y = 911,
      width = 118,
      height = 39,
      sourceX = 57,
      sourceY = 50,
      sourceWidth = 217,
      sourceHeight = 220
    },
    {
      x = 201,
      y = 899,
      width = 119,
      height = 39,
      sourceX = 56,
      sourceY = 50,
      sourceWidth = 217,
      sourceHeight = 220
    },
    {
      x = 320,
      y = 952,
      width = 112,
      height = 39,
      sourceX = 63,
      sourceY = 50,
      sourceWidth = 217,
      sourceHeight = 220
    },
    {
      x = 2,
      y = 644,
      width = 197,
      height = 262,
      sourceX = 53,
      sourceY = 222,
      sourceWidth = 540,
      sourceHeight = 960
    },
    {
      x = 230,
      y = 940,
      width = 88,
      height = 51,
      sourceX = 323,
      sourceY = 453,
      sourceWidth = 540,
      sourceHeight = 960
    },
    {
      x = 139,
      y = 952,
      width = 89,
      height = 54,
      sourceX = 410,
      sourceY = 450,
      sourceWidth = 540,
      sourceHeight = 960
    },
    {
      x = 2,
      y = 2,
      width = 462,
      height = 640,
      sourceX = 62,
      sourceY = 320,
      sourceWidth = 540,
      sourceHeight = 960
    }
  },
  sheetContentWidth = 466,
  sheetContentHeight = 1008
}
SheetInfo.frameIndex = {
  left_tube_cover_l = 1,
  left_tube_cover_r = 2,
  number_circle_background = 3,
  number_circle_prize_10000 = 4,
  number_circle_prize_15000 = 5,
  number_circle_prize_20000 = 6,
  number_circle_prize_3000 = 7,
  number_circle_prize_5000 = 8,
  number_circle_prize_7000 = 9,
  prize_machine = 10,
  right_tube_cover_l = 11,
  right_tube_cover_r = 12,
  tubes_front = 13
}

function SheetInfo:getSheet()
  return self.sheet
end

function SheetInfo:getFrameIndex(name)
  return self.frameIndex[name]
end

return SheetInfo
