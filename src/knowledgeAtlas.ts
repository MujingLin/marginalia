export type KnowledgeExpansion = {
  id: string
  slug: string
  nameZh: string
  nameEn: string
  subject: '经济学' | '心理学' | '哲学' | '科学' | '历史' | '冷知识'
  minutes: number
  question: string
  teaser: string
}

type Seed = [string, string, string, string, string]

const economics: Seed[] = [
  ['comparative-advantage', '比较优势', 'Comparative advantage', '为什么不必“什么都最强”也能从合作中受益？', '关键不是绝对能力，而是各自放弃什么。'],
  ['supply-demand', '供给与需求', 'Supply and demand', '价格为什么会同时影响买方与卖方？', '价格是协调稀缺资源的一种信号。'],
  ['elasticity', '弹性', 'Elasticity', '价格变化一点，需求量为什么有时变化很多？', '弹性衡量数量对价格或收入变化的敏感度。'],
  ['externality', '外部性', 'Externality', '一笔交易为什么会影响没有参与的人？', '成本与收益可能越过交易双方的边界。'],
  ['public-goods', '公共品', 'Public goods', '路灯为什么很难只让付费者使用？', '非排他与非竞争会改变市场供给方式。'],
  ['tragedy-commons', '公地悲剧', 'Tragedy of the commons', '人人都合理使用资源，为什么资源仍可能耗尽？', '个体激励与共同长期利益可能发生冲突。'],
  ['principal-agent', '委托代理问题', 'Principal–agent problem', '替你做决定的人，目标真的和你一样吗？', '信息与激励不对称会改变代理人的行为。'],
  ['moral-hazard', '道德风险', 'Moral hazard', '有了保障后，人为什么可能承担更多风险？', '风险后果被分担时，行为激励也会变化。'],
  ['adverse-selection', '逆向选择', 'Adverse selection', '信息更少的一方为什么容易遇到更差的选择？', '交易前的信息不对称会改变留下来的参与者。'],
  ['network-effects', '网络效应', 'Network effects', '一个产品为什么会因为别人也在用而更有价值？', '用户规模会直接改变每个用户获得的效用。'],
  ['inflation', '通货膨胀', 'Inflation', '物价普遍上涨和某一种商品涨价有什么不同？', '通胀描述总体价格水平持续变化。'],
  ['real-nominal', '实际值与名义值', 'Real vs. nominal', '工资涨了，购买力为什么可能反而下降？', '名义数字需要经过价格水平调整。'],
  ['price-discrimination', '价格歧视', 'Price discrimination', '同一项服务为什么向不同人收不同价格？', '企业会根据支付意愿与市场分隔制定价格。'],
  ['game-theory', '博弈论', 'Game theory', '你的最佳选择为什么取决于别人怎么选？', '策略互动让结果由多方行动共同决定。'],
  ['nash-equilibrium', '纳什均衡', 'Nash equilibrium', '一个稳定结果为什么不一定对所有人最好？', '无人愿意单方面改变，不等于总体最优。'],
  ['creative-destruction', '创造性破坏', 'Creative destruction', '创新为什么会同时创造工作与淘汰工作？', '新技术与组织会重组产业和技能价值。'],
]

const psychology: Seed[] = [
  ['anchoring', '锚定效应', 'Anchoring effect', '第一个数字为什么会影响后续估计？', '起始信息会成为判断时难以完全摆脱的参照。'],
  ['availability-heuristic', '可得性启发', 'Availability heuristic', '容易想起的事件为什么显得更常见？', '记忆提取的轻松程度会被误当作发生概率。'],
  ['representativeness', '代表性启发', 'Representativeness heuristic', '“看起来像”为什么会压过真实比例？', '相似性判断容易忽略基础率与样本量。'],
  ['halo-effect', '光环效应', 'Halo effect', '一个优点为什么会让其他评价一起变高？', '整体印象会渗入对具体特征的判断。'],
  ['fundamental-attribution', '基本归因错误', 'Fundamental attribution error', '为什么解释别人时更容易怪性格？', '我们常低估情境对他人行为的影响。'],
  ['self-serving-bias', '自利偏误', 'Self-serving bias', '成功和失败为什么常被我们归因给不同原因？', '自我形象会影响对结果的解释。'],
  ['mere-exposure', '曝光效应', 'Mere-exposure effect', '反复见到为什么可能增加喜欢？', '熟悉感常被体验为安全与流畅。'],
  ['peak-end-rule', '峰终定律', 'Peak–end rule', '为什么记忆更在意高潮和结尾？', '回顾体验时，峰值与结尾可能获得更高权重。'],
  ['planning-fallacy', '规划谬误', 'Planning fallacy', '为什么项目总比预计花更久？', '我们倾向使用理想路径，忽略类似项目的真实分布。'],
  ['dunning-kruger', '邓宁—克鲁格效应', 'Dunning–Kruger effect', '能力不足为什么可能妨碍准确自评？', '完成任务与评估任务往往需要部分相同知识。'],
  ['bystander-effect', '旁观者效应', 'Bystander effect', '人越多，为什么每个人反而可能越不行动？', '责任分散与情境不确定会抑制帮助。'],
  ['social-proof', '社会认同', 'Social proof', '别人都在选，为什么会成为理由？', '在信息不足时，群体行为被当成判断线索。'],
  ['placebo-context', '安慰剂情境效应', 'Placebo context effects', '治疗仪式为什么会改变真实感受？', '期待、关系和情境能影响症状体验与行为。'],
  ['working-memory', '工作记忆', 'Working memory', '脑中同时能处理的信息为什么这么少？', '短时保持与操作信息的容量十分有限。'],
  ['spacing-effect', '间隔效应', 'Spacing effect', '分开学为什么通常比一次学完记得久？', '有间隔的提取迫使记忆重新建立通路。'],
  ['testing-effect', '测试效应', 'Testing effect', '回想为什么比重读更能巩固记忆？', '主动提取本身会改变未来可提取性。'],
]

const philosophy: Seed[] = [
  ['ship-theseus', '忒修斯之船', 'Ship of Theseus', '零件全部换掉后，它还是同一艘船吗？', '身份可以依赖材料、连续性、功能或叙事。'],
  ['trolley-problem', '电车难题', 'Trolley problem', '主动伤害与放任伤害有什么道德差别？', '思想实验揭示后果、义务与意图之间的冲突。'],
  ['veil-ignorance', '无知之幕', 'Veil of ignorance', '不知道自己会出生在哪里，你会怎样设计制度？', '暂时移除个人位置，帮助检验规则的公平性。'],
  ['categorical-imperative', '绝对命令', 'Categorical imperative', '如果人人都这样做，这条规则还能成立吗？', '道德原则应能被一致地普遍化。'],
  ['utilitarianism', '功利主义', 'Utilitarianism', '怎样的行动能让总体福祉最大？', '结果主义比较行动对所有相关者的影响。'],
  ['virtue-ethics', '德性伦理', 'Virtue ethics', '除了“该做什么”，还要问“成为什么样的人”吗？', '德性伦理把品格、实践与良好生活放在中心。'],
  ['existentialism', '存在主义', 'Existentialism', '没有预设答案时，人如何创造意义？', '自由、责任与具体处境共同塑造人的选择。'],
  ['absurdism', '荒诞主义', 'Absurdism', '世界不回应意义需求时，生活还能继续吗？', '荒诞来自意义渴望与沉默世界之间的张力。'],
  ['stoicism-control', '控制二分法', 'Dichotomy of control', '哪些事真正由我控制？', '区分判断与外部结果，可以重新分配行动精力。'],
  ['epistemic-humility', '认知谦逊', 'Epistemic humility', '知道自己可能错，会削弱判断吗？', '承认知识边界，反而能让更新更可靠。'],
  ['problem-induction', '归纳问题', 'Problem of induction', '过去重复发生，凭什么保证未来继续？', '经验规律需要超出已观察案例作推断。'],
  ['chinese-room', '中文房间', 'Chinese room', '正确处理符号等于真正理解吗？', '思想实验追问语法操作与语义理解的关系。'],
  ['free-will', '自由意志', 'Free will', '行为有原因，是否意味着没有选择？', '决定论、随机性与责任之间并非简单对立。'],
  ['personal-identity', '人格同一性', 'Personal identity', '记忆、身体和性格，哪一个构成“同一个我”？', '跨时间的自我可能依赖多种连续关系。'],
]

const science: Seed[] = [
  ['natural-selection', '自然选择', 'Natural selection', '没有设计者，复杂适应怎样出现？', '可遗传差异与繁殖差异能累积群体变化。'],
  ['genetic-drift', '遗传漂变', 'Genetic drift', '物种变化为什么不总是因为“更适应”？', '随机抽样在小种群中也能显著改变基因频率。'],
  ['gene-expression', '基因表达', 'Gene expression', '拥有一个基因，为什么不等于一定表现出来？', '细胞会在不同时间与环境中调节基因读取。'],
  ['epigenetics', '表观遗传', 'Epigenetics', '不改 DNA 序列，也能改变基因活动吗？', '化学标记与染色质状态会影响基因表达。'],
  ['immune-memory', '免疫记忆', 'Immune memory', '身体怎样“记住”一次感染？', '部分免疫细胞在初次应答后长期保留。'],
  ['antibiotic-resistance', '抗生素耐药性', 'Antibiotic resistance', '药为什么会“越用越不灵”？', '药物筛选出更能存活和繁殖的微生物变体。'],
  ['plate-tectonics', '板块构造', 'Plate tectonics', '大陆为什么会移动？', '地球岩石圈板块在地幔过程驱动下缓慢运动。'],
  ['greenhouse-effect', '温室效应', 'Greenhouse effect', '大气怎样改变地球散热？', '温室气体吸收并重新发射部分红外辐射。'],
  ['feedback-loop', '反馈回路', 'Feedback loop', '一个变化为什么会自我放大或自我抑制？', '系统输出返回输入端，形成正反馈或负反馈。'],
  ['emergence', '涌现', 'Emergence', '简单个体怎样形成复杂集体行为？', '局部互动可以产生单个部分并不具备的整体模式。'],
  ['chaos-theory', '混沌', 'Chaos theory', '确定系统为什么仍可能难以长期预测？', '对初始条件的敏感会放大微小测量差异。'],
  ['bayes-theorem', '贝叶斯定理', 'Bayes’ theorem', '新证据应该怎样更新原来的判断？', '后验概率结合了先验信息与证据的似然。'],
  ['regression-mean', '均值回归', 'Regression to the mean', '极端表现之后为什么常回到普通水平？', '偶然因素不会在下一次完全同样出现。'],
  ['correlation-causation', '相关与因果', 'Correlation and causation', '两件事一起变化，为什么不代表一件造成另一件？', '共同原因、反向因果与选择偏差都能制造相关。'],
  ['sample-size', '样本量', 'Sample size', '为什么小样本更容易出现惊人结果？', '随机波动在样本较小时更难相互抵消。'],
  ['p-value', 'P 值', 'P-value', 'P 值很小，到底说明了什么？', '它衡量特定模型下观察到当前或更极端数据的概率。'],
  ['confidence-interval', '置信区间', 'Confidence interval', '一个估计值为什么要带范围？', '区间表达抽样不确定性，而非结果的全部可信度。'],
  ['special-relativity', '狭义相对论', 'Special relativity', '同时发生为什么取决于观察者？', '光速不变会改变时间、长度与同时性的关系。'],
  ['quantum-superposition', '量子叠加', 'Quantum superposition', '量子系统能同时处于多种状态吗？', '状态可以由多个可能结果的振幅组合描述。'],
  ['black-hole-horizon', '黑洞视界', 'Black-hole event horizon', '为什么越过某条边界后连光也回不来？', '事件视界是无法向外界传递信号的时空边界。'],
]

const history: Seed[] = [
  ['printing-revolution', '印刷革命', 'Printing revolution', '复制文字变便宜后，知识秩序发生了什么？', '传播成本下降改变了教育、宗教与公共争论。'],
  ['columbian-exchange', '哥伦布大交换', 'Columbian Exchange', '跨洋接触怎样重组全球生态与人口？', '作物、动物、病原体与人口在大陆间大规模流动。'],
  ['industrial-time', '工业时间', 'Industrial time', '人为什么开始按钟表而不是日光工作？', '工厂协调把统一时间变成劳动纪律的一部分。'],
  ['nation-state', '民族国家', 'Nation-state', '“一个民族一个国家”的想象从何而来？', '教育、印刷、行政与战争共同塑造政治身份。'],
  ['silk-roads', '丝绸之路网络', 'Silk Roads', '丝绸之路为什么不是一条路？', '多个陆海网络连接商品、宗教、技术与疾病。'],
  ['black-death-labor', '黑死病与劳动', 'Black Death and labor', '人口骤减为什么会改变劳动者议价能力？', '劳动力稀缺重塑工资、制度与社会关系。'],
  ['haitian-revolution', '海地革命', 'Haitian Revolution', '被奴役者的革命怎样改变自由的含义？', '海地革命挑战了殖民制度与启蒙时代的排除。'],
  ['meiji-modernization', '明治维新', 'Meiji Restoration', '快速现代化为什么同时带来国家强化与社会冲突？', '制度、军事、教育与工业改革重新分配了权力。'],
  ['cold-war-proxy', '冷战代理战争', 'Cold War proxy wars', '大国对抗为什么常发生在别人的土地上？', '全球竞争与地方冲突相互利用并彼此改变。'],
  ['oral-history', '口述史', 'Oral history', '个人记忆能成为历史证据吗？', '口述材料既保存经验，也需要处理记忆与权力问题。'],
]

const curiosities: Seed[] = [
  ['why-sky-blue', '天空为什么是蓝色', 'Why the sky is blue', '阳光看似白色，天空为什么呈蓝色？', '短波长可见光更容易被大气分子散射。'],
  ['why-onion-tears', '切洋葱为什么流泪', 'Why onions make us cry', '洋葱被切开后释放了什么？', '细胞破裂引发反应，生成刺激眼睛的挥发性物质。'],
  ['gecko-feet', '壁虎为什么能爬墙', 'Gecko adhesion', '没有胶水，壁虎脚为什么能黏住墙？', '大量微细毛结构放大了分子间作用力。'],
  ['cat-purr', '猫为什么呼噜', 'Why cats purr', '呼噜声只表示开心吗？', '猫会在多种情境中呼噜，其功能仍包含未决问题。'],
  ['smell-rain', '雨后的气味', 'Petrichor', '雨落在干燥地面时，熟悉气味从哪里来？', '植物油、土壤化合物与气溶胶共同形成雨味。'],
  ['goose-v', '雁群为什么排成人字', 'Why geese fly in a V', 'V 字队形怎样节省能量？', '个体利用前方翼尖涡流中的上升气流。'],
  ['banana-radioactive', '香蕉有放射性吗', 'Banana radioactivity', '普通香蕉为什么会发出极微量辐射？', '天然钾中含有少量放射性同位素钾-40。'],
  ['metal-smell', '金属本身有“金属味”吗', 'The smell of metal', '摸过硬币后手上的味道真来自金属吗？', '金属催化皮肤脂质反应，生成易挥发气味分子。'],
  ['birds-power-lines', '鸟站电线为什么没事', 'Birds on power lines', '高压线上有电，鸟为什么通常不会触电？', '双脚电势几乎相同，身体中没有显著电流路径。'],
  ['popcorn-pop', '爆米花为什么会爆', 'Why popcorn pops', '小小玉米粒怎样突然翻开？', '内部水分受热增压，外壳破裂后淀粉迅速膨胀。'],
]

function expand(subject: KnowledgeExpansion['subject'], seeds: Seed[]): KnowledgeExpansion[] {
  return seeds.map(([id, nameZh, nameEn, question, teaser], index) => ({ id, slug: id, nameZh, nameEn, subject, minutes: 5 + index % 4, question, teaser }))
}

export const knowledgeExpansions: KnowledgeExpansion[] = [
  ...expand('经济学', economics),
  ...expand('心理学', psychology),
  ...expand('哲学', philosophy),
  ...expand('科学', science),
  ...expand('历史', history),
  ...expand('冷知识', curiosities),
]

