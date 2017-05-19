function noNaN( n ) { return isNaN( n ) ? 0 : n; }
function twoDigit(number) {
	var twodigit = number >= 10 ? number : "0"+number.toString();
	return twodigit;
}
function add(n) {
	var a=noNaN(parseInt(document.getElementById(n).value));
	a+=1;
	document.getElementById(n).value=a;
	calc();
}
function min(n) {
	var a=noNaN(parseInt(document.getElementById(n).value));
	a=Math.max(0,a-1);
	document.getElementById(n).value=a;
	calc();
}
function calc(){
	var nowap1=noNaN(parseInt(document.getElementById('nowap1').value));
	var maxap1=noNaN(parseInt(document.getElementById('maxap1').value));
	var aptime=noNaN(parseInt(document.getElementById('aptime').value));
	var date_now2=new Date(Math.floor(new Date().getTime()/1000/60)*1000*60);//ignore seconds
	var time_now2=date_now2.getTime();
	var until_hr2=noNaN(parseInt(document.getElementById('until_hr2').value));
	var until_min2=noNaN(parseInt(document.getElementById('until_min2').value));

	var time1=(maxap1-nowap1)*aptime;
	var usehr1=Math.floor(time1/60);
	var usemin1=time1%60;
	var end1=new Date(time_now2+time1*60*1000);
	var end1_mon=twoDigit(end1.getMonth()+1);
	var end1_day=twoDigit(end1.getDate());
	var end1_h=twoDigit(end1.getHours());
	var end1_m=twoDigit(end1.getMinutes());

	document.getElementById('res1').innerHTML=end1_mon+"/"+end1_day+" "+end1_h+":"+end1_m;
	document.getElementById('res1_time').innerHTML=usehr1+"时"+usemin1+"分";

	var year2 = date_now2.getFullYear();
	var month2 = date_now2.getMonth()+1;
	var day2=date_now2.getDate();
	var date_fut2=new Date(year2+"/"+month2+"/"+day2+" "+until_hr2+":"+until_min2);
	var time_fut2=date_fut2.getTime();
	if(time_fut2<time_now2){
		time_fut2=time_fut2+1000*60*60*24;//tomorrow
		document.getElementById('tmr').innerHTML="明天";
	}else{
		document.getElementById('tmr').innerHTML="今天";
	}
	var min_diff2=(time_fut2-time_now2)/1000/60;
	var ap_recov2_tmp=Math.floor(min_diff2/aptime);
	var ap_recov2_tmp2=ap_recov2_tmp+nowap1;
	var ap_recov2=Math.floor(maxap1-min_diff2/aptime);
	var abs_recov=Math.abs(ap_recov2)+nowap1;

	document.getElementById('ap_rec_tmp').innerHTML="会恢复"+ap_recov2_tmp+"体力";
	if(nowap1>0&&ap_recov2_tmp2<=maxap1){
		document.getElementById('ap_rec_tmp').innerHTML+="到"+ap_recov2_tmp2;
	}
	if(ap_recov2>=0){
		document.getElementById('nowap2').innerHTML="体力在"+ap_recov2+"以下就不会溢出";
	}
	else{
		document.getElementById('nowap2').innerHTML="溢出"+abs_recov+"体力&#x1F623;";
	}
}
function maxap(n){
	if (typeof(Storage) !== "undefined"&&!isNaN(parseInt(n))) {
		localStorage.setItem("nikki_stamina", parseInt(n));
	}
	calc();
}
window.onload = function(){ 
	var select_hr2='<select id="until_hr2" onchange=calc()>';
	for(var i=0;i<=23;i++){
		select_hr2+='<option value="'+i+'">'+twoDigit(i)+'</option>';
	}
	select_hr2+='</select>';
	document.getElementById('select_hr2').innerHTML=select_hr2;

	var select_min2='<select id="until_min2" onchange=calc()>';
	for(var i=0;i<=59;i++){
		select_min2+='<option value="'+i+'">'+twoDigit(i)+'</option>';
	}
	select_min2+='</select>';
	document.getElementById('select_min2').innerHTML=select_min2;
	
	document.getElementById('nowap1').value=0;
	document.getElementById('maxap1').value=120;
	document.getElementById('until_hr2').value=8;
	document.getElementById('until_min2').value=30;
	document.getElementById('aptime').value=5;
	
	if (typeof(Storage) !== "undefined"&&localStorage.getItem("nikki_stamina")){
		document.getElementById('maxap1').value=parseInt(localStorage.getItem("nikki_stamina"));
	}

	calc();
};
function advopts(){
	document.getElementById('advanced_options').style.display="none";
	document.getElementById('advanced_options_span').style.display="inline";
}
