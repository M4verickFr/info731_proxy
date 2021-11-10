// Import of net module
const net = require("net");
const server = net.createServer();

// Import of RSA module
const fs = require('fs');
const NodeRSA = require('node-rsa');

const keysFolder = "keys";
const serverProxyPrivateKey = new NodeRSA(fs.readFileSync(keysFolder+"/serverProxy.private", 'utf-8'));
const clientProxyPublicKey = new NodeRSA(fs.readFileSync(keysFolder+"/clientProxy.public", 'utf-8'));

server.on("connection", (proxyClientToProxyServerSocket) => {
    console.log("Client connected to proxy");
    proxyClientToProxyServerSocket.once("data", (encryptedData) => {
        let data = clientProxyPublicKey.decryptPublic(encryptedData);

        let isTLSConnection = data.toString().indexOf("CONNECT") !== -1;

        let serverPort = 80;
        let serverAddress;
        console.log(data.toString());
        if (isTLSConnection) {
            serverPort = 443;
            serverAddress = data
                .toString()
                .split("CONNECT")[1]
                .split(" ")[1]
                .split(":")[0];
        } else {
            serverAddress = data.toString().split("Host: ")[1].split("\r\n")[0];
        }

        // Creating a connection from proxy to destination server
        let proxyServerToServerSocket = net.createConnection(
            {
                host: serverAddress,
                port: serverPort,
            },
            () => {
                console.log("Proxy to server set up");
            }
        );

        if (isTLSConnection) {
            let message = "HTTP/1.1 200 OK\r\n\r\n";
            let encryptedMessage = serverProxyPrivateKey.encryptPrivate(message);
            proxyClientToProxyServerSocket.write(encryptedMessage);
        } else {
            proxyServerToServerSocket.write(data);
        }

        proxyServerToServerSocket.on("data", (data) => {
            let encryptedData = serverProxyPrivateKey.encryptPrivate(data);
            proxyClientToProxyServerSocket.write(encryptedData)
        });
        proxyServerToServerSocket.on('end', proxyServerToServerSocket.end);

        proxyClientToProxyServerSocket.on("data", (encryptedData) => {
            let data = clientProxyPublicKey.decryptPublic(encryptedData);
            proxyServerToServerSocket.write(data)
        });
        proxyClientToProxyServerSocket.on('end', proxyClientToProxyServerSocket.end);

        proxyServerToServerSocket.on("error", (err) => {
            console.log("Proxy to server error");
            console.log(err);
        });

        proxyClientToProxyServerSocket.on("error", (err) => {
            console.log("Client to proxy error");
            console.log(err)
        });
    });
});

server.on("error", (err) => {
    console.log("Some internal server error occurred");
    console.log(err);
});

server.on("close", () => {
    console.log("Client disconnected");
});

server.listen(
    {
        host: "0.0.0.0",
        port: 8081,
    },
    () => {
        console.log("ServerProxy listening on 0.0.0.0:8081");
    }
);