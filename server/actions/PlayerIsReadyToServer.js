export default function PlayerIsReadyToServer(socket, io, data, callback, global) {

    const { ready } = data;

    const player = global.Players[socket.id];

    // If player not found
    if (!player?.playerName) {
        callback({
            success: false,
            code: 400,
            message: 'A játékost nem sikerült beazonosítani'
        });
        return;
    }

    // Set status in player object
    player.setReady(ready);

    console.log('Set player status to ready on room', player.playerName);

    // Set player in room
    const room = player.getRoom(global.GameRooms);

    // If room not found
    if (!room) {
        callback({
            success: false,
            code: 401,
            message: 'A szobát nem találom'
        });
        return;
    }

    room.setPlayer(player);
    room.checkEverybodyIn();

    // Send to player who is pressed the ready button
    callback({ 
        success: true, 
        room: room.response(), 
        player: player 
    });

    console.log(player.playerName, 'is ready at room', room.id);

    // Send to others
    io.sockets.in(socket.room.id).emit('player_is_ready_to_client', {
        success: true,
        room: room.response(),
        player
    });
}
