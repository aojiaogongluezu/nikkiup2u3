//超过此数量折叠，0为永不折叠
var maxHide=0;
//活动名，开始时间，结束时间
//公主双倍为固定格式
var eventList=[
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
['云涌暗流·了解活动','05/10/2018 5:00','05/11/2018 5:00'],
['云涌暗流·报名、捐资','05/11/2018 5:00','05/13/2018 5:00'],
['云涌暗流·预搭配、演习','05/11/2018 5:00','05/13/2018 9:00'],
['云涌暗流·自动搭配（19点前支援）','05/13/2018 9:00','05/13/2018 21:00'],
['云涌暗流·兑换','05/13/2018 21:00','05/20/2018 23:59'],
['大喵制衣·星光礼赞+特惠礼包','05/11/2018 05:00','05/17/2018 23:59'],
['公主1/3/5/6/7/9/11/15/卷二第1章双倍+复开·碧霄吟','05/11/2018 05:00','05/13/2018 23:59'],
['复开·倾心回忆+誓言礼包','05/14/2018 05:00','05/20/2018 23:59'],
['周年庆礼包','05/17/2018 05:00','06/03/2018 23:59'],
['岁月情钟+累充送+定格光阴','05/18/2018 05:00','06/12/2018 23:59'],
['旅信寄情+岁月集影+公主级无限次购买+好友召回奖励','05/18/2018 05:00','06/03/2018 23:59'],
['大喵的乐园+钻石商店·心意券宝箱','05/20/2018 05:00','05/31/2018 23:59'],
['登录送·365体力','05/18/2018 05:00','05/25/2018 23:59'],
['登录送·365钻石','05/19/2018 00:00','05/25/2018 23:59'],
['登录送·纸牌游戏','05/20/2018 00:00','05/25/2018 23:59'],
['转发微博','05/15/2018 12:00','05/17/2018 20:00'],
['大喵制衣·提线格莱斯+特惠礼包+幸运随机礼包','05/18/2018 05:00','05/31/2018 23:59'],
['公主1/2/3/4/5/6/7/8/9/10/11/12/13/14/15/16/17/18/19章三倍','05/18/2018 05:00','05/20/2018 23:59'],
['公主1/2/3/4/5/6/7/8/9/10/11/12/13/14/15/16/17/18/19章三倍','05/25/2018 05:00','05/27/2018 23:59'],
['星光币双倍','05/21/2018 05:00','05/24/2018 23:59'],
['星光币双倍','05/28/2018 05:00','05/31/2018 23:59'],
['复开·时光流转之庭','06/03/2018 05:00','06/12/2018 23:59'],
['大汪趣味宝箱','05/21/2018 05:00','05/25/2018 23:59'],
['知识问答','05/24/2018 05:00','05/30/2018 23:59'],
['复开·长夜伊始','05/25/2018 05:00','05/27/2018 23:59'],
];
