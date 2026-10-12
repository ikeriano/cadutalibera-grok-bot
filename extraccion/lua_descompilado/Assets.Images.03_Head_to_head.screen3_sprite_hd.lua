local SheetInfo = {}
SheetInfo.sheet = {
  frames = {
    {
      x = 725,
      y = 2,
      width = 89,
      height = 55,
      sourceX = 8,
      sourceY = 97,
      sourceWidth = 540,
      sourceHeight = 960
    },
    {
      x = 480,
      y = 474,
      width = 85,
      height = 36,
      sourceX = 10,
      sourceY = 146,
      sourceWidth = 540,
      sourceHeight = 960
    },
    {
      x = 725,
      y = 59,
      width = 85,
      height = 52,
      sourceX = 10,
      sourceY = 97,
      sourceWidth = 540,
      sourceHeight = 960
    },
    {
      x = 480,
      y = 320,
      width = 145,
      height = 152
    },
    {
      x = 2,
      y = 320,
      width = 171,
      height = 177
    },
    {
      x = 2,
      y = 2,
      width = 540,
      height = 316,
      sourceX = 0,
      sourceY = 0,
      sourceWidth = 540,
      sourceHeight = 960
    },
    {
      x = 627,
      y = 422,
      width = 171,
      height = 61,
      sourceX = 197,
      sourceY = 235,
      sourceWidth = 540,
      sourceHeight = 960
    },
    {
      x = 175,
      y = 320,
      width = 303,
      height = 163,
      sourceX = 135,
      sourceY = 44,
      sourceWidth = 540,
      sourceHeight = 960
    },
    {
      x = 725,
      y = 113,
      width = 84,
      height = 84,
      sourceX = 452,
      sourceY = 93,
      sourceWidth = 540,
      sourceHeight = 960
    },
    {
      x = 725,
      y = 199,
      width = 84,
      height = 84,
      sourceX = 452,
      sourceY = 166,
      sourceWidth = 540,
      sourceHeight = 960
    },
    {
      x = 725,
      y = 285,
      width = 84,
      height = 84,
      sourceX = 452,
      sourceY = 10,
      sourceWidth = 540,
      sourceHeight = 960
    },
    {
      x = 627,
      y = 288,
      width = 65,
      height = 65
    },
    {
      x = 694,
      y = 371,
      width = 139,
      height = 43
    },
    {
      x = 627,
      y = 355,
      width = 65,
      height = 65
    },
    {
      x = 544,
      y = 2,
      width = 179,
      height = 284
    }
  },
  sheetContentWidth = 840,
  sheetContentHeight = 512
}
SheetInfo.frameIndex = {
  diamonds_bg = 1,
  diamonds_count_bg = 2,
  diamonds_on = 3,
  head_frame_offturn = 4,
  head_frame_onturn = 5,
  ["message_3-power-diamonds_bg"] = 6,
  ["message_3-power-diamonds_button"] = 7,
  ["message_3-power-diamonds_label"] = 8,
  powerup_moreletter = 9,
  powerup_moretime = 10,
  powerup_passquestion = 11,
  timer_left = 12,
  timer_middle = 13,
  timer_right = 14,
  turn_indicator = 15
}

function SheetInfo:getSheet()
  return self.sheet
end

function SheetInfo:getFrameIndex(name)
  return self.frameIndex[name]
end

return SheetInfo
