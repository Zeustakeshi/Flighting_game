const states = {
    IDLE: 0,
    RUN_LEFT: 1,
    RUN_RIGHT: 2,
    JUMP: 3,
    FALL: 4,
    ATK_1: 5,
    ATK_2: 6,
    TAKE_HIT: 7,
    DEATH: 8,
    DEF: 9,
};

class State {
    constructor(state) {
        this.state = state;
    }
}

export class Idle extends State {
    constructor(player) {
        super("IDLE");
        this.player = player;
    }

    enter() {
        this.player.speed = 0;
    }

    handleInput(input) {
        if (input === "PRESS right") {
            this.player.setState(states.RUN_RIGHT);
        } else if (input === "PRESS left") {
            this.player.setState(states.RUN_LEFT);
        } else if (input === "PRESS up") {
            this.player.setState(states.JUMP);
        } else if (input === "PRESS atk") {
            this.player.setState(states.ATK_1);
        } else if (input === "PRESS down") {
            this.player.setState(states.DEF);
        } else if (!this.player.isDef && this.player.isTakeHit) {
            this.player.setState(states.TAKE_HIT);
        }
    }
}

export class RunLeft extends State {
    constructor(player) {
        super("RUN_LEFT");

        this.player = player;
    }

    enter() {
        this.player.speed = -this.player.maxSpeed;
    }

    handleInput(input) {
        if (input === "RELEASE left") {
            this.player.setState(states.IDLE);
        } else if (input === "PRESS right") {
            this.player.setState(states.RUN_RIGHT);
        } else if (input === "PRESS up") {
            this.player.setState(states.JUMP);
        } else if (input === "PRESS atk") {
            this.player.setState(states.ATK_1);
        } else if (input === "PRESS down") {
            this.player.setState(states.DEF);
        }
    }
}

export class RunRight extends State {
    constructor(player) {
        super("RUN_RIGHT");
        this.player = player;
    }

    enter() {
        this.player.speed = this.player.maxSpeed;
    }

    handleInput(input) {
        if (input === "RELEASE right") {
            this.player.setState(states.IDLE);
        } else if (input === "PRESS left") {
            this.player.setState(states.RUN_LEFT);
        } else if (input === "PRESS up") {
            this.player.setState(states.JUMP);
        } else if (input === "PRESS atk") {
            this.player.setState(states.ATK_1);
        } else if (input === "PRESS down") {
            this.player.setState(states.DEF);
        }
    }
}

export class Jump extends State {
    constructor(player) {
        super("JUMP");
        this.player = player;
    }

    enter() {
        if (this.player.onGround()) {
            this.player.vy = -this.player.power;
        }
    }

    handleInput(input) {
        if (input === "PRESS right") {
            this.player.setState(states.RUN_RIGHT);
        } else if (input === "PRESS left") {
            this.player.setState(states.RUN_LEFT);
        } else if (this.player.vy > 0) {
            this.player.setState(states.FALL);
        } else if (input === "PRESS atk") {
            this.player.setState(states.ATK_2);
        }
    }
}

export class Fall extends State {
    constructor(player) {
        super("FALL");
        this.player = player;
    }

    enter() {}

    handleInput(input) {
        if (this.player.onGround()) {
            this.player.setState(states.IDLE);
        } else if (input === "PRESS atk") {
            this.player.setState(states.ATK_2);
        }
    }
}

export class Atk1 extends State {
    constructor(player) {
        super("ATK_1");
        this.player = player;
    }

    enter() {
        this.player.isAtk = true;
    }

    handleInput(input) {
        if (input === "RELEASE atk") {
            this.player.setState(states.IDLE);
            this.player.isAtk = false;
        } else if (input === "PRESS down") {
            this.player.setState(states.DEF);
        }
    }
}

export class Atk2 extends State {
    constructor(player) {
        super("ATK_2");
        this.player = player;
    }

    enter() {
        this.player.isAtk = true;
    }

    handleInput(input) {
        if (input === "RELEASE atk") {
            this.player.setState(states.IDLE);
            this.player.isAtk = false;
        }
    }
}

export class TakeHit extends State {
    constructor(player) {
        super("TAKE_HIT");
        this.player = player;
    }

    enter() {
        this.player.speed = 0;
    }

    handleInput(input) {
        if (!this.player.isTakeHit) {
            setTimeout(() => {
                this.player.setState(states.IDLE);
            }, 200);
        } else if (input === "PRESS right") {
            this.player.setState(states.RUN_RIGHT);
        } else if (input === "PRESS left") {
            this.player.setState(states.RUN_LEFT);
        } else if (input === "PRESS up") {
            this.player.setState(states.JUMP);
        } else if (input === "PRESS down") {
            this.player.setState(states.DEF);
        } else if (input === "PRESS atk") {
            this.player.setState(states.ATK_2);
        }
    }
}

export class Death extends State {
    constructor(player) {
        super("DEATH");
        this.player = player;
    }

    enter() {}

    handleInput(input) {}
}

export class Def extends State {
    constructor(player) {
        super("DEF");
        this.player = player;
    }

    enter() {
        this.player.speed = 0;
        this.player.isDef = true;
    }

    handleInput(input) {
        if (input === "RELEASE down") {
            this.player.setState(states.IDLE);
            this.player.isDef = false;
        }
    }
}
