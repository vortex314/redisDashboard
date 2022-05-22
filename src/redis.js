import Vue from 'vue';
/*jshint esversion: 6 */

export const Redis = new Vue({
    name: 'redisService',
    data() {
        return {
            subscriptions: [],
            connected: false,
            host: "limero.ddns.net",
            port: 9000,
            socketPath:"/redis",
            ws: {},
        }
    },
    created: function () {
        this.subscriptions = [];
    },
    mounted() {
    },
    computed:{
        webSocketUrl(){
            return "ws://"+this.host+":"+this.port+this.socketPath;
        }
    },
    methods: {

        onConnected() {
            console.log("Redis connected");
            this.connected = true;
            this.command(["hello","3"])
            for( var subscription in this.subscriptions){
                this.command(["PSUBSCRIBE", subscription.channel]);
            }
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
        addHandler(strings,action){
            if ( strings instanceof Array){
                strings.forEach(s => {
                    this.subscribe(s,action);
                });
            }
        },
        onError(error) {
            console.log(error);
        },
        command(arr) {
            if ( !this.connected ) {
                alert("Redis not connected");
                return
            }
            console.log("Redis command: " + arr);
            this.ws.send(JSON.stringify(arr));
        },

        connect() {
            console.log("Redis connecting to "+this.webSocketUrl);    
            this.ws = new WebSocket(this.webSocketUrl, [
                "string",
                "foo",
            ]);
            this.ws.onopen = this.onConnected;
            this.ws.onclose = this.onDisconnected;
            this.ws.onmessage = this.onMessage;
            this.ws.onerror = this.onError;
        },
        disconnect() {
            this.ws.close();
            this.connected = false;
        },
    }
});

export const Eventbus = new Vue()
