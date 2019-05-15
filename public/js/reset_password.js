let editButton = document.querySelector('#saveEditButton');
let editEmpID = document.querySelector('#editEmpID');
let editUser = document.querySelector('#editUsername');
let editPass = document.querySelector('#editPassword');

$(document).ready(function() {
    fillTable();
    var table = '';
    $(":input").inputmask();
    $('#reset').wrap("<div class='scrolledTable'></div>");
});

const fillTable = () => {
    table = $('#reset').DataTable({
        ajax: {
            url: 'r_user.json',
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
            extend: 'selected', // Bind to Selected row
            text: 'Reset Password',
            name: 'edit', // do not change name
            attr: {
                id: 'edit'
            },
            action: function() {
                let data = table.rows({
                    selected: true
                }).data();
                $('#editModal').modal('toggle');
                editEmpID.value = data[0].employee_id;
                editUsername.value = data[0].username;
            }
        }],
    });
}


editUserToDB = () => {
    fetch('http://localhost:3000/proware/reset_pass', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                employeeID: editEmpID.value,
                password: editPass.value
            })
        })
        .then(response => response.json())
        .then(user => {
            if (user.haveEmpty) {
                window.alert("Please complete the required fields!")
            } else {
                if (user.isSuccess) {
                    $("#editModal").modal('hide');
                    document.querySelector('#actionResult').innerHTML = "Password Reset Successful!";
                    document.querySelector('#newPass').innerHTML = `New Password is: <strong>${editPass.value}</strong>`;
                    $("#showConfirm").modal('toggle');
                    table.ajax.reload();
                    $('#editModal').on('hidden.bs.modal', function() {
                        $(this).find("input").val('').end();
                        $(this).find("#editPosition").val('').end();
                        $(this).find("#editStatus").val('').end();
                    });
                } else {
                    window.alert('ERROR RESETTING PASSWORD!');
                }
            }
        })
        .catch(err => console.log('ERROR!: ', err))
}

editButton.addEventListener('click', editUserToDB);