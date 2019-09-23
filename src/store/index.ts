import Vue from 'vue';
import Vuex from 'vuex';
import { State } from '@/interfaces/store';
import { mutations } from './mutations';
import { getters } from './getters';
import { queryGenerator, Query } from '@/libs/query';

const $query: Query =  queryGenerator();

Vue.use(Vuex);

const state: State = {
  map: {
    range: 100,
    maximized: false,
  },
  paused: false,
  sessionIDs: [$query.id],
  dev: {
    socket: '',
    requesting: false,
    query: $query.text,
  },
};

export const store = new Vuex.Store({
  state,
  mutations,
  getters,
});
