$(document).ready(function() {

    /* Highlights navigation bar menu item if it's active */
    (function(){
      var pathname = window.location.pathname;
      var dd = false;
      var navbar = $('#navbar');
      
      navbar.find('a.dropdown-item').each(function(i,el) {
          if ($(el).attr("href") === pathname) {
            $(el).addClass('active');
            $(el).closest('li.nav-item').addClass('active');
            dd = true;
            return false;
          }
        });
        
        if (dd === true) return;
        
        navbar.find('li.nav-item').each(function(i,el){
          var a = $(el).find('a:first');
          if (a.attr("href") === pathname) {
              $(el).addClass('active');
              return false;
          }
        });
    })();

    
});

/* VDOM
 *
 *
 *
 */
function getData(k) {
	var data = JSON.parse(sessionStorage.getItem('data'));
	return data[k];
}

function setData(k,d) {
	var data;
	if (sessionStorage.getItem('data') === null) data = {};
	else data = JSON.parse(sessionStorage.getItem('data'));
	
	data[k] = d;
	sessionStorage.setItem('data',JSON.stringify(data));
}


/* Validation
 *
 *
 *
 */

function isJson(item) {
    item = typeof item !== "string"
        ? JSON.stringify(item)
        : item;

    try {
        item = JSON.parse(item);
    } catch (e) {
        return false;
    }

    if (typeof item === "object" && item !== null) {
        return true;
    }

    return false;
}



/* DOM Manipulation
 *
 *
 *
 */






/* AJAX
 *
 *
 *
 */
function getAJAX(model,logic,toScript,fromAjax,timeout,disableOverlay) {    
    var timerStart = Date.now();
    if (!disableOverlay) $('#overlay').show();
    return $.ajax({
        url: 'routerAjax.php',
        type: 'POST',
        data: {
            model: model,
            logic: logic,
            toScript: toScript,
            fromAjax: fromAjax
            },
        dataType: 'html',
        cache: false,
        timeout: timeout
    })
    .fail(function(res) {
      console.log(res);
      console.log('AJAX Error');
    })
    .always(function(res) {
        if (!disableOverlay) $('#overlay').hide();
        console.log('AJAX Time: '+ (Date.now()-timerStart) );
        //if (isJson(res) === false ) alert(res);
    });
}






/* Storage
 *
 *
 *
 */
function getColorArray() {
    return ['#4572A7', '#AA4643', '#0ba828', '#80699B', '#3D96AE','#DB843D', '#92A8CD', '#A47D7C', '#B5CA92',"#7cb5ec", "#434348", "#90ed7d", "#f7a35c", "#8085e9", "#f15c80", "#e4d354", "#2b908f", "#f45b5b", "#91e8e1"];
}


function getDataTablesOptions() {
  var o = {
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
            columnDefs: [{
            }],
            order: [ 0, "asc" ],
            pagingType: "full_numbers"
          };
  return o;
}

function getHighChartsOptions() {
  var o = {
        chart: {
            style: {
              fontFamily: 'inherit'
            },
        },
        title: {
            style: {
              fontFamily: 'inherit'
            }
        }
  };
        
  return o;
}






/* Misc
 *
 *
 *
 */
function arrayColumn(array, columnName) {
    return array.map(function(value,index) {
        return value[columnName];
    })
}


function getCorrName(corr_type) {
    if (corr_type === 'rho') return "Pearson's Correlation Coefficient";
    else if (corr_type === 'ktau') return "Kendall's &#120591; Coefficient";
    else if (corr_type === 'mic') return "Maximal Information Coefficient";
    else if (corr_type === 'srho') return "Spearman's Rho";
}

function getCorrMath(corr_type) {
    if (corr_type === 'rho') return "Pearson's Correlation Coefficient";
    else if (corr_type === 'ktau') return " \\tau = \\frac{2}{n(n-1)} \\sum_{i=1}^{N} \\sum_{j=i}^{N} \\begin{cases} 1, & \\text{if } (x_i > x_j \\text{ and } y_j > y_j)  \\text{ or } (x_i < x_j \\text{ and } y_j < y_j)  \\\\0, &\\text{if } x_i = x_j \\text{ or } y_i = y_j  \\\\-1, &\\text{otherwise} \\end{cases}";
    else if (corr_type === 'mic') return "Maximal Information Coefficient";
    else if (corr_type === 'srho') return "Spearman's Rho";
}

//    else if (corr_type === 'ktau') return "\\tau = \\sum_{i=1}^{N} \\sum_{j=i}^{N} \\begin{cases} -1, & \\text{if} & x_i > x_j \\implies x_j > y_j & \\text{or} x_i < x_j \\implies x_j < y_j  \\\\0, & \\text{x_i = x_j) & \\text{or} & \\text{y_i = y_j}  \\\\ 1, & \\text{otherwise} \\end{cases}";