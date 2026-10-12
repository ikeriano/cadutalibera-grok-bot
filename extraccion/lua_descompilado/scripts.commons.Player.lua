Player = {
  id = 11,
  picName = 0,
  baseDir = 0,
  score = 0,
  scoreText = 0,
  image = 0,
  level = 0,
  hthImage = 0,
  dropImage = 0,
  endImage = 0,
  hthCoverImage = 0,
  playerStatus = true,
  gender = 0,
  roundNumber = 0,
  name = 0,
  questionNumber = 0,
  body = 0,
  stageBody = 0,
  New = function()
    local p = {}
    for k, v in pairs(Player) do
      p[k] = v
    end
    return p
  end
}
return Player
