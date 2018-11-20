<?php
$varsToBind = [];

$id = $fromAjax['id'] ?? $fromRouter['id'] ?? NULL;

$varsToBind['id'] = $id;

$transactionsDeleteOne = $sql->delete("
	DELETE FROM transactions
	WHERE id = :id
	",$varsToBind,'');
