var wname=[wardrobe,wardrobe_i,wardrobe_s];
var wowner=['rean','ivangift','seal100x'];

var rows=0;
var field_desc=['名字','分类','编号','心级',
	'华丽','简约','优雅','活泼','成熟','可爱','性感','清纯','清凉','保暖',
	'tag','来源','套装'];

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
	var menu='<table width=60% style="table-layout: fixed">';
	var line=td(ahref('<b>Compare</b>','go_comp()'));
		line+=td(ahref('<b>Pattern</b>','go_comp_pattern()'));
		line+=td(ahref('<b>Add</b>','go_add()'));
		line+=td(ahref('<b>CheckSource</b>','go_src()'));
		line+=td('<a href="maint_top/hs-ip.html" target="_blank"><b>LevelWeight</b></a>');
	menu+=tr(line);
	$("#menu").html(menu);
	$("#info").html('');
	$("#extra").html('');
}

function go_comp(){
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
	var skip_pos=jQuery.inArray('来源', field_desc);
	for(var i=0;i<max;i++){//assign values into str[] from wardrobe
		for (var j in wname){
			if(wname[j][i]){
				str[j][i]=wname[j][i][0]+'/'+wname[j][i][1].substr(0,1);
				for (var p=2;p<field_desc.length;p++){
					if(p==skip_pos){continue;}
					str[j][i]+='/'+wname[j][i][p];
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
			if(j==i){continue;}
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
			if (ss[s].indexOf('公')>-1) {ss[s]='公';}
			if (ss[s].indexOf('少')>-1) {ss[s]='少';}
			if (ss[s].indexOf('定')>-1) {ss[s]='定';}
			if (ss[s].indexOf('进')>-1) {ss[s]='进';}
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
	return '<button onclick="'+onclick+'">'+text+'</button>'
}

function ahref(text,onclick,cls){
	return '<a href="" onclick="'+onclick+';return false;" '+(cls? 'class="'+cls+'" ' : '')+'>'+text+'</a>';
}
