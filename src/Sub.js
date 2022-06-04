import { Redis,Timer } from "./Redis.js";
export  class Sub {
    constructor(pattern, timeout,callback,timeoutCallback) {
        this.pattern = pattern;
        this.timeout = timeout;
        this.callback = callback;
        this.timeoutCallback = timeoutCallback;
        this.timer = Timer.create(this.timeoutCallback, this.timeout);
        Redis.subscribe(this.pattern, this.callback);
    }
    subscribe(pattern){
        Redis.unsubscribe(this.pattern);
        this.pattern = pattern;
        Redis.subscribe(this.pattern, this.callback);
    }
    unsubscribe() {
        Redis.unsubscribe(this.pattern, this.callback);
        this.timer.stop();
    }
    resetTimer() {
        this.timer.reset();
    }
}