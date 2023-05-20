import httpproxy from 'http-proxy';
import express from 'express';

const app = express();
const proxy = httpproxy.createProxyServer({});
const SERVER_COUNT = 4;
const MAX_PORT = 3004;

const HOST = 'localhost';
const PORT = 3000;
let current_port = 3000;

// Create list of server ports
let servers = [];
for (let i = 1; i <= SERVER_COUNT; i++) {
    servers.push(PORT + i);
}

// Initialize key-value list with server port and connection count
const serverConnections = {};
for (const server of servers) {
    serverConnections[server] = 0;
}


/////////////////////////////////////////////////// put your logic here /////////////////////////////////////////////
// Function to return a random server port
function findBestServer() {
    let modulo = current_port % MAX_PORT + 1;
    if (modulo == 1) {
        current_port = 3001;
        return current_port;
    } else {
        current_port++;
        return modulo;
    }

}
/////////////////////////////////////////////////// put your logic here /////////////////////////////////////////////

app.use('/', (req, res) => {
    let nextWorkerPort = findBestServer();
    console.log(`nextWorkerPort => ${nextWorkerPort}`);

    serverConnections[nextWorkerPort]++;
    proxy.web(req, res, { target: `http://${HOST}:${nextWorkerPort}` });

    res.on('finish', () => {
        serverConnections[nextWorkerPort]--;
    });
});

app.listen(PORT, () => console.log(`Proxy is listening on port ${PORT}`));