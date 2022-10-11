export default async function ShowCanGoToNextRoundButtonToServer(socket, io, data, callback, global) {

    const room = socket.room;

    // Find room of socket
    if (!room) {
        console.log('Room not found in socket');
        callback({
            success: false,
            message: 'A szoba nem létezik'
        });
        return;
    }

	room.canGoToNextQuestion = true;

	callback({
		room: room.response()
	});

    io.sockets.in(socket.room.id).emit('show_can_go_to_next_round_button_to_client', {
        success: true,
        room: room.response()
    });
}