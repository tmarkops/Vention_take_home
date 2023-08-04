const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); 

const app = express();
const port = process.env.PORT || 3000; // Use the PORT environment variable if available, or default to 3000

// Middleware
app.use(bodyParser.json());
app.use(cors());


// In-memory data store for pendulum parameters and state
let pendulumParams = {
  angularOffset: 70,
  mass: 1,
  stringLength: 1,
};

let pendulumState = {
  angle: pendulumParams.angularOffset,
  angularVelocity: 0,
  isPaused : true
};

// Euler method for numerical integration
function updatePendulumState(deltaTime) {
  const { stringLength } = pendulumParams;

  // Calculate angular acceleration (alpha) using the formula: alpha = -(g / stringLength) * sin(angle)
  const alpha = -(9.81 / stringLength) * Math.sin(pendulumState.angle*Math.PI/180);

  // Update angular velocity and angle using Euler integration
  pendulumState.angularVelocity += alpha * deltaTime;
  pendulumState.angle += pendulumState.angularVelocity * deltaTime *180/Math.PI;
}



app.get('/pendulum', (req, res) => {
  res.json({
    angle: pendulumState.angle,
    angularVelocity: pendulumState.angularVelocity,
    isPaused: pendulumState.isPaused
  });
});

app.post('/pendulum', (req, res) => {
  const { angularOffset, mass, stringLength, isPaused } = req.body;

  if (typeof angularOffset !== 'number' || typeof mass !== 'number' || typeof stringLength !== 'number' || typeof isPaused != 'boolean') {
    res.status(400).json({ error: 'Invalid parameters.' });
    return;
  }

  // update current pendulum parameters and state
  pendulumParams = {
    angularOffset,
    mass,
    stringLength
  };

  pendulumState = {
    angle: angularOffset,
    angularVelocity: 0,
    isPaused: isPaused
  };

  res.json({ message: 'Pendulum parameters set successfully.' });
});

// Simulate the pendulum's motion every 100ms
setInterval(() => {
  if (pendulumState.isPaused===false){ // only update the state when the pendulum is swinging
    const deltaTime = 0.1; // 100ms 
    updatePendulumState(deltaTime);
  }
}, 100);

module.exports = app; 
