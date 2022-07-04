import Fact from '../Fact.js';


export default async function GetFactToServer(socket, io, data, callback, global) {

    const { category } = data;
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

    // Find the fact in category
    console.log('Find fact for category', category);

    const fact = await Fact.findOne({ category: category }).exec();
    room.setFact(fact);

    console.log('Fact queried successfully', fact.fact);

    callback({
        success: true,
        fact: fact,
        room: room.response(),
        time: room.globalPlayersTimeToTypeAnswer
    });

    // Send to all clients
    io.sockets.in(socket.room.id).emit('send_fact_to_client', {
        success: true,
        room: room.response(),
        fact: fact,
        time: room.globalPlayersTimeToTypeAnswer
    });

    // Timeout, countdown part
    // -------------

    // Define function what happened on timeout lying
    const onTimeoutLying = () => {
        console.log(
            'Time is up to lying, elapsed time more than',
            room.playersTimeToLie,
            'secs'
        );

        // Time is up to lying by globalPlayers
        room.timeIsUpLying();

        // After timeout get globalPlayers (to know who did not guessed)
        const roomPlayers = room.getPlayers();

        console.log('----------------------------------');

        io.sockets
            .in(socket.room.id)
            .emit('send_timeout_to_lying_to_client', {
                success: true,
                room: room.response(),
                players: roomPlayers
            });
    };


    // Countdown. Every second send time to all users.
    room.countdownLieTime = room.playersTimeToLie;
    room.countdownLieInterval = setInterval(() => {

        room.countdownLieTime -= 1;
        console.log('Lie time is ', room.countdownLieTime);

        // On timeout choosing
        if (room.countdownLieTime <= 0) {
            onTimeoutLying();
            clearInterval(room.countdownLieInterval);
            room.countdownLieInterval = null;
        }

        // Send countdown to client
        io.sockets
            .in(socket.room.id)
            .emit('send_countdown_time_to_client', { 
                success: true, 
                time: room.countdownLieTime,
                room: room.response()
            });

    }, 1000);
}
