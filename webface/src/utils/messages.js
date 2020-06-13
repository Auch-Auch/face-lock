export default {
  install(Vue, options) {
    Vue.prototype.$message = function (html) {
      M.toast({ html, displayLength: 500 });
    };

    Vue.prototype.$longMessage = function (html) {
      M.toast({ html, displayLength: 4000 });
    };

    Vue.prototype.$error = function (html) {
      M.toast({ html: `[error]: ${html}` });
    };
  },
};
