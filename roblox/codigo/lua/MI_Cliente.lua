-- ¿Quién quiere ser millonario? · cliente: menú (igual que la app), escalera de 15 preguntas, comodines y plantarse
local Players = game:GetService("Players")
local RS = game:GetService("ReplicatedStorage")
local SoundService = game:GetService("SoundService")
local UI = require(RS:WaitForChild("UI"))
local Camaras = require(RS:WaitForChild("Camaras"))
local Imagenes = require(RS:WaitForChild("Imagenes"))
local Preguntas = require(RS:WaitForChild("Preguntas"))
local Ev = RS:WaitForChild("Eventos")
local jugador = Players.LocalPlayer
local gui = script.Parent
local PRESENTADOR = "Leo Arrieta"
local ESCALERA = { 100, 200, 300, 500, 1000, 2000, 4000, 6500, 10000, 15000, 25000, 50000, 100000, 300000, 1000000 }
local SEGUROS = { [5] = true, [10] = true }

local function suena(n) local s = SoundService:FindFirstChild(n); if s then s:Play() end end
local function para(n) local s = SoundService:FindFirstChild(n); if s then s:Stop() end end
local function musica(n) for _, m in ipairs({ "MusicaMenu", "MusicaPregunta", "MusicaTension" }) do if m ~= n then para(m) end end; if n then local s = SoundService:FindFirstChild(n); if s and not s.IsPlaying then s:Play() end end end

local ORO = Color3.fromRGB(242, 192, 64)
local ui = UI.new(gui, { icono = "rombo", tag = "EL JUEGO · 3D", version = "Roblox v1.1", logoImagen = Imagenes.LogoMenu,
	logo = { { t = "¿QUIÉN QUIERE SER", c = ORO, h = 0.6, borde = Color3.fromRGB(40, 10, 80) }, { t = "MILLONARIO?", c = ORO, h = 1.2, borde = Color3.fromRGB(40, 10, 80) } } })
ui.alPulsar = function() suena("Tecla") end
Camaras.crear(gui, UI)
local partida = 0
local btnMenu = UI.botonJuego(gui, "☰", UDim2.new(1, -60, 0, 10), UDim2.new(0, 50, 0, 44), Color3.fromRGB(47, 108, 255), Color3.fromRGB(10, 47, 168), nil, 25)
btnMenu.Visible = false

-- ---------- pantalla de juego ----------
local juego = UI.nuevo("Frame", { Name = "Juego", Visible = false, BackgroundTransparency = 1, Size = UDim2.fromScale(1, 1), ZIndex = 10 }, gui)
local MORADO1, MORADO2 = Color3.fromRGB(40, 20, 110), Color3.fromRGB(10, 4, 50)
local caja = UI.nuevo("TextLabel", { Name = "Pregunta", Text = "", Font = Enum.Font.GothamBold, TextScaled = true, TextWrapped = true, TextColor3 = Color3.new(1, 1, 1), BackgroundColor3 = Color3.new(1, 1, 1), Position = UDim2.fromScale(0.04, 0.58), Size = UDim2.fromScale(0.68, 0.14), ZIndex = 11 }, juego)
UI.esquinas(caja, 30); UI.degradado(caja, MORADO1, MORADO2); UI.borde(caja, Color3.fromRGB(200, 210, 255), 3)
UI.nuevo("UIPadding", { PaddingLeft = UDim.new(0, 30), PaddingRight = UDim.new(0, 30), PaddingTop = UDim.new(0, 6), PaddingBottom = UDim.new(0, 6) }, caja)
local resp = {}
for i, l in ipairs({ "A", "B", "C", "D" }) do
	local x = (i - 1) % 2; local y = math.floor((i - 1) / 2)
	local b = UI.botonJuego(juego, "", UDim2.fromScale(0.04 + x * 0.345, 0.75 + y * 0.11), UDim2.fromScale(0.335, 0.095), MORADO1, MORADO2, nil, 11)
	b.TextXAlignment = Enum.TextXAlignment.Left; b.Name = "Respuesta" .. l; resp[i] = b
end
local escaleraF = UI.nuevo("Frame", { Name = "Escalera", BackgroundColor3 = Color3.fromRGB(8, 4, 40), BackgroundTransparency = 0.15, Position = UDim2.fromScale(0.76, 0.12), Size = UDim2.fromScale(0.22, 0.84), ZIndex = 11 }, juego)
UI.esquinas(escaleraF, 14); UI.borde(escaleraF, ORO, 2)
local filas = {}
for n = 15, 1, -1 do
	local f = UI.nuevo("TextLabel", { Text = string.format("%2d   %s", n, UI.euros(ESCALERA[n])), Font = Enum.Font.GothamBlack, TextScaled = true, TextXAlignment = Enum.TextXAlignment.Left,
		TextColor3 = SEGUROS[n] and Color3.new(1, 1, 1) or ORO, BackgroundColor3 = ORO, BackgroundTransparency = 1, Position = UDim2.fromScale(0.05, (15 - n) * 0.066 + 0.01), Size = UDim2.fromScale(0.9, 0.06), ZIndex = 12 }, escaleraF)
	UI.esquinas(f, 10); filas[n] = f
end
local comodines = {}
local function comodin(nombre, txt, x)
	local b = UI.botonJuego(juego, txt, UDim2.fromScale(0.04 + x * 0.115, 0.44), UDim2.fromScale(0.105, 0.1), Color3.fromRGB(30, 60, 200), Color3.fromRGB(10, 20, 90), nil, 11)
	b.Name = nombre; comodines[nombre] = b; return b
end
local b5050 = comodin("5050", "50:50", 0); local bPub = comodin("Publico", "👥 Público", 1); local bLla = comodin("Llamada", "📞 Llamada", 2)
local bPlantar = UI.botonJuego(juego, "Me planto", UDim2.fromScale(0.04 + 3 * 0.115, 0.44), UDim2.fromScale(0.13, 0.1), Color3.fromRGB(255, 226, 122), Color3.fromRGB(243, 154, 18), nil, 11)
bPlantar.TextColor3 = Color3.fromRGB(58, 26, 0)
local grafico = UI.nuevo("Frame", { Name = "GraficoPublico", Visible = false, BackgroundColor3 = Color3.fromRGB(8, 4, 40), Position = UDim2.fromScale(0.5, 0.2), Size = UDim2.fromScale(0.22, 0.34), ZIndex = 13 }, juego)
UI.esquinas(grafico, 12); UI.borde(grafico, ORO, 2)
local barras = {}
for i, l in ipairs({ "A", "B", "C", "D" }) do
	local b = UI.nuevo("Frame", { BackgroundColor3 = Color3.fromRGB(80, 140, 255), AnchorPoint = Vector2.new(0, 1), Position = UDim2.fromScale(0.08 + (i - 1) * 0.23, 0.85), Size = UDim2.fromScale(0.16, 0), ZIndex = 14 }, grafico)
	local t = UI.nuevo("TextLabel", { BackgroundTransparency = 1, Text = l, TextColor3 = Color3.new(1, 1, 1), Font = Enum.Font.GothamBlack, TextScaled = true, Position = UDim2.fromScale(0.08 + (i - 1) * 0.23, 0.86), Size = UDim2.fromScale(0.16, 0.12), ZIndex = 14 }, grafico)
	local pc = UI.nuevo("TextLabel", { BackgroundTransparency = 1, Text = "", TextColor3 = ORO, Font = Enum.Font.GothamBold, TextScaled = true, Position = UDim2.fromScale(0.04 + (i - 1) * 0.23, 0.02), Size = UDim2.fromScale(0.24, 0.1), ZIndex = 14 }, grafico)
	barras[i] = { b, pc }
end

-- confirmación «¿respuesta definitiva?»
local function pregunta(titulo, si, no)
	local f = UI.nuevo("Frame", { BackgroundColor3 = Color3.fromRGB(8, 4, 40), Position = UDim2.fromScale(0.3, 0.3), Size = UDim2.fromScale(0.4, 0.2), ZIndex = 20 }, gui)
	UI.esquinas(f, 16); UI.borde(f, ORO, 3)
	UI.nuevo("TextLabel", { BackgroundTransparency = 1, Text = titulo, TextColor3 = Color3.new(1, 1, 1), Font = Enum.Font.GothamBlack, TextScaled = true, Position = UDim2.fromScale(0.05, 0.08), Size = UDim2.fromScale(0.9, 0.4), ZIndex = 21 }, f)
	local r = nil
	UI.botonJuego(f, si, UDim2.fromScale(0.08, 0.55), UDim2.fromScale(0.38, 0.33), Color3.fromRGB(60, 200, 90), Color3.fromRGB(20, 120, 50), function() r = true end, 21)
	UI.botonJuego(f, no, UDim2.fromScale(0.54, 0.55), UDim2.fromScale(0.38, 0.33), Color3.fromRGB(200, 60, 60), Color3.fromRGB(120, 20, 20), function() r = false end, 21)
	while r == nil do task.wait(0.05) end
	f:Destroy(); return r
end

-- ---------- preguntas por nivel ----------
local bolsas = {}
local function saca(n)
	local nivel = math.clamp(math.ceil(n / 3), 1, 5)
	if not bolsas[nivel] or #bolsas[nivel] == 0 then bolsas[nivel] = UI.mezcla(Preguntas[nivel] or Preguntas[1]) end
	local p = table.remove(bolsas[nivel])
	local ops = UI.mezcla({ p[2], p[3], p[4], p[5] })
	local ok; for i, o in ipairs(ops) do if o == p[2] then ok = i end end
	return { q = p[1], ops = ops, ok = ok }
end

local menuPrincipal
local function fin(titulo, texto)
	juego.Visible = false; btnMenu.Visible = false; Ev.Levantar:FireServer(); Ev.Luces:FireServer("normal"); musica("MusicaMenu")
	ui:texto(titulo, texto, function() menuPrincipal() end)
end

local function programa(modo)
	partida += 1; local id = partida
	ui:ocultar(); btnMenu.Visible = true; musica(nil); Ev.Colocar:FireServer()
	suena("Cabecera"); ui:bocadillo(PRESENTADOR, "¡Buenas noches y bienvenidos a ¿Quién quiere ser millonario? Hoy juega " .. jugador.DisplayName .. ". ¡Suerte!")
	task.wait(4); ui:bocadillo(); if partida ~= id then return end
	juego.Visible = true
	local usados = {}
	for _, b in pairs(comodines) do b.Visible = true; b.Active = true; b.AutoButtonColor = true; b.BackgroundTransparency = 0 end
	local garantizado = 0
	for n = 1, 15 do
		if partida ~= id then return end
		for k, f in pairs(filas) do f.BackgroundTransparency = (k == n) and 0 or 1; f.TextColor3 = (k == n) and Color3.fromRGB(40, 20, 0) or (SEGUROS[k] and Color3.new(1, 1, 1) or ORO) end
		local p = saca(n); local elegida = nil; local ocultas = {}
		caja.Text = p.q
		for i, b in ipairs(resp) do b.Text = ({ "A", "B", "C", "D" })[i] .. ":  " .. p.ops[i]; b.Visible = true; UI.degradado(b, MORADO1, MORADO2) end
		for _, b in ipairs(resp) do local g = b:FindFirstChildOfClass("UIGradient"); if g then g:Destroy() end; UI.degradado(b, MORADO1, MORADO2) end
		Ev.Pantalla:FireServer("Pregunta " .. n .. " · " .. UI.euros(ESCALERA[n]), "A: " .. p.ops[1] .. "   B: " .. p.ops[2] .. "   C: " .. p.ops[3] .. "   D: " .. p.ops[4])
		Ev.Luces:FireServer(n >= 10 and "tension" or "normal"); musica(n >= 10 and "MusicaTension" or "MusicaPregunta"); grafico.Visible = false
		local plantado = false
		local cons = {}
		for i, b in ipairs(resp) do table.insert(cons, b.MouseButton1Click:Connect(function() if not ocultas[i] and not elegida then suena("Tecla"); elegida = i end end)) end
		table.insert(cons, b5050.MouseButton1Click:Connect(function()
			if usados["5050"] then return end; usados["5050"] = true; b5050.Visible = false; suena("Comodin")
			local malas = {}; for i = 1, 4 do if i ~= p.ok then table.insert(malas, i) end end; malas = UI.mezcla(malas)
			for k = 1, 2 do ocultas[malas[k]] = true; resp[malas[k]].Text = "" end
		end))
		table.insert(cons, bPub.MouseButton1Click:Connect(function()
			if usados.Publico then return end; usados.Publico = true; bPub.Visible = false; suena("Comodin")
			local acierto = math.max(0.25, 0.85 - n * 0.04); local pct = {}; local resto = 100
			pct[p.ok] = math.floor(acierto * 100 + math.random(-8, 8)); resto -= pct[p.ok]
			local otras = {}; for i = 1, 4 do if i ~= p.ok and not ocultas[i] then table.insert(otras, i) end end
			for k, i in ipairs(otras) do local v = (k == #otras) and resto or math.random(0, resto); pct[i] = v; resto -= v end
			grafico.Visible = true
			for i = 1, 4 do local v = (pct[i] or 0); barras[i][1].Size = UDim2.fromScale(0.16, 0.7 * v / 100); barras[i][2].Text = v .. "%" end
		end))
		table.insert(cons, bLla.MouseButton1Click:Connect(function()
			if usados.Llamada then return end; usados.Llamada = true; bLla.Visible = false; suena("Comodin")
			local sabe = math.random() < math.max(0.35, 0.95 - n * 0.045)
			local d = sabe and p.ok or ({ 1, 2, 3, 4 })[math.random(4)]
			local seg = sabe and math.random(70, 95) or math.random(30, 55)
			ui:bocadillo("Tu amigo Ramón (al teléfono)", "Uf… yo creo que es la " .. ({ "A", "B", "C", "D" })[d] .. ". Seguro al " .. seg .. " %.")
			task.delay(6, function() ui:bocadillo() end)
		end))
		table.insert(cons, bPlantar.MouseButton1Click:Connect(function() if not elegida then plantado = true; elegida = -1 end end))
		while true do
			while not elegida and partida == id do task.wait(0.05) end
			if partida ~= id then for _, c in ipairs(cons) do c:Disconnect() end return end
			if elegida == -1 then
				if pregunta("¿Te plantas con " .. UI.euros(n > 1 and ESCALERA[n - 1] or 0) .. "?", "Sí, me planto", "No, sigo") then break end
				elegida = nil; plantado = false
			else
				UI.degradado(resp[elegida], Color3.fromRGB(255, 200, 60), Color3.fromRGB(220, 130, 0)); resp[elegida]:FindFirstChildOfClass("UIGradient"):Destroy(); UI.degradado(resp[elegida], Color3.fromRGB(255, 200, 60), Color3.fromRGB(220, 130, 0))
				if n <= 5 or pregunta("¿Respuesta definitiva?", "Sí", "No") then break end
				resp[elegida]:FindFirstChildOfClass("UIGradient"):Destroy(); UI.degradado(resp[elegida], MORADO1, MORADO2); elegida = nil
			end
		end
		for _, c in ipairs(cons) do c:Disconnect() end
		if plantado then suena("Fanfarria"); return fin("Te has plantado", "Te llevas <b>" .. UI.euros(n > 1 and ESCALERA[n - 1] or 0) .. "</b>. ¡Enhorabuena!") end
		musica(nil); suena("Redoble"); task.wait(2)
		local g = resp[p.ok]:FindFirstChildOfClass("UIGradient"); if g then g:Destroy() end
		UI.degradado(resp[p.ok], Color3.fromRGB(70, 230, 110), Color3.fromRGB(10, 140, 50))
		if elegida == p.ok then
			suena("Acierto"); Ev.Luces:FireServer("bien")
			if SEGUROS[n] then garantizado = ESCALERA[n]; ui:aviso("¡Seguro conseguido: " .. UI.euros(garantizado) .. "!", 2.5) end
			task.wait(2.2)
			if modo == "entreno" and n >= 5 then return fin("Entrenamiento", "Has llegado a la pregunta 5 (" .. UI.euros(ESCALERA[5]) .. "). Juega el <b>Programa completo</b> para ir a por el millón.") end
		else
			suena("Fallo"); Ev.Luces:FireServer("mal"); task.wait(2.5)
			return fin("¡Oh, no!", "La respuesta correcta era la <b>" .. ({ "A", "B", "C", "D" })[p.ok] .. "</b>: " .. p.ops[p.ok] .. ".\nTe llevas <b>" .. UI.euros(garantizado) .. "</b>.")
		end
	end
	suena("Fanfarria"); fin("¡MILLONARIO!", "¡Has acertado las 15 preguntas! Te llevas <b>1.000.000 €</b>.")
end

btnMenu.MouseButton1Click:Connect(function() partida += 1; juego.Visible = false; ui:bocadillo(); Ev.Levantar:FireServer(); menuPrincipal() end)
local function enLaApp(t) return function() ui:texto(t, "Esta sección está en la app <b>¿Quién quiere ser millonario? 3D 1.1</b>. En Roblox puedes jugar el <b>Programa completo</b>, el <b>Entrenamiento</b>, el <b>Clásico</b> y pasear por el plató.", function() menuPrincipal() end) end end
local function menuJugar()
	ui:menu(nil, {
		{ "⟵ Volver", "", false, function() menuPrincipal() end },
		{ "Programa completo", "Cabecera, apertura, 15 preguntas, comodines, cheque y despedida", true, function() programa("programa") end },
		{ "Entrenamiento", "Juega sin cabecera ni publicidad, elige la escalera", false, function() programa("entreno") end },
		{ "Clásico", "El juego original de Scratch", false, function() programa("programa") end },
		{ "Explorar el plató", "Pasea libremente por el plató 3D", false, function() ui:ocultar(); btnMenu.Visible = true end },
		{ "Monólogos del presentador", "Sus números de humor: con el público, al teléfono y las normas", false, function() ui:texto("Monólogo de " .. PRESENTADOR, "«Me preguntan si el comodín de la llamada sigue funcionando. Claro: el otro día un concursante llamó a su madre… y le contestó el contestador. ¡Y acertó!»", menuJugar) end },
	})
end
menuPrincipal = function()
	musica("MusicaMenu"); btnMenu.Visible = false
	ui:menu(nil, {
		{ "Jugar", "Programa completo, entrenamiento, clásico…", true, menuJugar },
		{ "Promos", "Promos 3D con Leo Arrieta: cabecera, apertura, casting, esta noche…", false, enLaApp("Promos") },
		{ "Promos de Leo", PRESENTADOR .. " presenta ¿Quién quiere ser millonario? en el plató: próximo programa, seguro, consola", false, enLaApp("Promos de Leo") },
		{ "Publicidad", "Pausa de Show Time TV: anuncios inventados, cortinillas y promos de la cadena", false, enLaApp("Publicidad") },
		{ "Cámara oculta", "Bromas a Leo en el plató… ¡Inocente, inocente!", false, enLaApp("Cámara oculta") },
		{ "Tomas falsas", "Lapsus, comodines rebeldes y «¡Corten!»", false, enLaApp("Tomas falsas") },
		{ "Fuera de cámaras", "Maquillaje, ensayos, técnicos y la pausa", false, enLaApp("Fuera de cámaras") },
		{ "Paseo", "Pasea por el plató y sube a la grada", false, function() ui:ocultar(); btnMenu.Visible = true end },
		{ "Casting", "Apúntate y sal como concursante en las partidas", false, function() ui:texto("Casting", "En Roblox sales con tu nombre de jugador: <b>" .. jugador.DisplayName .. "</b>.", menuPrincipal) end },
		{ "Elige el valor de cada pregunta", "Coloca los 15 premios de la escalera", false, enLaApp("Elige el valor de cada pregunta") },
		{ "Opciones", "Sonido, calidad gráfica, pantalla completa", false, function()
			ui:menu("Opciones", {
				{ "⟵ Volver", "", false, menuPrincipal },
				{ "🎵 Música: sí / no", "", false, function() for _, m in ipairs({ "MusicaMenu", "MusicaPregunta", "MusicaTension" }) do local s = SoundService[m]; s.Volume = s.Volume > 0 and 0 or 0.5 end end },
				{ "🔊 Efectos: sí / no", "", false, function() for _, s in ipairs(SoundService:GetChildren()) do if s:IsA("Sound") and not s.Name:find("Musica") then s.Volume = s.Volume > 0 and 0 or 0.7 end end end },
			})
		end },
		{ "La historia de ¿Quién quiere ser millonario?", PRESENTADOR .. " te cuenta la historia del programa", false, function() ui:texto("La historia", "El formato británico «Who Wants to Be a Millionaire?» se estrenó en 1998. En España llegó en 1999 como «¿Quién quiere ser millonario? 50 x 15» y volvió en 2005 y en 2020. El presentador de este juego es inventado.", menuPrincipal) end },
		{ "Cómo se juega", "Las reglas del concurso", false, function() ui:texto("Cómo se juega", "<b>15 preguntas</b> con cuatro respuestas (A, B, C, D) hasta <b>1.000.000 €</b>.\n<b>Seguros</b> en la pregunta 5 (1.000 €) y en la 10 (15.000 €).\n<b>Comodines</b> (una vez cada uno): 50:50, público y llamada.\nPuedes <b>plantarte</b> antes de responder y llevarte lo ganado.", menuPrincipal) end },
		{ "Créditos", "", false, function() ui:texto("Créditos", "<b>Idea y juego</b>: Iker\n<b>Presentador virtual</b>: Leo Arrieta (inventado)\nBasado en «¿Quién quiere ser millonario? 3D» 1.1.\n\nJuego de fans sin ánimo de lucro, no afiliado al formato original.", menuPrincipal) end },
	})
end
menuPrincipal()
