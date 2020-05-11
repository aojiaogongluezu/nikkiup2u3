//超过此数量折叠，0为永不折叠
var maxHide=0;
//活动名，开始时间，结束时间
//公主双倍为固定格式
var eventList=[
['公主2/4/5/8/9/11/13/16/19双倍','01/03/2020 05:00','01/05/2020 23:59'],
['大喵制衣·风吟旅行者+特惠礼包','01/03/2020 05:00','01/09/2020 23:59'],
['充值送','01/04/2020 05:00','01/16/2020 23:59'],
['累消钻石送套装','01/06/2020 05:00','01/12/2020 23:59'],
['复刻·倾心回忆','01/08/2020 05:00','01/14/2020 23:59'],
['小屋·迷彩俱乐部','01/13/2020 05:00','01/19/2020 23:59'],
['战时记闻+大喵制衣·时光吟游+累消体力有礼+苍穹秘轨','01/17/2020 05:00','02/02/2020 23:59'],
['拾梦豪华礼包+联邦商贸·新春限时福包+今宵露华·祈愿福袋+风入尘寰','01/17/2020 05:00','02/09/2020 23:59'],
['灵感阶梯','01/20/2020 05:00','01/26/2020 23:59'],
['登录送春节限定套装','01/25/2020 05:00','01/31/2020 23:59'],
['蔷薇古堡','01/27/2020 05:00','02/02/2020 23:59'],
['复刻·云空之境','01/31/2020 05:00','02/09/2020 23:59'],
['大喵制衣·倾心之羽+战时纪闻·工作总结','02/03/2020 05:00','02/09/2020 23:59'],
['灯火元宵','02/03/2020 05:00','02/12/2020 23:59'],
['签到送·钟情纪念','02/04/2020 05:00','02/14/2020 23:59'],
['萤光·云梦山河赋','02/05/2020 05:00','02/09/2020 23:59'],
['公主1/2/4/9/11/13/15/17/19双倍','02/07/2020 05:00','02/09/2020 23:59'],
['花漾云间+礼包+限定商店+复刻·招财福喵礼包+大喵制衣·松林魔咒+复刻·倾心回忆','02/10/2020 05:00','02/16/2020 23:59'],
['公主3/5/6/8/10/12/14/16/18+星光币双倍','02/14/2020 05:00','02/16/2020 23:59'],
['复刻·梦想橱窗+时光回溯+大喵制衣·向阳少女+特惠礼包','02/17/2020 05:00','02/23/2020 23:59'],
['签到送·海与花之梦','02/17/2020 05:00','02/26/2020 23:59'],
['公主2/4/6/7/9/11/13/15/17双倍','02/21/2020 05:00','02/23/2020 23:59'],
['怪奇绘本+档位充值福利','02/21/2020 05:00','02/27/2020 23:59'],
['大喵制衣·校园王后','02/24/2020 05:00','03/01/2020 23:59'],
['公主1/3/5/8/10/12/14/16/18双倍','02/28/2020 05:00','03/01/2020 23:59'],
['大喵制衣·布丁的法则','03/02/2020 05:00','03/08/2020 23:59'],
['累充福利','03/02/2020 05:00','03/15/2020 23:59'],
['公主2/4/6/7/9/13/15/17/19+星光币双倍+萤光复刻·命运双生','03/06/2020 05:00','03/08/2020 23:59'],
['生命之息','03/09/2020 05:00','03/15/2020 23:59'],
['四季遐音','03/13/2020 05:00','03/19/2020 23:59'],
['大喵制衣·微光与梦想','03/16/2020 05:00','03/22/2020 23:59'],
['青葱一元购','03/16/2020 05:00','03/26/2020 23:59'],
['公主2/4/5/6/11/12/13/17/18+星光币双倍','03/20/2020 05:00','03/22/2020 23:59'],
['新章助力礼包','03/20/2020 05:00','03/26/2020 23:59'],
['暗月谎言','03/27/2020 05:00','04/02/2020 23:59'],
['累充福利+任意档位充值送','03/27/2020 05:00','04/12/2020 23:59'],
['云雾仙茗','04/03/2020 05:00','04/12/2020 23:59'],
['仙林秘境','04/10/2020 05:00','04/16/2020 23:59'],
['妖世界+随机体力礼包','04/17/2020 05:00','04/23/2020 23:59'],
['复刻·岁月集影','04/17/2020 05:00','04/26/2020 23:59'],
['限时签到送套装','04/24/2020 05:00','05/03/2020 23:59'],
['五谷丰登+累计充值福利','04/26/2020 05:00','05/05/2020 23:59'],
['绽樱庭中院','05/04/2020 05:00','05/10/2020 23:59'],
['公主1/3/4/5/8/10/12/15/19双倍+萤光复刻·舞夜前奏曲','05/08/2020 05:00','05/10/2020 23:59'],
['大喵制衣·条纹绅士+时光回溯·圣瑾元熙','05/08/2020 05:00','05/12/2020 23:59'],
['知识问答','05/11/2020 05:00','05/17/2020 23:59'],
['公主级三倍+星光币双倍','05/13/2020 05:00','05/17/2020 23:59'],
['大喵制衣·格莱斯+公主级不限购买次数+游园寻礼+诞梦纪念馆·拾梦彩绘屋+幕间漫谈+浮光镜界','05/13/2020 05:00','05/24/2020 23:59'],
['袅雾云缕+随机体力礼包','05/18/2020 05:00','05/27/2020 23:59'],
['公主级三倍+星光币双倍','05/20/2020 05:00','05/24/2020 23:59'],
['五周年福利套装','05/20/2020 05:00','05/26/2020 23:59'],
];

