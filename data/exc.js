var wspos=6000;
var wardrobe_a=wardrobe;
var wardrobe=function() {
	var ret = [];
	for (var i in wardrobe_a) {
		var tmp=wardrobe[i];
		if(i>=wspos) {continue;}
		ret.push(tmp);
	}
	return ret;
}();
