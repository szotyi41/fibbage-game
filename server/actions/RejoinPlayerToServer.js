export default function RejoinPlayerToServer(socket, io, data, callback, global) {

	const { oldPlayerId } = data;
	const newPlayerId = socket.id;

	console.log('data', data);

	const player = global.Players[oldPlayerId];

	console.log('Try to rejoin with old id', oldPlayerId);

	if (!player) {
		console.log('Player not found');
		callback({ 
			success: false, 
			message: 'A játékos nem található'
		});
		return;
	}

	const room = global.GameRooms.find(room => room.id === player.room?.id);

	if (!room || !room.id) {
		console.log('Room not found');
		callback({ 
			success: false, 
			message: 'A szoba nem létezik, a játéknak vége' 
		});
		return;
	}

	// Join to room
	socket.room = room;
	socket.join(socket.room.id);

	room.rejoinPlayer(oldPlayerId, newPlayerId);

	const newPlayer = global.Players[oldPlayerId];
	newPlayer.id = newPlayerId;

	global.Players[newPlayerId] = newPlayer;
	delete global.Players[oldPlayerId];
	

	console.log('Rejoined successfully with id');

	callback({
		success: true,
		room: room.response(),
		player: player.response(),
		players: room.players
	});
}
