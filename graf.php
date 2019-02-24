<?php
require_once ("config.php");

session_start();

if (! isset($_POST["password"])) {
  header("Location: login.php");
  exit();
}

if ($_POST["password"] != $conf["password"]) {
  header("Location: login.php?msg=wrong");
  exit();
}
?>

<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Graf alternatiu FME</title>

    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
    <link rel="manifest" href="manifest.json">
	
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
    
    <!-- own css stylesheets -->
    <link rel="stylesheet" href="css/general.css">
    <link rel="stylesheet" href="css/graf.css">
    <link rel="stylesheet" href="css/dialog.css">
    <link rel="stylesheet" href="css/stats-dialog.css">
    <link rel="stylesheet" href="css/option-buttons.css">
    <link rel="stylesheet" href="css/year-list.css">
    <link rel="stylesheet" href="css/search-bar.css">

    <!-- imported css stylesheets -->    
	<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
    <link rel="stylesheet" href="https://code.getmdl.io/1.3.0/material.blue_grey-blue.min.css" />
    
    <!-- Apple web app -->
    <link rel="apple-touch-icon" href="img/graf.png">
    <meta name="apple-mobile-web-app-title" content="Graf FME">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
  </head>
  <body>
    <!-- side buttons -->
    <div id="option-buttons">
      <button id="stats" class="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-js-ripple-effect mdl-button--colored"><i class="material-icons">assignment</i></button>
      <button id="settings" class="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-js-ripple-effect mdl-button--colored"><i class="material-icons">settings</i></button>
      <button id="search" class="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-js-ripple-effect mdl-button--colored"><i class="material-icons">search</i></button>
      <button id="zoomin" class="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-js-ripple-effect mdl-button--colored"><i class="material-icons">zoom_in</i></button>
      <button id="zoomout" class="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-js-ripple-effect mdl-button--colored"><i class="material-icons">zoom_out</i></button>
    </div>

    <!-- limit year list -->
    <div id="year-list" style="display:none">
      <span id="year-list-span"></span>
    </div>

    <!-- Search container -->
    <div id="backdrop-container" style="display: none;">
      <div id="backdrop"></div>
    </div>

    <!-- Dialog container -->
    <div id="dialog" class="mdl-shadow--2dp" style="display: none;">
      <button id="quit-dialog" class="mdl-button mdl-js-button mdl-button--icon mdl-js-ripple-effect"><i class="material-icons">close</i></button>
      <button id="min-dialog" class="mdl-button mdl-js-button mdl-button--icon mdl-js-ripple-effect"><i class="material-icons">remove</i></button>

      <div id="dialog-vertex">
        <h2 data-fill="name"></h2>
        <ul>
          <li><b>Any:</b> <span data-fill="year"></span></li>
          <li><b>Sexe:</b> <span data-fill="sex"></span></li>
          <li><b>ID:</b> <span data-fill="id"></span></li>
        </ul>
        <h3>Arestes (<span data-fill="n-edges"></span>):</h3>
        <ul data-fill="edges">
        </ul>
      </div>
      <div id="dialog-edge" style="display: none;"></div>
    </div>
    <div id="summary-dialog" class="mdl-shadow--2dp" style="display: none;">
      <button id="quit2-dialog" class="mdl-button mdl-js-button mdl-button--icon mdl-js-ripple-effect"><i class="material-icons">close</i></button>
      <button id="max-dialog" class="mdl-button mdl-js-button mdl-button--icon mdl-js-ripple-effect"><i class="material-icons">add</i></button>
      <div id="summary-vertex">
        <h2 data-fill="name"></h2>
        <p><span data-fill="year"></span>, <span data-fill="sex"></span>, <span data-fill="id"></span></p>
      </div>
    </div>

    <!-- Stats dialog container -->
    <div id="stats-dialog" class="mdl-shadow--2dp" style="display: none;">
      <button id="stats-quit-dialog" class="mdl-button mdl-js-button mdl-button--icon mdl-js-ripple-effect"><i class="material-icons">close</i></button>
	  
	  <div class="btn-group btn-group-toggle" data-toggle="buttons"
	  		style="margin-top: 50px; margin-left:0%; width:100%">
	    <label class="btn btn-secondary active" style="border-radius:0px;display:block;width:100%">
		  <input type="radio" name="options" id="option1" autocomplete="off" checked> Ranking
		</label>
		<label class="btn btn-secondary" style="border-radius:0px;display:block;width:100%">
		  <input type="radio" name="options" id="option2" autocomplete="off"> Stats
		</label>
		<label class="btn btn-secondary" style="border-radius:0px;display:block;width:100%">
		  <input type="radio" name="options" id="option2" autocomplete="off"> Distance
		</label>

	  </div>
      
      <div id="stats-dialog-section">
   
        <ul id="ranking" data-fill="section-ranking">
        </ul>
      </div>
    </div>

    <!-- MD Search Box -->
    <div class="md-google-search__metacontainer" style="display: none;">
      <div class="md-google-search__container">
        <div class="md-google-search">
          <button class="md-google-search__search-btn">
            <svg height="24px" viewBox="0 0 24 24" width="24px" xmlns="http://www.w3.org/2000/svg"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path><path d="M0 0h24v24H0z" fill="none"></path></svg>
          </button>
          <div class="md-google-search__field-container">
            <input id="search-input" class="md-google-search__field" autocomplete="off" placeholder="Cerca" value="" name="search" type="text" spellcheck="false" style="outline: none;">
          </div>
          <button class="md-google-search__empty-btn" style="display: none;">
            <svg focusable="false" height="24px" viewBox="0 0 24 24" width="24px" xmlns="http://www.w3.org/2000/svg"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path><path d="M0 0h24v24H0z" fill="none"></path></svg>
          </button>

        </div>
      </div>
    </div>

    <div class="autocomplete-container" style="display: none;">
      <div id="autocomplete-list" class="autocomplete-items"></div>
    </div>

    <div id="graf"></div>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/sigma.js/1.2.0/sigma.min.js"></script>


    <!-- Our scripts -->
    <script src="js/autocomplete.js"></script>
    <script src="js/circle-mode.js"></script>
    <script src="js/graf.js"></script>
    <script src="js/limit-years.js"></script>
    <script src="js/search-bar.js"></script>
    <script src="js/dialog.js"></script>
    <script src="js/camera.js"></script>
    <script src="js/just-do-it.js"></script>
    <script src="js/statistics.js"></script>
    <script src="js/init.js"></script>

    <!-- imported scripts -->
    <script defer src="https://code.getmdl.io/1.3.0/material.min.js"></script>

    <!--<script src="js/service-worker.js"></script>-->
  </body>
</html>
