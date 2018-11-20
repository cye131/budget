$(document).ready(function() {


    (function() {
      
        $('#overlay').show();
		
        const dfdAccounts = getAccounts();
        		
        $.when(dfdAccounts).done(function() {
            const accounts = getData('accounts');
            const dfdHistory = getHistory(accounts);
            $.when(dfdHistory).done(function() {
                const history = getData('history');
                createAccountsTable(accounts, history);
                buildGraph(history);
                $('#overlay').hide();
            });
            //const accounts = getData('accounts');
			//createAccountsTable(accounts);
            //buildGraph(accounts);
        });
              

	})();
	
});


function createAccountsTable(accounts, history) {
	const tbl = $('#tsTable');
    const today = new Date();
    const thirtyDaysAgo = new Date().setDate(today.getDate() - 30);
	var tblData = [];
	
    if ( $.fn.DataTable.isDataTable( tbl ) ) {
      tbl.DataTable().clear().destroy();
    }

    $.each(accounts,function(i,row) {
        //console.log(row.debit_effect, row.id, row.bal);
        let balThirtyDaysAgo = 0;
        let changeThirtyDays = 0;
        for (d = 0; d < history[row.name].length; d++) {
            //console.log(new Date(history[row.name][d][0]));
            if (history[row.name][d][0] < thirtyDaysAgo) {
                //console.log('Older');
                balThirtyDaysAgo = d > 0 ? history[row.name][d][1] : 0;
            }
        }
        changeThirtyDays = row.bal - balThirtyDaysAgo;

        
        tblData.push([
            row.name + (row.has_child === false ?  ' <a style="font-size:14px;font-weight:bold" href="transactions?id='+row.id+'">&plus;</a>' : ''),
            changeThirtyDays.toLocaleString('en-US', {style: 'currency',currency: 'USD',}),
            1,
            row.bal.toLocaleString('en-US', {style: 'currency',currency: 'USD',})
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
                search: "Search account name:",
                info: "_START_ - _END_ (_TOTAL_ total rows)"
            },
            columns: [
                { title: "Account Name" },
                { title: 'Change - Last 30 Days', searchable: false  },
                { title: 'Total Credits', searchable: false  },
                { title: 'Current Bal', searchable: false, type: 'num-fmt'  }
             ],
            columnDefs: [
				{ orderable: false, targets: '_all' }
			],
            ordering: false,
            paging: false
          });
      
	var tblRows = tbl.find('tbody tr');
	for (var i=0; i<accounts.length; i++) {
		tblRows.eq(i).find('td:first-child').css('padding-left',accounts[i].nest_level*15+'px');
	}
	
    tbl.DataTable().buttons().container()
        .appendTo( '#tsTable_wrapper .col-md-6:eq(0)' )
        .children()
		.removeClass('btn-secondary').addClass('btn-primary');
	
	
}