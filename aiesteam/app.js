const express = require('express')
// const bodyParser = require('body-parser')
const url = require('url');
const app = express()


const dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT;

const cluster = require("cluster");
const totalCPUs = require("os").cpus().length;
 
if (cluster.isMaster) {
  console.log(`Number of CPUs is ${totalCPUs}`);
  console.log(`Master ${process.pid} is running`);
 
  // Fork workers.
  for (let i = 0; i < totalCPUs; i++) {
    cluster.fork();
  }
 
  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
    console.log("Let's fork another worker!");
    cluster.fork();
  });
}

else {
// Adding CORS 
const cors = require('cors')

app.use(cors({
  origin: '*'
}));
app.use(cors({
  methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']
}));

// END CORS



// middleware DONOT CHANGE THIS
app.use(express.json());
// app.use(express.urlencoded());
var routes = require('./routes');
var Deferred = require('Deferred');
// var config = require("./config");


const global = {}

// app.use(bodyParser.json())
// app.use(
//   bodyParser.urlencoded({
//     extended: true,
//   })
// )


// Added these 2 lines to avoid using body-parser
app.use(
  express.urlencoded({
    extended: true,
  })
);




app.use(express.static('/'));



app.all('*', routes);



app.listen(port, () => {
  console.log(`AIES runs on port ${port}. Worker ${process.pid} started`)
})
}