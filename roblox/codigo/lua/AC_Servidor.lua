-- ¡Ahora Caigo! campeón edition · servidor: trampillas que se abren de verdad, rivales, luces y pantallas
local TweenService = game:GetService("TweenService")
local Players = game:GetService("Players")
local RS = game:GetService("ReplicatedStorage")
local Ev = RS:WaitForChild("Eventos")
local plato = workspace:WaitForChild("PlatoAhoraCaigo")
local trampillas = plato:WaitForChild("Trampillas")
local abiertas = {}

local function puertas(n)
	local t = trampillas:FindFirstChild("Trampilla" .. n)
	if not t then return nil end
	return t, t:FindFirstChild("PuertaIzquierda"), t:FindFirstChild("PuertaDerecha")
end

-- guarda la posición cerrada de cada puerta
local cerradas = {}
for n = 0, 10 do
	local _, a, b = puertas(n)
	if a and b then cerradas[a] = a.CFrame; cerradas[b] = b.CFrame end
end

local function sonar(nombre) Ev.Sonido:FireAllClients(nombre) end

local function abrir(n)
	local _, a, b = puertas(n)
	if not a or abiertas[n] then return end
	abiertas[n] = true
	sonar("Trampilla")
	for _, info in ipairs({ { a, -1 }, { b, 1 } }) do
		local p, s = info[1], info[2]
		local w = p.Size.X
		-- la bisagra está en el borde exterior de cada mitad; la mitad gira 90º hacia abajo
		local bisagra = cerradas[p] * CFrame.new(s * w / 2, 0, 0)
		local destino = bisagra * CFrame.Angles(0, 0, s * math.rad(90)) * CFrame.new(-s * w / 2, 0, 0)
		p.CanCollide = false
		TweenService:Create(p, TweenInfo.new(0.35, Enum.EasingStyle.Quad, Enum.EasingDirection.In), { CFrame = destino }):Play()
	end
	-- empuja hacia abajo lo que esté encima (por si acaso)
	local t = puertas(n)
	local centro = t.PuertaIzquierda.Position:Lerp(t.PuertaDerecha.Position, 0.5)
	for _, o in ipairs(workspace:GetPartBoundsInRadius(centro + Vector3.new(0, 3, 0), 7)) do
		if not o.Anchored then o.AssemblyLinearVelocity = Vector3.new(0, -30, 0) end
	end
end

local function cerrar(n)
	local _, a, b = puertas(n)
	if not a then return end
	for _, p in ipairs({ a, b }) do
		TweenService:Create(p, TweenInfo.new(0.6), { CFrame = cerradas[p] }):Play()
		task.delay(0.6, function() p.CanCollide = true end)
	end
	abiertas[n] = nil
end

local function cerrarTodas() for n = 0, 10 do if abiertas[n] then cerrar(n) end end end

local function centroTrampilla(n)
	local _, a, b = puertas(n)
	return a.Position:Lerp(b.Position, 0.5)
end

-- rivales: figuras de bloques con nombre que caen al abrirse su trampilla
local rivales = {}
local COLORES = { Color3.fromRGB(230, 60, 60), Color3.fromRGB(60, 140, 230), Color3.fromRGB(60, 200, 90), Color3.fromRGB(240, 190, 40), Color3.fromRGB(170, 70, 220) }
local function crearRival(n, nombre)
	if rivales[n] then rivales[n]:Destroy() end
	local m = Instance.new("Model"); m.Name = "Rival" .. n
	local base = centroTrampilla(n) + Vector3.new(0, 0.5, 0)
	local function pieza(nom, tam, off, color)
		local p = Instance.new("Part"); p.Name = nom; p.Size = tam; p.Color = color; p.Material = Enum.Material.SmoothPlastic
		p.Anchored = true; p.CFrame = CFrame.new(base + off); p.Parent = m; return p
	end
	local c = COLORES[(n - 1) % #COLORES + 1]
	local torso = pieza("Torso", Vector3.new(2, 2, 1), Vector3.new(0, 3, 0), c)
	local piernas = pieza("Piernas", Vector3.new(2, 2, 1), Vector3.new(0, 1, 0), Color3.fromRGB(30, 30, 50))
	local cabeza = pieza("Cabeza", Vector3.new(1.2, 1.2, 1.2), Vector3.new(0, 4.6, 0), Color3.fromRGB(240, 200, 160))
	for _, p in ipairs({ piernas, cabeza }) do local w = Instance.new("WeldConstraint"); w.Part0 = torso; w.Part1 = p; w.Parent = torso end
	m.PrimaryPart = torso
	local bb = Instance.new("BillboardGui"); bb.Size = UDim2.new(0, 140, 0, 30); bb.StudsOffset = Vector3.new(0, 2, 0); bb.AlwaysOnTop = true; bb.Parent = cabeza
	local t = Instance.new("TextLabel"); t.Size = UDim2.fromScale(1, 1); t.BackgroundTransparency = 1; t.Text = nombre; t.TextScaled = true; t.Font = Enum.Font.GothamBlack; t.TextColor3 = Color3.new(1, 1, 1); t.TextStrokeTransparency = 0; t.Parent = bb
	m.Parent = workspace
	local _, a = puertas(n)
	local mira = Vector3.new(0, base.Y, 0)
	m:PivotTo(CFrame.lookAt(m:GetPivot().Position, mira))
	rivales[n] = m
	local tr = trampillas:FindFirstChild("Trampilla" .. n)
	local atril = tr and tr:FindFirstChild("Atril")
	if atril then atril.Rotulo.Nombre.Text = nombre end
end

local function colocarJugador(plr, n)
	local ch = plr.Character
	if ch and ch:FindFirstChild("HumanoidRootPart") then
		local c = centroTrampilla(n) + Vector3.new(0, 4, 0)
		ch:PivotTo(CFrame.lookAt(c, Vector3.new(0, c.Y, 60)))
	end
end

Ev.Rivales.OnServerEvent:Connect(function(plr, nombres)
	for n = 1, 10 do if rivales[n] then rivales[n]:Destroy(); rivales[n] = nil end end
	cerrarTodas()
	task.wait(0.7)
	for n, nom in ipairs(nombres) do if n <= 10 then crearRival(n, tostring(nom)) end end
end)
Ev.Colocar.OnServerEvent:Connect(function(plr, n) colocarJugador(plr, math.clamp(tonumber(n) or 0, 0, 10)) end)
Ev.Abrir.OnServerEvent:Connect(function(plr, n)
	n = math.clamp(tonumber(n) or 0, 0, 10)
	abrir(n)
	if n == 0 then -- el jugador cae: vuelve a aparecer a los 4 segundos
		task.delay(4, function() if plr.Parent then plr:LoadCharacter() end end)
	end
end)
Ev.Cerrar.OnServerEvent:Connect(function() cerrarTodas() end)
Ev.Pantalla.OnServerEvent:Connect(function(plr, premio, tiempo, escalon)
	local g = plato.PantallaFondo.PantallaFondo.Escalera
	g.Premio.Text = tostring(premio); g.Tiempo.Text = tostring(tiempo)
	for i = 1, 10 do local e = g:FindFirstChild("Escalon" .. i); if e then e.BackgroundColor3 = (i <= (escalon or 0)) and Color3.fromRGB(255, 120, 20) or Color3.fromRGB(255, 200, 32) end end
end)
Ev.Marcador.OnServerEvent:Connect(function(plr, verde, rojo)
	for nombre, frac in pairs({ MarcadorVerde = verde, MarcadorRojo = rojo }) do
		local m = plato.Techo.Parent.Marcadores:FindFirstChild(nombre)
		for s = 1, 5 do local seg = m:FindFirstChild("Segmento" .. s); if seg then seg.Transparency = (s <= math.ceil((frac or 0) * 5)) and 0 or 0.85 end end
	end
end)

-- sala de control: botones rojos 0-10 y colores de los LED
local leds = plato.PanelesLED:GetChildren()
local arco = {}
for i, p in ipairs(leds) do arco[p] = p.Color end
local function colorLED(c)
	for _, p in ipairs(leds) do
		if c == "apagar" then p.Material = Enum.Material.SmoothPlastic; p.Color = Color3.fromRGB(20, 20, 24)
		elseif c == "arcoiris" then p.Material = Enum.Material.Neon; p.Color = arco[p]
		else p.Material = Enum.Material.Neon; p.Color = c end
	end
end
local sala = plato.Backstage.SalaControl
for n = 0, 10 do
	local b = sala:FindFirstChild("Boton" .. n)
	if b then b.Clic.MouseClick:Connect(function(plr)
		if abiertas[n] then cerrar(n) else abrir(n); if n == 0 then for _, p in ipairs(Players:GetPlayers()) do end end end
		if rivales[n] then local r = rivales[n]; rivales[n] = nil; for _, p in ipairs(r:GetDescendants()) do if p:IsA("BasePart") then p.Anchored = false end end; task.delay(5, function() r:Destroy() end) end
	end) end
end
local mapa = { LED_Apagar = "apagar", LED_Arcoiris = "arcoiris", LED_Rojo = Color3.fromRGB(255, 32, 32), LED_Azul = Color3.fromRGB(32, 80, 255), LED_Verde = Color3.fromRGB(32, 224, 64), LED_Morado = Color3.fromRGB(160, 32, 255), LED_Amarillo = Color3.fromRGB(255, 208, 32) }
for nombre, c in pairs(mapa) do local b = sala:FindFirstChild(nombre); if b then b.Clic.MouseClick:Connect(function() colorLED(c) end) end end
sala.Cerrar_Trampillas.Clic.MouseClick:Connect(cerrarTodas)
Ev.Caer.OnServerEvent:Connect(function(plr, n)
	n = math.clamp(tonumber(n) or 1, 1, 10)
	abrir(n)
	local r = rivales[n]
	if r then rivales[n] = nil; for _, p in ipairs(r:GetDescendants()) do if p:IsA("BasePart") then p.Anchored = false end end; task.delay(6, function() r:Destroy() end) end
end)

-- puerta del backstage: deja pasar al plató
local puerta = plato.PantallaFondo.PuertaEntrada
puerta.Entrar.Triggered:Connect(function(plr)
	puerta.CanCollide = false; puerta.Transparency = 0.6
	task.delay(3, function() puerta.CanCollide = true; puerta.Transparency = 0 end)
end)

-- cabezas móviles: giran y cambian de color
local focos = plato.Focos:GetChildren()
local PALETA = { Color3.fromRGB(255, 42, 42), Color3.fromRGB(34, 255, 85), Color3.fromRGB(34, 224, 255), Color3.fromRGB(255, 226, 26), Color3.fromRGB(176, 64, 255), Color3.new(1, 1, 1) }
task.spawn(function()
	while true do
		for _, f in ipairs(focos) do
			local cab, rayo = f:FindFirstChild("Cabeza"), f:FindFirstChild("Rayo")
			if cab and rayo then
				local base = f.Base.Position
				local rx, rz = math.rad(math.random(-35, 35)), math.rad(math.random(-35, 35))
				local giro = CFrame.Angles(rx, 0, rz)
				local c = PALETA[math.random(#PALETA)]
				TweenService:Create(cab, TweenInfo.new(2, Enum.EasingStyle.Sine), { CFrame = CFrame.new(base - Vector3.new(0, 2, 0)) * giro }):Play()
				TweenService:Create(rayo, TweenInfo.new(2, Enum.EasingStyle.Sine), { CFrame = CFrame.new(base - Vector3.new(0, 2, 0)) * giro * CFrame.new(0, -30, 0), Color = c }):Play()
				cab.Haz.Color = c
			end
		end
		task.wait(2.5)
	end
end)

-- v1.14: el cliente cambia los LED (programas especiales, efectos de escena): "arcoiris" | "apagar" | Color3
Ev.Led.OnServerEvent:Connect(function(plr, c) if c == "arcoiris" or c == "apagar" or typeof(c) == "Color3" then colorLED(c) end end)
