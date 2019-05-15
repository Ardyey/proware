let addStudID = document.querySelector('#addStudID');
let addStudFName = document.querySelector('#addStudFName');
let addStudMI = document.querySelector('#addStudMI');
let addStudLName = document.querySelector('#addStudLName');
let addStudStrand = document.querySelector('#addStudStrand');
let addButton = document.querySelector('#saveAddButton');

let editStudID = document.querySelector('#editStudID');
let editStudFName = document.querySelector('#editStudFName');
let editStudMI = document.querySelector('#editStudMI');
let editStudLName = document.querySelector('#editStudLName');
let editStudStrand = document.querySelector('#editStudStrand');
let editButton = document.querySelector('#saveEditButton');

let deleteButton = document.querySelector('#deleteButton');

let origStudID = '';

$(document).ready(function() {
    fillTable();
    var table = '';
    fillSelect();
    $(":input").inputmask();
    $('#shsStudent').wrap("<div class='scrolledTable'></div>");
});

const fillSelect = () => {
    $.ajax({
        url: 'm_strand.json',
        type: 'get',
        dataType: 'json',
        success: function(json) {
            $.each(json, function(i, value) {
                $('.shsStrand').append($('<option>').text(value.code).attr('value', value.code));
            });
        }
    });
}

const fillTable = () => {
    table = $('#shsStudent').DataTable({

        ajax: {
            url: 'm_shs.json',
            dataSrc: ''
        },
        columns: [{
                "data": "student_id"
            },
            {
                "data": "first_name"
            },
            {
                "data": "middle_initial"
            },
            {
                "data": "last_name"
            },
            {
                "data": "course_strand_code"
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
                    origStudID = data[0].student_id;
                    editStudID.value = data[0].student_id;
                    editStudFName.value = data[0].first_name;
                    editStudMI.value = data[0].middle_initial;
                    editStudLName.value = data[0].last_name;
                    editStudStrand.value = data[0].course_strand_code;
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
                    origStudID = data[0].student_id;
                    $('#deleteModal').modal('toggle');
                }
            }
        ],
    });
}

addSHSToDB = () => {
    fetch('http://localhost:3000/proware/m_addshs', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                studentID: addStudID.value,
                firstName: addStudFName.value,
                middleInitial: addStudMI.value,
                lastName: addStudLName.value,
                strand: addStudStrand.value
            })
        })
        .then(response => response.json())
        .then(shs => {
            if (shs.haveEmpty) {
                window.alert("Please complete the required fields!")
            } else {
                if (shs.isSuccess) {
                    $("#addModal").modal('hide');
                    document.querySelector('#actionResult').innerHTML = "SHS Student Successfully Added!";
                    $("#showConfirm").modal('toggle');
                    table.ajax.reload();
                    $('#addModal').on('hidden.bs.modal', function() {
                        $(this).find("input").val('').end();
                        $(this).find("#addStudStrand").val('').end();
                    });
                } else {
                    window.alert('STUDENT ALREADY EXIST!');
                }
            }
        })
        .catch(err => console.log('ERROR!: ', err))
}

editSHSToDB = () => {
    fetch('http://localhost:3000/proware/m_editshs', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                origStudID: origStudID,
                studentID: editStudID.value,
                firstName: editStudFName.value,
                middleInitial: editStudMI.value,
                lastName: editStudLName.value,
                strand: editStudStrand.value
            })
        })
        .then(response => response.json())
        .then(shs => {
            if (shs.haveEmpty) {
                window.alert("Please complete the required fields!")
            } else {
                if (shs.isSuccess) {
                    $("#editModal").modal('hide');
                    document.querySelector('#actionResult').innerHTML = "SHS Student Successfully Edited!";
                    $("#showConfirm").modal('toggle');
                    table.ajax.reload();
                    $('#editModal').on('hidden.bs.modal', function() {
                        $(this).find("input").val('').end();
                        $(this).find("#editStudStrand").val('').end();
                    });
                } else {
                    window.alert('ERROR EDITING STUDENT!');
                }
            }
        })
        .catch(err => console.log('ERROR!: ', err))
}

deleteSHSToDB = () => {
    fetch('http://localhost:3000/proware/m_deleteshs', {
            method: 'delete',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                origStudID: origStudID,
            })
        })
        .then(response => response.json())
        .then(shs => {
            if (shs.isSuccess) {
                $("#deleteModal").modal('hide');
                document.querySelector('#actionResult').innerHTML = "SHS Student Successfully Deleted!";
                $("#showConfirm").modal('toggle');
                table.ajax.reload();
            } else {
                window.alert("ERROR DELETING STUDENT!");
            }
        })
        .catch(err => console.log('ERROR!: ', err))
}

deleteButton.addEventListener('click', deleteSHSToDB)
addButton.addEventListener('click', addSHSToDB);
editButton.addEventListener('click', editSHSToDB);