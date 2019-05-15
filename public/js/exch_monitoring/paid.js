const successButton = document.querySelector('#successButton');
const cancelButton = document.querySelector('#cancelButton');
const orButton = document.querySelector('#orButton');
const orNumber = document.querySelector('#orNumber');
const orForm = document.querySelector('#orForm');

let trx, item_code = '';

$(document).ready(function() {
    fillTable();
    var table = '';
    $('#paid').wrap("<div class='scrolledTable'></div>");
});

const fillTable = () => {
    table = $('#paid').DataTable({
        ajax: {
            url: 'exch_paid.json',
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
                text: 'Success',
                name: 'success', // do not change name
                attr: {
                    id: 'success'
                },
                action: function() {
                    let data = table.rows({
                        selected: true
                    }).data();
                    trx = data[0].trx_id;
                    item_code = data[0].item_code;
                    $('#successModal').modal('toggle');
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

successOrder = () => {
    fetch('http://localhost:3000/proware/exch_update', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                trx_id: trx,
                status: "Success",
                orNumber: orNumber.value,
                item_code: item_code
            }),
        })
        .then(response => response.json())
        .then(status => {
            if (status.isSuccess) {
                $("#orModal").modal('hide');
                document.querySelector('#actionResult').innerHTML = "Order Successfully Updated!";
                $("#showConfirm").modal('toggle');
                table.ajax.reload();
            } else {
                window.alert('ERROR EDITING ORDER!');
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

successButton.addEventListener('click', () => {
    $("#successModal").modal('hide');
    $('#orModal').modal('toggle');
});
orButton.addEventListener('click', successOrder);
cancelButton.addEventListener('click', cancelOrder);