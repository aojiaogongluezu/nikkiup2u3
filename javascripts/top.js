$(document).ready(function () {
	init_top();
});

function init_top(){
	$('.cartContent').hide();
	$('#show_opt').hide();
	show_limitNote();
	enterKey();
	gen_setList();
	$("#showCnt").val(5);
	$("#maxHide").val(5);
	sortTags();
}

var top_id='';
var theme_name;
var inTop=[];
var inSec=[];
var cartList=[];
var currentList=[];
var currentSetList=[];
var setList=[];
var storeTop=[];
var limitMode=0;
var replaceSrc=['店·钻石'];

function searchById(){
	var searchById=clear_top_id();
	currentList=[];
	currentSetList=[];
	if(searchById){
		var out='<table border="1">';
		out+=tr(td('名称')+td('分类')+td('套装')+td('来源')+td(''));
		for (var i in setList){
			if (setList[i].indexOf(searchById)>-1){
				out+=tr(td(ahref(setList[i],"searchSet('"+setList[i]+"')"))+td('套装')+td('-')+td('-')+td(''));
				currentSetList.push(setList[i]);
			}
		}
		for (var i in clothes){
			if (searchById=='*'){
				currentList.push(i);
			}else if(searchById.indexOf('*')>-1){
				var searchArr=searchById.split('*');
				for (m=0;m<searchArr.length;m++){
					if (searchArr[m]=='套装'){
						if(!clothes[i].set) break;
					}else if (searchArr[m]=='非套装'){
						if(clothes[i].set) break;
					}else if (searchArr[m]!=''){
						if(clothes[i].name.indexOf(searchArr[m])<0&&clothes[i].source.indexOf(searchArr[m])<0&&clothes[i].type.type.indexOf(searchArr[m])<0) break;
					}
					if (m==searchArr.length-1) currentList.push(i);
				}
			}else if(clothes[i].name.indexOf(searchById)>-1||clothes[i].source.indexOf(searchById)>-1){
				currentList.push(i);
			}
		}
		out+=appendCurrent();
		out+='</table>';
		var out1='查找：'+searchById;
		if(currentList.length>0||currentSetList.length>0) {
			$('#topsearch_info').html(out);
			if (searchById!='*') out1+='　'+ahref('查找所有染色及进化',"searchSub(0,"+"'"+searchById+"')");
		}
		else $("#topsearch_info").html('没有找到相关资料');
		$("#topsearch_note").html(out1);
	}
}

function searchSet(setName){
	currentList=[];
	var out='<table border="1">';
	out+=tr(td('名称')+td('分类')+td('套装')+td('来源')+td(''));
	for (var i in clothes){
		if(clothes[i].set==setName||clothes[i].source.indexOf('套装成就：'+setName)>-1){
			currentList.push(i);
		}
	}
	out+=appendCurrent();
	out+='</table>';
	var out1='套装：'+setName+'　'+ahref('查找所有染色及进化',"searchSub(1,"+"'"+setName+"')");
	$('#topsearch_info').html(out);
	$("#topsearch_note").html(out1);
}

function searchSub(isSet,qString){
	var idList=currentList;
	currentList=[];
	var out1=(isSet?'套装：':'查找：')+qString+'　所有染色及进化';
	var out='<table border="1">';
	out+=tr(td('名称')+td('分类')+td('套装')+td('来源')+td(''));
	for (var i in idList){
		var orig=idList[i];
		do{
			currentList.push(orig);
			orig=searchOrig(orig);
		}while(orig!=-1);
	}
	do{
		currentList=searchDeriv(currentList);
	}while(currentList.length!=searchDeriv(currentList).length);
	out+=appendCurrent();
	out+='</table>';
	$('#topsearch_info').html(out);
	$("#topsearch_note").html(out1);
}

function searchOrig(id){
	var srcs=clothes[id].source.split('/');
	for (var s in srcs){
		if (srcs[s].indexOf('定')==0||srcs[s].indexOf('进')==0){
			var orig_num=srcs[s].substr(1);
			for (var i in clothes){
				if(clothes[i].type.mainType==clothes[id].type.mainType&&clothes[i].id==orig_num){return i;}
			}
		}
	}
	return -1;
}

function searchDeriv(idList){
	var retList=[];
	for (var id in idList){
		retList.push(idList[id]);
		var orig_num=clothes[idList[id]].id;
		for (var i in clothes){
			if (clothes[i].source.indexOf(orig_num)>0&&clothes[i].type.mainType==clothes[idList[id]].type.mainType){
				var srcs=clothes[i].source.split('/');
				for (var s in srcs){
					if (srcs[s]=='定'+orig_num||srcs[s]=='进'+orig_num){
						retList.push(i);
						break;
					}
				}
			}
		}
	}
	retList=getDistinct(retList);
	return retList;
}

function appendCurrent(){
	var out='';
	currentList=getDistinct(currentList);
	for (var c in category){//sort by category
		for (var i in currentList){
			if(clothes[currentList[i]].type.type!=category[c]) continue;
			var line=td(ahref(clothes[currentList[i]].name,'choose_topid('+currentList[i]+')'));
				line+=td(clothes[currentList[i]].type.type);
				line+=td(clothes[currentList[i]].set);
				var srcs=conv_source(clothes[currentList[i]].source,'进',clothes[currentList[i]].type.mainType);
					srcs=conv_source(srcs,'定',clothes[currentList[i]].type.mainType);
				if (srcs.indexOf('套装成就：')==0) srcs='套装成就';
				line+=td(srcs);
				line+=td(ahref('[×]','delCurrent('+currentList[i]+')'));
			out+=tr(line);
		}
	}
	return out;
}

function choose_topid(id){
	if ($('#cartMode').is(":checked")){
		addCart(id);
	}else{
		top_id=id;
		$('#textBox').css({'background':'#DDECFF'});
		$('#textBox').val(clothes[id].type.mainType+': '+clothes[id].name);
	}
}

function calctop(){
	if (isNaN(parseInt($("#showCnt").val())) || $("#showCnt").val()<1) {$("#showCnt").val(1);}
	$("#showCnt").val(parseInt($("#showCnt").val()));
	if (isNaN(parseInt($("#maxHide").val())) || $("#maxHide").val()<1) {$("#maxHide").val(1);}
	$("#maxHide").val(parseInt($("#maxHide").val()));
	
	limitMode=parseInt($("input[type='radio'][name='limit']:checked").val());
	
	if ($('#cartMode').is(":checked")){
		if (cartList.length==0){
			$('#alert_msg').html('选取列表为空_(:з」∠)_');
		}else{
			if(limitMode==2){
				clearOutput();
				propanal_byall();
			}else{
				if (!($('#showJJC').is(":checked")||$('#showAlly').is(":checked")||$('#showNormal').is(":checked"))){
					$('#alert_msg').html('至少选一种关卡_(:з」∠)_');
				}else{
					clearOutput();
					storeTopByCate_all();
					calctop_byall();
				}
			}
		}
	}else{
		if (!top_id) {
			$('#alert_msg').html('请选择一件衣服_(:з」∠)_');
		}else{
			if(limitMode==2){
				clearOutput();
				out_propanal_byid(top_id);
			}else{
				if (!($('#showJJC').is(":checked")||$('#showAlly').is(":checked")||$('#showNormal').is(":checked"))){
					$('#alert_msg').html('至少选一种关卡_(:з」∠)_');
				}else{
					clearOutput();
					storeTopByCate_single(top_id);
					calctop_byid(top_id);
					output_byid(top_id);
				}
			}
		}
	}
	$('#topsearch_info').css("margin-bottom",($("#showCnt").val()*25+50)+"px");
}

function clearOutput(){
	$('#alert_msg').html('');
	$('#topsearch_info').html('');
	$('#topsearch_note').html('');
}

function propanal_byid(id){
	//1.同属性排名 2.同属性+tag 3.tag数 4.被吊打 5.被吊打+tag
	var showCnt=$("#showCnt").val();
	var withTag=clothesWithTag(clothes[id]);
	var rank=[]; var rankEq=[]; var rankLow=[];
	var rankTag=[]; var rankTagEq=[]; var rankTagLow=[];
	var tagCnt=[];
	var repl=[];
	var replTag=[];
	var isTop=0; var isSec=0;
	var thisScore=Math.round(balanceScore(id,id));
	for (var i in clothes){
		if (clothes[i].type.type!=clothes[id].type.type) continue;
		var rankScore=Math.round(balanceScore(id,i));
		var supped=supp_byid(id,i);
		
		if (rankScore>thisScore) {rank.push([rankScore,i]);}
		else if (rankScore==thisScore) { 
			if(i==id) rankEq.unshift([rankScore,i]); 
			else rankEq.push([rankScore,i]);
		}else rankLow.push([rankScore,i]);
		if (supped) {repl.push([rankScore,i]);}
		
		if (withTag&&clothes[i].tags[0]){
			for (var j=0;j<clothes[id].tags.length+1;j++){
				if(clothes[id].tags.length<2&&j>0) break;
				var tagj=j<clothes[id].tags.length?'tag'+clothes[id].tags[j]:clothes[id].tags.join('+');
				//add 'tag' to solve 'pop' issue
				
				if(!tagCnt[tagj]) {tagCnt[tagj]=[];}
				if(!rankTag[tagj]) {rankTag[tagj]=[];}
				if(!rankTagEq[tagj]) {rankTagEq[tagj]=[];}
				if(!rankTagLow[tagj]) {rankTagLow[tagj]=[];}
				if(!replTag[tagj]) {replTag[tagj]=[];}
			
				for (var k=0;k<clothes[i].tags.length+1;k++){
					if(clothes[i].tags.length<2&&k>0) break;
					var tagk=k<clothes[i].tags.length?'tag'+clothes[i].tags[k]:clothes[i].tags.join('+');
					if(tagk==tagj) {
						if (i!=id) tagCnt[tagj].push([rankScore,i]);
						if (rankScore>thisScore) {rankTag[tagj].push([rankScore,i]);}
						else if (rankScore==thisScore) {
							if(i==id) rankTagEq[tagj].unshift([rankScore,i]); 
							else rankTagEq[tagj].push([rankScore,i]);
						}
						else rankTagLow[tagj].push([rankScore,i]);
						if (supped) {replTag[tagj].push([rankScore,i]);}
					}
				}
			}
		}	
	}
	
	//同属性排名
	rank.sort(function(a,b){return b[0] - a[0]});
	rankLow.sort(function(a,b){return b[0] - a[0]}); rankLow=rankLow.slice(0,showCnt-1);
	var rankTxt='第'+(rank.length+1);
	if (rankEq.length>1&&rank.length==0) rankTxt='并列'+rankTxt;
	var rankTip='';
	if (rank.length==0) {//除去错误连衣裙上下/手持顶配
		var rmTop=0;
		for (var i in repelCates){ //compare repelCates
			//First: 1st element in each repelCates; Others: other elements in each repelCates
			var topFirst = 0;
			var topOthers = 0;
			var repelNames = '';
			var repelCateNames = '';
			if($.inArray(clothes[id].type.type, repelCates[i])==0){
				for (var j in repelCates[i]){
					if (j>0) {
						var res = maxBalScore(repelCates[i][j],id);
						topOthers += res[0];
						repelNames += (repelNames.length>0 ? '+' : '') + res[1].name;
						repelCateNames += (repelCateNames.length>0 ? '+' : '') + shortForm(repelCates[i][j]);
					}else topFirst+=thisScore;
				}
				if(topFirst<topOthers){
					rankTip+='['+repelNames+']\n'; 
					rankTxt+='(不及'+repelCateNames+')';
					rmTop=1;
				}
			}
			else if($.inArray(clothes[id].type.type, repelCates[i])>0){
				for (var j in repelCates[i]){
					if (j>0) {
						if (clothes[id].type.type==repelCates[i][j]){
							topOthers += thisScore;
						}else{
							var res = maxBalScore(repelCates[i][j],id);
							topOthers += res[0];
						}
					}else {
						var res=maxBalScore(repelCates[i][j],id);
						topFirst += res[0];
						repelNames += res[1].name;
						repelCateNames = shortForm(repelCates[i][j]);
					}
				}
				if(topOthers<topFirst){
					rankTip+='['+repelNames+']\n'; 
					rankTxt+='(不及'+repelCateNames+')';
					rmTop=1;
				}
			}
		}
		if (!rmTop) isTop=1;
	}
	if (rank.length<showCnt) isSec=1;
	rank=rank.concat(rankEq).concat(rankLow);
	if (rank.length>showCnt*2) {rank=rank.slice(0,showCnt*2); var rankSlice=1;}
	else var rankSlice=0;
	if (rank.length>1){
		for (var i in rank){
			if (i>0) {rankTip+= (rank[i][0]==rank[i-1][0] ? ' = ' : ' > ');}
			rankTip+=clothes[rank[i][1]].name;
			if ((i==0&&rank[0][1]!=id)||(i==1&&rank[0][1]==id)) {rankTip+='['+cell_tag(rank[i][1],0,id).replace(/简|可|活|纯|凉|华|成|雅|性|暖/g,'')+']';}
		}
		rankTip+=(rankSlice? ' …' : '');
	}
	var out_rank=[rankTxt,rankTip];
	//同属性同tag排名
	var out_rankTag=[];
	if (withTag){
		for (var tagj in rankTag){
			rankTag[tagj].sort(function(a,b){return b[0] - a[0]});
			rankTagLow[tagj].sort(function(a,b){return b[0] - a[0]}); rankTagLow[tagj]=rankTagLow[tagj].slice(0,showCnt-1);
			var rankTagTxt='第'+(rankTag[tagj].length+1);
			if (rankTagEq[tagj].length>1&&rankTag[tagj].length==0) rankTagTxt='并列'+rankTagTxt;
			var rankTagTip='';
			if (rankTag[tagj].length==0) {//除去错误连衣裙上下/手持顶配
				var rmTop=0;
				for (var i in repelCates){ //compare repelCates
					//First: 1st element in each repelCates; Others: other elements in each repelCates
					var topFirst = 0;
					var topOthers = 0;
					var repelNames = '';
					var repelCateNames = '';
					if($.inArray(clothes[id].type.type, repelCates[i])==0){
						for (var j in repelCates[i]){
							if (j>0) {
								var res = maxBalScore(repelCates[i][j],id,tagj);
								topOthers += res[0];
								repelNames += (repelNames.length>0 ? '+' : '') + res[1].name;
								repelCateNames += (repelCateNames.length>0 ? '+' : '') + shortForm(repelCates[i][j]);
							}else topFirst+=thisScore;
						}
						if(topFirst<topOthers){
							rankTagTip='['+repelNames+']\n'; 
							rankTagTxt+='(不及'+repelCateNames+')';
							rmTop=1;
						}
					}
					else if($.inArray(clothes[id].type.type, repelCates[i])>0){
						for (var j in repelCates[i]){
							if (j>0) {
								if (clothes[id].type.type==repelCates[i][j]){
									topOthers += thisScore;
								}else{
									var res = maxBalScore(repelCates[i][j],id,tagj);
									topOthers += res[0];
								}
							}else {
								var res=maxBalScore(repelCates[i][j],id,tagj);
								topFirst += res[0];
								repelNames += res[1].name;
								repelCateNames = shortForm(repelCates[i][j]);
							}
						}
						if(topOthers<topFirst){
							rankTagTip='['+repelNames+']\n'; 
							rankTagTxt+='(不及'+repelCateNames+')';
							rmTop=1;
						}
					}
				}
				if (!rmTop) isTop=1;
			}
			if (rankTag[tagj].length<showCnt) isSec=1;
			rankTag[tagj]=rankTag[tagj].concat(rankTagEq[tagj]).concat(rankTagLow[tagj]);
			if (rankTag[tagj].length>showCnt*2) {rankTag[tagj]=rankTag[tagj].slice(0,showCnt*2); var rankTagSlice=1;}
			else var rankTagSlice=0;
			if (rankTag[tagj].length>1){
				for (var i in rankTag[tagj]){
					if (i>0) {rankTagTip+= (rankTag[tagj][i][0]==rankTag[tagj][i-1][0] ? ' = ' : ' > ');}
					rankTagTip+=clothes[rankTag[tagj][i][1]].name;
					if ((i==0&&rankTag[tagj][0][1]!=id)||(i==1&&rankTag[tagj][0][1]==id)) {rankTagTip+='['+cell_tag(rankTag[tagj][i][1],0,id).replace(/简|可|活|纯|凉|华|成|雅|性|暖/g,'')+']';}
				}
				rankTagTip+=(rankTagSlice? ' …' : '');
			}
			out_rankTag[tagj]=[rankTagTxt,rankTagTip];
		}
	}
	//相同tag部件数
	var out_tagCnt=[];
	if (withTag){
		for (var tagj in tagCnt){
			var tagTxt=tagCnt[tagj].length+'个';
			tagCnt[tagj].sort(function(a,b){return b[0] - a[0]});
			if (tagCnt[tagj].length==0) {//除去错误连衣裙上下/手持顶配
				var rmTop=0;
				for (var i in repelCates){ 
					var repelTags = false;
					var repelCateNames = '';
					if($.inArray(clothes[id].type.type, repelCates[i])==0){
						for (var j in repelCates[i]){
							if (j>0&&countIfTag(repelCates[i][j],tagj)) {
								repelTags = true;
								repelCateNames += (repelCateNames.length>0 ? '+' : '') + shortForm(repelCates[i][j]);
							}
						}
						if (repelTags) {tagTxt+='(有'+repelCateNames+')'; rmTop=1;}
					}
					else if($.inArray(clothes[id].type.type, repelCates[i])>0){
						if (repelCates[i][0]&&countIfTag(repelCates[i][0],tagj)){
							repelTags = true;
							repelCateNames += (repelCateNames.length>0 ? '+' : '') + shortForm(repelCates[i][0]);
						}
						if (repelTags) {tagTxt+='(有'+repelCateNames+')'; rmTop=1;}
					}
				}
				if (!rmTop) isTop=1;
			}
			if (tagCnt[tagj].length<showCnt) isSec=1;
			if (tagCnt[tagj].length>showCnt*2) {tagCnt[tagj]=tagCnt[tagj].slice(0,showCnt*2); var tagCntSlice=1;}
			else var tagCntSlice=0;
			var tagTip='';
			if (tagCnt[tagj].length>0){
				for (var i in tagCnt[tagj]){
					if(i>0) tagTip+='、';
					tagTip+=clothes[tagCnt[tagj][i][1]].name;
				}
				tagTip+=(tagCntSlice? ' …' : '');
			}
			out_tagCnt[tagj]=[tagTxt,tagTip];
		}
	}
	//属性被覆盖
	repl.sort(function(a,b){return b[0] - a[0]});
	var replTxt=repl.length+'个';
	if (repl.length==0) {//除去错误连衣裙，上下装逻辑没想好
		var rmTop=0;
		for (var i in repelCates){
			if(clothes[id].type.type==repelCates[i][0]){
				var isSupped=[];
				for (var j in repelCates[i]) if (j>0) isSupped.push(0); //initialize var isSupped=[0,0];
				for (var c in clothes){
					for (var j in repelCates[i]) {
						if (j>0&&isSupped[j-1]==0&&clothes[c].type.type==repelCates[i][j]) {
							if(supp_byid(id,c)){isSupped[j-1]=1;}
						}
					}
				}
				var repelCateNames = '';
				var repelSupp = true;
				for (var j in repelCates[i]) if (j>0) {
					if (isSupped[j-1]==0) repelSupp = false;
					else repelCateNames += (repelCateNames.length>0 ? '+' : '') + shortForm(repelCates[i][j]);
				}
				if (repelSupp) {replTxt+='(有'+repelCateNames+')'; rmTop=1;}
			}
		}
		if (!rmTop) isTop=1;
	}
	if (repl.length>showCnt) {repl=repl.slice(0,showCnt); var replSlice=1;}
	else var replSlice=0;
	var replTip='';
	if (repl.length>0){
		for (var i in repl){
			replTip+=clothes[repl[i][1]].name+'\n'+cell_tag(repl[i][1],0)+'\n';
		}
		replTip+=replSlice? '…' : '';
	}
	var out_repl=[replTxt,replTip];
	//属性+tag被覆盖
	var out_replTag=[];
	if (withTag){
		for (var tagj in replTag){
			var replTagTxt=replTag[tagj].length+'个';;
			replTag[tagj].sort(function(a,b){return b[0] - a[0]});
			if (replTag[tagj].length==0) {//除去错误连衣裙顶配，上下装逻辑没想好
				var rmTop=0;
				for (var i in repelCates){
					if(clothes[id].type.type==repelCates[i][0]){
						var isSupped=[];
						for (var j in repelCates[i]) if (j>0) isSupped.push(0); //initialize var isSupped=[0,0];
						for (var c in clothes){
							if(!clothes[c].tags.length) continue;
							for (var j in repelCates[i]) {
								if (j>0&&isSupped[j-1]==0&&clothes[c].type.type==repelCates[i][j]) {
									for (var k=0;k<clothes[c].tags.length+1;k++){
										if(clothes[c].tags.length<2&&k>0) break;
										var tagk=k<clothes[c].tags.length?'tag'+clothes[c].tags[k]:clothes[c].tags.join('+');
										if(tagk==tagj) {
											if(supp_byid(id,c)){isSupped[j-1]=1;}
										}
									}
								}
							}
						}
						var repelCateNames = '';
						var repelSupp = true;
						for (var j in repelCates[i]) if (j>0) {
							if (isSupped[j-1]==0) repelSupp = false;
							else repelCateNames += (repelCateNames.length>0 ? '+' : '') + shortForm(repelCates[i][j]);
						}
						if (repelSupp) {replTagTxt+='(有'+repelCateNames+')'; rmTop=1;}
					}
				}
				if (!rmTop) isTop=1;
			}
			if (replTag[tagj].length>showCnt) {replTag[tagj]=replTag[tagj].slice(0,showCnt); var replTagSlice=1;}
			else var replTagSlice=0;
			var replTagTip='';
			if (replTag[tagj].length>0){
				for (var i in replTag[tagj]){
					replTagTip+=clothes[replTag[tagj][i][1]].name+'\n'+cell_tag(replTag[tagj][i][1],0)+'\n';
				}
				replTagTip+=replTagSlice? '…' : '';
			}
			out_replTag[tagj]=[replTagTxt,replTagTip];
		}
	}
	return [out_rank,out_rankTag,out_tagCnt,out_repl,out_replTag,isTop,isSec];
}

function maxBalScore(ctype,id,tagName){
	var balScore=0; var balCloth={};
	for (var i in clothes){
		if (clothes[i].type.type!=ctype) continue;
		if (tagName){
			if(!clothes[i].tags.length) continue;
			for (var k=0;k<clothes[i].tags.length+1;k++){
				if(clothes[i].tags.length<2&&k>0) break;
				var tagk=k<clothes[i].tags.length?'tag'+clothes[i].tags[k]:clothes[i].tags.join('+');
				if(tagk==tagName) {
					var rankScore=Math.round(balanceScore(id,i));
					if(rankScore>balScore) {balScore=rankScore; balCloth=clothes[i];}
					break;
				}
			}
		}else {
			var rankScore=Math.round(balanceScore(id,i));
			if(rankScore>balScore) {balScore=rankScore; balCloth=clothes[i];}
		}
	}
	return [balScore,balCloth];
}

function countIfTag(type,tagName){
	for (var i in clothes){
		if(clothes[i].type.type!=type) continue;
		if(!clothes[i].tags.length) continue;
		for (var k=0;k<clothes[i].tags.length+1;k++){
			if(clothes[i].tags.length<2&&k>0) break;
			var tagk=k<clothes[i].tags.length?'tag'+clothes[i].tags[k]:clothes[i].tags.join('+');
			if(tagk==tagName) {
				return true;
			}
		}
	}
	return false;
}

function out_propanal_byid(id){
	var withTag=clothesWithTag(clothes[id]);
	var result=propanal_byid(id);
	var out_rank=result[0]; 
	var out_rankTag=result[1];
	var out_tagCnt=result[2]; 
	var out_repl=result[3];
	var out_replTag=result[4];
	
	var output=info_byid(id);
	if ($.inArray(clothes[id].type.type, skipCategory)>=0) {$('#topsearch_info').html(output+'冲突部位不予计算'); return false;} //skip
	output+='<span class="normTip">';
	//同属性排名
	output+='同属性排名：<br>';
	var rankTxt='－'+(withTag?'不计tag：':'')+out_rank[0];
	output+=(out_rank[1] ? addTooltip(rankTxt,out_rank[1]) : rankTxt) +'<br>';
	//同属性同tag排名
	if (withTag){
		for (var tagj in out_rankTag){
			var rankTagTxt='－'+rmtagstr(tagj)+'：'+out_rankTag[tagj][0];
			output+=(out_rankTag[tagj][1] ? addTooltip(rankTagTxt,out_rankTag[tagj][1]) : rankTagTxt) +'<br>';
		}
	}
	output+='<br>';
	//相同tag部件数
	if (withTag){
		output+='同部位同tag数：<br>';
		for (var tagj in out_tagCnt){
			var tagTxt='－'+rmtagstr(tagj)+'：'+out_tagCnt[tagj][0];
			output+=(out_tagCnt[tagj][1] ? addTooltip(tagTxt,out_tagCnt[tagj][1]) : tagTxt) +'<br>';
		}
		output+='<br>';
	}
	//属性被覆盖
	output+='属性被覆盖：<br>';
	var replTxt='－'+(withTag?'不计tag：':'')+out_repl[0];
	output+=(out_repl[1] ? addTooltip(replTxt,out_repl[1]) : replTxt) +'<br>';
	//属性+tag被覆盖
	if (withTag){
		for (var tagj in out_replTag){
			var replTagTxt='－'+rmtagstr(tagj)+'：'+out_replTag[tagj][0];
			output+=(out_replTag[tagj][1] ? addTooltip(replTagTxt,out_replTag[tagj][1]) : replTagTxt) +'<br>';
		}
	}
	output+='</span>';
	$('#topsearch_info').html(output);
}

function propanal_byall(){
	if($('#showSource').is(":checked")) var showSource=1;
	else var showSource=0;
	if($('#showMerc').is(":checked")) var showMerc=1;
	else var showMerc=0;
	
	var out='<table border="1" class="propByAll'+((showMerc||showSource)?' propSrc':'')+'">';
	out+=tr(td('名称')+td('部位')+((showMerc||showSource)?td(showSource?'来源':(showMerc?'价格':'')):'')+td('同属性排名')+td('同部位同tag数')+td('属性被覆盖'));
	for (var c in category){//sort by category
		for (var i in cartList){
			id=cartList[i];
			if(clothes[id].type.type!=category[c]) continue;
			var withTag=clothesWithTag(clothes[id]);
			var result=propanal_byid(id);
			var out_rank=result[0]; 
			var out_rankTag=result[1];
			var out_tagCnt=result[2]; 
			var out_repl=result[3];
			var out_replTag=result[4];
			var isTop=result[5];
			var isSec=result[6];
			
			var cell=td(addTooltip(clothes[id].name,cell_tag(id,1)),'class="inName normTip '+(isTop?'inTop':(isSec?'inSec':'inNone'))+'"');
			cell+=td(clothes[id].type.type,'class="inName"');
			if(showSource||showMerc){
				var cell_3rd='';
				if(showSource){
					var srcs=conv_source(clothes[id].source,'进',clothes[id].type.mainType);
						srcs=conv_source(srcs,'定',clothes[id].type.mainType);
					if (srcs.indexOf('套装成就：')==0) srcs='套装成就';
					cell_3rd=srcs;
				}
				if(showMerc){
					var price=getMerc(id);
					if(price) {
						var hasStr=0;
						for (var r in replaceSrc){
							if(cell_3rd.indexOf(replaceSrc[r])>-1) {cell_3rd=cell_3rd.replace(replaceSrc[r],price); hasStr=1; break;}
						}
						if (!hasStr) cell_3rd=price;
					}
				}
				cell+=td(cell_3rd,' class="inName"');
			}
			var cellContent='';
			
			//同属性排名
			var cellRank='';
			var rankTxt=(withTag?'不计tag：':'')+out_rank[0];
			cellRank+=(out_rank[1] ? addTooltip(rankTxt,out_rank[1]) : rankTxt) +'<br>';
			if (withTag){
				for (var tagj in out_rankTag){
					var rankTagTxt=rmtagstr(tagj)+'：'+out_rankTag[tagj][0];
					cellRank+=(out_rankTag[tagj][1] ? addTooltip(rankTagTxt,out_rankTag[tagj][1]) : rankTagTxt) +'<br>';
				}
			}
			cellContent+=td(cellRank,(cellRank.indexOf('第1<')>-1?'class="inTop"':' '));
			//tag
			if (withTag){
				var cellRank='';
				for (var tagj in out_tagCnt){
					var tagTxt=rmtagstr(tagj)+'：'+out_tagCnt[tagj][0];
					cellRank+=(out_tagCnt[tagj][1] ? addTooltip(tagTxt,out_tagCnt[tagj][1]) : tagTxt) +'<br>';
				}
				cellContent+=td(cellRank,(cellRank.indexOf('0个<')>-1?'class="inTop"':' '));
			}else cellContent+=td('-');
			//属性被覆盖
			var cellRank='';
			var replTxt=(withTag?'不计tag：':'')+out_repl[0];
			cellRank+=(out_repl[1] ? addTooltip(replTxt,out_repl[1]) : replTxt) +'<br>';
			if (withTag){
				for (var tagj in out_replTag){
					var replTagTxt=rmtagstr(tagj)+'：'+out_replTag[tagj][0];
					cellRank+=(out_replTag[tagj][1] ? addTooltip(replTagTxt,out_replTag[tagj][1]) : replTagTxt) +'<br>';
				}
			}
			cellContent+=td(cellRank,(cellRank.indexOf('0个<')>-1?'class="inTop"':' '));
			
			if ($.inArray(clothes[id].type.type, skipCategory)>=0) {cellContent=td('-')+td('-')+td('-'); isTop=0; isSec=0;} //skip
			if (!$('#hideNores').is(":checked")||isSec||isTop){
				out+=tr(cell+cellContent);
			}
		}
	}
	out+='</table>';
	$('#topsearch_info').html(out);
}

function balanceScore(id,comp){ //calc balance score in prop of id
	var out=0; var matchFeatures={};
	//if(clothes[id].simple[0]) { if(clothes[comp].simple[0]) out+=scoring[clothes[comp].type.mainType][clothes[comp].simple[0]]; matchFeatures['simple+']=1;}
	if(clothes[id].simple[0]) { if(clothes[comp].simple[0]) out+=Math.abs(clothes[comp].simple[2]); matchFeatures['simple+']=1;}
	if(clothes[id].simple[1]) { if(clothes[comp].simple[1]) out+=Math.abs(clothes[comp].simple[2]); matchFeatures['simple-']=1;}
	if(clothes[id].active[0]) { if(clothes[comp].active[0]) out+=Math.abs(clothes[comp].active[2]); matchFeatures['active+']=1;}
	if(clothes[id].active[1]) { if(clothes[comp].active[1]) out+=Math.abs(clothes[comp].active[2]); matchFeatures['active-']=1;}
	if(clothes[id].cute[0]) { if(clothes[comp].cute[0]) out+=Math.abs(clothes[comp].cute[2]); matchFeatures['cute+']=1;}
	if(clothes[id].cute[1]) { if(clothes[comp].cute[1]) out+=Math.abs(clothes[comp].cute[2]); matchFeatures['cute-']=1;}
	if(clothes[id].pure[0]) { if(clothes[comp].pure[0]) out+=Math.abs(clothes[comp].pure[2]); matchFeatures['pure+']=1;}
	if(clothes[id].pure[1]) { if(clothes[comp].pure[1]) out+=Math.abs(clothes[comp].pure[2]); matchFeatures['pure-']=1;}
	if(clothes[id].cool[0]) { if(clothes[comp].cool[0]) out+=Math.abs(clothes[comp].cool[2]); matchFeatures['cool+']=1;}
	if(clothes[id].cool[1]) { if(clothes[comp].cool[1]) out+=Math.abs(clothes[comp].cool[2]); matchFeatures['cool-']=1;}
	if (clothes[comp].type.type=='萤光之灵'){
		var compTags=clothes[comp].tags[0].split("+");
		var ft=CHINESE_TO_FEATURES[compTags[0]].join('');
		if(matchFeatures[ft]) out+=parseInt(compTags[1]);
	}
	return out;
}

function supp_byid(id,comp){ //true: comp suppresses/replaces id
	if(id==comp) return false;
	if(clothes[id].simple[0]) { if ( !clothes[comp].simple[0] || base[clothes[comp].simple[0]]<base[clothes[id].simple[0]] ) return false;}
	if(clothes[id].simple[1]) { if ( !clothes[comp].simple[1] || base[clothes[comp].simple[1]]<base[clothes[id].simple[1]] ) return false;}
	if(clothes[id].active[0]) { if ( !clothes[comp].active[0] || base[clothes[comp].active[0]]<base[clothes[id].active[0]] ) return false;}
	if(clothes[id].active[1]) { if ( !clothes[comp].active[1] || base[clothes[comp].active[1]]<base[clothes[id].active[1]] ) return false;}
	if(clothes[id].cute[0]) { if ( !clothes[comp].cute[0] || base[clothes[comp].cute[0]]<base[clothes[id].cute[0]] ) return false;}
	if(clothes[id].cute[1]) { if ( !clothes[comp].cute[1] || base[clothes[comp].cute[1]]<base[clothes[id].cute[1]] ) return false;}
	if(clothes[id].pure[0]) { if ( !clothes[comp].pure[0] || base[clothes[comp].pure[0]]<base[clothes[id].pure[0]] ) return false;}
	if(clothes[id].pure[1]) { if ( !clothes[comp].pure[1] || base[clothes[comp].pure[1]]<base[clothes[id].pure[1]] ) return false;}
	if(clothes[id].cool[0]) { if ( !clothes[comp].cool[0] || base[clothes[comp].cool[0]]<base[clothes[id].cool[0]] ) return false;}
	if(clothes[id].cool[1]) { if ( !clothes[comp].cool[1] || base[clothes[comp].cool[1]]<base[clothes[id].cool[1]] ) return false;}
	return true;
}

function calctop_byall(){
	if ($('#showJJC').is(":checked")) var showJJC=1;
	else var showJJC=0;
	if ($('#showAlly').is(":checked")) var showAlly=1;
	else var showAlly=0;
	if ($('#showNormal').is(":checked")) var showNormal=1;
	else var showNormal=0;
	if($('#showSource').is(":checked")) var showSource=1;
	else var showSource=0;
	if($('#showMerc').is(":checked")) var showMerc=1;
	else var showMerc=0;
	var out='<table border="1" class="calcByAll'+((showMerc||showSource)?' calcSrc':'')+'">';
	out+=tr(td('名称')+td('部位')+((showMerc||showSource)?td(showSource?'来源':(showMerc?'价格':'')):'')+td('顶配')+(showJJC?td('竞技场'):'')+(showAlly?td('联盟'+(limitMode?'(极限)':'')):'')+(showNormal?td('关卡'+(limitMode?'(极限)':'')):''));
	for (var c in category){//sort by category
		for (var i in cartList){
			id=cartList[i];
			if(clothes[id].type.type!=category[c])continue;
			calctop_byid(id);
			var rowspan=1;
			if(inTop.length>0 && inSec.length>0) rowspan++;
			
			var cell=td(addTooltip(clothes[id].name,cell_tag(id,1)),'rowspan="'+rowspan+'" class="inName normTip'+(inTop.length>0?' haveTop':'')+'"');
			cell+=td(clothes[id].type.type,'rowspan="'+rowspan+'" class="inName'+(inTop.length>0?' haveTop':'')+'"');
			if(showSource||showMerc){
				var cell_3rd='';
				if(showSource){
					var srcs=conv_source(clothes[id].source,'进',clothes[id].type.mainType);
						srcs=conv_source(srcs,'定',clothes[id].type.mainType);
					if (srcs.indexOf('套装成就：')==0) srcs='套装成就';
					cell_3rd=srcs;
				}
				if(showMerc){
					var price=getMerc(id);
					if(price) {
						var hasStr=0;
						for (var r in replaceSrc){
							if(cell_3rd.indexOf(replaceSrc[r])>-1) {cell_3rd=cell_3rd.replace(replaceSrc[r],price); hasStr=1; break;}
						}
						if (!hasStr) cell_3rd=price;
					}
				}
				cell+=td(cell_3rd,'rowspan="'+rowspan+'" class="inName'+(inTop.length>0?' haveTop':'')+'"');
			}
			if(inTop.length>0){
				cell+=td('顶配','class="inTop"');
				cell+=(showJJC?td(retTopTd(inTop,'竞技场',id),'class="inTop"'):'');
				cell+=(showAlly?td(retTopTd(inTop,'联盟',id),'class="inTop"'):'');
				cell+=(showNormal?td(retTopTd(inTop,'关卡',id),'class="inTop"'):'');
				out+=tr(cell);
			}
			if(inSec.length>0){
				if(inTop.length>0){cell='';}
				cell+=td('高配','class="inSec"');
				cell+=(showJJC?td(retTopTd(inSec,'竞技场',id),'class="inSec"'):'');
				cell+=(showAlly?td(retTopTd(inSec,'联盟',id),'class="inSec"'):'');
				cell+=(showNormal?td(retTopTd(inSec,'关卡',id),'class="inSec"'):'');
				out+=tr(cell);
			}
			if(inTop.length==0 && inSec.length==0 && !($('#hideNores').is(":checked"))){
				out+=tr(cell+td('-','class="inNone"')+(showJJC?td('','class="inNone"'):'')+(showAlly?td('','class="inNone"'):'')+(showNormal?td('','class="inNone"'):''));
				//out+=tr(cell+td('-','class="inNone" colspan="'+(showJJC+showAlly+showNormal+1)+'"'));
			}
		}
	}
	out+='</table>';
	$('#topsearch_info').html(out);
}

function retTopTd(arr,crit,id,cartNumIfMult){
	var ret='';
	var cnt=0;
	if (!cartNumIfMult) cartNumIfMult=0;
	
	if(arr==inTop){
		for (var s in inTop){
			if(inTop[s][0].indexOf(crit)==0) {
				if (crit=='竞技场') ret+=(cnt>0?', ':'')+addTooltip(nobr(inTop[s][0].substr(inTop[s][0].indexOf(': ')+2,2)+(inTop[s][1]?'':'(并列)')),inTop[s][2]);
				else ret+=(cnt>0?', ':'')+addTooltip(nobr(inTop[s][0].substr(inTop[s][0].indexOf(': ')+2)+(inTop[s][1]?'':'(并列)')),inTop[s][2]);
				cnt++;
			}
		}
		if(cnt>$("#maxHide").val()){
			switch(crit){
				case '竞技场': var pos=1; break;
				case '联盟': var pos=2; break;
				case '关卡': var pos=3; break;
			}
			a='<span id="cell'+id+'t'+(limitMode?"l":"n")+pos+cartNumIfMult+'">'+ahref('共'+cnt+'关',"showTop('"+id+"t"+(limitMode?"l":"n")+pos+cartNumIfMult+"')")+'</span>';
			a+='<span id="cell'+id+'t'+(limitMode?"l":"n")+pos+cartNumIfMult+'f" style="display:none">'+ret+'<br>'+nobr(ahref('收起',"hideTop('"+id+"t"+(limitMode?"l":"n")+pos+cartNumIfMult+"')"))+'</span>';
			return a;
		}
		return ret;
	}else{
		for (var s in inSec){
			if(inSec[s][0].indexOf(crit)==0) {
				if (crit=='竞技场') ret+=(cnt>0?', ':'')+addTooltip(nobr(inSec[s][0].substr(inSec[s][0].indexOf(': ')+2,2)+'(第'+inSec[s][1]+')'),inSec[s][2]);
				else ret+=(cnt>0?', ':'')+addTooltip(nobr(inSec[s][0].substr(inSec[s][0].indexOf(': ')+2)+'(第'+inSec[s][1]+')'),inSec[s][2]);
				cnt++;
			}
		}
		if(cnt>$("#maxHide").val()){
			switch(crit){
				case '竞技场': var pos=1; break;
				case '联盟': var pos=2; break;
				case '关卡': var pos=3; break;
				default: var pos=0;
			}
			a='<span id="cell'+id+'s'+(limitMode?"l":"n")+pos+cartNumIfMult+'">'+ahref('共'+cnt+'关',"showTop('"+id+"s"+(limitMode?"l":"n")+pos+cartNumIfMult+"')")+'</span>';
			a+='<span id="cell'+id+'s'+(limitMode?"l":"n")+pos+cartNumIfMult+'f" style="display:none">'+ret+'<br>'+nobr(ahref('收起',"hideTop('"+id+"s"+(limitMode?"l":"n")+pos+cartNumIfMult+"')"))+'</span>';
			return a;
		}
		return ret;
	}
}

function showTop(id){
	$('#cell'+id+'f').show();
	$('#cell'+id).hide();
}

function hideTop(id){
	$('#cell'+id+'f').hide();
	$('#cell'+id).show();
}

function storeTopByCate_single(id){
	var cartCates=[];
	cartCates.push(clothes[id].type.type);
	for (var k in repelCates){
		if($.inArray(clothes[id].type.type, repelCates[k])>-1){
			for (var j in repelCates[k]){
				cartCates.push(repelCates[k][j]);
			}
		}
	}
	cartCates=getDistinct(cartCates);
	storeTopByCate(cartCates);
}

function storeTopByCate_all(){
	var cartCates=[];
	for (var i in cartList){
		cartCates.push(clothes[cartList[i]].type.type);
		for (var k in repelCates){
			if($.inArray(clothes[cartList[i]].type.type, repelCates[k])>-1){
				for (var j in repelCates[k]){
					cartCates.push(repelCates[k][j]);
				}
			}
		}
	}
	cartCates=getDistinct(cartCates);
	storeTopByCate(cartCates);
}
function storeTopByCate(cartCates){
	for (var cate in cartCates){
			if ($('#showJJC').is(":checked")){
			for (var b in competitionsRaw){
				theme_name='竞技场: '+b;
				if (allThemes[theme_name]) {
					setFilters(allThemes[theme_name]);
					onChangeCriteria();
					if (cate==0){storeTop[theme_name]=[];}//initialize as array
					storeTop[theme_name].push([cartCates[cate],getTopCloByCate(criteria, $("#showCnt").val(), cartCates[cate])]);
				}
			}
		}
		if ($('#showAlly').is(":checked")){
			for (var c in tasksRaw){
				theme_name=c;
				if (allThemes[theme_name]) {
					setFilters(allThemes[theme_name]);
					onChangeCriteria();
					if (cate==0){storeTop[theme_name]=[];}//initialize as array
					storeTop[theme_name].push([cartCates[cate],getTopCloByCate(criteria, $("#showCnt").val(), cartCates[cate])]);
				}
			}
		}
		if ($('#showNormal').is(":checked")){
			for (var d in levelsRaw){
				theme_name='关卡: '+d;
				if (allThemes[theme_name]) {
					setFilters(allThemes[theme_name]);
					onChangeCriteria();
					if (cate==0){storeTop[theme_name]=[];}//initialize as array
					storeTop[theme_name].push([cartCates[cate],getTopCloByCate(criteria, $("#showCnt").val(), cartCates[cate])]);
				}
			}
		}
	}
}

function calctop_byid(id){
	inTop=[];inSec=[];
	
	if ($('#showJJC').is(":checked")){
		for (var b in competitionsRaw){
			theme_name='竞技场: '+b;
			if (allThemes[theme_name]) {
				calctop_bytheme(id,theme_name);
			}
		}
	}
	if ($('#showAlly').is(":checked")){
		for (var c in tasksRaw){
			theme_name=c;
			if (allThemes[theme_name]) {
				calctop_bytheme(id,theme_name);
			}
		}
	}
	if ($('#showNormal').is(":checked")){
		for (var d in levelsRaw){
			theme_name='关卡: '+d;
			if (allThemes[theme_name]) {
				calctop_bytheme(id,theme_name);
			}
		}
	}
}

function info_byid(id){
	var output='<b>'+clothes[id].name+'</b>&ensp;'+clothes[id].type.type+'&ensp;'+clothes[id].id+'<br>';
	var cell='';
		if(clothes[id].simple[0]) cell+='简约'+clothes[id].simple[0];
		if(clothes[id].simple[1]) cell+='华丽'+clothes[id].simple[1];
		if(clothes[id].active[0]) cell+='&ensp;活泼'+clothes[id].active[0];
		if(clothes[id].active[1]) cell+='&ensp;优雅'+clothes[id].active[1];
		if(clothes[id].cute[0]) cell+='&ensp;可爱'+clothes[id].cute[0];
		if(clothes[id].cute[1]) cell+='&ensp;成熟'+clothes[id].cute[1];
		if(clothes[id].pure[0]) cell+='&ensp;清纯'+clothes[id].pure[0];
		if(clothes[id].pure[1]) cell+='&ensp;性感'+clothes[id].pure[1];
		if(clothes[id].cool[0]) cell+='&ensp;清凉'+clothes[id].cool[0];
		if(clothes[id].cool[1]) cell+='&ensp;保暖'+clothes[id].cool[1];
		if(clothes[id].tags[0]) cell+='&ensp;'+clothes[id].tags.join(',');
	output+=cell+'<br>';
	if(clothes[id].set) output+='套装:'+clothes[id].set+'&ensp;';
	var srcs=conv_source(clothes[id].source,'进',clothes[id].type.mainType);
		srcs=conv_source(srcs,'定',clothes[id].type.mainType);
	var price=getMerc(id);
	output+='来源:'+srcs+(price?'('+price+')':'')+'<br><br>';
	
	return output;
}

function cell_tag(id,tagInd,baseId){
	var ret='';
	if(clothes[id].simple[0]&&((baseId&&clothes[baseId].simple[0])||(!baseId))) ret+='简'+clothes[id].simple[0];
	if(clothes[id].simple[1]&&((baseId&&clothes[baseId].simple[1])||(!baseId))) ret+='华'+clothes[id].simple[1];
	ret+='|';
	if(clothes[id].active[0]&&((baseId&&clothes[baseId].active[0])||(!baseId))) ret+='活'+clothes[id].active[0];
	if(clothes[id].active[1]&&((baseId&&clothes[baseId].active[1])||(!baseId))) ret+='雅'+clothes[id].active[1];
	ret+='|';
	if(clothes[id].cute[0]&&((baseId&&clothes[baseId].cute[0])||(!baseId))) ret+='可'+clothes[id].cute[0];
	if(clothes[id].cute[1]&&((baseId&&clothes[baseId].cute[1])||(!baseId))) ret+='成'+clothes[id].cute[1];
	ret+='|';
	if(clothes[id].pure[0]&&((baseId&&clothes[baseId].pure[0])||(!baseId))) ret+='纯'+clothes[id].pure[0];
	if(clothes[id].pure[1]&&((baseId&&clothes[baseId].pure[1])||(!baseId))) ret+='性'+clothes[id].pure[1];
	ret+='|';
	if(clothes[id].cool[0]&&((baseId&&clothes[baseId].cool[0])||(!baseId))) ret+='凉'+clothes[id].cool[0];
	if(clothes[id].cool[1]&&((baseId&&clothes[baseId].cool[1])||(!baseId))) ret+='暖'+clothes[id].cool[1];
	if(tagInd&&clothes[id].tags[0]) ret+='\n'+clothes[id].tags.join(',');
	return ret;
}

function output_byid(id){ //need inTop,inSec
	var output=info_byid(id);
	output+='<span class="normTip">'
	if(inTop.length>0){
		output+='顶配：<br>';
		for (var s in inTop){
			output+='&emsp;'+addTooltip(inTop[s][0]+(inTop[s][1]?'':'(并列)'),inTop[s][2])+'<br>';
		}
	}
	if(inSec.length>0){
		output+='高配：<br>';
		for (var u in inSec){
			output+='&emsp;'+addTooltip(inSec[u][0]+'(第'+inSec[u][1]+')',inSec[u][2])+'<br>';
		}
	}
	if(inTop.length==0 && inSec.length==0){
		output+='沒有顶配/高配信息';
	}
	output+='</span>';
	$('#topsearch_info').html(output);
}

function get_storeTop_Cate(them,cate){
	for (var t in storeTop[them]){
		if (storeTop[them][t][0]==cate) return storeTop[them][t][1];
	}
}

function calctop_bytheme(id,them){
	var showCnt=$("#showCnt").val();
	var resultList = get_storeTop_Cate(them,clothes[id].type.type);
	//resultList[r][0]=clothes, resultList[r][1]=clothes.sumScore
	var tmp=''; //tooltip text
	var thisRank=0;
	var thisRank_same=0; //same score with others if it ranks 1
	var moveTopToSec=0; //check repelCates to see real top 1
	var moveTopToNone=0; //check repelCates whether should be output
	
	//sort resultList
	for (var r in resultList){
		if(clothes[id]==resultList[r][0]){
			for (r2=0;r2<r;r2++){
				if(resultList[r][1]==resultList[r2][1]){
					var tmp_res=resultList[r];
					for (k=r;k>r2;k--){//lower others ranking
						resultList[k] = resultList[k-1];					
					}
					resultList[r2]=tmp_res;
					break;
				}
			}
			break;
		}
	}
	
	//get thisRank and output tooltip text
	for (var r in resultList){
		if (resultList[r]) {
			if (r>0) tmp+='\n';
			tmp+=resultList[r][1]+resultList[r][0].name;
			if(clothes[id]==resultList[r][0]){
				thisRank=Number(r)+1;
				if (r==0 && resultList[1] && parseInt(resultList[0][1])==parseInt(resultList[1][1])) thisRank_same=1;
			}
		}
	}
	
	if (thisRank>0){
		for (var i in repelCates){ //compare repelCates
			//First: 1st element in each repelCates; Others: other elements in each repelCates
			var topFirst = 0;
			var topOthers = 0;
			var fifthFirst = 0;
			var fifthOthers = 0;
			var repelNames = '';
			if($.inArray(clothes[id].type.type, repelCates[i])==0){
				for (var j in repelCates[i]){
					if (j>0) {
						var result_oth=get_storeTop_Cate(them, repelCates[i][j]);
						if (result_oth&&result_oth[0]){
							topOthers += result_oth[0][1];
							repelNames += (repelNames.length>0 ? '+' : '') + result_oth[0][0].name;
							if (result_oth[showCnt-1]){
								fifthOthers += result_oth[showCnt-1][1];
							}
						}
					}else {
						topFirst += resultList[0][1];
						fifthFirst += resultList[thisRank-1][1]; //itself
					}
				}
				if(topFirst<topOthers){
					moveTopToSec=1;
					tmp='['+topOthers+repelNames+']\n'+tmp;
				}
				if(fifthFirst<fifthOthers){
					moveTopToNone=1;
				}
			}
			else if($.inArray(clothes[id].type.type, repelCates[i])>0){
				for (var j in repelCates[i]){
					if (j>0) {
						if (clothes[id].type.type==repelCates[i][j]){
							topOthers += resultList[0][1];
							fifthOthers += resultList[thisRank-1][1]; //itself
						}else{
							var result_oth=get_storeTop_Cate(them, repelCates[i][j]);
							if (result_oth&&result_oth[0]){
								topOthers += result_oth[0][1];
								if (result_oth[showCnt-1]){
									fifthOthers += result_oth[showCnt-1][1];
								}
							}
						}
					}else {
						var result_oth=get_storeTop_Cate(them, repelCates[i][j]);
						if (result_oth&&result_oth[0]){
							topFirst += result_oth[0][1];
							repelNames += result_oth[0][0].name;
							if (result_oth[showCnt-1]){
								fifthFirst += result_oth[showCnt-1][1];
							}
						}
					}
				}
				if(topOthers<topFirst){
					moveTopToSec=1;
					tmp='['+topFirst+repelNames+']\n'+tmp;
				}
				if(fifthOthers<fifthFirst){
					moveTopToNone=1;
				}
			}
		}
		
		if (!moveTopToNone){
			if (moveTopToSec||thisRank>1) inSec.push([them,thisRank,tmp]);
			else if (thisRank_same>0) inTop.push([them,0,tmp]);
			else inTop.push([them,1,tmp]);
			
		}
	}
}

function getTopCloByCate(filters,rescnt,type){
	var result = [];
	if ($.inArray(type, skipCategory)>=0) return result;
	for (var i in clothes) {
		if (clothes[i].type.type!=type) continue;//skip other categories
		clothes[i].calc(filters);
		if (clothes[i].isF||clothes[i].sumScore<=0) continue;
		var sum_score = fullScore(clothes[i]);
		if (!result[0]) {
			result[0] = [clothes[i],sum_score];
		}else {
			if(result[rescnt-1] && sum_score < result[rescnt-1][1]){
				//do nothing
			}else if(result[rescnt-1] && sum_score == result[rescnt-1][1]){
				result.push([clothes[i],sum_score]);//push to end
			}else{
				for (j=0;j<rescnt;j++){//compare with [j]
					if(!result[j] || sum_score > result[j][1]){
						if (result[rescnt-1]&&result[rescnt-2]){
							if (result[rescnt-1][1] == result[rescnt-2][1]){//insert into list
								for (k=result.length;k>j;k--){//lower others ranking
									result[k] = result[k-1];
								}
								//put current clothes to [j]
								result[j] = [clothes[i],sum_score];
								break;
							}else{//create new list
								var result_orig=result;
								result=[];
								for(r=0;r<j;r++){
									result[r]=result_orig[r];
								}
								for (k=rescnt-1;k>j;k--){//lower others ranking
									result[k] = result_orig[k-1];
								}
								result[j]=[clothes[i],sum_score];
								break;
							}
						}else if(rescnt==1){//create new list with only 1 element
							result=[];
							result[j] = [clothes[i],sum_score];
						}else{
							for (k=rescnt-1;k>j;k--){//lower others ranking
								if(result[k-1]) result[k] = result[k-1];
							}
							//put current clothes to [j]
							result[j] = [clothes[i],sum_score];
							break;
						}
					}
				}
			}
		}
	}
	return result;
}

function sortTags(){
	for (var i in clothes){
		if(clothes[i].tags.length>1){clothes[i].tags.sort();}
	}
}

function show_limitNote(){
	var tooltip='即微笑+飞吻以及飞吻分別打在最高分的两个属性时的极限搭配权重(竞技场不计算)。此模式使用全衣柜下的极限权重，请注意收集度不同极限权重也可能会不同，并非一定适合所有玩家。';
	var output='<a href="" onclick="return false;" tooltip="'+tooltip+'">[注]</a>';
	$('#limitNote').html(output);
}

function chgLimitType(ind){
	if (ind<2) $('.levels').show();
	else $('.levels').hide();
}

function chgcartMode(){
	if ($('#cartMode').is(":checked")){
		$('.cartContent').show();
		refreshCart();
		clear_top_id();
	}else{
		$('.cartContent').hide();
	}
}

function clear_top_id(){
	top_id='';
	$('#textBox').css({'background':''});
	var searchById=$.trim($("#textBox").val());
	if(searchById.indexOf(': ')>-1) {
		searchById=searchById.substr(searchById.indexOf(': ')+2);
		$("#textBox").val(searchById);
	}
	return searchById;
}


function delCurrent(id){
	var newArr=currentList;
	currentList=[];
	for (var i in newArr){
		if(newArr[i]!=id) currentList.push(newArr[i]);
	}
	refreshCurrent();
}

function refreshCurrent(){
	var out='<table border="1">';
	out+=tr(td('名称')+td('分类')+td('套装')+td('来源')+td(''));
	if($('#topsearch_info').html().indexOf(td('套装')+td('-')+td('-')+td(''))>0){
		for (var i in currentSetList){
			out+=tr(td(ahref(currentSetList[i],"searchSet('"+currentSetList[i]+"')"))+td('套装')+td('-')+td('-')+td(''));
		}
	}
	out+=appendCurrent();
	out+='</table>';
	$('#topsearch_info').html(out);
}

function clearCart(){
	cartList=[];
	refreshCart();
}

function addCart_All(){
	for (var i in currentList){
		cartList.push(currentList[i]);
	}
	refreshCart();
}

function refreshCart(){
	$('#cart').html('');
	cartList=getDistinct(cartList);
	for (var i in cartList){
		$('#cart').append('<button class="btn btn-xs btn-default">'+clothes[cartList[i]].name+ahref('[×]','delCart('+cartList[i]+')')+'</button>&ensp;');
	}
}

function addCart(id){
	cartList.push(id);
	refreshCart();
}

function delCart(id){
	var newArr=cartList;
	cartList=[];
	for (var i in newArr){
		if(newArr[i]!=id) cartList.push(newArr[i]);
	}
	refreshCart();
}

function gen_setList(){
	setList=[];
	for (var i in clothes){
		if(clothes[i].set&&$.inArray(clothes[i].set,setList)<0){
			setList.push(clothes[i].set);
		}
	}
	setList=getDistinct(setList);
}

function nobr(text){
	return '<span class="nobr">'+text+'</span>';
}

function addTooltip(text,tooltip){
	return '<a href="" onclick="return false;" tooltip="'+tooltip+'" class="aTooltip">'+text+'</a>';
}

function getDistinct(arr){//don't know why the concise method doesn't work...
	var newArr=[];
	for (var i in arr){
		var ind=0;
		for (var j in newArr){
			if (arr[i]==newArr[j]) ind=1;
		}
		if(ind==0) newArr.push(arr[i]);
	}
	return newArr;
}

function hide_opt(){
	$('#show_opt').show();
	$('#options').hide();
}

function show_opt(){
	$('#options').show();
	$('#show_opt').hide();
}

function rmtagstr(txt){
	return txt.replace('tag','');
}

function clothesWithTag(piece){
	if(piece.type.type=='萤光之灵') return false;
	else return piece.tags[0] ? true : false;
}

function getMerc(id){
	for (var m in merchant){
		if(clothes[id]==clothesSet[merchant[m][0]][merchant[m][1]]){
			return merchant[m][2]+merchant[m][3];
		}
	}
	for (var m in construct){
		if(clothes[id].type.mainType==construct[m][0]&&clothes[id].name==construct[m][1]){
			var constructMaterial=[];
			for (var i in constructMaterialName) {
				for (var mm in construct){
					if(clothes[id].type.mainType==construct[mm][0]&&clothes[id].name==construct[mm][1]&&constructMaterialName[i]==construct[mm][2]) {
						constructMaterial.push(construct[mm][3]);
					}
				}
				if(constructMaterial.length<=i) constructMaterial.push(0);
			}
			return '重构'+constructMaterial.join('/');
		}
	}
	return;
}

//below is modified from material.js

function conv_source(src,subs,mainType){
	if(src.indexOf(subs)>-1){
		var pos1=src.indexOf(subs)+1;
		var pos2=src.indexOf('/',pos1); 
		if(pos2<0) {pos2=src.length;}
		var str1=src.substr(0,pos1);
		var str2=src.substr(pos1,pos2-pos1);
		var str3=src.substr(pos2);
		for (var p in clothes){
			if(clothes[p].type.mainType==mainType&&clothes[p].id==str2) 
			{str2='-'+clothes[p].name;}
		}
		return str1+str2+str3;
	}else{
		return src;
	}
}

function td(text,attr){
	return '<td'+(attr? ' '+attr : '')+'>'+text+'</td>';
}

function tr(text,attr){
	return '<tr'+(attr? ' '+attr : '')+'>'+text+'</tr>';
}

function ahref(text,onclick,cls){
	return '<a href="" onclick="'+onclick+';return false;" '+(cls? 'class="'+cls+'" ' : '')+'>'+text+'</a>';
}

function enterKey() {
	$('#textBox').keydown(function(e) {
		if (e.keyCode==13) {
			$(this).blur();
			searchById();
		}
	});
}

function shortForm(c){
	return c.indexOf('-')>0 ? c.split('-')[1] : c;
}

function fullScore(obj){
	return obj.type.mainType=='饰品' ? Math.round(accSumScore(obj,accCateNum)) : obj.sumScore;
}

//below is modified from nikki.js

function onChangeCriteria() {
	criteria = {};
	for (var i in FEATURES) {
		var f = FEATURES[i];
		var weight = parseFloat($('#' + f + "Weight").val());
		if (!weight) {
			weight = 1;
		}
		//rean mod
		if(limitMode==1){
			if(tasksAdd[theme_name]){
				if (f==tasksAdd[theme_name][0]) {weight=accMul(weight,1.27); criteria.highscore1=f;}
				if (f==tasksAdd[theme_name][1]) {weight=accMul(weight,1.778); criteria.highscore2=f;}
			}
		}
		/*if (uiFilter["highscore"]) {
			var highscore1 = $('#' + f + "1d778.active").length ? 1.778 : 1;
			var highscore2 = $('#' + f + "1d27.active").length ? 1.27 : 1;
			weight = accMul(accMul(weight, highscore1), highscore2);
		}*/
		var checked = $('input[name=' + f + ']:radio:checked');
		if (checked.length) {
			criteria[f] = parseInt(checked.val()) * weight;
		}
	}
	tagToBonus(criteria, 'tag1');
	tagToBonus(criteria, 'tag2');
	if (global.additionalBonus && global.additionalBonus.length > 0) {
		criteria.bonus = global.additionalBonus;
	}
	criteria.levelName = theme_name;
}

//below is duplicated from nikki.js

var criteria = {};

function accMul(arg1, arg2) {
	var m = 0,
	s1 = arg1.toString(),
	s2 = arg2.toString();
	try {
		m += s1.split(".")[1].length
	} catch (e) {}
	try {
		m += s2.split(".")[1].length
	} catch (e) {}
	return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
}

function tagToBonus(criteria, id) {
	var tag = $('#' + id).val();
	var bonus = null;
	if (tag.length > 0) {
		var base = $('#' + id + 'base :selected').text();
		var weight = parseFloat($('#' + id + 'weight').val());
		if ($('input[name=' + id + 'method]:radio:checked').val() == 'replace') {
			bonus = replaceScoreBonusFactory(base, weight, tag)(criteria);
		} else {
			bonus = addScoreBonusFactory(base, weight, tag)(criteria);
		}
		if (!criteria.bonus) {
			criteria.bonus = [];
		}
		criteria.bonus.push(bonus);
	}
}

function clearTag(id) {
	$('#' + id).val('');
	$('#' + id + 'base').val('SS');
	$('#' + id + 'weight').val('1');
	$($('input[name=' + id + 'method]:radio').get(0)).prop("checked", true);
	$($('input[name=' + id + 'method]:radio').get(0)).parent().addClass("active");
	$($('input[name=' + id + 'method]:radio').get(1)).parent().removeClass("active");
}

function bonusToTag(idx, info) {
	$('#tag' + idx).val(info.tag);
	if (info.replace) {
		$($('input[name=tag' + idx + 'method]:radio').get(1)).prop("checked", true);
		$($('input[name=tag' + idx + 'method]:radio').get(1)).parent().addClass("active");
		$($('input[name=tag' + idx + 'method]:radio').get(0)).parent().removeClass("active");
	} else {
		$($('input[name=tag' + idx + 'method]:radio').get(0)).prop("checked", true);
		$($('input[name=tag' + idx + 'method]:radio').get(0)).parent().addClass("active");
	}
	$('#tag' + idx + 'base').val(info.base);
	$('#tag' + idx + 'weight').val(info.weight);
}

var uiFilter = {};
function onChangeUiFilter() {
	uiFilter = {};
	$('.fliter:checked').each(function () {
		uiFilter[$(this).val()] = true;
	});

	if (currentCategory) {
		if (CATEGORY_HIERARCHY[currentCategory].length > 1) {
			$('input[name=category-' + currentCategory + ']:checked').each(function () {
				uiFilter[$(this).val()] = true;
			});
		} else {
			uiFilter[currentCategory] = true;
		}
	}
	refreshTable();
}

function setFilters(level) {
	currentLevel = level;
	global.additionalBonus = currentLevel.additionalBonus;
	var weights = level.weight;
	for (var i in FEATURES) {
		var f = FEATURES[i];
		var weight = weights[f];
		/*if (uiFilter["balance"]) {
			if (weight > 0) {
				weight = 1;
			} else if (weight < 0) {
				weight = -1;
			}
		}*/
		$('#' + f + 'Weight').val(Math.abs(weight));
		var radios = $('input[name=' + f + ']:radio');
		for (var j = 0; j < radios.length; j++) {
			var element = $(radios[j]);
			if (parseInt(element.attr("value")) * weight > 0) {
				element.prop("checked", true);
				element.parent().addClass("active");
			} else if (element.parent()) {
				element.parent().removeClass("active");
			}
		}
	}
	clearTag('tag1');
	clearTag('tag2');
	if (level.bonus) {
		for (var i in level.bonus) {
			bonusToTag(parseInt(i) + 1, level.bonus[i]);
		}
	}
}
