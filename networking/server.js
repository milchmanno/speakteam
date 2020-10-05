'use strict';

const net = require("net");

const PORT = 10000;
const HOST = "localhost";

class Server {
    constructor(port, address) {
        this.port = port || PORT;
        this.address = address || HOST;
        this.init();
        this.sockets = [];
    }

    init() {
        let server = this;
        let onClientConnected = (socket) => {

            socket.on("data", (data) => {
                if (data.toString() == "init")
                    this.sockets.push(socket);
                else {
                    socket.write(data);
                    console.log(String(data));
                }
            })

            socket.on("end", function () {
                console.log("connection closed by " + socket);
            })

            socket.on("error", (err) => {
                console.log(`error: ${err}`);
            })
        }

        server.connection = net.createServer(onClientConnected);
        server.connection.listen(PORT, HOST, function () {
            console.log(`Server startet at: ${HOST}:${PORT}`);
        })
    }

    broadcast(message, sender) {
        this.sockets.forEach(function (socket) {
            if (socket === sender) return;
            socket.write(message);
        })
    }
}

module.exports = Server;