import Vue from 'vue';
import Vuex from 'vuex';
import { State } from '@/interfaces/store';
import { mutations } from './mutations';
import { getters } from './getters';

Vue.use(Vuex);

const state: State = {
  maximized: true,
  paused: false,
  maxSpeed: 0,
};

export const store = new Vuex.Store({
  state,
  mutations,
  getters,
});
