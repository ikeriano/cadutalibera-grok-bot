-- ¡Ahora Caigo! campeón edition · cliente: menú (igual que la app), duelos de palabras con relojes, juego final
local Players = game:GetService("Players")
local RS = game:GetService("ReplicatedStorage")
local RunService = game:GetService("RunService")
local SoundService = game:GetService("SoundService")
local UI = require(RS:WaitForChild("UI"))
local Camaras = require(RS:WaitForChild("Camaras"))
local Imagenes = require(RS:WaitForChild("Imagenes"))
local Preguntas = require(RS:WaitForChild("Preguntas"))
local Ev = RS:WaitForChild("Eventos")
local jugador = Players.LocalPlayer
local gui = script.Parent

local PRESENTADOR = "Adrián Vega"
local ESCALERA = { 1000, 2500, 5000, 10000, 15000, 25000, 35000, 50000 }
local RIVALES = { "Pili", "Chema", "Marga", "Ramón", "Encarna", "Paco", "Lola", "Toñi", "Manolo", "Rocío", "Julián", "Maite", "Fermín", "Susi" }

local function suena(n) local s = SoundService:FindFirstChild(n); if s then s:Play() end end
local function para(n) local s = SoundService:FindFirstChild(n); if s then s:Stop() end end
Ev.Sonido.OnClientEvent:Connect(suena)
local function musica(n) for _, m in ipairs({ "MusicaMenu", "MusicaDuelo", "MusicaFinal" }) do if m ~= n then para(m) end end; if n then local s = SoundService:FindFirstChild(n); if s and not s.IsPlaying then s:Play() end end end

local ui = UI.new(gui, {
	icono = "huellas", tag = "EL JUEGO · 3D", version = "Roblox v1.13", logoImagen = Imagenes.LogoMenu,
	logo = { { t = "¡AHORA", c = Color3.new(1, 1, 1), h = 1 }, { t = "CAIGO!", c = Color3.new(1, 1, 1), h = 1 }, { t = "campeón edition", c = Color3.fromRGB(255, 210, 58), h = 0.5 } },
})
Camaras.crear(gui, UI)
ui.alPulsar = function() suena("Tecla") end

-- botón ☰ para volver al menú durante la partida
local partida = 0
local btnMenu = UI.botonJuego(gui, "☰", UDim2.new(1, -60, 0, 10), UDim2.new(0, 50, 0, 44), Color3.fromRGB(47, 108, 255), Color3.fromRGB(10, 47, 168), nil, 25)
btnMenu.Visible = false

-- ---------- preguntas ----------
local bolsa = {}
local function saca()
	if #bolsa == 0 then bolsa = UI.mezcla(Preguntas) end
	local p = table.remove(bolsa)
	local entera = p[2]:gsub("%[", ""):gsub("%]", "")
	local mascara = p[2]:gsub("%[[^%]]*%]", function(m) return string.rep("_ ", utf8.len(m) - 2) end)
	local faltan = ""
	for m in p[2]:gmatch("%[([^%]]*)%]") do faltan ..= m end
	return { q = p[1], entera = entera, mascara = mascara, faltan = faltan }
end
local function correcta(resp, p)
	local r = UI.normaliza(resp)
	return r ~= "" and (r == UI.normaliza(p.entera) or r == UI.normaliza(p.faltan))
end

-- ---------- interfaz del duelo ----------
local duelo = UI.nuevo("Frame", { Name = "Duelo", Visible = false, BackgroundTransparency = 1, Size = UDim2.fromScale(1, 1), ZIndex = 10 }, gui)
local function capsula(nombre, x, color)
	local f = UI.nuevo("Frame", { Name = nombre, BackgroundColor3 = Color3.new(1, 1, 1), Position = UDim2.fromScale(x, 0.03), Size = UDim2.fromScale(0.22, 0.11), ZIndex = 11 }, duelo)
	UI.esquinas(f, 40); UI.degradado(f, Color3.fromRGB(255, 226, 60), Color3.fromRGB(230, 160, 0)); UI.borde(f, color, 4)
	local n = UI.nuevo("TextLabel", { Name = "Nombre", BackgroundTransparency = 1, Font = Enum.Font.GothamBlack, TextScaled = true, TextColor3 = Color3.fromRGB(50, 30, 0), Position = UDim2.fromScale(0.05, 0.05), Size = UDim2.fromScale(0.6, 0.4), ZIndex = 12 }, f)
	local t = UI.nuevo("TextLabel", { Name = "Tiempo", BackgroundTransparency = 1, Font = Enum.Font.GothamBlack, TextScaled = true, TextColor3 = Color3.fromRGB(40, 20, 0), Position = UDim2.fromScale(0.05, 0.42), Size = UDim2.fromScale(0.9, 0.55), Text = "30", ZIndex = 12 }, f)
	return f, n, t
end
local capT, nomT, tieT = capsula("RelojTu", 0.18, Color3.fromRGB(34, 255, 85))
local capR, nomR, tieR = capsula("RelojRival", 0.60, Color3.fromRGB(255, 42, 42))
local caja = UI.nuevo("Frame", { Name = "Pregunta", BackgroundColor3 = Color3.fromRGB(10, 30, 120), BackgroundTransparency = 0.1, Position = UDim2.fromScale(0.1, 0.62), Size = UDim2.fromScale(0.8, 0.34), ZIndex = 11 }, duelo)
UI.esquinas(caja, 18); UI.borde(caja, Color3.fromRGB(143, 196, 255), 3)
local txtQ = UI.nuevo("TextLabel", { BackgroundTransparency = 1, Font = Enum.Font.GothamBold, TextScaled = true, TextWrapped = true, TextColor3 = Color3.new(1, 1, 1), Position = UDim2.fromScale(0.03, 0.04), Size = UDim2.fromScale(0.94, 0.32), ZIndex = 12 }, caja)
local txtM = UI.nuevo("TextLabel", { BackgroundTransparency = 1, Font = Enum.Font.Code, TextScaled = true, TextColor3 = Color3.fromRGB(255, 210, 58), Position = UDim2.fromScale(0.1, 0.38), Size = UDim2.fromScale(0.8, 0.2), ZIndex = 12 }, caja)
local entrada = UI.nuevo("TextBox", { PlaceholderText = "Escribe la respuesta", Text = "", ClearTextOnFocus = false, Font = Enum.Font.GothamBold, TextScaled = true, TextColor3 = Color3.fromRGB(10, 20, 60), BackgroundColor3 = Color3.new(1, 1, 1), Position = UDim2.fromScale(0.04, 0.66), Size = UDim2.fromScale(0.5, 0.26), ZIndex = 12 }, caja)
UI.esquinas(entrada, 10)
local bResp = UI.botonJuego(caja, "Responder", UDim2.fromScale(0.57, 0.66), UDim2.fromScale(0.2, 0.26), Color3.fromRGB(60, 200, 90), Color3.fromRGB(20, 120, 50), nil, 12)
local bPaso = UI.botonJuego(caja, "Paso", UDim2.fromScale(0.79, 0.66), UDim2.fromScale(0.17, 0.26), Color3.fromRGB(255, 226, 122), Color3.fromRGB(243, 154, 18), nil, 12)
bPaso.TextColor3 = Color3.fromRGB(58, 26, 0)

local function pantalla(premio, tiempo, escalon) Ev.Pantalla:FireServer(premio, tiempo, escalon) end

-- un duelo: devuelve true si gana el jugador
local function jugarDuelo(id, rivalN, rivalNombre, segundos)
	duelo.Visible = true; ui:ocultar(); musica("MusicaDuelo")
	nomT.Text = jugador.DisplayName; nomR.Text = rivalNombre
	local tT, tR = segundos, segundos
	local turno = "tu"; local p = saca(); local fin = nil
	local function muestra()
		txtQ.Text = p.q; txtM.Text = p.mascara
		capT.BackgroundTransparency = turno == "tu" and 0 or 0.5; capR.BackgroundTransparency = turno == "rival" and 0 or 0.5
		entrada.TextEditable = turno == "tu"; entrada.Text = ""
		if turno == "tu" then entrada:CaptureFocus() end
	end
	muestra()
	local conR = bResp.MouseButton1Click:Connect(function()
		if turno ~= "tu" or fin then return end
		if correcta(entrada.Text, p) then suena("Acierto"); ui:aviso("¡Correcto! " .. p.entera, 1.5); turno = "rival"; p = saca(); muestra()
		else suena("Fallo"); ui:aviso("No es correcto", 1.2); entrada.Text = "" end
	end)
	local conE = entrada.FocusLost:Connect(function(enter)
		if enter and turno == "tu" and not fin then
			if correcta(entrada.Text, p) then suena("Acierto"); ui:aviso("¡Correcto! " .. p.entera, 1.5); turno = "rival"; p = saca(); muestra()
			else suena("Fallo"); entrada.Text = ""; entrada:CaptureFocus() end
		end
	end)
	local conP = bPaso.MouseButton1Click:Connect(function() if turno == "tu" and not fin then suena("Paso"); ui:aviso("Paso: " .. p.entera, 1.5); p = saca(); muestra() end end)
	-- IA del rival
	task.spawn(function()
		while not fin and partida == id do
			if turno == "rival" then
				local espera = 2 + math.random() * 5
				local t0 = os.clock()
				while os.clock() - t0 < espera and not fin and turno == "rival" do task.wait(0.1) end
				if fin or partida ~= id then break end
				if math.random() < 0.68 then suena("Acierto"); ui:bocadillo(rivalNombre, p.entera .. "!"); turno = "tu"; p = saca(); muestra(); task.delay(1.5, function() ui:bocadillo() end)
				else suena("Paso"); ui:bocadillo(rivalNombre, "¡Paso!"); task.delay(1, function() ui:bocadillo() end); p = saca(); muestra() end
			else task.wait(0.1) end
		end
	end)
	local ultimoTic = 0
	while not fin and partida == id do
		local dt = RunService.Heartbeat:Wait()
		if turno == "tu" then tT -= dt else tR -= dt end
		tieT.Text = tostring(math.max(0, math.ceil(tT))); tieR.Text = tostring(math.max(0, math.ceil(tR)))
		local actual = turno == "tu" and tT or tR
		if actual < 5.5 and math.ceil(actual) ~= ultimoTic then ultimoTic = math.ceil(actual); suena("Tic") end
		Ev.Marcador:FireServer(math.max(0, tT) / segundos, math.max(0, tR) / segundos)
		if tT <= 0 then fin = "rival" elseif tR <= 0 then fin = "tu" end
	end
	conR:Disconnect(); conE:Disconnect(); conP:Disconnect(); entrada:ReleaseFocus()
	if partida ~= id then duelo.Visible = false return nil end
	suena("Reloj"); ui:aviso("¡AHORA CAE!", 2)
	task.wait(1.2)
	if fin == "tu" then Ev.Caer:FireServer(rivalN); suena("Caida") else Ev.Abrir:FireServer(0); suena("Caida") end
	task.wait(2.5)
	duelo.Visible = false
	return fin == "tu"
end

-- elegir rival: botones con los que quedan
local function eligeRival(quedan, nombres)
	return (function()
		local elegido = nil
		ui:menu("Elige a tu rival", {})
		ui:boton("🎲 Al azar", "Que lo decida la moneda", true, function() elegido = quedan[math.random(#quedan)] end)
		for _, n in ipairs(quedan) do ui:boton(nombres[n], "Trampilla " .. n, false, function() elegido = n end) end
		while not elegido do task.wait(0.1) end
		ui:ocultar(); return elegido
	end)()
end

local menuPrincipal
local function finPartida(titulo, texto)
	musica("MusicaMenu"); btnMenu.Visible = false
	ui:texto(titulo, texto, function() menuPrincipal() end)
end

local function programa(modo)
	partida += 1; local id = partida
	btnMenu.Visible = true; ui:ocultar(); musica(nil)
	local nombres = UI.mezcla(RIVALES)
	local diez = {}; for i = 1, 10 do diez[i] = nombres[i] end
	Ev.Rivales:FireServer(diez); task.wait(1)
	Ev.Colocar:FireServer(0)
	suena("Cabecera"); ui:bocadillo(PRESENTADOR, "¡Bienvenidos a ¡Ahora Caigo!! Esto es el mundo de las trampillas. ¡" .. jugador.DisplayName .. ", a la trampilla central!")
	task.wait(4); ui:bocadillo()
	if partida ~= id then return end
	local quedan = {}; for i = 1, 10 do quedan[i] = i end
	local duelos = modo == "programa" and 8 or 1
	local seg = modo == "clasico" and 20 or 30
	local escalon = 0
	pantalla(0, seg, 0)
	for d = 1, duelos do
		local n = modo == "programa" and eligeRival(quedan, diez) or quedan[math.random(#quedan)]
		if partida ~= id then return end
		ui:bocadillo(PRESENTADOR, "Duelo " .. d .. ": " .. jugador.DisplayName .. " contra " .. diez[n] .. ". ¡Tiempo!"); task.wait(2.5); ui:bocadillo()
		local gana = jugarDuelo(id, n, diez[n], seg)
		if gana == nil then return end
		if not gana then
			task.wait(2)
			return finPartida("¡Has caído!", "Te ha ganado <b>" .. diez[n] .. "</b> en el duelo " .. d .. ".\nTe llevas: <b>0 €</b>.\n\n¡Vuelve a intentarlo!")
		end
		for i, q in ipairs(quedan) do if q == n then table.remove(quedan, i) break end end
		escalon = math.min(#ESCALERA, escalon + 1)
		pantalla(UI.euros(ESCALERA[escalon]), seg, escalon); suena("Fanfarria")
		ui:aviso("¡" .. diez[n] .. " ha caído! Bote: " .. UI.euros(ESCALERA[escalon]), 2.5); task.wait(2.5)
	end
	if modo ~= "programa" then return finPartida("¡Has ganado el duelo!", "Buen entrenamiento. Vuelve al menú para jugar el <b>Programa completo</b>.") end
	-- juego final: 3 preguntas en 40 segundos
	musica("MusicaFinal"); ui:bocadillo(PRESENTADOR, "¡Juego final! Tres preguntas en cuarenta segundos por " .. UI.euros(ESCALERA[escalon]) .. "."); task.wait(3); ui:bocadillo()
	duelo.Visible = true; capR.Visible = false; nomT.Text = "Juego final"
	local t, aciertos, hechas = 40, 0, 0; local p = saca(); txtQ.Text = p.q; txtM.Text = p.mascara; entrada.Text = ""; entrada.TextEditable = true; entrada:CaptureFocus()
	local function siguiente(ok) hechas += 1; if ok then aciertos += 1; suena("Acierto") else suena("Fallo") end; p = saca(); txtQ.Text = p.q; txtM.Text = p.mascara; entrada.Text = ""; entrada:CaptureFocus() end
	local c1 = bResp.MouseButton1Click:Connect(function() siguiente(correcta(entrada.Text, p)) end)
	local c2 = bPaso.MouseButton1Click:Connect(function() siguiente(false) end)
	local c3 = entrada.FocusLost:Connect(function(enter) if enter then siguiente(correcta(entrada.Text, p)) end end)
	while t > 0 and hechas < 3 and partida == id do t -= RunService.Heartbeat:Wait(); tieT.Text = tostring(math.max(0, math.ceil(t))); pantalla(UI.euros(ESCALERA[escalon]), math.ceil(t), escalon) end
	c1:Disconnect(); c2:Disconnect(); c3:Disconnect(); duelo.Visible = false; capR.Visible = true
	if partida ~= id then return end
	if aciertos >= 3 then suena("Fanfarria"); return finPartida("¡CAMPEÓN!", "¡Has acertado las tres! Te llevas <b>" .. UI.euros(ESCALERA[escalon]) .. "</b>.")
	else Ev.Abrir:FireServer(0); suena("Caida"); task.wait(3); return finPartida("Casi…", "Has acertado " .. aciertos .. " de 3 en el juego final. Te vas sin premio, pero ¡qué programa!") end
end

btnMenu.MouseButton1Click:Connect(function() partida += 1; duelo.Visible = false; ui:bocadillo(); Ev.Cerrar:FireServer(); menuPrincipal() end)

local function enLaApp(t) return function() ui:texto(t, "Esta sección está en la app <b>¡Ahora Caigo! 3D 1.13</b>. En Roblox puedes jugar el <b>Programa completo</b>, el <b>Entrenamiento</b>, el <b>Clásico</b> y pasear por el plató (y por el backstage y la sala de control).", function() menuPrincipal() end) end end
local function menuJugar()
	ui:menu(nil, {
		{ "⟵ Volver", "", false, function() menuPrincipal() end },
		{ "Programa completo", "Cabecera, 8 duelos, moneda, juego final y despedida", true, function() programa("programa") end },
		{ "Entrenamiento", "Practica pruebas y la elección de huellas", false, function() programa("entreno") end },
		{ "Clásico", "El minijuego original de Scratch", false, function() programa("clasico") end },
		{ "Explorar el plató", "Pasea libremente por el plató 3D", false, function() ui:ocultar(); btnMenu.Visible = true; ui:aviso("Pasea por el plató. Detrás de la pantalla está el backstage y la sala de control.", 4) end },
		{ "Monólogos del presentador", "Sus números de humor: con el público, al teléfono y las normas", false, function() ui:texto("Monólogo de " .. PRESENTADOR, "«¿Sabéis por qué las trampillas nunca se ponen nerviosas? ¡Porque siempre tienen los pies en el suelo… hasta que dejan de tenerlos!»", menuJugar) end },
	})
end
menuPrincipal = function()
	musica("MusicaMenu"); btnMenu.Visible = false
	ui:menu(nil, {
		{ "Jugar", "Programa completo, entrenamiento, clásico…", true, menuJugar },
		{ "Promos", "Promos 3D con Adrián Vega: casting, gran anuncio, esta noche…", false, enLaApp("Promos") },
		{ "Promos de Adrián", "Adrián Vega presenta ¡Ahora caigo! en el plató: próximo programa, bote, casting, especiales", false, enLaApp("Promos de Adrián") },
		{ "Publicidad", "Pausa de Show Time TV: anuncios inventados, cortinillas y promos de la cadena", false, enLaApp("Publicidad") },
		{ "Cámara oculta", "Bromas a Adrián en el plató… ¡Inocente, inocente!", false, enLaApp("Cámara oculta") },
		{ "Tomas falsas", "Lapsus, trampillas impacientes y «¡Corten!»", false, enLaApp("Tomas falsas") },
		{ "Fuera de cámaras", "Maquillaje, ensayos, técnicos y la pausa", false, enLaApp("Fuera de cámaras") },
		{ "Paseo", "Pasea por el plató, sube a la grada y sal a la calle", false, function() ui:ocultar(); btnMenu.Visible = true end },
		{ "Casting", "Apúntate y sal como concursante en las partidas", false, function() ui:texto("Casting", "En Roblox sales con tu nombre de jugador: <b>" .. jugador.DisplayName .. "</b>.", menuPrincipal) end },
		{ "Elige el valor de cada huella", "Coloca los 20 valores de la moneda", false, enLaApp("Elige el valor de cada huella") },
		{ "Opciones", "Sonido, calidad gráfica, pantalla completa", false, function()
			ui:menu("Opciones", {
				{ "⟵ Volver", "", false, menuPrincipal },
				{ "🎵 Música: sí / no", "", false, function() for _, m in ipairs({ "MusicaMenu", "MusicaDuelo", "MusicaFinal" }) do local s = SoundService[m]; s.Volume = s.Volume > 0 and 0 or 0.5 end end },
				{ "🔊 Efectos: sí / no", "", false, function() for _, s in ipairs(SoundService:GetChildren()) do if s:IsA("Sound") and not s.Name:find("Musica") then s.Volume = s.Volume > 0 and 0 or 0.7 end end end },
			})
		end },
		{ "Cómo se juega", "Las reglas del concurso", false, function() ui:texto("Cómo se juega", "<b>Objetivo:</b> eres el concursante de la trampilla central. Hay <b>10 oponentes</b> y tienes que tirar a <b>8</b> para llegar al final.\n\n<b>Duelos:</b> cada uno tiene su reloj. Contesta la pregunta (completa la palabra: los huecos son las letras que faltan). Si aciertas, el turno y el reloj pasan al rival. Puedes decir <b>Paso</b> y cambiar de pregunta, pero tu reloj sigue.\n\n<b>¡Ahora cae!</b> El primero que se queda sin tiempo cae por su trampilla.\n\n<b>Juego final:</b> tres preguntas en cuarenta segundos por el bote.", menuPrincipal) end },
		{ "Créditos", "", false, function() ui:texto("Créditos", "<b>Idea y juego</b>: Iker\n<b>Presentador virtual</b>: Adrián Vega (personaje inventado)\nBasado en «¡Ahora Caigo! 3D» 1.13.\n\nJuego de fans sin ánimo de lucro. «¡Ahora caigo!» es un formato de sus propietarios; este juego no está afiliado ni respaldado por ellos.", menuPrincipal) end },
	})
end
menuPrincipal()
