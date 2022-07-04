import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate';

import game from './game.js';

// Create a new store instance.
const store = createStore({
	namespaced: true,
	plugins: [createPersistedState()],
	modules: {
		game: game
	}
});

export default store;