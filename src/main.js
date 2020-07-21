import Vue from "vue"
import App from "./app.vue"
// import "./registerServiceWorker"
import router from "./router"
import store from "./store"
import Runner from "./assets/dino"
import seedrandom from "seedrandom"

Vue.config.productionTip = false

Vue.Runner = Vue.prototype.Runner = Runner
Vue.seedrandom = Vue.prototype.seedrandom = seedrandom

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount("#app")
