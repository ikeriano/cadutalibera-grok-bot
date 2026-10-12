-- ¿Quién quiere ser millonario? · servidor: coloca al jugador en la silla y actualiza pantallas y luces del plató
local RS = game:GetService("ReplicatedStorage")
local TweenService = game:GetService("TweenService")
local Ev = RS:WaitForChild("Eventos")
local plato = workspace:WaitForChild("PlatoMillonario")

Ev.Colocar.OnServerEvent:Connect(function(plr)
	local silla = plato.Sillas:FindFirstChild("SillaConcursante")
	local asiento = silla and silla:FindFirstChildWhichIsA("Seat")
	local ch = plr.Character
	if asiento and ch and ch:FindFirstChildOfClass("Humanoid") then
		ch:PivotTo(asiento.CFrame + Vector3.new(0, 3, 0))
		task.wait(0.3); asiento:Sit(ch:FindFirstChildOfClass("Humanoid"))
	end
end)
Ev.Levantar.OnServerEvent:Connect(function(plr)
	local h = plr.Character and plr.Character:FindFirstChildOfClass("Humanoid")
	if h then h.Sit = false; h.Jump = true end
end)
Ev.Pantalla.OnServerEvent:Connect(function(plr, linea1, linea2)
	for _, nombre in ipairs({ "PantallaConcursante", "PantallaPresentador" }) do
		local p = plato.Pantallas:FindFirstChild(nombre)
		local g = p and p:FindFirstChild("Rotulo")
		if g then g.Texto1.Text = tostring(linea1 or ""); g.Texto2.Text = tostring(linea2 or "") end
	end
end)
-- luces: «normal», «tension», «bien», «mal»
local COLOR = { normal = Color3.fromRGB(47, 125, 255), tension = Color3.fromRGB(120, 40, 255), bien = Color3.fromRGB(40, 220, 90), mal = Color3.fromRGB(255, 40, 40) }
local neones = {}
for _, o in ipairs(plato.Luces:GetDescendants()) do if o:IsA("BasePart") and o.Material == Enum.Material.Neon then table.insert(neones, o) end end
local focos = {}
for _, o in ipairs(plato:GetDescendants()) do if o:IsA("SpotLight") then table.insert(focos, o) end end
Ev.Luces.OnServerEvent:Connect(function(plr, modo)
	local c = COLOR[modo] or COLOR.normal
	for _, p in ipairs(neones) do TweenService:Create(p, TweenInfo.new(0.5), { Color = c }):Play() end
	for _, f in ipairs(focos) do f.Color = c end
end)
