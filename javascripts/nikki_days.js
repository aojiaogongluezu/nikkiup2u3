function noNaN( n ) { return isNaN( n ) ? 0 : n; }
function calc1(){
	//n = now, t = target
	var ty=noNaN(parseInt(document.getElementById('ty').value));
	var tm=noNaN(parseInt(document.getElementById('tm').value));
	var td=noNaN(parseInt(document.getElementById('td').value));
	var ny=noNaN(parseInt(document.getElementById('ny').value));
	var nm=noNaN(parseInt(document.getElementById('nm').value));
	var nd=noNaN(parseInt(document.getElementById('nd').value));
	
	var n_invalid;
	var t_invalid;
	
	if ((nm>12)||(nm<1)||(nd<1)||(ny>9999)||(ny<100))
		{n_invalid=1;}
	else if (((nm==1)||(nm==3)||(nm==5)||(nm==7)||(nm==8)||(nm==10)||(nm==12))&&(nd>31))
		{n_invalid=1;}
	else if (((nm==4)||(nm==6)||(nm==9)||(nm==11))&&(nd>30))
		{n_invalid=1;}
	else if ((nm==2)&&((ny%400==0)||((ny%100!=0)&&(ny%4==0)))&&(nd>29))//leap year
		{n_invalid=1;}
	else if ((nm==2)&&(((ny%100==0)&&(ny%400!=0))||(ny%4!=0))&&(nd>28))//not leap
		{n_invalid=1;}
	else {n_invalid=0;}
	
	if ((tm>12)||(tm<1)||(td<1)||(ty>9999)||(ty<100))
		{t_invalid=1;}
	else if (((tm==1)||(tm==3)||(tm==5)||(tm==7)||(tm==8)||(tm==10)||(tm==12))&&(td>31))
		{t_invalid=1;}
	else if (((tm==4)||(tm==6)||(tm==9)||(tm==11))&&(td>30))
		{t_invalid=1;}
	else if ((tm==2)&&((ty%400==0)||((ty%100!=0)&&(ty%4==0)))&&(td>29))
		{t_invalid=1;}
	else if ((tm==2)&&(((ty%100==0)&&(ty%400!=0))||(ty%4!=0))&&(td>28))
		{t_invalid=1;}
	else {t_invalid=0;}
	
	if (n_invalid==1){document.getElementById("n_invalid").innerHTML = "　日期输入错误";}
	else {document.getElementById("n_invalid").innerHTML = "";}
	if (t_invalid==1){document.getElementById("t_invalid").innerHTML = "　日期输入错误";}
	else {document.getElementById("t_invalid").innerHTML = "";}
	
	//if invalid then regard as 0 day
	if(n_invalid==1||t_invalid==1){var diff=0;}
	else{
		var nDate = new Date(nm+"/"+nd+"/"+ny);
		var tDate = new Date(tm+"/"+td+"/"+ty);
		var diff=Math.max(0,(tDate.getTime()-nDate.getTime())/1000/60/60/24).toFixed(0);
		//if greater then regard as 0 day
	}
	
	
	document.getElementById("target_day").innerHTML="在"+ty+"年"+tm+"月"+td+"日";
	
	document.getElementById("diff").value=diff;
	
	//gen achievement,diamond numbers
	var tmp_gain1=Math.floor(diff/30)*(50+100+50+100+50+150);
	var tmp_gain1_rem=Math.floor((diff%30)/5);
	if (tmp_gain1_rem>=1){tmp_gain1+=50;}
	if (tmp_gain1_rem>=2){tmp_gain1+=100;}
	if (tmp_gain1_rem>=3){tmp_gain1+=50;}
	if (tmp_gain1_rem>=4){tmp_gain1+=100;}
	if (tmp_gain1_rem>=5){tmp_gain1+=50;}
	//document.getElementById("gain1").value=Math.floor(diff/30)*(50+100+50+100+50+150);
	document.getElementById("gain1").value=tmp_gain1;
	document.getElementById("times2").value=diff;
	document.getElementById("times3").value=diff;
	document.getElementById("times4").value=diff;
	var tmp_times5=Math.floor(diff/7);
	if(n_invalid==0&&t_invalid==0){
		var tmp_times5_rem=diff%7 - (7-nDate.getDay())%7;//days to mon
		if(tmp_times5_rem>=1){tmp_times5+=1;}
	}
	document.getElementById("times5").value=tmp_times5;
	var tmp_times6=Math.floor(diff/7)*2;
	if(n_invalid==0&&t_invalid==0){
		var tmp_times6_rem1=diff%7 - (8-nDate.getDay())%7;//days to tue
		var tmp_times6_rem2=diff%7 - (12-nDate.getDay())%7;//days to sat
		if(tmp_times6_rem1>=1){tmp_times6+=1;}
		if(tmp_times6_rem2>=1){tmp_times6+=1;}
	}
	document.getElementById("times6").value=tmp_times6;
	document.getElementById("times7").value=diff;
	document.getElementById("times8").value=Math.floor(diff/30);
	
	calc2();
}
function calc2(){//for diamond numbers modified
	var diff=noNaN(parseInt(document.getElementById('diff').value));
	var gain1=noNaN(parseInt(document.getElementById('gain1').value));
	var gain2=noNaN(parseInt(document.getElementById('gain2').value));
	var gain3=noNaN(parseInt(document.getElementById('gain3').value));
	var gain4=noNaN(parseInt(document.getElementById('gain4').value));
	var gain5=noNaN(parseInt(document.getElementById('gain5').value));
	var gain6=noNaN(parseInt(document.getElementById('gain6').value));
	var gain7=noNaN(parseInt(document.getElementById('gain7').value));
	var gain8=noNaN(parseInt(document.getElementById('gain8').value));
	var gain9=noNaN(parseInt(document.getElementById('gain9').value));
	var times2=noNaN(parseInt(document.getElementById('times2').value));
	var times3=noNaN(parseInt(document.getElementById('times3').value));
	var times4=noNaN(parseInt(document.getElementById('times4').value));
	var times5=noNaN(parseInt(document.getElementById('times5').value));
	var times6=noNaN(parseInt(document.getElementById('times6').value));
	var times7=noNaN(parseInt(document.getElementById('times7').value));
	var times8=noNaN(parseInt(document.getElementById('times8').value));
	var ownnow=noNaN(parseInt(document.getElementById("ownnow").value));
	
	var total=0;
	total+=gain1;
	total+=gain2*times2;
	total+=gain3*times3;
	total+=gain4*times4;
	total+=gain5*times5;
	total+=gain6*times6;
	total+=gain7*times7;
	total+=gain8*times8;
	total+=gain9;
	
	document.getElementById("total").value=total;
	document.getElementById("total2").value=total+ownnow;
}
function noteview(){
	var oo=document.getElementById('notecheck'); 
	if(oo.checked) {
		var elements = document.getElementsByClassName('note');
		for(var i=0,length=elements.length;i<length;i++)
		{elements[i].style.display = 'inline';}
		//while (document.contains(document.getElementsByClassName("note")[0])) {
		//	element=document.getElementsByClassName("note")[0];
		//	element.className="noteshow";
		//};
	}
	else{
		var elements = document.getElementsByClassName('note');
		for(var i=0,length=elements.length;i<length;i++)
		{elements[i].style.display = 'none';}
	}
};
window.onload = function(){ 
	var date1 = new Date();
	var date2 = new Date(new Date().getTime() + 30*24*60*60*1000);//30days
	var d1 = date1.getDate();
	var m1 = date1.getMonth();
	var y1 = date1.getFullYear();
	var d2 = date2.getDate();
	var m2 = date2.getMonth();
	var y2 = date2.getFullYear();
	document.getElementById("nd").value=d1;
	document.getElementById("nm").value=m1+1;
	document.getElementById("ny").value=y1;
	document.getElementById("td").value=d2;
	document.getElementById("tm").value=m2+1;
	document.getElementById("ty").value=y2;
	document.getElementById("gain2").value=53;
	document.getElementById("gain3").value=15;
	document.getElementById("gain4").value=60;
	document.getElementById("gain5").value=50;
	document.getElementById("gain6").value=25;
	document.getElementById("gain7").value=15;
	document.getElementById("gain8").value=35;
	document.getElementById("gain9").value=0;
	document.getElementById("ownnow").value=0;
	calc1();
}; 
