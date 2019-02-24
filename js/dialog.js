// *********** HERE STARTS dialog.js *************

var dialog = {
	fill: function(data, text, html=false) {
		var el = document.querySelectorAll("*[data-fill=\""+data+"\"]");
		for (var i in el) {
			if (html === true) {
				el[i].innerHTML = text;
			} else {
				el[i].innerText = text;
			}
		}
	},
	show: function(id, neighbors) {
		var neighbors = Object.values(neighbors);

		this.fill("name", graf.nodes[id].name);
		this.fill("year", graf.nodes[id].year);
		this.fill("sex", graf.nodes[id].sex);
		this.fill("id", "#"+id);
		this.fill("n-edges", neighbors.length);

		var list = "";
		neighbors.forEach(function (a) {
			list += "<li><b>"+graf.nodes[id].name+" - "+a.label+":</b> "+(graf.edges[id+"_"+a.id] ? graf.edges[id+"_"+a.id].votes : graf.edges[a.id+"_"+id].votes)+" vots</li>";
		});
		this.fill("edges", list, true);

		if (window.innerWidth > 700) {
			document.querySelector("#dialog").style.display = "block";
			document.querySelector("#backdrop-container").style.display = "block";
		} else {
			document.querySelector("#summary-dialog").style.display = "block";
		}
	},
	close: function() {
		document.querySelector("#dialog").style.display = "none";
		document.querySelector("#summary-dialog").style.display = "none";
		document.querySelector("#backdrop-container").style.display = "none";

		s.graph.nodes().forEach(function(n) {
			n.color = n.originalColor;
		});

		s.graph.edges().forEach(function(e) {
			e.color = e.originalColor;
		});

		s.graph.nodes().forEach(function (n) {
			n.x = n.originalX;
			n.y = n.originalY;
			n.size = 10;
		});

		s.refresh();

	},
	max: function() {
		document.querySelector("#summary-dialog").style.display = "none";
		document.querySelector("#dialog").style.display = "block";
	},
	min: function() {
		document.querySelector("#dialog").style.display = "none";
		document.querySelector("#summary-dialog").style.display = "block";
	}
};


function initDialog() {
	document.querySelector("#quit-dialog").addEventListener("click", dialog.close);
	document.querySelector("#quit2-dialog").addEventListener("click", dialog.close);
	document.querySelector("#max-dialog").addEventListener("click", dialog.max);
	document.querySelector("#min-dialog").addEventListener("click", dialog.min);
}
