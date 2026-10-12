local SheetInfo = {}
SheetInfo.sheet = {
  frames = {
    {
      x = 2,
      y = 2,
      width = 271,
      height = 460
    },
    {
      x = 2,
      y = 464,
      width = 271,
      height = 460
    },
    {
      x = 2,
      y = 926,
      width = 271,
      height = 460
    },
    {
      x = 275,
      y = 2,
      width = 271,
      height = 460
    },
    {
      x = 275,
      y = 464,
      width = 271,
      height = 460
    },
    {
      x = 275,
      y = 926,
      width = 271,
      height = 460
    },
    {
      x = 548,
      y = 2,
      width = 271,
      height = 460
    },
    {
      x = 548,
      y = 464,
      width = 271,
      height = 460
    },
    {
      x = 548,
      y = 926,
      width = 271,
      height = 460
    },
    {
      x = 821,
      y = 2,
      width = 271,
      height = 460
    },
    {
      x = 821,
      y = 464,
      width = 271,
      height = 460
    },
    {
      x = 821,
      y = 926,
      width = 271,
      height = 460
    },
    {
      x = 821,
      y = 926,
      width = 271,
      height = 460
    },
    {
      x = 821,
      y = 926,
      width = 271,
      height = 460
    },
    {
      x = 821,
      y = 926,
      width = 271,
      height = 460
    },
    {
      x = 821,
      y = 926,
      width = 271,
      height = 460
    },
    {
      x = 821,
      y = 926,
      width = 271,
      height = 460
    },
    {
      x = 1094,
      y = 2,
      width = 271,
      height = 460
    },
    {
      x = 1094,
      y = 464,
      width = 271,
      height = 460
    },
    {
      x = 1094,
      y = 926,
      width = 271,
      height = 460
    },
    {
      x = 1367,
      y = 2,
      width = 271,
      height = 460
    },
    {
      x = 1367,
      y = 464,
      width = 271,
      height = 460
    },
    {
      x = 1367,
      y = 926,
      width = 271,
      height = 460
    },
    {
      x = 1640,
      y = 2,
      width = 271,
      height = 460
    },
    {
      x = 1640,
      y = 464,
      width = 271,
      height = 460
    },
    {
      x = 1640,
      y = 926,
      width = 271,
      height = 460
    },
    {
      x = 1913,
      y = 2,
      width = 271,
      height = 460
    },
    {
      x = 2186,
      y = 2,
      width = 271,
      height = 460
    },
    {
      x = 2459,
      y = 2,
      width = 271,
      height = 460
    },
    {
      x = 1913,
      y = 464,
      width = 271,
      height = 460
    },
    {
      x = 1913,
      y = 926,
      width = 271,
      height = 460
    },
    {
      x = 2186,
      y = 464,
      width = 271,
      height = 460
    },
    {
      x = 2186,
      y = 926,
      width = 271,
      height = 460
    },
    {
      x = 2459,
      y = 464,
      width = 271,
      height = 460
    }
  },
  sheetContentWidth = 2732,
  sheetContentHeight = 1388
}
SheetInfo.frameIndex = {
  win_body3_0001 = 1,
  win_body3_0002 = 2,
  win_body3_0003 = 3,
  win_body3_0004 = 4,
  win_body3_0005 = 5,
  win_body3_0006 = 6,
  win_body3_0007 = 7,
  win_body3_0008 = 8,
  win_body3_0009 = 9,
  win_body3_0010 = 10,
  win_body3_0011 = 11,
  win_body3_0012 = 12,
  win_body3_0013 = 13,
  win_body3_0014 = 14,
  win_body3_0015 = 15,
  win_body3_0016 = 16,
  win_body3_0017 = 17,
  win_hands3_0001 = 18,
  win_hands3_0002 = 19,
  win_hands3_0003 = 20,
  win_hands3_0004 = 21,
  win_hands3_0005 = 22,
  win_hands3_0006 = 23,
  win_hands3_0007 = 24,
  win_hands3_0008 = 25,
  win_hands3_0009 = 26,
  win_hands3_0010 = 27,
  win_hands3_0011 = 28,
  win_hands3_0012 = 29,
  win_hands3_0013 = 30,
  win_hands3_0014 = 31,
  win_hands3_0015 = 32,
  win_hands3_0016 = 33,
  win_hands3_0017 = 34
}

function SheetInfo:getSheet()
  return self.sheet
end

function SheetInfo:getFrameIndex(name)
  return self.frameIndex[name]
end

return SheetInfo
