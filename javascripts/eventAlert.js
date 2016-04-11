window.onload = function(){
	event_alert();
	setInterval(event_alert, 60000);
};

function event_alert(){
	var out='';
	//calc for contest
	var date=new Date(new Date().getTime() + 8*60*60*1000 + new Date().getTimezoneOffset()*60000);
	if((date.getDay()==1||date.getDay()==5)&&date.getHours()>5){
		var h = 23-date.getHours() +5;
		var m = 58-date.getMinutes();
		out+='搭配评选赛&emsp;'+h+'时'+m+'分后结算<br>';
	}
	else if((date.getDay()==2||date.getDay()==6)&&date.getHours()<5){
		var h = 4-date.getHours();
		var m = 58-date.getMinutes();
		out+='搭配评选赛&emsp;'+h+'时'+m+'分后结算<br>';
	}
	
	for (var i in eventList){//event ending in 24hrs
		var res=getEventTime(eventList[i]);
		if(res[0]==1&&res[1]<1){
			out+=eventList[i][0]+'&emsp;<span style="color:red">'+res[2]+'时'+res[3]+'分后结束</span><br>';
		}
	}
	for (var i in eventList){//event ending after 24 hrs
		var res=getEventTime(eventList[i]);
		if(res[0]==1&&res[1]>=1){
			out+=eventList[i][0]+'&emsp;'+res[1]+'天'+res[2]+'时'+res[3]+'分后结束<br>';
		}
	}
	for (var i in eventList){//event starting in future
		var res=getEventTime(eventList[i]);
		if(res[0]==0&&res[1]<1){//event start in 24 hrs
			out+=eventList[i][0]+'&emsp;'+res[2]+'时'+res[3]+'分后开启<br>';
		}
	}
	if(out){
		document.getElementById('event_alert').innerHTML='<table><tr style="display:none"><td></td></tr><tr><td id="event_alert_c"></td></tr></table>';
		document.getElementById('event_alert_c').innerHTML='活动提醒：<br>'+out;
	}
}

function getEventTime(eventListItem){
	var time_start=new Date(eventListItem[1]+" GMT+0800").getTime();
	var time_end=new Date(eventListItem[2]+" GMT+0800").getTime();
	var time_now=new Date().getTime();
	if(time_now<time_start) {var time_c=time_start; var ind=0;}
	else if(time_now<time_end) {var time_c=time_end; var ind=1;}
	else {return [2,0,0,0];}
	var time_d = Math.floor((time_c-time_now)/1000/60/60/24);
	var time_h = Math.floor((time_c-time_now)/1000/60/60)%24;
	var time_m = Math.floor((time_c-time_now)/1000/60)%60;
	return [ind,time_d,time_h,time_m];
}
