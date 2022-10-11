import express from 'express';
import * as http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

import Room from './Room.js';
import Player from './Player.js';
import Categories from './Categories.js';
import Fact from './Fact.js';

import SendPlayerNameToServer from './actions/SendPlayerNameToServer.js';
import PlayerDisconnected from './actions/PlayerDisconnected.js';
import StartGameToServer from './actions/StartGameToServer.js';
import CreateGameRoomToServer from './actions/CreateGameRoomToServer.js';
import PlayerJoinToRoomToServer from './actions/PlayerJoinToRoomToServer.js';
import PlayerIsReadyToServer from './actions/PlayerIsReadyToServer.js';
import GetCategoriesToServer from './actions/GetCategoriesToServer.js';
import SendPlayerLieToServer from './actions/SendPlayerLieToServer.js';
import GetGuessablesToServer from './actions/GetGuessablesToServer.js';
import SendGuessedAnswerToServer from './actions/SendGuessedAnswerToServer.js';
import SelectCategoryToServer from './actions/SelectCategoryToServer.js';
import GetFactToServer from './actions/GetFactToServer.js';
import RejoinRoomToServer from './actions/RejoinRoomToServer.js';
import RejoinPlayerToServer from './actions/RejoinPlayerToServer.js';
import SetProfileImageToServer from './actions/SetProfileImageToServer.js';
import GetRoomToServer from './actions/GetRoomToServer.js';
import ShowCanGoToNextRoundButtonToServer from './actions/ShowCanGoToNextRoundButtonToServer.js';
import StartNextRoundToServer from './actions/StartNextRoundToServer.js';

global.CategoriesLogic = new Categories();
global.Players = {};
global.GameRooms = [];
global.Connections = [];

/* const corsOptions = {
  origin: '*',
  credentials: true
} */

// Initialize express and socket io                   
const app = express();
/* app.use(cors(corsOptions));
 */
const server = http.createServer(app);
server.listen(3001, () => console.log('Listening at ', 3001));

const io = new Server(server, { cors: { credentials: true }});

app.get('/', (req, res) => res.send('Working Fibbage server'));

const onSocketConnected = (socket) => {

    if (global.Players[socket.id]) {
        console.log('✅ Connected player:', global.Players[socket.id]);
        return;
    }

    if (socket?.room?.id) {
        console.log('✅ Connected room:', socket.room.id);
        return;
    }

    console.log('✅ Connected not in game yet:', socket.id);
}

io.sockets.on('connection', function (socket) {

    onSocketConnected(socket);

    // This callback runs when a new Socket.IO connection is established.
    // eslint-disable-next-line no-undef
    global.Connections.push(socket);

    // Detect room has already connected
    socket.on('rejoin_room_to_server', async (data, callback) => await RejoinRoomToServer(socket, io, data, callback, global));

    // Detect room has already connected
    socket.on('rejoin_player_to_server', async (data, callback) => await RejoinPlayerToServer(socket, io, data, callback, global));

    // Remove socket from connection, if there is a playerName
    socket.on('disconnect', async (data, callback) => await PlayerDisconnected(socket, io, data, callback, global));

    // FOR TESTING !!!
    socket.on('get_room_to_server', async (data, callback) => await GetRoomToServer(socket, io, data, callback, global));

    // Join to room section
    // ------------------------------------------------------------------------

    // Create room and join code (from room) ✅
    socket.on('create_game_room_to_server', async (data, callback) => await CreateGameRoomToServer(socket, io, data, callback, global));

    // Player input her/his name and press send button (from player) ✅
    socket.on('send_player_name_to_server', async (data, callback) => await SendPlayerNameToServer(socket, io, data, callback, global));

    // Join player to room (from player)
    socket.on('player_join_to_room_to_server', async (data, callback) => await PlayerJoinToRoomToServer(socket, io, data, callback, global));

    // Player status (ready for game or not, from player)
    socket.on('player_is_ready_to_server', async (data, callback) => await PlayerIsReadyToServer(socket, io, data, callback, global));

    // Everybody in, start game (from player)
    socket.on('start_game_to_server', async (data, callback) => await StartGameToServer(socket, io, data, callback, global));

    // Upload profile image
    socket.on('player_set_profile_image_to_server', async (data, callback) => await SetProfileImageToServer(socket, io, data, callback, global));

    // Play the game section
    // ------------------------------------------------------------------------

    // Get categories (from room)
    socket.on('get_categories_to_server', async (data, callback) => await GetCategoriesToServer(socket, io, data, callback, global));

    // Select category (from player)
    socket.on('select_category_to_server', async (data, callback) => await SelectCategoryToServer(socket, io, data, callback, global));

    // Fact part
    // ------------------------------------------------------------------------

    // Get fact after guess category, and countdown until all globalPlayers lied (from room)
    socket.on('get_fact_to_server', async (data, callback) => await GetFactToServer(socket, io, data, callback, global));

    // Lie part
    // ------------------------------------------------------------------------

    // Send player answer to server (from player)
    socket.on('send_player_lie_to_server', async (data, callback) => await SendPlayerLieToServer(socket, io, data, callback, global));

    // Guessables
    // ------------------------------------------------------------------------

    // After all players type their answers, get answers thay can guess (from room)
    socket.on('get_guessables_to_server', async (data, callback) => await GetGuessablesToServer(socket, io, data, callback, global));

    // On player guess answer (from player)
    socket.on('send_guessed_answer_to_server', async (data, callback) => await SendGuessedAnswerToServer(socket, io, data, callback, global));

    // Next round 
    // ------------------------------------------------------------------------

    // After show scores send the other users can go to next question
    socket.on('show_can_go_to_next_round_button_to_server', async (data, callback) => await ShowCanGoToNextRoundButtonToServer(socket, io, data, callback, global));

    // Start next round is the same as get categories
    socket.on('start_next_round_to_server', async (data, callback) => await StartNextRoundToServer(socket, io, data, callback, global));
});

// eslint-disable-next-line no-extend-native
Array.prototype.findId = function (id) {
    for (var i = 0; i < this.length; i++) {
        if (this[i].id === id) {
            return this[i];
        }
    }
};
