import Vue from "vue";
export default {
  namespaced: true,
  state: {
    id: 0,
    name: "",
    token: ""
  },
  mutations: {
    updateId(state, id) {
      state.id = id;
    },
    updateName(state, name) {
      state.name = name;
    },
    setToken(state, token) {
      localStorage.setItem("token", token);
      // if (process.env.NODE_ENV === "production") {
      //   Vue.cookie.set("token", token, -1, null, "guozitiyu.com");
      // } else {
        Vue.cookie.set("token", token);
      // }
      state.token = token;
    },
    clearToken(state, token) {
      localStorage.setItem("token", "");
      // if (process.env.NODE_ENV === "production") {
      //   Vue.cookie.set("token", '', -1, null, "guozitiyu.com");
      // } else {
        Vue.cookie.set("token", '');
      // }
      state.token = "";
    },
    returnToken(state) {
      state.token =
        localStorage.getItem("token") || Vue.cookie.get("token") || "";
      console.log(state.token, Vue.cookie.get("token"), "returnToken");
    }
  }
};
