// *********** HERE STARTS camera.js *************

function cameraGoto(nodeX, nodeY) {
	sigma.misc.animation.camera( s.camera,
		{ x: nodeX, y: nodeY, ratio: 1 },
		{ duration: s.settings('animationsTime') || 300 }
	);
}

function is_touch_device() {
	var prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
	var mq = function(query) {
		return window.matchMedia(query).matches;
	}

	if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
		return true;
	}

	// include the 'heartz' as a way to have a non matching MQ to help terminate the join
	// https://git.io/vznFH
	var query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('');
	return mq(query);
}

function initCamera() {
	if(!is_touch_device()) {
		document.querySelector("#zoomin").addEventListener("click", function() {
			s.camera.goTo({
				ratio: Math.max(s.camera.settings("zoomMin"), s.camera.ratio / Math.sqrt(2))
			});
		});

		document.querySelector("#zoomout").addEventListener("click", function() {
			s.camera.goTo({
				ratio: Math.min(s.camera.settings("zoomMax"), s.camera.ratio * Math.sqrt(2))
			});
		});
	} else {
		document.querySelector("#zoomin").style.display = "none";
		document.querySelector("#zoomout").style.display = "none";

    document.querySelector("#stats").style.bottom = "110px";
		document.querySelector("#settings").style.bottom = "60px";
		document.querySelector("#search").style.bottom = "10px";
	}
}
