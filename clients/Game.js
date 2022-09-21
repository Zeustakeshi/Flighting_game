/**@type {HTMLCanvasElement} */

import Background from "./Bg.js";
import { Player1, Player2 } from "./Fighter.js";
import HealthBar from "./HealthBar.js";
import InputHandler from "./InputHandler.js";

class Game {
    constructor(socket) {
        this.canvas = document.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.width = this.canvas.width = 1024;
        this.height = this.canvas.height = 500;
        this.socket = socket;
        this.groundMargin = 80;
        this.deltaTime = 0;
        this.debugger = false;

        this.gameOver = false;
        this.gameCounter = 120;
        this.playerWin;

        this.player1 = new Player1(this);
        this.player2 = new Player2(this);
        this.input = new InputHandler(this);
        this.bg = new Background(this);
        this.healthBar = new HealthBar(this);

        this.audio = audio;

        this.fullScreenButton = document.getElementById("fullscreen");

        this.fullScreenButton.addEventListener("click", () => {
            this.toggleFullScreen();
            this.audio.play();
            this.audio.addEventListener("ended", () => {
                this.audio.play();
            });
        });

        this.update(0);
    }

    draw() {
        this.bg.draw();
        this.player1.draw();
        this.player2.draw();
        this.healthBar.draw();
    }

    #lastTime = 0;
    update(timeStamp) {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.deltaTime = timeStamp - this.#lastTime;
        this.#lastTime = timeStamp;
        this.healthBar.update();
        this.bg.update();
        this.player1.update();
        this.player2.update();

        this.draw();

        if (!this.gameOver) {
            window.requestAnimationFrame(this.update.bind(this));
        } else {
            this.onGameOver();
        }
    }

    onCollide(object1, object2) {
        return (
            object1.x <= object2.x &&
            object1.x >= object2.x - object1.width &&
            object1.y <= object2.y &&
            object1.y >= object2.y - object1.height
        );
    }

    onGameOver() {
        this.ctx.save();
        this.ctx.fillStyle = "#fee2e2";
        this.ctx.fillRect(
            this.width / 2 - 250,
            this.height / 2 - 125,
            500,
            250
        );
        this.ctx.fillStyle = "#0f172a";
        this.ctx.textAlign = "center";
        this.ctx.font = "600 40px serif";
        this.ctx.fillText(this.playerWin, this.width / 2, this.height / 2);
        this.ctx.font = "600 20px serif";

        this.ctx.fillText(
            "press SPACE to restart!",
            this.width / 2,
            this.height / 2 + 50
        );
        this.ctx.restore();
    }

    onReStart() {
        this.gameOver = false;
        this.gameCounter = 120;
        this.playerWin = "";
        this.#lastTime = 0;
        this.player1.onReStart();
        this.player2.onReStart();
        this.healthBar.onReStart();
        this.update(0);
    }

    toggleFullScreen() {
        if (!document.fullscreenElement) {
            this.canvas.requestFullscreen().catch((err) => {
                alert(`Error , can't enable full-screen mode: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    }
}

window.addEventListener("load", () => {
    const socket = io();
    const game = new Game(socket);

    function makeid(length) {
        let result = "";
        const characters =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(
                Math.floor(Math.random() * charactersLength)
            );
        }
        return result;
    }

    const roomId = makeid(5);

    socket.emit("join_room", roomId, "mainScreen");
    roomid.innerText = `Room: ${roomId} `;
    socket.on("notification", (userName, noti) => {
        alert(userName + ": " + noti);
    });

    socket.on("update_usernames", (room) => {
        p1.innerText = room.includes("player1")
            ? `Player1: connected`
            : "Player1: not found";
        p2.innerText = room.includes("player2")
            ? `Player2: connected`
            : "Player2: not found";
    });
});
