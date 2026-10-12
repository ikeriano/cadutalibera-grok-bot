local SheetInfo = {}
SheetInfo.sheet = {
  frames = {
    {
      x = 2,
      y = 2,
      width = 385,
      height = 460
    },
    {
      x = 2,
      y = 464,
      width = 385,
      height = 460
    },
    {
      x = 2,
      y = 464,
      width = 385,
      height = 460
    },
    {
      x = 389,
      y = 2,
      width = 385,
      height = 460
    },
    {
      x = 389,
      y = 464,
      width = 385,
      height = 460
    },
    {
      x = 776,
      y = 2,
      width = 385,
      height = 460
    },
    {
      x = 776,
      y = 464,
      width = 385,
      height = 460
    },
    {
      x = 1163,
      y = 2,
      width = 385,
      height = 460
    },
    {
      x = 1163,
      y = 464,
      width = 385,
      height = 460
    },
    {
      x = 1550,
      y = 2,
      width = 385,
      height = 460
    },
    {
      x = 1550,
      y = 464,
      width = 385,
      height = 460
    },
    {
      x = 1937,
      y = 2,
      width = 385,
      height = 460
    },
    {
      x = 1937,
      y = 464,
      width = 385,
      height = 460
    },
    {
      x = 2324,
      y = 2,
      width = 385,
      height = 460
    },
    {
      x = 2324,
      y = 464,
      width = 385,
      height = 460
    },
    {
      x = 2711,
      y = 2,
      width = 385,
      height = 460
    },
    {
      x = 2711,
      y = 464,
      width = 385,
      height = 460
    },
    {
      x = 3098,
      y = 2,
      width = 385,
      height = 460
    },
    {
      x = 3098,
      y = 464,
      width = 385,
      height = 460
    },
    {
      x = 3485,
      y = 2,
      width = 385,
      height = 460
    },
    {
      x = 3485,
      y = 464,
      width = 385,
      height = 460
    },
    {
      x = 3872,
      y = 2,
      width = 385,
      height = 460
    },
    {
      x = 3872,
      y = 464,
      width = 385,
      height = 460
    },
    {
      x = 4259,
      y = 2,
      width = 385,
      height = 460
    },
    {
      x = 4259,
      y = 464,
      width = 385,
      height = 460
    },
    {
      x = 2711,
      y = 2,
      width = 385,
      height = 460
    }
  },
  sheetContentWidth = 4646,
  sheetContentHeight = 926
}
SheetInfo.frameIndex = {
  ["lose_body2.1"] = 1,
  ["lose_body2.2"] = 2,
  ["lose_body2.3"] = 3,
  lose_hands2_0001 = 4,
  lose_hands2_0002 = 5,
  lose_hands2_0003 = 6,
  lose_hands2_0004 = 7,
  lose_hands2_0005 = 8,
  lose_hands2_0006 = 9,
  lose_hands2_0007 = 10,
  lose_hands2_0008 = 11,
  lose_hands2_0009 = 12,
  lose_hands2_0010 = 13,
  lose_hands2_0011 = 14,
  lose_hands2_0012 = 15,
  lose_hands2_0013 = 16,
  lose_hands2_0014 = 17,
  lose_hands2_0015 = 18,
  lose_hands2_0016 = 19,
  lose_hands2_0017 = 20,
  lose_hands2_0018 = 21,
  lose_hands2_0019 = 22,
  lose_hands2_0020 = 23,
  lose_hands2_0021 = 24,
  lose_hands2_0022 = 25,
  lose_hands2_0023 = 26
}

function SheetInfo:getSheet()
  return self.sheet
end

function SheetInfo:getFrameIndex(name)
  return self.frameIndex[name]
end

return SheetInfo
