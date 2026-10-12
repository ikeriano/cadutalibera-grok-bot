-- ¡Ahora Caigo! · cliente (port completo de la app 1.14): menú idéntico (rastreado de la app), presentador
-- Adrián Vega y todo el equipo como personajes animados, programa completo con cabecera, regidor, copresentador
-- sorpresa, publicidad, huellas, juego final; escenas de Cámara oculta, Tomas falsas, Fuera de cámaras; promos…
local Players = game:GetService("Players")
local RS = game:GetService("ReplicatedStorage")
local RunService = game:GetService("RunService")
local SoundService = game:GetService("SoundService")
local TweenService = game:GetService("TweenService")
local UI = require(RS:WaitForChild("UI"))
local Camaras = require(RS:WaitForChild("Camaras"))
local Imagenes = require(RS:WaitForChild("Imagenes"))
local Preguntas = require(RS:WaitForChild("Preguntas"))
local Personajes = require(RS:WaitForChild("Personajes"))
local Escena = require(RS:WaitForChild("Escena"))
local MenuApp = require(RS:WaitForChild("MenuApp"))
local C = require(RS:WaitForChild("Contenido"))
local Pantallas = require(RS:WaitForChild("Pantallas"))
local Ev = RS:WaitForChild("Eventos")
local jugador = Players.LocalPlayer
local gui = script.Parent
local V3 = Vector3.new

-- ---------- opciones (como la app) ----------
local OP = { musica = true, efectos = true, voz = true, subtitulos = true, copro = true, regidor = true, publicidad = true, monologo = true, apertura = true, etapa = "2021", especial = "normal", titulo = nil, casting = nil }
local function rgbHex(h) h = tostring(h or "#ffffff"):gsub("#", ""); return Color3.fromRGB(tonumber(h:sub(1, 2), 16) or 255, tonumber(h:sub(3, 4), 16) or 255, tonumber(h:sub(5, 6), 16) or 255) end
local function rgbN(n) n = tonumber(n) or 0xffffff; return Color3.fromRGB(math.floor(n / 65536) % 256, math.floor(n / 256) % 256, n % 256) end
local function esp() for _, e in ipairs(C.especiales) do if e.id == OP.especial then return e end end; return C.especiales[1] end
local function tituloPrograma() return OP.titulo or "¡AHORA CAIGO!" end

local function suena(n) if not OP.efectos then return end; local s = SoundService:FindFirstChild(n); if s then s:Play() end end
local function para(n) local s = SoundService:FindFirstChild(n); if s then s:Stop() end end
Ev.Sonido.OnClientEvent:Connect(suena)
local MUSICAS = { "MusicaMenu", "MusicaDuelo", "MusicaFinal", "MusicaPublicidad", "MusicaPromo" }
local function musica(n) for _, m in ipairs(MUSICAS) do if m ~= n then para(m) end end; if n and OP.musica then local s = SoundService:FindFirstChild(n); if s and not s.IsPlaying then s:Play() end end end

local ui = UI.new(gui, {
	icono = "huellas", tag = "EL JUEGO · 3D", version = "Roblox v1.14", logoImagen = Imagenes.LogoMenu,
	logo = { { t = "¡AHORA", c = Color3.new(1, 1, 1), h = 1 }, { t = "CAIGO!", c = Color3.new(1, 1, 1), h = 1 } },
})
Camaras.crear(gui, UI)
ui.alPulsar = function() suena("Tecla") end
local partida = 0
local btnMenu = UI.botonJuego(gui, "☰", UDim2.new(1, -60, 0, 10), UDim2.new(0, 50, 0, 44), Color3.fromRGB(47, 108, 255), Color3.fromRGB(10, 47, 168), nil, 25)
btnMenu.Visible = false

-- ---------- el plató (mismas medidas que set_ac.py) ----------
local H, PODIO, RT, FONDO = 8, 10, 38, -26
local ANG = { 40, 68, 96, 124, 152 }
local function trampPos(n)
	if n == 0 then return V3(0, PODIO, 0) end
	local s = n <= 5 and -1 or 1; local a = math.rad(ANG[(n - 1) % 5 + 1])
	return V3(s * math.sin(a) * RT, H, math.cos(a) * RT)
end
local LUGARES = { plato = V3(0, 0, 66), maquillaje = V3(-20, 0, -104), control = V3(42, 0, -118) }

-- ---------- personajes ----------
local PER = {}
local PIEL = { 0xf1c27d, 0xe0ac69, 0xc68642, 0x8d5524, 0xffdbac, 0xd1a37c }
local function nuevoPer(id, nombre, colores, pos, mira)
	local def = { id = id, nombre = nombre, pos = pos }
	for k, v in pairs(colores or {}) do def[k] = v end
	local p = Personajes.nuevo(def); if mira then p:mirarA(mira) end
	return p
end
local function crearEquipo()
	Personajes.limpiar(); PER = {}
	local e = esp(); local host = e.host or {}
	PER.adrian = nuevoPer("adrian", C.presentador, { traje = host.suit or 0x1b2b5c, camisa = host.shirt or 0xffffff, corbata = host.tie or 0xf3a012, pelo = 0x2a1a10, piel = 0xe8b896 }, V3(9, PODIO, 13), V3(9, PODIO, 80))
	PER.reg = nuevoPer("reg", "Toni · regidor", { traje = 0x1a1a1a, camisa = 0x333333, pelo = 0x111111, piel = 0xd8a27a }, V3(-24, 0, 66), V3(0, 6, 20))
	PER.dir = nuevoPer("dir", "Lola · directora", { traje = 0x6a2a8a, camisa = 0xffe0f0, pelo = 0x5a2a10, piel = 0xf0c8a0 }, V3(-12, 0, 70), V3(0, 6, 20))
	PER.tec = nuevoPer("tec", "Rober · sonido", { traje = 0x2a4a2a, camisa = 0x88aa88, pelo = 0x3a2a1a, piel = 0xc68642 }, V3(16, 0, 70), V3(0, 6, 20))
	PER.maq = nuevoPer("maq", "Nuria · maquillaje", { traje = 0xd04a8a, camisa = 0xffffff, pelo = 0xa04a10, piel = 0xffdbac }, V3(24, 0, 64), V3(0, 6, 20))
	PER.jefe = nuevoPer("jefe", "«El jefe»", { traje = 0x3a3a3a, camisa = 0xffffff, corbata = 0xaa0000, pelo = 0xbbbbbb, piel = 0xe8b896 }, V3(2, 0, 76), V3(0, 6, 20))
	PER.pub = nuevoPer("pub", "Público", { traje = 0x2a6ae0, camisa = 0xffffff, pelo = 0x222222 }, V3(-46, 4, 58), V3(0, 6, 0))
	for k, v in pairs(C.personajes) do if PER[k] then PER[k].def.nombre = v.nombre end end
end
local RIVALES = { "Paco", "Lola", "Rocío", "Julián", "Maite", "Fermín", "Marta", "Rocío", "Manolo", "Pili", "Chema", "Encarna", "Susi", "Ramón" }
local rivalNom, rivalPer = {}, {}
local function crearRivales()
	local n = UI.mezcla(RIVALES)
	for i = 1, 10 do
		if rivalPer[i] then rivalPer[i]:destruir() end
		rivalNom[i] = n[i]
		rivalPer[i] = nuevoPer("rival" .. i, i .. " · " .. n[i], { traje = (i * 2654435761) % 0xffffff, camisa = 0xffffff, pelo = ({ 0x2a1a10, 0x5a3a1a, 0x111111, 0xa06030, 0xdddddd })[i % 5 + 1], piel = PIEL[i % #PIEL + 1] }, trampPos(i), V3(0, H, 0))
	end
	PER.conc = rivalPer[3]
end
local function quitarRivales() for i = 1, 10 do if rivalPer[i] then rivalPer[i]:destruir(); rivalPer[i] = nil end end end

-- ---------- cámaras de las escenas ----------
local function frente(p) return V3(-math.sin(p.yaw), 0, -math.cos(p.yaw)) end
local function planoDe(p, dist, alto)
	local cab = p.pos + V3(0, 4.4, 0)
	return CFrame.lookAt(cab + frente(p) * (dist or 9) + V3(0, alto or 0.6, 0) + V3(math.cos(p.yaw), 0, -math.sin(p.yaw)) * 2, cab)
end
local lugarActual = "plato"
local function camara(clave, quien)
	clave = tostring(clave or "wide")
	local n = tonumber(clave:match("^opp(%d+)")); local h = tonumber(clave:match("^hole(%d+)"))
	if lugarActual ~= "plato" and clave ~= "wide" then local p = PER[quien] or PER.adrian; return planoDe(p, 8) end
	if lugarActual ~= "plato" then local c = LUGARES[lugarActual]; return CFrame.lookAt(c + V3(0, 9, 24), c + V3(0, 4, 0)) end
	if n and rivalPer[n] then return planoDe(rivalPer[n], 11, 1.5) end
	if h then local t = trampPos(h); return CFrame.lookAt(t + V3(0, 28, 10), t) end
	if clave == "host" then return planoDe(PER.adrian, 11, 1) end
	if clave == "cerca" then return planoDe(PER[quien] or PER.adrian, 7.5, 0.4) end
	if clave == "player" then local c = jugador.Character; local pp = c and c:FindFirstChild("HumanoidRootPart"); if pp then return CFrame.lookAt(pp.Position + V3(0, 4, 14), pp.Position + V3(0, 2, 0)) end end
	if clave == "duel" then return CFrame.lookAt(V3(0, 34, 70), V3(0, 8, 0)) end
	return CFrame.lookAt(V3(0, 42, 104), V3(0, 8, 4))
end
local esc
local function efecto(e)
	local k, arg = tostring(e):match("^([^:]+):?(.*)$")
	if k == "risas" then suena("Risas") elseif k == "ooh" then suena("Ooh") elseif k == "aplauso" then suena("Aplausos")
	elseif k == "inocente" then suena("Inocente"); task.spawn(function() esc:rotulo("¡INOCENTE, INOCENTE!", 2) end)
	elseif k == "claqueta" then suena("Claqueta"); task.spawn(function() esc:rotulo("TOMA " .. (arg ~= "" and arg or "1"), 1.2, { Color3.new(1, 1, 1), Color3.new(0, 0, 0) }) end)
	elseif k == "corten" then suena("Corten"); task.spawn(function() esc:rotulo("¡CORTEN!", 1.4, { Color3.fromRGB(255, 60, 60), Color3.new(0, 0, 0) }) end)
	elseif k == "tomafalsa" then task.spawn(function() esc:rotulo("TOMA FALSA", 1.2, { Color3.fromRGB(255, 210, 58), Color3.new(0, 0, 0) }) end)
	elseif k == "silencio" then task.spawn(function() esc:rotulo("¡SILENCIO!", 1.2) end)
	elseif k == "cae" or k == "abreVacia" then local n = tonumber(arg) or 3; Ev.Abrir:FireServer(n); suena("Trampilla"); task.delay(3, function() Ev.Cerrar:FireServer() end)
	elseif k == "trampillaNo" then suena("Trampilla")
	elseif k == "tel" then suena("Telefono") end
end
esc = Escena.nuevo({ gui = gui, personajes = PER, camara = camara, efecto = efecto, voces = {} })
local function actualizaEscena()
	esc.personajes = PER; esc.subtitulos = OP.subtitulos
	local v = { adrian = "davefx" }; for k, d in pairs(C.personajes) do v[k] = d.voz end; v.adrian = "davefx"
	esc.voces = v; esc.volVoz = OP.voz and 1 or 0
end
local function adrian(t, gesto, cam) esc:linea("adrian", t, cam or "host", gesto or "habla", "") end
local function azar(l) if type(l) ~= "table" then return l end; return l[math.random(#l)] end
local function rellena(t, vars) return (tostring(t):gsub("{(%w+)}", function(k) return vars[k] ~= nil and tostring(vars[k]) or "{" .. k .. "}" end)) end

-- ---------- escenas de la app ----------
local function correrEscena(sk)
	local lugar = sk.lugar or "plato"
	local movidos = {}
	if lugar ~= "plato" then
		lugarActual = lugar; local c = LUGARES[lugar] or LUGARES.plato; local k = 0
		for _, p in ipairs(sk.pasos) do local per = PER[p[1]]; if per and not movidos[p[1]] then movidos[p[1]] = { per.pos, per.yaw }; per:ponerEn(c + V3(-4 + k * 4, 0, 0), c + V3(0, 0, 20)); k += 1 end end
	else
		-- el equipo sale al plató, delante del escenario
		local k = 0
		for _, p in ipairs(sk.pasos) do local per = PER[p[1]]; if per and p[1] ~= "adrian" and p[1] ~= "conc" and p[1] ~= "pub" and not movidos[p[1]] then movidos[p[1]] = { per.pos, per.yaw }; per:ponerEn(V3(-8 + k * 6, H, 40), PER.adrian.pos); k += 1 end end
		PER.adrian:ponerEn(V3(4, H, 44), V3(4, H, 90))
	end
	local cam = workspace.CurrentCamera; cam.CameraType = Enum.CameraType.Scriptable
	esc:correr(sk.pasos, sk.titulo)
	for id, v in pairs(movidos) do PER[id]:ponerEn(v[1]); PER[id].yaw = v[2] end
	PER.adrian:ponerEn(V3(9, PODIO, 13), V3(9, PODIO, 80))
	lugarActual = "plato"; Ev.Cerrar:FireServer()
end

-- ---------- logo / título editable en las pantallas ----------
local function pintaTitulo()
	local e = esp(); local t = tituloPrograma()
	for _, d in ipairs(workspace:GetDescendants()) do
		if d:IsA("TextLabel") and d.Name == "TituloPrograma" then d.Text = t end
	end
	if e.wallA then Ev.Led:FireServer(rgbHex(e.wallB or e.wallA)) end
	ui.raiz:FindFirstChild("Logo", true)
	local etiqueta = ui.raiz:FindFirstChild("Etiqueta", true); if etiqueta then etiqueta.Text = e.id == "normal" and "EL JUEGO · 3D" or ((e.emoji or "") .. " " .. string.upper(e.name or "")) end
	local logo = ui.raiz:FindFirstChild("Logo", true)
	if logo then
		local n = 0; local palabras = {}
		for w in t:gmatch("%S+") do table.insert(palabras, w) end
		for _, c in ipairs(logo:GetChildren()) do
			if c:IsA("TextLabel") and c.Name ~= "Etiqueta" then n += 1
				if #palabras >= 2 then c.Text = n == 1 and palabras[1] or table.concat(palabras, " ", 2) else c.Text = n == 1 and t or "" end
				local st = c:FindFirstChildOfClass("UIStroke"); if st and e.chevB then st.Color = rgbHex(e.wallA or "#0b2fa8") end
			end
		end
	end
end

-- ---------- cabecera / apertura del programa (TweenService) ----------
local function cabecera()
	local e = esp()
	musica(nil); suena("Cabecera"); if e.wallA then Ev.Led:FireServer("arcoiris") end
	esc.saltar = false; esc.btnSaltar.Visible = true
	local video = Imagenes.VideoCabecera
	if video and video ~= "" and video ~= "rbxassetid://0" then
		-- vídeo propio de la cabecera en las pantallas del plató (VideoFrame en SurfaceGui)
		for _, d in ipairs(workspace:GetDescendants()) do
			if d:IsA("VideoFrame") and d.Name == "VideoCabecera" then d.Video = video; d.Visible = true; d.Looped = false; d:Play() end
		end
	end
	local pts = {
		CFrame.lookAt(V3(0, 90, 160), V3(0, 8, 0)), CFrame.lookAt(V3(-70, 30, 70), V3(0, 10, 0)), CFrame.lookAt(V3(-30, 14, 30), V3(0, 12, 0)),
		CFrame.lookAt(V3(0, 22, -10), V3(0, 4, 40)), CFrame.lookAt(V3(55, 16, 30), V3(0, 10, 0)), CFrame.lookAt(V3(0, 26, 62), V3(0, 9, 0)),
	}
	task.spawn(function() esc:rotulo(tituloPrograma(), 2.5) end)
	esc:camaraRecorrido(pts, 9)
	if e.id ~= "normal" then esc:rotulo((e.emoji or "") .. " " .. string.upper(e.name or ""), 2) end
	esc.btnSaltar.Visible = false
	for _, d in ipairs(workspace:GetDescendants()) do if d:IsA("VideoFrame") and d.Name == "VideoCabecera" then d:Pause(); d.Visible = false end end
	if e.wallA then Ev.Led:FireServer(rgbHex(e.wallB or e.wallA)) end
end

-- ---------- regidor y copresentador sorpresa ----------
local copro = nil
local function regidor(clave, prob)
	if not OP.regidor or (prob and math.random() > prob) then return end
	local l = C.regidor[clave]; if not l then return end
	local quien = (copro and copro.id == "toni") and "copro" or "reg"
	esc:linea(quien == "copro" and "copro" or "reg", azar(l), quien == "copro" and "cerca" or "cerca", clave == "aplausos" and "aplaude" or "senala", clave == "aplausos" and "aplauso" or "")
end
local function coproHabla(t, gesto) if copro and t then esc:linea("copro", t, "cerca", gesto or "habla", "") end end
local function coproMomento(k, vars, prob) if copro and copro[k] and (not prob or math.random() < prob) then coproHabla(rellena(azar(copro[k]), vars or {}), k == "caida" and "aplaude" or "senala") end end
local function coproEntra()
	copro = nil; PER.copro = nil
	if not OP.copro then return end
	local g = C.copro[math.random(#C.copro)]; copro = g
	local base = PER[g.quien]
	local fig = nuevoPer("copro", g.nombre, { traje = g.shirt or 0x333333, camisa = 0xffffff, pelo = 0x2a1a10 }, V3(-6, H, 46), PER.adrian.pos)
	PER.copro = fig; if base then base:visible(false) end
	actualizaEscena(); esc.voces.copro = g.voz
	adrian(g.adrian, "saluda", "wide"); suena("Aplausos")
	fig:andarA(PER.adrian.pos + V3(3.2, 0, 1.2), 9); fig:mirarA(PER.adrian.pos + V3(0, 0, 60))
	local charla = C.coproCharla[g.id]
	if charla and charla.bienvenida then
		for _, l in ipairs(charla.bienvenida) do
			if esc.saltar then break end
			if l[1] == "a" then adrian(l[2], "habla", "host") elseif l[1] == "c" then coproHabla(l[2]) else coproHabla(l[2]); adrian(l[2]) end
		end
	else for _, t in ipairs(g.intro or {}) do coproHabla(t, "saluda") end end
	suena("Aplausos")
end
local function coproSale()
	if copro then local b = PER[copro.quien]; if b then b:visible(true) end end
	if PER.copro then PER.copro:destruir(); PER.copro = nil end; copro = nil
end

-- ---------- publicidad (Show Time TV) ----------
local tarjeta = UI.nuevo("Frame", { Name = "Publicidad", Visible = false, Size = UDim2.fromScale(1, 1), BackgroundColor3 = Color3.fromRGB(10, 10, 30), ZIndex = 26 }, gui)
local tMarca = UI.nuevo("TextLabel", { Text = "", Font = Enum.Font.FredokaOne, TextScaled = true, TextColor3 = Color3.new(1, 1, 1), BackgroundTransparency = 1, Position = UDim2.fromScale(0.1, 0.12), Size = UDim2.fromScale(0.8, 0.2), ZIndex = 27 }, tarjeta)
local tProd = UI.nuevo("TextLabel", { Text = "", Font = Enum.Font.GothamBlack, TextScaled = true, TextColor3 = Color3.fromRGB(255, 230, 120), BackgroundTransparency = 1, Position = UDim2.fromScale(0.1, 0.34), Size = UDim2.fromScale(0.8, 0.1), ZIndex = 27 }, tarjeta)
local tLinea = UI.nuevo("TextLabel", { Text = "", Font = Enum.Font.GothamBold, TextScaled = true, TextWrapped = true, TextColor3 = Color3.new(1, 1, 1), BackgroundTransparency = 1, Position = UDim2.fromScale(0.1, 0.52), Size = UDim2.fromScale(0.8, 0.22), ZIndex = 27 }, tarjeta)
local tCadena = UI.nuevo("TextLabel", { Text = "★ " .. string.upper(C.cadena or "SHOW TIME TV"), Font = Enum.Font.GothamBlack, TextScaled = true, TextColor3 = Color3.fromRGB(255, 210, 58), BackgroundTransparency = 1, Position = UDim2.new(1, -230, 0, 12), Size = UDim2.new(0, 210, 0, 30), ZIndex = 27 }, tarjeta)
local _ = tCadena
local function hablaTarjeta(voz, t)
	tLinea.Text = t
	local d = esc:voz(voz or "carlfm", t) or (0.9 + #string.split(t, " ") * 0.33)
	local t0 = os.clock(); while os.clock() - t0 < d and not esc.saltar do task.wait(0.05) end
end
local function anuncio(a)
	tarjeta.Visible = true
	local c = a.color or { "#203080", "#101040" }
	tarjeta.BackgroundColor3 = rgbHex(c[2] or c[1]); tMarca.Text = a.marca or a.titulo or ""; tProd.Text = a.producto or (a.emoji or ""); tLinea.Text = ""
	for _, l in ipairs(a.lineas or {}) do if esc.saltar then break end; hablaTarjeta(a.voz, l) end
	if a.lema then tLinea.Text = a.lema; task.wait(1.2) end
end
local function cortinilla(t) tarjeta.Visible = true; tarjeta.BackgroundColor3 = Color3.fromRGB(20, 10, 60); tMarca.Text = string.upper(C.cadena or ""); tProd.Text = ""; hablaTarjeta("daniela", t) end
local function pausaPublicitaria(n)
	esc.saltar = false; esc.btnSaltar.Visible = true; musica("MusicaPublicidad")
	cortinilla(C.cortinillas.publicidad); cortinilla(n == 1 and C.cortinillas.anuncio1 or C.cortinillas.anuncios3)
	local l = UI.mezcla(C.anuncios)
	for i = 1, (n or 3) do if esc.saltar then break end; anuncio(l[i]) end
	cortinilla(C.cortinillas.volvemos)
	tarjeta.Visible = false; esc.btnSaltar.Visible = false; musica(nil); esc.saltar = false
end

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
local function caeRival(n)
	local p = rivalPer[n]; if not p then return end
	Ev.Abrir:FireServer(n); suena("Trampilla"); task.wait(0.35); suena("Caida")
	local ini = p.pos; local t0 = os.clock()
	while os.clock() - t0 < 1.1 do local k = (os.clock() - t0) / 1.1; p.pos = ini + V3(0, (FONDO + 4 - ini.Y) * k * k, 0); RunService.Heartbeat:Wait() end
	p:visible(false); task.delay(3, function() Ev.Cerrar:FireServer() end)
end

-- un duelo (relojes, PASO, rival IA): true si gana el jugador
local function jugarDuelo(id, rivalN, rivalNombre, segundos, sinCaida)
	duelo.Visible = true; ui:ocultar(); musica("MusicaDuelo")
	esc:camaraA(CFrame.lookAt(trampPos(0):Lerp(trampPos(rivalN), 0.5) + V3(0, 26, 30), trampPos(0):Lerp(trampPos(rivalN), 0.5)), 1)
	nomT.Text = OP.casting or jugador.DisplayName; nomR.Text = rivalNombre
	local tT, tR = segundos, segundos
	local turno = "tu"; local p = saca(); local fin = nil
	local function muestra()
		txtQ.Text = p.q; txtM.Text = p.mascara
		capT.BackgroundTransparency = turno == "tu" and 0 or 0.5; capR.BackgroundTransparency = turno == "rival" and 0 or 0.5
		entrada.TextEditable = turno == "tu"; entrada.Text = ""
		if turno == "tu" then entrada:CaptureFocus() end
	end
	muestra()
	local function responde()
		if turno ~= "tu" or fin then return end
		if correcta(entrada.Text, p) then suena("Acierto"); ui:aviso(azar(C.frases.ok) .. " " .. p.entera, 1.5); turno = "rival"; p = saca(); muestra()
		else suena("Fallo"); entrada.Text = ""; entrada:CaptureFocus() end
	end
	local conR = bResp.MouseButton1Click:Connect(responde)
	local conE = entrada.FocusLost:Connect(function(enter) if enter then responde() end end)
	local conP = bPaso.MouseButton1Click:Connect(function() if turno == "tu" and not fin then suena("Paso"); ui:aviso(azar(C.frases.pasaSin), 1.8); p = saca(); muestra() end end)
	local rp = rivalPer[rivalN]
	task.spawn(function()
		while not fin and partida == id do
			if turno == "rival" then
				local espera = 2 + math.random() * 5; local t0 = os.clock()
				while os.clock() - t0 < espera and not fin and turno == "rival" do task.wait(0.1) end
				if fin or partida ~= id then break end
				if math.random() < 0.68 then suena("Acierto"); if rp then rp:decir(p.entera .. "!", 1.5); rp:gesto("arriba", 1) end; turno = "tu"; p = saca(); muestra()
				else suena("Paso"); if rp then rp:decir("¡Paso!", 1); rp:gesto("encoge", 1) end; p = saca(); muestra() end
			else task.wait(0.1) end
		end
	end)
	local ultimoTic = 0
	while not fin and partida == id do
		local dt = RunService.Heartbeat:Wait()
		if turno == "tu" then tT -= dt else tR -= dt end
		tieT.Text = tostring(math.max(0, math.ceil(tT))); tieR.Text = tostring(math.max(0, math.ceil(tR)))
		local actual = turno == "tu" and tT or tR
		if actual < 10.5 and math.ceil(actual) ~= ultimoTic then ultimoTic = math.ceil(actual); suena("Tic") end
		Ev.Marcador:FireServer(math.max(0, tT) / segundos, math.max(0, tR) / segundos)
		if tT <= 0 then fin = "rival" elseif tR <= 0 then fin = "tu" end
	end
	conR:Disconnect(); conE:Disconnect(); conP:Disconnect(); entrada:ReleaseFocus()
	duelo.Visible = false
	if partida ~= id then return nil end
	suena("Reloj")
	if fin == "rival" then esc:linea("adrian", azar(C.frases.tiempo), "host", "lamenta", "ooh") else esc:linea("adrian", rellena(azar(C.frases.botTiempo), { n = rivalN }), "opp" .. rivalN, "senala", "ooh") end
	if not sinCaida then
		esc:rotulo("¡AHORA CAE!", 1.4)
		if fin == "tu" then esc:camaraA(camara("hole" .. rivalN), 0.6); caeRival(rivalN) else esc:camaraA(camara("hole0"), 0.6); Ev.Abrir:FireServer(0); suena("Caida") end
		task.wait(2)
	end
	return fin == "tu"
end

-- ---------- huellas y moneda (cifras de la etapa) ----------
local function cifrasEtapa()
	local e = C.etapas[OP.etapa] or C.etapas["2021"]
	local l = OP.huellas or (e and e.cifras) or { 1000, 2500, 5000, 10000, 15000, 25000, 50000, "vida", "mitad", "doble", "cero" }
	return l
end
local function txtCifra(v) if v == "vida" then return "COMODÍN" elseif v == "mitad" then return "÷2" elseif v == "doble" then return "x2" elseif v == "cero" then return "LO PIERDES TODO" end; return "+" .. UI.euros(tonumber(v) or 0) end
local function eligeHuella(estado)
	local l = UI.mezcla(table.clone(cifrasEtapa())); local elegido
	ui:menu("Elige una huella", {})
	for i = 1, 3 do ui:boton("👣 Huella " .. i, "Detrás hay una cifra… o una sorpresa", i == 2, function() elegido = i end) end
	while not elegido do task.wait(0.1) end
	ui:ocultar(); local v = l[elegido]; suena("Moneda")
	esc:rotulo(txtCifra(v), 1.8)
	if v == "vida" then estado.vidas += 1 elseif v == "mitad" then estado.placar = math.floor(estado.placar / 2) elseif v == "doble" then estado.placar *= 2 elseif v == "cero" then estado.placar = 0 else estado.placar += tonumber(v) or 0 end
	coproMomento("moneda", {}, 0.6)
end
local function eligeRival(quedan)
	local elegido = nil
	ui:menu(azar(C.frases.elige), {})
	ui:boton("🎲 Al azar", "Que lo decida la suerte", true, function() elegido = quedan[math.random(#quedan)] end)
	for _, n in ipairs(quedan) do ui:boton("👣 " .. n .. " · " .. rivalNom[n], "Trampilla " .. n, false, function() elegido = n end) end
	while not elegido do task.wait(0.1) end
	ui:ocultar(); return elegido
end

local menuApp
local function finPartida(titulo, texto)
	musica("MusicaMenu"); btnMenu.Visible = false; esc:liberarCamara(); coproSale()
	ui:texto(titulo, texto, function() menuApp:mostrar({}) end)
end

-- ---------- juego final: 10 preguntas en 2 minutos ----------
local function juegoFinal(id, entreno)
	musica("MusicaFinal"); Ev.Led:FireServer(Color3.fromRGB(255, 200, 40))
	esc:linea("adrian", entreno and C.frases.trFinal or C.frases.final, "host", "arriba", "aplauso")
	duelo.Visible = true; capR.Visible = false; nomT.Text = "JUEGO FINAL"
	local t, aciertos = 120, 0; local p = saca(); local cola = {}
	local function pon() txtQ.Text = p.q; txtM.Text = p.mascara; entrada.Text = ""; entrada.TextEditable = true; entrada:CaptureFocus() end
	pon(); local fallo = false
	local c1 = bResp.MouseButton1Click:Connect(function() if correcta(entrada.Text, p) then aciertos += 1; suena("Acierto"); p = table.remove(cola, 1) or saca(); pon() else suena("Fallo"); fallo = true end end)
	local c2 = bPaso.MouseButton1Click:Connect(function() suena("Paso"); table.insert(cola, p); p = table.remove(cola, 1); if p == cola[#cola] then p = saca() end; pon() end)
	local c3 = entrada.FocusLost:Connect(function(enter) if enter then if correcta(entrada.Text, p) then aciertos += 1; suena("Acierto"); p = table.remove(cola, 1) or saca(); pon() else suena("Fallo"); fallo = true end end end)
	while t > 0 and aciertos < 10 and not fallo and partida == id do t -= RunService.Heartbeat:Wait(); tieT.Text = tostring(math.max(0, math.ceil(t))); nomT.Text = "FINAL · " .. aciertos .. "/10" end
	c1:Disconnect(); c2:Disconnect(); c3:Disconnect(); duelo.Visible = false; capR.Visible = true
	return aciertos >= 10, aciertos
end

-- ---------- PROGRAMA COMPLETO (mismo orden que la app) ----------
local function programa(modo)
	partida += 1; local id = partida
	btnMenu.Visible = true; ui:ocultar(); musica(nil); actualizaEscena()
	Ev.Rivales:FireServer({}); crearRivales(); task.wait(0.5)
	Ev.Colocar:FireServer(0)
	local e = esp(); local estado = { placar = 0, vidas = (C.etapas[OP.etapa] or {}).comodines or 2 }
	if modo == "programa" then
		if OP.apertura then cabecera() end
		if partida ~= id then return end
		regidor("aire")
		esc:linea("adrian", e.saludo or "¡Muy buenas noches y bienvenidos a ¡Ahora Caigo!", "host", "saluda", "aplauso")
		for _, x in ipairs(e.extra or {}) do esc:linea("adrian", x, "host", "habla", "") end
		coproEntra(); regidor("aplausos")
		if OP.monologo and math.random() < 0.4 then local m = C.monologos[math.random(#C.monologos)]; for _, l in ipairs(m.pasos) do esc:linea("adrian", l[1], "host", (l[2] or ""):match("^(%a+)"), (l[2] or ""):match("risas") and "risas" or "") end end
	end
	esc:linea("adrian", azar(C.frases.sube), "host", "senala", ""); Ev.Colocar:FireServer(0)
	esc:linea("adrian", C.frases.equipo, "wide", "senala", "aplauso")
	if modo == "programa" then
		local iv = azar(C.entrevistas); esc:linea("adrian", rellena(iv[1], { nombre = OP.casting or jugador.DisplayName }), "host", "habla", "")
	end
	local quedan = {}; for i = 1, 10 do quedan[i] = i end
	local ND = modo == "programa" and ((C.etapas[OP.etapa] or {}).duelos or 8) or 1
	pantalla(0, 30, 0)
	for d = 1, ND do
		if partida ~= id then return end
		local n = modo == "programa" and eligeRival(quedan) or quedan[math.random(#quedan)]
		regidor("silencio", 0.85); coproMomento("duelo", { n = d, rival = rivalNom[n] })
		esc:linea("adrian", rellena(azar(C.frases.elegidoT), { n = n }), "opp" .. n, "senala", "")
		rivalPer[n]:gesto("saluda", 1.4)
		local gana = jugarDuelo(id, n, rivalNom[n], 30, modo == "entreno")
		if gana == nil then return end
		if not gana then
			if modo == "entreno" then return finPartida("Entrenamiento", C.frases.trDueloLose) end
			task.wait(1.5); return finPartida("¡Has caído!", "Te ha ganado <b>" .. rivalNom[n] .. "</b> en el duelo " .. d .. ".\nEsta vez has caído… ¡a la próxima!")
		end
		if modo == "entreno" then return finPartida("Entrenamiento", C.frases.trDueloWin) end
		regidor("caida", 0.6); coproMomento("caida", { n = d }, 0.7)
		for i, q in ipairs(quedan) do if q == n then table.remove(quedan, i) break end end
		eligeHuella(estado); pantalla(UI.euros(estado.placar), 30, d)
		if d < ND then regidor("entre", 0.55) end
		if OP.publicidad and d == math.floor(ND / 2) then
			regidor("pub"); esc:linea("adrian", C.frasesPub[1], "wide", "saluda", ""); pausaPublicitaria(2); regidor("vuelta")
			esc:linea("adrian", C.frasesPub[2] or "¡Ya estamos de vuelta!", "host", "aplaude", "aplauso")
		end
	end
	if estado.placar <= 0 then esc:linea("adrian", C.frases.cero, "host", "lamenta", "ooh"); return finPartida("Marcador a cero", C.frases.cero) end
	-- decisión: plantarse (la mitad) o juego final
	regidor("decision", 0.8); coproMomento("decision")
	local dec
	ui:menu("¿Te plantas o juegas el final?", {})
	ui:boton("🛑 Plantarse", "Te llevas la mitad: " .. UI.euros(math.floor(estado.placar / 2)), false, function() dec = "plantarse" end)
	ui:boton("▶ Juego final", "10 preguntas en 2 minutos para doblar " .. UI.euros(estado.placar), true, function() dec = "final" end)
	while not dec and partida == id do task.wait(0.1) end
	ui:ocultar(); if partida ~= id then return end
	if dec == "plantarse" then
		estado.placar = math.floor(estado.placar / 2); esc:linea("adrian", C.frases.plantas, "player", "aplaude", "aplauso")
		coproMomento("planta"); regidor("fin"); coproSale()
		return finPartida("Te has plantado", "Te has plantado con <b>" .. UI.euros(estado.placar) .. "</b>.")
	end
	regidor("final"); coproMomento("final")
	local ok = juegoFinal(id)
	if partida ~= id then return end
	if ok then estado.placar *= 2; suena("Fanfarria"); Ev.Led:FireServer("arcoiris"); esc:linea("adrian", C.frases.ganado, "player", "arriba", "aplauso"); coproMomento("gana")
	else esc:linea("adrian", azar(C.frases.tiempo), "host", "lamenta", "ooh"); Ev.Abrir:FireServer(0); suena("Caida"); task.wait(3); coproMomento("pierde") end
	coproMomento("adios"); regidor("fin")
	return finPartida(ok and "¡HAS GANADO!" or "¡Has caído en el final!", ok and ("¡Has ganado <b>" .. UI.euros(estado.placar) .. "</b>!") or "Esta vez has caído… ¡a la próxima!")
end

-- ---------- entrenamientos sueltos ----------
local function entrenaFinal() partida += 1; local id = partida; btnMenu.Visible = true; ui:ocultar(); actualizaEscena(); local ok, n = juegoFinal(id, true); if partida == id then finPartida("Juego final", ok and C.frases.trFinalOk or rellena(C.frases.trFinalT, { n = n })) end end
local function entrenaHuellas() partida += 1; btnMenu.Visible = true; ui:ocultar(); actualizaEscena(); esc:linea("adrian", C.frases.trHuellas, "host", "senala", ""); local st = { placar = 0, vidas = 0 }; for _ = 1, 4 do eligeHuella(st) end; finPartida("Huellas y moneda", C.frases.trHuellasFin .. "\n<b>" .. UI.euros(st.placar) .. "</b>") end
local function explorar(linea) ui:ocultar(); btnMenu.Visible = true; esc:liberarCamara(); if linea then ui:aviso(linea, 5) end end

-- ---------- promos ----------
local function promo3d(p)
	partida += 1; ui:ocultar(); btnMenu.Visible = true; musica("MusicaPromo"); esc.saltar = false; esc.btnSaltar.Visible = true
	local t0 = os.clock(); local k = 1
	local pts = { CFrame.lookAt(V3(60, 30, 80), V3(0, 8, 0)), CFrame.lookAt(V3(0, 14, 30), V3(0, 10, 0)), CFrame.lookAt(V3(-50, 20, 20), V3(0, 8, 0)), CFrame.lookAt(V3(0, 60, 2), V3(0, 0, 0)), CFrame.lookAt(V3(0, 26, 90), V3(0, 8, 0)) }
	task.spawn(function() esc:camaraRecorrido(pts, math.min(p.dur or 20, 40)) end)
	while k <= #p.rotulos and not esc.saltar do
		local r = p.rotulos[k]; while os.clock() - t0 < r[1] and not esc.saltar do task.wait(0.05) end
		task.spawn(function() esc:rotulo(r[3], math.max(1, r[2] - r[1])) end); k += 1
	end
	task.wait(1.5); esc.btnSaltar.Visible = false; musica("MusicaMenu"); esc:liberarCamara(); menuApp:mostrar({ "Promos Promos 3D con Adrián Vega: casting, gran anuncio, esta noche…" })
end
local function promoAdrian(p)
	ui:ocultar(); btnMenu.Visible = true; actualizaEscena(); esc.saltar = false; esc.btnSaltar.Visible = true
	for _, l in ipairs(p.pasos) do
		if esc.saltar then break end
		if l[3] then task.spawn(function() esc:rotulo(l[3] .. (l[4] and ("\n" .. l[4]) or ""), 3) end) end
		esc:linea("adrian", l[1], "host", l[2] or "habla", "")
	end
	esc.btnSaltar.Visible = false; esc:liberarCamara(); menuApp:atras()
end
local function historia(h)
	ui:ocultar(); btnMenu.Visible = true; actualizaEscena(); esc.saltar = false
	local orb = true
	task.spawn(function() local a = 0; while orb do a += 0.004; workspace.CurrentCamera.CameraType = Enum.CameraType.Scriptable; workspace.CurrentCamera.CFrame = CFrame.lookAt(V3(math.sin(a) * 70, 26, math.cos(a) * 70), V3(0, 8, 0)); RunService.RenderStepped:Wait() end end)
	for _, t in ipairs(h.narr) do if esc.saltar then break end; esc:linea("adrian", t, nil, "habla", "") end
	orb = false
	local txt = {}; for _, it in ipairs(h.tarjeta or {}) do table.insert(txt, "<b>" .. tostring(it[1]) .. "</b>: " .. tostring(it[2] or "")) end
	esc:liberarCamara(); ui:texto((h.emoji or "") .. " " .. h.titulo, table.concat(txt, "\n"), function() menuApp:atras() end)
end
local function monologo(m)
	ui:ocultar(); btnMenu.Visible = true; actualizaEscena(); esc.saltar = false; esc.btnSaltar.Visible = true
	PER.adrian:ponerEn(V3(0, H, 44), V3(0, H, 90))
	for _, l in ipairs(m.pasos) do if esc.saltar then break end; local g = tostring(l[2] or ""); esc:linea("adrian", l[1], "host", g:match("^(%a+)") or "habla", g:find("risas") and "risas" or "") end
	PER.adrian:ponerEn(V3(9, PODIO, 13), V3(9, PODIO, 80)); esc.btnSaltar.Visible = false; esc:liberarCamara(); menuApp:atras()
end
local function promoCadena(p)
	ui:ocultar(); esc.saltar = false; esc.btnSaltar.Visible = true
	tarjeta.Visible = true; tarjeta.BackgroundColor3 = Color3.fromRGB(30, 10, 70); tMarca.Text = (p.emoji or "") .. " " .. p.titulo; tProd.Text = string.upper(C.cadena or "")
	for _, l in ipairs(p.lineas or {}) do if esc.saltar then break end; hablaTarjeta(p.voz, l) end
	tarjeta.Visible = false; esc.btnSaltar.Visible = false; menuApp:atras()
end

-- ---------- acciones del menú (por título, igual que la app) ----------
local function buscar(lista, titulo) for _, x in ipairs(lista or {}) do if x.titulo == titulo or x.nombre == titulo or x.marca == titulo then return x end end end
local function quitaEmoji(t) return (tostring(t):gsub("^[^%wÁÉÍÓÚÑ¡¿«]+", "")) end
local ACC = {}
ACC.ir = function(ctx)
	local t = quitaEmoji(ctx.titulo); local r1 = quitaEmoji(ctx.ruta[1] or ""):match("^(%S+%s?%S*)") or ""
	local pantallaT = table.concat(ctx.ruta, " › ")
	if t == "Programa completo" then return task.spawn(programa, "programa") end
	if t:find("^Duelo contra") or t:find("^Pruebas") or t:find("^Palabra gallina") or t:find("^Entre tres") or t:find("^Adivina") or t:find("^¡Dame letra") or t:find("^¿Sí o no") or t:find("^¡Vaya lío") or t:find("^Elección del central") then return task.spawn(programa, "entreno") end
	if t:find("^Juego final") then return task.spawn(entrenaFinal) end
	if t:find("^Huellas y moneda") then return task.spawn(entrenaHuellas) end
	if t:find("^Clásico") then OP.clasico = true; return task.spawn(programa, "clasico") end
	if t:find("^Explorar") then return explorar(C.frases.explBienvenida) end
	if t:find("^Paseo") then return explorar(C.paseo.bienvenida) end
	-- escenas
	for _, col in ipairs({ "oculta", "tomas", "fuera" }) do local sk = buscar(C[col], t); if sk then return task.spawn(function() ui:ocultar(); btnMenu.Visible = true; actualizaEscena(); correrEscena(sk); esc:liberarCamara(); menuApp:atras() end) end end
	local m = buscar(C.monologos, t); if m then return task.spawn(monologo, m) end
	if t:find("^Al azar") then
		if pantallaT:find("Monólogos") then return task.spawn(monologo, C.monologos[math.random(#C.monologos)]) end
		for _, col in ipairs({ "oculta", "tomas", "fuera" }) do if pantallaT:find(({ oculta = "Cámara oculta", tomas = "Tomas falsas", fuera = "Fuera de cámaras" })[col]) then local l = C[col]; return task.spawn(function() ui:ocultar(); btnMenu.Visible = true; actualizaEscena(); correrEscena(l[math.random(#l)]); esc:liberarCamara(); menuApp:atras() end) end end
	end
	for _, p in ipairs(C.promos3d) do if p.nombre == t then return task.spawn(promo3d, p) end end
	local pa = buscar(C.promosAdrian, t); if pa then return task.spawn(promoAdrian, pa) end
	local an = buscar(C.anuncios, t) or (function() for _, a in ipairs(C.anuncios) do if t:find(a.marca, 1, true) then return a end end end)()
	if an then return task.spawn(function() ui:ocultar(); esc.saltar = false; esc.btnSaltar.Visible = true; anuncio(an); tarjeta.Visible = false; esc.btnSaltar.Visible = false; menuApp:atras() end) end
	local pc = buscar(C.promosCadena, t); if pc then return task.spawn(promoCadena, pc) end
	if t:find("[Pp]ausa") or t:find("[Pp]ublicidad completa") or t:find("Ver la pausa") then return task.spawn(function() ui:ocultar(); pausaPublicitaria(3); menuApp:atras() end) end
	local h = buscar(C.historia, t); if h then return task.spawn(historia, h) end
	if t:find("Que me la cuente") then return task.spawn(function() for _, x in ipairs(C.historia) do historia(x); if esc.saltar then break end end end) end
	if t:find("Restaurar") then OP.titulo = nil; pintaTitulo(); return ui:aviso("Título original restaurado", 2) end
	ui:aviso(t, 2)
	local _ = r1
end
-- filas de Opciones: mismas etiquetas que la app
ACC.opcion = function(etq, valor)
	local e = tostring(etq):lower(); local v = tostring(valor)
	local si = not (v == "No" or v == "Off" or v:find("^Desactiv"))
	if e:find("música") or e:find("musica") then OP.musica = si; if not si then musica(nil) else musica("MusicaMenu") end
	elseif e:find("efectos") or e:find("sonido") then OP.efectos = si
	elseif e:find("voz") or e:find("voces") then OP.voz = si
	elseif e:find("subt") then OP.subtitulos = si
	elseif e:find("sorpresa") then OP.copro = si
	elseif e:find("regidor") then OP.regidor = si
	elseif e:find("publicidad") then OP.publicidad = si
	elseif e:find("monólogo") then OP.monologo = si
	elseif e:find("cabecera") or e:find("apertura") then OP.apertura = si
	elseif e:find("etapa") or e:find("época") then for k in pairs(C.etapas) do if v:find(k) then OP.etapa = k end end
	elseif e:find("título") or e:find("titulo") then if valor ~= "" then OP.titulo = valor; pintaTitulo() end
	elseif e:find("nombre") then OP.casting = valor ~= "" and valor or nil
	elseif e == "" or e:find("especial") then for _, x in ipairs(C.especiales) do if v:find(x.name, 1, true) then OP.especial = x.id; crearEquipo(); pintaTitulo() end end end
end
ACC.alMostrar = function(ruta) if #ruta == 0 then musica("MusicaMenu"); btnMenu.Visible = false end end
menuApp = MenuApp.nuevo(ui, UI, Pantallas, ACC)
btnMenu.MouseButton1Click:Connect(function() partida += 1; esc.saltar = true; duelo.Visible = false; tarjeta.Visible = false; ui:bocadillo(); Ev.Cerrar:FireServer(); coproSale(); quitarRivales(); esc:liberarCamara(); menuApp:mostrar({}) end)

crearEquipo(); actualizaEscena(); pintaTitulo()
menuApp:mostrar({})
