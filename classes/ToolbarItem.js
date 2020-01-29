class ToolbarItem {
    constructor(iconImageSrc, width, height, onclick, hideOnClick) {
        this.width = width;
        this.height = height;
        this.onclick = onclick;
        this.beingClicked = false;
        this.beingHovered = false;
        this.sprite = createSprite('images/' + iconImageSrc);
        this.index;
        this.hideOnClick = hideOnClick;
    }

    draw() {
        let color = this.beingClicked ? this.parentToolbar.clickColor : (this.beingHovered ? this.parentToolbar.hoverColor : this.parentToolbar.backgroundColor);
        let ctx = layers[Layer.UI];

        rect(this.displayOffset.x, this.displayOffset.y, this.width, this.height, color, false, Layer.UI);
        
        strokeRect(this.displayOffset.x, this.displayOffset.y, this.width, this.height, 'black', Gate.displayLineWeight, false, Layer.UI);

        ctx.drawImage(this.sprite, this.displayOffset.x, this.displayOffset.y, this.width, this.height);
    }

    isBeingHovered() {
        let pos = this.displayOffset;

        return  pos.x < mouse.pos.x &&
                pos.x + this.width > mouse.pos.x &&
                pos.y < mouse.pos.y &&
                pos.y + this.height > mouse.pos.y
    }

    pollClickEvent() {
        if (this.isBeingHovered()) {
            this.beingHovered = true;
            if (!this.beingClicked && mouse.down) {
                this.beingClicked = true;
                this.onclick();
                if (this.hideOnClick)
                    this.parentToolbar.hide();
                mouse.draggingObj = null;
            }
        } else
            this.beingHovered = false;
        
        if (!mouse.down)
            this.beingClicked = false;
    }

    setParent(toolbar) {
        this.parentToolbar = toolbar;
        this.index = this.parentToolbar.items.indexOf(this);

        this.calcDisplayOffset();
    }

    calcDisplayOffset() {
        this.displayOffset = new Vector(this.parentToolbar.padding + this.index * (this.width + this.parentToolbar.padding),
                                        this.parentToolbar.padding).add(this.parentToolbar.pos);
    }
}