const returnButton = document.querySelector('#returnButton');
const rrButton = document.querySelector('#rrButton');
const returnReason = document.querySelector('#returnReason');
const returnForm = document.querySelector('#returnForm');
let itemCode, orNumber = '';
let params = new URLSearchParams(document.location.search.substring(1));
let trx = params.get('trx_id');

$(document).ready(function() {
    fillTable();
    var table = '';
    $('#returnItem').wrap("<div class='scrolledTable'></div>");
});

const fillTable = () => {

    table = $('#returnItem').DataTable({
        ajax: {
            url: `process_return.json?trx_id=${trx}`,
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
            text: 'Return',
            name: 'return', // do not change name
            attr: {
                id: 'return'
            },
            action: () => {
                let data = table.rows({
                    selected: true
                }).data();
                trx = data[0].trx_id;
                itemCode = data[0].item_code;
                orNumber = data[0].or_num;
                $('#returnModal').modal('toggle');
            }
        }],
    });
}

returnOrder = () => {
    fetch('http://localhost:3000/proware/item_return', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                trx_id: trx,
                itemCode: itemCode,
                status: "Returned",
                orNumber: orNumber,
                returnReason: returnReason.value
            }),
        })
        .then(response => response.json())
        .then(status => {
            if (status.isSuccess) {
                $("#reasonModal").modal('hide');
                document.querySelector('#actionResult').innerHTML = "Item Successfully Returned!";
                $("#showConfirm").modal('toggle');
                table.ajax.reload();
                returnForm.reset();
            } else {
                window.alert('ERROR RETURNING ITEM!');
                returnForm.reset();
            }
        })
        .catch(err => console.log('ERROR!: ', err));
}
returnButton.addEventListener('click', () => {
    $("#returnModal").modal('hide');
    $('#reasonModal').modal('toggle');
});
rrButton.addEventListener('click', returnOrder);