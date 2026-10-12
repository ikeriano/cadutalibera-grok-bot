local SheetInfo = {}
SheetInfo.sheet = {
  frames = {
    {
      x = 2,
      y = 2,
      width = 512,
      height = 240,
      sourceX = 12,
      sourceY = 336,
      sourceWidth = 540,
      sourceHeight = 960
    },
    {
      x = 1030,
      y = 2,
      width = 222,
      height = 53,
      sourceX = 155,
      sourceY = 412,
      sourceWidth = 541,
      sourceHeight = 962
    },
    {
      x = 1030,
      y = 57,
      width = 222,
      height = 53,
      sourceX = 155,
      sourceY = 412,
      sourceWidth = 541,
      sourceHeight = 962
    },
    {
      x = 1030,
      y = 112,
      width = 222,
      height = 53,
      sourceX = 155,
      sourceY = 412,
      sourceWidth = 541,
      sourceHeight = 962
    },
    {
      x = 1030,
      y = 167,
      width = 222,
      height = 53,
      sourceX = 155,
      sourceY = 412,
      sourceWidth = 541,
      sourceHeight = 962
    },
    {
      x = 1254,
      y = 2,
      width = 222,
      height = 53,
      sourceX = 155,
      sourceY = 412,
      sourceWidth = 541,
      sourceHeight = 962
    },
    {
      x = 1478,
      y = 2,
      width = 222,
      height = 53,
      sourceX = 155,
      sourceY = 412,
      sourceWidth = 541,
      sourceHeight = 962
    },
    {
      x = 1254,
      y = 57,
      width = 222,
      height = 53,
      sourceX = 155,
      sourceY = 412,
      sourceWidth = 541,
      sourceHeight = 962
    },
    {
      x = 1478,
      y = 57,
      width = 222,
      height = 53,
      sourceX = 155,
      sourceY = 412,
      sourceWidth = 541,
      sourceHeight = 962
    },
    {
      x = 1254,
      y = 112,
      width = 222,
      height = 53,
      sourceX = 155,
      sourceY = 412,
      sourceWidth = 541,
      sourceHeight = 962
    },
    {
      x = 516,
      y = 2,
      width = 512,
      height = 240,
      sourceX = 12,
      sourceY = 336,
      sourceWidth = 540,
      sourceHeight = 960
    }
  },
  sheetContentWidth = 1702,
  sheetContentHeight = 244
}
SheetInfo.frameIndex = {
  Loading1_background = 1,
  Loading1_image1 = 2,
  Loading1_image2 = 3,
  Loading1_image3 = 4,
  Loading1_image4 = 5,
  Loading1_image5 = 6,
  Loading1_image6 = 7,
  Loading1_image7 = 8,
  Loading1_image8 = 9,
  Loading1_image9 = 10,
  Loading2_background = 11
}

function SheetInfo:getSheet()
  return self.sheet
end

function SheetInfo:getFrameIndex(name)
  return self.frameIndex[name]
end

return SheetInfo
