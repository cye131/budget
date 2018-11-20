$(document).ready(function() {


    (function() {
      
        let data = {};
		const account_id = parseInt(new URLSearchParams(window.location.search).get("id"));
		setData('account-id',account_id);
        $('#overlay').show();

        const d1 = $.Deferred(function(dfd) {
          const ajaxTransactionsGetOne = getAJAX(['transactionsGetOne'],[],['transactionsGetOne'],{'account_id': account_id},10000,1);
          ajaxTransactionsGetOne.done(function(res) {
			const transactions = JSON.parse(res).transactionsGetOne;
			/*accounts = accounts.map(function(acct){
				acct.id = parseInt(acct.id);
				acct.nest_level = parseInt(acct.nest_level);
				acct.parent_id = acct.parent_id !== null ? parseInt(acct.parent_id) : null;
				acct.opening_bal = acct.opening_bal !== null ? parseFloat(acct.opening_bal) : null;
				acct.haschild = accounts.map(function(acct2) {if (parseInt(acct2.parent_id) === parseInt(acct.id)) return 1; else return 0;})
					.reduce((a, b) => a + b, 0) > 0 ? true : false;
				return acct;
			});*/
			setData('transactions',transactions);
			console.log('transactions',transactions);
			createTransactionsTable(transactions);
          });
            dfd.resolve(data);
            return dfd.promise();
        });
        
        
		
        $.when(d1).done(function(data1) {
          //$.extend(true,data1);
          //setData(data);
         // var math = $('#heatmap-dates > span.highcharts-title')[0];
         // MathJax.Hub.Queue(["Typeset",MathJax.Hub,math]);
          $('#overlay').hide();
        });
              

	})();
	
	$('#tsTable').on('change','.input-date,.input-description,.input-value,.input-other-account', function() {
		const tr = $(this).closest('tr');
		const inputDate = tr.find('.input-date');
		const inputDescription = tr.find('.input-description');
		const inputValue = tr.find('.input-value');
		const inputOtherAccount = tr.find('.input-other-account');
		const inputDebit = tr.find('.input-debit');
		const inputCredit = tr.find('.input-credit');

		const accounts = getData('accounts-ordered');
		const account_id = getData('account-id');
		const account = accounts.filter(x => x.id == getData('account-id'))[0];
		const otherAccount = accounts.filter(x => x.id == inputOtherAccount.find('option:selected').val())[0];
		
		console.log(inputOtherAccount.find('option:selected').val() === "none");
		
		if (inputOtherAccount.find('option:selected').val() === "none") return;
		if (parseFloat(inputValue.val()) > 0) {
			console.log('Positive value',otherAccount);
			if (account.debit_effect === true) {
				inputDebit.val(account.id);
				inputCredit.val(otherAccount.id);
			}
			else {
				inputDebit.val(otherAccount.id);
				inputCredit.val(account.id);
			}
		} else {
			if (account.debit_effect === true) {
				inputDebit.val(otherAccount.id);
				inputCredit.val( account.id);
			}
			else {
				inputDebit.val(account.id);
				inputCredit.val(otherAccount.id);
			}
            inputValue.val(-1 * inputValue.val());
		}
		
		console.log(inputDescription.val().length);
		if ( !inputDate.val().length || !inputDescription.val().length || !inputValue.val().length || !inputDebit.val().length || !inputCredit.val().length ) {
			console.log("Did not submit");
			return;
		}
		console.log("Submit");
		getAJAX(['transactionsInsertOne'],[],['transactionsInsertOne'],{
			'dataVals': {"0": [inputDate.val(),inputDescription.val(), inputValue.val(),inputDebit.val(),inputCredit.val()]}
		},10000,1).done(function(res) {
			console.log(res);
			getAJAX(['transactionsGetOne'],[],['transactionsGetOne'],{'account_id': account_id},10000,1).done(function(res) {
			const transactions = JSON.parse(res).transactionsGetOne;
			setData('transactions',transactions);
			createTransactionsTable(transactions);
			});
		});

		
	});
	
	$('#tsTable').on('click','.delete', function() {
		const tr = $(this).closest('tr');
		const id = tr.find('td').last().html();
		getAJAX(['transactionsDeleteOne'],[],['transactionsDeleteOne'],{
			'id': id
		},10000,1).done(function(res) {
			console.log(res);
			const account_id = getData('account-id');
			getAJAX(['transactionsGetOne'],[],['transactionsGetOne'],{'account_id': account_id},10000,1).done(function(res) {
			const transactions = JSON.parse(res).transactionsGetOne;
			setData('transactions',transactions);
			createTransactionsTable(transactions);
			});
		});

	});

});


function createTransactionsTable(transactions) {
	var tbl = $('#tsTable');
	var tblData = [];
	
    if ( $.fn.DataTable.isDataTable( tbl ) ) {
      tbl.DataTable().clear().destroy();
    }
	
	const accounts = getData('accounts');
	const account_id = getData('account-id');
	const account = accounts.filter(x => x.id == getData('account-id'))[0];
	
	const otherAccountOptions = accounts.map(function(acct) {
		let opt = acct.id !== account_id ? '<option value="'+acct.id+'"' + (acct.has_child === true ? 'disabled': '') + '>' + '&nbsp;'.repeat(acct.nest_level) + acct.name + '</option>' : '';
		return(opt);
	});
	console.log('account-id',getData('account-id'));
	console.log('account',account);

/*	
	for (var i=0; i<accounts.length;i++) {
		if (accounts[i].nest_level === 1) {
			accountsOrdered.push(accounts[i]);
			continue;
		}
		for (var j=0;j<accountsOrdered.length;j++) {
			if (accountsOrdered[j].id != accounts[i].parent_id) continue;
			accountsOrdered.splice(j+1, 0, accounts[i]);
			break;
		}
	}
*/
	//console.log("accountsOrdered",accountsOrdered);
	/*
	for (var i=0;i<accountsOrdered.length;i++) {
		var j = 1;
		var opening_bal = 0;
		//if no nested elements, just its own balance
		if (accountsOrdered[i].haschild === false)  {
			opening_bal = accountsOrdered[i].opening_bal || 0;
			console.log("NO_NEST");
		}
		//otherwise derive from nested elements
		else {
			while (i+j < accountsOrdered.length -1 && accountsOrdered[i+j].nest_level > accountsOrdered[i].nest_level ) {
				if (accountsOrdered[i+j].haschild === false) {
					console.log(accountsOrdered[i+j].opening_bal);
					opening_bal += accountsOrdered[i+j].opening_bal;
				}
				j++;
				console.log(opening_bal);
			}
			console.log("HAS_NEST");
		}
		accountsOrdered[i].opening_bal = opening_bal.toLocaleString('en-US', {style: 'currency',currency: 'USD',});
	}
	*/

    $.each(transactions,function(i,row) {
        let value = '';
        console.log(row.debit, account_id);
        if ((parseInt(row.debit) === parseInt(account_id) & account.debit_effect === false )|| (parseInt(row.credit) === parseInt(account_id) & account.debit_effect === true )) value = '<span style="color:red"> (' + row.value + ')</span>';
        else value = row.value;
        
        tblData.push([
            row.date + '   <span class="edit">[Edit]</span>   <span class="delete">[Delete]</span>',
            row.description,
            value,
            row.other_account,
            row.debit,
            row.credit,
            row.id
		]);
    });
    console.log("tblData",tblData);

    tbl
        .show()
        .DataTable({
            data: tblData,
            iDisplayLength: 15,
            dom:
                "<'row'<'col-sm-12 col-md-6'B><'col-sm-12 col-md-6'f>>" +
                "<'row'<'col-sm-12 px-0'tr>>" +
                "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
            buttons: [
                'copy', 'csv', 'excel',
            ],
            language: {
                search: "Search a lag value:",
                info: "_START_ - _END_ (_TOTAL_ total rows)"
            },
            columns: [
				{ title: "Date" },
                { title: "Description" },
				{ title: 'Value', searchable: false, type: 'num-fmt'  },
				{ title: 'Other Account', searchable: true  },
                { title: "Debit", searchable: false },
                { title: 'Credit', searchable: false  },
                { title: 'id', searchable: false  },
             ],
            columnDefs: [
				{ orderable: false, targets: '_all' }
			],
            ordering: false,
            pagingType: "full_numbers"
          })
		  .row.add([
			'<input type="text" value ="'+new Date().toISOString().slice(0,10)+'"class="input-date"></input>',
			'<input type="text" class="input-description"></input>',
			'<input type="text" class="input-value"></input>',
			'<select class="input-other-account"><option value="none"></option>'+otherAccountOptions+'</select>',
			'<input type="text" class="input-debit" readonly></input>',
			'<input type="text" class="input-credit" readonly></input>',
			''
		]).draw( false );
		  
      
	var tblRows = tbl.find('tbody tr');
	/*console.log(accountsOrdered);
	for (var i=0; i<accountsOrdered.length; i++) {
		tblRows.eq(i).find('td:first-child').css('padding-left',accountsOrdered[i].nest_level*15+'px');
	}*/
	
    tbl.DataTable().buttons().container()
        .appendTo( '#tsTable_wrapper .col-md-6:eq(0)' )
        .children()
		.removeClass('btn-secondary').addClass('btn-primary');
	
	
}
