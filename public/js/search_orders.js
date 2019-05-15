$(document).ready(function() {
    fillTable();
    var table = '';
    $(":input").inputmask();
    $('#search').wrap("<div class='scrolledTable'></div>");
});

const fillTable = () => {
    table = $('#search').DataTable({
        ajax: {
            url: 'search_orders.json',
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
        buttons: [],
    });
}