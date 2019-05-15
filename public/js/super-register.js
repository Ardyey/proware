const signupButton = document.querySelector('#signupButton');
const employeeId = document.querySelector('#employeeId')
const username = document.querySelector('#username');
const password = document.querySelector('#password');
const firstName = document.querySelector('#firstName');
const lastName = document.querySelector('#lastName');
const positionSelect = document.querySelector('#positionSelect');
const spinner = document.querySelector('.spinner');

signupValidation = () => {
	spinner.removeAttribute('hidden');
	fetch('http://localhost:3000/proware/register', {
			method: 'post',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				employeeId: employeeId.value,
				username: username.value,
				password: password.value,
				firstName: firstName.value,
				lastName: lastName.value,
				positionSelect: positionSelect.value
			})
		})
		.then(response => response.json())
		.then(data => {
			if (data.haveEmpty) {
				window.alert('Please Complete Required Fields');
				spinner.setAttribute('hidden', '');
			} else {
				if (data.isSuccess) {
					window.alert('Registered Successfully!');
					window.location.href = "/proware";
				} else {
					window.alert(data);
					spinner.setAttribute('hidden', '');
				}
			}
		})
		.catch(err => console.error(err));
}

signupButton.addEventListener('click', signupValidation);

$(document).ready(function() {
	$(":input").inputmask();
	$('#employeeId').inputmask({
		"onincomplete": () => {
			alert('Please enter valid Employee ID');
		},
		"clearIncomplete": true
	});
});