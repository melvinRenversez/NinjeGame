class Sprite {
    constructor({position, imageSrc, scale = 1, offset = { x: 0, y: 0 }, framesMax = 1, speed, direction = 1}) {

        this.position = position;

        this.image = new Image()
        this.image.src = imageSrc

        this.scale = scale;
        this.offset = offset

        this.width = this.image.width / framesMax 
        this.height = this.image.height

        this.speed = speed

        this.currentFrame = 1
        this.framesElapsed = 0
        this.framesMax = framesMax

        this.direction = direction

        this.deadAnimation = false
        this.deadAnimationPlayed = false

    }


    draw() {
    this.framesElapsed++;

    // console.log(this.deadAnimationPlayed, this.currentFrame, this.framesMax, this.deadAnimation)

    if (!this.deadAnimationPlayed){
        this.currentFrame = Math.floor((this.framesElapsed / this.speed) % this.framesMax);
    }

    if (this.deadAnimation && this.currentFrame == this.framesMax - 1) {
        this.deadAnimationPlayed = true;
    }

    ctx.save(); // On sauvegarde le contexte pour pouvoir revenir après

    if (this.direction === -1) {
        // Si on regarde à gauche, on inverse horizontalement
        ctx.scale(-1, 1);
        // On doit décaler la position car le dessin est inversé
        ctx.drawImage(
            this.image,
            this.currentFrame * this.width,
            0,
            this.width,
            this.height,
            - (this.position.x - this.offset.x + this.width * this.scale), // note le signe -
            this.position.y - this.offset.y,
            this.width * this.scale,
            this.height * this.scale
        );
    } else {
        // Si on regarde à droite, on dessine normalement
        ctx.drawImage(
            this.image,
            this.currentFrame * this.width,
            0,
            this.width,
            this.height,
            this.position.x - this.offset.x,
            this.position.y - this.offset.y,
            this.width * this.scale,
            this.height * this.scale
        );
    }

    ctx.restore(); // On revient au contexte original
}

    change({imageSrc, scale = 1, offset = { x: 0, y: 0 }, framesMax = 1, speed, direction}) {
        // console.log("Changing sprite to:", imageSrc, scale, offset, framesMax);
        this.image.src = imageSrc;
        this.scale = scale;
        this.offset = offset;
        this.framesMax = framesMax;
        this.speed = speed;
        this.direction = direction
        this.currentFrame = 0
        this.framesElapsed = 0
    }


        changeDirection(direction) {
            this.direction = direction
        }

    setDeadAniamtion(){
        this.deadAnimation = true
    }

    update() {
        this.draw()
    }

    reset() {
        this.currentFrame = 0
        this.framesElapsed = 0
        this.deadAnimation = false
        this.deadAnimationPlayed = false
    }
}