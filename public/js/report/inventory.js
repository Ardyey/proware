$(document).ready(function() {
    fillTable();
    fillTable2();
    var table = '';
    $('#moving').wrap("<div class='scrolledTable'></div>");
    $('#non_moving').wrap("<div class='scrolledTable'></div>");
});

const fillTable = () => {
    table = $('#moving').DataTable({
        ajax: {
            url: 'moving.json',
            dataSrc: ''
        },
        columns: [{
                "data": "item_code"
            },
            {
                "data": "item_description"
            },
            {
                "data": "stock"
            },
            {
                "data": "price"
            },
            {
                "data": "last_updated"
            },
        ],
        dom: 'Bfrtip', // Needs button container
        buttons: [{
                extend: 'excel',
                text: 'Excel',
                title: 'PROWARE MOVING ITEM INVENTORY'
            },
            {
                extend: 'pdf',
                text: 'PDF',
                title: 'PROWARE MOVING ITEM INVENTORY'
            }],
    });
}

const fillTable2 = () => {
    table = $('#non_moving').DataTable({
        ajax: {
            url: 'non-moving.json',
            dataSrc: ''
        },
        columns: [{
                "data": "item_code"
            },
            {
                "data": "item_description"
            },
            {
                "data": "stock"
            },
            {
                "data": "price"
            },
            {
                "data": "last_updated"
            },
        ],
        dom: 'Bfrtip', // Needs button container
        buttons: [{
                extend: 'excel',
                text: 'Excel',
                title: 'PROWARE NON-MOVING ITEM INVENTORY'
            },
            {
                extend: 'pdf',
                text: 'PDF',
                title: 'PROWARE NON-MOVING ITEM INVENTORY'
            }],
    });
}