function getHistory(accounts) {
    const d1 = $.Deferred(function(dfd) {

      getAJAX(['transactionsGetAll'],[],['transactionsGetAll'],{},10000,1).done(function(res) {
        let transactions = JSON.parse(res).transactionsGetAll;
        // Get array of unique dates
        let dates = [...new Set(transactions.map(x => x.date))];
        console.log('dates', dates);
        
        //Clean up transactions data
        for (i = 0; i < transactions.length; i++) {
            transactions[i].credit = parseInt(transactions[i].credit);
            transactions[i].debit = parseInt(transactions[i].debit);
            transactions[i].id = parseInt(transactions[i].id);
            transactions[i].value = parseFloat(transactions[i].value);
        }
        
        console.log('transactions', transactions);

        
        // Get cumulative bals at all dates for most nested elements
        let chartData = [];
        // Iterate through dates
        for (d = 0; d < dates.length; d++) {
            date = dates[d];
            chartData[d] = [];
            
            // Iterate through acct
            for (a = 0; a < accounts.length; a++) {
                account = accounts[a];
                
                let total_debit = 0;
                let total_credit = 0;
                for (j = 0; j < transactions.length; j++) {
                    // If transaction occured after this date skip
                    if (new Date(transactions[j].date) > new Date(date)) continue;
                    // If transaction does not include this account skip
                     if (transactions[j].debit !== account.id && transactions[j].credit !== account.id) continue;
                     
                     if (transactions[j].debit === account.id) total_debit += transactions[j].value;
                     if (transactions[j].credit === account.id) total_credit += transactions[j].value;
                    //if (account.debit_effect === true) debit_effect = 1;
                    //else debit_effect = -1;
                    //bal += transactions[j].value * debit_effect;
                }
                
                chartData[d].push({
                    account: account.name,
                    date: date,
                    total_debit: total_debit,
                    total_credit: total_credit,
                    has_child: account.has_child,
                    debit_effect: account.debit_effect,
                    nest_level: account.nest_level
                });
            }
        }
        //console.log('chartData', chartData);
        
        
        // Calculate balances (including top-level)
        for (d = 0; d < dates.length; d++) {
            
            let acct = chartData[d];
			for (let i = 0; i < acct.length; i++) {
				let j = 1;
                let bal = 0;
                let total_debit = 0;
                let total_credit = 0;
				//if no nested elements, just its own balance
				if (acct[i].has_child === false)  {
                    total_debit = acct[i].total_debit || 0;
                    total_credit = acct[i].total_credit || 0;
				}
				//otherwise derive from nested elements
				else {
					while (i+j < acct.length && acct[i+j].nest_level > acct[i].nest_level ) {
						if (acct[i+j].has_child === false) {
                            total_debit += acct[i+j].total_debit || 0;
                            total_credit += acct[i+j].total_credit || 0;
						}
						j++;
					}
				}
                if (acct[i].debit_effect === true) debit_effect = 1;
                else debit_effect = -1;
                bal = total_debit * debit_effect + total_credit*-1*debit_effect;

				acct[i].bal = bal;
			}
            
            chartData[d] = acct;
        }
        //console.log('chartData', chartData);
        
        // Rearrange into series-date array
        let chartData2 = {};
        for (let i = 0; i< accounts.length; i++) {
            chartData2[accounts[i].name] = [];
        }
        for (let d = 0; d < chartData.length; d++) {
			for (let i = 0; i < chartData[d].length; i++) {
                chartData2[chartData[d][i].account].push([
                    new Date(chartData[d][i].date).getTime(),
                    chartData[d][i].bal
                ]);
            }
        }
        
        console.log('history', chartData2);
        setData('history', chartData2);
        });
        dfd.resolve(data);
        return dfd.promise();
    });
    
    return d1;
}