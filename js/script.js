// *********** HERE STARTS circle-mode.js *************

circleMode = false;

function initCircleMode() {
  document.querySelector("#circle-mode").addEventListener('click', function() {
    if(circleMode) {
      circleMode = false;
      document.querySelector("#circle-mode i").innerText = "trip_origin";

      s.graph.nodes().forEach(function(n) {
        n.x = n.originalX;
        n.y = n.originalY;
        n.size = 10;
      });

      s.refresh();
    } else {
      circleMode = true;
      document.querySelector("#circle-mode i").innerText = "scatter_plot";

      s.graph.nodes().forEach(function(n) {
        n.x = n.circleX;
        n.y = n.circleY;
      });

      s.refresh();
    }
  });
}

function isInRect(x, y, rect) {
  if (x < -10000 || x > 10000) return true;
  if (y < -10000 || y > 10000) return true;

  var ans = true;
  var c = crossProd (rect[0], rect[1], x, y);

  for(var i = 1; i < 4; i++) {
    var temp = crossProd (rect[i], rect[(i+1)%4], x, y);
    if (c*temp < 0) ans = false;
  }
  return ans;
}

function crossProd(r1, r2, x, y) {
  return r1[0]*r2[1] + r2[0]*y + x*r1[1] - r1[0]*y - r2[0]*r1[1] - x*r2[1];
}
// *********** HERE STARTS graf.js *************

// s is the sigma graph
// graf is the JSON graph
var s, graf;

// query dario JSON for the graph information
function xhr(method, url, params, callback) {
  var http = new XMLHttpRequest();
  if (method == "POST") {
    http.open(method, url, true);
  } else {
    if (params != "") {
      http.open(method, url+"?"+params, true);
    } else {
      http.open(method, url, true);
    }
  }
  http.onload = function() {
    if(this.status != 200) {
      console.warn("Attention, status code "+this.status+" when loading via xhr url "+url);
    }
    callback(this.responseText, this.status);
  };
  if (method == "POST") {
    http.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    http.send(params);
  } else {
    http.send();
  }
}


function initGraf() {
  // create new methods for sigma library
  updateSigma();

  // create graf, s is the sigma graf
  s = new sigma({
    renderers: [{
      container: "graf",
      type: "webgl"
    }],
    settings: {
      defaultEdgeColor: "#fff",
      edgeColor: "default",
      defaultLabelColor: "#fff",
      autoRescale: false,
      zoomMax: 30,
      // enableEdgeHovering: true,
      font: "Roboto",
      labelThreshold: 5
    }
  });


  // query for JSON for graph data
  xhr("GET", "api.php", "action=getgraf", function(responseText, status) {
    // graf is the JSON data
    graf = JSON.parse(responseText);

    // does graf.nodes have a size attribute?
    var rectBorrar = [[0,0], [0,0], [0,0], [0,0]];
    for (var i in graf.nodes) {
      if (graf.nodes[i].name == "Erase")    rectBorrar[0] = [ graf.nodes[i].x , graf.nodes[i].y ];
      if (graf.nodes[i].name == "Borrar")   rectBorrar[1] = [ graf.nodes[i].x , graf.nodes[i].y ];
      if (graf.nodes[i].name == "Esborrar") rectBorrar[2] = [ graf.nodes[i].x , graf.nodes[i].y ];
      if (graf.nodes[i].name == "Delete")   rectBorrar[3] = [ graf.nodes[i].x , graf.nodes[i].y ];
    }

    var sizegraf = 0;
    for (var i in graf.nodes) {
      if ( isInRect(graf.nodes[i].x, graf.nodes[i].y, rectBorrar) ) continue;
      sizegraf++;
    }
    var nnode = 0;
    for (var i in graf.nodes) {
      var ncolor = null;

      if(graf.nodes[i].sex =="F") ncolor = "#d61c08";
      else if(graf.nodes[i].sex == "M") ncolor = "#0159aa";
      else ncolor = "#0ca80a";

      // post-processing for year corrections
      if(1970 < graf.nodes[i].year && graf.nodes[i].year < 2004) graf.nodes[i].year += 18;

      var newX = 5000*Math.cos( 2*Math.PI*nnode/sizegraf );
      var newY = 5000*Math.sin( 2*Math.PI*nnode/sizegraf );

      if (isInRect(graf.nodes[i].x, graf.nodes[i].y, rectBorrar) ) continue;

      s.graph.addNode({
        // we add color, originalColor, size, originalX..Y, circleX..Y atributes
        id: graf.nodes[i].id,
        year: graf.nodes[i].year,
        sex: graf.nodes[i].sex,
        label: graf.nodes[i].name,
        x: graf.nodes[i].x,
        y: graf.nodes[i].y,
        circleX: newX,
        circleY: newY,
        originalX: graf.nodes[i].x,
        originalY: graf.nodes[i].y,
        size: 10,
        color: ncolor,
        originalColor: ncolor
      });
      nnode++;

    }

    for (var i in graf.edges) {
      if (isInRect(graf.nodes[graf.edges[i].a].x, graf.nodes[graf.edges[i].a].y, rectBorrar)) continue;
      if (isInRect(graf.nodes[graf.edges[i].b].x, graf.nodes[graf.edges[i].b].y, rectBorrar)) continue;

      s.graph.addEdge({
        id: i,
        source: graf.edges[i].a,
        target: graf.edges[i].b,
        size: Math.min(4, Math.max((7/(2*Math.pow(20, 2)))*Math.pow(graf.edges[i].votes, 2) + 1/2, 0.5))
      });

    }

    s.bind('clickNode', function(e) {
      var nodeId = e.data.node.id,
      toKeep = s.graph.neighbors(nodeId);
      // toKeep[nodeId] = e.data.node;


      s.graph.nodes().forEach(function(n) {
        if (toKeep[n.id] || n.id == nodeId) {
          n.color = n.originalColor;
        } else {
          n.color = '#333';
        }
      });

      s.graph.edges().forEach(function(e) {
        if ((e.source == nodeId || e.target == nodeId) && (toKeep[e.source] || toKeep[e.target])) {
          e.color = '#fff';
        } else {
          e.color = '#333';
        }
      });

      if (circleMode) {
        s.graph.nodes().forEach(function (n) {
          n.x = n.circleX;
          n.y = n.circleY;
          n.size = 10;
        });

        e.data.node.x = 0;
        e.data.node.y = 0;
        e.data.node.size = 30;
      }

      s.refresh();

      dialog.show(nodeId, toKeep);
    });

    initDialog();
    initCamera();
    initSearchBar();

    s.refresh();
    autocomplete(document.querySelector("#search-input"), graf.nodes, "search", rectBorrar);
  });
}

function updateSigma() {
  // returns set of neighouts
  sigma.classes.graph.addMethod("neighbors", function(nodeId) {
    var k,
    neighbors = {},
    index = this.allNeighborsIndex[nodeId] || [];

    for (k in index) {
      neighbors[k] = this.nodesIndex[k];
    }

    return neighbors;
  });

  // returns number of neighbours from a set of years
  sigma.classes.graph.addMethod("numNeighborsFromYears", function(nodeId, showYearsCopy) {
    var k,
    neighbors = 0,
    index = this.allNeighborsIndex[nodeId] || [];

    for (k in index) {
      if(this.nodesIndex){
        if (showYearsCopy.has("" + this.nodesIndex[k].year)) neighbors++;
        else if (this.nodesIndex[k].year == 0) neighbors++;
      }
    }

    return neighbors;
  });
}
// *********** HERE STARTS limit-years.js *************

var limitYears = false;
var showYears = new Set();

function repaint() {
	//targetYear: graf.nodes[e.source].year,
	if(limitYears) {
		var added = new Set();

		s.graph.nodes().forEach(function(n) {
			var numNeig = s.graph.numNeighborsFromYears(n.id, showYears);

			if ((n.year == 0 && (n.sex == 'F' || n.sex == 'M') )
					|| numNeig == 0
					|| (!showYears.has("" + n.year) && (n.year != 0) )) {
				n.hidden = true;
			}
			else {
				n.hidden = false;
				added.add(n.id);
			}
		});

		s.graph.edges().forEach(function(e) {
			if(!added.has(e.source) && !added.has(e.target)){
				e.hidden = true;
			}
			else e.hidden = false;
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

function addYearList() {
	var ylistspan = document.querySelector("#year-list-span")
	for(var year = 2006; year < 2019; year++) {
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
	}

	document.querySelector("#settings").addEventListener("click", altYearList);
}
// *********** HERE STARTS search-bar.js *************

function altSearchBar() {
	if (document.querySelector(".md-google-search__metacontainer").style.display == "none") {
		document.querySelector(".md-google-search__metacontainer").style.display = "block";
		document.querySelector("#search i").innerText = "fullscreen";
		document.querySelector("#search-input").focus();
	} else {
		document.querySelector(".md-google-search__metacontainer").style.display = "none";
		document.querySelector(".autocomplete-container").style.display = "none";
		document.querySelector("#search i").innerText = "search";
	}
}

function initSearchBar() {
	document.querySelector("#search").addEventListener("click", altSearchBar);
	if (window.innerWidth > 700) altSearchBar();
}
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

		if(circleMode) {
			s.graph.nodes().forEach(function (n) {
				n.x = n.circleX;
				n.y = n.circleY;
				n.size = 10;
			});
		}
		else {
			s.graph.nodes().forEach(function (n) {
				n.x = n.originalX;
				n.y = n.originalY;
				n.size = 10;
			});
		}
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

		document.querySelector("#circle-mode").style.bottom = "110px";
		document.querySelector("#settings").style.bottom = "60px";
		document.querySelector("#search").style.bottom = "10px";
	}
}
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
	document.addEventListener("keydown", function() {
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
// *********** HERE STARTS init.js *************

function init() {
  initGraf();
  addYearList();
  initCircleMode();
  initJustDoIt();
}

window.addEventListener("load", init);
