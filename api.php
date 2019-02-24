<?php
require_once("config.php");

class write {
  public static function output($json) {
    print_r(json_encode($json));
    exit();
  }

  public static function error($n, $msg) {
    self::output(["error" => $n, "msg" => $msg]);
  }
}

function get_graph() {
  global $conf;
  return json_decode(file_get_contents($conf["apiurl"]), true);
}

if (!isset($_GET["action"])) {
  write::error(1, "No action provided");
}

switch ($_GET["action"]) {
  case "getgraf":
  $graf = file_get_contents($conf["apiurl"]);
  echo $graf;
  break;

  default:
  write::error(2, "Unknown action");
}
?>
