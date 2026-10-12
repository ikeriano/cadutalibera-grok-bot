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
      x = 4646,
      y = 2,
      width = 385,
      height = 460
    }
  },
  sheetContentWidth = 5033,
  sheetContentHeight = 926
}
SheetInfo.frameIndex = {
  ["lose_body4.1"] = 1,
  ["lose_body4.2"] = 2,
  ["lose_body4.3"] = 3,
  lose_hands4_0001 = 4,
  lose_hands4_0002 = 5,
  lose_hands4_0003 = 6,
  lose_hands4_0004 = 7,
  lose_hands4_0005 = 8,
  lose_hands4_0006 = 9,
  lose_hands4_0007 = 10,
  lose_hands4_0008 = 11,
  lose_hands4_0009 = 12,
  lose_hands4_0010 = 13,
  lose_hands4_0011 = 14,
  lose_hands4_0012 = 15,
  lose_hands4_0013 = 16,
  lose_hands4_0014 = 17,
  lose_hands4_0015 = 18,
  lose_hands4_0016 = 19,
  lose_hands4_0017 = 20,
  lose_hands4_0018 = 21,
  lose_hands4_0019 = 22,
  lose_hands4_0020 = 23,
  lose_hands4_0021 = 24,
  lose_hands4_0022 = 25,
  lose_hands4_0023 = 26
}

function SheetInfo:getSheet()
  return self.sheet
end

function SheetInfo:getFrameIndex(name)
  return self.frameIndex[name]
end

return SheetInfo
