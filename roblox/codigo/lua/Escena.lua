-- Escena: reproduce guiones como los de la app ({quien, texto, camara, gesto, efecto}) con los personajes
-- en el plató: cámara con TweenService, bocadillo + subtítulos, voz (módulo Voces) y efectos de sonido.
local TweenService = game:GetService("TweenService")
local SoundService = game:GetService("SoundService")
local RS = game:GetService("ReplicatedStorage")
local Voces = require(RS:WaitForChild("Voces"))
local E = {}
E.__index = E

-- FNV-1a sobre UTF-16, igual que la app (para encontrar la voz grabada de cada frase)
function E.fnv(t)
	local h = 2166136261
	local function mez(u) h = bit32.bxor(h, u); h = (h * 16777619) % 4294967296 end
	for _, cp in utf8.codes(t) do
		if cp < 0x10000 then mez(cp) else local c = cp - 0x10000; mez(0xD800 + bit32.rshift(c, 10)); mez(0xDC00 + bit32.band(c, 0x3FF)) end
	end
	return string.format("%08x", h)
end

-- cfg: { gui, personajes = {id=Personaje}, nombres = {id=nombre}, voces = {id=voz piper}, camara = function(clave) -> CFrame|nil, efecto = function(efecto), ui }
function E.nuevo(cfg)
	local self = setmetatable(cfg, E)
	local sub = Instance.new("TextLabel"); sub.Name = "Subtitulos"; sub.Visible = false; sub.BackgroundColor3 = Color3.new(0, 0, 0); sub.BackgroundTransparency = 0.35
	sub.Position = UDim2.fromScale(0.12, 0.86); sub.Size = UDim2.fromScale(0.76, 0.09); sub.TextColor3 = Color3.new(1, 1, 1); sub.Font = Enum.Font.GothamBold; sub.TextScaled = true; sub.TextWrapped = true; sub.RichText = true; sub.ZIndex = 30; sub.Parent = cfg.gui
	Instance.new("UICorner", sub).CornerRadius = UDim.new(0, 10)
	local pad = Instance.new("UIPadding", sub); pad.PaddingLeft = UDim.new(0, 14); pad.PaddingRight = UDim.new(0, 14); pad.PaddingTop = UDim.new(0, 4); pad.PaddingBottom = UDim.new(0, 4)
	local tit = Instance.new("TextLabel"); tit.Name = "TituloEscena"; tit.Visible = false; tit.BackgroundColor3 = Color3.fromRGB(10, 20, 70); tit.Position = UDim2.fromScale(0.3, 0.03); tit.Size = UDim2.fromScale(0.4, 0.07)
	tit.TextColor3 = Color3.fromRGB(255, 210, 58); tit.Font = Enum.Font.GothamBlack; tit.TextScaled = true; tit.ZIndex = 30; tit.Parent = cfg.gui
	Instance.new("UICorner", tit).CornerRadius = UDim.new(0, 30)
	local salta = Instance.new("TextButton"); salta.Name = "Saltar"; salta.Visible = false; salta.Text = "⏭ Saltar"; salta.Font = Enum.Font.GothamBlack; salta.TextScaled = true; salta.TextColor3 = Color3.new(1, 1, 1)
	salta.BackgroundColor3 = Color3.fromRGB(20, 40, 120); salta.Position = UDim2.new(1, -150, 1, -60); salta.Size = UDim2.new(0, 130, 0, 44); salta.ZIndex = 31; salta.Parent = cfg.gui
	Instance.new("UICorner", salta).CornerRadius = UDim.new(0, 20)
	salta.MouseButton1Click:Connect(function() self.saltar = true end)
	self.sub, self.tit, self.btnSaltar = sub, tit, salta
	self.cam = workspace.CurrentCamera
	return self
end

function E:camaraA(cf, seg)
	if not cf then return end
	local cam = self.cam; cam.CameraType = Enum.CameraType.Scriptable
	if not seg or seg <= 0 then cam.CFrame = cf return end
	TweenService:Create(cam, TweenInfo.new(seg, Enum.EasingStyle.Sine, Enum.EasingDirection.InOut), { CFrame = cf }):Play()
end
function E:camaraRecorrido(puntos, seg)
	-- puntos = { CFrame, CFrame, ... } repartidos en seg segundos
	local n = #puntos; if n == 0 then return end
	self:camaraA(puntos[1], 0)
	for i = 2, n do if self.saltar then return end; self:camaraA(puntos[i], seg / (n - 1)); task.wait(seg / (n - 1)) end
end
function E:liberarCamara() self.cam.CameraType = Enum.CameraType.Custom end

function E:sonido(n) local s = SoundService:FindFirstChild(n); if s and s:IsA("Sound") then s:Play() end end
-- devuelve la duración de la voz si hay audio subido, o nil
function E:voz(quien, texto)
	local v = (self.voces and self.voces[quien]) or "davefx"
	local clave = (v == "davefx" or v == "adrian") and E.fnv(texto) or E.fnv(v .. "|" .. texto)
	local id = Voces[clave]
	if not id or id == "" or id == "rbxassetid://0" then return nil end
	local s = Instance.new("Sound"); s.SoundId = id; s.Volume = self.volVoz or 1; s.Parent = SoundService; s:Play()
	local t0 = os.clock(); while not s.IsLoaded and os.clock() - t0 < 2 do task.wait() end
	local d = s.TimeLength > 0 and s.TimeLength or nil
	task.delay((d or 8) + 1, function() s:Destroy() end)
	return d
end

local function leer(t) local n = 0; for _ in string.gmatch(t, "%S+") do n += 1 end; return 0.9 + n * 0.33 end
-- una réplica
function E:linea(quien, texto, cam, gesto, efecto)
	if self.saltar then return end
	local per = self.personajes[quien]
	local nombre = (self.nombres and self.nombres[quien]) or (per and per.def.nombre) or quien
	if cam and cam ~= "" and self.camara then self:camaraA(self.camara(cam, quien), 0.9) end
	if per then if gesto and gesto ~= "" then per:gesto(gesto, 2.4) else per:gesto("habla", 2) end end
	if efecto and efecto ~= "" and self.efecto then self.efecto(efecto) end
	self.sub.Text = "<b>" .. nombre .. ":</b> " .. texto; self.sub.Visible = self.subtitulos ~= false
	local d = self:voz(quien, texto) or leer(texto)
	if per then per:decir(texto) end
	local t0 = os.clock(); while os.clock() - t0 < d and not self.saltar do task.wait(0.05) end
	if per then per:callar(); per:gesto("quieto") end
	self.sub.Visible = false
	task.wait(0.15)
end
-- guion completo; titulo opcional
function E:correr(pasos, titulo)
	self.saltar = false; self.btnSaltar.Visible = true
	if titulo then self.tit.Text = titulo; self.tit.Visible = true end
	for _, p in ipairs(pasos) do
		if self.saltar then break end
		self:linea(p[1], p[2], p[3], p[4], p[5])
	end
	self.tit.Visible = false; self.btnSaltar.Visible = false; self.sub.Visible = false
	for _, per in pairs(self.personajes) do per:callar() end
	local saltada = self.saltar; self.saltar = false
	return not saltada
end
-- rótulo grande a pantalla completa (promos, cortinillas, anuncios)
function E:rotulo(texto, seg, colores)
	local f = Instance.new("TextLabel"); f.BackgroundTransparency = 1; f.Size = UDim2.fromScale(0.9, 0.22); f.Position = UDim2.fromScale(0.05, 0.36); f.Text = texto
	f.Font = Enum.Font.FredokaOne; f.TextScaled = true; f.TextColor3 = (colores and colores[1]) or Color3.fromRGB(255, 226, 58); f.ZIndex = 29; f.TextTransparency = 1; f.Parent = self.gui
	local st = Instance.new("UIStroke", f); st.Color = (colores and colores[2]) or Color3.fromRGB(10, 20, 80); st.Thickness = 5; st.Transparency = 1
	local sc = Instance.new("UIScale", f); sc.Scale = 0.6
	TweenService:Create(f, TweenInfo.new(0.35), { TextTransparency = 0 }):Play(); TweenService:Create(st, TweenInfo.new(0.35), { Transparency = 0 }):Play()
	TweenService:Create(sc, TweenInfo.new(0.5, Enum.EasingStyle.Back), { Scale = 1 }):Play()
	local t0 = os.clock(); while os.clock() - t0 < (seg or 2) and not self.saltar do task.wait(0.05) end
	TweenService:Create(f, TweenInfo.new(0.3), { TextTransparency = 1 }):Play(); TweenService:Create(st, TweenInfo.new(0.3), { Transparency = 1 }):Play()
	task.delay(0.35, function() f:Destroy() end)
end
return E
