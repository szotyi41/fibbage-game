export default function SelectCategoryToServer(socket, io, data, callback, global) {

    const { category } = data;
    const player = global.Players[socket.id];

    // If player not found
    if (!player) {
        console.log(
            'Failed to guess category by player. The player not found'
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
            'Failed to guess category by player. Room not found in socket'
        );
        callback({
            success: false,
            message: 'A szoba nem létezik'
        });
        return;
    }

    // If room doesn't need to guess category
    if (!room.waitingForGuessCategory) {
        console.log('Room not needed to guess category');
        callback({
            success: false,
            message: 'A kategória már kiválasztásra került'
        });
        return;
    }

    // Select category
    console.log('Select category', category);
    room.selectCategory(category);
    console.log('----------------------------------');

    callback({ 
      success: true, 
      room: room.response(), 
      category: category 
    });

    // Send the selected categories to others
    io.sockets.in(socket.room.id).emit('on_guess_category_to_client', {
        success: true,
        category: category,
        room: room.response()
    });
}
