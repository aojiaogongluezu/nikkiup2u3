$(document).ready(function () {
	calcDependencies();
	show_scope();
	get_convertlist();
});

var highlight=['星之海','韶颜倾城','格莱斯'];
var highlight_style=['xzh','syqc','gls'];
var src=['公','少','店·金币,店·钻石,店','迷,幻,飘渺,昼夜,云禅','兑',''];
var src_desc=['公主级掉落','少女级掉落','商店购买','谜之屋','兑换','其它'];
var maxc=11;//max chapter
var reqCnt=[];
var parentInd=[];
var extraInd=[];
var extraAdded=[];
var shownFactor=[];
var convertlist=[];
var convertlistCnt=[];
var allSetInCate=[];

function show_scope(){
	$("#chooseSub2").html('');
	var chooseScope='';
	chooseScope+=selectBox("selectScope","chgScope()",[1,2,3],['按关卡','按套装','按部件']);
	chooseScope+='&ensp;-&ensp;'
	$("#chooseScope").html(chooseScope);
	chgScope();
}

function chgScope(){
	$("#levelDropInfo").html('');
	$("#levelDropNote").html('');
	
	var chooseLevel='';
	switch($("#selectScope").val()){
		case '1':
			chooseLevel+=selectBox("degree_level","showLevelDropInfo()",['公','少'],['公主','少女']);
			chooseLevel+='&ensp;-&ensp;';
			var chapVal=[0];var chapText=['请选择章节'];
			for(var i=1;i<=maxc;i++){
				chapVal.push(i);
				chapText.push('第'+i+'章');
			}
			chooseLevel+=selectBox("level_select","showLevelDropInfo()",chapVal,chapText);
			chooseLevel+=ahref('&#x1f50d;','showLevelDropInfo()','search');
			$("#chooseLevel").html(chooseLevel);
			$("#chooseSub").html('');
			break;
		case '2':
			var catelist=[];
			allSetInCate=[];
			for (var i in setcategory){
				if(jQuery.inArray(setcategory[i][0], catelist)<0){
					catelist.push(setcategory[i][0]);
				}
				allSetInCate.push(setcategory[i][1]);
			}
			for (var c in clothes){//add any set not listed to undefined
				if(clothes[c].set&&jQuery.inArray(clothes[c].set, allSetInCate)<0){
					catelist.push('-未分类-'); break;
				}
			}
			chooseLevel+=selectBox("degree_level","chooseSet()",catelist,catelist);
			$("#chooseLevel").html(chooseLevel);
			chooseSet();
			break;
		case '3': 
			//20160304: move 3-setSearch into chgScope-'2'
			var chapVal=[1,2,4,0];var chapText=['设计图','进化','特殊属性','自定义'];
			chooseLevel+=selectBox("degree_level","chgScopeSub()",chapVal,chapText);
			$("#chooseLevel").html(chooseLevel);
			chgScopeSub();
			break;
	}
}

function chooseSet(){
	var cate=$("#degree_level").val();
	var setlist=[];
	if(cate.substr(0,1)!='-'){
		for (var i in setcategory){
			if(setcategory[i][0]==cate){
				setlist.push(setcategory[i][1]);
			}
		}
	}else{
		for (var c in clothes){//any set not listed
			if(clothes[c].set&&jQuery.inArray(clothes[c].set, allSetInCate)<0){
				setlist.push(clothes[c].set);
			}
		}
	}
	setlist=getDistinct(setlist);
	setlist.sort();
	setlist.unshift('请选择');
	var chooseSub='&ensp;-&ensp;';
	chooseSub+=selectBox('searchSetMain','searchSetMain()',setlist,setlist);
	chooseSub+=ahref('&#x1f50d;','searchSetMain()','search');
	$("#chooseSub").html(chooseSub);
	searchSetMain();
}

function searchSetMain(){
	var setName=$("#searchSetMain").val();
	chgScopeSub2(3,setName);
}

function chgScopeSub(){
	$("#levelDropInfo").html('');
	$("#levelDropNote").html('');
	
	var j=$("#degree_level").val();
	var chooseSub='&ensp;-&ensp;';
	if(j==0){
		chooseSub+='<input type="text" style="line-height:100%;" id="searchById" placeholder="输入名字或编号搜索" />';
		chooseSub+=ahref('&#x1f50d;','searchById()','search');
		$("#chooseSub").html(chooseSub);
		enterKey();
	}
	else{
		var selectArr=[];
		if (j==1){
			for(var i in category){
				for(var c in clothes){
					if(clothes[c].type.type==category[i]&&clothes[c].source.indexOf('设')>-1) {
						selectArr.push(category[i]);
						break;
					}
				}
			}
		}else if (j==2){
			for(var i in category){
				for(var c in clothes){
					if(clothes[c].type.type==category[i]&&clothes[c].source.indexOf('进')>-1) {
						selectArr.push(category[i]);
						break;
					}
				}
			}
		}else if(j==3){//design&evo > others
			var tmpArr1=[];
			for(var c in clothes){
				if(clothes[c].set&&(clothes[c].source.indexOf('设')>-1||clothes[c].source.indexOf('进')>-1)){
					tmpArr1.push(clothes[c].set);
				}
			}
			selectArr=getDistinct(tmpArr1);
			selectArr.sort();
			tmpArr1=[];
			for(var c in clothes){
				if(clothes[c].set&&jQuery.inArray(clothes[c].set, selectArr)<0){
					tmpArr1.push(clothes[c].set);
				}
			}
			tmpArr1=getDistinct(tmpArr1);
			tmpArr1.sort();
			selectArr=selectArr.concat(tmpArr1);
		}else if(j==4){
			for(var c in clothes){
				if(clothes[c].tags[0]){
					for (var tag in clothes[c].tags){
						selectArr.push(clothes[c].tags[tag]);
					}
				}
			}
			selectArr=getDistinct(selectArr);
			selectArr.sort();
		}
		selectArr.unshift('请选择');
		chooseSub+=selectBox('chooseCate','chgScopeSub2()',selectArr,selectArr);
		chooseSub+=ahref('&#x1f50d;','chgScopeSub2()','search');
		$("#chooseSub").html(chooseSub);
		chgScopeSub2();
	}
}

function chgScopeSub2(j,k){
	if(!j) {j=$("#degree_level").val();}
	if(!k) {k=$("#chooseCate").val();}

	var valArr=[];
	if (j==1){
		for(var i in clothes){
			if(clothes[i].type.type==k&&clothes[i].source.indexOf('设')>-1){
				valArr.push(i);
			}
		}
	}else if(j==2){
		for(var i in clothes){
			if(clothes[i].type.type==k&&clothes[i].source.indexOf('进')>-1){
				valArr.push(i);
			}
		}
	}else if(j==3){
		for(var i in clothes){
			if(clothes[i].set==k){
				valArr.push(i);
			}
		}
	}else if(j==4){
		for(var i in clothes){
			if(clothes[i].tags[0]){
				for (var tag in clothes[i].tags){
					if(clothes[i].tags[tag]==k){
						valArr.push(i);
					}
				}
			}
		}
	}
	
	if (valArr.length>0){
		var j_txt=(j<=2) ? $("#degree_level option[value='"+j+"']").text()+'&ensp;-&ensp;' : '';//given now j<=2 only invoked by selectbox
		var set_link=(j==3)? '　'+ahref('套装材料总览',"searchSet('"+k+"')") : '';
		var levelDropInfo='查找：'+j_txt+k+set_link;
		var levelDropNote=table()+tr(tab('名称')+tab('分类')+tab('编号')+tab('来源'),'style="font-weight:bold;"');
		for (var c in category){//sort by category
			if(j<=2&&category[c]!=k) {continue;}//if j<=2 skip other categories
			for (var i in clothes){
				if(jQuery.inArray(i,valArr)>-1&&clothes[i].type.type==category[c]){
					var line=tab(ahref(clothes[i].name,'genFactor('+i+')'));
						line+=tab(clothes[i].type.type);
						line+=tab(clothes[i].id);
						var srcs=conv_source(clothes[i].source,'进',clothes[i].type.mainType);
							srcs=conv_source(srcs,'定',clothes[i].type.mainType);
						line+=tab(srcs);
					levelDropNote+=tr(line);
				}
			}
		}
		levelDropNote+=table(1);
	}
	$("#levelDropInfo").html(levelDropInfo? levelDropInfo:'');
	$("#levelDropNote").html(levelDropNote? levelDropNote:'');
}

function showFactorInfo(){
	var t=$("#chooseItem").val();
	if(t=='na'){
		$("#levelDropInfo").html('');
		$("#levelDropNote").html('');
	}
	else{genFactor(t);}
}

function showLevelDropInfo(){
	var j=$("#level_select").val();
	var degree=$("#degree_level").val();
	var levelDropInfo='';
	var levelDropNote='';
	if (j!=0){//chapter chosen
		levelDropInfo+=table()+tr(tab('名称')+tab('关卡')+tab('材料需求统计'),'style="font-weight:bold;"');
		for (l=1;l<30;l++){//sort by levels
			var l2=l;
			if(l>20){l2="支"+l%10;}
			
			for (var i in clothes){
				var src_sp=clothes[i].source.split("/");
				for (k=0;k<src_sp.length;k++){
					if(src_sp[k].indexOf(j+'-'+l2+degree)==0){//if source matches chapter&level
						var deps1=clothes[i].getDeps('   ', 1);
						var deps=add_genFac(deps1,1);
						var item='';
						
						for (var h in highlight){
							if(deps1.indexOf(highlight[h])>-1){
								var style=highlight_style[h];
								var ind=deps.lastIndexOf(highlight[h]);
								while(ind>-1){//in case it appears 2 times like 5-10
									var HRow_end=deps.indexOf('\n',ind)>-1 ? deps.indexOf('\n',ind) : deps.length;
									var HRow_start=deps.substr(0,ind).lastIndexOf('\n   [')+1;
									deps=deps.substr(0,HRow_start)+span(deps.substr(HRow_start,HRow_end-HRow_start),style)+deps.substr(HRow_end);
									ind=deps.substr(0,HRow_start).lastIndexOf(highlight[h]);
								}
								item+=span(clothes[i].name,style)+'<br/>';
							}
						}
						if(!item){item=clothes[i].name;}
						
						var line=tab(ahref(item,'genFactor('+i+')','inherit'));
							line+=tab(src_sp[k]);
							line+=tab(deps,'class="level_drop_cnt"');
						levelDropInfo+=tr(line);
					}
				}
			}
		}
		levelDropInfo+=table(1);
		for (var h in highlight){
			if(h>0){levelDropNote+='&ensp;/&ensp;';}
			levelDropNote+=span(highlight[h]+'材料',highlight_style[h]);
		}
	}
	$("#levelDropInfo").html(levelDropInfo);
	$("#levelDropNote").html(levelDropNote);
}

function genFactor_main(){
	do{
		var total=0;
		for (var i in clothes){//add extra count once only
			if(extraInd[i]&&(!extraAdded[i])){
				reqCnt[i]+=1; 
				genFactor2(clothes[i],1); 
				extraAdded[i]=1; 
				total+=1;
			}
		}
	}while(total>0);
}

function genFactor(id){
	clearCnt();
	
	extraInd[id]=1;
	genFactor_main();
	
	var cell='';
	var output=table()+tr(tab('<b>'+clothes[id].name+'</b>&ensp;'+clothes[id].type.type+'&ensp;'+clothes[id].id,'colspan="3"'));
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
	if(clothes[id].tags[0]) {
		var tags_conv=[];
		for (var tg in clothes[id].tags){
			tags_conv[tg]=ahref(clothes[id].tags[tg],"chgScopeSub2(4,'"+clothes[id].tags[tg]+"')");
		}
		cell+='&ensp;'+tags_conv.join(',');
	}
	if(clothes[id].set) cell+='&ensp;套装:'+ahref(clothes[id].set,"chgScopeSub2(3,'"+clothes[id].set+"')");
	output+=tr(tab(cell,'colspan="3"'));
	
	cell='来源:'+clothes[id].source;
	if(parentInd[id]) {
		//if parent show formula
		cell+=' = ';
		for (var p in pattern) {
			if (clothesSet[pattern[p][0]][pattern[p][1]]==clothes[id]){
				//output+=clothesSet[pattern[p][2]][pattern[p][3]].name+'x'+pattern[p][4]+' ';
				//show link
				for (var c in clothes){
					if(clothes[c]==clothesSet[pattern[p][2]][pattern[p][3]]){
						cell+=ahref(clothes[c].name,'genFactor('+c+')')+'x'+pattern[p][4]+' ';
						break;
					}
				}
			}
		}
		output+=tr(tab(cell,'colspan="3"'));
		output+=genBasicMaterial();
	}else{
		output+=tr(tab(cell,'colspan="3"'));
	}
	
	output+=tr(tab('','colspan="3"'));
	
	var deps1=clothes[id].getDeps('   ', 1);
	if (deps1){
		var pos1=deps1.indexOf('总计需');
		var pos2=deps1.indexOf('件',pos1);
		var strip=deps1.substr(pos1+3,pos2-pos1-3);
		output+=tr(tab('<b>此部件共需数量</b>','colspan="2"')+tab(strip));
		output+=tr(tab(add_genFac(deps1),'class="level_drop_cnt" colspan="3"'));
	}else{
		output+=tr(tab('<b>此部件非制作材料</b>','colspan="3"'));
	}
	output+=table(1);
	
	$("#levelDropInfo").html(output);
	$("#levelDropNote").html('');
}

function genFactor2(cloth,num){
	for (var i in pattern) {
		if (clothesSet[pattern[i][0]][pattern[i][1]]==cloth){//found factor
			for (var j in clothes){//mark it as parent
				if(clothes[j]==cloth){parentInd[j]=1;}
			}
			if(pattern[i][4]>1){//if num required>1
				for (var j in clothes){//mark sub as extra count needed
					if(clothes[j]==clothesSet[pattern[i][2]][pattern[i][3]]){extraInd[j]=1;break;}
				}
				addreqCnt(clothesSet[pattern[i][2]][pattern[i][3]],(pattern[i][4]-1)*num);
				genFactor2(clothesSet[pattern[i][2]][pattern[i][3]],(pattern[i][4]-1)*num);
			}else if(pattern[i][5]!='染'){//do not consume
				for (var j in clothes){
					if(clothes[j]==clothesSet[pattern[i][2]][pattern[i][3]]){extraInd[j]=1;}
				}
			}else{//dye
				addreqCnt(clothesSet[pattern[i][2]][pattern[i][3]],pattern[i][4]*num);
				genFactor2(clothesSet[pattern[i][2]][pattern[i][3]],pattern[i][4]*num);
				for (var c in convert){//add dye count
					if(cloth==clothesSet[convert[c][0]][convert[c][1]]){
						convertlistCnt[jQuery.inArray(convert[c][2],convertlist)]+=convert[c][4]*num;
						break;
					}
				}
			}
		}
	}
}

function clearCnt(){
	for (var i in clothes){//clear count in previous run
		reqCnt[i]=0;
		parentInd[i]=0;
		extraInd[i]=0;
		extraAdded[i]=0;
		shownFactor[i]=0;
	}
	for (var i in convertlist){
		convertlistCnt[i]=0;
	}
}

function addreqCnt(cloth,num){//add num in reqCnt[]
	for (var i in clothes){
		if (clothes[i]==cloth){
			if(reqCnt[i]){reqCnt[i]+=num;}
			else{reqCnt[i]=num;}
		}
	}
}

function searchById(){
	var searchById=$("#searchById").val();
	var searchById_match=0;
	if(searchById){
		var levelDropInfo='查找：'+searchById;
		levelDropNote=table()+tr(tab('名称')+tab('分类')+tab('编号')+tab('来源'),'style="font-weight:bold;"');
		for (var c in category){//sort by category
			for (var i in clothes){
				if( (clothes[i].name.indexOf(searchById)>-1||parseInt(clothes[i].id)==parseInt(searchById)) 
					&& clothes[i].type.type==category[c]){
					var line=tab(ahref(clothes[i].name,'genFactor('+i+')'));
						line+=tab(clothes[i].type.type);
						line+=tab(clothes[i].id);
						var srcs=conv_source(clothes[i].source,'进',clothes[i].type.mainType);
							srcs=conv_source(srcs,'定',clothes[i].type.mainType);
						line+=tab(srcs);
					levelDropNote+=tr(line);
					searchById_match=1;
				}
			}
		}
		levelDropNote+=table(1);
		$("#levelDropInfo").html(levelDropInfo);
		if(searchById_match){$("#levelDropNote").html(levelDropNote);}
		else{$("#levelDropNote").html('没有找到相关资料');}
	}
}

function searchSet(setName){
	clearCnt();
	
	var setCnt=0;
	for (var i in clothes){
		if(clothes[i].set==setName){
			extraInd[i]=1;
			setCnt+=1;
		}
	}
	genFactor_main();
	
	var output=table();
	var cell='<b>套裝：</b>'+ahref(setName,"chgScopeSub2(3,'"+setName+"')")+'　全'+setCnt+'个部件材料总览';
	output+=tr(tab(cell,'colspan="3"'));
	output+=tr(tab('','colspan="3"'));
	output+=genBasicMaterial();
	output+=table(1);
	
	$("#levelDropInfo").html(output);
	$("#levelDropNote").html('');	
}

function genBasicMaterial(){
	var header=[];
	var content=[];
	var output=tr(tab('基础材料')+tab('来源')+tab('需求数量'),'style="font-weight:bold;"');
	for (var s in src){//sort by source
		header[s]=tr(tab('<u>'+src_desc[s]+'</u>','colspan="3"'));
		
		if(s<2){
			for (l1=1;l1<=maxc;l1++){
				for (l=1;l<30;l++){//sort by level
					var l2=l;
					if(l>20){l2="支"+l%10;}
					for (var i in clothes){ if((!shownFactor[i])&&reqCnt[i]&&(!parentInd[i])){
						var srci=clothes[i].source;
						var src_sp=clothes[i].source.split("/");
						for (var ss in src_sp){
							if( (s==0&&src_sp[ss].indexOf(l1+'-'+l2+src[s])==0&&srci.indexOf(src[1])<0) || 
								(s==1&&src_sp[ss].indexOf(l1+'-'+l2+src[s])==0) ){
								if(!content[s]){content[s]='';}
								content[s]+=retFactor(i,srci);
								break;
							}
						}
					}}
				}
			}
		}else{
			var s_split=src[s].split(',');//sort by defined order
			for(var sp_n in s_split){
				for (var i in clothes){ if((!shownFactor[i])&&reqCnt[i]&&(!parentInd[i])){
					var srci=clothes[i].source;
					if(srci.indexOf(s_split[sp_n])>-1){
						if(!content[s]){content[s]='';}
						content[s]+=retFactor(i,srci);
					}
				}}
			}
		}
		if (content[s]) {output+=header[s]+content[s];}
	}
	
	var dye='';
	for (var c in convertlist){
		if(convertlistCnt[c]>0) {dye+=tr(tab(convertlist[c],'colspan="2"')+tab(convertlistCnt[c]));}
	}
	if(dye) {output+=tr(tab('<u>染料</u>','colspan="3"'))+dye;}
	
	return output;
}

function add_genFac(text,inherit){
	var textArr=text.split('\n'); //[0] to [length-2];
	var parents=[];
	for (var i=1;i<textArr.length-1;i++){//discard [0] for its own name
		var pos_end=(textArr[i].indexOf('[消耗')>-1 ? textArr[i].indexOf('[消耗') : textArr[i].length);
		var pos_start=textArr[i].substr(0,pos_end).lastIndexOf(']')+1;
		var pos_start_1=textArr[i].substr(0,pos_start).lastIndexOf('[')+1;
		var clo_name=textArr[i].substr(pos_start,pos_end-pos_start);
		var clo_type=textArr[i].substr(pos_start_1,pos_start-pos_start_1-1);
		for (var c in clothes){
			if (clothes[c].type.mainType==clo_type&&clothes[c].name==clo_name){
				clo_name=ahref(clo_name,'genFactor('+c+')',(inherit? 'inherit' : ''));
				break;
			}
		}
		parents[i-1]=textArr[i].substr(0,pos_start)+clo_name+textArr[i].substr(pos_end);
		if(!inherit){parents[i-1]=parents[i-1].substr(3);}
	}
	var out=(inherit? textArr[0]+'\n':'')+parents.join('\n')+'\n';
	return out;
}

function retFactor(i,srci){
	shownFactor[i]=1;
	var ret=tab(ahref(clothes[i].name,'genFactor('+i+')'));
		ret+=tab(srci);
		ret+=tab(reqCnt[i]);
	return tr(ret);
}

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

function getDistinct(arr){
	var newArr=[];
	for (var i in arr){
		if(jQuery.inArray(arr[i], newArr)<0){
			newArr.push(arr[i]);
		}
	}
	return newArr;
}

function get_convertlist(){
	for(var i in convert){
		convertlist.push(convert[i][2]);
	}
	convertlist=getDistinct(convertlist);
}

//******warning: here is different with the one on rean's site******//
function tab(text,attr){
	return '<td'+(attr? ' '+attr : '')+' style="text-align:left">'+text+'</td>';
}
//******warning: here is different with the one on rean's site******//

function tr(text,attr){
	return '<tr'+(attr? ' '+attr : '')+'>'+text+'</tr>';
}

function span(text,cls){
	return '<span'+(cls? ' class="'+cls+'"' : '')+'>'+text+'</span>';
}

function ahref(text,onclick,cls){
	return '<a href="" onclick="'+onclick+';return false;" '+(cls? 'class="'+cls+'" ' : '')+'>'+text+'</a>';
}

function table(ind){
	return ind? '</table>' : '<table border="1">';
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

function enterKey() {
	$('#searchById').keydown(function(e) {
		if (e.keyCode==13) {
			$(this).blur();
			searchById();
		}
	});
}