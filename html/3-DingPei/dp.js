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
window.onload = function(){
	var radio_text='<form action="">';
	radio_text+='<input type="radio" name="limit" id="limitn" value="n" checked onclick="chgMode(this.value)"><label for="limitn">标准权重</label>';
	radio_text+='<input type="radio" name="limit" id="limitl" value="l" onclick="chgMode(this.value)"><label for="limitl">极限权重</label><br>';
	radio_text+='</form>';
	document.getElementById("radio").innerHTML = radio_text;
};
