import { InjectionKey } from "vue";
import { createStore, Store } from "vuex";
import { STORE_USER_INFO, SET_DRAW_COUNT } from "./mutationType";

const store = createStore<StateType>({
  state: {
    userInfo: {
      name: "",
      phone: ""
    },
    drawCount: 0
  },
  mutations: {
    [STORE_USER_INFO](state, payload) {
      state.userInfo = payload;
    },
    [SET_DRAW_COUNT](state, payload) {
      state.drawCount = payload;
    }
  },
  actions: {},
  modules: {}
});

export interface StateType {
  userInfo: {
    name: string;
    phone: string;
  };
  drawCount: number;
}

export const key: InjectionKey<Store<StateType>> = Symbol();

export default store;
