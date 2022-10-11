class Player {
    constructor(id, playerName) {
        this.id = id;
        this.playerName = playerName;
        this.profileImage = '';

        this.room = {};
        this.ready = false;

        this.guess = '';
        this.guessed = false;

        this.lie = '';
        this.lied = false;

        this.score = 0;
        this.previousScore = 0;

        this.color = '';

    }

    response() {
        const player = Object.assign({}, this);
        return player;
    }   

    getId() {
        return this.id;
    }

    getPlayername() {
        return this.playerName;
    }

    setProfileImage(image) {
      this.profileImage = image;
    }

    setRoom(room) {
        this.room = {
            id: room.id,
            roomCode: room.roomCode
        };
        return this;
    }

    getRoom(rooms) {
        return rooms.find((room) => room.roomCode === this.room.roomCode);
    }

    setReady(ready) {
        this.ready = ready;
        return this;
    }

    isBannedFromRoom(room) {
        return typeof room.bannedPlayers.findId(this.id) !== 'undefined';
    }

    isPlayerInRoom(room) {
        return typeof room.players.findId(this.id) !== 'undefined';
    }

    removeFromAllRooms(rooms) {
        for (var i = 0; i < rooms.length; i++) {
            var room = rooms[i];
            if (this.isPlayerInRoom(room)) {
                room.removePlayer(this);
            }
        }
    }

    addScore(score) {
        this.score += score;
    }

    static isPlayerAlreadyExists(playerName, listOfAllPlayers) {
        var oldPlayerId;
        for (var id in listOfAllPlayers) {
            if (listOfAllPlayers.hasOwnProperty(id)) {
                if (listOfAllPlayers[id].playerName === playerName) {
                    oldPlayerId = id;
                    return oldPlayerId;
                }
            }
        }

        return false;
    }
}

export default Player;
