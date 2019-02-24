var statsDialog = {
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
  show: function() {
    //this.fill("section-name", "Ranking");
    //this.fill("section-name", "Ranking Vots");

    var rank = rankingLios();
    //var rank = rankingVots();
    var list = "";
    var it = 0;
    var it2 = 1;
    var last = 0;
    rank.forEach(function (a) {
      it++;
      if (it != 1 && last != s.graph.numNeighbors(a.id)) it2 = it;
      last = s.graph.numNeighbors(a.id);
      if (it == 1) {
        list += "<li style='border-radius:5px;margin-left: 20%; margin-right: 20%; background-color: gold; list-style-type: none; float: left; width: 30%; text-align:center;margin-top: 20px'>" + a.label.split(' ')[0] + "</li>";
        list += "<li style='float: left; width: 30%; list-style-type: none; text-align:center;margin-top: 20px'><b>" + s.graph.numNeighbors(a.id) + "</b></li>";
      }
      else if (it == 2) {
        list += "<li style='border-radius:5px;margin-left: 10%; margin-right: 10%; background-color: silver; list-style-type: none; float: left; width: 50%; text-align:center;'>" + a.label + "</li>";
        list += "<li style='float: left; width: 30%; list-style-type: none; text-align:center;'><b>" + s.graph.numNeighbors(a.id) + "</b></li>";
      }
      else if (it == 3) {
        list += "<li style='border-radius:5px;background-color: #CD7F32; list-style-type: none; float: left; width: 70%; text-align:center;' margin-bottom: 20px>" + a.label + "</li>";
        list += "<li style='float: left; width: 30%; list-style-type: none; text-align:center; margin-bottom: 20px'><b>" + s.graph.numNeighbors(a.id) + "</b></li>";
      }
      else if(it == 20) {
        list += "<li style='float: left; width: 70%; margin-bottom: 20px;list-style-type: none;'>" + it2 + ". " + a.label + "</li>";
        list += "<li style='float: left; width: 30%; list-style-type: none; text-align:center; margin-bottom: 20px'><b>" + s.graph.numNeighbors(a.id) + "</b></li>";
      }
      else {
        list += "<li style='float: left; width: 70%; list-style-type: none'>" + it2 + ". " + a.label + "</li>";
        list += "<li style='float: left; width: 30%; list-style-type: none; text-align:center;'><b>" + s.graph.numNeighbors(a.id) + "</b></li>";
      }
      //list += "<li><b>" + a.label + " - " + s.graph.numVots(a.id) + "</li>";
    });
    this.fill("section-ranking", list, true);

    if (window.innerWidth > 700) {
      document.querySelector("#stats-dialog").style.display = "block";
      document.querySelector("#backdrop-container").style.display = "block";

    } else {
      document.querySelector("#stats-dialog").style.margin = "10px";
      document.querySelector("#stats-dialog").style.width = "Calc(100% - 20px)";
      document.querySelector("#stats-dialog").style.height = "Calc(100% - 10px)";
      document.querySelector("#stats-dialog").style.display = "block";     
    }
  },
  close: function() {
    document.querySelector("#stats-dialog").style.display = "none";
    document.querySelector("#backdrop-container").style.display = "none";

  }
};

function rankingLios() {
  var c = [];
  var mdeg = 0;
  
  s.graph.nodes().forEach(function(n) {
    if (n.year >= 2015) c.push(n);
  });
  
  c.sort(function(a, b) {
    var na = s.graph.numNeighbors(a.id);
    var nb = s.graph.numNeighbors(b.id);
    
    var va = s.graph.numVots(a.id);
    var vb = s.graph.numVots(b.id);
    if (na == nb) return vb - va;
    else return nb - na;
  });
  
  
  return c.splice(0, 20);
}

function numNodes() {
  return Object.keys(s.graph.nodes()).length;
}

function numEdges() {
  return Object.keys(s.graph.edges()).length;
}

function dictionaryIds() {
  var dict = new Map();
  var it = 0;
  s.graph.nodes().forEach(function(n) {
    if (!dict.has(n.id))dict[n.id] = it++;
  });
  
  return dict;
}

function parseGraphAdjMatrix() {
  var n = numNodes();
  var memo = Array(n).fill(0).map(() => new Array(n).fill(0));
  var dict = dictionaryIds();
  
  s.graph.edges().forEach(function(e) {  
    memo[dict[e.target]][dict[e.source]] = 1;
    memo[dict[e.source]][dict[e.target]] = 1;
  });
  
  return memo;
}

function diameter() {
  var n = numNodes();
  var INF = 1000000;
  var memo = Array(n).fill(INF).map(() => new Array(n).fill(INF));
  var G = parseGraphAdjMatrix();
  var dict = dictionaryIds();

  
  for (var i=0; i<n; i++) {
    for (var j=0; j<n; j++) {
      
      if (G[i][j] == 1) memo[i][j] = 1;
      if (i == j) memo[i][j] = 0;
    
    }
  }
  
  for (var k=0; k<n; k++) {
    for (var i=0; i<n; i++) {
      for (var j=0; j<n; j++) {
        
        if (memo[i][k] + memo[k][j] < memo[i][j]) {
          memo[i][j] = memo[i][k] + memo[k][j]; 
        }
      
      }
    }
  }
  
  console.log(memo[dict[606]][dict[2]]);
  var mx = 0;
  for (var i=0; i<n; i++) {
    for (var j=0; j<n; j++) {
      if (mx < memo[i][j] && memo[i][j] != INF) mx = memo[i][j];
    }
  }
  
  for (var i=0; i<n; i++) {
    for (var j=i+1; j<n; j++) {
      if (mx == memo[i][j]) {

        s.graph.nodes().forEach(function(n){
          if(n.id == Object.keys(dict)[i]) console.log(n);
          if(n.id == Object.keys(dict)[j]) console.log(n);
        });
      }
    }
  }

  
  return mx;
}

function initStats() {
  document.querySelector("#stats").addEventListener("click", function() {
    if (document.querySelector("#stats-dialog").style.display == "none") 
      statsDialog.show();
    else statsDialog.close();
  });
  
  document.querySelector("#stats-quit-dialog").addEventListener("click", statsDialog.close);

  console.log("nodes: " + numNodes());
  console.log("edges: " + numEdges());
  console.log("diameter: " + diameter());
}

