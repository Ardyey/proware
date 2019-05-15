const cancelButton = document.querySelector('#cancelButton');

$(document).ready(function() {
    fillTable();
    var table = '';
    $('#cancelled').wrap("<div class='scrolledTable'></div>");
    filterByDate();
});

const fillTable = () => {
    table = $('#cancelled').DataTable({
        ajax: {
            url: 'mon_cancelled.json',
            dataSrc: ''
        },
        columns: [{
                "data": "trx_id",
            },
            {
                "data": "student_id"
            },
            {
                "data": "date_created"
            },
            {
                "data": "status"
            },
            {
                "data": "or_num"
            },
        ],
        dom: 'Bfrtip', // Needs button container
        select: 'single',
        buttons: [
            {
                extend: 'selected', // Bind to Selected row
                text: 'View Items',
                name: 'view', // do not change name
                attr: {
                    id: 'view'
                },
                action: () => {
                let data = table.rows({
                    selected: true
                }).data();
                window.location.href = `/proware/monitor_view?transaction=${data[0].trx_id}`
                }
            }],
    });
    setInterval(() => {
        window.location.href = `/proware/dashboard`;
    }, 120000);
}

const filterByDate = () => {
    $.fn.dataTable.ext.search.push(
        function(settings, data, dataIndex) {
            var min = $('#min').datepicker("getDate");
            var max = $('#max').datepicker("getDate");
            var startDate = new Date(data[2]); //data[2] is the column where date is located
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

const clearDate = () => {
    document.querySelector('#min').value = "";
    document.querySelector('#max').value = "";
    $('#min').datepicker('setDate', null);
    $('#max').datepicker('setDate', null);
    $.datepicker._clearDate('#min');
    $.datepicker._clearDate('#max');
}

document.querySelector('#clearDates').addEventListener('click', clearDate);