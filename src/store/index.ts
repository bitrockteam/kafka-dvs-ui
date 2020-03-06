import Vue from 'vue';
import Vuex from 'vuex';
import { State } from '@/interfaces/store';
import { actions } from './actions';
import { mutations } from './mutations';
import { getters } from './getters';

Vue.use(Vuex);

const state: State = {
  configuration: {
    maxFlights: 1500,
    updateRate: 30,
  },
  maximized: true,
  paused: false,
  maxSpeed: 0,
  socket: undefined,
  topSelectedItem: undefined,
  boxedMapSpeedFlight: undefined,
};

export const store = new Vuex.Store({
  state,
  mutations,
  getters,
  actions,
});
