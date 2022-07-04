export default function PlayerJoinToRoomToServer(socket, io, data, callback, global) {

    const { roomCode } = data;

    const room = global.GameRooms.find(
        (room) => room.roomCode === roomCode
    );

    const player = global.Players[socket.id];

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

    // If room ID is valid, then try to join the room
    if (!room) {
        callback({
            success: false,
            code: 401,
            room: {},
            message: 'A szoba nem található'
        });
        return;
    }

    console.log(player.playerName, ' try to join room ', room?.id, '(Rooms: ', global.GameRooms.length, ')');

    // Check player is banned
    if (player.isBannedFromRoom(room)) {
        callback({
            success: false,
            code: 402,
            message: 'Ki lettél dobva a játékból'
        });
        return;
    }

    // Check if player already in the room
    if (player.isPlayerInRoom(room)) {
        callback({
            success: false,
            code: 403,
            message: 'Már csatlakoztál a szobához'
        });
        return;
    }

    // Remove player from all other game rooms first
    player.removeFromAllRooms(global.GameRooms);

    // Now join to room
    socket.room = room;
    socket.join(socket.room.id);

    room.addPlayer(player);
    player.setRoom(socket.room);

    console.log(
        socket.playerName,
        ' joined game room ',
        socket.room.id
    );

    callback({ 
      success: true, 
      room: room.response(), 
      player: player 
    });

    io.sockets.in(socket.room.id).emit('player_joined_to_room_to_client', {
        success: true,
        room: room.response(),
        player: player
    });
}
