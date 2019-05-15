let addButton = document.querySelector('#saveAddButton');
let addEmpID = document.querySelector('#addEmpID');
let addUser = document.querySelector('#addUsername');
let addPass = document.querySelector('#addPassword');
let addFirstName = document.querySelector('#addFirstName');
let addLastName = document.querySelector('#addLastName');
let addStatus = document.querySelector('#addStatus');
let addPosition = document.querySelector('#addPosition');

let editEmpID = document.querySelector('#editEmpID');
let editUser = document.querySelector('#editUsername');
let editPass = document.querySelector('#editPassword');
let editFirstName = document.querySelector('#editFirstName');
let editLastName = document.querySelector('#editLastName');
let editStatus = document.querySelector('#editStatus');
let editPosition = document.querySelector('#editPosition');
let editButton = document.querySelector('#saveEditButton');

let deleteButton = document.querySelector('#deleteButton');

let originalUsername = '';

$(document).ready(function() {
    fillTable();
    var table = '';
    fillSelect();
    $(":input").inputmask();
    $('#user').wrap("<div class='scrolledTable'></div>");
});

const fillSelect = () => {
    $.ajax({
        url: 'm_user_pos.json',
        type: 'get',
        dataType: 'json',
        success: function(json) {
            $.each(json, function(i, value) {
                $('.userPosition').append($('<option>').text(value.description).attr('value', value.description));
            });
        }
    });
}

const fillTable = () => {
    table = $('#user').DataTable({

        ajax: {
            url: 'm_user.json',
            dataSrc: ''
        },
        columns: [{
                "class": "tdEmpID",
                "data": "employee_id"
            },
            {
                "class": "tdUsername",
                "data": "username"
            },
            {
                "class": "tdFirstName",
                "data": "first_name"
            },
            {
                "class": "tdLastName",
                "data": "last_name"
            },
            {
                "class": "tdStatus",
                "data": "status"
            },
            {
                "class": "tdPosition",
                "data": "description"
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
                    originalUsername = data[0].username;
                    editEmpID.value = data[0].employee_id;
                    editUsername.value = data[0].username;
                    editFirstName.value = data[0].first_name;
                    editLastName.value = data[0].last_name;
                    editStatus.value = data[0].status;
                    editPosition.value = data[0].description;
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
                    originalUsername = data[0].username;
                    $('#deleteModal').modal('toggle');
                }
            }
        ],
    });
}

addUserToDB = () => {
    fetch('http://localhost:3000/proware/m_adduser', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                employeeID: addEmpID.value,
                username: addUsername.value,
                password: addPassword.value,
                firstName: addFirstName.value,
                lastName: addLastName.value,
                status: addStatus.value,
                position: addPosition.value
            })
        })
        .then(response => response.json())
        .then(user => {
            if (user.haveEmpty) {
                window.alert("Please complete the required fields!")
            } else {
                if (user.isSuccess) {
                    $("#addModal").modal('hide');
                    document.querySelector('#actionResult').innerHTML = "User Successfully Added!";
                    $("#showConfirm").modal('toggle');
                    table.ajax.reload();
                    $('#addModal').on('hidden.bs.modal', function() {
                        $(this).find("input").val('').end();
                        $(this).find("#addPosition").val('').end();
                        $(this).find("#addStatus").val('').end();
                    });
                } else {
                    window.alert('USER ALREADY EXIST!');
                }
            }
        })
        .catch(err => console.log('ERROR!: ', err))
}

editUserToDB = () => {
    fetch('http://localhost:3000/proware/m_edituser', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                origUser: originalUsername,
                employeeID: editEmpID.value,
                username: editUsername.value,
                firstName: editFirstName.value,
                lastName: editLastName.value,
                status: editStatus.value,
                position: editPosition.value
            })
        })
        .then(response => response.json())
        .then(user => {
            if (user.haveEmpty) {
                window.alert("Please complete the required fields!")
            } else {
                if (user.isSuccess) {
                    $("#editModal").modal('hide');
                    document.querySelector('#actionResult').innerHTML = "User Successfully Edited!";
                    $("#showConfirm").modal('toggle');
                    table.ajax.reload();
                    $('#editModal').on('hidden.bs.modal', function() {
                        $(this).find("input").val('').end();
                        $(this).find("#editPosition").val('').end();
                        $(this).find("#editStatus").val('').end();
                    });
                } else {
                    window.alert('ERROR EDITING USER!');
                }
            }
        })
        .catch(err => console.log('ERROR!: ', err))
}

deleteUserToDB = () => {
    fetch('http://localhost:3000/proware/m_deleteuser', {
            method: 'delete',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: originalUsername,
            })
        })
        .then(response => response.json())
        .then(user => {
            if (user.isSuccess) {
                $("#deleteModal").modal('hide');
                document.querySelector('#actionResult').innerHTML = "User Successfully Deleted!";
                $("#showConfirm").modal('toggle');
                table.ajax.reload();
            } else {
                window.alert("Error deleting user!");
            }
        })
        .catch(err => console.log('ERROR!: ', err))
}

deleteButton.addEventListener('click', deleteUserToDB)
addButton.addEventListener('click', addUserToDB);
editButton.addEventListener('click', editUserToDB);