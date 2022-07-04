export default function StartGameToServer(socket, io, data, callback, global) {

    const player = global.Players[socket.id];

    // If player not found
    if (!player) {
        callback({
            success: false,
            code: 400,
            message: 'A játékost nem sikerült beazonosítani'
        });
        return;
    }

    const room = player.getRoom(global.GameRooms);

    console.log('Start game room', room.id);

    // Check all players are ready
    if (!room.checkEverybodyIn()) {
        // Find not ready players
        const playersNotReady = room.players.filter(
            (player) => !player.ready
        );

        console.log('We are waiting for other players', playersNotReady);

        callback({
            success: false,
            code: 400,
            message: playersNotReady.length + ' játékos még nem áll készen',
            room: room.response(),
            player: player
        });
    }

    room.startRoom();

    // Game is started
    console.log('Room started successfully', room.id); 
    console.log('----------------------------------');

    callback({ 
      success: true, 
      room: room.response(), 
      player: player 
    });

    // Send game is started to others
    io.sockets.in(socket.room.id).emit('game_started_to_client', {
        success: true,
        room: room.response(),
        player: player
    });
}
