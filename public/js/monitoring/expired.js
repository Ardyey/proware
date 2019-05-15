let trx = '';

$(document).ready(function() {
    fillTable();
    var table = '';
    $('#expired').wrap("<div class='scrolledTable'></div>");
});

const fillTable = () => {
    table = $('#expired').DataTable({
        ajax: {
            url: 'mon_expired.json',
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
        ],
        dom: 'Bfrtip', // Needs button container
        select: 'single',
        buttons: [
            {
                extend: 'selected', // Bind to Selected row
                text: 'View Items',
                name: 'view', // do not change name
                attr: {
                    id: 'view'
                },
                action: function() {
                    let data = table.rows({
                        selected: true
                    }).data();
                    window.location.href = `/proware/monitor_view?transaction=${data[0].trx_id}`
                }
            }
        ],
    });
    setInterval(() => {
        window.location.href = `/proware/dashboard`;
    }, 120000);
}