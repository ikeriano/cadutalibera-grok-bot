local GameAnalyticsUtil = {}
local analytics = require("analytics")
local apiKey

function GameAnalyticsUtil.init()
  if platformName == "Android" then
    apiKey = applicationInfo.gameAnalyticsAndroid
  else
    apiKey = applicationInfo.gameAnalyticsIos
  end
  analytics.init(apiKey)
end

local function tableToPrint(myTable)
  local tableContent = ""
  for k, v in pairs(myTable) do
    tableContent = tableContent .. "  |  " .. tostring(k) .. " - " .. tostring(v)
  end
  return tableContent
end

function GameAnalyticsUtil.logEvent(eventName, eventJson)
  log:log("Event Name - " .. eventName .. "    Event Params < ", eventJson, " >")
  analytics.logEvent(eventName, eventJson)
end

return GameAnalyticsUtil
