export default function GetGuessablesToServer(socket, io, data, callback, global) {

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

        const answers = room.getAnswersToGuess();
        console.log('Guessable answers queried', answers);

        // Send back to room
        callback({
            success: true,
            answers: answers,
            room: room.response(),
            time: room.playersTimeToGuess
        });

        // Send choosable answers to globalPlayers also
        io.sockets.in(socket.room.id).emit('send_choosable_answers_to_client', {
            success: true,
            answers: answers,
            room: room.response(),
            time: room.playersTimeToGuess
        });


        // Timeout, countdown part
        // -------------

        // Define function what happened on timeout guess answer
        const onTimeoutGuessAnswer = () => {
            console.log(
                'Time is up to guess answers, elapsed time more than',
                room.playersTimeToGuess,
                'secs'
            );

            // Time is up to guess answers by globalPlayers
            room.timeIsUpGuessAnswer();

            // After timeout get globalPlayers (to know who did not guessed)
            const roomPlayers = room.getPlayers();

            io.sockets
                .in(socket.room.id)
                .emit('send_timeout_to_guess_answers_to_client', {
                    success: true,
                    room: room.response(),
                    players: roomPlayers.map(player => player.response())
                });
        };

        // Start timeout
        // --------

        // Close previous interval
        if (room.countdownGuessInterval !== null) {
            clearInterval(room.countdownGuessInterval);
            room.countdownGuessInterval = null;
        }


        // Countdown. Every second send time to all users.
        room.countdownGuessTime = room.playersTimeToGuess;
        room.countdownGuessInterval = setInterval(() => {

            room.countdownGuessTime -= 1;

            if (room.countdownGuessTime % 10 === 0) {
                console.log('Guess time is ', room.countdownGuessTime);
            }

            // On timeout choosing
            if (room.countdownGuessTime <= 0) {
                onTimeoutGuessAnswer();
                clearInterval(room.countdownGuessInterval);
                room.countdownGuessInterval = null;
            }

            // Countdown
            io.sockets
                .in(socket.room.id)
                .emit('send_countdown_time_to_client', { 
                    success: true, 
                    time: room.countdownGuessTime,
                    room: room.response()
                });

            

        }, 1000);
}
