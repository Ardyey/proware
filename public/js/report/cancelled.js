$(document).ready(function() {
    fillTable();
    fillTable2();
    var table = '';
    var table2 = '';
    $('#cancelled').wrap("<div class='scrolledTable'></div>");
    $('#cancelledItem').wrap("<div class='scrolledTable'></div>");

});

const fillTable = () => {
    table = $('#cancelled').DataTable({
        ajax: {
            url: 'rcancelled.json',
            dataSrc: ''
        },
        columns: [{
                "data": "trx_id"
            },
            {
                "data": "student_id"
            },
            {
                "data": "date_created"
            },

        ],
        dom: 'Bfrtip', // Needs button container
        buttons: [{
                extend: 'excel',
                text: 'Excel',
                title: 'PROWARE CANCELLED ORDER LIST'
            },
            {
                extend: 'pdf',
                text: 'PDF',
                title: 'PROWARE CANCELLED ORDER LIST'
            }
        ],
    });
}

const fillTable2 = () => {
    table2 = $('#cancelledItem').DataTable({
        ajax: {
            url: 'rcancelled_item.json',
            dataSrc: ''
        },
        columns: [{
                "data": "trx_id"
            },
            {
                "data": "student_id"
            },
            {
                "data": "date_created"
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
                "data": "sub_total"
            },
        ],
        dom: 'Bfrtip', // Needs button container
        buttons: [{
                extend: 'excel',
                text: 'Excel',
                title: 'PROWARE CANCELLED ITEM LIST'
            },
            {
                extend: 'pdf',
                text: 'PDF',
                title: 'PROWARE CANCELLED ITEM LIST'
            }
        ],
    });
}