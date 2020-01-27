let toolbars = [];

class Toolbar {
    constructor() {
        this.items = [];
        this.display = false;
    }

    setBackground(color) {
        this.backgroundColor = color;
        return this;
    }
    
    setClickColor(color) {
        this.clickColor = color;
        return this;
    }

    setHoverColor(color) {
        this.hoverColor = color;
        return this;
    }

    setPadding(padding) {
        this.padding = padding;
        return this;
    }

    setPos(pos) {
        this.pos = pos;
        this.items.forEach(item => {
            item.calcDisplayOffset();
        })
        return this;
    }

    add(items) {
        if (items instanceof ToolbarItem)
            items = [items];
        
        this.items.push(...items);
        
        items.forEach(item => {
            item.setParent(this);
        });

        return this;
    }

    draw() {
        if (this.display) {
            rect(this.pos.x, this.pos.y, this.items.length * this.items[0].width + (this.padding * 2), this.items[0].height + (this.padding * 2), this.backgroundColor, false, Layer.UI);
            
            this.items.forEach(item => {
                item.draw();
            });
        }
    }

    pollClickEvents() {
        if (this.display)
            this.items.forEach(item => item.pollClickEvent());
    }

    show() {
        this.display = true;
        return this;
    }
    
    hide() {
        this.display = false;
        return this;
    }

    push() {
        toolbars.push(this);
        return this;
    }
}