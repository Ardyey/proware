$(document).ready(function() {
    fillTable();
    var table = '';
    $('#exchange').wrap("<div class='scrolledTable'></div>");
});

const fillTable = () => {
    table = $('#exchange').DataTable({
        ajax: {
            url: 'exchange_item.json',
            dataSrc: ''
        },
        columns: [{
                "data": "trx_id",
            },
            {
                "data": "student_id"
            },
            {
                "data": "date_purchased"
            },
            {
                "data": "or_num"
            },
        ],
        dom: 'Bfrtip', // Needs button container
        select: 'single',
        buttons: [{
            extend: 'selected',
            text: 'View Items',
            name: 'view', // do not change name
            attr: {
                id: 'view'
            },
            action: () => {
                let data = table.rows({
                    selected: true
                }).data();
                window.location.href = `/proware/process_exchange?trx_id=${data[0].trx_id}`
            }
        }],
    });
}