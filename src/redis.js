import Vue from 'vue';

export const Redis = new Vue({
    name: 'redisService',
    data() {
        return {
            subscriptions: [],
            connected: false,
            host: "localhost",
            port: 9000,
            ws: {}
        }
    },
    created: function () {
        this.subscriptions = [];
    },
    mounted() {

    },
    methods: {

        onConnected() {
            console.log("Redis connected");
        },
        onDisconnected() {
            console.log("Redis disconnected");
        },
        onMessage(message) {
            var arr = JSON.parse(message.data);
            var cmd = arr[0];
            switch (cmd.toLowerCase()) {
                case "hello":
                    console.log(arr[1].version)
                    break;

                default:
                    break;
            }
            console.log(message);
        },
        subscribe(channel,action) {
            this.subscriptions.push({channel:channel,action:action});
        },
        onerror(error) {
            console.log(error);
        },
        send(arr) {
            this.ws.send(JSON.stringify(arr));
        },
        connect() {
            this.ws = new WebSocket("ws://" + this.host + ":" + this.port + "/redis", [
                "string",
                "foo",
            ]);
            this.ws.onopen = this.onConnected;
            this.ws.onclose = this.onDisconnected;
            this.ws.onmessage = this.onMessage;
            this.ws.onerror = this.onerror;
        },
        disconnect() {
            this.ws.close();
        },
    }
});
