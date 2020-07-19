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
    // else console.log("value exists:", s, b)

    return Boolean(b)
  },
  getValue: s => loadTimeData.data[s],
}

window.q = (s, n = document) => n.querySelector(s)
window.qq = (s, n = document) => n.querySelectorAll(s)

// window.qAttr = (a, s, n) => q(`[${a}="${s}"]`, n)

window.onload = () => {
  window.document.body.setAttribute(
    "style",
    "font-family: 'Segoe UI', Tahoma, sans-serif; font-size: 75%"
  )

  // ? page text setup
  q("head>title").innerText = "vaaski's dno"
  q("span[jsselect='heading']").innerText = "vaaski's dno"
  q("#error-information-button").classList.add("hidden")
  q("#download-link").setAttribute("style", "display:none")

  document.firstElementChild.classList.add("offline")
  qq(".icon").forEach(i => i.classList.add("icon-offline"))

  window.r = new Runner(".interstitial-wrapper")

  console.log("init")
}
