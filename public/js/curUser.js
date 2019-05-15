fetch('http://localhost:3000/proware/curuser')
	.then(response => response.json())
	.then(data => {
		document.querySelector('#currentUser').innerHTML = data[0].first_name + " " + data[0].last_name;
	})
	.catch(err => console.log('ERROR!: ', err));