import { z } from 'zod'
import { knowledgeExpansions } from './knowledgeAtlas'

const sourceSchema = z.object({
  title: z.string(),
  publisher: z.string(),
  url: z.string().url(),
  note: z.string(),
})

const relationSchema = z.object({
  targetId: z.string(),
  type: z.enum(['前置知识', '比较', '反例', '应用', '跨学科']),
  reason: z.string(),
})

const activitySchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('marginal-slider'),
    title: z.string(),
    prompt: z.string(),
    values: z.array(z.number()).min(3),
  }),
  z.object({
    type: z.literal('scenario'),
    title: z.string(),
    prompt: z.string(),
    choices: z.array(z.string()).min(2),
    answer: z.number().int().nonnegative(),
    explanations: z.array(z.string()),
  }),
  z.object({
    type: z.literal('loss-slider'),
    title: z.string(),
    prompt: z.string(),
    defaultGain: z.number(),
  }),
])

export const conceptSchema = z.object({
  id: z.string(),
  slug: z.string(),
  nameZh: z.string(),
  nameEn: z.string(),
  subject: z.enum(['经济学', '心理学', '哲学', '科学', '历史', '冷知识']),
  question: z.string(),
  minutes: z.number().int().positive(),
  intuition: z.string(),
  formalDefinition: z.string(),
  formula: z.string().optional(),
  formulaNote: z.string().optional(),
  example: z.object({ title: z.string(), body: z.string() }),
  misconception: z.object({ title: z.string(), body: z.string() }),
  activity: activitySchema,
  check: z.object({
    prompt: z.string(),
    choices: z.array(z.string()).min(2),
    answer: z.number().int().nonnegative(),
    explanation: z.string(),
  }),
  related: z.array(relationSchema),
  sources: z.array(sourceSchema).min(1),
})

export type ConceptDetail = z.infer<typeof conceptSchema>

export const conceptDetails = [
  {
    id: 'marginal-utility', slug: 'marginal-utility', nameZh: '边际效用', nameEn: 'Marginal utility', subject: '经济学', minutes: 8,
    question: '为什么水比钻石更有用，却通常更便宜？',
    intuition: '不要只问“它总共有多有用”，而要问“再多一个单位，此刻还能增加多少满足”。',
    formalDefinition: '边际效用是在其他条件不变时，消费量增加一个单位所带来的总效用增量。它描述的是变化量，不是商品的全部价值。',
    formula: 'MUₙ = TUₙ − TUₙ₋₁',
    formulaNote: 'MU 是第 n 单位的边际效用；TU 是累计的总效用。这里的数字只是教学刻度，不代表满足感能够被精确测量。',
    example: { title: '口渴时的六片披萨', body: '第一片解决饥饿，第二片仍然令人满足；到第五片，你的总满足可能还在增加，但这一片新增的满足已经很少。第六片甚至可能让你不舒服。' },
    misconception: { title: '边际效用 ≠ 总效用', body: '第五片带来的新增满足很低，不代表前五片累计的总满足也很低。边际量看“这一点变化”，总量看“到目前为止的累积”。' },
    activity: { type: 'marginal-slider', title: '动手感受：披萨实验', prompt: '拖动你已经吃下的片数，比较“这一片”与“累计”的变化。以下是虚构教学数据。', values: [32, 24, 17, 10, 4, -3] },
    check: { prompt: '第六片披萨的边际效用是 −3，最准确的理解是？', choices: ['前五片完全没有价值', '第六片让总满足比之前少了 3', '总效用一定变成负数'], answer: 1, explanation: '边际效用只描述从第五片到第六片的变化。此前累积的满足仍然存在。' },
    related: [
      { targetId: 'opportunity-cost', type: '前置知识', reason: '资源有限时，“再多一个单位”的收益需要和放弃的其他用途比较。' },
      { targetId: 'sunk-cost', type: '比较', reason: '边际分析关注下一步的增量；沉没成本则是已经发生、无法收回的代价。' },
      { targetId: 'loss-aversion', type: '跨学科', reason: '真实选择不仅受效用变化影响，人们对损失与获得的心理权重也不对称。' },
    ],
    sources: [
      { title: 'Principles of Economics · Utility', publisher: 'OpenStax', url: 'https://openstax.org/books/principles-economics-3e/pages/6-1-consumption-choices', note: '开放教材：消费选择与边际效用。' },
    ],
  },
  {
    id: 'sunk-cost', slug: 'sunk-cost', nameZh: '沉没成本', nameEn: 'Sunk cost', subject: '经济学', minutes: 7,
    question: '电影已经很难看了，为什么我们还是不愿离场？',
    intuition: '已经付出且无法收回的成本，不会因为你继续投入就自动变得值得。',
    formalDefinition: '沉没成本是已经发生、且无法通过当前或未来决策收回的成本。理性的下一步选择应比较未来的新增成本与新增收益。',
    example: { title: '看到一半的电影', body: '票钱已经支付，无论留下还是离场都拿不回来。真正需要比较的是：接下来的一小时，看电影和去做别的事，哪一个对你更有价值。' },
    misconception: { title: '沉没成本 ≠ 所有过去成本', body: '如果一项支出仍可退款、设备仍可转卖，它就不完全是沉没成本。关键不是“发生在过去”，而是“现在无法收回”。' },
    activity: { type: 'scenario', title: '你会继续吗？', prompt: '你花 68 元买了电影票。40 分钟后仍觉得无聊，附近朋友邀请你散步。票不能退款。你会如何判断？', choices: ['必须看完，否则浪费 68 元', '只比较接下来一小时两种选择的体验', '再买零食，让票钱更值得'], answer: 1, explanations: ['票钱已经无法改变，继续观看不会把它赚回来。', '正确。下一步决策应比较未来的成本与收益。', '新增消费会扩大投入，但不会改变电影是否值得继续看。'] },
    check: { prompt: '下面哪一项最可能不是沉没成本？', choices: ['不可退款的演出票', '仍可原价退货的未拆商品', '已经投入失败项目的工时'], answer: 1, explanation: '可原价退货意味着成本仍能收回，因此不是典型沉没成本。' },
    related: [
      { targetId: 'opportunity-cost', type: '比较', reason: '沉没成本看无法收回的过去；机会成本看现在选择某项行动所放弃的最好替代。' },
      { targetId: 'loss-aversion', type: '跨学科', reason: '承认投入无法收回会被体验为损失，损失厌恶会加剧继续投入的冲动。' },
      { targetId: 'confirmation-bias', type: '应用', reason: '继续投入后，人们更容易搜集“原决定没错”的证据。' },
    ],
    sources: [
      { title: 'Relevant Information for Decision-Making', publisher: 'OpenStax', url: 'https://openstax.org/books/principles-managerial-accounting/pages/10-1-identify-relevant-information-for-decision-making', note: '开放教材：沉没成本与未来决策。' },
      { title: 'Sunk costs · research brief', publisher: 'American Psychological Association', url: 'https://www.apa.org/monitor/2018/10/inbrief', note: '行为研究中的沉没成本效应。' },
    ],
  },
  {
    id: 'loss-aversion', slug: 'loss-aversion', nameZh: '损失厌恶', nameEn: 'Loss aversion', subject: '心理学', minutes: 8,
    question: '为什么丢掉 100 元的难受，常常大于捡到 100 元的开心？',
    intuition: '同样大小的变化，被感受为“损失”时，心理重量通常更大。',
    formalDefinition: '损失厌恶指相对于某个参照点，人们对同等规模损失的敏感度通常高于对收益的敏感度。它是描述性规律，不代表每个人、每个情境都遵循固定倍数。',
    example: { title: '免费的试用期', body: '当一项服务先进入你的生活，取消它会被感受为“失去”；即使你一开始并不会主动购买，也可能更难放手。' },
    misconception: { title: '损失厌恶 ≠ 害怕所有风险', body: '面对确定损失时，人们有时反而愿意冒险以避免认亏。风险态度会随参照点和表述方式改变。' },
    activity: { type: 'loss-slider', title: '多少钱才愿意赌？', prompt: '抛硬币：正面你得到下方金额，反面你损失 100 元。调节收益，观察自己的接受点。', defaultGain: 150 },
    check: { prompt: '哪一种设计最可能利用损失厌恶？', choices: ['展示“完成后获得 10 分”', '提示“今天不用积分将失效”', '随机改变按钮颜色'], answer: 1, explanation: '把同一资源表达为即将失去，往往比表达为可以获得更有推动力。' },
    related: [
      { targetId: 'framing-effect', type: '前置知识', reason: '同一结果被表述为收益或损失，会改变参照点与判断。' },
      { targetId: 'sunk-cost', type: '应用', reason: '把停止投入理解为“承认损失”，会让人更难退出。' },
      { targetId: 'default-effect', type: '跨学科', reason: '改变默认状态可能被体验为放弃已经拥有的东西。' },
    ],
    sources: [
      { title: 'Prospect Theory: An Analysis of Decision under Risk', publisher: 'Econometrica', url: 'https://www.jstor.org/stable/1914185', note: 'Kahneman 与 Tversky 的经典论文。' },
      { title: 'Daniel Kahneman · Nobel Lecture', publisher: 'Nobel Prize', url: 'https://www.nobelprize.org/uploads/2018/06/kahnemann-lecture.pdf', note: '前景理论、参照点与损失厌恶。' },
    ],
  },
  {
    id: 'opportunity-cost', slug: 'opportunity-cost', nameZh: '机会成本', nameEn: 'Opportunity cost', subject: '经济学', minutes: 7,
    question: '选择一件事时，真正放弃了什么？',
    intuition: '成本不只写在付款记录里；当资源有限，你放弃的最佳替代方案也属于成本。',
    formalDefinition: '机会成本是作出一个选择时，被放弃的所有替代方案中价值最高的那一个。它强调稀缺资源的用途竞争，既可以是金钱，也可以是时间、空间或注意力。',
    example: { title: '免费的周六下午', body: '参加免费讲座没有票价，却占用了三小时。如果你原本最想用这三小时完成作品集，那么被放弃的作品集进展，就是这次选择的主要机会成本。' },
    misconception: { title: '机会成本 ≠ 放弃的所有东西相加', body: '你无法同时执行多个替代方案。机会成本看的是被放弃选项里价值最高的那个，而不是把所有没做的事情累计成一张巨额账单。' },
    activity: { type: 'scenario', title: '周六只能选一项', prompt: '你可选：免费讲座、能赚 300 元的兼职、最期待的朋友聚会。你最终去聚会。若你对兼职的价值高于讲座，机会成本是什么？', choices: ['0 元，因为聚会免费', '免费讲座加 300 元', '被放弃的 300 元兼职价值'], answer: 2, explanations: ['免费不代表没有替代用途。', '机会成本不是把全部替代方案相加。', '正确。最佳被放弃替代是兼职，因此它构成机会成本。'] },
    check: { prompt: '哪句话正确使用了机会成本？', choices: ['我买书花了 80 元，所以机会成本永远是 80 元', '我今晚刷剧，放弃了最重视的备考时间', '所有没有选择的人生都要相加'], answer: 1, explanation: '机会成本取决于当下可行的最佳替代，不只等于显性价格，也不是所有遗憾的总和。' },
    related: [
      { targetId: 'marginal-utility', type: '应用', reason: '比较下一单位资源用在哪里时，需要同时看新增收益和最佳替代用途。' },
      { targetId: 'sunk-cost', type: '比较', reason: '机会成本面向此刻仍可选择的未来；沉没成本属于无法收回的过去。' },
      { targetId: 'default-effect', type: '跨学科', reason: '默认选项可能让被放弃的替代用途变得不显眼。' },
    ],
    sources: [{ title: 'Principles of Economics · Choice in a World of Scarcity', publisher: 'OpenStax', url: 'https://openstax.org/books/principles-economics-3e/pages/2-1-how-individuals-make-choices-based-on-their-budget-constraint', note: '开放教材：稀缺、取舍与机会成本。' }],
  },
  {
    id: 'confirmation-bias', slug: 'confirmation-bias', nameZh: '确认偏误', nameEn: 'Confirmation bias', subject: '心理学', minutes: 8,
    question: '为什么我们越搜索，反而越确信自己原来就是对的？',
    intuition: '人不只是被动接收证据；我们提出什么问题、注意什么结果、如何解释模糊信息，都会偏向已有看法。',
    formalDefinition: '确认偏误是人们倾向于寻找、解释、记忆或重视支持既有信念的信息，同时较少检验能够推翻它的证据。它描述的是信息处理倾向，不等于“有观点就是偏见”。',
    example: { title: '只搜“为什么它有效”', body: '准备购买某种保健品时，如果只搜索“它为什么有效”，搜索结果天然会集中在支持材料。改问“哪些证据会证明它无效、研究质量如何”，才能让相反证据有进入判断的机会。' },
    misconception: { title: '确认偏误 ≠ 所有坚持', body: '看到新证据后仍保持原判断，不一定是偏误；关键在于是否公平寻找反例、是否按证据质量更新，而不是结果有没有改变。' },
    activity: { type: 'scenario', title: '换一种搜索问题', prompt: '你怀疑“早起一定提高效率”。哪一种搜索最能减少确认偏误？', choices: ['搜索“早起成功人士”', '同时寻找支持与反对研究，并预先写下改变判断的标准', '询问一个同样喜欢早起的朋友'], answer: 1, explanations: ['这会优先暴露支持原观点的故事。', '正确。对称搜证与预设更新标准能增加被反驳的可能。', '相似立场的个例不足以检验普遍结论。'] },
    check: { prompt: '下面哪一种行为最符合确认偏误？', choices: ['根据更可靠的新证据修改观点', '只保存支持自己立场的报道', '暂时没有足够证据而保留判断'], answer: 1, explanation: '选择性保存支持材料，会让已有信念不断得到单侧强化。' },
    related: [
      { targetId: 'sunk-cost', type: '应用', reason: '投入越多，人越可能偏向寻找“当初选择正确”的证据。' },
      { targetId: 'framing-effect', type: '比较', reason: '确认偏误偏向与信念一致的信息；框架效应则来自同一信息的表达方式。' },
      { targetId: 'falsifiability', type: '跨学科', reason: '主动提出可能推翻假设的观察，是对抗单向搜证的重要方法。' },
    ],
    sources: [{ title: 'Confirmation Bias: A Ubiquitous Phenomenon in Many Guises', publisher: 'Review of General Psychology', url: 'https://doi.org/10.1037/1089-2680.2.2.175', note: '经典综述：确认偏误在假设检验、记忆与信息评价中的表现。' }],
  },
  {
    id: 'default-effect', slug: 'default-effect', nameZh: '默认效应', nameEn: 'Default effect', subject: '心理学', minutes: 7,
    question: '为什么预先勾选一个选项，就能改变很多人的决定？',
    intuition: '默认值不仅省去一次点击，还可能被理解成建议、常态或已经拥有的状态。',
    formalDefinition: '默认效应指在其他选项仍可选择时，人们更可能保留预先设定的选项。可能机制包括行动成本、注意力限制、对推荐的推断，以及改变现状带来的损失感。',
    example: { title: '自动续订的复选框', body: '当“到期自动续订”已经勾选，取消需要发现入口、理解后果并主动操作。几步微小阻力与“这可能是推荐设置”的暗示叠加，保留率便会上升。' },
    misconception: { title: '默认效应 ≠ 人们没有选择', body: '默认选项仍可能允许退出。真正的伦理问题是：退出是否清晰容易、后果是否透明、默认值是否服务于用户而非利用疏忽。' },
    activity: { type: 'scenario', title: '设计一个负责任的默认值', prompt: '学校要设置通知频率。哪种方案更尊重用户？', choices: ['默认每天推送且把关闭入口藏起来', '提供清楚的默认频率、解释原因，并允许一步更改', '不给任何说明，随机选择'], answer: 1, explanations: ['隐藏退出把默认效应变成了操纵。', '正确。透明理由和低成本更改保留了自主性。', '随机默认无法帮助用户理解选择。'] },
    check: { prompt: '默认值影响选择，最不可能是因为哪一项？', choices: ['改变需要额外行动', '人们把默认理解为建议', '默认值能保证人人获得最佳结果'], answer: 2, explanation: '默认值不会自动适合所有人；这正是必须提供透明且容易更改的原因。' },
    related: [
      { targetId: 'loss-aversion', type: '前置知识', reason: '离开默认状态有时被感受为失去已经拥有的选项。' },
      { targetId: 'choice-friction', type: '应用', reason: '保留默认通常不需操作，切换选项则需要额外注意与步骤。' },
      { targetId: 'framing-effect', type: '比较', reason: '默认状态和语言框架都能在不改变选项集合时影响判断。' },
    ],
    sources: [{ title: 'Do Defaults Save Lives?', publisher: 'Science', url: 'https://www.science.org/doi/10.1126/science.1091721', note: '经典研究：器官捐献默认选项与同意率差异。' }],
  },
] satisfies ConceptDetail[]

export const conceptIndex = [
  ...conceptDetails,
  { id: 'choice-friction', slug: 'choice-friction', nameZh: '选择阻力', nameEn: 'Choice friction', subject: '心理学', minutes: 6, question: '为什么多一步操作就会改变行为？', teaser: '时间、步骤与认知负担，会改变一个行动被执行的概率。' },
  { id: 'framing-effect', slug: 'framing-effect', nameZh: '框架效应', nameEn: 'Framing effect', subject: '心理学', minutes: 5, question: '“九成存活”和“一成死亡”真的一样吗？', teaser: '等价信息的表达方式会改变判断。' },
  { id: 'falsifiability', slug: 'falsifiability', nameZh: '可证伪性', nameEn: 'Falsifiability', subject: '哲学', minutes: 6, question: '什么样的证据会让你承认自己错了？', teaser: '能够说明“怎样才算错”，是严肃检验的起点。' },
  { id: 'cognitive-dissonance', slug: 'cognitive-dissonance', nameZh: '认知失调', nameEn: 'Cognitive dissonance', subject: '心理学', minutes: 6, question: '行为和信念冲突时，我们会怎样解释自己？', teaser: '不一致带来的不适，会推动人改变行为或重写解释。' },
  { id: 'entropy', slug: 'entropy', nameZh: '熵', nameEn: 'Entropy', subject: '科学', minutes: 7, question: '为什么有些变化自然发生，逆转却需要做功？', teaser: '熵帮助我们描述能量分散与可实现微观状态的数量。' },
  { id: 'survivorship-bias', slug: 'survivorship-bias', nameZh: '幸存者偏差', nameEn: 'Survivorship bias', subject: '心理学', minutes: 6, question: '我们看见的成功样本，遗漏了谁？', teaser: '只研究留下来的样本，会让失败路径从数据中消失。' },
  { id: 'compound-interest', slug: 'compound-interest', nameZh: '复利', nameEn: 'Compound interest', subject: '经济学', minutes: 6, question: '为什么增长会在后期突然变快？', teaser: '收益再次参与增长，会让时间成为关键变量。' },
  { id: 'base-rate', slug: 'base-rate', nameZh: '基础率', nameEn: 'Base rate', subject: '心理学', minutes: 6, question: '一个结果很准确，为什么仍可能是假阳性？', teaser: '判断证据前，先看事件本身有多常见。' },
  ...knowledgeExpansions,
] as const

for (const concept of conceptDetails) conceptSchema.parse(concept)

export function getConceptName(id: string) {
  return conceptIndex.find((item) => item.id === id)?.nameZh ?? id
}
