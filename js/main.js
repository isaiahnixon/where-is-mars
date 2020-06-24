(function() {
	/*** GLOBAL VARS ***/
	const c = document.getElementById("solar-system");
	const ctx = c.getContext("2d");
	const scrollBtn = document.getElementById("scrollBtn");

	/*** FUNCTIONS ***/
	const getEphemeris = (date = new Date()) => {
		// Instantiate ephemeris.
		return new Ephemeris.default({
		  year: date.getFullYear(),
		  month: (date.getMonth()+1),
		  day: date.getDate(),
		  hours: date.getHours(),
		  minutes: date.getMinutes(),
		  latitude: 41.37,
		  longitude: -71.1,
		  calculateShadows: false
		});
	};

	const updateDisplayedData = (ephemeris) => {
		// Populate heliocentric coordinates.
		$('#mars .x').text(ephemeris.mars.position.rect[0]);
		$('#mars .y').text(ephemeris.mars.position.rect[1]);
		$('#mars .z').text(ephemeris.mars.position.rect[2]);

		$('#earth .x').text(ephemeris.Earth.position.rect[0]);
		$('#earth .y').text(ephemeris.Earth.position.rect[1]);
		$('#earth .z').text(ephemeris.Earth.position.rect[2]);

		// Populate the geocentric distance.
		$('#distance').text(ephemeris.mars.position.geocentricDistance);
	}

	// Source: https://medium.com/better-programming/fun-with-html-canvas-lets-create-a-star-field-a46b0fed5002
	const putPixel = (x, y, brightness) => {
	  	const intensity = brightness * 255;
	  	const rgb = "rgb(" + intensity + "," + intensity + "," + intensity + ")";
	  	ctx.fillStyle = rgb;
	  	ctx.fillRect(x, y, 1, 1);
	};

	// Based on: https://stackoverflow.com/questions/4959975
	const randomWithMax = (max) => {
  		return Math.floor(Math.random() * max) + 1 
	}

	const drawComponents = (ephemeris, stars) => {
		// Make the background.
		ctx.fillStyle = "#222";
		ctx.fillRect(0, 0, c.width, c.height);

		// Draw the stars.
		stars.forEach(star => putPixel(star.x, star.y, star.brightness));

		// Crunch some numbers.
		const min = Math.min(c.height, c.width);

		const mars = {
			distance: Math.sqrt(Math.pow(ephemeris.mars.position.rect[0], 2) + Math.pow(ephemeris.mars.position.rect[1], 2)),
			x: c.width/2 + (min/3 * ephemeris.mars.position.rect[0]),
			y: c.height/2 + (min/3 * ephemeris.mars.position.rect[1])
		};

		const earth = {
			distance: Math.sqrt(Math.pow(ephemeris.Earth.position.rect[0], 2) + Math.pow(ephemeris.Earth.position.rect[1], 2)),
			x: c.width/2 + (min/3 * ephemeris.Earth.position.rect[0]),
			y: c.height/2 + (min/3 * ephemeris.Earth.position.rect[1])
		};

		// Make mars orbit.
		ctx.strokeStyle = "#00FF00";
		ctx.beginPath();
		ctx.arc((c.width/2), (c.height/2), (min/3 * mars.distance), 0, 2 * Math.PI);
		ctx.stroke();

		// Make earth orbit.
		ctx.strokeStyle = "#00FF00";
		ctx.beginPath();
		ctx.arc((c.width/2), (c.height/2), (min/3 * earth.distance), 0, 2 * Math.PI);
		ctx.stroke();

		// Make line between them.
		ctx.strokeStyle = "#9400D3";
		ctx.beginPath();
		ctx.moveTo(earth.x, earth.y);
		ctx.lineTo(mars.x, mars.y);
		ctx.stroke();

		// Make the sun.
		ctx.fillStyle = "#FFAA1D";
		ctx.beginPath();
		ctx.arc((c.width/2), (c.height/2), (min * 0.04), 0, 2 * Math.PI);
		ctx.fill();

		// Make the earth.
		ctx.fillStyle = "#006994";
		ctx.beginPath();
		ctx.arc(earth.x, earth.y, (min * 0.02), 0, 2 * Math.PI);
		ctx.fill();

		// Make mars.
		ctx.fillStyle = "#b7410e";
		ctx.beginPath();
		ctx.arc(mars.x, mars.y, (min * 0.016), 0, 2 * Math.PI);
		ctx.fill();

		// Draw mars caption.
		ctx.font = "bold 12px Arial";
		ctx.fillStyle = '#b7410e';
		ctx.fillText("Mars", (mars.x + min * 0.016), (mars.y - min * 0.016));

		// Draw Earth caption.
		ctx.font = "bold 12px Arial";
		ctx.fillStyle = '#006994';
		ctx.fillText("Earth", (earth.x + min * 0.016), (earth.y - min * 0.016));

		// Draw sun caption.
		ctx.font = "bold 12px Arial";
		ctx.fillStyle = '#FFAA1D';
		ctx.fillText("Sun", (c.width/2 + min * 0.04), (c.height/2 - min * 0.04));		

		// Crunch some more numbers.
		var slope =  (earth.y - mars.y) / (earth.x - mars.x);
		var midpoint = {
			x: (earth.x + mars.x) / 2,
			y: (earth.y + mars.y) / 2,
		};

		// Draw the distance label.
		ctx.save();
		ctx.translate(midpoint.x, midpoint.y);
		ctx.rotate(Math.atan(slope));
		ctx.font = "bold 12px Arial";
		ctx.fillStyle = '#9400D3';
		ctx.fillText(ephemeris.mars.position.geocentricDistance.toFixed(3) + " AU", (min * -0.016), (min * -0.016));
		ctx.restore();

		// Return the animation interval.
		return setInterval(() => {
			// Set the stars to flicker.
			stars.forEach(star => {
				if (Math.random() < 0.025) {
					putPixel(star.x, star.y, Math.random());
				}
			});
		}, 100);
	};

	const setUpCanvas = () => {
		// Feed the size back to the canvas.
		c.width = c.clientWidth;
		c.height = c.clientHeight;
	};

	const generateStars = () => {
		let stars = [];
		for (var i = 0; i < 200; i++) {
			stars[i] = {
				x: randomWithMax(c.width),
				y: randomWithMax(c.height),
				brightness: Math.random()
			};
		}

		return stars;
	}

	const reset = (ephemeris, stars, animationInterval) => {
		// Clear the  canvas.
		ctx.clearRect(0, 0, c.width, c.height);

		// End the old animation.
		clearInterval(animationInterval);

		// Draw it all again.
		setUpCanvas();
		return drawComponents(ephemeris, stars);
	};

	const scrollFunction = () => {
	;  console.log(document.documentElement.scrollTop);
	  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
	    scrollBtn.style.display = "none";
	  } else if (window.matchMedia("(max-width: 700px)").matches) {
	    scrollBtn.style.display = "block";
	  }
	}

	// When the user clicks on the button, scroll to the top of the document
	const scrollToBottom = () => {
	  document.body.scrollTop = document.body.scrollHeight; // For Safari
	  document.documentElement.scrollTop = document.documentElement.scrollHeight; // For Chrome, Firefox, IE and Opera
	}

	/*** RUNTIME CODE ***/
	let ephemeris = getEphemeris();
	updateDisplayedData(ephemeris);
	setUpCanvas();
	let stars = generateStars();
	let animationInterval = drawComponents(ephemeris, stars);
	scrollFunction();
	
	let updateInterval = setInterval(() => {
		// Update ephemeris.
		ephemeris = getEphemeris();
		updateDisplayedData(ephemeris);
		animationInterval = reset(ephemeris, stars, animationInterval);
	}, 60000);

	/** EVENT LISTENERS ***/
	window.addEventListener('resize', () => {
		// Update the stars.
		stars = generateStars();
		animationInterval = reset(ephemeris, stars, animationInterval);
	});

	window.onscroll = function() {scrollFunction()};
	scrollBtn.addEventListener("click", scrollToBottom);

	// Update the ephemeris data based on the input date.
	$('input#date').change(function() {
		const rawDate = $(this).val();
		if (rawDate) {
			clearInterval(updateInterval);
			const dateArray = rawDate.split("-")
			ephemeris = getEphemeris(new Date(dateArray[0], dateArray[1] - 1, dateArray[2]));
			updateDisplayedData(ephemeris);
			animationInterval = reset(ephemeris, stars, animationInterval);
		} else {
			ephemeris = getEphemeris();
			updateDisplayedData(ephemeris);
			animationInterval = reset(ephemeris, stars, animationInterval);
		}
	});
}());