local MessagesUtil = {}
local italyMessages = {
  SPACE = " ",
  NO_QUESTIONS_TO_DISPLAY = "Nessuna domanda mostrano",
  CURRENCY = "\226\130\172",
  APPLICATION_NAME = "Caduta Libera",
  SANGHAM_LINK = "http://www.sangham-apps.com/#!downloads/nnfmu",
  FACBOOK_CAPTION = "Clicca qui per scaricare l'App",
  FACEBOOK_SHARE = "Condividi il tuo punteggio su Facebook",
  FACEBOOK_DESC1 = "Devi ",
  FACEBOOK_DESC2 = " Euro nell'App",
  FACEBOOK_SHARE_PASS = "Condivisione riuscita",
  FACEBOOK_SHARE_FAIL = "Condivisione non riuscita",
  DIAMONDS_FINISHED = "Non hai abbastanza diamanti",
  DIAMONDS_MESSAGE = "I diamanti ti aspettano nella pagina dei risultati",
  END_GAME = "Terminare la partita?",
  END_GAME_MESSAGE = "Vuoi terminare la partita?",
  YES = "s\195\172",
  NO = "no",
  CONFIRM = "di",
  NOT_CONFIRM = "e non oltre",
  YOUR_TURN = "Il tuo turno"
}
MessagesUtil.Messges = {}

function MessagesUtil.init()
  if applicationInfo.productionName == "italy" then
    MessagesUtil.Messges = italyMessages
  end
end

return MessagesUtil
