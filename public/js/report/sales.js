const clearButton = document.querySelector('#clearDates');

$(document).ready(function() {
    fillTable();
    var table = '';
    $('#sales').wrap("<div class='scrolledTable'></div>");
    filterByDate();

});

const filterByDate = () => {
    $.fn.dataTable.ext.search.push(
        function(settings, data, dataIndex) {
            var min = $('#min').datepicker("getDate");
            var max = $('#max').datepicker("getDate");
            var startDate = new Date(data[5]); //data[5] is the column where date is located
            if (min == null && max == null) {
                return true;
            }
            if (min == null && startDate <= max) {
                return true;
            }
            if (max == null && startDate >= min) {
                return true;
            }
            if (startDate <= max && startDate >= min) {
                return true;
            }
            return false;
        }
    );

    $("#min").datepicker({
        onSelect: function() {
            table.draw();
        },
        changeMonth: true,
        changeYear: true
    });
    $("#max").datepicker({
        onSelect: function() {
            table.draw();
        },
        changeMonth: true,
        changeYear: true
    });

    // Event listener to the two range filtering inputs to redraw on input
    $('#min, #max').change(function() {
        table.draw();
    });
}

const fillTable = () => {
    table = $('#sales').DataTable({
        ajax: {
            url: 'rsales.json',
            dataSrc: ''
        },
        "footerCallback": function ( row, data, start, end, display ) {
            var api = this.api(), data;
 
            // Remove the formatting to get integer data for summation
            var intVal = function ( i ) {
                return typeof i === 'string' ?
                    i.replace(/[\$,]/g, '')*1 :
                    typeof i === 'number' ?
                        i : 0;
            };
 
            // Total over all pages
            total = api
                .column( 4 )
                .data()
                .reduce( function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0 );
 
            // Total over this page
            pageTotal = api
                .column( 4, { page: 'current'} )
                .data()
                .reduce( function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0 );
 
            // Update footer
            $( api.column( 4 ).footer() ).html(
                'P'+pageTotal.toFixed(2) +'<br/> ( P'+ total.toFixed(2) +' total)'
            );
        },
        columns: [{
                "data": "trx_id",
            },
            {
                "data": "item_code"
            },
            {
                "data": "item_description"
            },
            {
                "data": "quantity"
            },
            {
                "data": "sales"
            },
            {
                "data": "date_purchased"
            },
        ],
        dom: 'Bfrtip', // Needs button container
        buttons: [
            { extend: 'excel', footer: true },
            { extend: 'pdf', footer: true }],
    });
}

const clearDate = () => {
    document.querySelector('#min').value = "";
    document.querySelector('#max').value = "";
    $('#min').datepicker('setDate', null);
    $('#max').datepicker('setDate', null);
    $.datepicker._clearDate('#min');
    $.datepicker._clearDate('#max');
}

clearButton.addEventListener('click', clearDate);