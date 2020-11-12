module.exports = function (sound, vol) {
  if (sound === undefined) {
    sound = 'move.mp3'
  }

  if (vol === undefined) {
    vol = 0.5
  }

  const pref = JSON.parse(localStorage.getItem('player')) || {}
  const soundObj = new Audio('/sounds/' + sound)
  soundObj.volume = vol

  if (pref.sound) {
    var playPromise = soundObj.play()

    if (playPromise !== undefined) {
      playPromise.then(_ => {
        // Automatic playback started!
        // Show playing UI.
      }).catch(error => {
        console.log(error)
      // Auto-play was prevented
      // Show paused UI.
      })
    }
  }
}
