const paidButton = document.querySelector('#paidButton');
const orButton = document.querySelector('#orButton');
const cancelButton = document.querySelector('#cancelButton');
const orNumber = document.querySelector('#orNumber');
const orForm = document.querySelector('#orForm');

let trx = '';

$(document).ready(function() {
    fillTable();
    var table = '';
    $('#approved').wrap("<div class='scrolledTable'></div>");
});

const fillTable = () => {
    table = $('#approved').DataTable({
        language: {
            emptyTable: "No data available in table"
        },
        ajax: {
            url: 'mon_approved.json',
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
        buttons: [{
                extend: 'selected',
                text: 'Paid',
                name: 'paid', // do not change name
                attr: {
                    id: 'paid'
                },
                action: function() {
                    let data = table.rows({
                        selected: true
                    }).data();
                    trx = data[0].trx_id;
                    $('#paidModal').modal('toggle');
                }
            },
            {
                extend: 'selected', // Bind to Selected row
                text: 'Cancel',
                name: 'cancel', // do not change name
                attr: {
                    id: 'cancel'
                },
                action: function() {
                    let data = table.rows({
                        selected: true
                    }).data();
                    trx = data[0].trx_id;
                    $('#cancelModal').modal('toggle');
                }
            },
            {
                extend: 'selected', // Bind to Selected row
                text: 'View Items',
                name: 'view', // do not change name
                attr: {
                    id: 'view'
                },
                action: () => {
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

paidOrder = () => {
    fetch('http://localhost:3000/proware/mon_update', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                trx_id: trx,
                status: "Paid"
            }),
        })
        .then(response => response.json())
        .then(status => {
            if (status.isSuccess) {
                $("#paidModal").modal('hide');
                document.querySelector('#actionResult').innerHTML = "Order Successfully Updated!";
                $("#showConfirm").modal('toggle');
                table.ajax.reload();
                orForm.reset();
            } else {
                window.alert('ERROR EDITING ORDER!');
                orForm.reset();
            }
        })
        .catch(err => console.log('ERROR!: ', err));
}

cancelOrder = () => {
    fetch('http://localhost:3000/proware/mon_update', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                trx_id: trx,
                status: "Cancelled"
            }),
        })
        .then(response => response.json())
        .then(status => {
            if (status.isSuccess) {
                $("#cancelModal").modal('hide');
                document.querySelector('#actionResult').innerHTML = "Order Successfully Updated!";
                $("#showConfirm").modal('toggle');
                table.ajax.reload();

            } else {
                window.alert('ERROR EDITING ORDER!');
            }
        })
        .catch(err => console.log('ERROR!: ', err));
}
paidButton.addEventListener('click', paidOrder);
cancelButton.addEventListener('click', cancelOrder);