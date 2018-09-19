//超过此数量折叠，0为永不折叠
var maxHide=0;
//活动名，开始时间，结束时间
//公主双倍为固定格式
var eventList=[
['清凉一元购','06/22/2018 05:00','07/03/2018 23:59'],
['大喵制衣·人偶之心','06/25/2018 05:00','07/01/2018 23:59'],
['童话梦乡+充值送·星光小夜曲+签到送·流光代码','06/27/2018 05:00','07/03/2018 23:59'],
['公主2/3/4/6/7/9/10/13/16双倍+萤光复开·呦呦鹿鸣','06/29/2018 05:00','07/01/2018 23:59'],
['大喵制衣·魔力星','07/02/2018 05:00','07/12/2018 23:59'],
['弦外之音','07/04/2018 05:00','07/18/2018 23:59'],
['公主1/2/5/6/8/12/14/18/19+星光币双倍','07/06/2018 05:00','07/08/2018 23:59'],
['小屋复开·璀璨圣诞夜','07/06/2018 05:00','07/12/2018 23:59'],
['晨星启示+充值送·晴天娃娃+复开·招财福喵','07/09/2018 05:00','07/15/2018 23:59'],
['复开·倾心回忆+誓言礼包','07/12/2018 05:00','07/18/2018 23:59'],
['公主2/4/9/11/13/14/16/17/卷二第1章双倍+萤光复开·千机变','07/13/2018 05:00','07/15/2018 23:59'],
['大喵制衣·油画家染色款+特惠礼包','07/13/2018 05:00','07/22/2018 23:59'],
['累消心意劵福利','07/17/2018 05:00','07/23/2018 23:59'],
['超维战场·了解活动','07/19/2018 5:00','07/20/2018 5:00'],
['超维战场·报名、捐资','07/20/2018 5:00','07/22/2018 5:00'],
['超维战场·预搭配、演习','07/20/2018 5:00','07/22/2018 9:00'],
['超维战场·自动搭配（19点前支援）','07/22/2018 9:00','07/22/2018 21:00'],
['超维战场·兑换','07/22/2018 21:00','07/29/2018 23:59'],
['公主3/5/6/7/8/10/12/15/卷二第1章双倍+萤光复开·命运双生','07/20/2018 05:00','07/22/2018 23:59'],
['限时首冲福利','07/23/2018 05:00','07/26/2018 23:59'],
['大喵制衣·滑板少女','07/23/2018 05:00','08/01/2018 23:59'],
['星光币双倍','07/27/2018 05:00','07/29/2018 23:59'],
['星法法专栏','07/27/2018 05:00','08/02/2018 23:59'],
['山海云荒+登录送设计图+累消体力送礼+照片墙+清凉一元购','07/27/2018 05:00','08/05/2018 23:59'],
['累充福利','07/27/2018 05:00','09/06/2018 23:59'],
['大喵制衣·碧潭竹影','08/02/2018 05:00','08/09/2018 23:59'],
['公主1/2/6/7/9/13/15/17/19双倍+萤光复开·碧霄吟','08/03/2018 05:00','08/05/2018 23:59'],
['花火大会+随机体力礼包','08/03/2018 05:00','08/10/2018 23:59'],
['小屋复开·奇妙博物馆','08/08/2018 05:00','08/14/2018 23:59'],
['七夕·邂逅史丢丢','08/08/2018 05:00','08/17/2018 23:59'],
['公主1/4/5/9/11/14/16/18/卷二第2章+星光币双倍+萤光复开·长夜伊始','08/10/2018 05:00','08/12/2018 23:59'],
['大喵制衣·红莓绢蝶+特惠礼包','08/10/2018 05:00','08/16/2018 23:59'],
['狐嫁盛典+复开·倾心回忆+誓言礼包','08/13/2018 05:00','08/19/2018 23:59'],
['公主3/8/10/11/12/13/15/18/19双倍','08/17/2018 05:00','08/19/2018 23:59'],
['大喵制衣·月之咒语染色款+特惠礼包','08/17/2018 05:00','08/26/2018 23:59'],
['少女与狮','08/20/2018 05:00','08/26/2018 23:59'],
['复开·魑魅魍魉','08/23/2018 05:00','08/30/2018 23:59'],
['公主1/2/3/6/7/9/13/15/17+星光币双倍','08/24/2018 05:00','08/26/2018 23:59'],
['萤光复开·回忆花火','08/27/2018 05:00','08/29/2018 23:59'],
['大喵制衣·蛇纹主题部件+特惠礼包','08/27/2018 05:00','09/02/2018 23:59'],
['奇妙侦探社','08/29/2018 05:00','09/27/2018 23:59'],  
['公主1/4/5/8/11/14/16/18/19双倍','08/31/2018 05:00','09/02/2018 23:59'],
['命运回响','08/31/2018 05:00','09/06/2018 23:59'], 
['小屋复开·猫王国的茶会','09/03/2018 05:00','09/09/2018 23:59'],
['大喵制衣·荒原兽语+公主级不限购买次数','09/03/2018 05:00','09/11/2018 23:59'],
['公主级三倍+星光币双倍','09/07/2018 05:00','09/09/2018 23:59'],
['萤光·不灭初心+补给礼包+野餐摆件礼包复刻','09/07/2018 05:00','09/11/2018 23:59'],
['清凉一元购','09/07/2018 05:00','09/16/2018 23:59'],
['复开·倾心回忆+誓言礼包+累消心意券福利','09/10/2018 05:00','09/16/2018 23:59'],
['白银战歌·了解活动','09/13/2018 5:00','09/14/2018 5:00'],
['白银战歌·报名、捐资','09/14/2018 5:00','09/16/2018 5:00'],
['白银战歌·预搭配、演习','09/14/2018 5:00','09/16/2018 9:00'],
['白银战歌·自动搭配（19点前支援）','09/16/2018 9:00','09/16/2018 21:00'],
['白银战歌·兑换','09/16/2018 21:00','09/23/2018 23:59'],
['大喵制衣·思念的颜色+特惠礼包','09/12/2018 05:00','09/20/2018 23:59'],
['充值送·魔力音符','09/13/2018 05:00','09/25/2018 23:59'],
['公主3/5/6/8/9/12/13/14/15双倍+萤光复开·舞夜前奏曲','09/14/2018 05:00','09/16/2018 23:59'],
['回溯繁星+星辰石礼包','09/17/2018 05:00','09/23/2018 23:59'],
['香满月夕','09/19/2018 05:00','09/25/2018 23:59'],
['小屋复开·流音听雨榭','09/21/2018 05:00','09/30/2018 23:59'],
];
