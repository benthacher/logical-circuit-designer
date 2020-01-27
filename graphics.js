let canvases = document.querySelectorAll('canvas.layer');
let layers = [];
canvases.forEach((canvas, index) => {
    layers.push(canvas.getContext('2d'));
    layers[index].imageSmoothingEnabled = false;
})

let layerWidth = 200;
let layerHeight = 100;

const Layer = Object.freeze({
    UI: 0,
    GAME: 1,
    BACKGROUND: 2
});

resize();

let map = new Map(layerWidth, layerHeight);
let camera = new Camera(layerWidth / 2, layerHeight / 2, 1);

function setBackground(urlOrColor) {
    if (urlOrColor.includes('.'))
        canvases[Layer.BACKGROUND].style.backgroundImage = urlOrColor;
    else
        canvases[Layer.BACKGROUND].style.background = urlOrColor;
}
/**
 * 
 * @param {number} n Layer number
 * @param {String} color
 */
function clear(n, color) {
    if (!color)
        layers[n].clearRect(0, 0, layerWidth, layerHeight);
    else
        rect(0, 0, layerWidth, layerHeight, color, true, n);
}
/**
 * 
 * @param {number} x 
 * @param {number} y 
 * @param {number} width 
 * @param {number} height 
 * @param {String} color 
 * @param {boolean} zoom
 * @param {number} n Layer number
 */
function rect(x, y, width, height, color, zoom = false, n) {
    let ctx = layers[n];

    ctx.fillStyle = color;

    if (zoom) {
        let p = calcScreenCoords(x, y);
        x = p.x;
        y = p.y;

        width  *= camera.zoom;
        height *= camera.zoom;
    }

    ctx.fillRect(floor(x), floor(y), floor(width), floor(height));
}
/**
 * 
 * @param {number} x 
 * @param {number} y 
 * @param {number} width 
 * @param {number} height 
 * @param {String} color 
 * @param {boolean} zoom
 * @param {number} n Layer number
 */
function strokeRect(x, y, width, height, color, thickness, zoom = false, n) {
    let ctx = layers[n];

    ctx.strokeStyle = color;
    ctx.lineWidth = thickness;

    if (zoom) {
        let p = calcScreenCoords(x, y);
        x = p.x;
        y = p.y;

        ctx.lineWidth  *= camera.zoom;
        width          *= camera.zoom;
        height         *= camera.zoom;
    }

    ctx.strokeRect(floor(x), floor(y), floor(width), floor(height));
}

/**
 * 
 * @param {number}  x 
 * @param {number}  y 
 * @param {number}  width 
 * @param {number}  height 
 * @param {String}  color 
 * @param {number}  angle 
 * @param {boolean} zoom
 * @param {number} n Layer number
 */
function rotatedRect(x, y, width, height, color, angle, zoom = false, n) {
    let ctx = layers[n];

    ctx.fillStyle = color;

    if (zoom) {
        let p = calcScreenCoords(x, y);
        x = p.x;
        y = p.y;

        width  *= camera.zoom;
        height *= camera.zoom;
    }

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.fillRect(floor(-width / 2), floor(-height / 2), floor(width), floor(height));
    ctx.restore();
}
/**
 * 
 * @param {Image}   sprite
 * @param {number}  x 
 * @param {number}  y 
 * @param {number}  width 
 * @param {number}  height 
 * @param {String}  color 
 * @param {number}  angle 
 * @param {boolean} zoom
 * @param {number} n Layer number
 */
function rotatedSprite(sprite, x, y, width, height, angle, zoom = false, n) {
    let ctx = layers[n];

    if (zoom) {
        let p = calcScreenCoords(x, y);
        x = p.x;
        y = p.y;

        width  *= camera.zoom;
        height *= camera.zoom;
    }

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.drawImage(sprite, -width / 2, -height / 2, width, height);
    ctx.restore();
}
/**
 * 
 * @param {String}  text 
 * @param {String}  font 
 * @param {number}  size 
 * @param {String}  color 
 * @param {number}  x 
 * @param {number}  y 
 * @param {boolean} zoom 
 */
function text(text, font, size, color, x, y, zoom = false, n) {
    let ctx = layers[n];

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.fillStyle = color;

    if (zoom) {
        let p = calcScreenCoords(x, y);
        x = p.x;
        y = p.y;

        size *= camera.zoom;
    }
    
    ctx.font = `${size}px ${font}`;
    
    ctx.fillText(text, x, y);
}
/**
 * 
 * @param {number}  x 
 * @param {number}  y 
 * @param {number}  radius 
 * @param {String}  color 
 * @param {boolean} zoom 
 */
function circle(x, y, radius, color, zoom = false, n) {
    let ctx = layers[n];

    if (zoom) {
        let p = calcScreenCoords(x, y);
        x = p.x;
        y = p.y;
        
        radius *= camera.zoom;
    }

    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
}
/**
 * 
 * @param {number}  x1 
 * @param {number}  y1 
 * @param {number}  x2 
 * @param {number}  y2 
 * @param {String}  color 
 * @param {boolean} thickness 
 */
function lineTo(x1, y1, x2, y2, color, thickness, zoom = false, n) {
    let ctx = layers[n];

    if (zoom) {
        let p1 = calcScreenCoords(x1, y1);
        x1 = p1.x;
        y1 = p1.y;
        let p2 = calcScreenCoords(x2, y2);
        x2 = p2.x;
        y2 = p2.y;

        thickness *= camera.zoom;
    }

    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = thickness;
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}
/**
 * 
 * @param {number}  x 
 * @param {number}  y 
 * @param {number}  radius 
 * @param {String}  color 
 * @param {number}  thickness 
 * @param {boolean} zoom 
 */
function strokeCircle(x, y, radius, color, thickness, zoom = false, n) {
    let ctx = layers[n];

    if (zoom) {
        let p = calcScreenCoords(x, y);
        x = p.x;
        y = p.y;
        
        radius *= camera.zoom;
        thickness *= camera.zoom;
    }
    
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = thickness;
    ctx.arc(x, y, radius, 0, 2*Math.PI);
    ctx.stroke();
}

/**
 * 
 * @param {number} v Vector or x value
 * @param {number} y (optional) y value
 */
function calcScreenCoords(v, y) {
    // if there's only v (vector) then use components
    // else use v as an x value then y as y value

    let x = y == undefined ? v.x : v;
    y = y == undefined ? v.y : y;

    return new Vector(
        (((x - camera.pos.x) * camera.zoom) + layerWidth/2),
        (((y - camera.pos.y) * camera.zoom) + layerHeight/2)
    );
}