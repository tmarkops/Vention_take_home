python -m http.server
npm start

<h1>Server Architecture</h1>
The Pendulum Server follows a master-worker architecture. This architecture involves a master process that manages multiple worker processes, each responsible for running an instance of the pendulum server on a different port (3001-3005).

Master Process
The master process (running on port 3000) is the main controlling entity responsible for:

Forking Worker Processes: The master process spawns multiple worker processes using the cluster.fork() method. Each worker process will independently handle an instance of the pendulum server.

Handling Worker Failures: The master process monitors the worker processes and respawns them if they crash or exit unexpectedly, ensuring the desired number of worker processes is maintained.

Worker Processes
Each worker process runs an isolated instance of the pendulum server, handling incoming HTTP requests on its assigned port. They are independent of each other, and any request received by a worker is processed locally by that worker.

In-Memory Data Store
The server maintains an in-memory data store to keep track of the pendulum's parameters and state. The initial parameters are set to a default configuration and can be modified through API endpoints.

Simulation and Motion Update
The server periodically updates the pendulum's state using the Euler method for numerical integration. The simulation takes place every 100ms, and the motion update occurs only when the pendulum is not paused.

Endpoints
<strong>GET /pendulum:</strong>

Description: Retrieves the current state of the pendulum.
Response:
angle: Current angle (in degrees) of the pendulum from the vertical position.
angularVelocity: Current angular velocity (in degrees per second) of the pendulum.
isPaused: A boolean indicating whether the pendulum simulation is paused or not.

<strong>POST /pendulum:</strong> 
Description: Sets the parameters for the pendulum simulation and initializes its state.
Request Body:
initialAngularOffset: Initial angle (in degrees) from the vertical position for the pendulum.
mass: Mass (in kg) of the pendulum's bob.
stringLength: Length (in meters) of the pendulum's string.
isPaused: A boolean indicating whether the pendulum simulation should be paused.
Response: A message indicating the successful setting of pendulum parameters.

<h1>Usage</h1>
To run the Pendulum Simulator Server, execute the following commands:
1. npm install (install the required dependencies)
2. npm start (start the server and boot the worker processes)
3. http-server (start frontend server)