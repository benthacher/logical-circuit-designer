let { sqrt, cos, sin, floor, ceil, random, abs } = Math;
const { PI } = Math;

function rad(a) {
    return a * PI / 180;
}

function deg(a) {
    return a * 180 / PI;
}

function createSprite(src) {
    let sprite = document.createElement('img');
    sprite.src = src;
    return sprite;
}

function rand(min, max) {
    if (min instanceof Vector && max instanceof Vector)
        return new Vector(rand(min.x, max.x), rand(min.y, max.y));
    else
        return Math.random() * (max - min) + min;
}

function randColor() {
    return `rgb(${rand(0, 255)}, ${rand(0, 255)}, ${rand(0, 255)})`;
}

function dist(vec1, vec2) {
    return Math.hypot(vec1.x - vec2.x, vec1.y - vec2.y);
}

function lerp(v0, v1, t) {
    return v0 * (1 - t) + v1 * t;
}

function getAngle(vec1, vec2) {
    // lineTo(vec1.x, vec2.y, vec2.x, vec2.y, "red", 2, true);
    // lineTo(vec1.x, vec2.y, vec2.x, vec2.y, "blue", 2, true);
    // lineTo(vec1.x, vec2.y, vec2.x, vec2.y, "green", 2, true);
    return Math.atan2(vec1.y - vec2.y, vec1.x - vec2.x);
}

function round(n, d) {
    if (!d)
        return Math.round(n);
    return Math.round(n * (10 ** d)) / (10 ** d);
}

function isCollidingBala(p1, p2, center, r) {
    let midpoint = p1.subtract(p1.subtract(p2).divide(2));
    let length = dist(p1, p2);

    if (dist(center, midpoint) > length / 2 + r / 2)
        return;

    let a12 = getAngle(p1, p2);
    let a13 = getAngle(p1, center);
    let theta = a12 - a13;

    let dist13 = dist(p1, center);

    let height = dist13 * sin(theta);

    return Math.abs(height) < r;
}

function resolveStaticRectCollision(obj1, obj2) {
    let collisionAngle = getAngle(obj1.pos, obj2.pos);
    let elasticity = (obj1.elasticity + obj2.elasticity) / 2;

    // quadrant 1
    let q1 = Math.atan2((obj1.bounds.y + obj2.bounds.y),(obj1.bounds.x + obj2.bounds.x));
    let q2 = PI - q1;
    let q3 = -q2;
    let q4 = -q1;

    // console.log(deg(q1), deg(q2), deg(q3), deg(q4));
    // console.log(deg(collisionAngle));

    if (collisionAngle > q1 && collisionAngle < q2) {
        obj1.pos.y = obj2.pos.y + (obj2.bounds.y / 2) + (obj1.bounds.y / 2);
        obj1.vel.y *= -elasticity;
    } else if ((collisionAngle > q2 && collisionAngle < PI) 
            || (collisionAngle < q3 && collisionAngle > -PI)) {
        obj1.pos.x = obj2.pos.x - (obj2.bounds.x / 2) - (obj1.bounds.x / 2);
        obj1.vel.x *= -elasticity;
    } else if (collisionAngle > q3 && collisionAngle < q4) {
        obj1.pos.y = obj2.pos.y - (obj2.bounds.y / 2) - (obj1.bounds.y / 2);
        obj1.vel.y *= -elasticity;
    } else if ((collisionAngle < q1 && collisionAngle > 0) 
            || (collisionAngle > q4 && collisionAngle < 0)) {
        obj1.pos.x = obj2.pos.x + (obj2.bounds.x / 2) + (obj1.bounds.x / 2);
        obj1.vel.x *= -elasticity;
    }

    obj1.vel.scale(obj2.roughness, true);
}

function resolveDynamicRectCollision(obj1, obj2) {
    let collisionAngle = getAngle(obj1.pos, obj2.pos);
    let elasticity = (obj1.elasticity + obj2.elasticity) / 2;

    let avgVel = (obj1.vel.mag() + obj2.vel.mag()) / 2;
    
    obj1.vel.setMag(avgVel);
    obj2.vel.setMag(avgVel);

    // quadrant 1
    let q1 = Math.atan2((obj1.bounds.y + obj2.bounds.y),(obj1.bounds.x + obj2.bounds.x));
    let q2 = PI - q1;
    let q3 = -q2;
    let q4 = -q1;

    if (collisionAngle > q1 && collisionAngle < q2) {
        obj1.pos.y = obj2.pos.y + (obj2.bounds.y / 2) + (obj1.bounds.y / 2);
        obj1.vel.y *= -elasticity;
        obj2.vel.y *= -elasticity;
    } else if ((collisionAngle > q2 && collisionAngle < PI) 
            || (collisionAngle < q3 && collisionAngle > -PI)) {
        obj1.pos.x = obj2.pos.x - (obj2.bounds.x / 2) - (obj1.bounds.x / 2);
        obj1.vel.x *= -elasticity;
        obj2.vel.x *= -elasticity;
    } else if (collisionAngle > q3 && collisionAngle < q4) {
        obj1.pos.y = obj2.pos.y - (obj2.bounds.y / 2) - (obj1.bounds.y / 2);
        obj1.vel.y *= -elasticity;
        obj2.vel.y *= -elasticity;
    } else if ((collisionAngle < q1 && collisionAngle > 0) 
            || (collisionAngle > q4 && collisionAngle < 0)) {
        obj1.pos.x = obj2.pos.x + (obj2.bounds.x / 2) + (obj1.bounds.x / 2);
        obj1.vel.x *= -elasticity;
        obj2.vel.x *= -elasticity;
    }

    obj1.vel.scale(obj2.roughness, true);
    obj2.vel.scale(obj1.roughness, true);
}

function resolveElasticCollision(obj1, obj2) {
    let collisionAngle = getAngle(obj1.pos, obj2.pos);
    let elasticity = (obj1.elasticity + obj2.elasticity) / 2;
    let collide_normal = new Vector(0, 1);
    collide_normal.setDir(collisionAngle);
    
    while (obj1.hitbox.collidingWith(obj2.hitbox)) {
        obj1.pos.add(collide_normal, true);
        obj2.pos.subtract(collide_normal, true);
    }
    
    let n = new Vector(obj2.pos.x - obj1.pos.x, obj2.pos.y - obj1.pos.y);
    let un = n.divide(n.mag());
    let ut = new Vector(-un.y, un.x);
    
    let v1 = new Vector(obj1.vel.x, obj1.vel.y);
    let v2 = new Vector(obj2.vel.x, obj2.vel.y);
    
    let v1n = un.dot(v1);
    let v1t = ut.dot(v1);
    let v2n = un.dot(v2);
    let v2t = ut.dot(v2);
    
    let v1nf = ((v1n * (obj1.mass - obj2.mass)) + (2 * obj2.mass * v2n)) / (obj1.mass + obj2.mass);
    let v1tf = v1t;
    let v2nf = ((v2n * (obj2.mass - obj1.mass)) + (2 * obj1.mass * v1n)) / (obj1.mass + obj2.mass);
    let v2tf = v2t;
    
    let v1nfv = un.scale(v1nf * elasticity);
    let v1tfv = ut.scale(v1tf * elasticity);
    let v2nfv = un.scale(v2nf * elasticity);
    let v2tfv = ut.scale(v2tf * elasticity);
    
    obj1.vel = v1nfv.add(v1tfv);
    obj2.vel = v2nfv.add(v2tfv);
}

function resolveStaticCollision(d_obj, s_obj) { // dynamic Object and static Object
    // TODO
   
}