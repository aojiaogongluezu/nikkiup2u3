//超过此数量折叠，0为永不折叠
var maxHide=0;
//活动名，开始时间，结束时间
//公主双倍为固定格式
var eventList=[
['梦蝶夜曲','02/23/2018 05:00','03/01/2018 23:59'],
['大喵制衣·水墨青花+3元礼包+星法法专栏','02/27/2018 05:00','03/05/2018 23:59'],
['6元礼包·大喵汤圆铺+四兽','03/01/2018 05:00','03/05/2018 23:59'],
['游灯浮梦','03/01/2018 05:00','03/10/2018 23:59'],
['星光币双倍','03/02/2018 05:00','03/04/2018 23:59'],
['公主3/4/6/10/12/15/16/18/19双倍+复开·回忆花火','03/09/2018 05:00','03/11/2018 23:59'],
['梦恋奇迹五·咏爱夜曲+大喵制衣·花嫁童话','03/09/2018 05:00','03/15/2018 23:59'],
['誓言之戒礼包','03/09/2018 05:00','03/18/2018 23:59'],
['充值送·大喵的冒险+外服上架','03/09/2018 05:00','03/20/2018 23:59'],
['连冲送·十二星座宝箱','03/09/2018 05:00','04/03/2018 23:59'],
['倾心回忆·三月','03/12/2018 05:00','03/18/2018 23:59'],
['小屋·花与爱恋时光','03/14/2018 05:00','03/20/2018 23:59'],
['大喵制衣·叶葵的窗台','03/16/2018 05:00','03/25/2018 23:59'],
['大喵制衣·晨露芳华','04/09/2018 05:00','04/15/2018 23:59'],
['大喵制衣·星光礼赞','05/11/2018 05:00','05/17/2018 23:59'],
['混沌对决+充值送·圣槿元熙','03/22/2018 05:00','01/04/2018 23:59'],
['公主1/4/5/8/10/12/14/16/17+星光币双倍','03/23/2018 05:00','03/25/2018 23:59'],
['复开·午夜前奏曲','03/23/2018 05:00','03/25/2018 23:59'],
['潜龙在渊','03/30/2018 05:00','04/05/2018 23:59'],
['登录送天真灰兔','04/01/2018 05:00','04/08/2018 23:59'],
['大喵制衣·小丑与钻石面具','04/02/2018 05:00','04/08/2018 23:59'],
['公主2/3/6/9/10/11/13/15/18双倍','03/30/2018 05:00','04/01/2018 23:59'],
['一元购·春归燕','03/30/2018 05:00','04/05/2018 23:59'],
['充值送·纯白的守护/一梦还秋','04/04/2018 05:00','05/05/2018 23:59'],
['首充·锦瑟年华','04/04/2018 05:00','04/26/2018 23:59'],
['公主2/4/5/7/8/12/14/16/19','04/06/2018 05:00','04/08/2018 23:59'],
['复开·呦呦鹿鸣','04/04/2018 05:00','04/06/2018 23:59'],
['复开·沧海明月影','04/13/2018 05:00','04/15/2018 23:59'],
['演唱会','04/07/2018 05:00','04/14/2018 23:59'],
['黄昏之影','04/11/2018 05:00','04/20/2018 23:59'],
['倾心回忆·四月','04/09/2018 05:00','04/15/2018 23:59'],
['公主1/3/4/6/9/10/13/17/18+星光币双倍','04/13/2018 05:00','04/16/2018 23:59'],
['奇妙博物馆+累消心意劵福利','04/16/2018 05:00','04/22/2018 23:59'],
['大喵制衣·提灯精灵蓝色款','04/16/2018 05:00','04/24/2018 23:59'],
['公主2/3/7/8/9/11/14/15/16双倍','04/20/2018 05:00','04/22/2018 23:59'],
['远古化石馆','04/21/2018 05:00','04/25/2018 23:59'],
['登录送·夏玛拉的思念+累消体力送好礼','04/25/2018 05:00','05/01/2018 23:59'],
['充值送水晶鞋+大喵制衣·沉默的赫米特','04/25/2018 05:00','05/01/2018 23:59'],
['公主1/2/4/5/6/10/12/14/18双倍','04/27/2018 05:00','04/29/2018 23:59'],
['复开·晨露花中梦','04/27/2018 05:00','05/03/2018 23:59'],
['砰然惊喜','04/29/2018 05:00','05/05/2018 23:59'],
['一元购·小柠檬','05/01/2018 05:00','05/13/2018 23:59'],
['大喵制衣·北国春声','05/02/2018 05:00','05/10/2018 23:59'],
['公主4/7/8/10/13/16/17/19/第二卷1章+星光币双倍+复开·命运双生','05/04/2018 05:00','05/06/2018 23:59'],
['星法法专栏','05/04/2018 05:00','05/10/2018 23:59'],
['复开·惊情古堡','05/04/2018 05:00','05/13/2018 23:59'],
['破晓之战·了解活动','05/10/2018 5:00','05/11/2018 5:00'],
['破晓之战·报名、捐资','05/11/2018 5:00','05/13/2018 5:00'],
['破晓之战·预搭配、演习','05/11/2018 5:00','05/13/2018 9:00'],
['破晓之战·自动搭配（19点前支援）','05/13/2018 9:00','05/13/2018 21:00'],
['破晓之战·兑换','05/13/2018 21:00','05/20/2018 23:59'],
['大喵制衣·星光礼赞+特惠礼包','05/11/2018 05:00','05/17/2018 23:59'],
['公主1/3/5/6/7/9/11/15/卷二第1章+复开·碧霄吟','05/11/2018 05:00','05/13/2018 23:59'],
['复开·倾心回忆+誓言礼包','05/14/2018 05:00','05/20/2018 23:59'],
];
