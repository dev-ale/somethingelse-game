const express = require('express')
const port = process.env.PORT || 3000
var app = require('express')()
var http = require('http').Server(app)
var io = require('socket.io')(http)

/*
 *  Serve /dist/ folder
 */
app.use(express.static(__dirname + '/dist'))
app.get(/.*/, (req, res) => {
	res.sendFile(__dirname + '/dist/index.html')
})

http.listen(port, () => {
	console.log(`Listening on port ${port}`)
})


let clients = [];
let game = {
	"id": null,
	"questions": 10,
	"clients": [],
	"state": null,
	"clientsReady": []
};
let games = [];

http.listen(port, () => {
	console.log(`Listening on port ${port}`)
})

io.on('connection', (socket) => {

	console.log(`Client ${socket.id} connected to the server.`);
	clients.push(socket);
	console.log("Clients: " + clients.length);

	// create Game
	socket.on('create_game', (gameId, username) => {
		game = {
			"id": gameId,
			"questions": 10,
			"clients": [username],
			"state": "created",
			"clientsReady": []
		}

		games.push(game);
		console.log(games)
		socket.join(gameId);
		io.to(gameId).emit('update_gameState', game);

	})

	// delete created game
	socket.on('cancel_game', (gameId, username) => {
		if (game.id === gameId) {
			game = {};
			game.state = null;

			// Remove game Object from games Array
			let foundGames = games.filter((game) => {
				return game.id === gameId
			})
			console.log(games)
			if (foundGames.length === 1) {
				let actualGame = foundGames[0]
				let index = games.indexOf(actualGame);
				games.splice(index, 1);
				console.log(games)
			}

			socket.join(gameId);
			io.to(gameId).emit('update_gameState', game);
			console.log(username + " deleted the Game: " + gameId);
		}else {
			console.log("Game ID not found, nothing to delete....");
		}
	})

	// join existing game Max 2 Player
	socket.on('search_game', (gameId, username) => {
		if (username && gameId) {
			let foundGame = games.filter((game) => {
				return game.id === gameId
			})
			console.log(foundGame)
			if (foundGame.length > 0) {
				game = foundGame[0];
				game.clients.push(username)
				game.state = "full"
				// Todo: check games for actual game and update it
				socket.join(gameId);
				io.to(gameId).emit('update_gameState', game);
			}else {
				socket.emit('alert_client','No Game Found');
				console.log("no game with given gameId found")
			}

		}else{
			socket.emit('alert_client','No GameID or Username given');
			console.log("no gameId oder no username given")
		}
	})
	// remove me from game
	socket.on('remove_game', (gameId, username) => {
		if (username && gameId) {
			let foundGame = games.filter((game) => {
				return game.id === gameId
			})
			if (foundGame.length > 0) {
				game = foundGame[0];
				game.clients.pop()
				console.log(game)
				let msg = username + ' left the game: ' + gameId;
				socket.emit('alert_client',msg);
				console.log(msg);
				socket.join(gameId);
				io.to(gameId).emit('update_gameState', game);
			}
			else {
				console.log("no game with given gameId found")
			}
		}
		else {
			console.log("no gameId oder no username given")
		}
	})

	// start game
	socket.on('start_game', (gameId, username) => {

		let foundGame = games.filter((game) => {
			return game.id === gameId
		})
		console.log(foundGame)
		if (foundGame.length > 0) {
			game = foundGame[0];
			if (game.clientsReady.length === 0) {
				game.clientsReady = [username]
				game.state = "ready"
				socket.join(gameId);
				io.to(gameId).emit('update_gameState', game);
				console.log(game)
			}
			else if (game.clientsReady.length === 1) {
				game.clientsReady.push(username)
				game.state = "started"
				socket.join(gameId);
				io.to(gameId).emit('update_gameState', game);
				console.log(game)
			}
			else if (game.clientsReady.length === 2) {
				game.state = "started"
				socket.join(gameId);
				io.to(gameId).emit('update_gameState', game);
				console.log(game)
			}
			else {
				console.log('error')
				game.clientsReady = []
				game.state = "full"
				socket.join(gameId);
				io.to(gameId).emit('update_gameState', game);
			}
		}
		else {
			console.log("no game with given gameId found")
		}
		//io.to(gameId).emit('update_gameState', game);
	})
	// counter test
	socket.on('counter', (gameId, username) => {
		let foundGame = games.filter((game) => {
			return game.id === gameId
		})
		if (foundGame.length > 0) {
			game = foundGame[0];
			console.log(username + ' pressed counter: ')
			game.questions ++;
			console.log(game.questions)
			socket.join(gameId);
			io.to(gameId).emit('update_gameState', game);
		}else {
			console.log("no game with given gameId found")
		}

	})



	socket.on('disconnecting', () => {

		clients = clients.filter((client) => {
			return client.id != socket.id
		})
		console.log(`Client ${socket.id} disconnected from the server.`);
		console.log("Clients: " + clients.length);
	})
})

