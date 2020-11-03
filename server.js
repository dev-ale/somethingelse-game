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

let game = {};
let clients  = []
let questions = 10

http.listen(port, () => {
	console.log(`Listening on port ${port}`)
})

io.on('connection', (socket) => {
	console.log(`Client ${socket.id} connected to the server.`)

	socket.on('new_game', (clientId) => {
		const gameId = Math.random().toString(36).substring(2,8);
		game = {
			"id": gameId,
			"questions": questions,
			"clients": [clientId]
		}

		socket.emit('update_game', game)
		console.log("New Game created: " + game.id + " (" + game.questions + " Questions)")
	})

	socket.on('join_game', (gameId, username) => {
		if (game.id === gameId) {
			game.clients.push(username)
			console.log("pushed username")
		}else {
			console.log("not found")
		}


		socket.emit('update_game', game)
		console.log("Game updatet: " + game)
	})













	// Listen to disconnect event. 'disconnecting' is a reserved event,
	// again refer to https://socket.io/docs/emit-cheatsheet/
	socket.on('disconnecting', () => {
		// Remove the disconnected client from the client list
		clients = clients.filter((client) => {
			return client.id != socket.id
		})
		// Emit the updated client list to all connected clients *EXCEPT* sender.
		socket.broadcast.emit('update_clients', clients)
		console.log(`Client ${socket.id} disconnected from the server.`)
	})
})
