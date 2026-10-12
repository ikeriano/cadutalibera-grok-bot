local SoundUtil = {}
local isSfx, origVol, timeRunningOutChannel, small_Talk_loopChannel, hthMusicChannel
local soundsAssets = "Assets/Sound/"
SoundUtil.soundsTable = {
  introSound = {
    sound = audio.loadSound(soundsAssets .. "intro-shorter.mp3"),
    soundType = "FX",
    channel = nil
  },
  hthMusic = {
    sound = audio.loadSound(soundsAssets .. "head_to_head_music.mp3"),
    soundType = "FX",
    channel = nil
  },
  corrctAnswer = {
    sound = audio.loadSound(soundsAssets .. "correct answer.mp3"),
    soundType = "FX",
    channel = nil
  },
  openCoin = {
    sound = audio.loadSound(soundsAssets .. "open_coin.mp3"),
    soundType = "FX",
    channel = nil
  },
  timeRunningOut = {
    sound = audio.loadSound(soundsAssets .. "time_running_out.mp3"),
    soundType = "FX",
    channel = nil
  },
  powerUp = {
    sound = audio.loadSound(soundsAssets .. "powerUp.mp3"),
    soundType = "FX",
    channel = nil
  },
  clockMove = {
    sound = audio.loadSound(soundsAssets .. "clockMove.mp3"),
    soundType = "FX",
    channel = nil
  },
  Pass_2 = {
    sound = audio.loadSound(soundsAssets .. "Pass_2.mp3"),
    soundType = "FX",
    channel = nil
  },
  Correct_7 = {
    sound = audio.loadSound(soundsAssets .. "Correct_7.mp3"),
    soundType = "FX",
    channel = nil
  },
  Reveal = {
    sound = audio.loadSound(soundsAssets .. "Reveal.mp3"),
    soundType = "FX",
    channel = nil
  },
  yes1 = {
    sound = audio.loadSound(soundsAssets .. "yes1.mp3"),
    soundType = "FX",
    channel = nil
  },
  money_total = {
    sound = audio.loadSound(soundsAssets .. "money_total.mp3"),
    soundType = "FX",
    channel = nil
  },
  Correct_16 = {
    sound = audio.loadSound(soundsAssets .. "Correct_16.mp3"),
    soundType = "FX",
    channel = nil
  },
  small_Talk_loop = {
    sound = audio.loadSound(soundsAssets .. "small_Talk_loop.mp3"),
    soundType = "FX",
    channel = nil
  },
  contestant_Lock_2_A = {
    sound = audio.loadSound(soundsAssets .. "contestant_Lock_2_A.mp3"),
    soundType = "FX",
    channel = nil
  },
  Correct_5 = {
    sound = audio.loadSound(soundsAssets .. "Correct_5.mp3"),
    soundType = "FX",
    channel = nil
  },
  wrongAnswer = {
    sound = audio.loadSound(soundsAssets .. "error.mp3"),
    soundType = "FX",
    channel = nil
  }
}

function SoundUtil.init()
  isSfx = prefs:get("isSfx")
  if isSfx == nil then
    isSfx = true
    prefs:set("isSfx", isSfx)
    prefs:save()
  end
end

function SoundUtil.play(soundElement, loop)
  local soundType = soundElement.soundType
  local isPlay
  if soundType == "FX" then
    isPlay = isSfx
  end
  if isPlay then
    if loop == nil then
      loop = 0
    end
    local availableChannel = audio.findFreeChannel()
    soundElement.channel = audio.play(soundElement.sound, {loops = loop, channel = availableChannel})
  end
end

local function setSoundVolumeTimeRunningOutChannel()
  audio.setVolume(origVol, {channel = timeRunningOutChannel})
  if timeRunningOutChannel ~= nil and audio.isChannelActive(timeRunningOutChannel) then
    audio.stop(timeRunningOutChannel)
  end
end

local function stopTimeRunningOutSound()
  origVol = audio.getVolume()
  timeRunningOutChannel = SoundUtil.soundsTable.timeRunningOut.channel
  if timeRunningOutChannel ~= nil and audio.isChannelActive(timeRunningOutChannel) then
    audio.fadeOut({channel = timeRunningOutChannel, time = 300})
    timer.performWithDelay(300, setSoundVolumeTimeRunningOutChannel, 1)
  end
  SoundUtil.soundsTable.timeRunningOut.channel = nil
  timeRunningOutChannel = nil
end

local function setSoundVolumeHthMusic()
  audio.setVolume(origVol, {channel = hthMusicChannel})
  if hthMusicChannel ~= nil and audio.isChannelActive(hthMusicChannel) then
    audio.stop(hthMusicChannel)
  end
end

function SoundUtil.stopHthMusic()
  origVol = audio.getVolume()
  hthMusicChannel = SoundUtil.soundsTable.hthMusic.channel
  if hthMusicChannel ~= nil and audio.isChannelActive(hthMusicChannel) then
    audio.fadeOut({channel = hthMusicChannel, time = 300})
    timer.performWithDelay(300, setSoundVolumeHthMusic, 1)
  end
  hthMusicChannel = nil
  SoundUtil.soundsTable.hthMusic.channel = nil
  stopTimeRunningOutSound()
end

function SoundUtil.stopTimeRunningOutSound()
  stopTimeRunningOutSound()
end

local function setSoundVolumeSmall_Talk_loopChannel()
  audio.setVolume(origVol, {channel = small_Talk_loopChannel})
  if small_Talk_loopChannel ~= nil and audio.isChannelActive(small_Talk_loopChannel) then
    audio.stop(small_Talk_loopChannel)
  end
end

function SoundUtil.stopSmallTalkSound()
  origVol = audio.getVolume()
  small_Talk_loopChannel = SoundUtil.soundsTable.small_Talk_loop.channel
  if small_Talk_loopChannel ~= nil and audio.isChannelActive(small_Talk_loopChannel) then
    audio.fadeOut({channel = small_Talk_loopChannel, time = 300})
    timer.performWithDelay(300, setSoundVolumeSmall_Talk_loopChannel, 1)
  end
  SoundUtil.soundsTable.small_Talk_loop.channel = nil
  small_Talk_loopChannel = nil
end

function SoundUtil.correctAnswerSeq()
  if isSfx then
    stopTimeRunningOutSound()
    audio.play(SoundUtil.soundsTable.corrctAnswer.sound)
  end
end

function SoundUtil.setSoundStatus()
  isSfx = prefs:get("isSfx")
  isSfx = not isSfx
  if isSfx == false then
    audio.stop()
  end
  prefs:set("isSfx", isSfx)
  prefs:save()
end

function SoundUtil.getSoundStatus()
  return isSfx
end

return SoundUtil
