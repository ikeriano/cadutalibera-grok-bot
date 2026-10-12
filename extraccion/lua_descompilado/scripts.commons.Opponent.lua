Opponent = {
  id = 0,
  name = 0,
  value = 0,
  valueImage = 0,
  valueImageOff = 0,
  image = 0,
  level = 0,
  playerStatus = true,
  angle = 0,
  stage = 0,
  hthImage = 0,
  dropImage = 0,
  hthCoverImage = 0,
  gender = 0,
  imageFile = 0,
  body = 0,
  New = function()
    local opp = {}
    for k, v in pairs(Opponent) do
      opp[k] = v
    end
    return opp
  end
}
return Opponent
