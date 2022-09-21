class Shop {
    constructor(game) {
        this.game = game;
        this.img = document.getElementById("shop");
        this.spiteWidth = 118;
        this.spriteHeight = 128;
        this.scale = 1.5;
        this.width = 118 * this.scale;
        this.height = 128 * this.scale;
        this.x = this.game.width / 2 - this.width / 2;
        this.y = this.game.height - this.game.groundMargin - this.height;
        this.frameX = 0;
        this.maxFrame = 5;
        this.timer = 0;
        this.fps = 20;
        this.interval = 1000 / this.fps;
    }

    draw() {
        this.game.ctx.drawImage(
            this.img,
            this.frameX * this.spiteWidth,
            0,
            this.spiteWidth,
            this.spriteHeight,
            this.x,
            this.y,
            this.width,
            this.height
        );
    }

    update() {
        if (this.timer > this.interval) {
            this.frameX < this.maxFrame ? this.frameX++ : (this.frameX = 0);
            this.timer = 0;
        } else {
            this.timer += this.game.deltaTime;
        }
    }
}

export default class Background {
    constructor(game) {
        this.game = game;
        this.img = document.getElementById("bg");
        this.x = 0;
        this.y = 0;
        this.width = this.game.width;
        this.height = this.game.height;

        this.shop = new Shop(this.game);
    }
    draw() {
        this.game.ctx.drawImage(
            this.img,
            this.x,
            this.y,
            this.width,
            this.height
        );
        this.shop.draw();
    }

    update() {
        this.shop.update();
    }
}
