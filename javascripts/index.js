window.onload = function(){
	event_alert();
	setInterval(event_alert, 30000);//30s
	clickExpand();
	loadStorageClick();
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
				if(eventList[i][0].indexOf('公主')>=0&&eventList[i][0].indexOf('倍')>=0&&el('autogenGZ')){
					var GZList_r=eventList[i][0].split('/');
					for (var g in GZList_r){
						GZList_r[g]=GZList_r[g].replace(/[^0-9a-zA-Z-]*/g,'');
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
			if(eventList[i][0].indexOf('公主')>=0&&eventList[i][0].indexOf('倍')>=0&&el('autogenGZ')){
				var GZList_r=eventList[i][0].split('/');
				for (var g in GZList_r){
					GZList_r[g]=GZList_r[g].replace(/[^0-9a-zA-Z-]*/g,'');
					if (GZList_r[g].length>0){GZList.push(GZList_r[g]);}
				}
			}
		}
	}
	
	if(GZList.length>0){
		GZList.sort(function(a,b){return parseInt(a) - parseInt(b)});
		GZList=getDistinct(GZList);
		var maxcolspan=4;
		var perrow=GZList.length>maxcolspan-1 ? maxcolspan-1 : GZList.length;
		var output='<table width="100%" class="index-expand"><tr><td colspan="'+(perrow+1)+'">公主级双倍-材料汇总</td></tr><tr>';
		for (var g in GZList){
			output+='<td><a href="html/2-TuZhi/GZ.html?'+GZList[g]+'" target="framemain">第'+GZList[g]+'章</a></td>';
			if (g%(perrow)==(perrow-1)) { //add extra col per row
				if (g==perrow-1) output+='<td><a href="html/2-TuZhi/ZHCX.html" target="framemain">综合查询</a></td>'; //if first row
				else output+='<td></td>';
				if (g!=GZList.length-1) output+='</tr><tr>'; //if not end of all table
			}
			
		}
		var restcells = GZList.length%perrow;
		if (restcells>0) for (var i=0; i<=perrow-restcells;i++){ //add 1 extra blank
			output+='<td></td>';
		}
		output+='</tr></table><br>';
		el('autogenGZ').innerHTML=output;
	}
	
	if(ret1.length||ret2.length){
		ret1.sort(function(a,b){return a[0] - b[0]});
		ret2.sort(function(a,b){return a[0] - b[0]});
		var ret=ret1.concat(ret2);
		var event_alert_c='';
		for(var i in ret){
			if(maxHide>0&&i==maxHide) {event_alert_c+='<span id="maxHide" style="display:'+(el('maxHide')?el('maxHide').style.display:'none')+';">';}
			switch(parseInt(i)){
				case maxHide-1: event_alert_c+='<a id="showMaxHide" href="" onclick="showMaxHide();return false;">'+(el('showMaxHide')?el('showMaxHide').innerHTML:'展开'+opac('：'))+'</a>'; break;
				case 0: event_alert_c+='提醒：'; break;
				default: event_alert_c+=opac('提醒：'); break;
			}
			event_alert_c+=ret[i][1]+'<br>';
		}
		if(maxHide>0) {event_alert_c+='</span>';}
		el('event_alert').innerHTML='<table width="100%"><tr style="display:none"><td></td></tr><tr><td id="event_alert_c" style="text-align:left"></td></tr></table><br>';
		el('event_alert_c').innerHTML=event_alert_c;
	}else{
		el('event_alert').innerHTML='';
	}
}

function showMaxHide(){
	if(el('maxHide')){
		if(el('maxHide').style.display=='none'){
			el('maxHide').style.display='inline';
			el('showMaxHide').innerHTML='收起'+opac('：');
		}else{
			el('maxHide').style.display='none';
			el('showMaxHide').innerHTML='展开'+opac('：');
		}
	}
}

function opac(txt){
	return '<span style="opacity:0">'+txt+'</span>';
}

function el(text){
	return document.getElementById(text);
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

function clickExpand(){
	var tables = document.getElementsByClassName("index-expand");
	for (i = 0; i < tables.length; i++){
		var trs = tables[i].getElementsByTagName("tr");
		trs[0].onclick = function() {
			if (this.getElementsByTagName('a')[0]){
				this.getElementsByTagName('a')[0].click();
				return;
			}
			
			var contents = this.parentNode.getElementsByTagName("tr");
			var title = this.getElementsByTagName('td')[0].innerHTML.replace('▶','').replace('▲','').replace('▼','');
			if (contents[1]){
				if (contents[1].style.display=='none'){
					el("storage-click").innerHTML += ';'+title;
					for (j = 1; j< contents.length; j++) contents[j].style.display = "table-row";
					//this.innerHTML = this.innerHTML.replace('▶','▼');
				}else {
					el("storage-click").innerHTML = el("storage-click").innerHTML.replace(';'+title,'');
					for (j = 1; j< contents.length; j++) contents[j].style.display = "none";
					//this.innerHTML = this.innerHTML.replace('▼','▶');
				}
			}
			saveStorageClick();
		}
		if (trs[0].getElementsByTagName('a')[0])
			trs[0].getElementsByTagName('td')[0].innerHTML += '▶'; 
		else trs[0].getElementsByTagName('td')[0].innerHTML += '▼';
		for (j = 1; j< trs.length; j++) trs[j].style.display = "none";
	}
}

function loadStorageClick(){
	if (typeof(Storage) !== "undefined" && localStorage.getItem("ajglz_index")) {
		var loadString = localStorage.getItem("ajglz_index");
		var loadArr = loadString.split(';');
		var tables = document.getElementsByClassName("index-expand");
		for (var a = 0; a < loadArr.length; a++){
			for (i = 0; i < tables.length; i++){
				var tr = tables[i].getElementsByTagName("tr")[0];
				var title = tr.getElementsByTagName('td')[0].innerHTML.replace('▶','').replace('▲','').replace('▼','');
				if (title == loadArr[a]) {
					tr.click();
					break;
				}
			}
		}
	}
}
function saveStorageClick(){
	if (typeof(Storage) !== "undefined") {
		localStorage.setItem("ajglz_index", el('storage-click').innerHTML);
	}
}



/*
function getTableTitle(html){
	var trs = html.getElementsByTagName('tr');
	//for (i=0; i<trs.length; i++){
		var tds = trs[0].getElementsByTagName('td');
	//}
	var title = tds[0].innerHTML.replace('▶','').replace('▲','').replace('▼','');
	return title;
}*/



//https://www.xul.fr/ajax/responseHTML.txt
/**
	responseHTML
	(c) 2007-2008 xul.fr		
	Licence Mozilla 1.1
*/	


/**
	Searches for body, extracts and return the content
	New version contributed by users
*/


function getBody(content) 
{
   test = content.toLowerCase();    // to eliminate case sensitivity
   var x = test.indexOf("<body");
   if(x == -1) return "";

   x = test.indexOf(">", x);
   if(x == -1) return "";

   var y = test.lastIndexOf("</body>");
   if(y == -1) y = test.lastIndexOf("</html>");
   if(y == -1) y = content.length;    // If no HTML then just grab everything till end

   return content.slice(x + 1, y);   
} 

/**
	Loads a HTML page
	Put the content of the body tag into the current page.
	Arguments:
		url of the other HTML page to load
		id of the tag that has to hold the content
*/		

function loadHTML(url, fun, storage, param)
{
	//var xhr = createXHR();
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange=function()
	{ 
		if(xhr.readyState == 4)
		{
			//if(xhr.status == 200)
			{
				storage.innerHTML = getBody(xhr.responseText);
				fun(storage, param);
			}
		} 
	}; 

	xhr.open("GET", url , true);
	xhr.send(null); 

} 

	/**
		Callback
		Assign directly a tag
	*/		


	function processHTML(temp, target)
	{
		target.innerHTML = temp.innerHTML;
	}

	function loadWholePage(url)
	{
		var y = el("storage");
		var x = el("displayed");
		loadHTML(url, processHTML, x, y);
	}	


	/**
		Create responseHTML
		for acces by DOM's methods
	*/	
	
	function processByDOM(responseHTML, target)
	{
		target.innerHTML = "Extracted by id:<br />";

		// does not work with Chrome/Safari
		//var message = responseHTML.getElementsByTagName("div").namedItem("two").innerHTML;
		var message = responseHTML.getElementsByTagName("div").item(1).innerHTML;
		
		target.innerHTML += message;

		target.innerHTML += "<br />Extracted by name:<br />";
		
		message = responseHTML.getElementsByTagName("form").item(0);
		target.innerHTML += message.dyn.value;
	}
	
	function accessByDOM(url)
	{
		//var responseHTML = document.createElement("body");	// Bad for opera
		var responseHTML = el("storage");
		var y = el("displayed");
		loadHTML(url, processByDOM, responseHTML, y);
	}
