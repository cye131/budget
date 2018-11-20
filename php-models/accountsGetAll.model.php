<?php

$accountsGetAll = $sql->selectToAssoc("
	SELECT accounts.*, 
		IFNULL(debitsum,0) AS total_debit, IFNULL(creditsum,0) AS total_credit, 
		IFNULL(debitsum,0) * debit_effect + IFNULL(creditsum,0) * -1*debit_effect AS 'bal'
    FROM accounts
	LEFT JOIN (
	  SELECT debit, sum(value) AS debitsum
	  FROM transactions
	  GROUP BY debit
	) AS t1 ON (t1.debit = id) 
	LEFT JOIN (
	  SELECT credit, sum(value) AS creditsum
	  FROM transactions
	  GROUP BY credit
	) AS t2 ON (t2.credit = id) 
	ORDER BY nest_level,id ASC
	",'','');


// Add has_child	
$accountsGetAll = array_map(function($account) use ($accountsGetAll){
	
	$account['has_child'] = array_sum(
		array_map(function($parent_id) use ($account){
			return $account['id'] === $parent_id ? 1 : 0;
		},array_column($accountsGetAll,'parent_id'))
	) > 0 ? true : false;
	
	return $account;

},$accountsGetAll);

/*
$accounts = $accountsGetAll;
// Order the accounts correctly
$accountsOrdered = [];
foreach ($accounts as $account) {
	if($account['id'] > 6) continue;
	
	if ($account['nest_level'] == 1) {
		array_push($accountsOrdered,$account);
	} else {
		print_r($accountsOrdered);
		for ($j=0;$j<count($accountsOrdered);$j++) {
			//print_r($accountsOrdered[$j]);
			if ($accountsOrdered[$j]['id'] != $account['parent_id']) continue;
			//else echo 'YES';
			array_splice($accountsOrdered,$j, 0, $account);
			break;
		}
	}
}

/*
for (let i=0;i<accountsOrdered.length;i++) {
	let j = 1;
	let opening_bal = 0;
	//if no nested elements, just its own balance
	if (accountsOrdered[i].haschild === false)  {
		opening_bal = accountsOrdered[i].opening_bal || 0;
		//console.log("NO_NEST");
	}
	//otherwise derive from nested elements
	else {
		while (i+j < accountsOrdered.length -1 && accountsOrdered[i+j].nest_level > accountsOrdered[i].nest_level ) {
			if (accountsOrdered[i+j].haschild === false) {
				//console.log(accountsOrdered[i+j].opening_bal);
				opening_bal += accountsOrdered[i+j].opening_bal;
			}
			j++;
			//console.log(opening_bal);
		}
		//console.log("HAS_NEST");
	}
	accountsOrdered[i].opening_bal = opening_bal;
}
*/




