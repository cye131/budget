<?php
spl_autoload_register('myAutoloader');
function myAutoloader($classname) {
  require_once __DIR__."/../php-classes/$classname.class.php";
}
require_once __DIR__.'/../vendor/autoload.php';
/* Exit if not AJAX
 *
 *
 *
 */
if(empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) != 'xmlhttprequest') {
  echo 'Not AJAX';
  return;
}
/* Execute PHP code
 *
 *
 *
 */
$model = $_POST['model'] ?? [];
$logic = $_POST['logic'] ?? [];
$fromAjax = $_POST['fromAjax'] ?? [];
$toScript = $_POST['toScript'] ?? [];
if (count($model) > 0) {
  $sql = new MyPDO();
  foreach ($model as $m) {
    if (isset($errMsg)) break;
    require_once(__DIR__."/../php-models/$m.model.php");
    }
}
if (count($logic) > 0) {
  foreach ($logic as $l) {
    if (isset($errMsg)) break;
    require_once(__DIR__."/../php-logic/$l.logic.php");
  }
}
/* Send to script
 *
 *
 *
 */
$res = [];
if (isset($toScript)) {
  foreach ($toScript as $varName) {
    $res[$varName] = (${$varName}); 
  }  
}
if (isset($errMsg)) $res['errMsg'] = $errMsg;
echo json_encode($res);