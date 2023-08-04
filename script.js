// Function to control each pendulum animation. This will be called 5 times.
function controlAnimation(apiUrl, curPenId) {
    const controlButton = document.getElementById(`controlButton${curPenId}`);
    const ANIMATION_INTERVAL = 100; // The interval (in milliseconds) to update the pendulum animation
    let currentAngle = 70; // starting angle, consistent with initialAngle in backend 
    let isPaused = true; 

    controlButton.addEventListener('click', () => {
        if (isPaused) {
            updatePendulum(false);
            controlButton.textContent = 'Pause';
        } else {
            updatePendulum(true);
            controlButton.textContent = 'Start';
        }
        isPaused = !isPaused;
    });

    // Fetch and display the initial pendulum state on page load
    updatePendulumAnimation();

    // Add event listener for the string length slider
    const stringLengthSlider = document.getElementById(`stringLength${curPenId}`);
    stringLengthSlider.addEventListener('input', () => {
        isPaused = true;
        controlButton.textContent = 'Start';
        updatePendulum(true);
        updatePendulumAnimation();

    });

    // Add event listener for the mass slider
    const massSlider = document.getElementById(`mass${curPenId}`);
    massSlider.addEventListener('input', () => {
        isPaused = true;
        controlButton.textContent = 'Start';
        updatePendulum(true);
        updatePendulumAnimation();

    });

    // Add event listener for the angle slider
    const angleSlider = document.getElementById(`angle${curPenId}`);
    angleSlider.addEventListener('input', (event) => {
        isPaused = true;
        controlButton.textContent = 'Start';
        currentAngle = -(event.target.value);
        updatePendulum(true);
    });

    // function to get current pendulum state from API (source of truth)
    function fetchPendulumState() {
        try {
            return fetch(apiUrl)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok.');
                    }
                    return response.json();
                })
                .catch(error => {
                    console.error('Error fetching pendulum state:', error);
                    return null;
                });
        } catch (error) {
            console.error('Error fetching pendulum state:', error);
            return null;
        }
    }

    // function to update the animation of the pendulum in the UI
    async function updatePendulumAnimation() {
        const data = await fetchPendulumState();

        if (data) {
            const { angle } = data; 
            const pendulum = document.querySelector(`.pendulum${curPenId}`);
            const ball = document.querySelector(`.ball${curPenId}`);
            currentAngle = angle;

            pendulum.style.transform = `rotate(${currentAngle}deg)`; // Update the rotation using currentAngle

            // Get the width and height of the ball element
            const ballWidth = parseFloat(window.getComputedStyle(ball).getPropertyValue('width'));
            const ballHeight = parseFloat(window.getComputedStyle(ball).getPropertyValue('height'));

            // Get the height of the pendulum element
            const pendulumHeight = parseFloat(window.getComputedStyle(pendulum).getPropertyValue('height'));

            // Calculate the offset needed for centering the ball horizontally
            const ballOffset = ballWidth / 2;
            const ballTopOffset = pendulumHeight - parseFloat(getComputedStyle(ball).getPropertyValue('--ball-height'));

            ball.style.transform = `translate(-${ballOffset}px, ${ballTopOffset}px) rotate(${-angle}deg)`;
            const angleSlider = document.getElementById(`angle${curPenId}`);
            angleSlider.value = -currentAngle;

        }
    }

    // function to update the pendulum backend. Critical for the sliders' buttons' functionality
    function updatePendulum(isPaused) {
        const stringLength = parseFloat(document.getElementById(`stringLength${curPenId}`).value);
        const mass = parseFloat(document.getElementById(`mass${curPenId}`).value);
        const sliderAngleValue = -parseFloat(document.getElementById(`angle${curPenId}`).value);

        const requestBody = {
            initialAngularOffset: parseFloat(currentAngle),
            mass,
            stringLength: stringLength / 15, // scaleing the stringLength in pixels to have faster swinging => better UX
            isPaused: isPaused
        };

        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok.');
                }
                // Update the pendulum's height after the API call
                const pendulum = document.querySelector(`.pendulum${curPenId}`);
                pendulum.style.height = `${stringLength}px`;

                // Update the ball's width, height, and mass after the API call
                const ball = document.querySelector(`.ball${curPenId}`);
                ball.style.width = `${mass}px`;
                ball.style.height = `${mass}px`;

                if (!isPaused) {
                    // Update the pendulum's current angle to the value on the angleSlider
                    currentAngle = sliderAngleValue;
                } else {
                    // When paused, update the pendulum's rotation without any animation
                    pendulum.style.transform = `rotate(${currentAngle}deg)`;
                    pendulum.style.animation = 'none';
                }
            })
            .catch((error) => {
                console.error('Error updating pendulum parameters:', error);
            });
    }
    
    // if not paused: update the pendulum animation (UI) every ANIMATION_INTERVAL duration 
    setInterval(()=>{
        if (!isPaused){
           updatePendulumAnimation();
        }
    },ANIMATION_INTERVAL);
}

// create 5 pendulums, each making calls to their respective API process
for (let i = 1; i <= 5; i++) {
    const apiUrl = `http://localhost:300${i}/pendulum`;
    controlAnimation(apiUrl, i);
}


















