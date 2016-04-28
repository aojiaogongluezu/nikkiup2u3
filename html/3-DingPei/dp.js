function showTop(id){
	if(document.getElementById('cell'+id+'f')) {document.getElementById('cell'+id+'f').style.display="block"};
	if(document.getElementById('cell'+id)) {document.getElementById('cell'+id).style.display="none";}
}
function hideTop(id){
	if(document.getElementById('cell'+id+'f')) {document.getElementById('cell'+id+'f').style.display="none";}
	if(document.getElementById('cell'+id)) {document.getElementById('cell'+id).style.display="block";}
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
	if(document.getElementById("radio")) {document.getElementById("radio").innerHTML = radio_text;}
	
	var elts = document.getElementsByTagName('a');
	for (var i = elts.length - 1; i >= 0; --i) {
		if(!elts[i].href) {
			elts[i].href="";
			if(!elts[i].onclick) {elts[i].onclick = function() {return false;};}
		}
		if(elts[i].getAttribute('tooltip')){
			elts[i].setAttribute('tooltip',elts[i].getAttribute('tooltip').replace(/\\n/g,'\n'));
			if(!elts[i].className) {elts[i].className="aTooltip";}
		}
	}
};
