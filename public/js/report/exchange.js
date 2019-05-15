$(document).ready(function() {
    fillTable();
    var table2 = '';
    $('#exchanged').wrap("<div class='scrolledTable'></div>");
});

const fillTable = () => {
    table2 = $('#exchanged').DataTable({
        ajax: {
            url: 'rexchanged_item.json',
            dataSrc: ''
        },
        columns: [{
                "data": "trx_id"
            },
            {
                "data": "student_id"
            },
            {
                "data": "orig_item"
            },
            {
                "data": "orig_quantity"
            },
            {
                "data": "orig_or_num"
            },
            {
                "data": "new_item"
            },
            {
                "data": "new_quantity"
            },
            {
                "data": "exchange_price"
            },
            {
                "data": "new_or_num"
            },
        ],
        dom: 'Bfrtip', // Needs button container
        buttons: [{
                extend: 'excel',
                text: 'Excel',
                title: 'PROWARE EXCHANGED ITEM LIST'
            },
            {
                extend: 'pdf',
                text: 'PDF',
                title: 'PROWARE EXCHANGED ITEM LIST'
            }
        ],
    });
}