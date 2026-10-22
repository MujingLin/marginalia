export type StockLesson = {
  id: string
  chapter: number
  sequence: number
  title: string
  titleEn: string
  question: string
  minutes: number
  intuition: string
  essentials: string[]
  term: { name: string; english: string; meaning: string }
  challenge: { prompt: string; choices: string[]; answer: number; explanation: string }
  practice: string
  caution: string
  source: { title: string; url: string }
}

export const stockChapters = [
  { number: 1, title: '先认识你买的是什么', note: '股票、收益与价格' },
  { number: 2, title: '学会读市场的语言', note: '指数、订单与交易成本' },
  { number: 3, title: '看懂一家公司', note: '报表、估值与竞争力' },
  { number: 4, title: '先管理风险，再谈收益', note: '分散、波动与仓位' },
  { number: 5, title: '建立自己的学习系统', note: '目标、清单与复盘' },
] as const

const investorIntro = 'https://www.investor.gov/introduction-investing'
const stockFaq = 'https://www.investor.gov/introduction-investing/investing-basics/investment-products/stocks'
const diversification = 'https://www.investor.gov/introduction-investing/getting-started/asset-allocation'
const products = 'https://www.investor.gov/introduction-investing/investing-basics/investment-products'
const trading = 'https://www.investor.gov/sites/default/files/trading101basics.pdf'
const own = 'https://www.investor.gov/introduction-investing/getting-started/investing-your-own'

export const stockLessons: StockLesson[] = [
  {
    id: 'stock-is-ownership', chapter: 1, sequence: 1, title: '一股股票，到底是什么？', titleEn: 'A share is ownership', minutes: 7,
    question: '买下一只股票，是买了一个会跳动的价格，还是公司的一小部分？',
    intuition: '股票首先是一份所有权。价格每天变化，但你真正拥有的是公司权益的一小部分。',
    essentials: ['普通股通常代表公司所有权的一部分，并可能附带投票权。', '股东可能通过股价上涨或公司分红获得回报，但两者都没有保证。', '公司清算时，普通股股东通常排在债权人与优先股股东之后。'],
    term: { name: '市值', english: 'Market capitalization', meaning: '股价 × 已发行股份数。它描述市场此刻给整家公司权益的总定价。' },
    challenge: { prompt: '一家公司的股价从 100 元拆分为两股各 50 元，其他条件不变。你的总所有权发生了什么？', choices: ['减少一半', '没有改变', '增加一倍'], answer: 1, explanation: '拆股改变每股价格与股数，不会凭空改变公司价值或你的持股比例。' },
    practice: '找一家熟悉的上市公司，用一句话写下：它卖什么、靠谁付钱、股票代表哪一部分权利。',
    caution: '低股价不等于便宜，高股价也不等于昂贵；要把每股价格和股份数量一起看。',
    source: { title: 'Investor.gov · Stocks FAQ', url: stockFaq },
  },
  {
    id: 'return-and-risk', chapter: 1, sequence: 2, title: '收益从哪里来？', titleEn: 'Return and risk', minutes: 8,
    question: '如果一家公司经营不错，股东就一定赚钱吗？',
    intuition: '投资回报既取决于公司，也取决于你买入时支付的价格，以及最终卖出或持有的时间。',
    essentials: ['总回报通常由价格变化与收到的现金分红共同构成。', '好公司可能因为买入价格过高而成为差投资。', '风险不是“价格会动”，而是结果与预期不同、甚至永久损失本金的可能。'],
    term: { name: '总回报', english: 'Total return', meaning: '在一个期间内，价格变动与现金分红共同带来的收益或损失。' },
    challenge: { prompt: '你以 100 元买入，年底股价 96 元，期间收到 6 元分红。忽略费用，总回报是多少？', choices: ['亏损 4%', '盈利 2%', '盈利 6%'], answer: 1, explanation: '价格损失 4 元，加上分红 6 元，净增加 2 元，即约 2%。' },
    practice: '随便选一个价格，分别写出“上涨 10%”和“下跌 10%”后的金额，观察百分比并不对称地回到原点。',
    caution: '历史回报只能描述过去，不能承诺未来；越高的潜在回报通常伴随越大的损失可能。',
    source: { title: 'Investor.gov · Introduction to Investing', url: investorIntro },
  },
  {
    id: 'price-and-value', chapter: 1, sequence: 3, title: '价格不等于价值', titleEn: 'Price versus value', minutes: 8,
    question: '为什么同一家公司，今天和明天会有不同价格？',
    intuition: '价格是当下买卖双方成交的结果；价值则是你对未来现金、风险与时间的判断。',
    essentials: ['价格会受到预期、消息、流动性和市场情绪共同影响。', '价值不是一个屏幕上直接显示的数字，而是带假设的估计。', '价格偏离你的估值，不代表市场必须很快纠正。'],
    term: { name: '预期', english: 'Expectation', meaning: '市场参与者对公司未来增长、利润和风险的综合判断。价格常常先交易预期。' },
    challenge: { prompt: '公司利润增长 10%，股价却下跌。哪种解释更完整？', choices: ['市场一定错了', '此前价格可能已期待更高增长', '利润和股价永远无关'], answer: 1, explanation: '价格反映的是现实与此前预期之间的差异，而不只是一个孤立的增长数字。' },
    practice: '看到一条公司新闻时，先写“发生了什么”，再写“市场原本可能期待什么”，不要立即写买卖结论。',
    caution: '“我喜欢这家公司”不是估值方法；产品体验、企业质量与股票价格需要分开判断。',
    source: { title: 'Investor.gov · Stocks FAQ', url: stockFaq },
  },
  {
    id: 'index-and-benchmark', chapter: 2, sequence: 4, title: '指数是一把尺子', titleEn: 'Index and benchmark', minutes: 7,
    question: '“今天大盘涨了”究竟是谁涨了？',
    intuition: '指数按一套规则追踪一篮子证券，用来描述某个市场或板块，而不是一只可以买到的公司。',
    essentials: ['不同指数的选股范围与加权方法不同，代表的市场也不同。', '指数本身通常不能直接购买，指数基金试图复制其表现。', '比较投资结果时，基准应与你实际承担的市场风险相匹配。'],
    term: { name: '基准', english: 'Benchmark', meaning: '用于比较投资表现的一把尺子，常见形式是与投资范围相符的市场指数。' },
    challenge: { prompt: '某科技基金今年涨 12%，宽基指数涨 18%。只看绝对收益，最容易遗漏什么？', choices: ['基金代码', '与相应风险基准的比较', '公司的员工人数'], answer: 1, explanation: '12% 是正收益，但相对合适基准可能落后；评价需同时看承担的风险。' },
    practice: '选择两个你听过的指数，查清它们覆盖什么市场、如何选样，不需要记住当天点位。',
    caution: '指数上涨不表示其中每家公司都上涨，也不代表任何指数基金都低风险。',
    source: { title: 'Investor.gov · Investing Glossary', url: 'https://www.investor.gov/introduction-investing/investing-basics/glossary' },
  },
  {
    id: 'market-limit-order', chapter: 2, sequence: 5, title: '市价单与限价单', titleEn: 'Market and limit orders', minutes: 8,
    question: '点击“买入”后，为什么成交价可能不是刚才看到的价格？',
    intuition: '市价单优先争取成交，限价单优先约束价格；两者都不能同时保证价格与成交。',
    essentials: ['市价单通常强调尽快成交，但快速市场中成交价可能偏离最新报价。', '限价买单只会在限价或更低价格成交，但可能完全不成交。', '报价、点差、流动性与订单大小都会影响实际成交。'],
    term: { name: '买卖价差', english: 'Bid–ask spread', meaning: '最高买价与最低卖价之间的差距，是交易摩擦的一种表现。' },
    challenge: { prompt: '你最多愿意用 50 元买入，又不急于成交。哪种指令更贴近目标？', choices: ['市价买入', '50 元限价买入', '不看价格反复提交'], answer: 1, explanation: '限价单约束最高买价，但需要接受可能不成交。' },
    practice: '只做纸面模拟：记录某个标的的买价、卖价与最新价，观察三者何时不同。',
    caution: '订单类型不能消除亏损风险；它只是在执行层面选择优先保证什么。',
    source: { title: 'SEC · Trading Basics', url: trading },
  },
  {
    id: 'fees-and-friction', chapter: 2, sequence: 6, title: '免费的交易并不免费', titleEn: 'Fees and friction', minutes: 7,
    question: '平台显示“零佣金”，成本真的归零了吗？',
    intuition: '显性佣金只是成本的一部分，点差、基金费率、税费与频繁决策造成的损耗也会累积。',
    essentials: ['费用会直接降低净回报，小比例经过多年也可能产生明显差异。', '交易越频繁，越需要关注点差、滑点和税费规则。', '比较产品时应查看完整费率说明，而不是只看宣传标题。'],
    term: { name: '费用率', english: 'Expense ratio', meaning: '基金每年从资产中扣除的运营费用比例，通常不会以单独账单出现。' },
    challenge: { prompt: '两只产品追踪相近资产、表现相同，其他条件一致。哪项会直接影响你的净回报？', choices: ['图标颜色', '持续费用率', '产品名字长度'], answer: 1, explanation: '在毛回报相同时，更高的持续费用会留下更低的净回报。' },
    practice: '打开一个基金或券商的费用说明，找出至少三种可能发生的费用，不进行实际交易。',
    caution: '“零佣金”不等于没有成本，也不代表平台或产品适合你的目标。',
    source: { title: 'Investor.gov · Investment Products', url: products },
  },
  {
    id: 'three-statements', chapter: 3, sequence: 7, title: '三张报表先看什么？', titleEn: 'The three statements', minutes: 10,
    question: '利润很多，为什么公司仍可能缺现金？',
    intuition: '利润表讲一段时期赚没赚钱，资产负债表讲某一时点拥有什么和欠什么，现金流量表讲现金怎样进出。',
    essentials: ['收入不等于收到现金，利润也不等于账户余额。', '资产负债表满足“资产 = 负债 + 股东权益”的关系。', '经营现金流能帮助你检查利润是否真正转化为现金。'],
    term: { name: '自由现金流', english: 'Free cash flow', meaning: '常见理解是经营现金流减去资本性支出，用来观察经营后仍可自由配置的现金。' },
    challenge: { prompt: '公司确认了一笔赊销收入，但客户尚未付款。最直接发生什么？', choices: ['收入可能增加，但现金未同步增加', '现金一定增加', '负债一定归零'], answer: 0, explanation: '权责发生制下，收入确认与现金收取的时间可以不同。' },
    practice: '找一份上市公司年报，只定位三张报表的名称，并记录收入、净利润、经营现金流三个数字。',
    caution: '单一年份或单一指标很容易误导；最好结合多年趋势、同行与注释阅读。',
    source: { title: 'Investor.gov · Stocks and company reports', url: stockFaq },
  },
  {
    id: 'profitability-quality', chapter: 3, sequence: 8, title: '增长也有质量', titleEn: 'Quality of growth', minutes: 9,
    question: '收入涨得很快，就代表生意越来越好吗？',
    intuition: '增长需要看代价：毛利、获客成本、资本投入和现金流共同决定增长质量。',
    essentials: ['收入增长可能来自销量、提价、并购或会计口径变化。', '利润率能显示每一元收入最终留下多少不同层级的利润。', '需要大量新增资本才能维持的增长，与轻资产增长的经济性不同。'],
    term: { name: '净利率', english: 'Net margin', meaning: '净利润 ÷ 收入。它描述每一元收入最终转化为净利润的比例。' },
    challenge: { prompt: '收入增长 30%，净利润却下降。下一步最值得先问什么？', choices: ['股价颜色为何是绿色', '成本、费用或一次性项目发生了什么', '公司名字是否好听'], answer: 1, explanation: '收入只是起点，需要追踪毛利、费用和非经常项目才能理解利润变化。' },
    practice: '对一家公司计算连续两年的收入增长率与净利率，只描述变化，不急着下结论。',
    caution: '高增长并不自动等于高质量，更不自动等于股价会上涨。',
    source: { title: 'Investor.gov · Researching Investments', url: 'https://www.investor.gov/introduction-investing/getting-started/researching-investments' },
  },
  {
    id: 'valuation-basics', chapter: 3, sequence: 9, title: '估值不是猜目标价', titleEn: 'Valuation basics', minutes: 10,
    question: '市盈率低，就是捡到便宜了吗？',
    intuition: '估值指标是价格与某个基本面数字的比率；比率变化可能来自价格，也可能来自分母质量。',
    essentials: ['市盈率把股价与每股收益联系起来，但亏损公司不适用。', '不同行业的资本结构、增长与周期性不同，不能机械横比。', '低估值可能意味着便宜，也可能反映利润将下降或风险更高。'],
    term: { name: '市盈率', english: 'Price-to-earnings ratio', meaning: '常见写法为股价 ÷ 每股收益，也可理解为公司市值 ÷ 净利润。' },
    challenge: { prompt: '某公司市盈率从 20 降到 10。以下哪项一定成立？', choices: ['公司变便宜了', '价格或盈利至少有一项发生变化', '未来收益一定翻倍'], answer: 1, explanation: '比率下降只说明价格与盈利的关系变了，不能单独证明低估。' },
    practice: '找两家同一行业公司，列出市盈率、增长率和负债差异，练习写出“为何不能只比一个倍数”。',
    caution: '任何估值都依赖未来假设；精确到小数点的模型也不等于确定性。',
    source: { title: 'Investor.gov · Investing Basics', url: investorIntro },
  },
  {
    id: 'diversification', chapter: 4, sequence: 10, title: '分散不是买得多', titleEn: 'Diversification', minutes: 8,
    question: '持有十只股票，为什么仍可能没有真正分散？',
    intuition: '真正的分散看风险来源是否不同，而不是账户里有多少行代码。',
    essentials: ['同一行业或同一因素驱动的多只股票，可能一起下跌。', '资产配置是在股票、债券、现金等资产类别间分配。', '分散可以降低单一风险，但无法保证市场下跌时不亏损。'],
    term: { name: '资产配置', english: 'Asset allocation', meaning: '根据目标、期限与风险承受能力，在不同资产类别间分配资金。' },
    challenge: { prompt: '下面哪个组合通常更接近“风险来源分散”？', choices: ['十家同地区小型芯片公司', '不同资产类别和行业的组合', '同一指数的三只高度重合基金'], answer: 1, explanation: '数量不等于分散；需要检查资产、行业、地区和持仓重合。' },
    practice: '用纸画一个虚拟组合，把每项投资背后的主要风险来源连线，找出重复最多的一组。',
    caution: '分散降低的是可分散风险，不会消除系统性风险，也不会保证盈利。',
    source: { title: 'Investor.gov · Asset Allocation and Diversification', url: diversification },
  },
  {
    id: 'volatility-drawdown', chapter: 4, sequence: 11, title: '波动、回撤与永久损失', titleEn: 'Volatility and drawdown', minutes: 8,
    question: '价格下跌 20% 后，需要上涨多少才能回本？',
    intuition: '亏损与回本的百分比并不对称；损失越大，需要恢复的涨幅越高。',
    essentials: ['从高点到低点的跌幅称为回撤。', '下跌 20% 后，剩余 80 要回到 100，需要上涨 25%。', '波动可以恢复，基本面恶化或杠杆清算可能造成永久损失。'],
    term: { name: '最大回撤', english: 'Maximum drawdown', meaning: '观察期内从某个高点到随后低点的最大跌幅，用来描述经历过的下行幅度。' },
    challenge: { prompt: '账户从 100 跌到 50，需要上涨多少才能回到 100？', choices: ['50%', '75%', '100%'], answer: 2, explanation: '剩余 50 需要再增加 50；50 相对于当前 50 是 100%。' },
    practice: '计算下跌 10%、20%、30%、50% 后分别需要上涨多少回本，把结果留在笔记里。',
    caution: '能承受的风险不是问卷里愿意选多高，而是下跌发生时你的现金需求与行为是否会迫使你卖出。',
    source: { title: 'Investor.gov · Managing Risk', url: investorIntro },
  },
  {
    id: 'position-and-leverage', chapter: 4, sequence: 12, title: '仓位决定你能否留下', titleEn: 'Position size and leverage', minutes: 9,
    question: '判断正确率很高，为什么仍可能一次亏光？',
    intuition: '单次判断与最终生存之间隔着仓位。投入过大或使用杠杆，会让普通错误变成不可恢复的损失。',
    essentials: ['仓位大小决定一次错误对整体资产的冲击。', '杠杆会同时放大收益与损失，并可能触发被动平仓。', '应急资金与短期必用的钱不适合承担股票市场波动。'],
    term: { name: '杠杆', english: 'Leverage', meaning: '借入资金或使用衍生工具放大投资敞口；损益幅度也会被同步放大。' },
    challenge: { prompt: '哪笔钱最不适合用于高波动股票投资？', choices: ['多年后才使用的闲置资金', '三个月后要交的学费', '预先设定可承受损失的小额学习资金'], answer: 1, explanation: '期限很短且用途刚性的资金，无法等待市场恢复，也承受不起本金波动。' },
    practice: '不填具体金额，只把自己的资金按“应急、三年内使用、长期”分三栏，观察哪些根本不应进入股票账户。',
    caution: '新手阶段不需要用杠杆证明判断；先学会不被一次错误淘汰。',
    source: { title: 'Investor.gov · Investment Products and Risk', url: products },
  },
  {
    id: 'goal-horizon', chapter: 5, sequence: 13, title: '先写目标，再看行情', titleEn: 'Goal and time horizon', minutes: 7,
    question: '同一只股票，为什么对两个人可能是完全不同的风险？',
    intuition: '风险承受能力取决于目标、使用时间和现金流，不只是性格大胆与否。',
    essentials: ['时间期限越短，通常越难承受高波动资产。', '先建立应急储备，可以减少在不利时点被迫卖出的可能。', '目标决定基准、资产配置与可接受的波动范围。'],
    term: { name: '投资期限', english: 'Time horizon', meaning: '从现在到需要使用资金的时间长度，是决定风险承受能力的重要条件。' },
    challenge: { prompt: '一年后必须支付的首付款，更应该优先考虑什么？', choices: ['追逐最高潜在收益', '本金可用性与较低波动', '热门股票讨论度'], answer: 1, explanation: '短期刚性目标更需要流动性和本金稳定，不能依赖市场在指定日期上涨。' },
    practice: '写下一个投资目标、预计使用年份，以及如果资产临时下跌 30% 会发生什么。',
    caution: '没有目标的账户容易被每日行情接管；看到机会前，先知道这笔钱为什么存在。',
    source: { title: 'Investor.gov · Asset Allocation', url: diversification },
  },
  {
    id: 'research-checklist', chapter: 5, sequence: 14, title: '建立研究清单', titleEn: 'A research checklist', minutes: 10,
    question: '如何避免因为一条消息就冲动买入？',
    intuition: '清单把“感觉不错”拆成可以检验的问题，并强迫相反证据进入判断。',
    essentials: ['先说明公司如何赚钱，再看行业、竞争、管理与财务。', '写出估值假设，同时写出哪些证据会推翻它。', '区分事实、推断与未知，不用故事填补信息空白。'],
    term: { name: '投资论点', english: 'Investment thesis', meaning: '你为什么认为未来结果会优于当前价格所隐含预期的一组可检验理由。' },
    challenge: { prompt: '哪句话最接近可检验的投资论点？', choices: ['大家都说它会涨', '若客户留存与现金流持续改善，当前价格可能低估长期盈利；若连续恶化则重审', '这家公司很伟大，所以任何价格都能买'], answer: 1, explanation: '好的论点包含机制、证据与可能推翻判断的条件。' },
    practice: '为一家公司写五行：如何赚钱、客户为何购买、最大风险、当前价格隐含什么、什么会证明我错。',
    caution: '研究清单减少遗漏，但不能消除未知；不要把完成清单误解为获得确定答案。',
    source: { title: 'Investor.gov · Researching Investments', url: 'https://www.investor.gov/introduction-investing/getting-started/researching-investments' },
  },
  {
    id: 'paper-portfolio', chapter: 5, sequence: 15, title: '先用纸面组合练习', titleEn: 'Paper portfolio', minutes: 8,
    question: '不急着真金白银入场，能不能学会投资？',
    intuition: '纸面组合让你练习记录假设与复盘流程，但无法模拟真实亏损带来的情绪压力。',
    essentials: ['记录决定当时可见的信息，避免事后用结果改写理由。', '固定周期复盘基本面与论点，不用每天价格替代研究。', '同时记录基准表现、费用假设和没有行动的理由。'],
    term: { name: '复盘', english: 'Review', meaning: '按预先设定的标准检查过程、证据与错误，而不是只用盈亏判断决定质量。' },
    challenge: { prompt: '纸面组合上涨后，哪种复盘最有学习价值？', choices: ['只记录赚了多少', '检查原论点是否兑现、收益来自能力还是市场普涨', '马上把模拟仓位全部变成真实仓位'], answer: 1, explanation: '结果可能来自运气或整体市场，复盘需要拆开过程与结果。' },
    practice: '建立一个最多五项的虚拟观察清单，每项写入场假设、反证条件、基准和下次复盘日期。',
    caution: '模拟盈利不代表真实交易会复制结果；入场前仍应独立评估目标、风险与产品规则。',
    source: { title: 'Investor.gov · Investing on Your Own', url: own },
  },
]

