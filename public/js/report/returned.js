$(document).ready(function() {
    // fillTable();
    fillTable2();
    // var table = '';
    var table2 = '';
    // $('#return').wrap("<div class='scrolledTable'></div>");
    $('#returnItem').wrap("<div class='scrolledTable'></div>");
});

// const fillTable = () => {
//     table = $('#return').DataTable({
//         ajax: {
//             url: 'rreturned.json',
//             dataSrc: ''
//         },
//         columns: [{
//                 "data": "trx_id"
//             },
//             {
//                 "data": "student_id"
//             },
//             {
//                 "data": "date_created"
//             },
//         ],
//         dom: 'Bfrtip', // Needs button container
//         buttons: [{
//                 extend: 'excel',
//                 text: 'Excel',
//                 title: 'PROWARE RETURNED ORDER LIST'
//             },
//             {
//                 extend: 'pdf',
//                 text: 'PDF',
//                 title: 'PROWARE RETURNED ORDER LIST'
//             }
//         ],
//     });
// }

const fillTable2 = () => {
    table2 = $('#returnItem').DataTable({
        ajax: {
            url: 'rreturned_item.json',
            dataSrc: ''
        },
        columns: [{
                "data": "trx_id"
            },
            {
                "data": "student_id"
            },
            {
                "data": "date_purchased"
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
            {
                "data": "return_reason"
            },
        ],
        dom: 'Bfrtip', // Needs button container
        buttons: [{
                extend: 'excel',
                text: 'Excel',
                title: 'PROWARE RETURNED ITEM LIST'
            },
            {
                extend: 'pdf',
                text: 'PDF',
                title: 'PROWARE RETURNED ITEM LIST'
            }
        ],
    });
}