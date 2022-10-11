const game = {
	namespaced: true,
	state: {
		room: {},
		player: {},
		players: [],
		category: {},
		categories: [],
		fact: {},
		answers: [],
		roomForRejoin: {},
		playerForRejoin: {}
	},
	mutations: {
		setRoom(state, room) {
			state.room = room;
		},
		setPlayer(state, player) {
			state.player = player;
		},
		setPlayers(state, players) {
			state.players = players;
		},	
		setCategories(state, categories) {
			state.categories = categories;
		},	
		setCategory(state, category) {
			state.category = category;
		},
		setFact(state, fact) {
			state.fact = fact;
		},
		setAnswers(state, answers) {
			state.answers = answers;
		},
		setRoomForRejoin(state, room) {
			state.roomForRejoin = room;
		},
		setPlayerForRejoin(state, player) {
			state.playerForRejoin = player;
		},

		clearRoom(state) {
			state.roomForRejoin = state.room;
			state.playerForRejoin = state.player;

			state.room = {};
			state.player = {};
			state.players = [];
			state.categories = [];
			state.category = {};
			state.fact = {};
			state.answers = [];
		}
	},
	actions: {
		getRoom({ commit }, socket) {
			console.log('Query room');
			return socket.emit('get_room_to_server', {  }, (success, room) => {
				commit('setRoom', room);

				if (room?.players && Array.isArray(room?.players) && room?.players?.length) {
					commit('setPlayers', room.players);
				}

				if (room?.categories && Array.isArray(room?.categories) && room?.categories.length) {
					commit('setCategories', room.categories);
				}
			});
		}
	}
}

export default game;