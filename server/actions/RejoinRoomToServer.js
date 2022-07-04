export default function RejoinRoomToServer(socket, io, data, callback, global) {

	const { lastKnownRoom } = data;
	const room = global.GameRooms.find(room => room.id === lastKnownRoom.id);

	if (!room) {
		callback({ success: false, message: 'A szoba nem létezik, a játéknak vége' });
		return;
	}

	socket.room = room;
	socket.join(socket.room.id);

	callback({
		success: true,
		room: room.response(),
		players: room.players
	});
}
