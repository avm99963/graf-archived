// *********** HERE STARTS limit-years.js *************

var limitYears = false;
var showYears = new Set();

function repaint() {
	//targetYear: graf.nodes[e.source].year,
	if(limitYears) {
		var added = new Set();

		s.graph.nodes().forEach(function(n) {
			var numNeig = s.graph.numNeighborsFromYears(n.id, showYears);

			var ne = s.graph.neighbors(n.id);
			var keys = Object.keys(ne);

			var hasFriend = false;
			for (var i=0; i<keys.length; i++) {
				if (showYears.has("" + ne[keys[i]].year)) hasFriend = true;
			}
			
			// to make inclusive, decomment 1 and comment 2
			if (	//!hasFriend && 
					( numNeig == 0
					|| (n.year == 0 && (n.sex == 'F' || n.sex == 'M') )
					|| (!showYears.has("" + n.year) && (n.year != 0) ))) {
				
				n.hidden = true;
			}
			else {
				n.hidden = false;
				added.add(n.id);
			}
			
		});

		s.graph.edges().forEach(function(e) {
			if(added.has(e.source) || added.has(e.target)){
				e.hidden = false;
			}
			else e.hidden = true;
		});
	}
	else {
		s.graph.nodes().forEach(function(n) {
			n.hidden = false;
		});

		s.graph.edges().forEach(function(e) {
			e.hidden = false;
		});
	}
}

function altYearList() {
	var yearlist = document.querySelector("#year-list");

	if(yearlist.style.display == "none"){
		yearlist.style.display = "block";
		document.querySelector("#settings i").innerText = "close";
		yearLimits = true;
	}
	else{
		yearlist.style.display = "none";
		document.querySelector("#settings i").innerText = "settings";
		yearLimits = true;
	}
}

function first_day(year) {
	start_course = new Date(year + '-09-12');
	return start_course;
}

function addYearList() {
	var ylistspan = document.querySelector("#year-list-span")
	var year = 2007;
	var today = new Date();
	while (first_day(year) < today) {
		var lab = document.createElement("label");
		lab.setAttribute("class", "mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect custom-checkbox");
		lab.setAttribute("for", "checkbox-"+year);
		var yin = document.createElement("input");
		yin.type = "checkbox";
		yin.setAttribute("class", "mdl-checkbox__input");
		yin.name = year;
		yin.id = "checkbox-"+year;
		yin.addEventListener("change", function() {
			limitYears = true;

			if(this.checked) {
				showYears.add(this.name);
			} else {
				showYears.delete(this.name);
			}

			if (showYears.size == 0) limitYears = false;

			repaint();

			s.refresh();
		});

		var span = document.createElement("span");
		span.innerText = year;
		span.setAttribute("class", "mdl-checkbox__label");

		lab.appendChild(yin);
		lab.appendChild(span);
		ylistspan.appendChild(lab);
		ylistspan.insertAdjacentHTML("beforeend", "<br>");
		++year;
	}

	document.querySelector("#settings").addEventListener("click", altYearList);
}
