let addButton = document.querySelector('#saveAddButton');
let addCourse = document.querySelector('#addCourse');

let editButton = document.querySelector('#saveEditButton');
let editCourse = document.querySelector('#editCourse');

let origCourse = '';
let deleteButton = document.querySelector('#deleteButton');

$(document).ready(function() {
    fillTable();
    var table = '';
    $('#prodCourse').wrap("<div class='scrolledTable'></div>");
});


const fillTable = () => {
    table = $('#prodCourse').DataTable({
        ajax: {
            url: 'm_prod_course.json',
            dataSrc: ''
        },
        columns: [
            {
                "data": "course"
            }
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
                    origCourse = data[0].course;
                    editCourse.value = data[0].course;
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
                    origCourse = data[0].course;
                    $('#deleteModal').modal('toggle');
                }
            }
        ],
    });
}

addCourseToDB = () => {
    fetch('http://localhost:3000/proware/m_addcourse', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prodCourse: addCourse.value
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
                    document.querySelector('#actionResult').innerHTML = "Product Course Successfully Added!";
                    $("#showConfirm").modal('toggle');
                    table.ajax.reload();
                    $('#addModal').on('hidden.bs.modal', function() {
                        $(this).find("input").val('').end();
                    });
                } else {
                    window.alert('PRODUCT COURSE ALREADY EXIST!');
                }
            }
        })
        .catch(err => console.log('ERROR!: ', err));
}

editCourseToDB = () => {
    fetch('http://localhost:3000/proware/m_editcourse', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                origCourse: origCourse,
                prodCourse: editCourse.value
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
                    document.querySelector('#actionResult').innerHTML = "Product Course Edited!";
                    $("#showConfirm").modal('toggle');
                    table.ajax.reload();
                    $('#editModal').on('hidden.bs.modal', function() {
                        $(this).find("input").val('').end();
                    });
                } else {
                    window.alert('PRODUCT COURSE ALREADY EXIST!');
                }
            }
        })
        .catch(err => console.log('ERROR!: ', err))
}

deleteCourseToDB = () => {
    fetch('http://localhost:3000/proware/m_deletecourse', {
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
                document.querySelector('#actionResult').innerHTML = "Product Course Deleted!";
                $("#showConfirm").modal('toggle');
                table.ajax.reload();
            } else {
                window.alert("Error deleting course!");
            }
        })
        .catch(err => console.log('ERROR!: ', err))
}

deleteButton.addEventListener('click', deleteCourseToDB)
addButton.addEventListener('click', addCourseToDB);
editButton.addEventListener('click', editCourseToDB);