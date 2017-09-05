var today=new Date(); var future; var interval=1;
var data=[
//0-fixed,1-select(text,value),2-input
	['自然回复',2,288],
	['任务·S评价',0,20],
	['任务·A评价',0,6],
	['任务·送体力',0,12],
	['任务·分享3次',0,6],
	['分享获得物品',0,6],
	['上线·午餐',1,['周日','周一','周二','周三','周四','周五','周六'],[60,30,30,30,30,30,60]],
	['上线·晚餐',0,60],
	['好友赠送',2,50],
	['联盟奖励',1,['5星','4星','3星','2星','1星'],[35,30,25,22,20]],
	['V礼包',1,['V0','V1','V2','V3','V4','V5','V6','V7','V8','V9','V10','V11','V12','V13','V14','V15'],[0,10,10,15,20,25,25,30,35,40,50,50,55,55,60,60]],
	//['暖心加油站',0,5],
	//['心悦每日礼包',0,5],
	['签到/活动',2,0]
];
var lunch_str='上线·午餐';

window.onload = function(){ 
	init();
}
function init(){
	el('interval').innerHTML='模式：'+selectBox('dayMode','chgDayMode(this.value)',[1,0],['一天','多天']);
	calc();
}
function chgDayMode(val){
	if(val==1) {
		interval=1;
		today=new Date();
		el('days').innerHTML='';
	}else{
		interval=5;
		today=new Date();
		future=new Date(today.getTime()+(interval-1)*1000*60*60*24);
		var out='&emsp;共<span id="days_interval">'+interval+'</span>天';
		out+='<br>&emsp;从：<button onclick="chgDate(0,-1)">-</button>';
		out+='<span id="today">'+dateToStr(today)+'</span>';
		out+='<button onclick="chgDate(0,1)">+</button>';
		out+='<br>&emsp;到：<button onclick="chgDate(1,-1)">-</button>';
		out+='<span id="future">'+dateToStr(future)+'</span>';
		out+='<button onclick="chgDate(1,1)">+</button>';
		el('days').innerHTML=out;
	}
	calc();
}
function chgDate(ind,chg){
	if (ind==0) {
		if(chg<0||today.getTime()!=future.getTime()) {
			today=new Date(today.getTime()+chg*1000*60*60*24);
			el('today').innerHTML=dateToStr(today);
		}
	}else{
		if(chg>0||today.getTime()!=future.getTime()) {
			future=new Date(future.getTime()+chg*1000*60*60*24);
			el('future').innerHTML=dateToStr(future);
		}
	}
	interval=(future.getTime()-today.getTime())/1000/60/60/24+1;
	el('days_interval').innerHTML=interval;
	calc();
}
function calc(){
	var dateShow=function() {
		var ret='';
		for(var j=0;j<interval;j++){
			var tmp=new Date(today.getTime()+j*1000*60*60*24);
			ret+=td(dateToStr(tmp,1));
		}
		return ret;
	}();
	
	var lunch=function() {
		for(var i in data) {if(data[i][0]==lunch_str) {return i;}}
	}();
	
	var dayMode=(el('dayMode').value==1);
	
	var out='<table border="1">';
	out+=tr(td('有')+td('来源')+(dayMode?td('体力'):dateShow),'style="font-weight:bold;"');
	for(var i in data){
		var line=td('<input type="checkbox" id="check'+i+'" onclick="calc2()" checked>');
		
		//handle for lunch without selectBox
		if(i==lunch&&!dayMode) {line+=td(data[i][0]);}
		else {line+=td(data[i][0]+(data[i][1]==1?selectBox('sel'+i,'calc2()',data[i][2]):''));}
		
		for(var j=1;j<=interval;j++){
			if(data[i][1]==0){
				line+=td(data[i][2],'id="dat'+i+'-'+j+'"');
			}else if(data[i][1]==1){
				line+=td('','id="dat'+i+'-'+j+'"');
			}else{
				line+=td(inputBox('dat'+i+'-'+j,'calc2(this,'+data[i][2]+')',3,data[i][2]));
			}
		}
		out+=tr(line,'id="line'+i+'"');
	}
	var line=td('')+td('总计');
	for(var j=1;j<=interval;j++){
		line+=td('','id="dat_t'+j+'"');
	}
	out+=tr(line,'style="font-weight:bold;"')
	if(interval>1) {out+=tr(td('')+td(interval+'天体力总计')+td('','colspan="'+interval+'" id="sum_all"'),'style="font-weight:bold;"')}
	out+='</table>';
	el('result').innerHTML=out;
	
	//handle for lunch
	var getDay=today.getDay();
	if(dayMode){
		el('sel'+lunch).value=data[lunch][2][getDay];
	}else{
		for (var j=1;j<=interval;j++){
			el('dat'+lunch+'-'+j).innerHTML=data[lunch][3][(getDay+j-1)%7];
		}
	}
	
	calc2();
}
function calc2(it,max){
	if(it&&max!=0){
		if(getVal(it.value)<0){it.value=0;}
		if(getVal(it.value)>max){it.value=max;}
	}

	var sum=[];
	for (var i in data){
		sum[i]=[0];
		for(var j=1;j<=interval;j++){
			if(data[i][1]==1&&el('sel'+i)) { for(var k in data[i][2]){
				if(el('sel'+i).value==data[i][2][k]) {el('dat'+i+'-'+j).innerHTML=data[i][3][k]; break;}
			}}
			var tmp=el('dat'+i+'-'+j).value?getVal(el('dat'+i+'-'+j).value):getVal(el('dat'+i+'-'+j).innerHTML);
			sum[i].push(tmp);
		}
		if(el('check'+i).checked) {el('line'+i).className="";}
		else {el('line'+i).className="no";}
	}
	for(var j=1;j<=interval;j++){
		var sum_val=0;
		for (var i in data){
			if(el('check'+i).checked) {sum_val+=parseInt(sum[i][j]);}
		}
		el('dat_t'+j).innerHTML=sum_val;
	}
	
	if(interval>1){
		var sum_all=0;
		for(var j=1;j<=interval;j++){
			sum_all+=getVal(el('dat_t'+j).innerHTML);
		}
		el('sum_all').innerHTML=sum_all;
	}
}
function dateToStr(date,noYear){
	return (noYear?'':date.getFullYear()+'-')+(date.getMonth()+1)+'-'+date.getDate();
}
function el(text){
	return document.getElementById(text);
}
function getVal(n){
	return noNaN(parseInt(n));
}
function td(text,attr){
	return '<td'+(attr?' '+attr:'')+'>'+text+'</td>';
}
function tr(text,attr){
	return '<tr'+(attr?' '+attr:'')+'>'+text+'</tr>';
}
function inputBox(id,onchange,size,value){
	return '<input type="text" id="'+id+'" onkeyup='+onchange+(size?' size="'+size+'"':'')+(value?' value="'+value+'"':'')+'>';
}
function selectBox(id,onchange,valArr,textArr){
	var ret='<select id="'+id+'" onchange='+onchange+'>';
	if(!textArr){textArr=valArr;}
	for (var i in valArr){
		ret+='<option value="'+valArr[i]+'">'+textArr[i]+'</option>';
	}
	ret+='</select>';;
	return ret;
}
function noNaN( n ) {
	return isNaN( n ) ? 0 : n; 
}
