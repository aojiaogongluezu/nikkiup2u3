window.onload = function(){
	event_alert();
	setInterval(event_alert, 30000);//30s
};

function event_alert(){
	var ret1=[]; var ret2=[];
	var d=new Date();
	var GZList=[];
	
	//calc for contest
	var date=new Date(d.getTime() + 8*60*60*1000 + d.getTimezoneOffset()*60000);
	if((date.getDay()==1||date.getDay()==5)&&date.getHours()>5){
		var h = 23-date.getHours() +2;
		var m = 59-date.getMinutes();
		ret1.push([h,'搭配评选赛&emsp;'+h+'时'+m+'分后结算']);
	}
	else if((date.getDay()==2||date.getDay()==6)&&date.getHours()<2){
		var h = 1-date.getHours();
		var m = 59-date.getMinutes();
		ret1.push([h,'搭配评选赛&emsp;'+h+'时'+m+'分后结算']);
	}
	if(date.getDay()==0&&date.getHours()>5){
		var h = 23-date.getHours() +2;
		var m = 59-date.getMinutes();
		ret1.push([h,'竞技场&emsp;'+h+'时'+m+'分后结算']);
	}
	else if(date.getDay()==1&&date.getHours()<2){
		var h = 1-date.getHours();
		var m = 59-date.getMinutes();
		ret1.push([h,'竞技场&emsp;'+h+'时'+m+'分后结算']);
	}
	
	var time_now=d.getTime();
	for(var i in eventList){
		var time_start=new Date(eventList[i][1]+":00 GMT+0800").getTime();
		var time_end=new Date(eventList[i][2]+":00 GMT+0800").getTime();
		if(time_now<time_start) { //event starting in 24 hrs
			var time_d = Math.floor((time_start-time_now)/1000/60/60/24);
			var time_h = Math.floor((time_start-time_now)/1000/60/60)%24;
			var time_m = Math.floor((time_start-time_now)/1000/60)%60;
			if(time_d<1) {
				ret2.push([time_h,eventList[i][0]+'&emsp;'+time_h+'时'+time_m+'分后开启']);
				
				//gen 公主双倍材料
				if(eventList[i][0].indexOf('公主')>=0&&eventList[i][0].indexOf('双倍')>=0&&document.getElementById('autogenGZ')){
					var GZList_r=eventList[i][0].split('/');
					for (var g in GZList_r){
						GZList_r[g]=GZList_r[g].replace(/\D/g,'');
						if (GZList_r[g].length>0){GZList.push(GZList_r[g]);}
					}
				}
			}
		}
		else if(time_now<time_end) { //event ending in future
			var time_d = Math.floor((time_end-time_now)/1000/60/60/24);
			var time_h = Math.floor((time_end-time_now)/1000/60/60)%24;
			var time_m = Math.floor((time_end-time_now)/1000/60)%60;
			if(time_d<1) {ret1.push([time_h,'<span style="color:red;font-weight: bold;">'+eventList[i][0]+'&emsp;'+time_h+'时'+time_m+'分后结束</span>']);}
			else {ret1.push([time_h+time_d*24,eventList[i][0]+'&emsp;'+time_d+'天'+time_h+'时'+time_m+'分后结束']);}
			
			//gen 公主双倍材料
			if(eventList[i][0].indexOf('公主')>=0&&eventList[i][0].indexOf('双倍')>=0&&document.getElementById('autogenGZ')){
				var GZList_r=eventList[i][0].split('/');
				for (var g in GZList_r){
					GZList_r[g]=GZList_r[g].replace(/\D/g,'');
					if (GZList_r[g].length>0){GZList.push(GZList_r[g]);}
				}
			}
		}
	}
	
	if(GZList.length>0){
		GZList.sort(function(a,b){return parseInt(a) - parseInt(b)});
		GZList=getDistinct(GZList);
		var output='<table width = "100%"><tr><td colspan="'+(GZList.length+1)+'">公主级双倍-材料汇总</td></tr><tr>';
		for (var g in GZList){
			output+='<td><a href="html/2-TuZhi/GZ.html?'+GZList[g]+'" target="framemain">第'+GZList[g]+'章</a></td>'
		}
		output+='<td><a href="html/2-TuZhi/ZHCX.html" target="framemain">综合查询</a></td></tr></table><br>';
		document.getElementById('autogenGZ').innerHTML=output;
	}
	
	if(ret1.length||ret2.length){
		ret1.sort(function(a,b){return a[0] - b[0]});
		ret2.sort(function(a,b){return a[0] - b[0]});
		var ret=ret1.concat(ret2);
		var event_alert_c='';
		for(var i in ret){
			if(maxHide>0&&i==maxHide) {event_alert_c+='<span id="maxHide" style="display:'+(document.getElementById('maxHide')?document.getElementById('maxHide').style.display:'none')+';">';}
			switch(parseInt(i)){
				case maxHide-1: event_alert_c+='<a id="showMaxHide" href="" onclick="showMaxHide();return false;">'+(document.getElementById('showMaxHide')?document.getElementById('showMaxHide').innerHTML:'展开'+opac('：'))+'</a>'; break;
				case 0: event_alert_c+='提醒：'; break;
				default: event_alert_c+=opac('提醒：'); break;
			}
			event_alert_c+=ret[i][1]+'<br>';
		}
		if(maxHide>0) {event_alert_c+='</span>';}
		document.getElementById('event_alert').innerHTML='<table width="100%"><tr style="display:none"><td></td></tr><tr><td id="event_alert_c" style="text-align:left"></td></tr></table><br>';
		document.getElementById('event_alert_c').innerHTML=event_alert_c;
	}else{
		document.getElementById('event_alert').innerHTML='';
	}
}

function showMaxHide(){
	if(document.getElementById('maxHide')){
		if(document.getElementById('maxHide').style.display=='none'){
			document.getElementById('maxHide').style.display='inline';
			document.getElementById('showMaxHide').innerHTML='收起'+opac('：');
		}else{
			document.getElementById('maxHide').style.display='none';
			document.getElementById('showMaxHide').innerHTML='展开'+opac('：');
		}
	}
}

function opac(txt){
	return '<span style="opacity:0">'+txt+'</span>';
}

function getDistinct(arr){
	var newArr=[];
	for (var i in arr){
		var ind=0;
		for (var j in newArr){
			if (arr[i]==newArr[j]) {ind=1;break;}
		}
		if(ind==0) {newArr.push(arr[i])};
	}
	return newArr;
}
