let addForm = document.querySelector('#addForm');
let addButton = document.querySelector('#saveAddButton');
let addProdCode = document.querySelector('#addProdCode');
let addProdType = document.querySelector('#addProdType');
let addProdDesc = document.querySelector('#addProdDesc');
let addProdStock = document.querySelector('#addProdStock');
let addProdPrice = document.querySelector('#addProdPrice');
let addProdImage = document.querySelector('#addProdImage');
let addProdCourse = document.querySelector('#addProdCourse');

let editForm = document.querySelector('#editForm');
let editProdCode = document.querySelector('#editProdCode');
let editProdType = document.querySelector('#editProdType');
let editProdDesc = document.querySelector('#editProdDesc');
let editProdStock = document.querySelector('#editProdStock');
let editProdPrice = document.querySelector('#editProdPrice');
let editProdImage = document.querySelector('#editProdImage');
let editProdFileName = document.querySelector('#editProdFileName');
let editProdCourse = document.querySelector('#editProdCourse');
let editButton = document.querySelector('#saveEditButton');
let fileOrigImage = '';

let prodCode = '';
let deleteButton = document.querySelector('#deleteButton');

const spinner = document.querySelector('.spinner');

$(document).ready(function() {
    fillSelect();
    fillTable();
    var table = '';
    $('.custom-file-input').on('change', function() {
        let fileName = $(this).val().split('\\').pop();
        $(this).next('.custom-file-label').addClass("selected").html(fileName);
    });
    $('.prodCourse').selectpicker();
});

//Getting values from select picker
let fieldsToInsert = '';
$("#addProdCourse").change(function() {
  var values=Array.from($("#addProdCourse").find(':selected')).map(function(item){
      return $(item).val();
   });
   let prodC = values;
  
   fieldsToInsert = prodC.map(field => 
    ({ course: field })); 
   console.log(fieldsToInsert)
});

$("#editProdCourse").change(function() {
  var values=Array.from($("#editProdCourse").find(':selected')).map(function(item){
      return $(item).val();
   });
   let prodC = values;
  
   fieldsToInsert = prodC.map(field => 
    ({ course: field })); 
   console.log(fieldsToInsert)
});



const fillSelect = () => {
    $.ajax({
        url: 'm_product_type.json',
        type: 'get',
        dataType: 'json',
        success: function(json) {
            $.each(json, function(i, value) {
                $('.productOption').append($('<option>').text(value.type).attr('value', value.type));
            });
        }
    });
    $.ajax({
        url: 'm_prod_course.json',
        type: 'get',
        dataType: 'json',
        success: function(json) {
            $.each(json, function(i, value) {
                $('.prodCourse .prodCourse').append($('<option>').text(value.course).attr('value', value.course));
            });
        }
    });
}

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
                text: 'Add',
                name: 'add', // do not change name
                attr: {
                    id: 'add'
                },
                action: function() {
                    $('#addModal').modal('toggle');
                }
            },
            {
                extend: 'selected', // Bind to Selected row
                text: 'Edit',
                name: 'edit', // do not change name
                attr: {
                    id: 'edit'
                },
                action: function() {
                    let data = table.rows({
                        selected: true
                    }).data();
                    $('#editModal').modal('toggle');
                    fileOrigImage = data[0].image;
                    prodCode = data[0].item_code;
                    editProdCode.value = data[0].item_code;
                    editProdType.value = data[0].type;
                    editProdDesc.value = data[0].item_description;
                    editProdPrice.value = data[0].price;
                    editProdStock.value = data[0].stock;
                    editProdFileName.textContent = data[0].image;
                    let course = data[0].course.split(',');
                    console.log(course)
                    $('#editProdCourse').selectpicker('val', course);
                }
            },
            {
                extend: 'selected', // Bind to Selected row
                text: 'Delete',
                name: 'delete', // do not change name
                attr: {
                    id: 'delete'
                },
                action: function() {
                    let data = table.rows({
                        selected: true
                    }).data();
                    prodCode = data[0].item_code;
                    $('#deleteModal').modal('toggle');
                }
            }
        ],
    });
}

checkRadio = () => {
    if (document.querySelector('#optYes').checked) {
        document.querySelector('#editProdImage').removeAttribute('disabled');
        document.querySelector('.editProdImage').removeAttribute('hidden');
        document.querySelector('#warning').setAttribute('hidden', '');
    } else if (document.querySelector('#optNo').checked) {
        document.querySelector('#editProdImage').setAttribute('disabled', '');
        document.querySelector('.editProdImage').setAttribute('hidden', '');
        document.querySelector('#warning').removeAttribute('hidden');
    }
}

checkRadio2 = () => {
   if (document.querySelector('#optYes2').checked) {
        document.querySelector('#addProdImage').removeAttribute('disabled');
        document.querySelector('.addProdImage').removeAttribute('hidden');
        document.querySelector('#warning2').setAttribute('hidden', '');
    } else if (document.querySelector('#optNo2').checked) {
        document.querySelector('#addProdImage').setAttribute('disabled', '');
        document.querySelector('.addProdImage').setAttribute('hidden', '');
        document.querySelector('#warning2').removeAttribute('hidden');
    }
}

addProductToDB = () => {
    spinner.removeAttribute('hidden');
    let fileAddFormData = new FormData();
    let fileAddName = '';
    switch (typeof addProdImage.files[0] == 'undefined') {
        case true:
            break;
        case false:
            fileAddName = addProdImage.files[0].name;
            fileAddFormData.append('addProdImage', addProdImage.files[0], fileAddName);
    }
    let checkFileName = addProdImage.value.split('.').pop();
    if(checkFileName.toLowerCase() == 'jpg' || checkFileName.toLowerCase() == 'jpeg' || checkFileName.toLowerCase() == 'png' || checkFileName.toLowerCase() == '' ){
       fetch('http://localhost:3000/proware/m_aupload', {
            method: 'POST',
            body: fileAddFormData
        })
        .then(response => response.json())
        .then(data => {
            if (data.isSuccess) {
                console.log('success!')
                return fetch('http://localhost:3000/proware/m_addproduct', {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        productCode: addProdCode.value,
                        productType: addProdType.value,
                        productDesc: addProdDesc.value,
                        productPrice: addProdPrice.value,
                        productStock: addProdStock.value,
                        productImage: addProdImage.value,
                        productCourse: fieldsToInsert
                    }),
                })
            }
        })
        .then(response => response.json())
        .then(product => {
            if (product.haveEmpty) {
                window.alert("Please complete the required fields!");
                spinner.setAttribute('hidden', '');
            } else {
                if (product.isSuccess) {
                    fileAddFormData = new FormData();
                    $("#addModal").modal('hide');
                    document.querySelector('#actionResult').innerHTML = "Product Successfully Added!";
                    $("#showConfirm").modal('toggle');
                    table.ajax.reload();
                    $('#addModal').on('hidden.bs.modal', function() {
                        $(this).find(".prodFileName").text('Choose file...').end();
                        addForm.reset();
                        $(".prodCourse").selectpicker("refresh");
                        document.querySelector('#addProdImage').setAttribute('disabled', '');
                        document.querySelector('.addProdImage').setAttribute('hidden', '');
                        document.querySelector('#warning2').removeAttribute('hidden');
                        fieldsToInsert = '';
                    });
                    spinner.setAttribute('hidden', '');
                } else {
                    window.alert('PRODUCT ALREADY EXIST!');
                    addForm.reset();
                    $(".prodCourse").selectpicker("refresh");
                    document.querySelector('#addProdImage').setAttribute('disabled', '');
                    document.querySelector('.addProdImage').setAttribute('hidden', '');
                    document.querySelector('#warning2').removeAttribute('hidden');
                    spinner.setAttribute('hidden', '');
                    fieldsToInsert = '';
                }
            }
        })
        .catch(err => console.log('ERROR!: ', err));
    }
    else {
        alert('Invalid Image');
        spinner.setAttribute('hidden', '');
    }
}

editProductToDB = () => {
    spinner.removeAttribute('hidden');
    let fileEditFormData = new FormData();
    let fileEditName = '';
    switch (typeof editProdImage.files[0] == 'undefined') {
        case true:
            break;
        case false:
            fileEditName = editProdImage.files[0].name
            fileEditFormData.append('editProdImage', editProdImage.files[0], fileEditName);
    }
    let checkFileName = editProdImage.value.split('.').pop();
    if(checkFileName.toLowerCase() == 'jpg' || checkFileName.toLowerCase() == 'jpeg' || checkFileName.toLowerCase() == 'png' || checkFileName.toLowerCase() == '' ){
    fetch('http://localhost:3000/proware/m_eupload', {
        method: 'POST',
        body: fileEditFormData
    })
        .then(response => response.json())
        .then(data => {
            if (data.isSuccess) {
                console.log('success!');
                return fetch('http://localhost:3000/proware/m_editproduct', {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        prodCode: prodCode,
                        prodOrigImage: fileOrigImage,
                        productCode: editProdCode.value,
                        productType: editProdType.value,
                        productDesc: editProdDesc.value,
                        productPrice: editProdPrice.value,
                        productStock: editProdStock.value,
                        productImage: editProdImage.value,
                        productCourse: fieldsToInsert
                    })
                })
            }
        })
        .then(response => response.json())
        .then(product => {
            if (product.haveEmpty) {
                window.alert("Please complete the required fields!");
                spinner.setAttribute('hidden', '');
            } else {
                if (product.isSuccess) {
                    fileEditFormData = new FormData();
                    $("#editModal").modal('hide');
                    document.querySelector('#actionResult').innerHTML = "Product Successfully Edited!";
                    $("#showConfirm").modal('toggle');
                    table.ajax.reload();
                    $('#editModal').on('hidden.bs.modal', function() {
                        $(this).find(".prodFileName").text('Choose file...').end();
                        editForm.reset();
                        fileOrigImage = '';
                        $(".prodCourse").selectpicker("refresh");
                        document.querySelector('#editProdImage').setAttribute('disabled', '');
                        document.querySelector('.editProdImage').setAttribute('hidden', '');
                        document.querySelector('#warning').removeAttribute('hidden');
                        spinner.setAttribute('hidden', '');
                        fieldsToInsert = '';
                    });
                } else {
                    window.alert('Error editing product!');
                    editForm.reset();
                    fileOrigImage = '';
                    $(".prodCourse").selectpicker("refresh");
                    document.querySelector('#editProdImage').setAttribute('disabled', '');
                    document.querySelector('.editProdImage').setAttribute('hidden', '');
                    document.querySelector('#warning').removeAttribute('hidden');
                    spinner.setAttribute('hidden', '');
                    fieldsToInsert = '';
                }
            }
        })
        .catch(err => console.log('ERROR!: ', err));
    }
    else {
        alert('Invalid Image');
        spinner.setAttribute('hidden', '');
    }
}

deleteProductToDB = () => {
    spinner.removeAttribute('hidden');
    fetch('http://localhost:3000/proware/m_deleteproduct', {
            method: 'delete',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                productCode: prodCode,
            })
        })
        .then(response => response.json())
        .then(product => {
            if (product.isSuccess) {
                $("#deleteModal").modal('hide');
                document.querySelector('#actionResult').innerHTML = "Product Successfully Deleted!";
                $("#showConfirm").modal('toggle');
                table.ajax.reload();
                spinner.setAttribute('hidden', '');
            } else {
                window.alert("Error deleting product!");
                spinner.setAttribute('hidden', '');
            }
        })
        .catch(err => console.log('ERROR!: ', err))
}

deleteButton.addEventListener('click', deleteProductToDB)
addButton.addEventListener('click', addProductToDB);
editButton.addEventListener('click', editProductToDB);