import Vue from "vue"
import Dev from "@dev/Dev.vue"

Vue.config.productionTip = false

new Vue({
  render: h => h(Dev)
}).$mount("#app")
