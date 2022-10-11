export default async function GetCategoriesToServer(socket, io, data, callback, global) {
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

    // Room is already waiting for guess category by player
    if (room.waitingForGuessCategory) {
        console.log('Room already has categories', room.categories);
        callback({
            success: true,
            categories: room.categories,
            room: room.response()
        });
        return;
    }

    // Get for choosing
    console.log('Get categories for room', room.roomCode);
    const categories = await global.CategoriesLogic.getCategoriesForChoosing();

    // Select category set room properties
    console.log('Categories queried for choosing', categories);
    room.openSelectCategory(categories);

    console.log(room.playerWhoHaveToGuessCategory.playerName, 'select category');

    callback({ success: true, room: room.response() });

    // Send categories to others
    io.sockets
        .in(socket.room.id)
        .emit('waiting_for_guess_category_to_client', {
            success: true,
            categories: categories,
            players: room.getPlayers(),
            room: room.response()
        });

}
