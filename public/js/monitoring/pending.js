const approveButton = document.querySelector('#approveButton');
const cancelButton = document.querySelector('#cancelButton');

let trx = '';

$(document).ready(function() {
    fillTable();
    var table = '';
    $('#pending').wrap("<div class='scrolledTable'></div>");
});

const fillTable = () => {
    table = $('#pending').DataTable({
        ajax: {
            url: 'mon_pending.json',
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
                text: 'Approve',
                name: 'approve', // do not change name
                attr: {
                    id: 'approve'
                },
                action: function() {
                    let data = table.rows({
                        selected: true
                    }).data();
                    if(data[0].trx_id == 'Checkout Pending'){
                        window.alert('ORDER HAS NOT BEEN CHECKED OUT!');
                    } else {
                        trx = data[0].trx_id;
                        $('#approveModal').modal('toggle'); 
                    }
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

approveOrder = () => {
    fetch('http://localhost:3000/proware/mon_update', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                trx_id: trx,
                status: "Approved"
            }),
        })
        .then(response => response.json())
        .then(status => {
            if (status.isSuccess) {
                $("#approveModal").modal('hide');
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

approveButton.addEventListener('click', approveOrder);
cancelButton.addEventListener('click', cancelOrder);