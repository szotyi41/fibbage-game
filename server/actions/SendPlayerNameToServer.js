import Player from '../Player.js';

export default function SendPlayerNameToServer(socket, io, data, callback, global) {

		const { playerName } = data;

		// Playername is empty
		if (!playerName) {

			callback({
				success: false,
				message: 'Player name cannot be empty'
			});

			return;
		}

		socket.playerName = playerName;

		// Check player is already exists
		const oldPlayerId = Player.isPlayerAlreadyExists(
			playerName,
			global.Players
		);

		// Player not exists yet, create it
		if (oldPlayerId === false) {

			const player = new Player(socket.id, socket.playerName);

			global.Players[player.id] = player;

			console.log(playerName + ' joined the server with id ' + socket.id);

			// Send callback with new player details
			callback({ 
				success: true, 
				player: player 
			});

			// Send update to all players
			io.sockets.emit('update_players', global.Players);

			// send game room list to the newly registered client
			socket.emit('update_game_rooms', { rooms: global.GameRooms });

			return;
		}

		// if playerName already exists, then reset the id to the socket id
		const oldPlayer = global.Players[oldPlayerId];
		const player = oldPlayer;
		player.id = socket.id;
		global.Players[player.id] = player;

		// Delete the old player
		delete global.Players.oldPlayerId;

		// Update players (like observer)
		var roomPlayer;

		for (var roomIndex = 0; roomIndex < global.GameRooms.length; roomIndex++) {

			var room = global.GameRooms[roomIndex];

			// Update players in room
			for (var playerIndex = 0; playerIndex < room.players.length; playerIndex++) {
				roomPlayer = room.players[playerIndex];
				if (roomPlayer.playerName === playerName) {
					roomPlayer.id = player.id;
				}
			}

			// Update banned players in room
			for (var bannedPlayerIndex = 0; bannedPlayerIndex < room.bannedPlayers.length; bannedPlayerIndex++) {
				roomPlayer = room.bannedPlayers[bannedPlayerIndex];
				if (roomPlayer.playerName === playerName) {
					roomPlayer.id = player.id;
				}
			}
		}

		console.log(playerName + ' rejoined the server with id ' + socket.id);

		// If player is already joined to room
		if (player.room.id) {

			const room = global.GameRooms.find(
				(room) => room.roomCode === player.room.roomCode
			);

			callback({ 
				success: true, 
				player: player, 
				room: room.response()
			});

			return;
		}

		// New player
		callback({ 
			success: true, 
			player: player 
		});
}
