$(document).ready(function () {
	init_top();
});

function init_top(){
	$('.cartContent').hide();
	show_limitNote();
	init_placeholder();
	enterKey();
	gen_setList();
	sortTags();
	$("#showCnt").val(5);
	$("#maxHide").val(5);
	$('#showCnt2').val(3);
	$('#showScore').val(1000);
	toggleBuzz();
}

var top_id = '';
var theme_name;
var inTop = [];
var inSec = [];
var cartList = [[]];
var currentList = [];
var currentSetList = [];
var setList = [];
var storeTop = [];
var storeTop_old=[];
var limitMode = 0;
var manflist = '';
var manfresult = {};
var replaceSrc = ['店·钻石'];
var strAlly6 = '联盟委托: 6-';
var dp=10; //for top_update, to 1 decimal places

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
		if(clothes[i].set==setName || $.inArray('套装·'+setName, clothes[i].source.split('/'))>=0){
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
	var out1=(isSet?'套装：':'查找：')+qString+'　所有染色及进化';
	var out='<table border="1">';
	out+=tr(td('名称')+td('分类')+td('套装')+td('来源')+td(''));
	//search orig
	for (var i in currentList){
		var orig = currentList[i];
		while(orig != -1) {
			if($.inArray(orig, currentList)<0) currentList.push(orig);
			orig = function() {
				var src = clothes[orig].source;
				if (src.indexOf('定')>=0 || src.indexOf('进')>=0){
					var orig_num = src.replace(/[^(定|进)]*(定|进)([0-9]+)[^0-9]*/, "$2");
					for (var c in clothes){
						if(clothes[c].type.mainType==clothes[orig].type.mainType && clothes[c].id==orig_num) return c;
					}
				}
				return -1;
			}();
		}
	}
	//search deriv
	do{
		var origLen = currentList.length;
		var retCont = clone(currentList);
		for (var i in retCont){
			var orig_num = clothes[retCont[i]].id;
			for (var c in clothes){
				if (clothes[c].source.indexOf(orig_num)>0 && clothes[c].type.mainType==clothes[retCont[i]].type.mainType){
					var srcs = clothes[c].source.replace(/[^(定|进)]*(定|进)([0-9]+)[^0-9]*/, "$2");
					if(orig_num == srcs && $.inArray(c, retCont)<0) retCont.push(c);
				}
			}
		}
		retLen = retCont.length;
		currentList = retCont;
	}while(origLen != retLen);
	out+=appendCurrent();
	out+='</table>';
	$('#topsearch_info').html(out);
	$("#topsearch_note").html(out1);
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
				var srcs=conv_source(clothes[currentList[i]].source, clothes[currentList[i]].type.mainType);
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
	verifyNum('showCnt');
	verifyNum('maxHide');
	
	limitMode=parseInt($("input[type='radio'][name='limit']:checked").val());
	var caltype = ($('#showJJC').is(":checked")?2:1) * ($('#showAlly').is(":checked")?3:1) * ($('#showAlly6').is(":checked")?5:1) * ($('#showNormal').is(":checked")?7:1);
	
	if ($('#cartMode').is(":checked")){
		if (cartList[0].length==0){
			$('#alert_msg').html('选取列表为空_(:з」∠)_');
		}else{
			if(limitMode==2){
				clearOutput();
				$('#topsearch_info').html(propanal_byall(0).replace(/<table/g,'<table border="1"'));
			}else{
				if (caltype == 1){
					$('#alert_msg').html('至少选一种关卡_(:з」∠)_');
				}else{
					clearOutput();
					storeTop = storeTopByCartCates(caltype, $("#showCnt").val());
					$('#topsearch_info').html(calctop_byall(0, caltype).replace(/<table/g,'<table border="1"'));
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
				if (caltype == 1){
					$('#alert_msg').html('至少选一种关卡_(:з」∠)_');
				}else{
					clearOutput();
					storeTop = storeTopByCate_single(top_id, caltype);
					calctop_byid(top_id, caltype);
					output_byid(top_id);
				}
			}
		}
	}
	$('#topsearch_info').css("margin-bottom",($("#showCnt").val()*25+50)+"px");
}

function clearOutput(){
	$('.unwrap').html('');
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

function propanal_byall(cartListNum){
	var showSource = $('#showSource').is(":checked");
	var showMerc = $('#showMerc').is(":checked");
	
	var out = '<table class="propByAll'+((showMerc||showSource)?' propSrc':'')+'">';
	out += tr(td('名称')+td('部位')+((showMerc||showSource)?td(showSource?'来源':(showMerc?'价格':'')):'')+td('同属性排名')+td('同部位同tag数')+td('属性被覆盖'));
	var content = '';
	for (var c in category){//sort by category
		for (var i in cartList[cartListNum]){
			id = cartList[cartListNum][i];
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
			
			var cell=td(addTooltip(clothes[id].name,cell_tag(id,1)));
			cell+=td(shortForm(clothes[id].type.type));
			if(showSource||showMerc) cell += td(srcOrMerc(id, showSource, showMerc));
			
			//同属性排名
			var cellRank='';
			var rankTxt=(withTag?'不计tag:':'')+out_rank[0];
			cellRank+=(out_rank[1] ? addTooltip(rankTxt,out_rank[1]) : rankTxt) +'<br>';
			if (withTag){
				for (var tagj in out_rankTag){
					var rankTagTxt=rmtagstr(tagj)+':'+out_rankTag[tagj][0];
					cellRank+=(out_rankTag[tagj][1] ? addTooltip(rankTagTxt,out_rankTag[tagj][1]) : rankTagTxt) +'<br>';
				}
			}
			cell+=td(cellRank,(cellRank.indexOf('第1<')>-1?'class="top"':''));
			//tag
			if (withTag){
				var cellRank='';
				for (var tagj in out_tagCnt){
					var tagTxt=rmtagstr(tagj)+':'+out_tagCnt[tagj][0];
					cellRank+=(out_tagCnt[tagj][1] ? addTooltip(tagTxt,out_tagCnt[tagj][1]) : tagTxt) +'<br>';
				}
				cell+=td(cellRank,(cellRank.indexOf(':0个')>-1?'class="top"':''));
			}else cell+=td('-');
			//属性被覆盖
			var cellRank='';
			var replTxt=(withTag?'不计tag:':'')+out_repl[0];
			cellRank+=(out_repl[1] ? addTooltip(replTxt,out_repl[1]) : replTxt) +'<br>';
			if (withTag){
				for (var tagj in out_replTag){
					var replTagTxt=rmtagstr(tagj)+':'+out_replTag[tagj][0];
					cellRank+=(out_replTag[tagj][1] ? addTooltip(replTagTxt,out_replTag[tagj][1]) : replTagTxt) +'<br>';
				}
			}
			cell+=td(cellRank,(cellRank.indexOf(':0个')>-1||cellRank.indexOf('0个')==0?'class="top"':''));
			
			if ($.inArray(clothes[id].type.type, skipCategory)>=0) {cell=td('-')+td('-')+td('-'); isTop=0; isSec=0;} //skip
			if (!$('#hideNores').is(":checked")||isSec||isTop){
				content+=tr(cell,(isTop?'class="top"':''));
			}
		}
	}
	if(content) return out + content + '</table>';
	else return normaltext('无顶配/高配信息');
}

function srcOrMerc(id, showSource, showMerc){
	var cell_3rd='';
	if(showSource) cell_3rd=conv_source(clothes[id].source, clothes[id].type.mainType);
	if(showMerc){
		var price = getMerc(id);
		if(price) {
			var hasStr=0;
			for (var r in replaceSrc){ //replace string only, not the whole source
				if(cell_3rd.indexOf(replaceSrc[r])>-1) {cell_3rd = cell_3rd.replace(replaceSrc[r],price); hasStr=1; break;}
			}
			if (!hasStr) cell_3rd = price;
		}
	}
	return cell_3rd;
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

function calctop_byall(cartListNum, caltype){
	var showJJC = (caltype%2 == 0 ? true : false);
	var showAlly = (caltype%3 == 0 ? true : false);
	var showAlly6 = (caltype%5 == 0 ? true : false);
	var showNormal = (caltype%7 == 0 ? true : false);
	var showSource = $('#showSource').is(":checked");
	var showMerc = $('#showMerc').is(":checked");
	var rmguildhs = $('#rmguildhs').is(":checked");
	
	var out = '<table class="calcByAll'+((showMerc||showSource)?' calcSrc':'')+'">';
	out += tr(td('名称')+td('部位')+((showMerc||showSource)?td(showSource?'来源':(showMerc?'价格':'')):'')+td('顶配')+(showJJC?td('竞技场'):'')+(showAlly?td('联盟'+(limitMode&&!rmguildhs?'(极限)':'')):'')+(showNormal?td('关卡'+(limitMode?'(极限)':'')):''));
	var content = '';
	for (var c in category){//sort by category
		for (var i in cartList[cartListNum]){
			id = cartList[cartListNum][i];
			if(clothes[id].type.type!=category[c]) continue;
			calctop_byid(id, caltype);
			var rowspan = (inTop.length>0&&inSec.length>0)?2:1;
			
			var cell = td(addTooltip(clothes[id].name, cell_tag(id,1)), (rowspan>1?'rowspan="'+rowspan+'"':''));
			cell += td(shortForm(clothes[id].type.type),(rowspan>1?'rowspan="'+rowspan+'"':''));
			if(showSource||showMerc) cell += td(srcOrMerc(id, showSource, showMerc), (rowspan>1?'rowspan="'+rowspan+'"':''));
			
			if(inTop.length>0){
				cell+=td('顶配');
				cell+=(showJJC?td(retTopTd(inTop,'竞技场',id,cartListNum)):'');
				cell+=(showAlly?td(retTopTd(inTop,'联盟',id,cartListNum)):'');
				cell+=(showAlly6?td(retTopTd(inTop,strAlly6,id,cartListNum)):'');
				cell+=(showNormal?td(retTopTd(inTop,'关卡',id,cartListNum)):'');
				content+=tr(cell,'class="top"');
			}
			if(inSec.length>0){
				if(inTop.length>0) cell='';
				cell+=td('高配');
				cell+=(showJJC?td(retTopTd(inSec,'竞技场',id,cartListNum)):'');
				cell+=(showAlly?td(retTopTd(inSec,'联盟',id,cartListNum)):'');
				cell+=(showAlly6?td(retTopTd(inSec,strAlly6,id,cartListNum)):'');
				cell+=(showNormal?td(retTopTd(inSec,'关卡',id,cartListNum)):'');
				content+=tr(cell);
			}
			if(inTop.length==0 && inSec.length==0 && !($('#hideNores').is(":checked"))){
				content+=tr(cell+td('-')+(showJJC?td(''):'')+(showAlly?td(''):'')+(showNormal?td(''):''));
			}
			
			//place manual f result
			if (!limitMode && manfresult[clothes[id].name] && $('#manual_flist_result')){
				for (var f in manfresult[clothes[id].name]) 
					$('#manual_flist_result').append(clothes[id].name + ' ' + f + ' F<br>');
			}
		}
	}
	if(content) return out + content + '</table>';
	else return normaltext('无顶配/高配信息');
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
				case strAlly6: var pos=3; break;
				case '关卡': var pos=4; break;
			}
			a='<span id="a'+id+'t'+(limitMode?"l":"n")+pos+cartNumIfMult+'">'+ahref('共'+cnt+'关',"showTop('"+id+"t"+(limitMode?"l":"n")+pos+cartNumIfMult+"')")+'</span>';
			a+='<span id="a'+id+'t'+(limitMode?"l":"n")+pos+cartNumIfMult+'f" style="display:none">'+ret+'<br>'+nobr(ahref('收起',"hideTop('"+id+"t"+(limitMode?"l":"n")+pos+cartNumIfMult+"')"))+'</span>';
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
				case strAlly6: var pos=3; break;
				case '关卡': var pos=4; break;
				default: var pos=0;
			}
			a='<span id="a'+id+'s'+(limitMode?"l":"n")+pos+cartNumIfMult+'">'+ahref('共'+cnt+'关',"showTop('"+id+"s"+(limitMode?"l":"n")+pos+cartNumIfMult+"')")+'</span>';
			a+='<span id="a'+id+'s'+(limitMode?"l":"n")+pos+cartNumIfMult+'f" style="display:none">'+ret+'<br>'+nobr(ahref('收起',"hideTop('"+id+"s"+(limitMode?"l":"n")+pos+cartNumIfMult+"')"))+'</span>';
			return a;
		}
		return ret;
	}
}

function showTop(id){
	$('#a'+id+'f').show();
	$('#a'+id).hide();
}

function hideTop(id){
	$('#a'+id+'f').hide();
	$('#a'+id).show();
}

function addCates(list, id){
	list.push(clothes[id].type.type);
	for (var k in repelCates){
		if($.inArray(clothes[id].type.type, repelCates[k])>-1){
			for (var j in repelCates[k]){
				list.push(repelCates[k][j]);
			}
		}
	}
	return list;
}

function storeTopByCate_single(id, caltype){
	var cartCates=[];
	cartCates = addCates(cartCates, id);
	cartCates = $.unique(cartCates);
	return storeTopByCate(cartCates, caltype, $("#showCnt").val(), []);
}

function storeTopByCartCates(caltype, nCount){
	var cartCates=[];
	for (var i in cartList[0]) cartCates = addCates(cartCates, cartList[0][i]);
	cartCates = $.unique(cartCates);
	return storeTopByCate(cartCates, caltype, nCount, []);
}
function storeTopByCate(cartCates, caltype, nCount, skipList){
	var ret = [];
	var showJJC = (caltype%2 == 0 ? true : false);
	var showAlly = (caltype%3 == 0 ? true : false);
	var showAlly6 = (caltype%5 == 0 ? true : false);
	var showNormal = (caltype%7 == 0 ? true : false);
	
	for (var cate in cartCates){
			if (showJJC){
			for (var b in competitionsRaw){
				theme_name='竞技场: '+b;
				if (allThemes[theme_name]) {
					setFilters(allThemes[theme_name]);
					onChangeCriteria();
					if (cate==0){ret[theme_name]=[];}//initialize as array
					ret[theme_name].push([cartCates[cate],getTopCloByCate(criteria, nCount, cartCates[cate], skipList)]);
				}
			}
		}
		if (showAlly){
			for (var c in tasksRaw){
				theme_name = c;
				if (allThemes[theme_name]) {
					setFilters(allThemes[theme_name]);
					onChangeCriteria();
					if (cate==0){ret[theme_name]=[];}//initialize as array
					ret[theme_name].push([cartCates[cate],getTopCloByCate(criteria, nCount, cartCates[cate], skipList)]);
				}
			}
		}
		else if (showAlly6){
			for (var c in tasksRaw){
				theme_name = c;
				if (allThemes[theme_name] && theme_name.indexOf(strAlly6)==0) {
					setFilters(allThemes[theme_name]);
					onChangeCriteria();
					if (cate==0){ret[theme_name]=[];}//initialize as array
					ret[theme_name].push([cartCates[cate],getTopCloByCate(criteria, nCount, cartCates[cate], skipList)]);
				}
			}
		}
		if (showNormal){
			for (var d in levelsRaw){
				theme_name='关卡: '+d;
				if (allThemes[theme_name]) {
					setFilters(allThemes[theme_name]);
					onChangeCriteria();
					if (cate==0){ret[theme_name]=[];}//initialize as array
					ret[theme_name].push([cartCates[cate],getTopCloByCate(criteria, nCount, cartCates[cate], skipList)]);
				}
			}
		}
	}
	return ret;
}

function calctop_byid(id, caltype){
	inTop=[];inSec=[];
	
	var showJJC = (caltype%2 == 0 ? true : false);
	var showAlly = (caltype%3 == 0 ? true : false);
	var showAlly6 = (caltype%5 == 0 ? true : false);
	var showNormal = (caltype%7 == 0 ? true : false);
	
	if (showJJC){
		for (var b in competitionsRaw){
			theme_name='竞技场: '+b;
			if (allThemes[theme_name]) {
				calctop_bytheme(id,theme_name);
			}
		}
	}
	if (showAlly){
		for (var c in tasksRaw){
			theme_name = c;
			if (allThemes[theme_name]) {
				calctop_bytheme(id,theme_name);
			}
		}
	}
	else if (showAlly6){
		for (var c in tasksRaw){
			theme_name = c;
			if (allThemes[theme_name] && theme_name.indexOf(strAlly6)==0) {
				calctop_bytheme(id,theme_name);
			}
		}
	}
	if (showNormal){
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
	var srcs=conv_source(clothes[id].source, clothes[id].type.mainType);
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
	
	//sort resultList
	for (var r in resultList){
		if(clothes[id]==resultList[r][0]){
			for (r2=0;r2<r;r2++){
				if(resultList[r][1]==resultList[r2][1]){
					var thisRes=resultList[r];
					for (k=r;k>r2;k--){//lower others ranking
						resultList[k] = resultList[k-1];					
					}
					resultList[r2]=thisRes;
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
		var checkRealTopResult = checkRealTop(them, thisRank-1, resultList, showCnt);
		var moveTopToSec = checkRealTopResult[0];
		var moveTopToNone = checkRealTopResult[1];
		tmp = checkRealTopResult[2] + tmp;
		
		if (!moveTopToNone){
			if (moveTopToSec||thisRank>1) inSec.push([them,thisRank,tmp]);
			else if (thisRank_same>0) inTop.push([them,0,tmp]);
			else inTop.push([them,1,tmp]);
			
		}
	}
}

function checkRealTop(them, r, topLists, showCnt){
	var moveTopToSec=0; //check repelCates to see real top 1
	var moveTopToNone=0; //check repelCates whether should be output
	var prefix=''; 
	var itType = topLists[r][0].type.type;
	for (var i in repelCates){ //compare repelCates
		//First: 1st element in each repelCates; Others: other elements in each repelCates
		var topFirst = 0;
		var topOthers = 0;
		var fifthFirst = 0;
		var fifthOthers = 0;
		var repelNames = '';
		if($.inArray(itType, repelCates[i])==0){
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
					topFirst += topLists[0][1];
					fifthFirst += topLists[r][1]; //itself
				}
			}
			if(topFirst<topOthers){
				moveTopToSec=1;
				prefix='['+topOthers+repelNames+']\n';
			}
			if(fifthFirst<fifthOthers){
				moveTopToNone=1;
			}
		}
		else if($.inArray(itType, repelCates[i])>0){
			for (var j in repelCates[i]){
				if (j>0) {
					if (itType==repelCates[i][j]){
						topOthers += topLists[0][1];
						fifthOthers += topLists[r][1]; //itself
					}else{
						var result_oth=get_storeTop_Cate(them, repelCates[i][j]);
						if (result_oth&&result_oth[0]){
							topOthers += result_oth[0][1];
							fifthOthers += result_oth[0][1];
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
				prefix='['+topFirst+repelNames+']\n';
			}
			if(fifthOthers<fifthFirst){
				moveTopToNone=1;
			}
		}
	}
	return [moveTopToSec, moveTopToNone, prefix];
}

function getTopCloByCate(filters, rescnt, type, skipList){
	var result = [];
	if ($.inArray(type, skipCategory)>=0) return result;
	
	for (var i in clothes) {
		if (clothes[i].type.type!=type) continue;//skip other categories
		if (skipList && skipList.length>0 && $.inArray(i,skipList)>-1) continue;
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
	
	//manual flist handling
	if (manflist) {
		var manflist_curr=getTextContent(manflist,theme_name).split(',');
		var result_new = [];
		for (var i in result){
			if (jQuery.inArray(result[i][0].longid, manflist_curr)>=0){
				if (!manfresult[result[i][0].name]) manfresult[result[i][0].name] = {};
				manfresult[result[i][0].name][theme_name] = 'F';
			}else result_new.push(result[i]);
		}
		return result_new;
	}
	
	return result;
}

function sortTags(){
	for (var i in clothes){
		if(clothes[i].tags.length>1) clothes[i].tags.sort();
	}
}

function show_limitNote(){
	var tooltip='即微笑+飞吻以及飞吻分別打在最高分的两个属性时的极限搭配权重(竞技场不计算)。此模式使用全衣柜下的极限权重，请注意收集度不同极限权重也可能会不同，并非一定适合所有玩家。';
	var output='<a href="" onclick="return false;" tooltip="'+tooltip+'">' + $('#limitNote').html() + '</a>';
	$('#limitNote').html(output);
	$('#limitNote_update').html('<a href="" onclick="return false;" tooltip="联盟委托和主线关卡使用极限权重，具体请见顶配分析的说明。">' + $('#limitNote_update').html() + '</a>');
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
	cartList=[[]];
	refreshCart();
}

function addCart_All(){
	for (var i in currentList){
		cartList[0].push(currentList[i]);
	}
	refreshCart();
}

function refreshCart(){
	$('#cart').html('');
	cartList[0]=getDistinct(cartList[0]);
	for (var i in cartList[0]){
		$('#cart').append('<button class="btn btn-xs btn-default">'+clothes[cartList[0][i]].name+ahref('[×]','delCart('+cartList[0][i]+')')+'</button>&ensp;');
	}
}

function addCart(id){
	cartList[0].push(id);
	refreshCart();
}

function delCart(id){
	var newArr=cartList[0];
	cartList=[[]];
	for (var i in newArr){
		if(newArr[i]!=id) cartList[0].push(newArr[i]);
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
	setList=$.unique(setList);
}

function nobr(text){
	return '<span class="nobr">'+text+'</span>';
}

function addTooltip(text,tooltip){
	return '<a href="" onclick="return false;" tooltip="'+tooltip+'" class="aTooltip">'+text+'</a>';
}

function subtitle(text, id){
	 return '<p><b>' + text + '</b></p>';
}

function normaltext(text){
	 return '<p>' + text + '</p>';
}

function getDistinct(arr){//$.unique(arr) has problem distinguishing string/numbers, use this for unique numbers
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

function hide_opt(n){
	$('#show_opt'+n).show();
	$('#options'+n).hide();
}

function show_opt(n){
	$('#options'+n).show();
	$('#show_opt'+n).hide();
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
		if(clothesSet[construct[m][0]][construct[m][1]]==clothes[id]){
			var constructMaterial=[];
			for (var i in constructMaterialName) {
				for (var mm in construct){
					if(clothesSet[construct[mm][0]][construct[mm][1]]==clothes[id]&&constructMaterialName[i]==construct[mm][2]) {
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

function verifyNum(id){
	if (isNaN(parseInt($('#'+id).val())) || $('#'+id).val()<1) $('#'+id).val(1);
	$('#'+id).val(parseInt($('#'+id).val()));
}

function fullScore(obj){
	return obj.type.mainType=='饰品' ? Math.round(accSumScore(obj,accCateNum)) : obj.sumScore;
}

function toggleBuzz(){
	if (typeof(Storage) !== "undefined"&&localStorage.getItem("rean_buzz")){
		if(localStorage.getItem("rean_buzz")>0 && $('#buzz')){
			showBuzz();
		}
	}
}

function showBuzz(){
	if ($('#buzz')){
		if ($('#buzz').is(":visible")){
			$('#buzz').hide();
			$('#abuzz').html("&lt;碎碎念&gt;");
			var hideBuzz=1;
		}else{
			$('#buzz').show();
			$('#abuzz').html("&lt;收起&gt;");
			var hideBuzz=0;
		}
		if (typeof(Storage) !== "undefined") {
			localStorage.setItem("rean_buzz", hideBuzz);
		}
	}
}

//below is modified from material.js

function conv_source(src,mainType){
	if (src.indexOf('定')>=0 || src.indexOf('进')>=0) {
		var orig_num = src.replace(/[^(定|进)]*(定|进)([0-9]+)[^0-9]*/, "$2");
		for (var p in clothes){
			if (clothes[p].type.mainType==mainType&&clothes[p].id==orig_num) return src.replace(orig_num, '-' + clothes[p].name);
		}
	}
	if (src.indexOf('套装·')==0) src='套装';
	return src;
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

//below integrated with top_update

function init_placeholder(){
	$('#newVer').html(lastVersion);
}

function searchVersion(ver){
	ret=[];
	var largest = ver.replace(/V/g,'').split('.');
	for (var i in clothes){
		if (clothes[i].version == ver)
			ret.push(i);
		else if (ver != lastVersion) {
			var tmpArr = clothes[i].version.replace(/V/g,'').split('.');
			if (greaterVer(tmpArr,largest)) {
				ret.push(i);
			}
		}
	}
	return ret;
}

function chgDpMode(num){
	clearOutput();
	for (var i=1;i<=$(':radio[name="ar"]').length;i++){
		if (i!=num) $('.DpMode'+i).hide();
	}
	$('.DpMode'+num).show();
}

function calctopupd(){
	verifyNum('showCnt2');
	verifyNum('showScore');
	var caltype = ($('#showJJC2').is(":checked")?2:1) * ($('#showAlly2').is(":checked")?3:1) * ($('#showAlly62').is(":checked")?5:1) * ($('#showNormal2').is(":checked")?7:1);
	if (caltype == 1){
		$('#alert_msg_update').html('至少选一种关卡_(:з」∠)_');
	}else{
		clearOutput();
		check_tasksAdd_old();
		limitMode = 1;
		storeTop = storeTopByCate(category, caltype, $("#showCnt2").val(), []);
		limitMode = 3;
		storeTop_old = storeTopByCate(category, caltype, 1, searchVersion(lastVersion));
		$('#topsearch_info').html(compByTheme(caltype));
		$('#topsearch_info').css("margin-bottom",(parseInt($("#showCnt2").val())+5)+"em");
	}
}

function check_tasksAdd_old(){
	for (var i in tasksAdd){
		if (!tasksAdd_old[i]) tasksAdd_old[i] = tasksAdd[i];
	}
}

function compByTheme(caltype){
	var ret = '';
	var showJJC = (caltype%2 == 0 ? true : false);
	var showAlly = (caltype%3 == 0 ? true : false);
	var showAlly6 = (caltype%5 == 0 ? true : false);
	var showNormal = (caltype%7 == 0 ? true : false);
	if (showNormal){
		var NM_output=[];
		for (var d in levelsRaw){
			theme_name='关卡: '+d;
			NM_output.push(compByThemeName(theme_name));
		}
		ret += subtitle('主线关卡', 7) + outputByCate(NM_output);
	}
	if (showAlly){
		var LM_output=[];
		for (var c in tasksRaw){
			theme_name=c;
			LM_output.push(compByThemeName(theme_name));
		}
		ret += subtitle('联盟委托', 3) + outputByCate(LM_output);
	}
	else if (showAlly6){
		var LM_output=[];
		for (var c in tasksRaw){
			theme_name=c;
			if (theme_name.indexOf(strAlly6)==0) LM_output.push(compByThemeName(theme_name));
		}
		ret += subtitle('联盟委托第六章', 5) + outputByCate(LM_output);
	}
	if (showJJC){
		var JJC_output=[];
		for (var b in competitionsRaw){
			theme_name='竞技场: '+b;
			JJC_output.push(compByThemeName(theme_name));
		}
		ret += subtitle('竞技场', 2) + outputByCate(JJC_output);
	}
	return ret;
}

function compByThemeName(name){
	var sum_score=0;
	var sum_wholetheme=0;
	var sum_array=[]; //cate, diff, [new],[old]
	var rest=0;
	var new_tmp_array=[];
	var old_tmp_array=[];
	for (var c in storeTop[name]){
		//cate, [[clo,sumScore],[clo,sumScore]]
		
		var repelCatesList=[];
		for (var i in repelCates) for (var j in repelCates[i]) repelCatesList.push(repelCates[i][j]);
		if($.inArray(storeTop[name][c][0],repelCatesList)>=0){ //handle them at last
			new_tmp_array[storeTop[name][c][0]]=(storeTop[name][c][1].length==0? [0,[]] : [storeTop[name][c][1][0][1],storeTop[name][c][1]]); //score, [result]
			old_tmp_array[storeTop[name][c][0]]=(storeTop_old[name][c][1].length==0? [0,[]] : [storeTop_old[name][c][1][0][1],storeTop_old[name][c][1]]);
			continue;
		}
		
		if(storeTop[name][c][1].length==0) continue;
		sum_wholetheme+=storeTop[name][c][1][0][1];
		if(storeTop_old[name][c][1].length==0){//dun have old score
			var diff=storeTop[name][c][1][0][1];
			sum_score+=diff; 
			sum_array.push([storeTop[name][c][0],diff,storeTop[name][c][1],[]]);
		}
		else if(storeTop[name][c][1][0][0]!=storeTop_old[name][c][1][0][0]){//new clothes not old one
			var diff=(storeTop[name][c][1][0][1]-storeTop_old[name][c][1][0][1]);
			diff=Math.round(diff*dp)/dp;
			sum_score+=diff;
			sum_array.push([storeTop[name][c][0],diff,storeTop[name][c][1],storeTop_old[name][c][1]]);
		}
		else{
			var diff=(storeTop[name][c][1][0][1]-storeTop_old[name][c][1][0][1]);
			diff=Math.round(diff*dp)/dp;
			sum_score+=diff;
			rest+=diff;
		}
	}

	//handle repelCates
	for (var i in repelCates){
		var scoreFirst_new=0;
		var scoreOther_new=0;
		var scoreFirst_old=0;
		var scoreOther_old=0;
		var othCates='';
		var othCatesArrNew=[];
		var othCatesArrOld=[];
		var othChanged=false;
		for (var j in repelCates[i]){
			if (j>0) {
				scoreOther_new += new_tmp_array[repelCates[i][j]][0];
				scoreOther_old += old_tmp_array[repelCates[i][j]][0];
				othCates += (othCates.length>0 ? '+' : '') + shortForm(repelCates[i][j]);
				othCatesArrNew = othCatesArrNew.concat(new_tmp_array[repelCates[i][j]][1]);
				othCatesArrOld = othCatesArrOld.concat(old_tmp_array[repelCates[i][j]][1]);
				if (new_tmp_array[repelCates[i][j]][0] && 
					(old_tmp_array[repelCates[i][j]][0]==0 || new_tmp_array[repelCates[i][j]][1][0][0]!=old_tmp_array[repelCates[i][j]][1][0][0]))
					othChanged = true;
			}else{
				scoreFirst_new += new_tmp_array[repelCates[i][j]][0];
				scoreFirst_old += old_tmp_array[repelCates[i][j]][0];
			}
		}
		if (scoreFirst_new>=scoreOther_new){
			var new_dress_score=scoreFirst_new;
			var new_dress_array=new_tmp_array[repelCates[i][0]][1];
			var new_cate=repelCates[i][0];
		}else{
			var new_dress_score=scoreOther_new;
			var new_dress_array=othCatesArrNew;
			var new_cate=othCates;
		}
		if (scoreFirst_old>=scoreOther_old){
			var old_dress_score=scoreFirst_old;
			var old_dress_array=old_tmp_array[repelCates[i][0]][1];
			var old_cate=repelCates[i][0];
		}else{
			var old_dress_score=scoreOther_old;
			var old_dress_array=othCatesArrOld;
			var old_cate=othCates;
		}
		
		var diff=new_dress_score-old_dress_score;
		diff=Math.round(diff*dp)/dp;
		sum_score+=diff;
		sum_wholetheme+=new_dress_score;
		
		if (new_dress_score && 
			(old_dress_score==0 || new_dress_array[0][0]!=old_dress_array[0][0] || (new_cate==othCates && othChanged))) {
			if (i==0) sum_array.unshift([new_cate,diff,new_dress_array,old_dress_array]); //连衣裙上下装
			else sum_array.push([new_cate,diff,new_dress_array,old_dress_array]);
		}else{
			rest+=diff;
		}
	}
	sum_score=Math.round(sum_score*dp)/dp;
	rest=Math.round(rest*dp)/dp;
	sum_wholetheme=Math.round(sum_wholetheme);
	return [name,sum_score,sum_array,rest,sum_wholetheme];
}

function outputByCate(total){
	var showScore=parseInt($("#showScore").val());
	var output='<table border="1">';
	output+=tr(td('关卡')+td('理论分差/总分')+td('部位')+td('理论分差')+td('顶配'));
	total.sort(function(a,b){return b[1] - a[1]});
	var cnt = 0;
	for(var i in total){
		var name=total[i][0];
		var sum_score=total[i][1];
		var rowspan=total[i][2].length;
		var rest=total[i][3];
		var sum_wholetheme=total[i][4];
		if (rest!=0) rowspan++;
		if (sum_score>0 && sum_score>=showScore){
			cnt++;
			var outLine=td(name.replace('竞技场: ','').replace('委托','')+'<br>'+tasksAddFt(name),'rowspan="'+rowspan+'"')+td(sum_score+'<br>/'+sum_wholetheme,'rowspan="'+rowspan+'"');
			for(var j in total[i][2]){
				var cate=total[i][2][j][0];
				var diff_score=total[i][2][j][1]; 
				var new_res=total[i][2][j][2][0][0].name;
				if(cate.indexOf('+')>0){
					for(var k in total[i][2][j][2]){
						if(k>0&&total[i][2][j][2][k][0].type.type!=total[i][2][j][2][k-1][0].type.type) {new_res+='<br>'+total[i][2][j][2][k][0].name;break;}
					}
				}
				var tooltip='';
				for (var k in total[i][2][j][2]){
					tooltip+=total[i][2][j][2][k][1]+total[i][2][j][2][k][0].name+'\n';
				}
				if(total[i][2][j][3]){ 
					tooltip+='==上一版本==\n'
					for (var k in total[i][2][j][3]){//old result
						tooltip+=total[i][2][j][3][k][1]+total[i][2][j][3][k][0].name+'\n';
					}
				}
				outLine+=td(cate)+td(diff_score)+td(addTooltip(new_res,tooltip));
				output+=tr(outLine, sum_score>0&&sum_score>=showScore? '' : 'style="display:none;"');
				outLine='';
			}
			if (rest!=0) output+=tr(td('[极限权重变化]')+td(rest)+td(''), sum_score>0&&sum_score>=showScore? '' : 'style="display:none;"');
		}
	}
	output+='</table>';
	if (cnt>0) return output;
	else return normaltext('- 无结果');
}

function tasksAddFt(theme){
	if(tasksAdd[theme]) return '(笑:'+mapFt(tasksAdd[theme][0],theme)+'/吻:'+mapFt(tasksAdd[theme][1],theme)+')';
	else return '';
}

function mapFt(ft,theme){
	if(theme.indexOf('联盟委托')==0) {var ftList=tasksRaw[theme];}
	else if(theme.indexOf('关卡')==0) {var ftList=levelsRaw[theme.replace('关卡: ','')];}
	else return '-';
	
	switch(ft){
		case 'simple':
			if(ftList[0]>0) return '简';
			else return '华';
		case 'cute':
			if(ftList[1]>0) return '可';
			else return '成';
		case 'active':
			if(ftList[2]>0) return '活';
			else return '雅';
		case 'pure':
			if(ftList[3]>0) return '纯';
			else return '性';
		case 'cool':
			if(ftList[4]>0) return '凉';
			else return '暖';
		default:
			return '-';
	}
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
		else if(limitMode==3){
			if(tasksAdd_old[theme_name]){
				if (f==tasksAdd_old[theme_name][0]) {weight=accMul(weight,1.27); criteria.highscore1=f;}
				if (f==tasksAdd_old[theme_name][1]) {weight=accMul(weight,1.778); criteria.highscore2=f;}
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

function genLimitExc(arrId){
	//onChangeCriteria, calc normal weight
	criteria = {};
	for (var i in FEATURES) {
		var f = FEATURES[i];
		var weight = parseFloat($('#' + f + "Weight").val());
		if (!weight) {
			weight = 1;
		}
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
	var clothesOrigScore=[];
	for(var i in clothes){
		if ($.inArray(i, arrId)>-1) continue;
		clothes[i].calc(criteria);
		clothesOrigScore[i]=fullScore(clothes[i]);
	}
	
	//start loop
	var scoreTotal=0;
	var boosts=[];
	for (var a in FEATURES){
		for (var b in FEATURES){
			if (FEATURES[b]==FEATURES[a]) continue;
			//onChangeCriteria, calc highscore
			criteria = {};
			for (var i in FEATURES) {
				var f = FEATURES[i];
				var weight = parseFloat($('#' + f + "Weight").val());
				if (!weight) {
					weight = 1;
				}
				if (f==FEATURES[b]) {weight=accMul(weight,1.27); criteria.highscore1=f;}
				if (f==FEATURES[a]) {weight=accMul(weight,1.778); criteria.highscore2=f;}
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
			//calc sumScores
			shoppingCart.clear();
			var currScoreByCate=[];
			for (var i in clothes){
				if ($.inArray(i, arrId)>-1) continue;
				var c = clothes[i].type.type;
				if ($.inArray(c, skipCategory)>=0) continue;
				if (!currScoreByCate[c]) currScoreByCate[c]=0;
				if (clothesOrigScore[i]*1.778 < currScoreByCate[c]) continue; //short cut, no hope to become the new winner; from ip
				clothes[i].calc(criteria);
				var sum_score = fullScore(clothes[i]);
				if (sum_score>currScoreByCate[c]) {
					shoppingCart.put(clothes[i]);
					currScoreByCate[c]=sum_score;
				}
			}
			shoppingCart.validate(criteria);
			shoppingCart.calc(criteria);
			var tmpScore=shoppingCart.totalScore.sumScore;
			if (tmpScore>scoreTotal){
				scoreTotal=tmpScore;
				boosts=[FEATURES[b],FEATURES[a]];
			}
		}
	}
	return [boosts[0],boosts[1]];
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

function getTextContent(txt,key){
	var key1 = "'"+key+"'";
	if (txt.indexOf(key1) >= 0) {
		var tmp1 = txt.split(key1)[1]; 
		if (tmp1.indexOf('[') >= 0) return tmp1.split('[')[1].split(']')[0].replace(/ /g,'');
	}
	return '';
}
