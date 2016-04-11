window.onload = function(){
	event_alert();
	setInterval(event_alert, 60000);
};

function event_alert(){
	var ret=[];
	//calc for contest
	var d=new Date();
	var date=new Date(d.getTime() + 8*60*60*1000 + d.getTimezoneOffset()*60000);
	if((date.getDay()==1||date.getDay()==5)&&date.getHours()>5){
		var h = 23-date.getHours() +5;
		var m = 59-date.getMinutes();
		ret.push([1,'搭配评选赛&emsp;'+h+'时'+m+'分后结算']);
	}
	else if((date.getDay()==2||date.getDay()==6)&&date.getHours()<5){
		var h = 4-date.getHours();
		var m = 59-date.getMinutes();
		ret.push([1,'搭配评选赛&emsp;'+h+'时'+m+'分后结算']);
	}
	
	var time_now=d.getTime();
	for(var i in eventList){
		var time_start=new Date(eventList[i][1]+":00 GMT+0800").getTime();
		var time_end=new Date(eventList[i][2]+":00 GMT+0800").getTime();
		if(time_now<time_start) {
			var time_d = Math.floor((time_start-time_now)/1000/60/60/24);
			var time_h = Math.floor((time_start-time_now)/1000/60/60)%24;
			var time_m = Math.floor((time_start-time_now)/1000/60)%60;
			if(time_d<1) {ret.push([2,eventList[i][0]+'&emsp;'+time_h+'时'+time_m+'分后开启']);}
		}
		else if(time_now<time_end) {
			var time_d = Math.floor((time_end-time_now)/1000/60/60/24);
			var time_h = Math.floor((time_end-time_now)/1000/60/60)%24;
			var time_m = Math.floor((time_end-time_now)/1000/60)%60;
			if(time_d<1) {ret.push([0,eventList[i][0]+'&emsp;<span style="color:red">'+time_h+'时'+time_m+'分后结束</span>']);}
			else {ret.push([1,eventList[i][0]+'&emsp;'+time_d+'天'+time_h+'时'+time_m+'分后结束']);}
		}
	}
	
	if(ret.length){
		document.getElementById('event_alert').innerHTML='<table width="100%"><tr style="display:none"><td></td></tr><tr><td id="event_alert_c" style="text-align:left"></td></tr></table><br>';
		for(j=0;j<3;j++){ for(i=0;i<ret.length;i++){
			if(ret[i][0]==j) {document.getElementById('event_alert_c').innerHTML+=ret[i][1]+'<br>';}
		}}
	}
}
