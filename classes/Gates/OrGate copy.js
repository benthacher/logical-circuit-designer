class XorGate extends Gate {
    
    //num inputs for AND gate defaults to 2
    constructor(pos, numInputs) {
        super(pos, numInputs || 2);
    }

    drawShape() {
        let ctx = layers[Layer.GAME];

        let leftTop = calcScreenCoords(this.pos.subtract(new Vector(this.width / 2, this.height / 2)));
        let rightTop = leftTop.add(new Vector(this.width * camera.zoom, 0));
        let rightBottom = leftTop.add(new Vector(this.width * camera.zoom, this.height * camera.zoom));
        let leftBottom = leftTop.add(new Vector(0, this.height * camera.zoom));
        
        ctx.strokeStyle = 'black';
        ctx.fillStyle = 'white';
        ctx.lineWidth = Gate.displayLineWeight * camera.zoom;

        let halfGridSize = (Gate.gridSize * camera.zoom / 2);

        ctx.beginPath();
        ctx.moveTo(leftTop.x + halfGridSize, leftTop.y);
        ctx.bezierCurveTo(rightTop.x - (this.width * camera.zoom / 4), leftTop.y, rightTop.x, rightTop.y + (this.height * camera.zoom / 2), rightTop.x, rightTop.y + (this.height * camera.zoom / 2));
        ctx.bezierCurveTo(rightTop.x, rightTop.y + (this.height * camera.zoom / 2), rightBottom.x - (this.width * camera.zoom / 4), rightBottom.y, leftBottom.x + halfGridSize, leftBottom.y);
        // ctx.lineTo(leftTop.x + halfGridSize, leftTop.y);
        ctx.ellipse(leftTop.x + halfGridSize, leftTop.y + this.height * camera.zoom / 2, halfGridSize, this.height * camera.zoom / 2, 0, PI / 2, -PI / 2, true);
        
        ctx.fill();
        ctx.stroke();
        
        ctx.beginPath();
        // ctx.moveTo(leftTop.x, leftTop.y);
        ctx.ellipse(leftTop.x, leftTop.y + this.heigh