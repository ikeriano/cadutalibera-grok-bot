-- Botones de cámara: «Cámara normal» (la de siempre) y «Cámara» (va pasando por los planos de Workspace.Camaras)
local Camaras = {}
function Camaras.crear(gui, UI)
	local cam = workspace.CurrentCamera
	local planos = {}
	local carpeta = workspace:WaitForChild("Camaras", 10)
	if carpeta then for _, p in ipairs(carpeta:GetChildren()) do table.insert(planos, p) end end
	table.sort(planos, function(a, b) return a.Name < b.Name end)
	local i = 0
	local barra = UI.nuevo("Frame", { Name = "BarraCamaras", BackgroundTransparency = 1, Position = UDim2.new(0.5, -110, 1, -54), Size = UDim2.new(0, 220, 0, 46), ZIndex = 30 }, gui)
	local function boton(txt, x, fn)
		local b = UI.nuevo("TextButton", { Name = txt, Text = txt, Font = Enum.Font.GothamBold, TextScaled = true, TextColor3 = Color3.new(1, 1, 1), BackgroundColor3 = Color3.fromRGB(30, 34, 44), BackgroundTransparency = 0.15, Position = UDim2.new(0, x, 0, 0), Size = UDim2.new(0, 104, 1, 0), ZIndex = 31 }, barra)
		UI.esquinas(b, 8); UI.borde(b, Color3.fromRGB(90, 140, 255), 2); b.MouseButton1Click:Connect(fn); return b
	end
	boton("Cámara normal", 0, function() cam.CameraType = Enum.CameraType.Custom end)
	boton("Cámara", 116, function()
		if #planos == 0 then return end
		i = i % #planos + 1; cam.CameraType = Enum.CameraType.Scriptable; cam.CFrame = planos[i].CFrame
	end)
	return barra
end
return Camaras
