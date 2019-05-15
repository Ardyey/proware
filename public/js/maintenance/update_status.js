let prodCode, status = '';

$(document).ready(function() {
    fillTable();
    var table = '';
    $('#product').wrap("<div class='scrolledTable'></div>");
});

const fillTable = () => {
    table = $('#product').DataTable({
        order: [
            [2, "asc"]
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
                "data": "price"
            },
            {
                "data": "stock"
            },
            {
                "data": "image"
            },
            {
                "data": "course"
            },
            {
                "data": "status"
            },
        ],
        dom: 'Bfrtip', // Needs button container
        select: 'single',
        scrollX: true, // Enable altEditor
        buttons: [{
        				extend: 'selected',
                text: 'Toggle Status',
                name: 'status', // do not change name
                attr: {
                    id: 'status'
                },
                action: function() {
                	let data = table.rows({
                        selected: true
                    }).data();
                    $('#toggleModal').modal('toggle');
                    prodCode = data[0].item_code;
                    status = data[0].status;
                }
            }
        ],
    });
}

const toggleStatus = () => {
	let newStatus = '';
	if(status.toLowerCase() == 'active'){
		newStatus = 'Inactive';
	}
	else if (status.toLowerCase() == 'inactive') {
		newStatus = 'Active';
	}
	fetch('http://localhost:3000/proware/m_updatestatus', {
      method: 'post',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          prodCode: prodCode,
          status: newStatus
      })
  })
  .then(response => response.json())
  .then(data => {
      if (data.isSuccess) {
          $("#toggleModal").modal('hide');
          document.querySelector('#actionResult').innerHTML = `Product ${newStatus}!`;
          $("#showConfirm").modal('toggle');
          table.ajax.reload();
      } else {
          window.alert("Error updating status!");
      }
  })
  .catch(err => console.log('ERROR!: ', err))
}

document.querySelector('#toggleButton').addEventListener('click', toggleStatus);