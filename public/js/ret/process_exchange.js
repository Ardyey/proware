let itemCode, orNumber, quantity, subTotal = '';
let params = new URLSearchParams(document.location.search.substring(1));
let trx = params.get('trx_id');

$(document).ready(function() {
    fillTable();
    var table = '';
    $('#exchangeItem').wrap("<div class='scrolledTable'></div>");
});

const fillTable = () => {

    table = $('#exchangeItem').DataTable({
        ajax: {
            url: `process_exchange.json?trx_id=${trx}`,
            dataSrc: ''
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
                "data": "sub_total"
            },
            {
                "data": "or_num"
            },
        ],
        dom: 'Bfrtip', // Needs button container
        select: 'single',
        buttons: [{
            extend: 'selected',
            text: 'Exchange',
            name: 'exchange', // do not change name
            attr: {
                id: 'exchange'
            },
            action: () => {
                let data = table.rows({
                    selected: true
                }).data();
                trx = data[0].trx_id;
                itemCode = data[0].item_code;
                itemDesc = data[0].item_description;
                orNumber = data[0].or_num;
                quantity = data[0].quantity;
                subTotal = data[0].sub_total;
                submitItem();
            }
        }],
    });
}

const submitItem = () => {
    $('<form action="/proware/exchange_item_list" method="POST"/>')
        .append($('<input type="hidden" name="trx" value="' + trx + '">'))
        .append($('<input type="hidden" name="itemCode" value="' + itemCode + '">'))
        .append($('<input type="hidden" name="itemDesc" value="' + itemDesc + '">'))
        .append($('<input type="hidden" name="orNumber" value="' + orNumber + '">'))
        .append($('<input type="hidden" name="quantity" value="' + quantity + '">'))
        .append($('<input type="hidden" name="subTotal" value="' + subTotal + '">'))
        .appendTo($(document.body))
        .submit();
}
