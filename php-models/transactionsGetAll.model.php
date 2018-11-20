<?php

$varsToBind = [];

//$account_ids = $fromAjax['account_ids'] ?? $fromRouter['account_ids'] ?? NULL;



$transactionsGetAll = $sql->selectToAssoc("
	SELECT *
	FROM transactions
    ORDER by date ASC
	",$varsToBind,'');
