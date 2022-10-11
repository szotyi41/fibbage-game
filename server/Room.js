import Player from './Player.js';

class Room {
    // Init variables
    constructor(id, roomCode) {
        this.id = id;
        this.roomCode = roomCode;
        this.players = [];
        this.bannedPlayers = [];
        this.maxPlayers = Number.POSITIVE_INFINITY;
        this.round = 0;

        this.colors = [
            '#caa169',
            '#6d9e70',
            '#a45e5c',
            '#74c4c3',
            '#79a8c9',
            '#d1cd80'
        ];

        // Set timeout's
        this.timeoutGuessCategory = {};
        this.timeoutTypeLie = {};
        this.timeoutGuessAnswer = {};

        // Rules
        this.playersTimeToLie = 30; //20;
        this.playersTimeToGuess = 30; //20;
        this.choosableAnswersNumber = 6;
        this.playerWhoHaveToGuessCategoryIndex = 0;
        this.playerWhoHaveToGuessCategory = {};

        // Joining progress
        this.started = false;
        this.everybodyReady = false;

        // Categories
        this.category = '';
        this.categories = [];
        this.waitingForGuessCategory = false;

        // Fact
        this.fact = {};

        // Lying
        this.waitingForPlayerLying = false;

        // Choosing
        this.waitingForPlayerGuess = false; 
        this.guessedAnswers = [];

        // Results
        this.scoresAreDistributed = false;
        this.showResultsAfterEverybodyGuessed = false;

        // Scoreboard
        this.showScoreboardAfterResults = false;
        this.showScoreboardNextButton = false;

        // Countdown
        this.countdownLieTime = 0;
        this.countdownLieInterval = null;

        this.countdownGuessTime = 0;
        this.countdownGuessInterval = null;

        // Get Scores
        this.guessedLieScore = 500;
        this.guessedTruthScore = 1000;

        this.canGoToNextQuestion = false;

        this.showRound = false;

        this.showFinalScoreboard = false;

        // Game progress
        this.nextRound();
    }

    response() {
        const room = Object.assign({}, this);
        room.countdownLieInterval = 'default shit';
        room.countdownGuessInterval = 'default shit';
        room.global = {};
        return room;
    }

    // Clear round details
    nextRound() {
        this.round++;
        this.showRound = true;

        console.log('Round', this.round, 'started');

        // Category selecting part
        this.categories = [];
        this.playerWhoHaveToGuessCategory = {};
        this.waitingForGuessCategory = false;
        this.category = ''; 

        // Lie typing part
        this.fact = {};
        this.waitingForPlayerLying = false;

        // Guess answer
        this.waitingForPlayerGuess = false;

        // Set answers to guessed by players
        this.guessedAnswers = [];

        // Show results after everybody guessed their answers
        this.showResultsAfterEverybodyGuessed = false;

        this.canGoToNextQuestion = false;

        this.scoresAreDistributed = false;

        // If this is not the first round, remove answers
        // Fill up the previous score with the current score
        this.players.forEach((player, playerIndex) => {
            console.log(player.playerName + 's last score is ', player.score);
            this.players[playerIndex].lie = '';
            this.players[playerIndex].lied = false;
            this.players[playerIndex].guess = '';
            this.players[playerIndex].guessed = false;
            this.players[playerIndex].previousScore = player.score;
        });

        // After rounds increase scores
        if (this.round > 3) {
            this.guessedLieScore = 1000;
            this.guessedTruthScore = 2000;
        }

        if (this.round > 6) {
            this.guessedLieScore = 2000;
            this.guessedTruthScore = 4000;
        }

        if (this.round > 9) {
            this.guessedLieScore = 5000;
            this.guessedTruthScore = 5000;
            this.showFinalScoreboard = true;
        }

        return this;
    }

    rejoinPlayer(oldPlayerId, newPlayerId) {
        const playerIndex = this.players.findIndex(player => player.id === oldPlayerId);

        if (playerIndex !== -1) {
            this.players[playerIndex].id = newPlayerId;
        }
    }

    // Start room
    startRoom() {
        this.started = true;
    }

    // Add player to room
    addPlayer(player) {
        // Check if this player already is in the room
        if (this.playerIsJoined(player.id)) return false;

        const colorIndex = Math.floor(Math.random() * this.colors.length);
        player.color = this.colors[colorIndex];
        this.colors.splice(colorIndex, 1);

        this.players.push(player);

        return player;
    }

    // Check player is joined
    playerIsJoined(playerId) {
        return this.players.some((player) => player.id === playerId);
    }

    // Set player in room
    setPlayer(updatePlayer) {
        for (var i = 0; i < this.players.length; i++) {
            if (this.players[i].id == updatePlayer.id) {
                this.players[i] = updatePlayer;
                break;
            }
        }
    }

    // Remove player from room
    removePlayer(removePlayer) {
        this.players = this.players.filter(
            (player) => player.id === removePlayer.id
        );
        return this;
    }

    // After set the answer, get players to know who answer what
    getPlayers() {
        return this.players;
    }

    // Check everybody in room before start game
    checkEverybodyIn() {
        this.everybodyReady = this.players.every((player) => player.ready);
        return this.everybodyReady;
    }

    // ------
    // Select category section

    // Show game categories
    openSelectCategory(categories) {
        this.waitingForGuessCategory = true;
        this.categories = categories;
        this.showRound = false;

        // Increase player index after every round
        this.playerWhoHaveToGuessCategoryIndex =
            this.playerWhoHaveToGuessCategoryIndex >= this.players.length - 1
                ? 0
                : this.playerWhoHaveToGuessCategoryIndex + 1;

        // Find player
        this.playerWhoHaveToGuessCategory = this.players[this.playerWhoHaveToGuessCategoryIndex];
    }

    // The player selected category
    selectCategory(category) {
        this.waitingForGuessCategory = false;
        this.waitingForPlayerLying = true;
        this.category = category;
    }


    // --------
    // Get the fact after guess category

    // Set fact in room after guess category
    setFact(fact) {
        this.fact = fact;
    }


    // ----------
    // Lying section

    // Set typed answer (not selected) of player
    setPlayerLie(player, lie) {
        const playerIndex = this.players
            .map((player) => player.id)
            .indexOf(player.id);


        player = this.players[playerIndex];
        player.lie = lie;
        player.lied = true;


        // Set player answer
        this.players[playerIndex] = player;

        // If everybody lied in time, set room status
        if (this.checkEverybodyLied()) {
            console.log('Everybody lied in time, good job.');
            console.log('----------------------------------');

            this.waitingForPlayerLying = false;
            this.waitingForPlayerGuess = true;

            // Clear interval when everybody finished
            clearInterval(this.countdownLieInterval);
            this.countdownLieTime = 0;
            this.countdownLieInterval = null;
        }

        // Return the current player
        return player;
    }

    // If everybody lied
    checkEverybodyLied() {
        return this.players.every((player) => player.lied);
    }

    // When time is up
    timeIsUpLying() {
        this.waitingForPlayerLying = false;
        this.waitingForPlayerGuess = true;
    }

    // ---------
    // Choosing answer section


    // Get the answers player can guess after type their lies
    getAnswersToGuess() {
        const playerLies = this.players.map((player) => player.lie);
        const correctAnswer = this.fact.correct;
        const recommendedAnswers = this.fact.recommended;

        console.log('Get answers to guess...');

        // Answers must include
        let answersToGuess = [correctAnswer, ...playerLies];

        do {
            // Random answer index from recommended
            const answerIndex = Math.floor(
                Math.random() * recommendedAnswers.length
            );

            // Get recommended answer
            const recommendedAnswer = recommendedAnswers[answerIndex];

            // If the recommended answer not already in answers to guess
            if (!answersToGuess.includes(recommendedAnswer)) {
                answersToGuess.push(recommendedAnswer);
            }
        } while (answersToGuess.length < this.choosableAnswersNumber);

        this.guessedAnswers = answersToGuess;

        return answersToGuess;
    }


    // On player guess answer
    setGuessPlayerAnswer(player, guess) {

        const playerIndex = this.players
            .map((player) => player.id)
            .indexOf(player.id);

        player.guess = guess;
        player.guessed = true;

        // Set player guess
        this.players[playerIndex] = player;

        // If everybody guessed in time, clear timeout guess answer
        if (this.checkEverybodyGuessed()) {
            console.log('Everybody guessed in time, good job!');
            this.waitingForPlayerGuess = false;
            this.showResultsAfterEverybodyGuessed = true;

            // Clear interval when everybody finished
            clearInterval(this.countdownGuessInterval);
            this.countdownGuessTime = 0;
            this.countdownGuessInterval = null;

            // Distribute scores   
            this.distributeScores();

        }

        // Return the current player
        return player;
    }

    // If everybody lied
    checkEverybodyGuessed() {
        return this.players.every((player) => player.guessed);
    }

    // Distribute scores if has not yet
    // Call when last player choosed answer or when the time is up
    distributeScores() {
        if (this.scoresAreDistributed) {
            console.log('Scores already distributed');
            return;
        }

        this.scoresAreDistributed = true;

        // Each on all players
        this.players.forEach((player, playerIndex) => {

            const playerGuessedAnswer = player.guess;

            // Player choosed correct answer
            if (this.fact.correct === playerGuessedAnswer) {
                console.log(player.playerName, 'found the truth, +', this.guessedTruthScore, 'score');

                this.players[playerIndex].addScore(this.guessedTruthScore);
                return;
            }

            // Choosed the other player lie
            const otherPlayerWhoLied = this.players.find((otherPlayer) => otherPlayer.lie === playerGuessedAnswer);

            if (otherPlayerWhoLied) {
                console.log(player.playerName, 'guessed', otherPlayerWhoLied.playerName, '\'s lie. ', otherPlayerWhoLied.playerName, 'get', this.guessedLieScore, 'score');

                otherPlayerWhoLied.addScore(this.guessedLieScore);
                return;
            }

            console.log(player.playerName, 'has selected a lie by computer')
        });
    }

    // Time is up to guess answers
    timeIsUpGuessAnswer() {
        this.waitingForPlayerGuess = false;
        this.waitingForPlayerLying = false;
        this.showResultsAfterEverybodyGuessed = true;

        this.distributeScores();
    }

    // ----
    /// Other

    banPlayer(player) {
        for (let i = 0; i < this.bannedPlayers.length; i++) {
            if (this.bannedPlayers[i].id == player.id) {
                return;
            }
        }

        this.bannedPlayers.push(player);
    }

    // Make room code
    static makeRoomCode(length) {
        return 'code';
        var result = '';
        var characters =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(
                Math.floor(Math.random() * charactersLength)
            );
        }
        return result;
    }
}

export default Room;
