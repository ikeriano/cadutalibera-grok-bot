-- MenuApp: dibuja las pantallas del menú EXACTAMENTE como las capturó el rastreo de la app (mismos textos,
-- orden, estilos de botón, filas de opciones y textos). Cada botón final llama a acciones.ir(ctx).
local MenuApp = {}
MenuApp.__index = MenuApp
-- pantallas: { [ruta] = { items = {...} } } (ruta = títulos completos de los botones unidos con " › ")
function MenuApp.nuevo(ui, UI, pantallas, acciones)
	local self = setmetatable({ ui = ui, UI = UI, P = pantallas, A = acciones, ruta = {}, valores = {} }, MenuApp)
	return self
end
local function clave(r) return table.concat(r, " › ") end
function MenuApp:mostrar(ruta)
	ruta = ruta or {}; self.ruta = ruta
	local p = self.P[clave(ruta)]
	if not p then return false end
	local ui, UI = self.ui, self.UI
	ui.raiz.Visible = true; ui:limpiar()
	local items = p.items
	local i = 1
	while i <= #items do
		local it = items[i]
		if it.k == "button" and string.find(it.cls or "", "tbtn") == nil then
			local t = it.spans and it.spans[1] or it.t
			local sub = (it.spans and it.spans[2]) or ""
			if it.t:find("^⟵") or it.t:find("^←") or it.t:lower():find("^volver") then
				ui:boton(it.t, "", false, function() self:atras() end)
			else
				local oro = (it.cls or ""):find("gold") ~= nil
				ui:boton(t, sub, oro, function() self:pulsa(it, t, sub) end)
			end
			i += 1
		elseif it.k == "label" or (it.k == "txt" and items[i + 1] and items[i + 1].k == "button" and (items[i + 1].cls or ""):find("tbtn")) then
			-- fila de opciones: etiqueta + botones tbtn
			local fila = { etiqueta = it.t, botones = {} }
			i += 1
			while items[i] and items[i].k == "button" and (items[i].cls or ""):find("tbtn") do table.insert(fila.botones, items[i]); i += 1 end
			if #fila.botones == 0 and items[i] and (items[i].k == "input" or items[i].k == "select" or items[i].k == "textarea") then
				self:campo(it.t, items[i]); i += 1
			else self:fila(fila) end
		elseif it.k == "button" then
			-- tbtn sueltos (p. ej. lista de especiales): fila sin etiqueta
			local fila = { etiqueta = "", botones = {} }
			while items[i] and items[i].k == "button" and (items[i].cls or ""):find("tbtn") do table.insert(fila.botones, items[i]); i += 1 end
			self:fila(fila)
		elseif it.k == "input" or it.k == "select" or it.k == "textarea" then self:campo(it.t, it); i += 1
		elseif it.k == "txt" then self:texto(it); i += 1
		else i += 1 end
	end
	if self.A.alMostrar then self.A.alMostrar(ruta, self) end
	return true
end
function MenuApp:atras()
	local r = table.clone(self.ruta); table.remove(r)
	while #r > 0 and not self.P[clave(r)] do table.remove(r) end
	self:mostrar(r)
end
function MenuApp:pulsa(it, t, sub)
	local r = table.clone(self.ruta); table.insert(r, it.t)
	local p = self.P[clave(r)]
	if p and not p.toggle then return self:mostrar(r) end
	self.A.ir({ ruta = r, titulo = t, sub = sub, pantalla = self.ruta[#self.ruta] }, self)
end
function MenuApp:texto(it)
	local ui, UI = self.ui, self.UI
	ui.orden += 1
	local grande = (it.tag == "H1" or it.tag == "H2" or it.tag == "H3") or (tonumber((it.size or ""):match("[%d.]+")) or 14) >= 20
	local t = UI.nuevo("TextLabel", { Text = it.t, RichText = false, Font = grande and Enum.Font.GothamBlack or Enum.Font.GothamBold, TextSize = grande and 24 or 16, TextWrapped = true,
		TextColor3 = Color3.new(1, 1, 1), TextXAlignment = grande and Enum.TextXAlignment.Center or Enum.TextXAlignment.Left, TextYAlignment = Enum.TextYAlignment.Top,
		BackgroundColor3 = Color3.fromRGB(4, 10, 40), BackgroundTransparency = grande and 1 or 0.25, Size = UDim2.new(1, 0, 0, 0), AutomaticSize = Enum.AutomaticSize.Y, LayoutOrder = ui.orden, ZIndex = 7 }, ui.col)
	if not grande then UI.esquinas(t, 14); UI.nuevo("UIPadding", { PaddingTop = UDim.new(0, 8), PaddingBottom = UDim.new(0, 8), PaddingLeft = UDim.new(0, 12), PaddingRight = UDim.new(0, 12) }, t) end
end
function MenuApp:fila(fila)
	local ui, UI = self.ui, self.UI
	ui.orden += 1
	local f = UI.nuevo("Frame", { Name = "Fila", BackgroundColor3 = Color3.fromRGB(8, 16, 56), BackgroundTransparency = 0.2, Size = UDim2.new(1, 0, 0, 0), AutomaticSize = Enum.AutomaticSize.Y, LayoutOrder = ui.orden, ZIndex = 7 }, ui.col)
	UI.esquinas(f, 14)
	UI.nuevo("UIPadding", { PaddingTop = UDim.new(0, 6), PaddingBottom = UDim.new(0, 6), PaddingLeft = UDim.new(0, 10), PaddingRight = UDim.new(0, 10) }, f)
	UI.nuevo("UIGridLayout", { CellSize = UDim2.new(0, 132, 0, 34), CellPadding = UDim2.new(0, 6, 0, 6), SortOrder = Enum.SortOrder.LayoutOrder }, f)
	if fila.etiqueta ~= "" then
		local l = UI.nuevo("TextLabel", { Text = fila.etiqueta, Font = Enum.Font.GothamBold, TextScaled = true, TextWrapped = true, TextColor3 = Color3.fromRGB(207, 226, 255), BackgroundTransparency = 1, TextXAlignment = Enum.TextXAlignment.Left, LayoutOrder = 0, ZIndex = 8 }, f)
		UI.nuevo("UITextSizeConstraint", { MaxTextSize = 15 }, l)
	end
	local botones = {}
	local sel = self.valores[fila.etiqueta]
	for k, b in ipairs(fila.botones) do
		local activo = (sel and sel == b.t) or (not sel and b.sel)
		local bt = UI.nuevo("TextButton", { Text = b.t, Font = Enum.Font.GothamBold, TextScaled = true, TextColor3 = activo and Color3.fromRGB(58, 26, 0) or Color3.new(1, 1, 1), BackgroundColor3 = activo and Color3.fromRGB(255, 210, 58) or Color3.fromRGB(30, 60, 170), LayoutOrder = k, ZIndex = 8 }, f)
		UI.esquinas(bt, 10); UI.nuevo("UITextSizeConstraint", { MaxTextSize = 14 }, bt)
		botones[k] = bt
		bt.MouseButton1Click:Connect(function()
			self.valores[fila.etiqueta] = b.t
			for _, o in ipairs(botones) do o.BackgroundColor3 = Color3.fromRGB(30, 60, 170); o.TextColor3 = Color3.new(1, 1, 1) end
			bt.BackgroundColor3 = Color3.fromRGB(255, 210, 58); bt.TextColor3 = Color3.fromRGB(58, 26, 0)
			if self.ui.alPulsar then self.ui.alPulsar() end
			if self.A.opcion then self.A.opcion(fila.etiqueta, b.t, self) end
		end)
	end
end
function MenuApp:campo(etiqueta, it)
	local ui, UI = self.ui, self.UI
	ui.orden += 1
	local f = UI.nuevo("Frame", { BackgroundTransparency = 1, Size = UDim2.new(1, 0, 0, 40), LayoutOrder = ui.orden, ZIndex = 7 }, ui.col)
	UI.nuevo("TextLabel", { Text = etiqueta or "", Font = Enum.Font.GothamBold, TextScaled = true, TextColor3 = Color3.fromRGB(207, 226, 255), BackgroundTransparency = 1, Size = UDim2.fromScale(0.38, 1), TextXAlignment = Enum.TextXAlignment.Left, ZIndex = 8 }, f)
	if it.k == "select" and it.opts then
		local idx = 1
		local b = UI.nuevo("TextButton", { Text = it.opts[1] or "", Font = Enum.Font.GothamBold, TextScaled = true, TextColor3 = Color3.new(1, 1, 1), BackgroundColor3 = Color3.fromRGB(30, 60, 170), Position = UDim2.fromScale(0.4, 0), Size = UDim2.fromScale(0.6, 1), ZIndex = 8 }, f)
		UI.esquinas(b, 10)
		b.MouseButton1Click:Connect(function() idx = idx % #it.opts + 1; b.Text = it.opts[idx]; self.valores[etiqueta] = b.Text; if self.A.opcion then self.A.opcion(etiqueta, b.Text, self) end end)
	elseif (it.tipo or "") == "file" then
		UI.nuevo("TextLabel", { Text = "En Roblox: pega el ID en el módulo Imagenes (Video…)", Font = Enum.Font.Gotham, TextScaled = true, TextColor3 = Color3.fromRGB(255, 210, 58), BackgroundTransparency = 1, Position = UDim2.fromScale(0.4, 0), Size = UDim2.fromScale(0.6, 1), ZIndex = 8 }, f)
	else
		local tb = UI.nuevo("TextBox", { Text = self.valores[etiqueta] or "", PlaceholderText = it.t or "", ClearTextOnFocus = false, Font = Enum.Font.GothamBold, TextScaled = true, TextColor3 = Color3.fromRGB(10, 20, 60), BackgroundColor3 = Color3.new(1, 1, 1), Position = UDim2.fromScale(0.4, 0), Size = UDim2.fromScale(0.6, 1), ZIndex = 8 }, f)
		UI.esquinas(tb, 10)
		tb.FocusLost:Connect(function() self.valores[etiqueta] = tb.Text; if self.A.opcion then self.A.opcion(etiqueta, tb.Text, self) end end)
	end
end
return MenuApp
