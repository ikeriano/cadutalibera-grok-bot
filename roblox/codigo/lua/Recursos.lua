-- Recursos: aplica los IDs de ReplicatedStorage.Imagenes y ReplicatedStorage.Sonidos a todo el lugar.
-- Las imágenes se aplican a cada Decal / ImageLabel cuyo nombre coincida con un campo de «Imagenes».
-- Los sonidos se aplican a cada Sound de SoundService cuyo nombre coincida con un campo de «Sonidos».
local RS = game:GetService("ReplicatedStorage")
local Imagenes = require(RS:WaitForChild("Imagenes"))
local Sonidos = require(RS:WaitForChild("Sonidos"))
local SoundService = game:GetService("SoundService")

local function valido(id) return type(id) == "string" and id ~= "" and id ~= "rbxassetid://0" end

local function aplica(o)
	if o:IsA("Decal") and valido(Imagenes[o.Name]) then o.Texture = Imagenes[o.Name]
	elseif o:IsA("ImageLabel") and valido(Imagenes[o.Name]) then o.Image = Imagenes[o.Name] end
end
for _, o in ipairs(workspace:GetDescendants()) do aplica(o) end
workspace.DescendantAdded:Connect(aplica)
for nombre, id in pairs(Sonidos) do
	local s = SoundService:FindFirstChild(nombre)
	if s and s:IsA("Sound") and valido(id) then s.SoundId = id end
end
