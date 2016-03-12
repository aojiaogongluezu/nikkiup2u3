function showTop(id){
	document.getElementById('cell'+id+'_f').style.display="block";
	document.getElementById('cell'+id).style.display="none";
}
function hideTop(id){
	document.getElementById('cell'+id+'_f').style.display="none";
	document.getElementById('cell'+id).style.display="block";
}
function chgMode(mode){
	var x=[];
	if (mode=='l'){
		x = document.getElementsByClassName('norm');
		for (var i=0;i<x.length;i++) {x[i].style.display="none";}
		x = document.getElementsByClassName('limit');
		for (var i=0;i<x.length;i++) {x[i].style.display="inline";}
	}else{
		x = document.getElementsByClassName('norm');
		for (var i=0;i<x.length;i++) {x[i].style.display="inline";}
		x = document.getElementsByClassName('limit');
		for (var i=0;i<x.length;i++) {x[i].style.display="none";}
	}
}
