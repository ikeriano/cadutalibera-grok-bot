local L0_1

function L0_1(...)
  local L0_2, L1_2
  L0_2 = application
  if L0_2 then
    L0_2 = type
    L1_2 = application
    L0_2 = L0_2(L1_2)
    if L0_2 == "table" then
      goto lbl_11
    end
  end
  L0_2 = {}
  application = L0_2
  ::lbl_11::
  L0_2 = application
  L1_2 = {}
  L1_2.appName = "Caduta Libera"
  L1_2.appVersion = "1.0"
  L1_2.appPackageId = "it.mediaset.cadutalibera.android"
  L1_2.appId = "00000000"
  L1_2.appKey = "00000000"
  L1_2.userId = "478277"
  L1_2.subscription = "pro"
  L1_2.mode = "distribution"
  L0_2.metadata = L1_2
end

L0_1()

function L0_1(...)
  local L0_2, L1_2, L2_2, L3_2, L4_2, L5_2
  
  function L0_2(A0_3, A1_3)
    local L2_3
    
    function L2_3(A0_4)
      local L1_4, L2_4, L3_4
      L1_4 = A0_4.action
      if "clicked" == L1_4 then
        L1_4 = A0_4.index
        if 1 == L1_4 then
        else
          L2_4 = system
          L2_4 = L2_4.openURL
          L3_4 = A0_3
          L2_4(L3_4)
        end
      end
      L1_4 = A1_3
      if L1_4 then
        L1_4 = os
        L1_4 = L1_4.exit
        L2_4 = -1
        L1_4(L2_4)
      end
    end
    
    return L2_3
  end
  
  function L1_2(A0_3)
    local L1_3, L2_3, L3_3, L4_3, L5_3, L6_3, L7_3, L8_3, L9_3, L10_3, L11_3, L12_3, L13_3, L14_3
    L1_3 = A0_3.feature
    if not L1_3 then
      L1_3 = ""
    end
    L2_3 = A0_3.type
    if not L2_3 then
      L2_3 = ""
    end
    L3_3 = A0_3.tier
    if not L3_3 then
      L3_3 = "Pro (or higher)"
    end
    L4_3 = "Corona SDK Error"
    L5_3 = "The premium %s feature (%s) is restricted to %s subscribers. You must upgrade your subscription to run this project."
    L6_3 = string
    L6_3 = L6_3.format
    L7_3 = L5_3
    L8_3 = L2_3
    L9_3 = L1_3
    L10_3 = L3_3
    L6_3 = L6_3(L7_3, L8_3, L9_3, L10_3)
    L7_3 = {}
    L8_3 = "Quit"
    L9_3 = "Upgrade"
    L7_3[1] = L8_3
    L7_3[2] = L9_3
    L8_3 = "https://coronalabs.com/upgrade/?utm_source=corona-sdk&utm_medium=corona-sdk&utm_campaign=feature-error&api="
    L9_3 = L1_3
    L8_3 = L8_3 .. L9_3
    L9_3 = L0_2
    L10_3 = L8_3
    L11_3 = true
    L9_3 = L9_3(L10_3, L11_3)
    L10_3 = native
    L10_3 = L10_3.showAlert
    L11_3 = L4_3
    L12_3 = L6_3
    L13_3 = L7_3
    L14_3 = L9_3
    L10_3(L11_3, L12_3, L13_3, L14_3)
  end
  
  function L2_2(A0_3)
    local L1_3, L2_3, L3_3, L4_3, L5_3, L6_3, L7_3, L8_3, L9_3, L10_3, L11_3, L12_3, L13_3, L14_3
    L1_3 = A0_3.feature
    if not L1_3 then
      L1_3 = ""
    end
    L2_3 = A0_3.type
    if not L2_3 then
      L2_3 = ""
    end
    L3_3 = A0_3.tier
    if not L3_3 then
      L3_3 = "Pro (or higher)"
    end
    L4_3 = "Corona SDK Warning"
    L5_3 = "Your project uses a premium %s feature (%s) available only to %s subscribers. You can view this in the Simulator as a demo, but you must upgrade to use it on a device."
    L6_3 = string
    L6_3 = L6_3.format
    L7_3 = L5_3
    L8_3 = L2_3
    L9_3 = L1_3
    L10_3 = L3_3
    L6_3 = L6_3(L7_3, L8_3, L9_3, L10_3)
    L7_3 = {}
    L8_3 = "Continue with Demo"
    L9_3 = "Upgrade"
    L7_3[1] = L8_3
    L7_3[2] = L9_3
    L8_3 = "https://coronalabs.com/upgrade/?utm_source=corona-sdk&utm_medium=corona-sdk&utm_campaign=feature-warning&api="
    L9_3 = L1_3
    L8_3 = L8_3 .. L9_3
    L9_3 = L0_2
    L10_3 = L8_3
    L9_3 = L9_3(L10_3)
    L10_3 = native
    L10_3 = L10_3.showAlert
    L11_3 = L4_3
    L12_3 = L6_3
    L13_3 = L7_3
    L14_3 = L9_3
    L10_3(L11_3, L12_3, L13_3, L14_3)
  end
  
  L3_2 = L1_2
  L4_2 = system
  L4_2 = L4_2.getInfo
  L5_2 = "environment"
  L4_2 = L4_2(L5_2)
  if "simulator" == L4_2 then
    L3_2 = L2_2
  end
  
  function L4_2()
    local L0_3, L1_3, L2_3, L3_3, L4_3, L5_3, L6_3, L7_3, L8_3, L9_3, L10_3
    L0_3 = true
    L1_3 = true
    L2_3 = true
    L3_3 = true
    L4_3 = application
    if L4_3 then
      L4_3 = application
      L4_3 = L4_3.metadata
      if L4_3 then
        L4_3 = application
        L4_3 = L4_3.metadata
        L4_3 = L4_3.subscription
        if L4_3 and "trial" ~= L4_3 then
          L0_3 = false
        end
        if L4_3 and "basic" ~= L4_3 then
          L1_3 = false
        end
        if L4_3 and "pro" ~= L4_3 then
          L2_3 = false
        end
        L5_3 = application
        L5_3 = L5_3.metadata
        L5_3 = L5_3.mode
        if L5_3 and "distribution" ~= L5_3 then
          L3_3 = false
        end
      end
    end
    L4_3 = initializeMetadata
    if L4_3 then
      L4_3 = nil
      L5_3 = application
      if L5_3 then
        L5_3 = application
        L4_3 = L5_3.metadata
      else
        L5_3 = {}
        L4_3 = L5_3
      end
      L5_3 = L4_3.permissions
      if not L5_3 then
        L6_3 = {}
        L5_3 = L6_3
        L4_3.permissions = L5_3
      end
      L6_3 = not L0_3 and L6_3
      L5_3.advancedGraphics = L6_3
      L6_3 = not L0_3 and not L1_3 and L6_3
      L5_3.customFragment = L6_3
      L6_3 = not L0_3 and not L1_3 and L6_3
      L5_3.customVertex = L6_3
      L6_3 = initializeMetadata
      L7_3 = L4_3
      L6_3(L7_3)
      L6_3 = nil
      initializeMetadata = L6_3
      L6_3 = Runtime
      L7_3 = L6_3
      L6_3 = L6_3.addEventListener
      L8_3 = "featureRestriction"
      L9_3 = L3_2
      L6_3(L7_3, L8_3, L9_3)
    end
    L4_3 = require
    L5_3 = {}
    L5_3.store = true
    
    function L6_3(A0_4)
      local L1_4, L2_4, L3_4, L4_4, L5_4, L6_4, L7_4, L8_4, L9_4, L10_4
      L1_4 = "Corona SDK Warning"
      L2_4 = "You will not be able to publish this app to the store because it uses a restricted library (%s). Please upgrade to unlock it."
      L3_4 = string
      L3_4 = L3_4.format
      L4_4 = L2_4
      L5_4 = A0_4
      L3_4 = L3_4(L4_4, L5_4)
      L4_4 = {}
      L5_4 = "OK"
      L6_4 = "Upgrade"
      L4_4[1] = L5_4
      L4_4[2] = L6_4
      
      function L5_4(A0_5)
        local L1_5, L2_5, L3_5, L4_5
        L1_5 = A0_5.action
        if "clicked" == L1_5 then
          L1_5 = A0_5.index
          if 1 == L1_5 then
          else
            L2_5 = system
            L2_5 = L2_5.openURL
            L3_5 = "https://coronalabs.com/upgrade/?utm_source=corona-sdk&utm_medium=corona-sdk&utm_campaign=trial-warning&mod="
            L4_5 = A0_4
            L3_5 = L3_5 .. L4_5
            L2_5(L3_5)
          end
        end
      end
      
      L6_4 = native
      L6_4 = L6_4.showAlert
      L7_4 = L1_4
      L8_4 = L3_4
      L9_4 = L4_4
      L10_4 = L5_4
      L6_4(L7_4, L8_4, L9_4, L10_4)
    end
    
    function L7_3(A0_4)
      local L1_4, L2_4, L3_4, L4_4, L5_4, L6_4, L7_4, L8_4, L9_4, L10_4
      L1_4 = "Corona SDK Error"
      L2_4 = "You cannot put this app on the store because it uses a restricted library (%s). Please upgrade to unlock it."
      L3_4 = string
      L3_4 = L3_4.format
      L4_4 = L2_4
      L5_4 = A0_4
      L3_4 = L3_4(L4_4, L5_4)
      L4_4 = {}
      L5_4 = "Quit"
      L6_4 = "Upgrade"
      L4_4[1] = L5_4
      L4_4[2] = L6_4
      
      function L5_4(A0_5)
        local L1_5, L2_5, L3_5, L4_5
        L1_5 = A0_5.action
        if "clicked" == L1_5 then
          L1_5 = A0_5.index
          if 1 == L1_5 then
          else
            L2_5 = system
            L2_5 = L2_5.openURL
            L3_5 = "https://coronalabs.com/upgrade/?utm_source=corona-sdk&utm_medium=corona-sdk&utm_campaign=trial-error&mod="
            L4_5 = A0_4
            L3_5 = L3_5 .. L4_5
            L2_5(L3_5)
          end
        end
        L1_5 = os
        L1_5 = L1_5.exit
        L2_5 = -1
        L1_5(L2_5)
      end
      
      L6_4 = native
      L6_4 = L6_4.showAlert
      L7_4 = L1_4
      L8_4 = L3_4
      L9_4 = L4_4
      L10_4 = L5_4
      L6_4(L7_4, L8_4, L9_4, L10_4)
    end
    
    function L8_3(A0_4)
      local L1_4, L2_4, L3_4
      L1_4 = true
      L2_4 = L0_3
      if L2_4 then
        L2_4 = L5_3
        L2_4 = L2_4[A0_4]
        if L2_4 then
          L2_4 = L3_3
          if L2_4 then
            L1_4 = false
          else
            L2_4 = L6_3
            L3_4 = A0_4
            L2_4(L3_4)
          end
        end
      end
      return L1_4
    end
    
    function L9_3(...)
      local L1_4, L2_4, L3_4
      L1_4 = L8_3
      L2_4, L3_4 = ...
      L1_4 = L1_4(L2_4, L3_4)
      if L1_4 then
        L1_4 = L4_3
        L2_4, L3_4 = ...
        return L1_4(L2_4, L3_4)
      end
      L1_4 = (...)
      L2_4 = L7_3
      L3_4 = L1_4
      L2_4(L3_4)
      L2_4 = nil
      return L2_4
    end
    
    if L0_3 then
      L10_3 = _G
      L10_3.require = L9_3
    end
  end
  
  L5_2 = L4_2
  L5_2()
  L4_2 = nil
end

L0_1()

function L0_1(...)
  local L0_2, L1_2
  L0_2 = {}
  L1_2 = {}
  L1_2.width = 540
  L1_2.height = 960
  L1_2.scale = "letterbox"
  L1_2.fps = 30
  L0_2.content = L1_2
  application = L0_2
end

L0_1()

function L0_1(...)
  local L0_2, L1_2
  L0_2 = application
  if L0_2 then
    L0_2 = type
    L1_2 = application
    L0_2 = L0_2(L1_2)
    if L0_2 == "table" then
      goto lbl_11
    end
  end
  L0_2 = {}
  application = L0_2
  ::lbl_11::
  L0_2 = application
  L1_2 = {}
  L1_2.appName = "Caduta Libera"
  L1_2.appVersion = "1.0"
  L1_2.appPackageId = "it.mediaset.cadutalibera.android"
  L1_2.appId = "00000000"
  L1_2.appKey = "00000000"
  L1_2.userId = "478277"
  L1_2.subscription = "pro"
  L1_2.mode = "distribution"
  L0_2.metadata = L1_2
end

L0_1()
