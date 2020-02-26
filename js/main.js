(function() {
	// Get the time and date.
	var now = new Date();

	// Instantiate ephemeris.
	const ephemeris = new Ephemeris.default({
	  year: now.getFullYear(),
	  month: (now.getMonth()+1),
	  day: now.getDate(),
	  hours: now.getHours(),
	  minutes: now.getMinutes(),
	  latitude: 41.37,
	  longitude: -71.1,
	  calculateShadows: false
	});

	// Populate heliocentric coordinates.
	$('#mars .x').text(ephemeris.mars.position.rect[0]);
	$('#mars .y').text(ephemeris.mars.position.rect[1]);
	$('#mars .z').text(ephemeris.mars.position.rect[2]);

	$('#earth .x').text(ephemeris.Earth.position.rect[0]);
	$('#earth .y').text(ephemeris.Earth.position.rect[1]);
	$('#earth .z').text(ephemeris.Earth.position.rect[2]);

	// Populate the geocentric distance.
	$('#distance').text(ephemeris.mars.position.geocentricDistance);

	// Draw solar system.
	drawSolarSystem();
	$(window).on('resize', drawSolarSystem);

	// Function for drawing the solar system on the canvas.
	function drawSolarSystem() {
		// Get the dimensions of the canvas.
		var c_width = $('#solar-system').width();
		var c_height = $('#solar-system').height();
		var min = Math.min(c_height, c_width);

		// Instantiate the canvas context.
		var c = document.getElementById("solar-system");
		c.width = c_width;
		c.height = c_height;
		var ctx = c.getContext("2d");

		// Crunch some numbers.
		var mars = {
			distance: Math.sqrt(Math.pow(ephemeris.mars.position.rect[0], 2) + Math.pow(ephemeris.mars.position.rect[1], 2)),
			x: c_width/2 + (min/3 * ephemeris.mars.position.rect[0]),
			y: c_height/2 + (min/3 * ephemeris.mars.position.rect[1])
		};

		var earth = {
			distance: Math.sqrt(Math.pow(ephemeris.Earth.position.rect[0], 2) + Math.pow(ephemeris.Earth.position.rect[1], 2)),
			x: c_width/2 + (min/3 * ephemeris.Earth.position.rect[0]),
			y: c_height/2 + (min/3 * ephemeris.Earth.position.rect[1])
		};

		// Make the background.
		ctx.fillStyle = "#222";
		ctx.fillRect(0, 0, c_width, c_height);

		// Make mars orbit.
		ctx.strokeStyle = "#00FF00";
		ctx.beginPath();
		ctx.arc((c_width/2), (c_height/2), (min/3 * mars.distance), 0, 2 * Math.PI);
		ctx.stroke();

		// Make earth orbit.
		ctx.strokeStyle = "#00FF00";
		ctx.beginPath();
		ctx.arc((c_width/2), (c_height/2), (min/3 * earth.distance), 0, 2 * Math.PI);
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
		ctx.arc((c_width/2), (c_height/2), (min * 0.04), 0, 2 * Math.PI);
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
	}
	

}());