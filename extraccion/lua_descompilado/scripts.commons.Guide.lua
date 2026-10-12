Guide = {
  isConst = false,
  row = 1,
  letter,
  sprite,
  posX = 500,
  posY = 650,
  New = function()
    local guide = {}
    for k, v in pairs(Guide) do
      guide[k] = v
    end
    return guide
  end
}
return Guide
