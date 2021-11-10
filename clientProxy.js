// Import of net module
const net = require("net");
const server = net.createServer();

// Import of RSA module
const fs = require('fs');
const NodeRSA = require('node-rsa');

const keysFolder = "keys";
const clientProxyPrivateKey = new NodeRSA(fs.readFileSync(keysFolder+"/clientProxy.private", 'utf-8'));
const serverProxyPublicKey = new NodeRSA(fs.readFileSync(keysFolder+"/serverProxy.public", 'utf-8'));

server.on("connection", (clientToClientProxySocket) => {
    console.log("Client connected to proxy");
    clientToClientProxySocket.once("data", (data) => {
        let proxyServerAddress = "127.0.0.1";
        let proxyServerPort = 8081;

        // Creating a connection from client proxy to server proxy
        let proxyClientToProxyServerSocket = net.createConnection(
            {
                host: proxyServerAddress,
                port: proxyServerPort,
            },
            () => {
                console.log("Proxy Client to Proxy Server set up");
            }
        );

        let encryptedData = clientProxyPrivateKey.encryptPrivate(data)
        proxyClientToProxyServerSocket.write(encryptedData);

        proxyClientToProxyServerSocket.on("data", (encryptedData) => {
            let data = serverProxyPublicKey.decryptPublic(encryptedData)
            clientToClientProxySocket.write(data)
        });
        proxyClientToProxyServerSocket.on('end', proxyClientToProxyServerSocket.end);

        clientToClientProxySocket.on("data", (data) => {
            let encryptedData = clientProxyPrivateKey.encryptPrivate(data);
            proxyClientToProxyServerSocket.write(encryptedData);
        });
        clientToClientProxySocket.on('end', clientToClientProxySocket.end);

        proxyClientToProxyServerSocket.on("error", (err) => {
            console.log("Proxy to server error");
            console.log(err);
        });

        clientToClientProxySocket.on("error", (err) => {
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
        port: 8080,
    },
    () => {
        console.log("ClientProxy listening on 0.0.0.0:8080");
    }
);