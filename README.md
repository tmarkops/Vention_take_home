<h1>Server Architecture</h1>
The Pendulum Server follows a master-worker architecture. This architecture involves a master process that manages multiple worker processes, each responsible for running an instance of the pendulum server on a different port (3001-3005).
<br>
<h3>Master Process</h3>
The master process (running on port 3000) is the main controlling entity responsible for:

<h3>Forking Worker Processes:</h3> The master process spawns multiple worker processes using the cluster.fork() method. Each worker process will independently handle an instance of the pendulum server.

<h3>Handling Worker Failures:</h3> The master process monitors the worker processes and respawns them if they crash or exit unexpectedly, ensuring the desired number of worker processes is maintained.

<h3>Worker Processes</h3>
Each worker process runs an isolated instance of the pendulum server, handling incoming HTTP requests on its assigned port. They are independent of each other, and any request received by a worker is processed locally by that worker.

<h3>In-Memory Data Store</h3>
The server maintains an in-memory data store to keep track of the pendulum's parameters and state. The initial parameters are set to a default configuration and can be modified through API endpoints.

<h3>Simulation and Motion Update</h3>
The server periodically updates the pendulum's state using the Euler method. The simulation takes place every 100ms, and the motion update occurs only when the pendulum is not paused.

<h1>Endpoints</h1>
<br>
<strong>GET /pendulum:</strong>

<ul>
<li>Description: Retrieves the current state of the pendulum.<br></li>
<li>Response:<br>
angle: Current angle (in degrees) of the pendulum from the vertical position.<br>
angularVelocity: Current angular velocity (in degrees per second) of the pendulum.<br>
isPaused: A boolean indicating whether the pendulum simulation is paused or not.<br></li>
</ul>

<strong>POST /pendulum:</strong> 
<br>
<ul>
<li>Description: Sets the parameters for the pendulum simulation and initializes its state.<br></li>
<li>Request Body:<br>
initialAngularOffset: Initial angle (in degrees) from the vertical position for the pendulum.<br>
mass: Mass (in kg) of the pendulum's bob.<br>
stringLength: Length (in meters) of the pendulum's string.<br>
isPaused: A boolean indicating whether the pendulum simulation should be paused.<br>
Response: A message indicating the successful setting of pendulum parameters.</li>
</ul>

<h1>Usage</h1>
To run the Pendulum Simulator Server, execute the following commands:<br>
1. npm install (install the required dependencies)<br>
2. npm start (start the server and boot the worker processes)<br>
3. http-server (start frontend server)