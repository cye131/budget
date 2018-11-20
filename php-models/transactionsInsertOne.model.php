<?php
$dataVals = $fromAjax['dataVals'] ?? $fromRouter['dataVals'] ?? NULL;
print_r($dataVals);

$transactionsInsertOne = $sql->multipleInsert('transactions',['date','description','value','debit','credit'],$dataVals);