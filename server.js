// const express = require("express");

// const fabObj = require("./math-logic/fibonacci-series.js");

// const app = express();
// // http://localhost:3000?number=10
// app.get("/", (request, response) => {
//     let number = fabObj.calculateFibonacciValue(Number.parseInt(request.query.number));
//     response.send(`<h1>${number}</h1>`);
// });

// app.listen(3000, () => console.log("Express App is running on PORT : 3000"));

// // All process will  share same port when runbnning in cluster


// cluster module


const express = require("express");
const cluster = require("cluster");  // inbuilt module
const totalCPUs = require('os').cpus().length; /// to calculate number of cpu's

const fabObj = require("./math-logic/fibonacci-series");
if (cluster.isMaster) {
    
    console.log(`Total Number of CPU Counts is ${totalCPUs}`);

    for (var i = 0; i < totalCPUs; i++) {
        cluster.fork();
    }
    cluster.on("online", worker => {
        console.log(`Worker Id is ${worker.id} and PID is ${worker.process.pid}`);
    });
    cluster.on("exit", worker => {
        console.log(`Worker Id ${worker.id} and PID is ${worker.process.pid} is offline`);
        console.log("Let's fork new worker!");
        cluster.fork();
    });
}
else {
    const app = express();
    app.get("/", (request, response) => {
        console.log(`Worker Process Id - ${cluster.worker.process.pid} has accepted the request!`);
        let number = fabObj.calculateFibonacciValue(Number.parseInt(request.query.number));
        response.send(`<h1>${number}</h1>`);
    });

    app.listen(3000, () => console.log("Express App is running on PORT : 3000"));
}



//pm2 commands
// pm2 start ecosystem.config.js
// pm2 monit
// pm2 list
// pm2 stop all
// pm2 delete all
// loadtest -n 10000 -c 100 --rps 100 http://localhost:3000?number=20