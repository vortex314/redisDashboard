import Vue from 'vue';
/*jshint esversion: 6 */


class Queue {
    constructor() {
        this.elements = {};
        this.head = 0;
        this.tail = 0;
    }
    enqueue(element) {
        this.elements[this.tail] = element;
        this.tail++;
    }
    dequeue() {
        const item = this.elements[this.head];
        delete this.elements[this.head];
        this.head++;
        return item;
    }
    peek() {
        return this.elements[this.head];
    }
    get length() {
        return this.tail - this.head;
    }
    get isEmpty() {
        return this.length === 0;
    }
}

export const Redis = new Vue({
    name: 'redisService',
    data() {
        return {
            subscriptions: [],
            connected: false,
            host: "limero.ddns.net",
            port: 9000,
            socketPath: "/redis",
            ws: {},
            promises: new Queue,
        }
    },
    created: function () {
        this.subscriptions = [];
    },
    mounted() {
    },
    computed: {
        webSocketUrl() {
            return "ws://" + this.host + ":" + this.port + this.socketPath;
        }
    },
    methods: {

        onConnected() {
            console.log("Redis connected");
            this.connected = true;
            this.request(["hello", "3"]).then((x) => {
                console.log("hello response ", x)
            }).catch(console.log);
            this.subscriptions.forEach(subscription => {
                this.request(["PSUBSCRIBE", subscription.pattern]).then((x) => {
                    console.log("PSUBSCRIBE response", x)
                }).catch(console.log);
            });
        },
        onDisconnected() {
            console.log("Redis disconnected");
        },
        onMessage(message) {
            var arr = JSON.parse(message.data);
            var cmd = arr[0];
            switch (cmd.toLowerCase()) {
                case "pmessage":
                    this.subscriptions.forEach(subscription => {
                        if (subscription.pattern == arr[1]) {
                            subscription.callback(arr[2], JSON.parse(arr[3]));
                        }
                    })
                    break;

                default: {
                    let rp = this.promises.dequeue()
                    if (rp.cmd.toLowerCase() != cmd.toLowerCase()) console.log("ERROR: ", rp.cmd, cmd)
                    rp.resolve(arr);
                    break;
                }
            }
//            console.log(message);
        },
        subscribe(pattern, action) {
            this.subscriptions.push({ pattern: pattern, callback: action });
            if (this.connected) {
                this.request(["PSUBSCRIBE", pattern]).then((x) => {
                    console.log("PSUBSCRIBE response", x)
                }).catch(console.log);
            }
        },
        addHandler(strings, action) {
            if (strings instanceof Array) {
                strings.forEach(s => {
                    this.subscribe(s, action);
                });
            }
        },
        onError(error) {
            console.log(error);
        },
        command(arr) {
            if (!this.connected) {
                alert("Redis not connected");
                return
            }
            console.log("Redis command: ", arr);
            this.ws.send(JSON.stringify(arr));
        },

        connect() {
            console.log("Redis connecting to " + this.webSocketUrl);
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
        request(rq) {
            let rp = { cmd: rq[0] }
            let promise = new Promise((resolve, reject) => {
                if (!this.connected) reject("Redis not connected");
                rp.reject = reject;
                rp.resolve = resolve;
                this.command(rq);
            })
            this.promises.enqueue(rp);
            return promise
        }
    }
});

export const Eventbus = new Vue()

class Clock {
    constructor(interval, callback) {
        this.running = true
        this.interval = interval
        this.callback = callback
        this.last = new Date().getTime()
    }

    expired() {
        return this.running && (new Date().getTime() - this.last > this.interval);
    }

    reset() {
        this.last = new Date().getTime()
    }

    run() {
        this.callback()
        this.last = new Date().getTime()
    }

}

export const Timer = new Vue({
    name: 'timerService',
    data() {
        return {
            timers: []
        }
    },
    created: function () {
        this.timers = [];
        setInterval(() => { this.tick() }, 1000);
    },
    mounted() {

    },
    methods: {

        tick() {
            this.timers.forEach(timer => {
                if (timer.expired()) {
                    timer.run()
                }
            })
        },
        create( callback, interval) {
            var t = new Clock(interval, callback)
            this.timers.push(t)
            return t
        },

        delete(timer) {
            this.timers = this.timers.filter(t => t !== timer);
        }
    }
});

