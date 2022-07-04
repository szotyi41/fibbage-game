import Room from '../Room.js';

export default function CreateGameRoomToServer(socket, io, data, callback, global) {

	// Make 5 characters room code
	const roomCode = Room.makeRoomCode(5);
	const roomId = global.GameRooms.length + 1;
	let room = global.GameRooms.find(room => room.roomCode === roomCode);

	if (room) {
		console.log('create_game_room_to_server: ', 'Room already exists with code', roomCode);
		callback({ success: true, room: room.response() });
		return;
	}

	room = new Room(roomId, roomCode);

	// Join to room
	socket.room = room;
	global.GameRooms.push(room);
	socket.join(socket.room.id);

	console.log('create_game_room_to_server: ', 'Room created with code', roomCode, '(', room.id, ')');

	callback({ success: true, room: room.response() });
}
