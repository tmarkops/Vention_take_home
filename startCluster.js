const cluster = require('cluster');
const app = require('./app'); 
const cors = require('cors'); 

//middleware
app.use(cors());

const numPendulums = 5;

// Function to start a new instance of the pendulum server with a specific port
function startServerInstance(port) {
  const worker = cluster.fork({ PORT: port });
  console.log(`Pendulum server instance ${worker.id} started on PID ${worker.process.pid} and port ${port}`);
}

// Check if the current process is the master process
if (cluster.isMaster) {
  console.log(`Master process ${process.pid} is running`);

  let startingPort = 3001;

  // Fork workers (5 instances)
  for (let i = 0; i < numPendulums; i++) {
    const port = startingPort + i;
    startServerInstance(port);
  }

  // Listen for the 'exit' event to respawn the crashed workers
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    const port = worker.process.env.PORT;
    startServerInstance(port);
  });
} else {
  // Each worker runs an instance of the pendulum server on its assigned port
  const port = parseInt(process.env.PORT, 10) || 3000;
  app.listen(port, () => {
    console.log(`Pendulum server listening on port ${port}`);
  });
}
