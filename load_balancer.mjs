import httpproxy from 'http-proxy';
import express from 'express';

const app = express();
const proxy = httpproxy.createProxyServer({});
const SERVER_COUNT = 4;
const MAX_PORT = 3004;
const SERVER_WEIGTH = [4, 2, 1, 1]



const HOST = 'localhost';
const PORT = 3000;
let current_port = 3000;



// Create list of server ports
let servers = {};
for (let i = 1; i <= SERVER_COUNT; i++) {
    servers[PORT + i] = SERVER_WEIGTH[i - 1]; // jedem Server ist ein Gewicht zugeordnet 
}

let serversCopy = servers;

// define the current server with the current number of connections
let kopf = 0;
let counter = 0;

// deleteServerFromQueue(kopf);

// Initialize key-value list with server port and connection count
// diese Variable, ist ein Zeichen, wie viele offene Connexions bei einem Server es gibt !
const serverConnections = {};
for (const server in servers) {
    serverConnections[server] = 0;
}

const serverConnectionsCountDown = {};
for (const server in servers) {
    serverConnections[server] = 0;
}


/////////////////////////////////////////////////// put your logic here /////////////////////////////////////////////
// Function to return a random server port
function findBestServer() {

    if (Object.keys(serversCopy).length === 0) {

        serversCopy = servers;
    }

    if (counter <= 0) {

        [kopf, counter] = findTheMax();
        deleteServerFromQueue(kopf);


    }
    counter--;
    return kopf;

}


function findTheMax() {

    let maxKey = null;
    let maxValue = -Infinity;

    for (const [key, value] of Object.entries(serversCopy)) {
        if (value > maxValue) {
            maxValue = value;
            maxKey = key;
        }
    }

    return [maxKey, maxValue];
}


function deleteServerFromQueue(key) {

    delete serversCopy[key];
    //   console.log(serversCopy);

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