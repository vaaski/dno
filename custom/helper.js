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

  window.onload = () => {
    const { scrollWidth } = document.documentElement
    const runnerStyles = `.offline #main-frame-error > .runner-container { image-rendering: pixelated; margin: 0; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) scale(${
      // eslint-disable-next-line no-inline-comments
      1 // scrollWidth / 1.5 / 600
    }) }`
    const runnerStyle = document.createElement("style")
    runnerStyle.innerHTML = runnerStyles
    document.body.appendChild(runnerStyle)

    document.firstElementChild.classList.add("offline")
    qq(".icon").forEach(i => i.classList.add("icon-offline"))

    window.renewRandomSeeds = seed => {
      window.randomFns = {
        obstacleSize: (() => new Math.seedrandom(`obstacleSize-${seed}`))(),
        obstacleYPosConf: (() => new Math.seedrandom(`obstacleYPosConf-${seed}`))(),
        gap: (() => new Math.seedrandom(`gap-${seed}`))(),
        obstacleTypeIndex: (() => new Math.seedrandom(`obstacleTypeIndex-${seed}`))(),
      }
    }
    renewRandomSeeds("tester")

    window.r = new Runner(".interstitial-wrapper", {
      SPEED: 13,
    })
  }
})()
