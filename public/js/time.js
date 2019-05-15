const getTime = () => {
  var d = new Date();
  var str = d.toDateString();
  var n = "Date: " + str.substr(str.indexOf(' ') + 1) + "<br> Time: " + d.toLocaleTimeString();
  document.getElementById("datenow").innerHTML = n;
}

window.onload = () => {
	getTime();
	setInterval(getTime, 1000);
}