import Vue from "vue";
import App from "./App.vue";
import Paginate from "vuejs-paginate";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import "materialize-css/dist/js/materialize.min";
import dateFilter from "@/filter/datefilters";

Vue.config.productionTip = false;
Vue.filter("date", dateFilter);
Vue.component("paginate", Paginate);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
