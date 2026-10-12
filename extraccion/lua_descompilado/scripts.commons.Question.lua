Question = {
  id = 0,
  questionText = 0,
  answerText = 0,
  level = 0,
  aggLevel = 0,
  guide = 0,
  category = 0,
  valueImageFrame = 0,
  valueImageFrame = 0,
  New = function()
    local q = {}
    for k, v in pairs(Question) do
      q[k] = v
    end
    return q
  end
}
return Question
