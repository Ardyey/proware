let catStatus = document.querySelector('#catStatus');

let addButton = document.querySelector('#saveAddButton');
let addCat = document.querySelector('#addCat');
let addStatus = document.querySelector('#addStatus');

let editButton = document.querySelector('#saveEditButton');
let editCat = document.querySelector('#editCat');
let editStatus = document.querySelector('#editStatus');

let catID = '';
let deleteButton = document.querySelector('#deleteButton');

$(document).ready(function() {
    fillTable();
    var table = '';
    fillSelect();
    $('#category').wrap("<div class='scrolledTable'></div>");
});

const fillSelect = () => {
    $.ajax({
        url: 'm_category.json',
        type: 'get',
        dataType: 'json',
        success: function(json) {
            $.each(json, function(i, value) {
                $('.catSelect').append($('<option>').text(value.type).attr('value', value.type));
            });
        }
    });
}

const fillTable = () => {
    table = $('#category').DataTable({
        ajax: {
            url: 'm_category.json',
            dataSrc: ''
        },
        columns: [{
                "data": "id",
            },
            {
                "data": "type"
            },
            {
                "data": "status"
            },
        ],
        dom: 'Bfrtip', // Needs button container
        select: 'single',
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
                    catID = data[0].id;
                    editCat.value = data[0].type;
                    editStatus.value = data[0].status;
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
                    catID = data[0].id;
                    $('#deleteModal').modal('toggle');
                }
            }
        ],
    });
}

addCategoryToDB = () => {
    fetch('http://localhost:3000/proware/m_addcat', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prodCategory: addCat.value,
                prodCatStatus: addStatus.value
            }),
        })
        .then(response => response.json())
        .then(category => {
            if (category.haveEmpty) {
                window.alert("Please complete the required fields!")
            } else {
                if (category.isSuccess) {
                    fileAddFormData = new FormData();
                    $("#addModal").modal('hide');
                    document.querySelector('#actionResult').innerHTML = "Category Successfully Added!";
                    $("#showConfirm").modal('toggle');
                    table.ajax.reload();
                    $('#addModal').on('hidden.bs.modal', function() {
                        $(this).find("input").val('').end();
                    });
                } else {
                    window.alert('CATEGORY ALREADY EXIST!');
                }
            }
        })
        .catch(err => console.log('ERROR!: ', err));
}

editCategoryToDB = () => {
    fetch('http://localhost:3000/proware/m_editcat', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                catID: catID,
                prodCategory: editCat.value,
                prodCatStatus: editStatus.value
            })
        })
        .then(response => response.json())
        .then(category => {
            if (category.haveEmpty) {
                window.alert("Please complete the required fields!")
            } else {
                if (category.isSuccess) {
                    fileEditFormData = new FormData();
                    $("#editModal").modal('hide');
                    document.querySelector('#actionResult').innerHTML = "Category Successfully Edited!";
                    $("#showConfirm").modal('toggle');
                    table.ajax.reload();
                    $('#editModal').on('hidden.bs.modal', function() {
                        $(this).find("input").val('').end();
                    });
                } else {
                    window.alert('Error editing category!');
                }
            }
        })
        .catch(err => console.log('ERROR!: ', err))
}

deleteCategoryToDB = () => {
    fetch('http://localhost:3000/proware/m_deletecat', {
            method: 'delete',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                catID: catID,
            })
        })
        .then(response => response.json())
        .then(category => {
            if (category.isSuccess) {
                $("#deleteModal").modal('hide');
                document.querySelector('#actionResult').innerHTML = "Category Successfully Deleted!";
                $("#showConfirm").modal('toggle');
                table.ajax.reload();
            } else {
                window.alert("Error deleting category!");
            }
        })
        .catch(err => console.log('ERROR!: ', err))
}

deleteButton.addEventListener('click', deleteCategoryToDB)
addButton.addEventListener('click', addCategoryToDB);
editButton.addEventListener('click', editCategoryToDB);