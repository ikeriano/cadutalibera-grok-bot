-- El Cazador · cliente: menú (igual que la app), acumulación, tablero cara a cara contra el cazador y caza final
local Players = game:GetService("Players")
local RS = game:GetService("ReplicatedStorage")
local RunService = game:GetService("RunService")
local SoundService = game:GetService("SoundService")
local UI = require(RS:WaitForChild("UI"))
local Camaras = require(RS:WaitForChild("Camaras"))
local Imagenes = require(RS:WaitForChild("Imagenes"))
local Preguntas = require(RS:WaitForChild("Preguntas"))
local Config = require(RS:WaitForChild("Config"))
local Ev = RS:WaitForChild("Eventos")
local jugador = Players.LocalPlayer
local gui = script.Parent
local PRESENTADOR = "Dani Ortuño"
local CAZADORES = {
	{ "Teodoro Quesada", "El Inteligente", 0.86, 2.6, "Geografía e historia" }, { "Amparo Lledó", "La Brújula", 0.8, 3.0, "Viajes y naturaleza" },
	{ "Fermín Arriaga", "El Muro", 0.84, 2.4, "Deportes y cine" }, { "Begoña Solís", "La Esfinge", 0.82, 3.2, "Arte y mitología" },
	{ "Quique Montoro", "El Relámpago", 0.74, 1.8, "Música y televisión" }, { "Carmela Ibarra", "La Catedrática", 0.88, 3.4, "Ciencia y literatura" },
}
local function dinero(n)
	if Config.moneda == "£" then local s = tostring(math.floor(n)):reverse():gsub("(%d%d%d)", "%1,"):reverse(); if s:sub(1, 1) == "," then s = s:sub(2) end; return "£" .. s end
	return UI.euros(n)
end
local function suena(n) local s = SoundService:FindFirstChild(n); if s then s:Play() end end
local function para(n) local s = SoundService:FindFirstChild(n); if s then s:Stop() end end
local function musica(n) for _, m in ipairs({ "MusicaMenu", "MusicaAcumulacion", "MusicaTablero", "MusicaCazaFinal" }) do if m ~= n then para(m) end end; if n then local s = SoundService:FindFirstChild(n); if s and not s.IsPlaying then s:Play() end end end

local CIAN = Color3.fromRGB(25, 184, 255)
local ui = UI.new(gui, { icono = "hex", tag = "EL JUEGO · 3D", version = "Roblox v1.1", logoImagen = Imagenes.LogoMenu,
	logo = { { t = Config.moneda == "£" and "THE" or "EL", c = Color3.new(1, 1, 1), h = 0.6, borde = Color3.fromRGB(6, 22, 122) }, { t = Config.moneda == "£" and "CHASE" or "CAZADOR", c = Color3.new(1, 1, 1), h = 1.2, borde = Color3.fromRGB(6, 22, 122) } } })
ui.alPulsar = function() suena("Tecla") end
Camaras.crear(gui, UI)
local partida = 0
local btnMenu = UI.botonJuego(gui, "☰", UDim2.new(1, -60, 0, 10), UDim2.new(0, 50, 0, 44), Color3.fromRGB(47, 108, 255), Color3.fromRGB(10, 47, 168), nil, 25)
btnMenu.Visible = false

-- ---------- interfaz de juego ----------
local juego = UI.nuevo("Frame", { Name = "Juego", Visible = false, BackgroundTransparency = 1, Size = UDim2.fromScale(1, 1), ZIndex = 10 }, gui)
local cab = UI.nuevo("TextLabel", { Name = "Cabecera", Text = "", Font = Enum.Font.GothamBlack, TextScaled = true, TextColor3 = Color3.fromRGB(255, 210, 58), BackgroundColor3 = Color3.fromRGB(6, 22, 122), Position = UDim2.fromScale(0.25, 0.03), Size = UDim2.fromScale(0.5, 0.08), ZIndex = 11 }, juego)
UI.esquinas(cab, 12); UI.borde(cab, CIAN, 3)
local caja = UI.nuevo("TextLabel", { Name = "Pregunta", Text = "", Font = Enum.Font.GothamBold, TextScaled = true, TextWrapped = true, TextColor3 = Color3.new(1, 1, 1), BackgroundColor3 = Color3.fromRGB(4, 20, 90), Position = UDim2.fromScale(0.04, 0.6), Size = UDim2.fromScale(0.66, 0.15), ZIndex = 11 }, juego)
UI.esquinas(caja, 10); UI.borde(caja, CIAN, 3)
UI.nuevo("UIPadding", { PaddingLeft = UDim.new(0, 20), PaddingRight = UDim.new(0, 20) }, caja)
local ops = {}
for i = 1, 3 do
	local b = UI.botonJuego(juego, "", UDim2.fromScale(0.04 + (i - 1) * 0.225, 0.78), UDim2.fromScale(0.21, 0.12), Color3.fromRGB(10, 60, 200), Color3.fromRGB(4, 20, 90), nil, 11)
	b.Name = "Opcion" .. i; ops[i] = b
end
-- mini tablero (8 filas + CASA)
local mini = UI.nuevo("Frame", { Name = "Tablero", Visible = false, BackgroundColor3 = Color3.fromRGB(4, 6, 20), Position = UDim2.fromScale(0.75, 0.14), Size = UDim2.fromScale(0.22, 0.8), ZIndex = 11 }, juego)
UI.esquinas(mini, 12); UI.borde(mini, CIAN, 2)
local filasG = {}
for i = 1, 9 do
	local f = UI.nuevo("TextLabel", { Text = i == 9 and (Config.moneda == "£" and "HOME" or "CASA") or "", Font = Enum.Font.GothamBlack, TextScaled = true, TextColor3 = Color3.new(1, 1, 1), BackgroundColor3 = Color3.fromRGB(10, 42, 154),
		Position = UDim2.fromScale(0.08 + (9 - i) * 0.004, 0.02 + (i - 1) * 0.108), Size = UDim2.fromScale(0.84 - (9 - i) * 0.008, 0.095), ZIndex = 12 }, mini)
	UI.esquinas(f, 6); filasG[i] = f
end
local function pintaTablero(cz, ju, textos)
	for i = 1, 8 do
		local f = filasG[i]; f.BackgroundColor3 = (i <= cz) and Color3.fromRGB(232, 16, 42) or ((i == ju) and CIAN or Color3.fromRGB(10, 42, 154))
		f.Text = (textos and textos[i]) or ((i == ju and i > cz) and (textos and textos.etiqueta or "") or "")
	end
	filasG[9].BackgroundColor3 = (ju >= 9) and CIAN or Color3.fromRGB(26, 74, 255)
	Ev.Tablero:FireServer(cz, ju)
end

-- ---------- preguntas ----------
local bolsa = {}
local function saca()
	if #bolsa == 0 then bolsa = UI.mezcla(Preguntas) end
	local p = table.remove(bolsa)
	local o = UI.mezcla({ p[2], p[3], p[4] }); local ok
	for i, v in ipairs(o) do if v == p[2] then ok = i end end
	return { q = p[1], ops = o, ok = ok }
end
local function muestra(p) caja.Text = p.q; for i = 1, 3 do ops[i].Text = p.ops[i]; ops[i].Visible = true; ops[i].BorderSizePixel = 0; local s = ops[i]:FindFirstChildOfClass("UIStroke"); if s then s.Color = Color3.fromRGB(200, 225, 255); s.Thickness = 2 end end end
local function marca(i, color) local s = ops[i]:FindFirstChildOfClass("UIStroke"); if s then s.Color = color; s.Thickness = 6 end end
-- espera respuesta del jugador (o nil si se acaba el tiempo / cambia la partida)
local function esperaRespuesta(id, limite, condicion)
	local r = nil; local cons = {}
	for i = 1, 3 do table.insert(cons, ops[i].MouseButton1Click:Connect(function() if not r then suena("Tecla"); r = i end end)) end
	local t0 = os.clock()
	while not r and partida == id and (not limite or os.clock() - t0 < limite) and (not condicion or condicion()) do task.wait(0.03) end
	for _, c in ipairs(cons) do c:Disconnect() end
	return r
end

local menuPrincipal
local function fin(titulo, texto)
	juego.Visible = false; btnMenu.Visible = false; musica("MusicaMenu"); ui:bocadillo()
	ui:texto(titulo, texto, function() menuPrincipal() end)
end

local function acumulacion(id)
	musica("MusicaAcumulacion"); suena("Reloj")
	local t, n = 60, 0; local fin0 = os.clock() + 60
	mini.Visible = false
	while os.clock() < fin0 and partida == id do
		local p = saca(); muestra(p)
		local r = esperaRespuesta(id, nil, function() t = fin0 - os.clock(); cab.Text = "ACUMULACIÓN  ·  0:" .. string.format("%02d", math.max(0, math.ceil(t))) .. "  ·  " .. dinero(n * 1000); return t > 0 end)
		if not r then break end
		if r == p.ok then n += 1; suena("Acierto"); marca(r, Color3.fromRGB(60, 230, 110)) else suena("Fallo"); marca(r, Color3.fromRGB(255, 50, 60)); marca(p.ok, Color3.fromRGB(60, 230, 110)) end
		task.wait(0.35)
	end
	suena("FinTiempo"); musica(nil)
	return math.max(1000, n * 1000)
end

-- cara a cara: devuelve premio (0 si te cazan)
local function caraACara(id, caz, acumulado)
	musica("MusicaTablero"); mini.Visible = true
	local alta = math.max(acumulado + 5000, math.floor(acumulado * (2 + math.random() * 3) / 1000) * 1000)
	local baja = math.max(500, math.floor(acumulado * (0.2 + math.random() * 0.3) / 500) * 500)
	local ofertas = { { alta, 6 }, { acumulado, 5 }, { baja, 4 } }
	local textos = {}; for _, o in ipairs(ofertas) do textos[9 - o[2]] = dinero(o[1]) end
	pintaTablero(0, -1, textos); suena("Oferta")
	ui:bocadillo(caz[2], "Te ofrezco " .. dinero(alta) .. " si empiezas más cerca de mí. ¿Te atreves?")
	caja.Text = "Elige tu oferta: alta (6 pasos de casa), lo acumulado (5) o baja (4)."
	for i, o in ipairs(ofertas) do ops[i].Text = ({ "Alta", "Acumulado", "Baja" })[i] .. "  " .. dinero(o[1]); ops[i].Visible = true end
	local e = esperaRespuesta(id); if not e then return nil end
	ui:bocadillo(); local premio, pasos = ofertas[e][1], ofertas[e][2]
	local ju, cz = 9 - pasos, 0
	textos = { etiqueta = dinero(premio) }
	pintaTablero(cz, ju, textos); Ev.Colocar:FireServer(ju); suena("Elige")
	cab.Text = "CARA A CARA  ·  " .. dinero(premio)
	while ju < 9 and cz < ju and partida == id do
		task.wait(0.6)
		local p = saca(); muestra(p); musica("MusicaTablero")
		local r = esperaRespuesta(id, 20)
		if partida ~= id then return nil end
		local zOk = math.random() < caz[3]
		local iz = zOk and p.ok or ((p.ok % 3) + 1)
		if r then marca(r, CIAN) end
		task.wait(0.8); suena("RevelaCazador"); marca(iz, Color3.fromRGB(255, 40, 70)); task.wait(1)
		marca(p.ok, Color3.fromRGB(60, 230, 110)); suena(r == p.ok and "Acierto" or "Fallo")
		if r == p.ok then ju += 1; suena("AvanzaJugador") end
		if zOk then cz += 1; suena("AvanzaCazador") end
		pintaTablero(cz, ju, textos); Ev.Colocar:FireServer(ju); task.wait(1)
	end
	if ju >= 9 then suena("Casa"); ui:aviso("¡A CASA con " .. dinero(premio) .. "!", 3); task.wait(3); return premio end
	suena("Cazado"); ui:aviso("¡CAZADO!", 3); task.wait(3); return 0
end

local function cazaFinal(id, caz, bote, finalistas)
	mini.Visible = false; musica("MusicaCazaFinal"); suena("Reloj")
	local pasos = finalistas; local fin0 = os.clock() + 120
	while os.clock() < fin0 and partida == id do
		local p = saca(); muestra(p)
		local r = esperaRespuesta(id, nil, function() local t = math.max(0, math.ceil(fin0 - os.clock())); cab.Text = string.format("CAZA FINAL  ·  %d:%02d  ·  %d pasos", t // 60, t % 60, pasos); return t > 0 end)
		if not r then break end
		if r == p.ok then pasos += 1; suena("Acierto") else suena("Fallo") end
	end
	if partida ~= id then return end
	suena("FinTiempo"); musica(nil); task.wait(1.5)
	ui:bocadillo(caz[2], "Dos minutos son una eternidad para mí. " .. pasos .. " pasos… allá voy.")
	musica("MusicaCazaFinal"); suena("Reloj")
	local tz, cz = 120, 0
	while tz > 0 and cz < pasos and partida == id do
		local dt = caz[4] + math.random() * 2; task.wait(math.min(dt, tz) * 0.35); tz -= dt
		cab.Text = string.format("EL CAZADOR  ·  %d:%02d  ·  %d / %d", math.max(0, math.ceil(tz)) // 60, math.max(0, math.ceil(tz)) % 60, cz, pasos)
		if tz <= 0 then break end
		if math.random() < caz[3] then cz += 1; suena("AvanzaCazador")
		else
			suena("ParaReloj"); local p = saca(); muestra(p); caja.Text = "¡Falla el cazador! Contraataque: " .. p.q
			local r = esperaRespuesta(id, 7)
			if r == p.ok and cz > 0 then cz -= 1; suena("Acierto"); ui:aviso("¡Retrocede un paso!", 1.5) end
			caja.Text = "El cazador sigue…"; for i = 1, 3 do ops[i].Visible = false end; suena("Reloj")
		end
	end
	if partida ~= id then return end
	musica(nil)
	if cz < pasos then suena("Fanfarria"); return fin("¡HABÉIS GANADO!", "El cazador se ha quedado a " .. (pasos - cz) .. " pasos. Te llevas <b>" .. dinero(bote) .. "</b>.")
	else suena("Cazado"); return fin("¡Te ha cazado!", caz[2] .. " te ha alcanzado con " .. math.max(0, math.ceil(tz)) .. " segundos de margen. El premio se queda en el plató.") end
end

local function programa(modo)
	partida += 1; local id = partida
	ui:ocultar(); btnMenu.Visible = true; musica(nil)
	local caz = CAZADORES[math.random(#CAZADORES)]
	Ev.Cazador:FireServer(caz[1] .. " «" .. caz[2] .. "»"); Ev.Colocar:FireServer("mesa")
	Ev.Mesa:FireServer(string.upper(jugador.DisplayName), dinero(0)); pintaTablero(0, -1, {})
	suena("Cabecera"); ui:bocadillo(PRESENTADOR, "¡Buenas tardes y bienvenidos a El Cazador! Hoy juega " .. jugador.DisplayName .. ". ¿Quién será el cazador de hoy?")
	task.wait(3.5); if partida ~= id then return end
	musica("MusicaEntrada"); ui:bocadillo(caz[2], "Soy " .. caz[2] .. ". Esta tarde no se me escapa nadie."); task.wait(3); ui:bocadillo()
	juego.Visible = true
	if modo == "cazafinal" then return cazaFinal(id, caz, 10000, 1) end
	local acum = acumulacion(id); if partida ~= id then return end
	Ev.Mesa:FireServer(string.upper(jugador.DisplayName), dinero(acum))
	ui:aviso("Has acumulado " .. dinero(acum), 2.5); task.wait(2.5)
	local premio = caraACara(id, caz, acum); if premio == nil then return end
	if premio == 0 then return fin("¡Cazado!", caz[2] .. " te ha alcanzado en el tablero. ¡Otra vez será!") end
	if modo == "entreno" then return fin("¡A casa!", "Has llegado a casa con <b>" .. dinero(premio) .. "</b>. Juega el <b>Programa completo</b> para la caza final.") end
	Ev.Colocar:FireServer("mesa"); Ev.Mesa:FireServer(string.upper(jugador.DisplayName), dinero(premio))
	ui:bocadillo(PRESENTADOR, "¡Caza final por " .. dinero(premio) .. "! Partes con un paso de ventaja."); task.wait(3); ui:bocadillo()
	return cazaFinal(id, caz, premio, 1)
end

btnMenu.MouseButton1Click:Connect(function() partida += 1; juego.Visible = false; ui:bocadillo(); menuPrincipal() end)
local function enLaApp(t) return function() ui:texto(t, "Esta sección está en la app <b>El Cazador 3D</b>. En Roblox puedes jugar el <b>Programa completo</b>, la <b>Caza final</b>, el <b>Entrenamiento</b> y pasear por el plató.", function() menuPrincipal() end) end end
local function menuJugar()
	ui:menu(nil, {
		{ "⟵ Volver", "", false, function() menuPrincipal() end },
		{ "Programa completo", "Cabecera, acumulación, tablero y caza final", true, function() programa("programa") end },
		{ "Caza final", "Directo a los dos minutos contra el cazador", false, function() programa("cazafinal") end },
		{ "La noche de los cazadores", "Tú contra 2–5 cazadores con reloj de ajedrez", false, enLaApp("La noche de los cazadores") },
		{ "El cazador Stars", "Famosos (inventados) que juegan por una ONG", false, function() programa("programa") end },
		{ "Entrenamiento", "Acumulación y tablero por separado", false, function() programa("entreno") end },
		{ "Explorar el plató", "Pasea libremente por el plató 3D", false, function() ui:ocultar(); btnMenu.Visible = true end },
		{ "Monólogos del presentador", "Sus números de humor", false, function() ui:texto("Monólogo de " .. PRESENTADOR, "«Dicen que los cazadores desayunan enciclopedias. Yo he visto a uno mojando un atlas en el café con leche… y luego se quejaba de que la Patagonia estaba muy seca.»", menuJugar) end },
	})
end
menuPrincipal = function()
	musica("MusicaMenu"); btnMenu.Visible = false
	local cz = {}; for _, c in ipairs(CAZADORES) do table.insert(cz, "<b>" .. c[2] .. "</b> (" .. c[1] .. ") · fuerte en " .. c[5]) end
	ui:menu(nil, {
		{ "Jugar", "Programa completo, caza final, La noche de los cazadores, Stars…", true, menuJugar },
		{ "Promos", "Promos 3D con " .. PRESENTADOR .. ": cabecera, apertura, entrada del cazador…", false, enLaApp("Promos") },
		{ "Promos de Dani", PRESENTADOR .. " presenta El Cazador en el plató: próximo programa, bote, tablero", false, enLaApp("Promos de Dani") },
		{ "Publicidad", "Pausa de Show Time TV: anuncios inventados, cortinillas y promos de la cadena", false, enLaApp("Publicidad") },
		{ "Cámara oculta", "Bromas en el plató… ¡Inocente, inocente!", false, enLaApp("Cámara oculta") },
		{ "Tomas falsas", "Lapsus, pulsadores rebeldes y «¡Corten!»", false, enLaApp("Tomas falsas") },
		{ "Fuera de cámaras", "Maquillaje, ensayos, cazadores en el catering", false, enLaApp("Fuera de cámaras") },
		{ "Paseo", "Pasea por el plató y sube a la cabina del cazador", false, function() ui:ocultar(); btnMenu.Visible = true end },
		{ "Casting", "Apúntate y sal como concursante en las partidas", false, function() ui:texto("Casting", "En Roblox sales con tu nombre de jugador: <b>" .. jugador.DisplayName .. "</b>.", menuPrincipal) end },
		{ "Los cazadores", "Conoce a los seis cazadores y elige el tuyo", false, function() ui:texto("Los cazadores", table.concat(cz, "\n") .. "\n\n(Personajes inventados.)", menuPrincipal) end },
		{ "Opciones", "Sonido, plató, etapa, calidad gráfica, pantalla completa", false, function()
			ui:menu("Opciones", {
				{ "⟵ Volver", "", false, menuPrincipal },
				{ "🎵 Música: sí / no", "", false, function() for _, s in ipairs(SoundService:GetChildren()) do if s:IsA("Sound") and s.Name:find("Musica") then s.Volume = s.Volume > 0 and 0 or 0.5 end end end },
				{ "🔊 Efectos: sí / no", "", false, function() for _, s in ipairs(SoundService:GetChildren()) do if s:IsA("Sound") and not s.Name:find("Musica") then s.Volume = s.Volume > 0 and 0 or 0.7 end end end },
			})
		end },
		{ "La historia de El Cazador", PRESENTADOR .. " te cuenta la historia del programa", false, function() ui:texto("La historia de El Cazador", "Adaptación española de «The Chase»: La 1 (10 feb 2020 – 25 abr 2025) y La 2 (12 may 2025 – 6 ene 2026); 14 temporadas y 1.129 programas. Presentadores reales: Ion Aramendi y Rodrigo Vázquez. El presentador y los cazadores de este juego son inventados.", menuPrincipal) end },
		{ "Cómo se juega", "Las reglas del concurso", false, function() ui:texto("Cómo se juega", "<b>Acumulación:</b> un minuto de preguntas; cada acierto suma 1.000.\n<b>Tablero:</b> el cazador ofrece una cantidad alta (6 pasos de casa), lo acumulado (5) o una baja (4). Si aciertas bajas un paso; si acierta el cazador, baja él. Llega a <b>CASA</b> antes de que te alcance.\n<b>Caza final:</b> dos minutos para sumar pasos (empiezas con uno). Luego el cazador tiene dos minutos; si falla, puedes hacerle retroceder.", menuPrincipal) end },
		{ "Créditos", "", false, function() ui:texto("Créditos", "<b>Idea y juego</b>: Iker\n<b>Presentador y cazadores virtuales</b>: personajes inventados\nBasado en «El Cazador 3D» 1.1.\n\nJuego de fans sin ánimo de lucro. «El Cazador» / «The Chase» es un formato de sus propietarios; este juego no está afiliado ni respaldado por ellos.", menuPrincipal) end },
	})
end
menuPrincipal()
