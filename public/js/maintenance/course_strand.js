let addButton = document.querySelector('#saveAddButton');
let addCode = document.querySelector('#addCode');
let addDescription = document.querySelector('#addDescription');
let addType = document.querySelector('#addType');
let addForm = document.querySelector('#addForm');

let editButton = document.querySelector('#saveEditButton');
let editCode = document.querySelector('#editCode');
let editDescription = document.querySelector('#editDescription');
let editType = document.querySelector('#editType');
let editForm = document.querySelector('#editForm');

let origCourse = '';
let deleteButton = document.querySelector('#deleteButton');

$(document).ready(function() {
    fillTable();
    var table = '';
    $('#course_strand').wrap("<div class='scrolledTable'></div>");
});

const fillTable = () => {
    table = $('#course_strand').DataTable({
        ajax: {
            url: 'm_course_strand.json',
            dataSrc: ''
        },
        columns: [
            {
                "data": "code"
            },
            {
                "data": "description"
            },
            {
                "data": "type"
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
                    origCourse = data[0].code;
                    editCode.value = data[0].code;
                    editDescription.value = data[0].description;
                    editType.value = data[0].type;
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
                    origCourse = data[0].code;
                    $('#deleteModal').modal('toggle');
                }
            }
        ],
    });
}

addCourseToDB = () => {
    fetch('http://localhost:3000/proware/m_addcourse_strand', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                code: addCode.value,
                description: addDescription.value,
                type: addType.value
            }),
        })
        .then(response => response.json())
        .then(course => {
            if (course.haveEmpty) {
                window.alert("Please complete the required fields!")
            } else {
                if (course.isSuccess) {
                    fileAddFormData = new FormData();
                    $("#addModal").modal('hide');
                    document.querySelector('#actionResult').innerHTML = "Course / Strand Successfully Added!";
                    $("#showConfirm").modal('toggle');
                    table.ajax.reload();
                    $('#addModal').on('hidden.bs.modal', function() {
                        addForm.reset();
                    });
                } else {
                    window.alert('COURSE / STRAND ALREADY EXIST!');
                }
            }
        })
        .catch(err => console.log('ERROR!: ', err));
}

editCourseToDB = () => {
    fetch('http://localhost:3000/proware/m_editcourse_strand', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                origCourse: origCourse,
                code: editCode.value,
                description: editDescription.value,
                type: editType.value
            })
        })
        .then(response => response.json())
        .then(course => {
            if (course.haveEmpty) {
                window.alert("Please complete the required fields!")
            } else {
                if (course.isSuccess) {
                    fileEditFormData = new FormData();
                    $("#editModal").modal('hide');
                    document.querySelector('#actionResult').innerHTML = "Course / Strand Edited!";
                    $("#showConfirm").modal('toggle');
                    table.ajax.reload();
                    $('#editModal').on('hidden.bs.modal', function() {
                        editForm.reset();
                    });
                } else {
                    window.alert('COURSE / STRAND ALREADY EXIST!');
                }
            }
        })
        .catch(err => console.log('ERROR!: ', err))
}

deleteCourseToDB = () => {
    fetch('http://localhost:3000/proware/m_deletecourse_strand', {
            method: 'delete',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                origCourse: origCourse,
            })
        })
        .then(response => response.json())
        .then(course => {
            if (course.isSuccess) {
                $("#deleteModal").modal('hide');
                document.querySelector('#actionResult').innerHTML = "Course / Strand Deleted!";
                $("#showConfirm").modal('toggle');
                table.ajax.reload();
            } else {
                window.alert("ERROR DELETING COURSE / STRAND!");
            }
        })
        .catch(err => console.log('ERROR!: ', err))
}

deleteButton.addEventListener('click', deleteCourseToDB)
addButton.addEventListener('click', addCourseToDB);
editButton.addEventListener('click', editCourseToDB);