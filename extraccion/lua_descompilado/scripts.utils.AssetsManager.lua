local AssetsManager = {}
local imagesAssets = "Assets/Images/"
local imagesMappers = "Assets.Images."
AssetsManager.sprites = {
  LETTERS_SPRITE_HD = {
    sprite = imagesAssets .. "Letters" .. "/" .. "letters_sprite_hd.png",
    spriteMapper = imagesMappers .. "Letters" .. "." .. "letters_sprite_hd",
    frames = 126
  },
  LOADING_SPRITE_HD = {
    sprite = imagesAssets .. "Loading" .. "/" .. "loading_sprite_hd.png",
    spriteMapper = imagesMappers .. "Loading" .. "." .. "loading_sprite_hd",
    frames = 11
  },
  SCREEN_1_SPRITE_HD = {
    sprite = imagesAssets .. "01_Welcome_screen" .. "/" .. "screen1_sprite_hd.png",
    spriteMapper = imagesMappers .. "01_Welcome_screen" .. "." .. "screen1_sprite_hd",
    frames = 52
  },
  SCREEN_2_SPRITE_HD = {
    sprite = imagesAssets .. "02_Choose_opponent" .. "/" .. "screen2_sprite_hd.png",
    spriteMapper = imagesMappers .. "02_Choose_opponent" .. "." .. "screen2_sprite_hd",
    frames = 66
  },
  SCREEN_3_SPRITE_HD = {
    sprite = imagesAssets .. "03_Head_to_head" .. "/" .. "screen3_sprite_hd.png",
    spriteMapper = imagesMappers .. "03_Head_to_head" .. "." .. "screen3_sprite_hd",
    frames = 15
  },
  SCREEN_4_SPRITE_HD = {
    sprite = imagesAssets .. "04_Falling" .. "/" .. "screen4_sprite_hd.png",
    spriteMapper = imagesMappers .. "04_Falling" .. "." .. "screen4_sprite_hd",
    frames = 13
  },
  SCREEN_5_SPRITE_HD = {
    sprite = imagesAssets .. "05_Win_Lose" .. "/" .. "screen5_sprite_hd.png",
    spriteMapper = imagesMappers .. "05_Win_Lose" .. "." .. "screen5_sprite_hd",
    frames = 8
  }
}
AssetsManager.bg = {
  SCREEN_1_BACKGROUND_HD = imagesAssets .. "01_Welcome_screen" .. "/" .. "screen1_background_hd.jpg",
  SCREEN_2_BACKGROUND_HD = imagesAssets .. "02_Choose_opponent" .. "/" .. "screen2_background_hd.jpg",
  SCREEN_3_BACKGROUND_HD = imagesAssets .. "03_Head_to_head" .. "/" .. "screen3_background_hd.jpg",
  SCREEN_4_BACKGROUND_HD = imagesAssets .. "04_Falling" .. "/" .. "screen4_background_hd.jpg",
  SCREEN_5_BACKGROUND_HD = imagesAssets .. "05_Win_Lose" .. "/" .. "screen5_background_hd.jpg"
}
return AssetsManager
