//var wname=[wardrobe,wardrobe_s,wardrobe_i];
//var wowner=['rean','seal100x','ivangift'];
var wname=[wardrobe,wardrobe_s];
var wowner=['rean','seal100x'];

var rows=0;
var field_desc=['名字','分类','编号','心级',
	'华丽','简约','优雅','活泼','成熟','可爱','性感','清纯','清凉','保暖',
	'tag','来源','套装','版本'];
//var skip_comp=['来源'];
var skip_comp=[];

function show(){
	var pass='6394210ce21ac27fb5de7645824dff9be9ba0690';
	var userInput=$.sha1($("#passcode").val());
	$("#passcode").val('');
	if (userInput==pass){
		go();
	}else{
		$("#menu").html('');
		$("#info").html('&#x1f64a&#x1f64a&#x1f64a&#x1f64a&#x1f64a');
		$("#extra").html('');
	}
}

function go(){
	var menu='<table width=100% style="table-layout: fixed; font-weight:bold;">';
	var line=td(ahref('Clothes','go_comp()'));
		line+=td(ahref('Pattern','go_comp_pattern()'));
		line+=td(ahref('Add','go_add()'));
		line+=td(ahref('Data','go_static()'));
		line+=td(ahref('Source','go_src()'));
		line+=td('<a href="hs-rean.html" target="_blank">HSLevel</a>');
	menu+=tr(line);
	$("#menu").html(menu);
	$("#info").html('');
	$("#extra").html('');
}

function go_comp(){
	//start - special handling for seal100x wardrobe
	if(wardrobe_s){
		for(var i in wardrobe_s){
			var setInd = wardrobe_s[i][16];
			if(jQuery.inArray(setInd.substr(setInd.length-2,setInd.length), ['·套','·基','·染']) >=0) wardrobe_s[i][16]='';
		}
	}
	//end - special handling for seal100x wardrobe
	
	var cnt=[];
	for (var j in wname){
		cnt[j]=0;
		for(var i in wname[j]){
			cnt[j]++;
		}
	}
	var max=0;
	var list='Count ';
	for (var j in wname){
		list+=wowner[j]+':'+cnt[j]+' ';
		if (cnt[j]>max) {max=cnt[j];}
	}
	
	var str=[];
	for (var i in wname){
		str[i]=[];
	}
	var skip_pos=[];
	if(skip_comp){
		for (var i in skip_comp) skip_pos.push(jQuery.inArray(skip_comp[i], field_desc));
	}
	//var skip_pos=jQuery.inArray('来源', field_desc);
	for(var i=0;i<max;i++){//assign values into str[] from wardrobe
		for (var j in wname){
			if(wname[j][i]){
				str[j][i]=wname[j][i][0];
				for (var p=1;p<field_desc.length;p++){
					if(jQuery.inArray(p, skip_pos)>=0) continue;
					if(p==1&&wname[j][i][p]=='上衣') str[j][i]+='/上装';
					else str[j][i]+='/'+wname[j][i][p];
				}
			}else{
				str[j][i]='';
			}
		}
	}
	var out='<table>';
	out+=tr(td(list));
	out+=tr(td('<hr>'));
	for(var j=0;j<wname.length;j++){
		for(var i=j+1;i<wname.length;i++){//compare [j] with [i]
			if(j==i)  continue;
			out+=tr(td("Extra records in "+wowner[j]+"'s wardrobe VS "+wowner[i]+"'s:"));
			out+=tr(td(compare(str[j],str[i],'<br/>')));
			out+=tr(td('<hr>'));
			out+=tr(td("Extra records in "+wowner[i]+"'s wardrobe VS "+wowner[j]+"'s:"));
			out+=tr(td(compare(str[i],str[j],'<br/>')));
			out+=tr(td('<hr>'));
		}
	}
	out+='</table>';
	
	$("#info").html(out);
	$("#extra").html('');
}

function go_comp_pattern(){
	var p1=[];
	var p2=[];
	for (var i in pattern){
		p1.push(pattern[i].join('/'));
	}
	for (var i in pattern_s){
		p2.push(pattern_s[i].join('/'));
	}
	var out='<table>';
	out+=tr(td("Extra records in rean's wardrobe VS seal100x's:"));
	out+=tr(td(compare(p1,p2,'<br/>')));
	out+=tr(td('<hr>'));
	out+=tr(td("Extra records in seal100x's wardrobe VS rean's:"));
	out+=tr(td(compare(p2,p1,'<br/>')));
	out+='</table>';
	
	$("#info").html(out);
	$("#extra").html('');
}

function go_add(){
	rows=0;
	var form='<table id="go_add"><tbody>';
	var line='';
	for (var i in field_desc){
		line+=td(field_desc[i]);
	}
	form+=tr(line);
	form+='</tbody></table>';
	
	form+='<table>';
	line=td(button('Add',"add()"));
	line+=td(button('Del',"del()"));
	line+=td(button('Validate',"validWardrobe()"));
	line+=td(button('Generate',"genWardrobe()"));
	form+=tr(line);
	form+='</table>';
	
	$("#info").html(form);
	
	add();
}

function go_src(){
	var pos=jQuery.inArray('来源', field_desc);
	var src=[];
	for (var c in wname[0]){
		var ss=wname[0][c][pos].split("/");
		for (var s in ss){
			if (ss[s].indexOf('公')>-1) {ss[s]='*公';}
			if (ss[s].indexOf('少')>-1) {ss[s]='*少';}
			if (ss[s].indexOf('定')>-1) {ss[s]='*定';}
			if (ss[s].indexOf('进')>-1) {ss[s]='*进';}
			if (ss[s].indexOf('梦境·')>-1) {ss[s]='*梦境';}
			if (ss[s].indexOf('套装·')>-1) {ss[s]='*套装';}
			if (ss[s].indexOf('签到·')>-1) {ss[s]='*签到';}
			if (jQuery.inArray(ss[s], src)<0) {src.push(ss[s]);}
		}
	}
	src.sort();
	for (var s in src){
		src[s]=(s<9? '0'+(s*1+1) : (s*1+1))+src[s];
	}
	$("#info").html(src.join('<br/>'));
	$("#extra").html('');
}

function add(){
	rows++;
	var line='';
	for (var i=1;i<=field_desc.length;i++){
		line+=td('<input id="in'+rows+'_'+i+'" size="'+((i==1||i==2||i==15)?5:2)+'">');
	}
	$('#go_add > tbody:last-child').append(tr(line));
	arrowKey();
}

function del(){
	if(rows>1){
		rows--;
		$('#go_add tbody tr:last').remove();
	}
}

function genWardrobe(){
	var out='';
	for(var j=1;j<=rows;j++){
		out+='  [';
		for (var i=1;i<=field_desc.length;i++){
			out+="'"+$('#in'+j+'_'+i).val()+"'"+(i==field_desc.length?'':',');
		}
		out+='],<br/>';
	}
	$("#extra").html(out);
}

function validWardrobe(){
	var out='';
	var extra='';
	var chk1=[1,2,3,4,16];
	var chk2=[6,8,10,12,14];
	var prop=['SSS','SS','S','A','B','C',''];
	var src_list=[];//source list
	for (var c in wardrobe){
		if(jQuery.inArray(wardrobe[c][15], src_list)<0) {src_list.push(wardrobe[c][15]);}
	}
	for(var j=1;j<=rows;j++){
		var head=(j==1? '':'<br/>')+'row'+j+'('+$('#in'+j+'_1').val()+'): '
		var check=[];
		var cont='';
		for (var i=1;i<=field_desc.length;i++){
			check[i]=$('#in'+j+'_'+i).val();
			if((jQuery.inArray(i, chk1)>-1)&&(!check[i])) {cont+=field_desc[i-1]+'null, ';}
			if(jQuery.inArray(i, chk2)>-1){
				if(check[i]&&check[i*1-1]){cont+=field_desc[i-2]+field_desc[i-1]+'both, ';}
				else if(!check[i]&&!check[i*1-1]){cont+=field_desc[i-2]+field_desc[i-1]+'null, ';}
				else if(jQuery.inArray(check[i], prop)<0){cont+=field_desc[i-1]+'inv, ';}
				else if(jQuery.inArray(check[i-1], prop)<0){cont+=field_desc[i-2]+'inv, ';}
			}
			if(i==2&&check[i]&&jQuery.inArray(check[i], category)<0) {cont+=field_desc[i-1]+'inv, ';}
			if(i==3&&check[i]&&isNaN(parseInt(check[i]))) {cont+=field_desc[i-1]+'inv, ';}
			if(i==16&&check[i]&&jQuery.inArray(check[i], src_list)<0) {cont+=field_desc[i-1]+'inv, ';}
		}
		if(cont){out+=head+cont;}
	}
	$("#extra").html(out);
}

function compare(a,b,split){//a contains but b not
	var out='';
	for(var i=0;a[i];i++){
		if (jQuery.inArray(a[i], b)<0) {out+=a[i]+split;}
	}
	return out;
}

function arrowKey() {
	$('input').keydown(function(e) {
		if (e.keyCode==37) {//left
			if(this.value.slice(0, this.selectionStart).length==0){
			//$(this).prev('input').focus();
			$(this).parent().prev().find('input').focus();
			}
		}
		if (e.keyCode==39) {//right
			if(this.value.length==this.value.slice(0, this.selectionStart).length){
			$(this).parent().next().find('input').focus();
			}
		}
		if (e.keyCode==38) {//up
			var thisid=$(this).attr('id');
			var tar_str=thisid.substr(2,thisid.indexOf('_')-2);
			var tar_id=thisid.replace(tar_str,parseInt(tar_str)-1);
			if($('#'+tar_id).length>0) {$('#'+tar_id).focus();}
		}
		if (e.keyCode==40) {//down
			var thisid=$(this).attr('id');
			var tar_str=thisid.substr(2,thisid.indexOf('_')-2);
			var tar_id=thisid.replace(tar_str,parseInt(tar_str)+1);
			if($('#'+tar_id).length>0) {$('#'+tar_id).focus();}
		}
	});
}

function go_static(){
	var radio=['refactor','convert','cvtSeries','evolve','merge','arena','shop','guild','achieve'];
	var info = '<form id="static" action="">';
	for (var i in radio){
		info += '<label><input type="radio" name="radio_static" id="static_'+radio[i]+'" value="'+radio[i]+'" '+(i==0?'checked':'')+'>'+radio[i]+'</label><label>';
	}
	info += '</form><br>';
	info += '<textarea id="static_input" rows="10" style="width:100%"></textarea><br>';
	info += button('↓↓↓↓↓','static_generate()')+'<br>';
	info += '<textarea id="static_output" rows="10" style="width:100%"></textarea><br>';
	
	$("#info").html(info);
	$("#extra").html('');
	
	//gen list of setCates
	setCates = function() {
		var ret = [];
		for (var i in wardrobe){
			var cate = /^.*·[染套基]$/.test(wardrobe[i][16]) ? '' : wardrobe[i][16];
			if ($.inArray(cate,ret)<0) ret.push(cate);
		}
		return ret;
	}();
}

function static_generate(){
	var staticMode = $("#static input[type=radio]:checked").val();
	var static_input = $("#static_input").val();
	if(static_input) {
		var contents = contentOf(static_input)[0];
		var contentsName = contentOf(static_input)[1];
		var out = '';
		var outArr = {};
		var errmsg = '';
		for (var i in contents){
			switch(staticMode){
				case 'merge' :
					var tar = convert_uid(contentBy(contents[i],'id')[0]);
					var skip = ['11292','21094','60515','71156','82725','82726','82727','82728','82729','11294','21096','30527','60516','71158','82739','82740','82741','82743','21095','71159','82742'];
					if ($.inArray(tar.uid,skip)>=0) continue;
					var src_arr = contentBy(contents[i],'cloth');
					var num_arr = contentBy(contents[i],'num');
					if (tar.name&&tar.src[15].indexOf('设·图')<0) {
						//console.log ("'"+tar.name+"','"+tar.mainType+"','"+tar.id+"'"+' 设·图');
						ward = tar.src;
						console.log("  ['"+ward[0]+"','"+ward[1]+"','"+ward[2]+"','"+ward[3]+"','"+ward[4]+"','"+ward[5]+"','"+ward[6]+"','"+ward[7]+"','"+ward[8]+"','"+ward[9]+"','"+ward[10]+"','"+ward[11]+"','"+ward[12]+"','"+ward[13]+"','"+ward[14]+"','设·图','"+ward[16]+"','"+ward[17]+"','图'],");
					}
					for (var j in src_arr){
						var src = convert_uid(src_arr[j]);
						if (tar.name&&src.name) out += "  ['"+tar.mainType+"','"+tar.id+"','"+src.mainType+"','"+src.id+"','"+num_arr[j]+"','设'],\n";
						if (tar.name&&!src.name) errmsg += " " + src_arr[j];
					}
					break;
				case 'evolve':
					var tar = convert_uid(contentBy(contents[i],'id')[0]);
					var src = convert_uid(contentBy(contents[i],'src')[0]);
					var num = contentBy(contents[i],'num')[0];
					if (tar.name&&tar.src[15].indexOf('设·进')<0) {
						//console.log ("'"+tar.name+"','"+tar.mainType+"','"+tar.id+"'"+' 设·进'+src.id);
						ward = tar.src;
						console.log("  ['"+ward[0]+"','"+ward[1]+"','"+ward[2]+"','"+ward[3]+"','"+ward[4]+"','"+ward[5]+"','"+ward[6]+"','"+ward[7]+"','"+ward[8]+"','"+ward[9]+"','"+ward[10]+"','"+ward[11]+"','"+ward[12]+"','"+ward[13]+"','"+ward[14]+"','设·进"+src.id+"','"+ward[16]+"','"+ward[17]+"','进·'],");
					}
					if (tar.name&&src.name) out += "  ['"+tar.mainType+"','"+tar.id+"','"+src.mainType+"','"+src.id+"','"+num+"','进'],\n";
					if (tar.name&&!src.name) errmsg += " " + contentBy(contents[i],'src')[0];
					if (src.name&&!tar.name) errmsg += " " + contentBy(contents[i],'id')[0];
					break;
				case 'cvtSeries':
					var src = convert_uid(contentBy(contents[i],'')[0]);
					var tar_arr = contentBy(contents[i],'');
					tar_arr = tar_arr.slice(1);
					for (var j in tar_arr){
						var tar = convert_uid(tar_arr[j]);
						if (tar.name&&tar.src[15].indexOf('设·定')<0) {
							//console.log ("'"+tar.name+"','"+tar.mainType+"','"+tar.id+"'"+' 设·定'+src.id);
							ward = tar.src;
							console.log("  ['"+ward[0]+"','"+ward[1]+"','"+ward[2]+"','"+ward[3]+"','"+ward[4]+"','"+ward[5]+"','"+ward[6]+"','"+ward[7]+"','"+ward[8]+"','"+ward[9]+"','"+ward[10]+"','"+ward[11]+"','"+ward[12]+"','"+ward[13]+"','"+ward[14]+"','设·定"+src.id+"','"+ward[16]+"','"+ward[17]+"','定·'],");
						}
						if (tar.name&&src.name) out += "  ['"+tar.mainType+"','"+tar.id+"','"+src.mainType+"','"+src.id+"','1','染'],\n";
						if (src.name&&!tar.name) errmsg += " " + tar_arr[j];
					}
					break;
				case 'convert':
					var tar = convert_uid(contentBy(contents[i],'id')[0]);
					var dye = convert_dye(contentBy(contents[i],'item')[0]);
					var num = contentBy(contents[i],'num')[0];
					if (tar.name) out += "  ['"+tar.mainType+"','"+tar.id+"','"+dye[0]+"','"+dye[1]+"','"+num+"'],\n";
					break;
				case 'shop':
					var tar = convert_uid(contentBy(contents[i],'id')[0]);
					var skip = ['11379','30574','40593','50550','71237','83111','83112','83113','83114'];
					if ($.inArray(tar.uid,skip)>=0) continue;
					var price = contentBy(contents[i],'price')[0];
					var price_type = contentBy(contents[i],'price_type')[0];
					var currency = convert_priceType(price_type);
					var isOld = contentBy(contents[i],'is_activity_goods')[0]==1 ? '1' : '0';
					if (tar.name) out += "['"+tar.mainType+"','"+tar.id+"',"+price+",'"+currency+"',"+isOld+"],\n";
					if (tar.name&&tar.src[15].indexOf('店·')<0) {
						//console.log ("'"+tar.name+"','"+tar.mainType+"','"+tar.id+"'"+' 店·'+currency);
						ward = tar.src;
						console.log("  ['"+ward[0]+"','"+ward[1]+"','"+ward[2]+"','"+ward[3]+"','"+ward[4]+"','"+ward[5]+"','"+ward[6]+"','"+ward[7]+"','"+ward[8]+"','"+ward[9]+"','"+ward[10]+"','"+ward[11]+"','"+ward[12]+"','"+ward[13]+"','"+ward[14]+"','店·"+currency+"','"+ward[16]+"','"+ward[17]+"','"+currency.charAt(0)+"'],");
					}
					break;
				case 'arena':
					var tar = convert_uid(contentsName[i]);
					var price = contentBy(contents[i],'price')[0];
					var noDisplay = contentBy(contents[i],'no_display');
					var haveDiscount = contentBy(contents[i],'is_old_product')[0]=='1' ? '0' : '1';
					var isOld = contentBy(contents[i],'is_activity_goods')[0];
					if (tar.name&&!noDisplay) out += "  ['"+tar.mainType+"','"+tar.id+"',"+price+","+haveDiscount+","+isOld+",],\n";
					break;
				case 'refactor':
					var tar = convert_uid(contentBy(contents[i],'id')[0]);
					var src_arr = contentBy(contents[i],'cloth');
					var num_arr = contentBy(contents[i],'num');
					for (var j in src_arr){
						var src = convert_uid(src_arr[j]);
						if (tar.name&&src.name) out += "['"+tar.mainType+"','"+tar.id+"','"+src.name+"',"+num_arr[j]+"],\n";
					}
					break;
				case 'guild':
					var tar = convert_uid(contentsName[i]);
					var price = contentBy(contents[i],'price')[0];
					if (tar.name) out += "['"+tar.mainType+"','"+tar.id+"',"+price+",'联盟币'],\n";
					break;
				case 'achieve':
					var name = contentBy(contents[i],'name',1)[0].replace(/[\ \"]/g,'');
					var genre = contentBy(contents[i],'genre')[0];
					switch (genre){
						case '7': var genreName = '节日盛典'; var seq = 8; break;
						case '8': var genreName = '十二月剧团'; var seq = 9; break;
						case '9': var genreName = '一路相随'; var seq = 10; break;
						case '10': var genreName = '满天繁星'; var seq = 11; break;
						case '11': var genreName = '苹果联邦'; var seq = 1; break;
						case '12': var genreName = '莉莉斯王国'; var seq = 2; break;
						case '13': var genreName = '云端帝国'; var seq = 3; break;
						case '14': var genreName = '信鸽王国'; var seq = 4; break;
						case '15': var genreName = '北地王国'; var seq = 5; break;
						case '16': var genreName = '荒原共和国'; var seq = 6; break;
						case '17': var genreName = '废墟孤岛'; var seq = 7; break;
						case '18': var genreName = '梦恋奇迹'; var seq = 12; break;
						case '19': var genreName = '故事套装'; var seq = 14; break;
						case '20': var genreName = '御苑琼芳'; var seq = 13; break;
						case '21': var genreName = '奇妙博物馆'; var seq = 13; break;
						default: var genreName = '';
					}
					if (genreName && $.inArray(name,setCates)>=0){
						if (!outArr[seq]) outArr[seq] = [];
						outArr[seq].push("  ['" + genreName + "','" + name + "'],\n");
						if (name=='白骨夫人'||name=='幽冥仙主') outArr[seq].push("  ['" + genreName + "','" + name + "·入夜'],\n");
					}
					if (i==Object.keys(contents).length-1){ //last record
						for (var seq in outArr){
							outArr[seq].reverse();
							for (var l in outArr[seq]){
								out += outArr[seq][l];
							}
						}
					}
					break;
			}
		}
		if (errmsg) alert('尚缺:'+errmsg);
		$("#static_output").val(out);
	}
}

function contentOf(txt){
	var ind=0; var ind2=0;
	var ret=[]; var ret_cont=''; var ret_name=''; var name=[];
	for (var i=0; i<txt.length; i++){
		var c = txt.substr(i,1);
		if (c=='{') ind++;
		else if (c=='}') {
			ind--;
			if (ind==0) {ret.push(ret_cont.substr(1)); ret_cont=''; name.push(ret_name); ret_name='';}
		}
		if (ind>0) ret_cont += c;
		else if (c.match(/^[0-9a-z]$/)) ret_name += c;
	}
	return [ret,name];
}

function contentBy(txt,varname,keepChars){
	if (!keepChars) txt = txt.replace(/[^0-9a-z\,_{}=]/gi,'');
	varname = varname+'=';
	if (txt.indexOf(varname)<0) return false;
	var txt_sp = txt.split(varname);
	var ret = [];
	for (var i=1; i<txt_sp.length; i++) ret.push(txt_sp[i].split(',')[0]);
	return ret;
}

function convert_uid(uid){
	if (uid=='81327') uid='31327';
	if (uid=='82599') uid='62599';
	if (uid=='83221') uid='73221';
	
	var mainId = uid.substr(0,1);
	var id = (uid.substr(1,1)==0 ? uid.substr(2,3) : uid.substr(1,4));
	var mainType = convert_type(mainId);
	return {
		uid: uid,
		mainType: mainType,
		id: id,
		name: clothesSet[mainType][id],
		src: clothesSrc[mainType][id], //src=clothesSrc[mainType][id][15]
	}
}

var clothesSet = function() {
  var ret = {};
  for (var i in wardrobe) {
    var t = wardrobe[i][1].split('-')[0];
    if (!ret[t]) {
      ret[t] = {};
    }
    ret[t][wardrobe[i][2]] = wardrobe[i][0];
  }
  return ret;
}();

var clothesSrc = function() {
  var ret = {};
  for (var i in wardrobe) {
    var t = wardrobe[i][1].split('-')[0];
    if (!ret[t]) {
      ret[t] = {};
    }
    ret[t][wardrobe[i][2]] = wardrobe[i];
  }
  return ret;
}();

function convert_type(tid){
	switch(tid){
		case '1' : return '发型';
		case '2' : return '连衣裙';
		case '3' : return '外套';
		case '4' : return '上装';
		case '5' : return '下装';
		case '6' : return '袜子';
		case '7' : return '鞋子';
		case '8' : return '饰品';
		case '9' : return '妆容';
	}
}

function convert_dye(tid){
	switch(tid){
		case '2001' : return ['石榴红','8'];
		case '2002' : return ['青柠黄','8'];
		case '2003' : return ['阳光橙','8'];
		case '2004' : return ['灵动绿','8'];
		case '2005' : return ['天真蓝','8'];
		case '2006' : return ['典雅紫','8'];
		case '2007' : return ['梦幻粉','8'];
		case '2008' : return ['珍珠白','8'];
		case '2009' : return ['星尘黑','8'];
		case '2010' : return ['其他染料','12'];
		case '3001' : return ['水玉点点','20'];
		case '3002' : return ['经典网格','20'];
		case '3003' : return ['清新条纹','20'];
		case '3004' : return ['高级花纹','20'];
	}
}

function convert_priceType(tid){
	switch(tid){
		case '0' : return '金币';
		case '1' : return '钻石';
		case '3' : return '水晶鞋';
		case '6' : return '蔷薇';
		case '5' : return '翡翠';
		case '9' : return '沙漏';
		case '17' : return '惊雀铃';
		case '28' : return '琉璃';
		default : return '?';
	}
}

$(document).ready(function () {
	$('#passcode').keydown(function(e) {
		if (e.keyCode==13) {
			$(this).blur();
			show();
		}
	});
});

function td(text,attr){
	return '<td'+(attr? ' '+attr : '')+'>'+text+'</td>';
}

function tr(text,attr){
	return '<tr'+(attr? ' '+attr : '')+'>'+text+'</tr>';
}

function button(text,onclick){
	return '<button onclick="'+onclick+';return false;">'+text+'</button>'
}

function ahref(text,onclick,cls){
	return '<a href="" onclick="'+onclick+';return false;" '+(cls? 'class="'+cls+'" ' : '')+'>'+text+'</a>';
}
