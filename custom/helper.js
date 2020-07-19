!(async () => {
  window.loadTimeData = {
    data: {
      downloadButton: {
        msg: "test",
      },
      reloadButton: {
        msg: "reload",
      },
      suggestedOfflineContentPresentation: true,
      attemptAutoFetch: false,
      disabledEasterEgg: false,
    },
    valueExists: s => {
      const b = loadTimeData.data[s]
      if (b === undefined) console.log("value doesn't exist:", s, b)

      return Boolean(b)
    },
    getValue: s => loadTimeData.data[s],
  }

  window.q = (s, n = document) => n.querySelector(s)
  window.qq = (s, n = document) => n.querySelectorAll(s)

  const loadSoundFile = url => {
    return new Promise(function a(res) {
      const xhr = new XMLHttpRequest()
      xhr.open("GET", url, true)
      xhr.responseType = "arraybuffer"
      xhr.onload = function aa() {
        res(this.response)
      }
      xhr.send()
    })
  }
  window.Runner.prototype.loadSounds = async function loadSounds() {
    if (!IS_IOS) {
      this.audioContext = new AudioContext()

      const resourceTemplate = document.getElementById(this.config.RESOURCE_TEMPLATE_ID)
        .content

      for (const sound in Runner.sounds) {
        let soundSrc = resourceTemplate.getElementById(Runner.sounds[sound]).src
        soundSrc = soundSrc.substr(soundSrc.indexOf(",") + 1)
        const buffer = await loadSoundFile(soundSrc)

        this.audioContext.decodeAudioData(
          buffer,
          function d(index, audioData) {
            this.soundFx[index] = audioData
          }.bind(this, sound)
        )
      }
    }
  }

  window.onload = () => {
    const { scrollWidth } = document.documentElement
    const runnerStyles = `.offline #main-frame-error > .runner-container { image-rendering: pixelated; margin: 0; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) scale(${
      scrollWidth / 600
    }) }`
    const rnst = document.createElement("style")
    rnst.innerHTML = runnerStyles
    document.body.appendChild(rnst)

    document.firstElementChild.classList.add("offline")
    qq(".icon").forEach(i => i.classList.add("icon-offline"))

    window.r = new Runner(".interstitial-wrapper")
  }
})()
