import Vue from "vue"
import App from "./app.vue"
// import "./registerServiceWorker"
import router from "./router"
import store from "./store"
import seedrandom from "seedrandom"

Vue.config.productionTip = false

// Vue.Runner = Vue.prototype.Runner = Runner
Vue.seedrandom = Vue.prototype.seedrandom = seedrandom

Vue.dev = Vue.prototype.dev = process.env.NODE_ENV === "development"
const log = (...t) => {
  if (!Vue.dev && !window.forcelog) return
  const time = new Date()
  console.log(`%c[${time.toLocaleTimeString("de")}]`, "color:grey", ...t)
}
Vue.log = Vue.prototype.log = log
window.log = log

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount("#app")
