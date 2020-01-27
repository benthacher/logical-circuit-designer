let sounds = [];

function clearSounds() {
    for (let sound of sounds) {
        sound.pause();
    }
}

function playSound(src, volume, loop = false) {
    let sound = new Audio(src);
    sound.loop = loop;
    sound.volume = volume;
    sounds.push(sound);
    sound.play();
}