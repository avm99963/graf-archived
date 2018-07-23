<?php
require_once("config.php");

session_start();

if (!isset($_POST["password"])) {
    header("Location: login.php");
    exit();
}

if ($_POST["password"] != "forallexists") {
    header("Location: login.php?msg=wrong");
    exit();
}
?>
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Graf alternatiu FME</title>

    <meta name=viewport content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
    <link rel="manifest" href="manifest.json">

    <link rel="stylesheet" href="css/dialog.css">
	<link rel="stylesheet" href="css/styles.css">
      
    <!-- Seach Bar CSS files -->  
    <link rel="stylesheet" href="./css/modal.css"></link>
    <link rel="stylesheet" href="./css/autocomplete.css"></link>

    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
    <link rel="stylesheet" href="https://code.getmdl.io/1.3.0/material.blue_grey-blue.min.css" />

    <!-- Apple web app -->
    <link rel="apple-touch-icon" href="img/graf.png">
    <meta name="apple-mobile-web-app-title" content="Graf FME">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
  </head>
  <body>
	<button id="searchButton"class="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-js-ripple-effect mdl-button--colored"><i class="material-icons">search</i></button>
	<button id="zoomin" class="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-js-ripple-effect mdl-button--colored"><i class="material-icons">zoom_in</i></button>
    <button id="zoomout" class="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-js-ripple-effect mdl-button--colored"><i class="material-icons">zoom_out</i></button>
	
    <div id="backdrop-container" style="display: none;">
      <div id="backdrop"></div>
    </div>
    <div id="dialog" class="mdl-shadow--2dp" style="display: none;">
      <button id="quit-dialog" class="mdl-button mdl-js-button mdl-button--icon mdl-js-ripple-effect"><i class="material-icons">close</i></button>
      <button id="min-dialog" class="mdl-button mdl-js-button mdl-button--icon mdl-js-ripple-effect"><i class="material-icons">remove</i></button>
      <div id="dialog-vertex">
        <h2 data-fill="name"></h2>
        <ul>
          <li><b>Any:</b> <span data-fill="year"></span></li>
          <li><b>Sexe:</b> <span data-fill="sex"></span></li>
          <li><b>ID:</b> <span data-fill="id" id="node-id"></span></li>
        </ul>
		<div id="addedge-box">
			<div id="addedge-button" class="addegde-button"><h2>Afegir una nova aresta +</h2></div>
			<div id="addedge-msg" class="addegde-msg"><h2>Aresta afegida!</h2></div>
			<input id="addedge-input" type="text" style="display:none;">
		</div>	
		<div id="edge-list">
			<h3>Arestes (<span data-fill="n-edges"></span>):</h3>
			<ul data-fill="edges">
			</ul>
		</div>
      </div>
      <div id="dialog-edge" style="display: none;">
      </div>
    </div>
    <div id="summary-dialog" class="mdl-shadow--2dp" style="display: none;">
      <button id="quit2-dialog" class="mdl-button mdl-js-button mdl-button--icon mdl-js-ripple-effect"><i class="material-icons">close</i></button>
      <button id="max-dialog" class="mdl-button mdl-js-button mdl-button--icon mdl-js-ripple-effect"><i class="material-icons">add</i></button>
      <div id="summary-vertex">
        <h2 data-fill="name"></h2>
        <p><span data-fill="year"></span>, <span data-fill="sex"></span>, <span data-fill="id"></span></p>
      </div>
    </div>
    <!-- Search Box -->
    <div id="searchBox" class="modal">
      <!-- Search Box Content -->
      <div class="modal-content">
        <span class="closeBox">&times;</span>

        <div class="in-box-content">
            <center>
                <form autocomplete="off">
                  <div class="autocomplete">
                    <input id="searchInput" type="text" placeholder="Busca una persona al graf">
                  </div>
                </form>
            </center>
        </div>
      </div>
    </div>
       
    <div id="graf"></div>
    
    <script src="https://cdnjs.cloudflare.com/ajax/libs/sigma.js/1.2.0/sigma.min.js"></script>
    <script>
		// Initialize the graph and the sigma
		var s, graf;
	</script>
	   
    <!-- Search Bar JS files -->
    <script src="./js/modal.js"></script>
    <script src="./js/autocomplete.js" ></script>
	
	<script src="js/script.js"></script>
	
    <script defer src="https://code.getmdl.io/1.3.0/material.min.js"></script>
    <!--<script src="js/service-worker.js"></script>-->
  </body>
</html>
