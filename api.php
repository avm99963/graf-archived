<?php
require_once("config.php");

class write {
  public static function funct($json) {
    print_r(json_encode($json));
    exit();
  }

  public static function error($n, $msg) {
    self::funct(["error" => $n, "msg" => $msg]);
  }
}

if (!isset($_GET["action"])) {
  write::error(1, "No action provided");
}

switch ($_GET["action"]) {
  case "getgraf":
  $graf = file_get_contents("https://grafo.dirba.io/api.php?req=getGraph");
  echo $graf;
  break;

  default:
  write::error(2, "Unknown action");
}
?>
