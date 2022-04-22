import Vue from 'vue';

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
