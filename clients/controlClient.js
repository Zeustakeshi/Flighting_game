class Control {
    constructor(socket) {
        this.socket = socket;
        this.btnUp = document.getElementById("up");
        this.btnDown = document.getElementById("down");
        this.btnLeft = document.getElementById("left");
        this.btnRight = document.getElementById("right");
        this.btnAtk = document.getElementById("atk");

        this.controls = [];
        this.listenEventBtnTouch(this.btnUp, "up");
        this.listenEventBtnTouch(this.btnDown, "down");
        this.listenEventBtnTouch(this.btnLeft, "left");
        this.listenEventBtnTouch(this.btnRight, "right");
        this.listenEventBtnTouch(this.btnAtk, "atk");
    }

    listenEventBtnTouch(element, name) {
        this.lastKey = "";

        element.addEventListener("touchstart", () => {
            this.lastKey = `PRESS ${name}`;
            this.socket.emit(`control`, this.lastKey);
        });

        element.addEventListener("touchend", () => {
            this.lastKey = `RELEASE ${name}`;
            this.socket.emit(`control`, this.lastKey);
        });
    }
}

window.addEventListener("load", () => {
    const socket = io();

    const form = document.getElementById("form");
    const input = form.querySelector("input");
    const select = form.querySelector("select");

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        if (input.value.trim()) {
            socket.emit("join_room", input.value, select.value);
        }
    });

    socket.on("notification", (userName, noti) => {
        alert(userName + ": " + noti);
    });

    const c = new Control(socket);
});
