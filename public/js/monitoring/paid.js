const successButton = document.querySelector('#successButton');
const cancelButton = document.querySelector('#cancelButton');
const orButton = document.querySelector('#orButton');
const orNumber = document.querySelector('#orNumber');
const orForm = document.querySelector('#orForm');
let trx = '';

$(document).ready(function() {
    fillTable();
    var table = '';
    $('#paid').wrap("<div class='scrolledTable'></div>");
});

const fillTable = () => {
    table = $('#paid').DataTable({
        ajax: {
            url: 'mon_paid.json',
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
            {
                "data": "or_num"
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

successOrder = () => {
    fetch('http://localhost:3000/proware/mon_update', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                trx_id: trx,
                status: "Success",
                orNumber: orNumber.value
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
successButton.addEventListener('click', () => {
    $("#successModal").modal('hide');
    $('#orModal').modal('toggle');
});
orButton.addEventListener('click', successOrder);
cancelButton.addEventListener('click', cancelOrder);