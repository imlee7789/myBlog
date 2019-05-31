	var btn = document.querySelector("#count_btn");
	var num = 1;
	btn.addEventListener('click', function(){
		num++;
		document.querySelector("#count_view").innerHTML = num;
	});