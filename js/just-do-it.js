// *********** HERE STARTS just-do-it.js *************

var seq = [38, 38, 40, 40, 37, 39, 37, 39, 65, 66, 13];
var cur = 0;

function justdoit() {
	s.graph.nodes().forEach(function(n) {
		switch(n.color) {
			case "#d61c08":
			n.color = "#0159aa";
			break;

			case "#0159aa":
			n.color = "#0ca80a";
			break;

			case "#0ca80a":
			n.color = "#d61c08";
			break;
		}
	});

	s.refresh();
	setTimeout(justdoit, 333);
}


function initJustDoIt() {
	document.addEventListener("keydown", function(event) {
		if (event.key == "f" && event.target.getAttribute("id") != "search-input") altSearchBar();
		if (event.which == seq[cur]) {
			if (cur < seq.length) {
				++cur;
				if (cur == seq.length) {
					justdoit();
				}
			}
		} else cur = 0;
	});
}
