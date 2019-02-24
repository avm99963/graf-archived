// *********** HERE STARTS autocomplete.js *************

function autocomplete(inp, obj, act, rectBorrar) {
  /*the autocomplete function takes two arguments,
  the text field element and an objay of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function(e) {
    var a, b, i, val = this.value;
    /*close any already open lists of autocompleted values*/
    clearLists();
    document.querySelector(".md-google-search__empty-btn").style.display = (val ? "block" : "none");
    if (!val || val.length < 3) return false;
    currentFocus = -1;
    var is_empty = true;

    /*for each item in the object...*/
    for (node in obj) {
      var nomNode = obj[node].name;

      if (isInRect(obj[node].x, obj[node].y, rectBorrar)) continue;
      
      if (nomNode.toUpperCase().includes(val.toUpperCase())) {
        is_empty = false;
        var parts = nomNode.toUpperCase().split(val.toUpperCase());

        /*create a DIV element for each matching element:*/
        b = document.createElement("div");
        b.setAttribute("class", "autocomplete-item");

        /*make the matching letters bold:*/
        if (parts[0].length == 0) b.innerHTML = "";
        else b.innerHTML = "<span style='font-weight: bold; position:relative; z-index:120;'>" + nomNode.substr(0, parts[0].length) + "</span>";

        b.innerHTML += nomNode.substr(parts[0].length, val.length);
        b.innerHTML += "<span style='font-weight: bold; position:relative; z-index:120;'>" + nomNode.substr(parts[0].length + val.length) + "</span>";
        b.innerHTML += " <span class='autocomplete-year'>(" + obj[node].year + ")</span>";

        /*include node id to keep track of which is it*/
        b.dataset.id = node;

        /*execute a function when someone clicks on the item value (DIV element):*/
        b.addEventListener("click", function(e) {
          /*insert the value for the autocomplete text field:*/
          var n = this.dataset.id;
          inp.value = obj[n].name;

          var node = null;

          s.graph.nodes().forEach( function(nnode) {
            if(nnode.id == n) node = nnode;
          });


          switch (act) {
            case "search":
            // Move camera to desired node
            cameraGoto(node.x, node.y);
            break;
            case "addEdge":
            // @TODO: Add an edge between A and B
            alert(obj[n].name);
            break;
          }

          /*close the list of autocompleted values,
          (or any other open lists of autocompleted values:*/
          clearLists();
        });

        // Set "data-edges" attribute and compare with others
        var nEdges = Object.keys(s.graph.neighbors(node)).length;
        b.dataset.edges = nEdges;
        var inserted = false;

        // Sort nodes by degree
        for (i in document.querySelector("#autocomplete-list").childNodes) {
          var child = document.querySelector("#autocomplete-list").childNodes[i];
          if (!child.dataset) break;
          if (nEdges > child.dataset.edges) {
            document.querySelector("#autocomplete-list").insertBefore(b, child);
            inserted = true;
            break;
          }
        }

        if (!inserted) {
          document.querySelector("#autocomplete-list").appendChild(b);
        }
      }
    }

    document.querySelector(".autocomplete-container").style.display = (is_empty ? "none" : "block");
  });

  document.querySelector(".md-google-search__empty-btn").addEventListener("click", function() {
    document.querySelector("#search-input").value = "";
    this.style.display = "none";
  });

  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function(e) {
    var x = document.getElementById("autocomplete-list");
    if (x) x = x.getElementsByTagName("div");
    if (x.length == 0) return;
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
  function clearLists() {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.querySelector("#autocomplete-list");
    x.innerHTML = "";
    document.querySelector(".autocomplete-container").style.display = "none";
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
    clearLists();
  });
}
