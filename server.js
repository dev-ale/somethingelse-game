const cv = require('opencv4nodejs')
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

const FPS = 10
const wCap = new cv.VideoCapture(0)
wCap.set(cv.CAP_PROP_FRAME_WIDTH, 200)
wCap.set(cv.CAP_PROP_FRAME_HEIGHT, 200)

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

io.on('connection', (socket) => {
	/*
	 *  ✨ Handle new connected client
	 */
	console.log(`Client ${socket.id} connected to the server.`)

	// Push new connected socket to socketList
	clients.push({ id: socket.id })

	// Emit the updated client list to *ALL* connected clients.
	io.emit('update_clients', clients)


	setInterval(() => {
		const frame = wCap.read()
		const image = cv.imencode('.jpg', frame).toString('base64')
		io.emit('image',image)
	}, 1000 / FPS)

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
