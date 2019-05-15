const paidButton = document.querySelector('#paidButton');
const orButton = document.querySelector('#orButton');
const cancelButton = document.querySelector('#cancelButton');
const orNumber = document.querySelector('#orNumber');
const orForm = document.querySelector('#orForm');

let trx, item_code = '';

$(document).ready(function() {
    fillTable();
    var table = '';
    $('#pending').wrap("<div class='scrolledTable'></div>");
});

const fillTable = () => {
    table = $('#pending').DataTable({
        ajax: {
            url: 'exch_pending.json',
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
                    item_code = data[0].item_code;
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
                    item_code = data[0].item_code;
                    $('#cancelModal').modal('toggle');
                }
            }
        ],
    });
    setInterval(() => {
        table.ajax.reload();
    }, 5000);
}

paidOrder = () => {
    fetch('http://localhost:3000/proware/exch_update', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                trx_id: trx,
                status: "Paid",
                item_code: item_code
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
    fetch('http://localhost:3000/proware/exch_update', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                trx_id: trx,
                status: "Cancelled",
                item_code: item_code
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