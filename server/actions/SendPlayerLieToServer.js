export default function SendPlayerLieToServer(socket, io, data, callback, global) {

  	const { lie } = data;
 	const player = global.Players[socket.id];

	// If player not found
	if (!player) {
		console.log('Failed to send player lie to server. The player not found');

		callback({
			success: false,
			code: 400,
			message: 'A játékost nem sikerült beazonosítani'
		});

		return;
	}

	const room = player.getRoom(global.GameRooms);

	// Detect room is exists
	if (!room) {
		console.log('Failed to send player lie to server. Room not found in socket');

		callback({
			success: false,
			message: 'A szoba nem létezik'
		});

		return;
	}

	console.log(player.playerName, 'lied', lie);

	// Set player lie at room
	room.setPlayerLie(player, lie);


	// Send lie to clients
	const roomPlayers = room.getPlayers();

	callback({
		success: true,
		players: roomPlayers.map(player => player.response()),
		player: player,
		room: room.response()
	});

	// Send lieed globalPlayers to room / others
	io.sockets.in(socket.room.id).emit('on_player_sent_lie_to_client', {
		success: true,
		players: roomPlayers.map(player => player.response()),
		player: player,
		room: room.response()
	});
}
