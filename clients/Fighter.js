import { player1Assets, player2Assets } from "./playerAssets.js";
import {
    Atk1,
    Atk2,
    Death,
    Def,
    Fall,
    Idle,
    Jump,
    RunLeft,
    RunRight,
    TakeHit,
} from "./States.js";

class Fighter {
    constructor(game, { width, height }) {
        this.game = game;
        this.imgWidth = 1000;
        this.fighterWidth = 200;
        this.fighterHeight = 200;
        this.scale = 1;
        this.width = width * this.scale;
        this.height = height * this.scale;

        this.offset = {
            x: this.fighterWidth - this.width * 0.5,
            y: this.fighterHeight - this.height * 0.5,
        };

        this.x = 40;
        this.y = this.game.height - this.game.groundMargin - this.height;

        this.speed = 0;
        this.maxSpeed = 4;
        this.vy = 0;
        this.weight = 0.8;
        this.power = 16;
        this.frameX = 0;
        this.frameY = 0;
        this.maxFrame = 7;
        this.timer = 0;
        this.fps = 20;
        this.interval = 1000 / this.fps;

        this.states = [
            new Idle(this),
            new RunLeft(this),
            new RunRight(this),
            new Jump(this),
            new Fall(this),
            new Atk1(this),
            new Atk2(this),
            new TakeHit(this),
            new Death(this),
            new Def(this),
        ];
        this.currentSate = this.states[0];
        this.isAtk = false;
        this.isDef = false;
        this.isTakeHit = false;
    }

    draw() {
        // draw flighter
        this.game.ctx.drawImage(
            this.img,
            this.frameX * this.fighterWidth,
            this.frameY * this.fighterHeight,
            this.fighterWidth,
            this.fighterHeight,
            this.x - this.offset.x,
            this.y - this.offset.y,
            this.width + 2 * this.offset.x,
            this.height + 2 * this.offset.y
        );

        ////////////////////////// debuger //////////////////////////
        if (this.game.debugger) {
            // draw collider box
            this.game.ctx.strokeStyle = "yellow";
            this.game.ctx.lineWidth = 2;
            this.game.ctx.strokeRect(this.x, this.y, this.width, this.height);
            // draw atkBox
            if (this.isAtk) {
                this.game.ctx.strokeStyle = "red";
                this.game.ctx.lineWidth = 2;
                this.game.ctx.strokeRect(
                    this.atkBox.x,
                    this.atkBox.y,
                    this.atkBox.width,
                    this.atkBox.height
                );
            }

            if (this.isDef) {
                this.game.ctx.strokeStyle = "blue";
                this.game.ctx.lineWidth = 2;
                this.game.ctx.strokeRect(
                    this.defBox.x,
                    this.defBox.y,
                    this.defBox.width,
                    this.defBox.height
                );
            }
        }
        ////////////////////////// debuger //////////////////////////
    }

    update() {
        this.x += this.speed;
        this.y += this.vy;

        // sprite animation
        if (this.timer > this.interval) {
            if (this.frameX >= this.maxFrame) {
                this.frameX = 0;
            } else {
                this.frameX++;
            }
            this.timer = 0;
        } else {
            this.timer += this.game.deltaTime;
        }

        if (this.x <= 0) {
            this.x = 0;
        } else if (this.x >= this.game.width - this.width) {
            this.x = this.game.width - this.width;
        }

        if (this.onGround()) {
            this.y = this.game.height - this.height - this.game.groundMargin;
        }
        if (!this.onGround()) {
            this.vy += this.weight;
        }
    }

    setState(state) {
        this.currentSate = this.states[state];
        this.img = this.assets[state].img;
        this.maxFrame = this.assets[state].maxFrame;
        this.currentSate.enter();
    }

    onGround() {
        return (
            this.y >= this.game.height - this.height - this.game.groundMargin
        );
    }

    onReStart() {
        this.offset = {
            x: this.fighterWidth - this.width * 0.5,
            y: this.fighterHeight - this.height * 0.5,
        };

        this.y = this.game.height - this.game.groundMargin - this.height;

        this.speed = 0;
        this.maxSpeed = 4;
        this.vy = 0;
        this.weight = 0.8;
        this.power = 16;
        this.frameX = 0;
        this.frameY = 0;
        this.maxFrame = 7;
        this.timer = 0;
        this.currentSate = this.states[0];
        this.isAtk = false;
        this.isDef = false;
        this.isTakeHit = false;
    }
}

export class Player1 extends Fighter {
    constructor(game) {
        super(game, { width: 60, height: 100 });
        this.img = document.getElementById("fighter1_idle");
        this.assets = player1Assets;

        this.defBox = {
            x: this.x + this.width / 2,
            y: this.y,
            width: this.width / 2,
            height: this.height,
        };

        this.atkBox = {
            x: this.x + this.width + 20,
            y: this.y,
            width: this.width + 20,
            height: this.height * 0.8,
        };
    }

    onReStart() {
        super.onReStart();
        this.img = document.getElementById("fighter1_idle");
        this.x = 40;
    }

    update() {
        super.update();
        this.currentSate.handleInput(this.game.input.lastKey);

        // update collider atkBox
        this.defBox = {
            x: this.x + this.width / 2,
            y: this.y,
            width: this.width / 2,
            height: this.height,
        };
        this.atkBox = {
            x: this.x + this.width + 20,
            y: this.y,
            width: this.width + 20,
            height: this.height * 0.8,
        };

        /// on take hit
        if (
            !this.isDef &&
            this.game.onCollide(this, this.game.player2.atkBox) &&
            this.game.player2.isAtk
        ) {
            this.isTakeHit = true;
            this.game.healthBar.player1Health--;
            this.game.player2.isAtk = false;
        } else {
            this.isTakeHit = false;
        }
    }
}

export class Player2 extends Fighter {
    constructor(game) {
        super(game, { width: 60, height: 100 });
        this.img = document.getElementById("fighter2_idle");
        this.assets = player2Assets;
        this.maxFrame = 3;
        this.x = this.game.width - this.width - 40;

        this.defBox = {
            x: this.x - this.width / 2,
            y: this.y,
            width: this.width / 2,
            height: this.height,
        };

        this.atkBox = {
            x: this.x + this.width + 20,
            y: this.y,
            width: this.width + 20,
            height: this.height * 0.8,
        };
    }

    update() {
        super.update();
        this.currentSate.handleInput(this.game.input.lastKey2);

        // update collider atkBox
        this.defBox = {
            x: this.x - this.width / 2,
            y: this.y,
            width: this.width / 2,
            height: this.height,
        };
        this.atkBox = {
            x: this.x - this.width - 40,
            y: this.y,
            width: this.width + 20,
            height: this.height * 0.8,
        };

        /// on take hit
        if (
            !this.isDef &&
            this.game.onCollide(this.game.player1.atkBox, this) &&
            this.game.player1.isAtk
        ) {
            this.isTakeHit = true;
            this.game.healthBar.player2Health--;
            this.game.player1.isAtk = false;
        } else {
            this.isTakeHit = false;
        }
    }

    onReStart() {
        super.onReStart();
        this.img = document.getElementById("fighter2_idle");
        this.maxFrame = 3;
        this.x = this.game.width - this.width - 40;
    }
}
