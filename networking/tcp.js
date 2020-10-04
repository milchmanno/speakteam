'use strict';

const net = require("net");
const os = require("os");
const crypto = require("crypto");

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

class Client {
    constructor(port, address) {
        this.socket = new net.Socket();
        this.address = address || HOST;
        this.port = port || PORT;
        this.init();
    }

    init() {
        var client = this;

        client.socket.connect(client.port, client.address, () => {
            console.log(`Connected to ${client.address}:${client.port}`);
            client.socket.setMaxListeners(0);
            client.socket.write("init");
        });

        client.socket.on("close", () => {
            client.socket.removeAllListeners();
            console.log("Client closed");
        });
    }

    sendMessage(message) {
        var client = this;
        return new Promise((resolve, reject) => {
            client.socket.write(message);

            client.socket.on("data", (data) => {
                resolve(String(data));
                if (String(data).endsWith("exit")) {
                    client.socket.destroy();
                }
            });

            client.socket.on("timeout", function () {
                console.log("socket timed out");
                socket.end("Timed out!");
            })

            client.socket.on("error", (err) => {
                reject(`Socket error: ${err}`);
            })
        }).catch((err) => {
            console.log(`Promise error: ${err}`)
        });
    }
}

module.exports = {
    Server,
    Client
};