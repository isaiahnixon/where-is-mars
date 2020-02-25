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
		// Get the width and height of the canvas.
		var c_width = $('#solar-system').width();
		var c_height = $('#solar-system').height();

		// Instantiate the canvas context.
		var c = document.getElementById("solar-system");
		c.width = c_width;
		c.height = c_height;
		var ctx = c.getContext("2d");

		// Make the background.
		ctx.fillStyle = "#222";
		ctx.fillRect(0, 0, c.width, c_height);

		// Make the sun.
		ctx.fillStyle = "#FFAA1D";
		ctx.beginPath();
		ctx.arc((c_width/2), (c_height/2), (c_width * 0.02), 0, 2 * Math.PI);
		ctx.fill();
	}
	

}());