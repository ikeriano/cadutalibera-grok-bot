-- UI: menús y paneles con el mismo estilo que las apps (botones píldora azules, el primero dorado)
local TweenService = game:GetService("TweenService")
local UI = {}
UI.__index = UI

local AZUL1, AZUL2, BORDE = Color3.fromRGB(47, 108, 255), Color3.fromRGB(10, 47, 168), Color3.fromRGB(143, 196, 255)
local ORO1, ORO2, BORDE_ORO = Color3.fromRGB(255, 226, 122), Color3.fromRGB(243, 154, 18), Color3.fromRGB(255, 243, 192)

local function nuevo(clase, props, padre)
	local o = Instance.new(clase)
	for k, v in pairs(props or {}) do o[k] = v end
	if padre then o.Parent = padre end
	return o
end
UI.nuevo = nuevo

local function esquinas(o, r) nuevo("UICorner", { CornerRadius = UDim.new(0, r or 40) }, o) end
local function degradado(o, a, b) nuevo("UIGradient", { Color = ColorSequence.new(a, b), Rotation = 90 }, o) end
local function borde(o, c, g) nuevo("UIStroke", { Color = c, Thickness = g or 3, ApplyStrokeMode = Enum.ApplyStrokeMode.Border }, o) end
UI.esquinas, UI.degradado, UI.borde = esquinas, degradado, borde

function UI.new(gui, tema)
	local self = setmetatable({ gui = gui, tema = tema }, UI)
	self.raiz = nuevo("Frame", { Name = "Menu", Size = UDim2.fromScale(1, 1), BackgroundColor3 = Color3.fromRGB(2, 4, 12), BackgroundTransparency = 0.35, BorderSizePixel = 0, ZIndex = 5 }, gui)
	nuevo("UIGradient", { Transparency = NumberSequence.new({ NumberSequenceKeypoint.new(0, 1), NumberSequenceKeypoint.new(0.4, 1), NumberSequenceKeypoint.new(0.58, 0.2), NumberSequenceKeypoint.new(1, 0.2) }) }, self.raiz)
	-- logo a la izquierda
	local logo = nuevo("Frame", { Name = "Logo", BackgroundTransparency = 1, Position = UDim2.fromScale(0.03, 0.08), Size = UDim2.fromScale(0.46, 0.84), ZIndex = 6 }, self.raiz)
	local img = nuevo("ImageLabel", { Name = "ImagenLogo", BackgroundTransparency = 1, Size = UDim2.fromScale(1, 0.82), ScaleType = Enum.ScaleType.Fit, Image = tema.logoImagen or "", ZIndex = 7 }, logo)
	if not tema.logoImagen or tema.logoImagen == "" or tema.logoImagen == "rbxassetid://0" then
		img.Visible = false
		local n = #tema.logo
		for i, linea in ipairs(tema.logo) do
			local t = nuevo("TextLabel", { BackgroundTransparency = 1, Text = linea.t, TextScaled = true, Font = Enum.Font.FredokaOne, TextColor3 = linea.c or Color3.new(1, 1, 1),
				Position = UDim2.fromScale(0, 0.06 + (i - 1) * 0.76 / n), Size = UDim2.fromScale(1, 0.76 / n * (linea.h or 1)), ZIndex = 7 }, logo)
			nuevo("UIStroke", { Color = linea.borde or Color3.fromRGB(10, 20, 60), Thickness = 4 }, t)
		end
	end
	local tag = nuevo("TextLabel", { Name = "Etiqueta", Text = tema.tag or "EL JUEGO · 3D", Font = Enum.Font.GothamBlack, TextScaled = true, TextColor3 = Color3.fromRGB(255, 210, 58), BackgroundColor3 = Color3.fromRGB(20, 20, 30), BackgroundTransparency = 0.2,
		Position = UDim2.fromScale(0.28, 0.88), Size = UDim2.fromScale(0.44, 0.08), ZIndex = 7 }, logo)
	esquinas(tag, 30); borde(tag, Color3.fromRGB(255, 210, 58), 2)
	-- columna de botones a la derecha
	self.col = nuevo("ScrollingFrame", { Name = "Columna", BackgroundTransparency = 1, BorderSizePixel = 0, Position = UDim2.fromScale(0.58, 0.03), Size = UDim2.fromScale(0.39, 0.94), CanvasSize = UDim2.new(), AutomaticCanvasSize = Enum.AutomaticSize.Y, ScrollBarThickness = 6, ZIndex = 6 }, self.raiz)
	nuevo("UIListLayout", { Padding = UDim.new(0, 8), SortOrder = Enum.SortOrder.LayoutOrder }, self.col)
	nuevo("UIPadding", { PaddingTop = UDim.new(0, 6), PaddingLeft = UDim.new(0, 6), PaddingRight = UDim.new(0, 10) }, self.col)
	nuevo("TextLabel", { Name = "Version", Text = tema.version or "", BackgroundTransparency = 1, TextColor3 = Color3.fromRGB(150, 160, 190), Font = Enum.Font.Gotham, TextSize = 12, Position = UDim2.new(0, 8, 1, -20), Size = UDim2.new(0, 80, 0, 16), TextXAlignment = Enum.TextXAlignment.Left, ZIndex = 6 }, self.raiz)
	-- aviso (toast) y bocadillo
	self.toast = nuevo("TextLabel", { Name = "Aviso", Visible = false, Text = "", Font = Enum.Font.GothamBold, TextScaled = true, TextColor3 = Color3.new(1, 1, 1), BackgroundColor3 = Color3.fromRGB(10, 20, 70), Position = UDim2.fromScale(0.3, 0.14), Size = UDim2.fromScale(0.4, 0.07), ZIndex = 20 }, gui)
	esquinas(self.toast, 30); borde(self.toast, ORO1, 2)
	self.bocadilloF = nuevo("Frame", { Name = "Bocadillo", Visible = false, BackgroundColor3 = Color3.new(1, 1, 1), Position = UDim2.fromScale(0.2, 0.08), Size = UDim2.fromScale(0.34, 0.13), ZIndex = 19 }, gui)
	esquinas(self.bocadilloF, 16)
	self.bocQuien = nuevo("TextLabel", { BackgroundTransparency = 1, Font = Enum.Font.GothamBlack, TextColor3 = Color3.fromRGB(230, 140, 20), TextScaled = true, TextXAlignment = Enum.TextXAlignment.Left, Position = UDim2.fromScale(0.04, 0.05), Size = UDim2.fromScale(0.9, 0.22), ZIndex = 20 }, self.bocadilloF)
	self.bocTexto = nuevo("TextLabel", { BackgroundTransparency = 1, Font = Enum.Font.GothamBold, TextColor3 = Color3.fromRGB(20, 30, 60), TextScaled = true, TextWrapped = true, TextXAlignment = Enum.TextXAlignment.Left, Position = UDim2.fromScale(0.04, 0.3), Size = UDim2.fromScale(0.92, 0.65), ZIndex = 20 }, self.bocadilloF)
	return self
end

function UI:limpiar()
	for _, c in ipairs(self.col:GetChildren()) do if c:IsA("GuiObject") then c:Destroy() end end
	self.orden = 0
end

function UI:titulo(texto)
	self.orden = (self.orden or 0) + 1
	nuevo("TextLabel", { Text = texto, Font = Enum.Font.GothamBlack, TextScaled = true, TextColor3 = Color3.new(1, 1, 1), BackgroundTransparency = 1, Size = UDim2.new(1, 0, 0, 40), LayoutOrder = self.orden, ZIndex = 7 }, self.col)
end

function UI:icono(padre, oro)
	local t = self.tema.icono or "huellas"
	local f = nuevo("Frame", { Name = "Icono", BackgroundColor3 = Color3.fromRGB(26, 36, 80), Size = UDim2.new(0, 34, 0, 34), Position = UDim2.new(0, 12, 0.5, -17), ZIndex = 8 }, padre)
	if t == "huellas" then
		esquinas(f, 17); borde(f, Color3.fromRGB(243, 178, 26), 3)
		for _, x in ipairs({ 9, 18 }) do local h = nuevo("Frame", { BackgroundColor3 = Color3.fromRGB(255, 210, 58), Position = UDim2.new(0, x, 0, 9), Size = UDim2.new(0, 7, 0, 15), ZIndex = 9 }, f); esquinas(h, 4) end
	elseif t == "rombo" then
		f.Rotation = 45; f.BackgroundColor3 = oro and Color3.fromRGB(154, 208, 255) or Color3.fromRGB(242, 178, 28); esquinas(f, 4)
		local d = nuevo("Frame", { BackgroundColor3 = Color3.fromRGB(59, 20, 120), Position = UDim2.fromScale(0.22, 0.22), Size = UDim2.fromScale(0.56, 0.56), ZIndex = 9 }, f); esquinas(d, 2)
		nuevo("Frame", { BackgroundColor3 = Color3.fromRGB(255, 210, 58), Position = UDim2.fromScale(0.4, 0.4), Size = UDim2.fromScale(0.2, 0.2), ZIndex = 10 }, f)
	else -- hexágono (El Cazador)
		f.BackgroundColor3 = oro and Color3.fromRGB(255, 42, 106) or Color3.fromRGB(25, 184, 255); esquinas(f, 9)
		local d = nuevo("Frame", { BackgroundColor3 = Color3.fromRGB(6, 22, 122), Position = UDim2.fromScale(0.25, 0.25), Size = UDim2.fromScale(0.5, 0.5), ZIndex = 9 }, f); esquinas(d, 4)
	end
end

function UI:boton(texto, sub, oro, fn, padre)
	self.orden = (self.orden or 0) + 1
	local b = nuevo("TextButton", { Name = texto, Text = "", AutoButtonColor = true, BackgroundColor3 = Color3.new(1, 1, 1), Size = UDim2.new(1, 0, 0, (sub and sub ~= "") and 62 or 46), LayoutOrder = self.orden, ZIndex = 7 }, padre or self.col)
	esquinas(b, 40); degradado(b, oro and ORO1 or AZUL1, oro and ORO2 or AZUL2); borde(b, oro and BORDE_ORO or BORDE, 3)
	self:icono(b, oro)
	local c = oro and Color3.fromRGB(58, 26, 0) or Color3.new(1, 1, 1)
	nuevo("TextLabel", { BackgroundTransparency = 1, Text = texto, Font = Enum.Font.GothamBlack, TextScaled = true, TextColor3 = c, TextXAlignment = Enum.TextXAlignment.Left,
		Position = UDim2.new(0, 56, 0, 6), Size = UDim2.new(1, -66, 0, (sub and sub ~= "") and 24 or 34), ZIndex = 8 }, b)
	if sub and sub ~= "" then
		nuevo("TextLabel", { BackgroundTransparency = 1, Text = sub, Font = Enum.Font.GothamBold, TextScaled = true, TextWrapped = true, TextColor3 = oro and Color3.fromRGB(90, 48, 0) or Color3.fromRGB(207, 226, 255), TextXAlignment = Enum.TextXAlignment.Left,
			Position = UDim2.new(0, 56, 0, 31), Size = UDim2.new(1, -66, 0, 26), ZIndex = 8 }, b)
	end
	b.MouseButton1Click:Connect(function() if self.alPulsar then self.alPulsar() end fn() end)
	return b
end

-- menú: lista de {t, s, oro, fn}
function UI:menu(titulo, entradas)
	self.raiz.Visible = true; self:limpiar()
	if titulo then self:titulo(titulo) end
	for _, e in ipairs(entradas) do self:boton(e[1], e[2], e[3], e[4]) end
end

function UI:texto(titulo, cuerpo, volver)
	self.raiz.Visible = true; self:limpiar()
	self:boton("⟵ Volver", "", false, volver)
	self:titulo(titulo)
	self.orden += 1
	local t = nuevo("TextLabel", { Text = cuerpo, RichText = true, Font = Enum.Font.GothamBold, TextSize = 17, TextWrapped = true, TextColor3 = Color3.new(1, 1, 1), TextXAlignment = Enum.TextXAlignment.Left, TextYAlignment = Enum.TextYAlignment.Top,
		BackgroundColor3 = Color3.fromRGB(4, 10, 40), BackgroundTransparency = 0.25, Size = UDim2.new(1, 0, 0, 0), AutomaticSize = Enum.AutomaticSize.Y, LayoutOrder = self.orden, ZIndex = 7 }, self.col)
	esquinas(t, 14); nuevo("UIPadding", { PaddingTop = UDim.new(0, 10), PaddingBottom = UDim.new(0, 10), PaddingLeft = UDim.new(0, 12), PaddingRight = UDim.new(0, 12) }, t)
end

function UI:ocultar() self.raiz.Visible = false end

function UI:aviso(texto, seg)
	self.toast.Text = texto; self.toast.Visible = true
	local id = {}; self._av = id
	task.delay(seg or 2.5, function() if self._av == id then self.toast.Visible = false end end)
end

function UI:bocadillo(quien, texto)
	if not texto then self.bocadilloF.Visible = false return end
	self.bocQuien.Text = quien; self.bocTexto.Text = texto; self.bocadilloF.Visible = true
end

-- botón de juego (respuestas, comodines…)
function UI.botonJuego(padre, texto, pos, tam, c1, c2, fn, z)
	local b = nuevo("TextButton", { Text = texto, Font = Enum.Font.GothamBlack, TextScaled = true, TextColor3 = Color3.new(1, 1, 1), BackgroundColor3 = Color3.new(1, 1, 1), Position = pos, Size = tam, ZIndex = z or 12, AutoButtonColor = true }, padre)
	esquinas(b, 14); degradado(b, c1, c2); borde(b, Color3.fromRGB(200, 225, 255), 2)
	nuevo("UIPadding", { PaddingLeft = UDim.new(0, 10), PaddingRight = UDim.new(0, 10), PaddingTop = UDim.new(0, 4), PaddingBottom = UDim.new(0, 4) }, b)
	if fn then b.MouseButton1Click:Connect(fn) end
	return b
end

function UI.normaliza(s)
	s = string.lower(s or "")
	local rep = { ["á"] = "a", ["é"] = "e", ["í"] = "i", ["ó"] = "o", ["ú"] = "u", ["ü"] = "u", ["Á"] = "a", ["É"] = "e", ["Í"] = "i", ["Ó"] = "o", ["Ú"] = "u", ["Ñ"] = "ñ" }
	for k, v in pairs(rep) do s = string.gsub(s, k, v) end
	s = string.gsub(s, "[^%wñ]", "")
	return s
end

function UI.mezcla(t)
	local r = table.clone(t)
	for i = #r, 2, -1 do local j = math.random(i); r[i], r[j] = r[j], r[i] end
	return r
end

function UI.euros(n)
	local s = tostring(math.floor(n)); local r = s:reverse():gsub("(%d%d%d)", "%1."):reverse()
	if r:sub(1, 1) == "." then r = r:sub(2) end
	return r .. " €"
end

return UI
