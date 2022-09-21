function debounce(func, timeout = 300) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(this, args);
        }, timeout);
    };
}

export default class InputHandler {
    constructor(game) {
        this.game = game;
        this.lastKey = "";
        this.lastKey2 = "";

        this.game.socket.on("sever_send_control", (playerName, control) => {
            if (playerName === "player1") {
                this.lastKey = control;
            } else if (playerName === "player2") {
                this.lastKey2 = control;
            }
            if (
                (this.lastKey === "PRESS atk" ||
                    this.lastKey2 === "PRESS atk") &&
                this.game.gameOver
            ) {
                this.game.onReStart();
            }
        });

        window.addEventListener("keydown", (e) => {
            switch (e.key) {
                case "k":
                    this.lastKey = "PRESS up";
                    break;
                case "d":
                    this.lastKey = "PRESS right";
                    break;
                case "s":
                    this.lastKey = "PRESS down";
                    break;
                case "a":
                    this.lastKey = "PRESS left";
                    break;
                case "j":
                    if (this.lastKey !== "PRESS atk") {
                        this.lastKey = "PRESS atk";
                    }
                    break;

                /////////////////////////keyboard 2  /////////////////////////
                case "2":
                    this.lastKey2 = "PRESS up";
                    break;
                case "ArrowRight":
                    this.lastKey2 = "PRESS right";
                    break;
                case "ArrowDown":
                    this.lastKey2 = "PRESS down";
                    break;
                case "ArrowLeft":
                    this.lastKey2 = "PRESS left";
                    break;
                case "1":
                    this.lastKey2 = "PRESS atk";
                    break;
                /////////////////////////debugger/////////////////////////
                case "c":
                    this.game.debugger = !this.game.debugger;
                    break;
                case " ":
                    if (this.game.gameOver) {
                        this.game.onReStart();
                    }

                    break;
                default:
                    break;
            }
        });

        window.addEventListener("keyup", (e) => {
            switch (e.key) {
                case "k":
                    this.lastKey = "RELEASE up";
                    break;
                case "d":
                    this.lastKey = "RELEASE right";
                    break;
                case "s":
                    this.lastKey = "RELEASE down";
                    break;
                case "a":
                    this.lastKey = "RELEASE left";
                    break;
                case "j":
                    this.lastKey = "RELEASE atk";
                    setTimeout(() => {}, 200);
                    break;

                /////////////////////////keyboard 2  /////////////////////////
                case "2":
                    this.lastKey2 = "RELEASE up";
                    break;
                case "ArrowRight":
                    this.lastKey2 = "RELEASE right";
                    break;
                case "ArrowDown":
                    this.lastKey2 = "RELEASE down";
                    break;
                case "ArrowLeft":
                    this.lastKey2 = "RELEASE left";
                    break;
                case "1":
                    this.lastKey2 = "RELEASE atk";
                    setTimeout(() => {}, 200);
                    break;

                default:
                    break;
            }
        });
    }
}
