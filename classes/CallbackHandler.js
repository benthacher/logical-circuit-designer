class CallbackHandler {
    constructor() {
        this.callbackStack = [];
    }
    /**
     * 
     * @param {string} key 
     * @param {CallbackMode} mode 
     * @param {Function} callback 
     */
    attach(key, mode, callback) {
        let inputKeys;
        if (typeof key === 'string')
            inputKeys = [key];
        else
            inputKeys = key;
        
        inputKeys.forEach(inputKey => keys[inputKey] = {});
        this.callbackStack.push(new KeyCallback(inputKeys, mode, callback));
    }

    remove(key, mode) {
        let inputKeys;
        if (key instanceof String)
            inputKeys = [key];
        else
            inputKeys = key;

        for (let i = 0; i < this.callbackStack.length; i++) {
            if (this.callbackStack[i].keys == inputKeys && this.callbackStack[i].mode == mode) {
                this.callbackStack.splice(i, 1);
            }
        }
    }

    handleCallbacks() {
        this.callbackStack.forEach(keyCallback => {
            switch (keyCallback.mode) {
                case CallbackMode.HOLD:
                    let holding = true;
                    keyCallback.keys.forEach(key => {
                        if (!keys[key].pressed)
                            holding = false;
                    });
                    if (holding)
                        keyCallback.callback();
                    break;
                case CallbackMode.PRESS:
                    if (keys[keyCallback.keys[0]].pressed && keys[keyCallback.keys[0]].canBePressed) {
                        keyCallback.callback();
                        keys[keyCallback.keys[0]].canBePressed = false;
                    }
                    break;
                case CallbackMode.RELEASE:
                    if (keys[keyCallback.keys[0]].released && keys[keyCallback.keys[0]].canBeReleased) {
                        keyCallback.callback();
                        keys[keyCallback.keys[0]].canBeReleased = false;
                    }
                    break;
            }
        });
    }
}