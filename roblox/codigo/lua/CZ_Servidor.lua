-- El Cazador · servidor: tablero del plató, cazador en su cabina y pantalla de la mesa
local RS = game:GetService("ReplicatedStorage")
local Config = require(RS:WaitForChild("Config"))
local Ev = RS:WaitForChild("Eventos")
local plato = workspace:WaitForChild(Config.plato)
local tablero = plato:FindFirstChild("Tablero", true)
local cabina = plato:FindFirstChild("AtrilCazador", true)
local mesa = plato:FindFirstChild("AtrilesConcursantes", true)
local AZUL, ROJO, CIAN, CASA = Color3.fromRGB(26, 58, 216), Color3.fromRGB(232, 16, 42), Color3.fromRGB(25, 184, 255), Color3.fromRGB(10, 42, 168)

local function fila(i) return tablero:FindFirstChild("Fila" .. i, true) end
-- cazador y jugador: filas desde arriba (1..8); 9 = casa; 0 = aún en la cabina
Ev.Tablero.OnServerEvent:Connect(function(plr, cazador, jugador)
	for i = 1, 8 do
		local p = fila(i)
		if p then p.Color = (i <= cazador) and ROJO or ((i == jugador) and CIAN or AZUL) end
	end
	local c = tablero:FindFirstChild("Casa", true); if c then c.Color = (jugador >= 9) and CIAN or CASA end
end)

local function pon(plr, cf)
	local ch = plr.Character
	if ch and ch:FindFirstChild("HumanoidRootPart") then ch:PivotTo(cf) end
end
Ev.Colocar.OnServerEvent:Connect(function(plr, donde)
	if donde == "mesa" then
		local t = mesa:FindFirstChild("Taburete1", true)
		if t then pon(plr, CFrame.new(t.Position + Vector3.new(0, 4, 0))) end
	elseif type(donde) == "number" then
		local p = (donde >= 9) and tablero:FindFirstChild("Casa", true) or fila(donde)
		if p then pon(plr, CFrame.new(p.Position + Vector3.new(0, 4, 0))) end
	end
end)

local npc
Ev.Cazador.OnServerEvent:Connect(function(plr, nombre)
	if npc then npc:Destroy() end
	local asiento = cabina:FindFirstChild("AsientoCazador", true)
	if not asiento then return end
	npc = Instance.new("Model"); npc.Name = "Cazador"
	local base = asiento.Position + Vector3.new(0, asiento.Size.Y / 2, 0)
	local function pieza(nom, tam, y, color)
		local p = Instance.new("Part"); p.Name = nom; p.Anchored = true; p.Size = tam; p.Color = color; p.Material = Enum.Material.SmoothPlastic
		p.CFrame = CFrame.new(base + Vector3.new(0, y, 0)); p.Parent = npc; return p
	end
	pieza("Piernas", Vector3.new(2, 2, 1), 1, Color3.fromRGB(20, 20, 26)); pieza("Torso", Vector3.new(2, 2, 1), 3, Color3.fromRGB(21, 22, 28))
	local cabeza = pieza("Cabeza", Vector3.new(1.2, 1.2, 1.2), 4.6, Color3.fromRGB(224, 176, 144))
	local bb = Instance.new("BillboardGui"); bb.Size = UDim2.new(0, 220, 0, 40); bb.StudsOffset = Vector3.new(0, 2.5, 0); bb.AlwaysOnTop = true; bb.Parent = cabeza
	local t = Instance.new("TextLabel"); t.Size = UDim2.fromScale(1, 1); t.BackgroundTransparency = 1; t.Text = tostring(nombre); t.TextScaled = true; t.Font = Enum.Font.GothamBlack; t.TextColor3 = Color3.fromRGB(255, 80, 110); t.TextStrokeTransparency = 0; t.Parent = bb
	npc.Parent = workspace
end)

Ev.Mesa.OnServerEvent:Connect(function(plr, linea1, linea2)
	local p = mesa:FindFirstChild("PantallaMesa", true)
	local g = p and p:FindFirstChildOfClass("SurfaceGui")
	if g then
		local a, b = g:FindFirstChild("Texto1"), g:FindFirstChild("Texto2")
		if a then a.Text = tostring(linea1) end; if b then b.Text = tostring(linea2) end
	end
end)
