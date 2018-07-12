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
['大喵制衣·森林传说染色款','06/01/2018 05:00','06/07/2018 23:59'],
['公主第一卷全章双倍','06/01/2018 05:00','06/03/2018 23:59'],
['童话之旅','06/01/2018 05:00','06/10/2018 23:59'],
['小屋复开·帆与海之诗+高考福利','06/06/2018 05:00','06/12/2018 23:59'],
['萤光复开·回忆花火','06/08/2018 05:00','06/10/2018 23:59'],
['星法法专栏','06/08/2018 05:00','06/14/2018 23:59'],
['大喵制衣·云梦游鲤染色款+特惠礼包','06/08/2018 05:00','06/17/2018 23:59'],
['复开·倾心回忆+誓言礼包','06/11/2018 05:00','06/17/2018 23:59'],
['公主2/4/6/8/10/12/14/18/卷二第2章双倍+萤光复开·舞夜前奏曲','06/15/2018 05:00','06/17/2018 23:59'],
['端阳浴兰','06/14/2018 05:00','06/20/2018 23:59'],
['大喵制衣·竹墨书','06/18/2018 05:00','06/24/2018 23:59'],
['知识问答','06/20/2018 05:00','06/26/2018 23:59'],  
['大汪趣味宝箱','06/21/2018 05:00','06/25/2018 23:59'],
['回溯繁星+星辰石礼包+复开·岚烟雪中阁','06/22/2018 05:00','06/28/2018 23:59'],
['公主1/5/9/11/12/15/17/19/卷二第2章双倍','06/22/2018 05:00','06/24/2018 23:59'],
['清凉一元购','06/22/2018 05:00','07/03/2018 23:59'],
['大喵制衣·人偶之心','06/25/2018 05:00','07/01/2018 23:59'],
['童话梦乡+充值送·星光小夜曲+签到送·流光代码','06/27/2018 05:00','07/03/2018 23:59'],
['公主2/3/4/6/7/9/10/13/16双倍+萤光复开·呦呦鹿鸣','06/29/2018 05:00','07/01/2018 23:59'],
['大喵制衣·魔力星','07/02/2018 05:00','07/12/2018 23:59'],
['弦外之音','07/04/2018 05:00','07/18/2018 23:59'],
['公主1/2/5/6/8/12/14/18/19+星光币双倍','07/06/2018 05:00','07/08/2018 23:59'],
['小屋复开·璀璨圣诞夜','07/06/2018 05:00','07/12/2018 23:59'],
['晨星启示+充值送·晴天娃娃+复开·招财福喵','07/09/2018 05:00','07/15/2018 23:59'],
['复开·倾心回忆+誓言礼包','07/12/2018 05:00','07/18/2018 23:59']
['公主2/4/9/11/13/14/16/17/卷二第1章双倍+萤光复开·千机变','07/13/2018 05:00','07/15/2018 23:59'],
['大喵制衣·油画家染色款+特惠礼包','07/13/2018 05:00','07/22/2018 23:59'],
['累消心意劵福利','07/17/2018 05:00','07/23/2018 23:59'],
];
