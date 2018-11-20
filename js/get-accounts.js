function getAccounts() {
    
    const d1 = $.Deferred(function(dfd) {
        
      const ajaxAccountsGetAll = getAJAX(['accountsGetAll'],[],['accountsGetAll'],{},10000,1);
      
      ajaxAccountsGetAll.done(function(res) {
        let accounts = JSON.parse(res).accountsGetAll;
        //console.log('accounts-init',accounts);
        accounts = accounts.map(function(acct){
            acct.id = parseInt(acct.id);
            acct.nest_level = parseInt(acct.nest_level);
            acct.parent_id = acct.parent_id !== null ? parseInt(acct.parent_id) : null;
            if (acct.debit_effect === '1') acct.debit_effect = true;
            else acct.debit_effect = false ;
            acct.bal = Number(acct.bal);
            acct.total_credit = Number(acct.total_credit);
            acct.total_debit = Number(acct.total_debit);
            
            return acct;
        });
        
        // Max 9 depth levels
        let accountsByDepth = [];
        for (let depth = 0; depth < 10; depth++) {
            accountsByDepth[depth] = [];
        }
        // Place each account in depth level
        // e.g. 0: [acct1, acct3], 1: [acct2], etc
        for (let a = 0; a < accounts.length; a++) {
            accountsByDepth[accounts[a].nest_level - 1].push(accounts[a]);
        }
        //console.log('accountsByDepth', accountsByDepth);
        
        let accountsOrdered = accountsByDepth[0];
        // Iterate through depth levels (above the first level)
        for (let depth = 1; depth < accountsByDepth.length; depth++) {
            // Iterate through accounts in each level and place immediately after parent
            for (let a = 0; a < accountsByDepth[depth].length; a++) {                    
                for (let a2 = 0; a2 < accountsOrdered.length; a2 ++) {
                    if (accountsOrdered[a2].id !== accountsByDepth[depth][a].parent_id) continue;
                    accountsOrdered.splice(a2 + 1, 0, accountsByDepth[depth][a]);
                }
            }
        }
        
//             Order accounts such that each child is after its parent
//			const accountsOrdered = [];
//			for (let i=0; i<accounts.length; i++) {
//				if (accounts[i].nest_level === 1) {
//					accountsOrdered.push(accounts[i]);
//					continue;
//				}
//				for (let j=0;j<accountsOrdered.length;j++) {
//					if (accountsOrdered[j].id != accounts[i].parent_id) continue;
//					accountsOrdered.splice(j+1, 0, accounts[i]);
//					break;
//				}
//			}
        
        
        // Calculate balances
        for (let i=0; i<accountsOrdered.length; i++) {
            let j = 1;
            let bal = 0;
            let total_debit = 0;
            let total_credit = 0;
            //if no nested elements, just its own balance
            if (accountsOrdered[i].has_child === false)  {
                total_debit = accountsOrdered[i].total_debit || 0;
                total_credit = accountsOrdered[i].total_credit || 0;
            }
            //otherwise derive from nested elements
            else {
                while (i+j < accountsOrdered.length /*-1*/ && accountsOrdered[i+j].nest_level > accountsOrdered[i].nest_level ) {
                    if (accountsOrdered[i+j].has_child === false) {
                        total_debit += accountsOrdered[i+j].total_debit || 0;
                        total_credit += accountsOrdered[i+j].total_credit || 0;
                    }
                    j++;
                }
            }
            if (accountsOrdered[i].debit_effect === true) debit_effect = 1;
            else debit_effect = -1;
            bal = total_debit * debit_effect + total_credit*-1*debit_effect;

            accountsOrdered[i].bal = bal;
            accountsOrdered[i].total_debit = total_debit;
            accountsOrdered[i].total_credit = total_credit;
        }

        setData('accounts', accountsOrdered);
        console.log('accounts', accountsOrdered);

        dfd.resolve();
        return dfd.promise();
      });
    });
    
    return d1;
        
}
