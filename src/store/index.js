import { createStore } from 'vuex'
//import createPersistedState from 'vuex-persistedstate';
import persistedStateVuex from "persisted-state-vuex";

import game from './game.js';

// Create a new store instance.
const store = createStore({
	namespaced: true,
	plugins: [persistedStateVuex.init],
	modules: {
		game: game
	}
});

export default store;