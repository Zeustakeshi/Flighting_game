class Health {
    constructor(game, { post: { x, y }, width, height, angle, healthWidth }) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.angle = angle;
        this.healthWidth = healthWidth / 100;
    }

    draw() {
        this.game.ctx.fillStyle = "#fecaca";
        this.game.ctx.fillRect(this.x, this.y, this.width, this.height);
        this.game.ctx.save();
        this.game.ctx.translate(
            this.x + this.width / 2,
            this.y + this.height / 2
        );
        this.game.ctx.rotate(this.angle * (Math.PI / 180));
        this.game.ctx.translate(
            -(this.x + this.width / 2),
            -(this.y + this.height / 2)
        );
        this.game.ctx.fillStyle = "#dc2626";
        this.game.ctx.fillRect(
            this.x,
            this.y,
            this.width * this.healthWidth,
            this.height
        );
        this.game.ctx.restore();
    }

    update(healthWidth) {
        this.healthWidth = healthWidth;
    }
}

class Timer {
    constructor(game, { post: { x, y }, width, height }) {
        this.game = game;
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.lastSeconds = this.getSeconds();
    }

    getSeconds() {
        const d = new Date();
        return d.getSeconds();
    }

    draw() {
        this.game.ctx.fillStyle = "#fde68a";
        this.game.ctx.lineWidth = 10;
        this.game.ctx.fillRect(this.x, this.y, this.width, this.height);
        this.game.ctx.fillStyle = "#fff";
        this.game.ctx.font = "600 40px serif";
        this.game.ctx.fillText(
            this.game.gameCounter <= 9
                ? "0" + this.game.gameCounter
                : this.game.gameCounter,
            this.x + this.width / 2 - this.width / 6,
            this.y + 40,
            this.width / 3
        );
        this.game.ctx.fillStyle = "#000";
        this.game.ctx.fillText(
            this.game.gameCounter <= 9
                ? "0" + this.game.gameCounter
                : this.game.gameCounter,
            this.x + this.width / 2 - this.width / 6 + 3,
            this.y + 40 + 3,
            this.width / 3
        );
    }

    update() {
        if (
            this.lastSeconds !== this.getSeconds() &&
            this.game.gameCounter > 0
        ) {
            this.game.gameCounter--;
            this.lastSeconds = this.getSeconds();
        }
        if (this.game.gameCounter < 0) {
            this.game.gameCounter = 20;
        }
    }
}

export default class HealthBar {
    constructor(game) {
        this.game = game;
        this.width = this.game.width * 0.8;
        this.height = 60;
        this.x = this.game.width / 2 - this.width / 2;
        this.y = 10;
        this.timeWidth = 120;

        this.player1Health = 100;
        this.player2Health = 100;

        this.healthPlayer1 = new Health(this.game, {
            post: { x: this.x, y: this.y },
            width: this.width / 2 - this.timeWidth / 2,
            height: this.height / 2,
            angle: 180,
            healthWidth: this.player1Health,
        });

        this.time = new Timer(this.game, {
            post: { x: this.x + this.healthPlayer1.width, y: this.y },
            width: this.timeWidth,
            height: this.height,
        });
        this.healthPlayer2 = new Health(this.game, {
            post: {
                x: this.x + this.healthPlayer1.width + this.time.width,
                y: this.y,
            },
            width: this.width / 2 - this.timeWidth / 2,
            height: this.height / 2,
            angle: 0,
            healthWidth: this.player2Health,
        });
    }

    draw() {
        this.healthPlayer1.draw();
        this.healthPlayer2.draw();
        this.time.draw();
    }

    update() {
        this.time.update();
        this.healthPlayer1.update(this.player1Health / 100);
        this.healthPlayer2.update(this.player2Health / 100);

        if (this.player1Health <= 0) {
            this.game.playerWin = "PLAYER 2 WIN!";
            this.game.player1.setState(8);
            setTimeout(() => {
                this.game.gameOver = true;
            }, 450);
        } else if (this.player2Health <= 0) {
            this.game.playerWin = "PLAYER 1 WIN!";
            this.game.player2.setState(8);
            setTimeout(() => {
                this.game.gameOver = true;
            }, 280);
        } else if (this.game.gameCounter <= 0) {
            if (this.player1Health < this.player2Health) {
                this.game.playerWin = "PLAYER 2 WIN!";
            } else if (this.player2Health < this.player1Health) {
                this.game.playerWin = "PLAYER 1 WIN!";
            } else {
                this.game.playerWin = "THIS GAME IS DRAW!";
            }
            this.game.gameOver = true;
        }
    }

    onReStart() {
        this.player1Health = 100;
        this.player2Health = 100;
    }
}
