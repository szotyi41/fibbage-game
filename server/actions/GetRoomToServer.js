

export default async function GetRoomToServer(socket, io, data, callback, global) {

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

    callback({
        success: true,
        room: room.response()
    });
}
