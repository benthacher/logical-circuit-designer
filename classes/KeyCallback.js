// callback enum
const CallbackMode = Object.freeze({
    HOLD: 0,
    PRESS: 1,
    RELEASE: 2,
    SHORTCUT: 3
});

class KeyCallback {
    /**
     * 
     * @param {string} keys 
     * @param {function} callback 
     * @param {CallbackMode} mode 
     */
    constructor(keys, mode, callback) {
        this.keys = keys;
        this.mode = mode;
        this.callback = callback;
    }
}