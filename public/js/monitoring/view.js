let params = new URLSearchParams(document.location.search.substring(1));
let trx = params.get('transaction');

$(document).ready(function() {
    fillTable();
    var table = '';
    $('#product').wrap("<div class='scrolledTable'></div>");
});

const fillTable = () => {
    table = $('#product').DataTable({
        ajax: {
            url: `mon_view.json?transaction=${trx}`,
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
                "data": "status"
            },
        ],
        dom: 'Bfrtip', // Needs button container
        select: 'single',
        buttons: [
            {
                text: 'Back to Previous',
                name: 'back', // do not change name
                attr: {
                    id: 'back'
                },
                action: () => {
                window.history.back();
                }
            }],
    });
    setInterval(() => {
        window.location.href = `/proware/dashboard`;
    }, 120000);
}