export default function PlayerDisconnected(socket, io, data, callback) {
    
    let player = global.Players[socket.id];

    console.log('🔴 Disconnected: ' + player?.playerName);

    // If player not found
    if (player?.id && player?.room?.id) {
        console.log('Send player disconnected');

        io.sockets
            .in(player.room.id)
            .emit('send_someone_disconnected_to_client', {
                success: true,
                player: player
            });
    }
}
