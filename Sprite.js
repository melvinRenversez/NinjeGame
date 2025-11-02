class Sprite {
    constructor(position, imageSrc, scale = 1, offset = { x: 0, y: 0 }) {

        this.position = position;

        this.image = new Image()
        this.image.src = imageSrc

        this.scale = scale;
        this.offset = offset

    }


    draw() {
        ctx.drawImage(
            this.image,
            this.position.x + this.offset.x,
            this.position.y + this.offset.y,
        
            this.image.width * this.scale,
            this.image.height * this.scale
        )
    }


    update() {
        this.draw()
    }
}