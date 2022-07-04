export default function SetProfileImageToServer(socket, io, data, callback, global) { 
    const { image } = data;

    const player = global.Players[socket.id];

    // If player not found
    if (!player.playerName) {
        callback({
            success: false,
            code: 400,
            message: 'A játékost nem sikerült beazonosítani'
        });
        return;
    }

    player.setProfileImage(image);

    // Set player in room
    const room = player.getRoom(global.GameRooms);

    // If room not found
    if (!room?.id) {
        callback({
            success: false,
            code: 401,
            message: 'A szobát nem találom'
        });
        return;
    }

    // Send to others
    io.sockets.in(socket.room.id).emit('player_has_updated_details_to_client', {
        success: true,
        room: room.response(),
        player
    });
}
