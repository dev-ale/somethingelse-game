<template>
	<div class="counter">
		<h1 v-html="value" />
    <v-btn
        @click.prevent="increment()"
        v-html="'Increment'"
        style="font-size: 1.25em"
    ></v-btn>
    <br>

    <v-btn
        @click.prevent="reset()"
        v-html="'Reset'"
        style="font-size: 1.25em"
    ></v-btn>

	</div>
</template>

<script>
export default {
	name: 'Counter',
	data() {
		return {
			value: 0
		}
	},
	methods: {
		/*
		 * 💥 Emit increment_counter event to the socket server.
		 */
		increment() {
			this.$socket.client.emit('increment_counter')
		},
    reset() {
      this.$socket.client.emit('reset_counter')
    }
	},
	sockets: {
		/*
		 * 👂 Listen to socket events emitted from the socket server
		 */
		update_counter(value) {
			this.value = value
		}
	}
}
</script>

<style scoped>
.counter {
	width: 100%;
	margin-top: 32px;
	padding-top: 32px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	border-top: 1px solid rgba(0, 0, 0, 0.1);
}
</style>
