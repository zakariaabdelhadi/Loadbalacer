import express from "express";
// https://nodejs.org/api/process.html#processargv
//https://www.knowledgehut.com/blog/web-development/nodejs-process
import { argv } from "process";
import queue from "async/queue.js";

const app = express();
const PORT = getPortFromArguments();




// Initiate queue object
const q = queue((task, callback) => {
    console.log('Handling task:', task);
    let duration = Math.floor(Math.random() * 1000);
    busyLoop(task, callback, duration);
}, 1);
q.buffer = 10;

// Function to extract the server port from the process arguments

function getPortFromArguments() {
    if (argv.length < 3) {
        throw Error("Missing Port");
    }
    return parseInt(argv[2]);
}
// Pushes request to queue, if the queue isn't full
function addToQueue(req, res, next) {
    if (q.length() >= q.buffer) {
        res.status(503).send('Server is busy please try again later');
        return;
    }

    q.push({ num: parseInt(req.query.num) }, (err, result) => {
        if (err) {
            res.send(500).send('Error processing request');
        } else {
            res.send('Result: ' + result);
        }
    })
}

// Functions to keep the CPU busy by calculating matrices

// returns a random matrix with the dimensions rows*colls
function randomMatrix(rows, colls) {
    return Array(rows).fill().map(() => Array(colls).fill().map(() => Math.random()));
}

// generates new matrices to multiply, as long as the duration isn't elapsed
function busyLoop(task, callback, duration) {
    const start = Date.now();
    while (Date.now() - start < duration) {
        const m1 = randomMatrix(3, 3);
        const m2 = randomMatrix(3, 3);
        multiplyMatrices(m1, m2);
    }
    const elapsed = Date.now() - start;
    callback(null, elapsed);
}

// returns the product of the matrices m1 and m2
function multiplyMatrices(m1, m2) {
    const result = [];
    for (let i = 0; i < m1.length; i++) {
        result[i] = [];
        for (let j = 0; j < m2[0].length; j++) {
            let sum = 0;
            for (let k = 0; k < m1[0].length; k++) {
                sum += m1[i][k] * m2[k][j];
            }
            result[i][j] = sum;
        }
    }
    return result;
}

// Add a route to the sever, to listen to requests
app.get('/', addToQueue, (req, res) => {
});

app.get('/monitor', (_, res) => {
    res.status(200).send(`${q.length()}`);
});
app.get('/greet', (_, res) => {
    res.status(200).send(` Hallo aus dem Server ${argv[2]} `);
    console.log(` Hallo aus dem Server ${argv[2]} `);
});
// Start the server
app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
