-- Personajes: figuras articuladas estilo R15 (Humanoid + 15 piezas con nombres R15) animadas por código
-- (andar, saludar, señalar, aplaudir, encogerse, lamentarse, brazos arriba, hablar) y con bocadillo propio.
-- Se crean en el cliente (juego de un jugador), en workspace.Personajes.
local RunService = game:GetService("RunService")
local P = {}
P.__index = P
local carpeta = workspace:FindFirstChild("Personajes") or Instance.new("Folder")
carpeta.Name = "Personajes"; carpeta.Parent = workspace
local vivos = {}

local function pieza(m, nombre, tam, color, mat)
	local p = Instance.new("Part"); p.Name = nombre; p.Size = tam; p.Color = color; p.Anchored = true; p.CanCollide = false; p.CanQuery = false; p.CastShadow = true
	p.Material = mat or Enum.Material.SmoothPlastic; p.TopSurface = Enum.SurfaceType.Smooth; p.BottomSurface = Enum.SurfaceType.Smooth; p.Parent = m
	return p
end
local function rgb(n) if typeof(n) == "Color3" then return n end; n = n or 0xffffff; return Color3.fromRGB(bit32.rshift(n, 16) % 256, bit32.rshift(n, 8) % 256, n % 256) end

-- def = { id, nombre, piel, traje, camisa, corbata, pantalon, pelo, zapatos, falda, escala, pos (Vector3), yaw }
function P.nuevo(def)
	local self = setmetatable({}, P)
	local m = Instance.new("Model"); m.Name = def.id or def.nombre or "Personaje"
	local s = def.escala or 1; self.s = s
	local piel, traje, camisa, pant = rgb(def.piel or 0xe8b896), rgb(def.traje or 0x1b2b5c), rgb(def.camisa or 0xffffff), rgb(def.pantalon or def.traje or 0x1b2b5c)
	local V = function(x, y, z) return Vector3.new(x, y, z) * s end
	self.p = {
		HumanoidRootPart = pieza(m, "HumanoidRootPart", V(2, 2, 1), Color3.new(1, 1, 1)),
		LowerTorso = pieza(m, "LowerTorso", V(1.9, 0.5, 1), pant), UpperTorso = pieza(m, "UpperTorso", V(2, 1.6, 1.05), traje),
		Camisa = pieza(m, "Camisa", V(0.7, 1.1, 0.1), camisa), Corbata = pieza(m, "Corbata", V(0.22, 0.95, 0.06), rgb(def.corbata or 0xf3a012)),
		Head = pieza(m, "Head", V(1.15, 1.25, 1.15), piel), Pelo = pieza(m, "Pelo", V(1.25, 0.45, 1.25), rgb(def.pelo or 0x2a1a10)),
		OjoI = pieza(m, "OjoIzquierdo", V(0.16, 0.2, 0.05), Color3.fromRGB(20, 20, 30)), OjoD = pieza(m, "OjoDerecho", V(0.16, 0.2, 0.05), Color3.fromRGB(20, 20, 30)),
		Boca = pieza(m, "Boca", V(0.42, 0.08, 0.05), Color3.fromRGB(150, 50, 50)),
		LeftUpperArm = pieza(m, "LeftUpperArm", V(0.75, 1.1, 0.75), traje), LeftLowerArm = pieza(m, "LeftLowerArm", V(0.68, 1.0, 0.68), traje), LeftHand = pieza(m, "LeftHand", V(0.55, 0.45, 0.55), piel),
		RightUpperArm = pieza(m, "RightUpperArm", V(0.75, 1.1, 0.75), traje), RightLowerArm = pieza(m, "RightLowerArm", V(0.68, 1.0, 0.68), traje), RightHand = pieza(m, "RightHand", V(0.55, 0.45, 0.55), piel),
		LeftUpperLeg = pieza(m, "LeftUpperLeg", V(0.9, 1.05, 0.9), pant), LeftLowerLeg = pieza(m, "LeftLowerLeg", V(0.85, 0.95, 0.85), pant), LeftFoot = pieza(m, "LeftFoot", V(0.9, 0.3, 1.2), rgb(def.zapatos or 0x111111)),
		RightUpperLeg = pieza(m, "RightUpperLeg", V(0.9, 1.05, 0.9), pant), RightLowerLeg = pieza(m, "RightLowerLeg", V(0.85, 0.95, 0.85), pant), RightFoot = pieza(m, "RightFoot", V(0.9, 0.3, 1.2), rgb(def.zapatos or 0x111111)),
	}
	self.p.HumanoidRootPart.Transparency = 1
	if not def.corbata then self.p.Corbata.Transparency = 1 end
	local hum = Instance.new("Humanoid"); hum.DisplayName = def.nombre or ""; hum.DisplayDistanceType = Enum.HumanoidDisplayDistanceType.None
	hum.RigType = Enum.HumanoidRigType.R15; hum.Parent = m
	m.PrimaryPart = self.p.HumanoidRootPart
	-- bocadillo propio (BillboardGui)
	local bb = Instance.new("BillboardGui"); bb.Name = "Bocadillo"; bb.Size = UDim2.new(0, 330, 0, 96); bb.StudsOffset = Vector3.new(0, 2.2 * s, 0); bb.AlwaysOnTop = true; bb.Enabled = false; bb.MaxDistance = 400; bb.Adornee = self.p.Head; bb.Parent = m
	local f = Instance.new("Frame"); f.Size = UDim2.fromScale(1, 1); f.BackgroundColor3 = Color3.new(1, 1, 1); f.Parent = bb
	Instance.new("UICorner", f).CornerRadius = UDim.new(0, 16)
	local quien = Instance.new("TextLabel"); quien.BackgroundTransparency = 1; quien.Size = UDim2.new(1, -16, 0, 22); quien.Position = UDim2.new(0, 8, 0, 4); quien.Font = Enum.Font.GothamBlack; quien.TextScaled = true; quien.TextXAlignment = Enum.TextXAlignment.Left; quien.TextColor3 = Color3.fromRGB(230, 140, 20); quien.Text = def.nombre or ""; quien.Parent = f
	local txt = Instance.new("TextLabel"); txt.Name = "Texto"; txt.BackgroundTransparency = 1; txt.Size = UDim2.new(1, -16, 1, -30); txt.Position = UDim2.new(0, 8, 0, 26); txt.Font = Enum.Font.GothamBold; txt.TextScaled = true; txt.TextWrapped = true; txt.TextXAlignment = Enum.TextXAlignment.Left; txt.TextColor3 = Color3.fromRGB(20, 30, 60); txt.Parent = f
	self.bb, self.bbTexto = bb, txt
	-- nombre flotante pequeño
	local nb = Instance.new("BillboardGui"); nb.Name = "Nombre"; nb.Size = UDim2.new(0, 160, 0, 22); nb.StudsOffset = Vector3.new(0, 1.2 * s, 0); nb.Adornee = self.p.Head; nb.MaxDistance = 60; nb.Parent = m
	local nl = Instance.new("TextLabel"); nl.Size = UDim2.fromScale(1, 1); nl.BackgroundTransparency = 1; nl.Text = def.nombre or ""; nl.Font = Enum.Font.GothamBold; nl.TextScaled = true; nl.TextColor3 = Color3.new(1, 1, 1); nl.TextStrokeTransparency = 0.3; nl.Parent = nb
	self.nombreGui = nb
	self.modelo, self.def = m, def
	self.pos = def.pos or Vector3.new(0, 0, 0); self.yaw = def.yaw or 0
	self.anim, self.t0, self.habla, self.andando = "quieto", os.clock(), false, false
	m.Parent = carpeta
	table.insert(vivos, self)
	self:_pose(0)
	return self
end

local CF, A = CFrame.new, CFrame.Angles
function P:_pose(t)
	local s, p = self.s, self.p
	local raiz = CF(self.pos) * A(0, self.yaw, 0)
	local sh = { l = { x = 0, z = 0.08, e = -0.1 }, r = { x = 0, z = -0.08, e = -0.1 } }
	local hip = { l = 0, r = 0, kl = 0, kr = 0 }
	local cabeza, bote, inclina = 0, 0, 0
	local a, dt = self.anim, t - self.t0
	if self.andando then
		local w = t * 9
		hip.l, hip.r = math.sin(w) * 0.6, -math.sin(w) * 0.6; hip.kl, hip.kr = math.max(0, -math.sin(w)) * 0.9, math.max(0, math.sin(w)) * 0.9
		sh.l.x, sh.r.x = -math.sin(w) * 0.5, math.sin(w) * 0.5; bote = math.abs(math.cos(w)) * 0.12
	end
	if a == "saluda" then sh.r.z = -2.5 + math.sin(dt * 10) * 0.35; sh.r.e = -0.6
	elseif a == "senala" then sh.r.x = -1.45; sh.r.z = -0.15; sh.r.e = 0
	elseif a == "aplaude" then local c = math.abs(math.sin(dt * 12)); sh.l.x, sh.r.x = -1.1, -1.1; sh.l.z, sh.r.z = -0.35 - c * 0.25, 0.35 + c * 0.25; sh.l.e, sh.r.e = -0.9, -0.9
	elseif a == "encoge" then sh.l.z, sh.r.z = 0.7, -0.7; sh.l.e, sh.r.e = -1.4, -1.4; sh.l.x, sh.r.x = -0.3, -0.3; cabeza = 0.15
	elseif a == "lamenta" then sh.l.x, sh.r.x = -2.6, -2.6; sh.l.z, sh.r.z = -0.5, 0.5; sh.l.e, sh.r.e = -1.9, -1.9; inclina = 0.25
	elseif a == "arriba" then sh.l.z, sh.r.z = 2.7 + math.sin(dt * 8) * 0.15, -2.7 - math.sin(dt * 8) * 0.15; sh.l.e, sh.r.e = -0.2, -0.2; bote = math.abs(math.sin(dt * 6)) * 0.4
	elseif a == "habla" or self.habla then sh.r.x = -0.6 + math.sin(dt * 3.1) * 0.25; sh.r.e = -1.0 + math.sin(dt * 4.3) * 0.3; sh.l.x = -0.3 + math.sin(dt * 2.3 + 1) * 0.15; sh.l.e = -0.7
	end
	if self.habla then cabeza = cabeza + math.sin(t * 7) * 0.06 end
	local resp = math.sin(t * 2) * 0.02
	local cad = raiz * CF(0, (2.05 + bote) * s, 0) * A(inclina, 0, 0)
	local partes, cfs = {}, {}
	local function pon(n, cf) table.insert(partes, p[n]); table.insert(cfs, cf) end
	pon("HumanoidRootPart", raiz * CF(0, 2.6 * s, 0)); pon("LowerTorso", cad * CF(0, 0.2 * s, 0))
	local torso = cad * CF(0, (1.25 + resp) * s, 0); pon("UpperTorso", torso)
	pon("Camisa", torso * CF(0, 0.2 * s, -0.53 * s)); pon("Corbata", torso * CF(0, 0.12 * s, -0.57 * s))
	local cuello = torso * CF(0, 0.8 * s, 0) * A(cabeza, 0, 0); local head = cuello * CF(0, 0.66 * s, 0)
	pon("Head", head); pon("Pelo", head * CF(0, 0.55 * s, 0.05 * s)); pon("OjoI", head * CF(-0.24 * s, 0.12 * s, -0.58 * s)); pon("OjoD", head * CF(0.24 * s, 0.12 * s, -0.58 * s))
	local boca = self.habla and (0.06 + math.abs(math.sin(t * 14)) * 0.14) or 0.08
	p.Boca.Size = Vector3.new(0.42, boca, 0.05) * s; pon("Boca", head * CF(0, -0.27 * s, -0.58 * s))
	for _, lado in ipairs({ "l", "r" }) do
		local sx = lado == "l" and -1 or 1; local L = lado == "l" and "Left" or "Right"; local q = sh[lado]
		local hombro = torso * CF(sx * 1.38 * s, 0.6 * s, 0) * A(q.x, 0, q.z)
		pon(L .. "UpperArm", hombro * CF(0, -0.5 * s, 0))
		local codo = hombro * CF(0, -1.05 * s, 0) * A(q.e, 0, 0)
		pon(L .. "LowerArm", codo * CF(0, -0.48 * s, 0)); pon(L .. "Hand", codo * CF(0, -1.12 * s, 0))
		local cadera = cad * CF(sx * 0.48 * s, 0, 0) * A(lado == "l" and hip.l or hip.r, 0, 0)
		pon(L .. "UpperLeg", cadera * CF(0, -0.5 * s, 0))
		local rodilla = cadera * CF(0, -1.02 * s, 0) * A(lado == "l" and hip.kl or hip.kr, 0, 0)
		pon(L .. "LowerLeg", rodilla * CF(0, -0.45 * s, 0)); pon(L .. "Foot", rodilla * CF(0, -0.92 * s, -0.15 * s))
	end
	workspace:BulkMoveTo(partes, cfs, Enum.BulkMoveMode.FireCFrameChanged)
end

function P:gesto(nombre, dur)
	self.anim, self.t0 = nombre or "quieto", os.clock()
	local yo = {}; self._g = yo
	if dur then task.delay(dur, function() if self._g == yo then self.anim = "quieto" end end) end
end
function P:mirarA(pos) local d = pos - self.pos; if d.Magnitude > 0.01 then self.yaw = math.atan2(-d.X, -d.Z) end end
function P:ponerEn(pos, mira) self.pos = pos; if mira then self:mirarA(mira) end end
-- anda hasta pos (espera hasta llegar). vel en studs/s
function P:andarA(pos, vel)
	vel = vel or 8; local ini = self.pos; local d = (pos - ini); local dist = Vector3.new(d.X, 0, d.Z).Magnitude
	if dist < 0.05 then self.pos = pos return end
	self:mirarA(pos); self.andando = true
	local t0, T = os.clock(), dist / vel
	while true do local k = math.min(1, (os.clock() - t0) / T); self.pos = ini:Lerp(pos, k); if k >= 1 then break end; RunService.Heartbeat:Wait() end
	self.andando = false
end
function P:decir(texto, seg)
	self.bbTexto.Text = texto; self.bb.Enabled = true; self.habla = true
	local yo = {}; self._d = yo
	if seg then task.delay(seg, function() if self._d == yo then self:callar() end end) end
end
function P:callar() self.bb.Enabled = false; self.habla = false end
function P:visible(si)
	for _, x in pairs(self.p) do if x.Name ~= "HumanoidRootPart" and not (x.Name == "Corbata" and not self.def.corbata) then x.LocalTransparencyModifier = si and 0 or 1 end end
	self.nombreGui.Enabled = si; if not si then self:callar() end
end
function P:destruir() for i, o in ipairs(vivos) do if o == self then table.remove(vivos, i) break end end; self.modelo:Destroy() end
function P.todos() return vivos end
function P.limpiar() for i = #vivos, 1, -1 do vivos[i].modelo:Destroy(); vivos[i] = nil end end

RunService.RenderStepped:Connect(function()
	local t = os.clock()
	for _, o in ipairs(vivos) do if o.modelo.Parent then o:_pose(t) end end
end)
return P
