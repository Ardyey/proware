const signinButton = document.querySelector('#signinButton');
const username = document.querySelector('#username');
const password = document.querySelector('#password');
const spinner = document.querySelector('.spinner');
const creds = document.querySelector('#creds');
const status = document.querySelector('#status');

$(document).ready(function() {
	$(document).keypress(function(e) {
		var key = e.which;
		if (key == 13) // the enter key code
		{
			signinButton.click();
			return false;
		}
	});
});

signinValidation = () => {
	spinner.removeAttribute('hidden');
	fetch('http://localhost:3000/proware/auth', {
			method: 'post',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				username: username.value,
				password: password.value
			})
		})
		.then(response => response.json())
		.then(data => {
			if(data.inactive){
				status.removeAttribute('hidden');
				spinner.setAttribute('hidden', '');
			}
			else {
				if (data.isValid) {
					window.location.href = "/proware/dashboard";
				} else {
					creds.removeAttribute('hidden');
					spinner.setAttribute('hidden', '');
				}
			}
		})
		.catch(err => console.error(err));
}

signinButton.addEventListener('click', signinValidation);