const origItemCode = document.querySelector('#origItem');
const origQuantity = document.querySelector('#origQuantity');
const origSubTotal = document.querySelector('#origSubTotal');
const newItemCode = document.querySelector('#newItem');
const newDesc = document.querySelector('#newDesc');
const newQuantity = document.querySelector('#newQuantity');
const unitPrice = document.querySelector('#unitPrice');
const amount = document.querySelector('#amount');
const exchangeButton = document.querySelector('#exchangeButton');
const exchangeReason = document.querySelector('#exchReason');
const trx = document.querySelector('#trx');

$(document).ready(function() {
    fillTable();
    var table = '';
});


const fillTable = () => {
    table = $('#product').DataTable({
        order: [
            [0, "asc"]
        ],
        ajax: {
            url: 'm_product.json',
            dataSrc: ''
        },
        columns: [{
                "data": "item_code",
            },
            {
                "data": "item_description"
            },
            {
                "data": "type"
            },
            {
                "data": "stock"
            },
            {
                "data": "price"
            },
            {
                "data": "course"
            },
        ],
        dom: 'Bfrtip', // Needs button container
        select: 'single',
        scrollX: true, // Enable altEditor
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
                    newItemCode.value = data[0].item_code;
                    newDesc.value = data[0].item_description;
                    unitPrice.value = data[0].price;
                    $('#exchangeModal').modal('toggle');
                }
            },
        ],
    });
}

const submitValues = () => {
    let total = parseFloat(amount.value);
    let needAdd = '';
    if (total < 0){
        needAdd = false;
    }
    else {
        needAdd = true;
    }
    fetch('http://localhost:3000/proware/exchange_submit', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            origItemCode: origItemCode.value,
            origQuantity: origQuantity.value,
            newItemCode: newItemCode.value,
            newQuantity: newQuantity.value,
            trx_id: trx.value,
            amount: amount.value,
            exchange_reason: exchReason.value,
            status: needAdd ? 'Pending' : 'Success'
        })
    })
    .then(response => response.json())
        .then(status => {
            if (status.isSuccess) {
                $("#exchangeModal").modal('hide');
                $("#showConfirm").modal('toggle');
                table.ajax.reload();
            } else {
                window.alert('ERROR EXCHANGING ITEM!');
            }
        })
        .catch(err => console.log('ERROR!: ', err))
}

exchangeButton.addEventListener('click', submitValues);

newQuantity.addEventListener('input', (e) => {
    if(!e.target.value){
        e.target.value = 0;
    }
    else if (e.target.value > 10){
        e.target.value = 10;
    }
    if(e.target.value <= 10){
    let orgSubTotal = parseFloat(origSubTotal.value);
    let quantity = parseInt(newQuantity.value);
    let price = parseFloat(unitPrice.value);
    let newSubTotal =  parseFloat(quantity * price);
    amount.value = Math.floor(newSubTotal - orgSubTotal).toFixed(2);
    }
});

document.querySelector('#closeButton').addEventListener('click', () => {
    window.location.href = "/proware/exchange_item"
})