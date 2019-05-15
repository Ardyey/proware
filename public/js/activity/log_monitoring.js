$(document).ready(function() {
    fillTable();
    var table = '';
    $('#activityMon').wrap("<div class='scrolledTable'></div>");
});

const fillTable = () => {
    table = $('#activityMon').DataTable({
        ajax: {
            url: 'log_monitoring.json',
            dataSrc: ''
        },
        columns: [{
                "data": "employee_id"
            },
            {
                "data": "date"
            },
            {
                "data": "module"
            },
            {
                "data": "trx_id"
            },
            {
                "data": "activity"
            },
        ],
        dom: 'Bfrtip', // Needs button container
        buttons: ['excel', 'pdf'],
    });
}