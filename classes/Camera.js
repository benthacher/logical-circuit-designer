class Camera {
    constructor(x, y, zoom = 1) {
        this.pos = new Vector(x, y);
        this.zoom = zoom;
    }

    move(x, y) {
        this.pos.x = x;
        this.pos.y = y;
    }
    
    update(m_width, m_height) {
        if (this.zoom < 0)
            this.zoom = 0;

        this.leftBound = (layerWidth/2) / this.zoom;
        this.rightBound = (m_width) - (layerWidth/2) / this.zoom;
        this.topBound = (layerHeight/2) / this.zoom;
        this.bottomBound = (m_height) - (layerHeight/2) / this.zoom;
        
        if (this.pos.x < this.leftBound)
            this.pos.x = this.leftBound;
        if (this.pos.x > this.rightBound)
            this.pos.x = this.rightBound;
        if (this.pos.y < this.topBound)
            this.pos.y = this.topBound;
        if (this.pos.y > this.bottomBound)
            this.pos.y = this.bottomBound;

        if (m_width * this.zoom < layerWidth && m_height * this.zoom < layerHeight) {
            this.pos.x = m_width / 2;
            this.pos.y = m_height / 2;
        }
    }
}