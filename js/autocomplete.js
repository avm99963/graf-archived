function autocomplete(inp, obj, act) {
  /*the autocomplete function takes two arguments,
  the text field element and an objay of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function(e) {
      var a, b, i, val = this.value;
      /*close any already open lists of autocompleted values*/
      closeAllLists();
      if (!val || val.length < 3) return false;
      currentFocus = -1;
	  
      /*create a DIV element that will contain the items (values):*/
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      /*append the DIV element as a child of the autocomplete container:*/
      this.parentNode.appendChild(a);
	  
      /*for each item in the object...*/
      for (node in obj) {
		var nomNode = obj[node].name;
				
		if (nomNode.toUpperCase().includes(val.toUpperCase())) {
			var parts = nomNode.toUpperCase().split(val.toUpperCase());
			
			  /*create a DIV element for each matching element:*/
			  b = document.createElement("DIV");
			  
			  /*make the matching letters bold:*/
			  if (parts[0].length == 0) b.innerHTML = "";
			  else b.innerHTML = nomNode.substr(0, parts[0].length);
			  b.innerHTML += "<strong>" + nomNode.substr(parts[0].length, val.length) + "</strong>";
			  b.innerHTML += nomNode.substr(parts[0].length + val.length);
			  b.innerHTML += " - <span class='autocomplete-year'>" + obj[node].year + "</span>";
			  /*insert a input field that will hold the current object item's value:*/
			  b.innerHTML += "<input type='hidden' value='" + node + "'>";
			 
			 /*execute a function when someone clicks on the item value (DIV element):*/
			  b.addEventListener("click", function(e) {
				  /*insert the value for the autocomplete text field:*/
				  var n = this.getElementsByTagName("input")[0].value;
				  inp.value = obj[n].name;
				  
				  switch (act) {
					case "search":
					  // Move camera to desired node
						cameraGoto(obj[n].x, obj[n].y);
					  // Close the search box
					  var searchBox = document.getElementById('searchBox');
					  searchBox.style.display = "none";
					  
					  // Empty the input bar
					  var searchInput = document.getElementById('searchInput');
					  searchInput.value = "";
						break;
					case "addEdge":					
					  // Add an edge between A and B
					  var sourceID = document.getElementById("node-id").innerText.substr(1);
					  var edgeName = Math.min(sourceID, n) + "_" + Math.max(sourceID, n);
					  if (!graf.edges[edgeName]) {
						  graf.edges[edgeName] = {
							  a: Math.min(sourceID, n),
							  b: Math.max(sourceID, n),
							  votes: 1
						  };
						  
						  // Temporary fix, just for testing
						  s.graph.addEdge({
							  id: edgeName,
							  source: sourceID,
							  target: n,
							  size: 0.5
							});
							
						  clickNode(s, sourceID, s.graph.neighbors(sourceID));
						  dialog.max();
						  
						  // Give a message of validation
						  var edgeMSG = document.querySelector("#addedge-msg");
						  addedEdgeMSG(edgeMSG);

					  } else {
						  alert("Edge already exists");
					  }
									  
					  // Empty the input bar
					  var addEdgeInput = document.getElementById('addedge-input');
					  addEdgeInput.value = "";
					  
					  // Return to default view
					  document.querySelector("#addedge-input").style.display = "none";  
					  document.querySelector("#edge-list").style.display = "block";
					  break;
				  }
				  
				  /*close the list of autocompleted values,
				  (or any other open lists of autocompleted values:*/
				  closeAllLists();
			  });
			  
			  // Set "data-edges" attribute and compare with others
			  var nEdges = Object.keys(s.graph.neighbors(node)).length;
			  b.dataset.edges = nEdges;
			  var inserted = false;
			  
			  // Sort nodes by degree
			  for (i in a.childNodes) {
				  var child = a.childNodes[i];
				  if (!child.dataset) break;
				  if (nEdges > child.dataset.edges) {
					  a.insertBefore(b, child);
					  inserted = true;
					  break;
				  }
			  }
			  
			  if (!inserted) {
				  a.appendChild(b);
				  console.log("inserted");
			  }
		  }
        }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        /*If the objow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 38) { //up
        /*If the objow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x) x[currentFocus].click();
        }
      }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {	  
      closeAllLists(e.target);
  });
}

function addedEdgeMSG(edgeMSG) {
  var opacity = 8;
  edgeMSG.style.display = "block";
  
  var opacityChange = window.setInterval(function() {
	  edgeMSG.style.color = "rgba(0,0,0, "+ opacity/10 +")";
	  var edgeList = document.querySelector("#edge-list ul");
	  edgeList.style.backgroundColor = "rgba(0,200,0, "+ opacity/10 +")";
	  --opacity;
	  console.log(opacity);
	}, 100);
	
  var backToDef = window.setTimeout(function() {
	  edgeMSG.style.display = "none";
	  edgeMSG.style.color = "black";
	  window.clearInterval(opacityChange);
	}, 1000);
}