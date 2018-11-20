<?php
$varsToBind = [];

$account_id = $fromAjax['account_id'] ?? $fromRouter['account_id'] ?? NULL;

$varsToBind['account_id'] = $account_id;


$transactionsGetOne = $sql->selectToAssoc("
	SELECT transactions.*,IF(credit=:account_id,accounts.name,accounts2.name) AS other_account
	FROM transactions
	LEFT JOIN accounts ON debit = accounts.id
	LEFT JOIN accounts AS accounts2 ON credit = accounts2.id
	WHERE (
		debit = :account_id
		OR 
		credit = :account_id
	);
	",$varsToBind,'');
