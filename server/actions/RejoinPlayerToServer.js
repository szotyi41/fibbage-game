export default function RejoinPlayerToServer(socket, io, data, callback, global) {

	const { lastKnownPlayer } = data;
	const player = global.Players?.[lastKnownPlayer.id];

	if (!player || !player.id) {
		callback({ 
			success: false, 
			message: 'A játékos nem található'
		});
		return;
	}

	const room = global.GameRooms.find(room => room.id === player.room?.id);

	if (!room || !room.id) {
		callback({ 
			success: false, 
			message: 'A szoba nem létezik, a játéknak vége' 
		});
		return;
	}

	socket.room = room;
	socket.join(socket.room.id);

	callback({
		success: true,
		room: room.response(),
		player: player.response(),
		players: room.players
	});
}
