let fpsInterval = 1000 / FPS,
    then = Date.now(),
    now,
    elapsed;


function loop() {
    requestAnimationFrame(loop);

    now = Date.now();
    elapsed = now - then;

    if (elapsed > fpsInterval) {
        then = now - (elapsed % fpsInterval);

        events();
        draw();
        logic();
    }
}

init();
loop();