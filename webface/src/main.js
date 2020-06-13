import Vue from "vue";
import { MonthPicker } from "vue-month-picker";
import { MonthPickerInput } from "vue-month-picker";
import App from "./App.vue";
import Paginate from "vuejs-paginate";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import "materialize-css/dist/js/materialize.min";
import dateFilter from "@/filter/datefilters";
import messages from "@/utils/messages.js";

Vue.config.productionTip = false;
Vue.filter("date", dateFilter);
Vue.component("paginate", Paginate);
Vue.use(MonthPicker);
Vue.use(MonthPickerInput);
Vue.use(messages);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
