'use strict';

const net = require("net");

const PORT = 10000;
const HOST = "localhost";

class Client {
    constructor(port, address) {
        this.socket = new net.Socket();
        this.address = address || HOST;
        this.port = port || PORT;
        this.init();
        this.reconnecting = true;
    }

    init() {
        var client = this;

        client.socket.connect(client.port, client.address, () => {
            console.log(`Connected to ${client.address}:${client.port}`);
            client.socket.setMaxListeners(0);
            client.socket.write("init");
        });

        client.socket.setKeepAlive(true);

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

module.exports = Client;