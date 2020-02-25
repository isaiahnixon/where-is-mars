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
}());