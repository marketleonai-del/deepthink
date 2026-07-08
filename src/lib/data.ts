export interface Mode {
  id: string;
  name: string;
  category: 'model' | 'person' | 'book';
  categoryCn: string;
  tier?: string;
  signals: string;
  color: string;
  icon: string;
}

export const MODES: Mode[] = [
  { id: '5w2h', name: '5W2H', category: 'model', categoryCn: '思维模型', tier: '1', signals: '方案落地、执行纰漏、分工混乱', color: '#D4A853', icon: 'ListChecks' },
  { id: 'eisenhower-matrix', name: '四象限法则', category: 'model', categoryCn: '思维模型', tier: '1', signals: '工作排序、忙完没成果、事项太多', color: '#D4A853', icon: 'Grid2x2' },
  { id: 'feynman-technique', name: '费曼学习法', category: 'model', categoryCn: '思维模型', tier: '1', signals: '看懂不会做、讲不出来、学完就忘', color: '#D4A853', icon: 'GraduationCap' },
  { id: 'first-principles', name: '第一性原理', category: 'model', categoryCn: '思维模型', tier: '1', signals: '内卷破局、成本高、跳出固有玩法', color: '#D4A853', icon: 'Atom' },
  { id: 'foggy-behavior', name: '福格行为模型', category: 'model', categoryCn: '思维模型', tier: '1', signals: '习惯养不成、想行动却拖延', color: '#D4A853', icon: 'PersonStanding' },
  { id: 'grai', name: 'GRAI复盘', category: 'model', categoryCn: '思维模型', tier: '1', signals: '复盘没改进、经验不复用、错误重演', color: '#D4A853', icon: 'RotateCcw' },
  { id: 'grow-model', name: 'GROW教练模型', category: 'model', categoryCn: '思维模型', tier: '1', signals: '迷茫没目标、想改变没方向', color: '#D4A853', icon: 'TrendingUp' },
  { id: 'kiss', name: 'KISS复盘', category: 'model', categoryCn: '思维模型', tier: '1', signals: '快速复盘、不想长篇大论', color: '#D4A853', icon: 'Clock' },
  { id: 'prep', name: 'PREP观点法', category: 'model', categoryCn: '思维模型', tier: '1', signals: '说话啰嗦、汇报没重点', color: '#D4A853', icon: 'Mic' },
  { id: 'pyramid', name: '金字塔原理', category: 'model', categoryCn: '思维模型', tier: '1', signals: '汇报逻辑乱、写总结不分层', color: '#D4A853', icon: 'Triangle' },
  { id: 'root-cause-5whys', name: '5Why根因分析', category: 'model', categoryCn: '思维模型', tier: '1', signals: '问题反复、治标不治本', color: '#D4A853', icon: 'Search' },
  { id: 'scqa', name: 'SCQA', category: 'model', categoryCn: '思维模型', tier: '1', signals: '汇报开头啰嗦、方案没说服力', color: '#D4A853', icon: 'MessageSquare' },
  { id: 'second-order-thinking', name: '二阶思维', category: 'model', categoryCn: '思维模型', tier: '1', signals: '短期利好长期坑、决策后遗症', color: '#D4A853', icon: 'GitBranch' },
  { id: 'smart', name: 'SMART原则', category: 'model', categoryCn: '思维模型', tier: '1', signals: '目标模糊、KPI不会写', color: '#D4A853', icon: 'Target' },
  { id: 'star-method', name: 'STAR陈述法', category: 'model', categoryCn: '思维模型', tier: '1', signals: '面试答不好、案例讲不清', color: '#D4A853', icon: 'Star' },
  { id: 'stp', name: 'STP定位', category: 'model', categoryCn: '思维模型', tier: '1', signals: '产品面向所有人、客群杂乱', color: '#D4A853', icon: 'Crosshair' },
  { id: '3c-analysis', name: '3C分析法', category: 'model', categoryCn: '思维模型', signals: '产品没差异化、需求抓不准', color: '#4CAF8C', icon: 'PieChart' },
  { id: '4c', name: '4C营销', category: 'model', categoryCn: '思维模型', signals: '用户不爱用、转化低', color: '#4CAF8C', icon: 'Users' },
  { id: '4p', name: '4P营销', category: 'model', categoryCn: '思维模型', signals: '卖点模糊、推广无效', color: '#4CAF8C', icon: 'ShoppingBag' },
  { id: 'abc-emotion', name: 'ABC情绪理论', category: 'model', categoryCn: '思维模型', signals: '情绪失控、内耗纠结', color: '#4CAF8C', icon: 'Heart' },
  { id: 'aida', name: 'AIDA漏斗', category: 'model', categoryCn: '思维模型', signals: '曝光高没转化、客户流失', color: '#4CAF8C', icon: 'Filter' },
  { id: 'ansoff-matrix', name: '安索夫矩阵', category: 'model', categoryCn: '思维模型', signals: '增长停滞、拓新纠结', color: '#4CAF8C', icon: 'LayoutGrid' },
  { id: 'bcg-matrix', name: '波士顿矩阵', category: 'model', categoryCn: '思维模型', signals: '产品线太多、预算分配难', color: '#4CAF8C', icon: 'BarChart4' },
  { id: 'benchmarking', name: '标杆分析', category: 'model', categoryCn: '思维模型', signals: '毛利率低、找不到优化方向', color: '#4CAF8C', icon: 'Scale' },
  { id: 'business-model-canvas', name: '商业模式画布', category: 'model', categoryCn: '思维模型', signals: '盈利逻辑说不清', color: '#4CAF8C', icon: 'LayoutTemplate' },
  { id: 'cynefin', name: 'Cynefin框架', category: 'model', categoryCn: '思维模型', signals: '不知该用SOP还是试错', color: '#4CAF8C', icon: 'Map' },
  { id: 'design-thinking', name: '设计思维', category: 'model', categoryCn: '思维模型', signals: '产品用户不买单', color: '#4CAF8C', icon: 'PenTool' },
  { id: 'fishbone', name: '鱼骨图5M', category: 'model', categoryCn: '思维模型', signals: '品质异常、找不到根因', color: '#4CAF8C', icon: 'Bone' },
  { id: 'flywheel', name: '飞轮效应', category: 'model', categoryCn: '思维模型', signals: '增长靠砸钱、停投就下滑', color: '#4CAF8C', icon: 'RefreshCw' },
  { id: 'golden-circle', name: '黄金圈法则', category: 'model', categoryCn: '思维模型', signals: '产品没说服力', color: '#4CAF8C', icon: 'CircleDot' },
  { id: 'gtd', name: 'GTD', category: 'model', categoryCn: '思维模型', signals: '事情太多脑子乱', color: '#4CAF8C', icon: 'CheckSquare' },
  { id: 'hanlons-razor', name: '汉隆剃刀', category: 'model', categoryCn: '思维模型', signals: '错判动机、内部猜忌', color: '#4CAF8C', icon: 'Scissors' },
  { id: 'iceberg-model', name: '冰山模型', category: 'model', categoryCn: '思维模型', signals: '问题反复复发、治标不治本', color: '#4CAF8C', icon: 'IceCream2' },
  { id: 'inversion', name: '逆向思考', category: 'model', categoryCn: '思维模型', signals: '不知道怎么做、但知道什么会搞砸', color: '#4CAF8C', icon: 'ArrowLeftRight' },
  { id: 'jobs-to-be-done', name: 'JTBD', category: 'model', categoryCn: '思维模型', signals: '功能多用户不买账', color: '#4CAF8C', icon: 'Briefcase' },
  { id: 'kano', name: 'KANO模型', category: 'model', categoryCn: '思维模型', signals: '功能用户无感', color: '#4CAF8C', icon: 'Smile' },
  { id: 'okr', name: 'OKR', category: 'model', categoryCn: '思维模型', signals: '目标空洞没法衡量', color: '#4CAF8C', icon: 'Goal' },
  { id: 'pareto-8020', name: '帕累托80/20', category: 'model', categoryCn: '思维模型', signals: '事事平均用力、找不到核心利润', color: '#4CAF8C', icon: 'Percent' },
  { id: 'pdca', name: 'PDCA循环', category: 'model', categoryCn: '思维模型', signals: '做完反复出问题', color: '#4CAF8C', icon: 'Repeat' },
  { id: 'pest', name: 'PEST分析', category: 'model', categoryCn: '思维模型', signals: '看不清大环境', color: '#4CAF8C', icon: 'Globe' },
  { id: 'porter-five-forces', name: '波特五力', category: 'model', categoryCn: '思维模型', signals: '入行研判、行业赚钱吗', color: '#4CAF8C', icon: 'Shield' },
  { id: 'premortem', name: '事前验尸', category: 'model', categoryCn: '思维模型', signals: '投入大不确定、怕翻车', color: '#C73E1D', icon: 'Skull' },
  { id: 'red-team', name: '红队演练', category: 'model', categoryCn: '思维模型', signals: '全员乐观、找不到缺点', color: '#C73E1D', icon: 'Swords' },
  { id: 'regret-minimization', name: '后悔最小化', category: 'model', categoryCn: '思维模型', signals: '两难抉择、不可逆决策', color: '#4CAF8C', icon: 'Compass' },
  { id: 'rice-prioritization', name: 'RICE排序', category: 'model', categoryCn: '思维模型', signals: '需求一大堆不知先做哪个', color: '#4CAF8C', icon: 'ArrowUpDown' },
  { id: 'swot', name: 'SWOT分析', category: 'model', categoryCn: '思维模型', signals: '项目要不要启动', color: '#4CAF8C', icon: 'Scan' },
  { id: 'usp', name: 'USP独特卖点', category: 'model', categoryCn: '思维模型', signals: '和竞品一样只比价', color: '#4CAF8C', icon: 'Zap' },
  { id: 'jobs', name: '史蒂夫·乔布斯', category: 'person', categoryCn: '人物', signals: '产品·设计·取舍·品味', color: '#D4A853', icon: 'Apple' },
  { id: 'musk', name: '埃隆·马斯克', category: 'person', categoryCn: '人物', signals: '创业·技术·工程·十倍速', color: '#D4A853', icon: 'Rocket' },
  { id: 'munger', name: '查理·芒格', category: 'person', categoryCn: '人物', signals: '决策·认知偏误·跨学科', color: '#2D7A5F', icon: 'Brain' },
  { id: 'buffett', name: '沃伦·巴菲特', category: 'person', categoryCn: '人物', signals: '投资·理财·长期主义', color: '#2D7A5F', icon: 'TrendingUp' },
  { id: 'thinking_fast_slow', name: '思考，快与慢', category: 'book', categoryCn: '书籍', signals: '判断·直觉·偏见·风险', color: '#D4A853', icon: 'BookOpen' },
  { id: 'principles', name: '原则', category: 'book', categoryCn: '书籍', signals: '目标·复盘·失败·管理', color: '#D4A853', icon: 'BookMarked' },
  { id: 'poor_charlies', name: '穷查理宝典', category: 'book', categoryCn: '书籍', signals: '误判·激励·人性', color: '#2D7A5F', icon: 'BookOpen' },
  { id: 'art_of_war', name: '孙子兵法', category: 'book', categoryCn: '书籍', signals: '竞争·博弈·谈判', color: '#C73E1D', icon: 'Swords' },
  { id: 'black_swan', name: '黑天鹅', category: 'book', categoryCn: '书籍', signals: '风险·意外·不确定', color: '#D4A853', icon: 'BookOpen' },
];

export interface Advisor {
  id: string;
  name: string;
  philosophy: string;
  title: string;
  color: string;
  quote: string;
}

export const ADVISORS: Advisor[] = [
  { id: 'steve', name: '史蒂夫·乔布斯', philosophy: '极简主义·用户体验', title: '产品直觉·细节执行', color: '#D4A853', quote: '创新是区分领导者和追随者的唯一标准。' },
  { id: 'paul', name: '保罗·格雷厄姆', philosophy: 'YC创业逻辑·PMF', title: '创业本质·用户需求挖掘', color: '#D4A853', quote: '做人们想要的东西。' },
  { id: 'jeff', name: '杰夫·贝佐斯', philosophy: '长期主义·飞轮效应', title: '客户至上·逆向工作法', color: '#D4A853', quote: '把你的利润当作研发费用。' },
  { id: 'elon', name: '埃隆·马斯克', philosophy: '第一性原理', title: '极限执行·高风险高回报', color: '#D4A853', quote: '我要死在火星上——只是不要死在着陆时。' },
  { id: 'laozi', name: '老子', philosophy: '道德经·水哲学', title: '顺势而为·无为而治', color: '#2D7A5F', quote: '上善若水，水善利万物而不争。' },
  { id: 'huineng', name: '六祖慧能', philosophy: '六祖坛经·本自具足', title: '当下觉察·放下执念', color: '#2D7A5F', quote: '菩提本无树，明镜亦非台。' },
  { id: 'mao', name: '毛泽东', philosophy: '矛盾论·群众路线', title: '战略全局·生存优先级', color: '#C73E1D', quote: '战略上藐视敌人，战术上重视敌人。' },
  { id: 'qian', name: '钱学森', philosophy: '系统工程·科学方法', title: '复杂系统拆解·落地方法论', color: '#2D7A5F', quote: '我们没有理由认为中国人比外国人笨。' },
  { id: 'kk', name: '凯文·凯利', philosophy: '技术涌现·生态系统', title: '长远趋势判断·失控之美', color: '#F0EBE0', quote: '技术想要的就是生命想要的。' },
  { id: 'marc', name: '马克·安德森', philosophy: '风险资本逻辑', title: '市场时机判断·技术浪潮', color: '#F0EBE0', quote: '软件正在吞噬世界。' },
  { id: 'bruce', name: '李小龙', philosophy: '截拳道·以无法为有法', title: '内心稳定·身体力行', color: '#C73E1D', quote: '以无法为有法，以无限为有限。' },
  { id: 'albert', name: '爱因斯坦', philosophy: '思维实验·简洁之美', title: '第一性原理·跨维度类比', color: '#F0EBE0', quote: '想象力比知识更重要。' },
];

export const STEP_LABELS = [
  '输入困惑', '定义问题', '挖事实', '独立发言', '拆维度', '深度辩论', '汇总', '摘果子'
];
