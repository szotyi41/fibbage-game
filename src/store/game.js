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
	}
}

export default game;