let position = document.querySelector('#position');

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const d = new Date();

$(document).ready(function() {
    let title = document.title;
    let iconOld = 'images/Owner.png';
    let iconNew = 'images/Owner-notif.png';
    let socket = io.connect('http://localhost:3000');
    $('.dateToday').text("For the Month of: " + monthNames[d.getMonth()].toUpperCase());

    socket.on('live pending', (data) => {
        $('#dPending').text(data + ' order(s)');
        if (data > 0) {
            let newTitle = '(' + data + ') ' + title;
            document.querySelector('#favicon').href = iconNew;
            document.title = newTitle;
            $('#dPending').addClass('blink');
        } else {
            document.querySelector('#favicon').href = iconOld;
            document.title = title;
            $('#dPending').removeClass('blink');
        }
    });

    socket.on('live expired', (data) => {
        $('#expiredOrder').text(data + ' order(s)');
    });

    socket.on('live order', (data) => {
        $('#dailyOrder').text(data + ' order(s)');
    });

    socket.on('live approved', (data) => {
        $('#approvedOrder').text(data + ' order(s)');
        if (position.textContent === 'CASHIER') {
            if (data > 0) {
                let newTitle = '(' + data + ') ' + title;
                document.querySelector('#favicon').href = iconNew;
                document.title = newTitle;
                $('#approvedOrder').addClass('blink');
            } else {
                document.querySelector('#favicon').href = iconOld;
                document.title = title;
                $('#approvedOrder').removeClass('blink');
            }
        } else {
            if (data > 0) {
                $('#approvedOrder').addClass('blink');
            } else {
                $('#approvedOrder').removeClass('blink');
            }
        }

    });

    socket.on('live cancelled', (data) => {
        $('#cancelledOrder').text(data + ' order(s)');
    });

    socket.on('live paid', (data) => {
        $('#paidOrder').text(data + ' order(s)');
        if (data > 0) {
            $('#paidOrder').addClass('blink');
        } else {
            $('#paidOrder').removeClass('blink');
        }
    });

    socket.on('live exchange', (data) => {
        $('#exchangeOrder').text(data + ' order(s)');
    });

    socket.on('live exchange pending', (data) => {
        $('#exchangeOrderP').text(data + ' order(s)');
        if (position.textContent === 'CASHIER') {
            if (data > 0) {
                let newTitle = '(' + data + ') ' + title;
                document.querySelector('#favicon').href = iconNew;
                document.title = newTitle;
                $('#exchangeOrderP').addClass('blink');
            } else {
                document.querySelector('#favicon').href = iconOld;
                document.title = title;
                $('#exchangeOrderP').removeClass('blink');
            }
        } else {
            if (data > 0) {
                $('#exchangeOrderP').addClass('blink');
            } else {
                $('#exchangeOrderP').removeClass('blink');
            }
        }
    });

});

if (position.textContent === 'Admin' || position.textContent === 'PAMO' || position.textContent === 'PROWARE') {
    document.querySelector('#paidOrders').addEventListener('click', () => {
        window.location.href = '/proware/monitor_paid';
    });

    document.querySelector('#cancelledOrders').addEventListener('click', () => {
        window.location.href = '/proware/monitor_cancelled';
    });

    document.querySelector('#successfulOrders').addEventListener('click', () => {
        window.location.href = '/proware/monitor_success';
    });

    document.querySelector('#pendingOrders').addEventListener('click', () => {
        window.location.href = '/proware/monitor_pending';
    });

    document.querySelector('#exchangeOrder').addEventListener('click', () => {
        window.location.href = '/proware/exchange_success';
    });
}
if (position.textContent === 'Admin' || position.textContent === 'PAMO' || position.textContent === 'PROWARE') {
    document.querySelector('#exchangeOrders').addEventListener('click', () => {
        window.location.href = '/proware/monitor_approved';
    });
} 
if (position.textContent === 'Admin' || position.textContent === 'CASHIER'){
    document.querySelector('#approvedOrders').addEventListener('click', () => {
        window.location.href = '/proware/monitor_approved';
    });
    
    document.querySelector('#exchangeOrdersP').addEventListener('click', () => {
        window.location.href = '/proware/exchange_pending';
    });
}

if (position.textContent === 'Admin' || position.textContent === 'PAMO' || position.textContent === 'PROWARE' || position.textContent === 'CASHIER') {
    document.querySelector('#expiredOrders').addEventListener('click', () => {
        window.location.href = '/proware/monitor_expired';
    });
} 