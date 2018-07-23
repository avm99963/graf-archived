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
	  n.label = n.originalLabel;
    });

    s.graph.edges().forEach(function(e) {
      e.color = "#fff";
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
  },
  addEdge: function() {
	document.querySelector("#addedge-input").style.display = "block";  
	document.querySelector("#edge-list").style.display = "none";
	autocomplete(document.getElementById("addedge-input"), graf.nodes, "addEdge");
	// Focus on the addEdge input bar
	document.getElementById("addedge-input").focus();
  }
};

function init() {
    sigma.classes.graph.addMethod("neighbors", function(nodeId) {
      var k,
          neighbors = {},
          index = this.allNeighborsIndex[nodeId] || [];

      for (k in index) {
        neighbors[k] = this.nodesIndex[k];
      }

      return neighbors;
    });

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
        zoomMax: 10,
        //enableEdgeHovering: true,
        font: "Roboto",
        labelThreshold: 5
      }
    });

    xhr("GET", "api.php", "action=getgraf", function(responseText, status) {
      graf = JSON.parse(responseText);

      console.log(graf);

      for (var i in graf.nodes) {
        var ncolor = (graf.nodes[i].sex == "F" ? "#d61c08" : (graf.nodes[i].sex == "M" ? "#0159aa" : "#0ca80a"));

        s.graph.addNode({
          id: graf.nodes[i].id,
          label: graf.nodes[i].name,
		  originalLabel: graf.nodes[i].name,
          x: graf.nodes[i].x,
          y: graf.nodes[i].y,
          size: 10,
          color: ncolor,
          originalColor: ncolor
        });
      }

      for (var i in graf.edges) {
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
        //toKeep[nodeId] = e.data.node;
		clickNode(s, nodeId, toKeep);
      });

      document.querySelector("#quit-dialog").addEventListener("click", dialog.close);
      document.querySelector("#quit2-dialog").addEventListener("click", dialog.close);
      document.querySelector("#max-dialog").addEventListener("click", dialog.max);
      document.querySelector("#min-dialog").addEventListener("click", dialog.min);
	  document.querySelector("#addedge-button").addEventListener("click", dialog.addEdge);

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

      s.refresh();
	  autocomplete(document.getElementById("searchInput"), graf.nodes, "search");
    });
}

function cameraGoto(nodeX, nodeY) {
	sigma.misc.animation.camera( s.camera,
	  { x: nodeX, y: nodeY, ratio: 1 },
	  { duration: s.settings('animationsTime') || 300 }
	);
}

function clickNode(s, nodeId, toKeep) {
	s.graph.nodes().forEach(function(n) {
          if (toKeep[n.id] || n.id == nodeId) {
            n.color = n.originalColor;
			n.label = n.originalLabel;
			console.log("Hola");
          } else {
            n.color = '#333';
			n.label = '';
          }
        });

        s.graph.edges().forEach(function(e) {
          if ((e.source == nodeId || e.target == nodeId) && (toKeep[e.source] || toKeep[e.target])) {
            e.color = '#fff';
          } else {
            e.color = '#333';
          }
        });

        s.refresh();

        dialog.show(nodeId, toKeep);
}

window.addEventListener("load", init);
