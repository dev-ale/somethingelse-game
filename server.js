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

/*
 *  Store connected clients etc.
 *  Do not use in production 🤪
 */
var clients = []
var counter = 0

/*
 * Init Position of the Brick
 */
var position = {
	x: 200,
	y: 200
};

var player1Score = 0;
var player2Score = 0;


var currentQuestion = null;

var questions = [
	{
		"category":"General Knowledge",
		"type":"multiple",
		"difficulty":"easy",
		"question":"Which sign of the zodiac is represented by the Crab?",
		"correct_answer":"Cancer",
		"incorrect_answers":[
			"Libra",
			"Virgo",
			"Sagittarius"
		]
	},
	{
		"category":"General Knowledge",
		"type":"multiple",
		"difficulty":"easy",
		"question":"What is the name of the Jewish New Year?",
		"correct_answer":"Rosh Hashanah",
		"incorrect_answers":[
			"Elul",
			"New Year",
			"Succoss"
		]
	},
	{
		"category":"General Knowledge",
		"type":"multiple",
		"difficulty":"easy",
		"question":"What is the Spanish word for &quot;donkey&quot;?",
		"correct_answer":"Burro",
		"incorrect_answers":[
			"Caballo",
			"Toro",
			"Perro"
		]
	}
]



io.on('connection', (socket) => {
	/*
	 *  ✨ Handle new connected client
	 */
	console.log(`Client ${socket.id} connected to the server.`)

	// Push new connected socket to socketList
	clients.push({ id: socket.id })

	// Emit the updated client list to *ALL* connected clients.
	io.emit('update_clients', clients)


	// Emit Brick Position
	socket.emit("position", position);
	socket.on("move", data => {
		switch(data) {
			case "left":
				position.x -= 5;
				io.emit("position", position);
				break;
			case "right":
				position.x += 5;
				io.emit("position", position);
				break;
			case "up":
				position.y -= 5;
				io.emit("position", position);
				break;
			case "down":
				position.y += 5;
				io.emit("position", position);
				break;
		}
	})
	// Emit the current counter *ONLY* to the new connected client.
	// Refer to https://socket.io/docs/emit-cheatsheet/ for the difference
	// of `io.emit` and `socket.emit`
	socket.emit('update_counter', counter)

	/*
	 *  👂 Listen to socket events emitted from vue components
	 */

	socket.on('next_question', () => {

		//TODO: Fehler beim erstellen des allAnswer Arrays, es wird jedesmal die korrekte Lösung hinzugefügt...

		currentQuestion = questions[Math.floor(Math.random() * questions.length)];
		let allAnswers = []
		allAnswers.push(currentQuestion.incorrect_answers)
		allAnswers[0].push(currentQuestion.correct_answer)
		currentQuestion.allAnswers = allAnswers[0];

		io.emit('update_question', currentQuestion)
	})


	socket.emit('update_score1', player1Score)
	socket.emit('update_score2', player2Score)

	socket.on('increment_score1', () => {
		player1Score ++
		socket.emit('update_score1',player1Score)
	})

	socket.on('increment_score2', () => {
		player2Score ++
		socket.emit('update_score2',player2Score)
	})

	socket.on('reset_score1', () => {
		player1Score = 0
		socket.emit('update_score1',player1Score)
	})

	socket.on('reset_score2', () => {
		player2Score = 0
		socket.emit('update_score2',player2Score)
	})


	// Listen to increment_counter event, fired by `increment()` in 'Counter.vue'
	socket.on('increment_counter', () => {
		counter += 1
		io.emit('update_counter', counter)
	})

	// Listen to reset_counter event, fired by `reset()` in 'Counter.vue'
	socket.on('reset_counter', () => {
		counter = 0
		io.emit('update_counter', counter)
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
