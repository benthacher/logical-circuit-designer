class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    equals(other) {
        return this.x == other.x && this.y == other.y;
    }

    set(vector) {
        this.x = vector.x;
        this.y = vector.y;
    }

    mag() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    dir() {
        if (isNaN(this.y / this.x))
            return 0;
        
        return Math.atan2(this.y, this.x);
    }

    setMag(m) {
        let d = this.dir();

        this.x = m * Math.cos(d);
        this.y = m * Math.sin(d);

        return this;
    }

    setDir(d) {
        let m = this.mag();

        this.x = m * Math.cos(d);
        this.y = m * Math.sin(d);

        return this;
    }

    copy() {
        return new Vector(this.x, this.y);
    }

    normalize(mutate) {
        if (this.mag() == 0)
            return zeroVector.copy();
        return this.divide(this.mag(), mutate);
    }

    add(other, mutate) {
        if (mutate) {
            this.x += other.x;
            this.y += other.y;
            return this;
        } else
            return new Vector(this.x + other.x, this.y + other.y);
    }

    subtract(other, mutate) {
        if (mutate) {
            this.x -= other.x;
            this.y -= other.y;
            return this;
        } else
            return new Vector(this.x - other.x, this.y - other.y);
    }
    
    scale(factor, mutate) {
        if (mutate) {
            this.x *= factor;
            this.y *= factor;
            return this;
        } else {
            return new Vector(this.x * factor, this.y * factor);
        }
    }

    multiply(other, mutate) {
        if (mutate) {
            this.x *= other.x;
            this.y *= other.y;
            return this;
        } else {
            return new Vector(this.x * other.x, this.y * other.y);
        }
    }
    
    divide(factor, mutate) {
        return this.scale(1 / factor, mutate);
    }

    dot(other) {
        return this.x * other.x + this.y * other.y;
    }
    
    toString() {
        return `[${this.x.toFixed(3)},${this.y.toFixed(3)}]`;
    }
}

const zeroVector = new Vector(0, 0);

Vector.draw = (basePos, vec, color) => {
    lineTo(basePos.x, basePos.y, basePos.x + vec.x, basePos.y + vec.y, color, 2, true, Layer.UI);
};