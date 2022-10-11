
export default async function StartNextRoundToServer(socket, io, data, callback, global) {

    let player = global.Players[socket.id];

    console.log('Start next round');

    // If player not found
    if (!player) {
        callback({
            success: false,
            code: 400,
            player: {},
            message: 'A játékost nem sikerült beazonosítani'
        });
        return;
    }

	let room = player.getRoom(global.GameRooms);

    // Detect room is exists
    if (!room) {
        console.log(
            'Failed to send guessing to server. Room not found in socket'
        );

        callback({
            success: false,
            message: 'A szoba nem létezik'
        });

        return;
    }

	// Start next round
	room = await room.nextRound();

    callback({
        success: true,
        players: room.getPlayers(),
        room: room.response()
    });

    io.sockets
        .in(socket.room.id)
        .emit('start_next_round_to_client', {
            success: true,
            players: room.getPlayers(),
            room: room.response()
        });

}