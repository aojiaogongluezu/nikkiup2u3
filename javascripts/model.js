var FEATURES = ["simple", "cute", "active", "pure", "cool"];
var CHINESE_TO_FEATURES = {
	"简约":["simple","+"],
	"华丽":["simple","-"],
	"可爱":["cute","+"],
	"成熟":["cute","-"],
	"活泼":["active","+"],
	"优雅":["active","-"],
	"清纯":["pure","+"],
	"性感":["pure","-"],
	"清凉":["cool","+"],
	"保暖":["cool","-"]
};
var ACCRATIO = [1, 1, 1, 1, 0.95, 0.9, 0.825, 0.75, 0.7, 0.65, 0.6, 0.55, 0.51, 0.47, 0.45, 0.425, 0.4];

var global = {
  float: null,
  additionalBonus: null
};

// parses a csv row into object
// Clothes: name, type, id, stars, gorgeous, simple, elegant, active, mature, cute, sexy, pure, cool, warm, extra, source, set, version, srcShort, pose
//          0     1     2   3      4         5       6        7       8       9     10    11    12    13    14     15      16   17       18        19
Clothes = function(csv) {
  var theType = typeInfo[csv[1]];
  if(!theType)
	  console.log(csv);
  return {
    own: false,
    name: csv[0],
    type: theType,
    id: csv[2],
	longid: clotonum(csv[1],csv[2]),
    stars: csv[3],
    simple: realRating(csv[5], csv[4], theType),
    cute: realRating(csv[9], csv[8], theType),
    active: realRating(csv[7], csv[6], theType),
    pure: realRating(csv[11], csv[10], theType),
    cool: realRating(csv[12], csv[13], theType),
    tags: csv[14].split('/'),
    source: csv[15].replace(/设·图/g,"设计图").replace(/设·/g,""),
    set: /^.*·[染套基]$/.test(csv[16]) ? '' : csv[16],
    setRef: csv[16],
    version: csv[17],
    srcShort: csv[18] ? csv[18] : csv[15],
    pose: csv[19] ? true : false,
    deps: [],
    exDep: '',
    toCsv: function() {
      name = this.name;
      type = this.type;
      id = this.id;
      stars = this.stars;
      simple = this.simple;
      cute = this.cute;
      active = this.active;
      pure = this.pure;
      cool = this.cool;
      extra = this.tags.join(',');
      source = this.source;
      set = this.set;
      version = this.version;
      return [type.type, id, stars, simple[0], simple[1], cute[0], cute[1],
          active[0], active[1], pure[0], pure[1], cool[0],
          cool[1], extra, source, set, version];
    },
    addDep: function(sourceType, depNum, c) {
		var depinfo = {};
		depinfo.sourceType = sourceType;
		depinfo.depNum = depNum;
      if (c == this) {
        alert("Self reference: " + this.type.type + " " + this.id + " " + this.name);
      }
		depinfo.c = c;
      this.deps.push(depinfo);
    },
    getDeps: function(indent, parentDepNum) {
      var ret = '';
        for (var i in this.deps) {
          var depinfo = this.deps[i];
          var c = depinfo.c;
          var depNumAll = 1;
          if(depinfo.sourceType != "染") depNumAll = parentDepNum * depinfo.depNum - parentDepNum;
          else depNumAll = parentDepNum;
          ret += indent + '[' + depinfo.sourceType + '][' + c.type.mainType + ']'
              + c.name + ((c.own || depNumAll == 0)? '' : '[消耗' + (depNumAll)  + ']')+ '\n';
          ret += c.getDeps(indent + "   ", depNumAll);
        }
		var depNumAlls = 1;
		var splits = ret.split('\n');
		for (var i = 0; i<splits.length; i++){
			var depNums = splits[i].indexOf('消耗') < 0 ? 0 : splits[i].replace(/[^(消耗)]*(消耗)([0-9]+)[^0-9]*/,"$2");
			if (depNums) depNumAlls += Number(depNums);
		}
		if (this.exDep) {
			ret = indent + "[织梦]" + this.exDep + "\n" + ret;
		}
		if(indent == '   ' && ret != ''){
			ret = "[材料]" + this.name + (' - 总计需 '+ depNumAlls + ' 件') + "\n" + ret;
			var ret2 = ret.split('\n'); //mod 180322: avoid reoccurring refer to same clothes
			for (var i=0;i<ret2.length;i++){
				for (var j=0;j<ret2.length;j++){
					if (j>=i) break;
					if (ret2[i].trim()==ret2[j].trim()) {
						ret2.splice(i, 1);
						i--;
						break;
					}
				}
			}
			ret = ret2.join('\n');
		}
      return ret;
    },
    calc: function(filters) {
      var isf = 1 ;
      if(Flist && Flist[filters.levelName]){
        if (Flist[filters.levelName][this.longid]){
          if (Flist[filters.levelName][this.longid] == "F"){
            isf = 0.1; //in blacklist
          }
        }else if($.inArray(this.type.type, Flist[filters.levelName]["type"])>-1){
            //not in whitelist, check whether in tag list
            if(!Flist[filters.levelName]["tag"]) isf = 0.1; 
            else if(!this.tags) isf = 0.1; 
            else{
              var isf_tag=0;
              for(var t in this.tags){
                if($.inArray(this.tags[t], Flist[filters.levelName]["tag"])>-1){
                  isf_tag=1; break;
                }
              }
              if(!isf_tag) isf = 0.1; 
          } 
        }
      }
      var s = 0;
      var self = this;
      this.tmpScoreByCategory = ScoreByCategory();
      this.bonusByCategory = ScoreByCategory();
      for (var i in FEATURES) {
        var f = FEATURES[i]; 
        if (filters[f]) {
          var sub = filters[f] * self[f][2] * isf;
          if (filters[f] > 0) {
            if (sub > 0) {
              this.tmpScoreByCategory.record(f, sub, 0); // matched with major
            } else {
              this.tmpScoreByCategory.record(f, 0, sub); // mismatch with minor
            }
          } else {
            if (sub > 0) {
              this.tmpScoreByCategory.record(f, 0, sub); // matched with minor
            } else {
              this.tmpScoreByCategory.record(f, sub, 0); // mismatch with major
            }
            
          }
          if (sub > 0) {
            s += sub;
          }
        }
      }

      var spRange = 0 ;
      if(Flist && Flist[filters.levelName] && Flist[filters.levelName]["range"]){
        for (var i in Flist[filters.levelName]["range"])
          if(this.longid == Flist[filters.levelName]["range"][i]) {
            spRange = 1;
            break;
          }
      }

      this.isF = (isf==1? 0:1);
      this.spRange = spRange;
      this.tmpScore = Math.round(s);
      this.bonusScore = 0;
	  this.sumScore = 0;
      var total = 0;
      if (filters.bonus) {
        for (var i in filters.bonus) {
          var bonus = filters.bonus[i];
          var resultlist = bonus.filter(this);
          var result = resultlist[0];
          if (result > 0) {
            // result > 0 means match
            this.bonusByCategory.addRaw(filters, resultlist[1]);
            total += result;
            if (bonus.replace) {
              this.tmpScore /= 10;
              this.tmpScoreByCategory.f();
            }
          }
        }
        this.bonusScore = Math.round(1 * total.toFixed(0) * isf);
      }

      //萤光之灵
      if(this.type && "萤光之灵" == this.type.type && this.tags != null){
        var lights = this.tags[0].split("+");
        if(2 == lights.length && CHINESE_TO_FEATURES[lights[0]]){
          var lightBonus = CHINESE_TO_FEATURES[lights[0]];
          //skills handling
          if(filters.highscore1==lightBonus[0]) lights[1]=Math.round(lights[1] * 1.27);
          if(filters.highscore2==lightBonus[0]) lights[1]=Math.round(lights[1] * 1.778);
          if("-" == lightBonus[1]){
            this.bonusByCategory.scores[lightBonus[0]][1] += lights[1] * 1;
            if(0 > filters[lightBonus[0]]) this.bonusScore += lights[1] * 1;
          }
          if("+" == lightBonus[1]){
            this.bonusByCategory.scores[lightBonus[0]][0] += lights[1] * 1;
            if(0 < filters[lightBonus[0]]) this.bonusScore += lights[1] * 1;
          }
        }
      }

      this.tmpScore = Math.round(this.tmpScore);
      this.sumScore = this.tmpScore + this.bonusScore;
      if(manualScoring && manualScoring[filters.levelName] && manualScoring[filters.levelName][this.type.mainType+this.id]){
        if(!filters.highscore1&&!filters.highscore2&&!filters.balance) this.sumScore = manualScoring[filters.levelName][this.type.mainType+this.id];
      }
    }
  };
}

var lastVersion = function() {
	var last = ''; var largest = ['0'];
	for (var i in wardrobe) {
		var tmpArr = wardrobe[i][17].replace(/V/g,'').split('.');
		if (greaterVer(tmpArr,largest)) {
			last = wardrobe[i][17];
			largest = tmpArr;
		}
	}
	return last;
}();

function greaterVer(a,b){
	for (var j=0; j<Math.min(a.length,b.length); j++){
		if (a[j]&&b[j]) {
			if (Number(a[j]) > Number(b[j])) return true;
			else if (Number(a[j]) < Number(b[j])) return false;
			else continue;
		}else if (a[j]) return true;
		else return false;
	}
	return false;
}

function clotonum(type,id){
	var mainType='';
	switch(type.split('-')[0]){
		case '发型': mainType='1'; break;
		case '连衣裙': mainType='2'; break;
		case '外套': mainType='3'; break;
		case '上装': mainType='4'; break;
		case '下装': mainType='5'; break;
		case '袜子': mainType='6'; break;
		case '鞋子': mainType='7'; break;
		case '饰品': mainType='8'; break;
		case '妆容': mainType='9'; break;
		case '萤光之灵': mainType='A'; break;
	}
	if (parseInt(id) >= 1000) return mainType + id;
	else return mainType + '0' + id;
}

function ScoreByCategory() {
  var initial = {};
  for (var c in FEATURES) {
    initial[FEATURES[c]] = [0, 0];
  }
  return {
    scores: initial,
    // score: positive - matched, negative - no matched
    record: function(category, major, minor) {
      this.scores[category] = [major, minor];
    },
    add: function(other) {
      for (var c in other.scores) {
        this.scores[c][0] += other.scores[c][0];
        this.scores[c][1] += other.scores[c][1];
      }
    },
    round: function() {
      for (var c in this.scores) {
        this.scores[c][0] = Math.round(this.scores[c][0]);
        this.scores[c][1] = Math.round(this.scores[c][1]);
      }
    },
    addRaw: function(filters, rawdata) {
      for (var i in FEATURES) {
        var f = FEATURES[i]; 
        if (filters[f] && rawdata[f] > 0) {
          if (filters[f] > 0) { // level requires major
            this.scores[f][0] += rawdata[f];
          } else { // level requires minor
            this.scores[f][1] += rawdata[f];
          }
        }
      }
    },
    f: function() {
      for (var c in this.scores) {
        this.scores[c][0] /= 10;
        this.scores[c][1] /= 10;
      }
    }
  };
}

function MyClothes() {
  return {
    mine: {},
    size: 0,
    filter: function(clothes) {
      this.mine = {};
      this.size = 0;
      for (var i in clothes) {
        if (clothes[i].own) {
          var type = clothes[i].type.mainType;
          if (!this.mine[type]) {
            this.mine[type] = [];
          }
          this.mine[type].push(clothes[i].id);
          this.size ++;
        }
      }
    },
    serialize: function() {
      var txt = "";
      for (var type in this.mine) {
		var content = this.mine[type];
		for (var j in content) content[j] = Number(content[j]);
		content.sort(function(a, b){return a - b;});
		var ret = []; var start = 0; var end = 0;
		for (j = 0; j < content.length; j++){
			if (content[j+1] && content[j+1] - content[j] == 1){
				if (start ==0){
					start = content[j];
					end = content[j+1];
				}else 
					end = content[j+1];
			}else {
				if (end == content[j]) {
					ret.push(start + '-' + end);
					start = 0;
					end = 0;
				}else 
					ret.push(content[j]);
			}
		}
        txt += type + ":" + ret.join(',') + "|";
      }
      return txt;
    },
    deserialize: function(raw) {
      var sections = raw.split('|');
      this.mine = {};
      this.size = 0;
      for (var i in sections) {
        if (sections[i].length < 1) continue;
        var section = sections[i].split(':');
        var type = section[0];
		var content = section[1].split(',');
		this.mine[type] = [];
		for (var j in content) {
			if (!isNaN(Number(content[j]))) this.mine[type].push(numberToInventoryId(Number(content[j])));
			else if (content[j].indexOf('-') > 0){
				var serials = content[j].split('-');
				for (var k = Number(serials[0]); k <= Number(serials[1]); k++) this.mine[type].push(numberToInventoryId(k));
			}
		}
        this.size += this.mine[type].length;
      }
    },
    update: function(clothes) {
      var x = {};
      for (var type in this.mine) {
        x[type] = {};
        for (var i in this.mine[type]) {
          var id = this.mine[type][i];
          x[type][id] = true;
        }
      }
      for (var i in clothes) {
        clothes[i].own = false;
        var t = clothes[i].type.mainType;
        var id = clothes[i].id;
        if (x[t] && x[t][clothes[i].id]) {
          clothes[i].own = true;
        }
      }
    }
  };
}

var clothes = function() {
  var ret = [];
  for (var i in wardrobe) {
//console.log(wardrobe[i]);
    ret.push(Clothes(wardrobe[i]));
  }
  return ret;
}();

var clothesSet = function() {
  var ret = {};
  for (var i in clothes) {
    var t = clothes[i].type.mainType;
    if (!ret[t]) {
      ret[t] = {};
    }
    ret[t][clothes[i].id] = clothes[i];
  }
  return ret;
}();

var shoppingCart = {
  cart: {},
  sub: {},
  totalScore: fakeClothes(this.cart),
  clear: function() {
    this.cart = {};
  },
  clearSub: function() {
    this.sub = {};
  },
  contains: function(c) {
    //return this.cart[c.type.type] == c;
    var cnt=0;
    for (var cc in category) {
      if(this.cart[category[cc]]) cnt++;
      if(this.cart[category[cc]] == c) break;
    }
    return cnt;
  },
  remove: function(c) {
    delete this.cart[c];
  },
  putAll: function(clothes) {
    for (var i in clothes) {
      this.put(clothes[i]);
    }
  },
  put: function(c) {
    this.cart[c.type.type] = c;
  },
  putSub: function(c) {
    this.sub[c.type.type] = c;
  },
  putSubAll: function(clothes) {
    for (var i in clothes) {
      this.put(clothes[i]);
    }
  },
  toList: function(sortBy) {
    var ret = [];
    for (var t in this.cart) {
      ret.push(this.cart[t]);
    }
    return ret.sort(sortBy);
  },
  calc: function(criteria) {
    for (var c in this.cart) {
      this.cart[c].calc(criteria);
    }
    // fake a clothes
    this.totalScore = fakeClothes(this.cart);
  },
  validate: function(criteria,accNum){ //accNum is the number of accessories kept finally
	for (var i in repelCates){ //remove repelCates
		var sumFirst = 0;
		var sumOthers = 0;
		for (var j in repelCates[i]){
			currCate=repelCates[i][j];
			if (this.cart[currCate]) {
				this.cart[currCate].calc(criteria);
				var currSumScore = currCate.split('-')[0] == '饰品' ? accSumScore(this.cart[currCate], accNum?accNum:accCateNum) : this.cart[currCate].sumScore;
				if (j>0) sumOthers+=currSumScore;
				else sumFirst+=currSumScore;
			}
		}
		if (sumOthers > sumFirst) {
			shoppingCart.remove(repelCates[i][0]);
		}else{
			for (var j in repelCates[i]){
				if (j>0) shoppingCart.remove(repelCates[i][j]);
			}
		}
	}
	if (accNum) {//keep accessories base on accNum
		var sortCates=[];
		for (var i in category){
			var currCate=category[i];
			if (currCate.split('-')[0] == '饰品' && this.cart[currCate]) {
				sortCates.push([currCate, accSumScore(this.cart[currCate], accNum)]);
			}
		}
		if (sortCates.length > accNum) {
			sortCates.sort(function(a,b){return b[1] - a[1]});
			sortCates = sortCates.slice(accNum);
			for (var i in sortCates) shoppingCart.remove(sortCates[i][0]);
		}
	}
  }
};

function accScore(total, items) {
  if (items < ACCRATIO.length) {
    return total * ACCRATIO[items];
  }
  return total * 0.4;
}

function accSumScore(a,items){
	return accScore(a.tmpScore, items)+a.bonusScore;
}

var accCateNum = function() {
	var cnt = 0;
	for (var i in category) {
		if (category[i].split('-')[0] == "饰品") cnt++;
	}
	for (var i in skipCategory) {
		if (skipCategory[i].split('-')[0] == "饰品") cnt--;
	}
	return cnt;
}();

function fakeClothes(cart) {
  var totalScore = 0;
  var totalAccessories = 0;
  var totalScoreByCategory = ScoreByCategory();
  var totalBonusByCategory = ScoreByCategory();
  var totalAccessoriesByCategory = ScoreByCategory();
  var totalAccessoriesBonusByCategory = ScoreByCategory();
  var numAccessories = 0;
  for (var c in cart) {
    if (c.split('-')[0] == "饰品") {
      totalAccessories += cart[c].tmpScore;
      totalScore += cart[c].bonusScore;
      totalAccessoriesByCategory.add(cart[c].tmpScoreByCategory);
      totalAccessoriesBonusByCategory.add(cart[c].bonusByCategory);
      numAccessories ++;
    } else {
      totalScore += cart[c].sumScore;
      totalScoreByCategory.add(cart[c].tmpScoreByCategory);
      totalBonusByCategory.add(cart[c].bonusByCategory);
    }
  }
  totalScore += accScore(totalAccessories, numAccessories);
  for (var c in totalAccessoriesByCategory.scores) {
    totalAccessoriesByCategory.scores[c][0] = accScore(totalAccessoriesByCategory.scores[c][0],
        numAccessories);
    totalAccessoriesByCategory.scores[c][1] = accScore(totalAccessoriesByCategory.scores[c][1],
        numAccessories);
  }
  totalScoreByCategory.add(totalAccessoriesByCategory);
  totalBonusByCategory.add(totalAccessoriesBonusByCategory);
  totalScoreByCategory.round();
  totalBonusByCategory.round();
  
  var scores = totalScoreByCategory.scores;
  var bonus = totalBonusByCategory.scores;
  return {
    name: '总分',
    sumScore: Math.round(totalScore),
    toCsv: function() {
      return ['', '', '',
          scoreWithBonusTd(scores.simple[0], bonus.simple[0]), 
          scoreWithBonusTd(scores.simple[1], bonus.simple[1]),
          scoreWithBonusTd(scores.cute[0], bonus.cute[0]),
          scoreWithBonusTd(scores.cute[1], bonus.cute[1]),
          scoreWithBonusTd(scores.active[0], bonus.active[0]),
          scoreWithBonusTd(scores.active[1], bonus.active[1]),
          scoreWithBonusTd(scores.pure[0], bonus.pure[0]),
          scoreWithBonusTd(scores.pure[1], bonus.pure[1]),
          scoreWithBonusTd(scores.cool[0], bonus.cool[0]),
          scoreWithBonusTd(scores.cool[1], bonus.cool[1]), '', '', ''];
    }
  };
}

function scoreWithBonusTd(score, bonus) {
  return  score +  bonus + "";
}

function realRating(a, b, type) {
  real = a ? a : b;
  symbol = a ? 1 : -1;
  score = symbol * type.score[real];
  dev = type.deviation[real];
  return [a, b, score, dev];
}

function parseSource(source, key) {
  var idx = source.indexOf(key);
  var ridx = source.indexOf('/', idx+1);
  if (ridx < 0) ridx = 99;
  if (idx >= 0) {
    var id = source.substring(idx + 1, Math.min(idx + 4, ridx));
    while (id.length < 3) id = '0' + id;
    return id;
  }
  return null;
}

function calcDependencies() {
  for (var i in pattern) {
    var target = clothesSet[pattern[i][0]][pattern[i][1]];
    var source = clothesSet[pattern[i][2]][pattern[i][3]];
    if (!target) continue;
    source.addDep(pattern[i][5], pattern[i][4], target);
  }
  if (pattern_extra){
	for (var i in pattern_extra){
		var source = clothesSet[pattern_extra[i][0]][pattern_extra[i][1]];
		var target = pattern_extra[i][2];
		if (!source) continue;
		source.exDep += (source.exDep.length>0 ? ',' : '') + target;
	}
  }
}

function load(myClothes) {
  var cs = myClothes.split(",");
  for (var i in clothes) {
    clothes[i].own = false;
    if (cs.indexOf(clothes[i].name) >= 0) {
      clothes[i].own = true;
    }
  }
  var mine = MyClothes();
  mine.filter(clothes);
  return mine;
}

function loadNew(myClothes) {
  var mine = MyClothes();
  mine.deserialize(myClothes);
  mine.update(clothes);
  return mine;
}

function loadFromStorage() {
  var myClothes;
  var myClothesNew;
  if (localStorage) {
    myClothesNew = localStorage.myClothesNew;
    myClothes = localStorage.myClothes;
  } else {
    myClothesNew = getCookie("mine2");
    myClothes = getCookie("mine");
  }
  if (myClothesNew) {
    return loadNew(myClothesNew);
  } else if (myClothes) {
    return load(myClothes);
  }
  return MyClothes();
}

function getCookie(c_name) {
  if (document.cookie.length>0) { 
    c_start=document.cookie.indexOf(c_name + "=")
    if (c_start!=-1) { 
      c_start=c_start + c_name.length+1 
      c_end=document.cookie.indexOf(";",c_start)
      if (c_end==-1) {
        c_end=document.cookie.length
      }
      return unescape(document.cookie.substring(c_start,c_end))
    }
  }
  return "";
}

function setCookie(c_name,value,expiredays) {
  var exdate=new Date()
  exdate.setDate(exdate.getDate()+expiredays)
  document.cookie=c_name+ "=" +escape(value)+
  ((expiredays==null) ? "" : "; expires="+exdate.toGMTString())
}

function save(){
  var myClothes = MyClothes();
  myClothes.filter(clothes);
  var txt = myClothes.serialize();
  if (localStorage) {
    localStorage.myClothesNew = txt;
  } else {
    setCookie("mine2", txt, 3650);
  }
  return myClothes;
}
