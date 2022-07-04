export default function SendGuessedAnswerToServer(socket, io, data, callback, global) { 

    const { answer } = data;

    let player = global.Players[socket.id];

    // If player not found
    if (!player) {
        console.log(
            'Failed to send guessing to server. The player not found'
        );

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
        console.log(
            'Failed to send guessing to server. Room not found in socket'
        );

        callback({
            success: false,
            message: 'A szoba nem létezik'
        });

        return;
    }

    // Update player guess at room
    player = room.setGuessPlayerAnswer(player, answer);
    global.Players[socket.id] = player;
    console.log(player.playerName, 'guessed', answer);

    // Send answers to clients
    const roomPlayers = room.getPlayers();

    callback({
        success: true,
        players: roomPlayers,
        player: player,
        room: room.response()
    });

    // Send chooed answer players to room / others
    io.sockets
        .in(socket.room.id)
        .emit('send_player_guessed_answer_to_client', {
            success: true,
            players: roomPlayers,
            player: player,
            room: room.response()
        });
}
