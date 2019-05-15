$(document).ready(function() {
    fillTable();
    var table = '';
    $('#maintenance').wrap("<div class='scrolledTable'></div>");
});

const fillTable = () => {
    table = $('#maintenance').DataTable({
        ajax: {
            url: 'log_maintenance.json',
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
                "data": "activity"
            },
        ],
        dom: 'Bfrtip', // Needs button container
        buttons: ['excel', 'pdf'],
    });
}