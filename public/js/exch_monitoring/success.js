let trx, item_code = '';

$(document).ready(function() {
    fillTable();
    var table = '';
    $('#success').wrap("<div class='scrolledTable'></div>");
});

const fillTable = () => {
    table = $('#success').DataTable({
        ajax: {
            url: 'exch_success.json',
            dataSrc: ''
        },
        columns: [{
                "data": "trx_id",
            },
            {
                "data": "item_code"
            },
            {
                "data": "quantity"
            },
            {
                "data": "exchange_price"
            },
            {
                "data": "exch_or_num"
            },
        ],
        dom: 'Bfrtip', // Needs button container
        select: 'single',
        buttons: [],
    });
    setInterval(() => {
        table.ajax.reload();
    }, 5000);
}
