
// the --experimental-modules flag was required to successfully run an ES module in a Node.js environment.
// https://blog.logrocket.com/commonjs-vs-es-modules-node-js/
import { spawn } from "child_process";
import { createInterface } from "readline";
import { exit } from "process";

// Define port and amount of servers
const BASE_PORT = 3001;
const SERVER_COUNT = 8;

// Start server processes and give them their individual port
const processes = [];

for (let i = 0; i < SERVER_COUNT; i++) {
    const port = BASE_PORT + i;
    //https://nodejs.org/api/child_process.html
    // https://www.freecodecamp.org/news/node-js-child-processes-everything-you-need-to-know-e69498fe970a/
    const process = spawn("node", ["./server.mjs", port]); // erzeugt einen neuen Server, das Kommando hier ist "node"
    processes.push(process);
}


// Prepare method to kill all server instances with one key press
const rlInterface = createInterface(process.stdin, process.stdout);

rlInterface.question("Press enter to exit", () => {
    console.log("exiting");
    for (const process of processes) {
        process.kill();
    }
    exit();
});
