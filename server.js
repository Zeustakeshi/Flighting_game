const path = require("path");
const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, function () {
    console.log(`server listening with port ${PORT}`);
});

const { Server } = require("socket.io");
const io = new Server(server);

const htmlPath = path.join(__dirname, "/clients");

app.use(express.static(htmlPath));

app.get("/", (req, res) => {
    console.log(htmlPath);
    res.sendFile(__dirname + "/clients/index.html");
});

app.get("/control", (req, res) => {
    res.sendFile(__dirname + "/clients/control.html");
});

const rooms = {};

io.on("connection", function (socket) {
    console.log("a player connected!!");

    socket.on("isGameOver", (isGameOver) => {
        io.sockets.emit("sever_send_game_over", isGameOver);
    });

    socket.on("control", (control) => {
        io.sockets.emit("sever_send_control", socket.username, control);
    });

    socket.on("join_room", function (room, username) {
        socket.username = username;
        rooms[room] = [...(rooms[room] || [])];
        if (!rooms[room].includes(username)) {
            rooms[room].push(username);

            socket.join(room);

            socket.emit(
                "notification",
                "SERVER",
                `Bạn đã tham gia vào phòng ${room}`
            );

            socket
                .to(room)
                .emit(
                    "notification",
                    "SERVER",
                    `${username} đã tham gia vào phòng ${room}`
                );

            io.sockets.emit("update_usernames", rooms[room]);
        } else if (rooms[room].length > 2) {
            socket.emit("notification", "SERVER", `Phòng này đã đầy!`);
        } else {
            socket.emit(
                "notification",
                "SERVER",
                `Phòng ${room} không tồn tại hoặc người chơi đã được chọn vui lòng thử lại sau !`
            );
        }

        socket.on("disconnect", function () {
            delete rooms[room];
            io.sockets.emit("update_usernames", rooms[room]);
            socket
                .to(room)
                .emit(
                    "notification",
                    "SERVER",
                    `${username} đã rời phòng ${room}`
                );

            console.log("total rooms: " + JSON.stringify(rooms));
        });
    });
});
