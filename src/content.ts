import { z } from 'zod'
import { monthlyEnglishArticles } from './monthlyEnglish'
import { idiomArticle } from './idiomArticle'

export const annotationSchema = z.object({
  text: z.string(),
  type: z.enum(['vocabulary', 'concept']),
  targetId: z.string(),
})

export const paragraphSchema = z.object({
  id: z.string(),
  original: z.string(),
  translation: z.string(),
  annotations: z.array(annotationSchema).default([]),
})

export const articleSchema = z.object({
  id: z.string(),
  title: z.string(),
  titleZh: z.string(),
  dek: z.string(),
  dekZh: z.string(),
  language: z.literal('English'),
  topic: z.string(),
  level: z.string(),
  minutes: z.number(),
  source: z.string(),
  sourceUrl: z.string().url(),
  sourceNote: z.string(),
  monogram: z.string(),
  primer: z.object({ question: z.string(), choices: z.tuple([z.string(), z.string()]), feedback: z.tuple([z.string(), z.string()]) }),
  quiz: z.object({ prompt: z.string(), choices: z.array(z.object({ id: z.string(), text: z.string() })), answer: z.string(), correctFeedback: z.string(), incorrectFeedback: z.string() }),
  closingPrompt: z.string(),
  paragraphs: z.array(paragraphSchema),
})

export type Annotation = z.infer<typeof annotationSchema>
export type Article = z.infer<typeof articleSchema>

export const article = articleSchema.parse({
  id: 'small-decisions',
  title: 'The Quiet Architecture of Small Decisions',
  titleZh: '小选择的隐形结构',
  dek: 'Why the shape of an ordinary choice can matter more than willpower.',
  dekZh: '为什么日常选择的结构，有时比意志力更重要。',
  language: 'English',
  topic: 'Thinking & Decisions',
  level: 'B2',
  minutes: 9,
  source: 'TED · Dan Ariely',
  sourceUrl: 'https://www.ted.com/talks/dan_ariely_how_to_change_your_behavior_for_the_better',
  sourceNote: 'TED 官方来源 · Marginalia 原创学习改编 · 2026 年 10 月审核',
  monogram: 'THE QUIET ARCHITECTURE',
  primer: { question: '你觉得，改变一个日常习惯主要依靠更强的意志力吗？', choices: ['是，主要靠自律', '不完全是，环境也重要'], feedback: ['先记住你的判断。文章会提出一个不同角度：意志力有成本，而环境会改变行动的难易。', '这正是文章要检验的方向。阅读时留意 friction 和 defaults 如何影响选择。'] },
  quiz: { prompt: '作者最想表达的观点是什么？', choices: [{ id: 'a', text: '意志力是改变习惯唯一可靠的方法。' }, { id: 'b', text: '环境中的微小设计会悄悄影响反复发生的选择。' }, { id: 'c', text: '所有默认选项都应该被取消。' }], answer: 'b', correctFeedback: '答对了。阻力和默认选项会改变哪个行动最容易开始；它们并不会取消人的自主选择。', incorrectFeedback: '再想想“书放在包里”和“表格预先勾选”的例子。作者没有否定意志力，而是指出持续调用意志力本身有成本。' },
  closingPrompt: '今天留意一个被环境悄悄影响的小选择。',
  paragraphs: [
    {
      id: 'opening',
      original: 'Every morning begins with decisions that barely feel like decisions. We silence an alarm, reach for a familiar cup, and follow a route that our feet seem to remember. None of these actions is dramatic. Together, however, they form an invisible architecture around the day.',
      translation: '每天早晨都始于一些几乎感觉不到是选择的选择。我们关掉闹钟，伸手拿起熟悉的杯子，沿着双脚似乎已经记住的路线前行。这些行为都不戏剧化，却共同构成了环绕一天的隐形结构。',
      annotations: [{ text: 'architecture', type: 'vocabulary', targetId: 'architecture' }],
    },
    {
      id: 'friction',
      original: 'Designers sometimes call one part of this architecture friction: anything that makes an action slightly harder or easier. A password adds friction. A bowl of fruit placed within reach removes it. The difference can be only a few seconds, yet those seconds often redirect behaviour.',
      translation: '设计者有时把这种结构的一部分称为“阻力”：任何让行动稍微变难或变容易的因素。密码增加阻力；伸手可及的一碗水果则减少阻力。差别可能只有几秒，却经常改变行为的方向。',
      annotations: [
        { text: 'friction', type: 'concept', targetId: 'choice-friction' },
        { text: 'redirect', type: 'vocabulary', targetId: 'redirect' },
      ],
    },
    {
      id: 'defaults',
      original: 'Defaults are even quieter. When a form has one option already selected, many people keep it—not because they carefully judged every alternative, but because changing it requires attention. The default becomes a recommendation without speaking.',
      translation: '默认选项更加安静。当表格已经选中一个选项时，很多人会保留它——并非因为他们仔细衡量了每个替代方案，而是因为改变它需要注意力。默认值不发一言，却成了一种建议。',
      annotations: [{ text: 'Defaults', type: 'concept', targetId: 'default-effect' }],
    },
    {
      id: 'willpower',
      original: 'This does not mean that people have no agency. It means that agency operates inside an environment. Willpower matters, but it is expensive: it asks us to notice, compare, resist, and choose again. Good environments make the better action easier to notice and simpler to begin.',
      translation: '这并不意味着人没有自主性，而是说自主性总在环境之中运作。意志力很重要，但它的成本很高：它要求我们察觉、比较、抵抗并再次选择。好的环境会让更好的行动更容易被看见，也更容易开始。',
      annotations: [
        { text: 'agency', type: 'vocabulary', targetId: 'agency' },
        { text: 'Willpower', type: 'vocabulary', targetId: 'willpower' },
      ],
    },
    {
      id: 'commute',
      original: 'Consider a commute. If a book is buried in a bag while a phone is already in your hand, reading asks for one extra move. That tiny inconvenience repeats every day. Moving the book to an outside pocket will not create a lifelong reader overnight, but it changes which action is ready first.',
      translation: '想想通勤场景。如果书埋在包里，而手机已经拿在手中，阅读就需要多一个动作。这个微小的不便每天都会重复。把书放到外侧口袋不会让人一夜之间成为终身读者，却改变了哪种行动最先准备就绪。',
      annotations: [{ text: 'inconvenience', type: 'vocabulary', targetId: 'inconvenience' }],
    },
    {
      id: 'ethics',
      original: 'There is an ethical question here. The same tools that help someone remember medicine can push another person toward an unnecessary purchase. Friction and defaults are not automatically good. We should ask whose goal they serve, whether the influence is visible, and how easily a person can choose otherwise.',
      translation: '这里也存在伦理问题。帮助一个人记得服药的同类工具，也可能把另一个人推向不必要的购买。阻力和默认选项并不天然是好的。我们应当追问：它们服务于谁的目标？这种影响是否可见？人们想做出不同选择时是否容易？',
      annotations: [{ text: 'ethical', type: 'vocabulary', targetId: 'ethical' }],
    },
    {
      id: 'closing',
      original: 'A useful first step is not to redesign your whole life. Look for one repeated decision. Then ask: what happens immediately before it, and what is the smallest change that could make the desired action more available? Small decisions remain small, but their architecture no longer has to be accidental.',
      translation: '有用的第一步并不是重新设计整个人生。先找出一个反复出现的选择，然后问：它之前紧接着发生了什么？怎样一个最小改变，能让理想的行动更容易发生？小选择依然很小，但它们背后的结构不必再是偶然形成的。',
      annotations: [{ text: 'available', type: 'vocabulary', targetId: 'available' }],
    },
  ],
})

export const additionalArticles = z.array(articleSchema).parse([
  {
    id: 'patient-work-of-listening', title: 'The Patient Work of Listening', titleZh: '倾听是一种耐心的工作',
    dek: 'Hearing arrives automatically. Listening is the deliberate act of making room for meaning.', dekZh: '听见会自动发生，倾听却需要主动为意义腾出空间。',
    language: 'English', topic: 'Communication & Culture', level: 'B2', minutes: 10,
    source: 'TED · Julian Treasure', sourceUrl: 'https://www.ted.com/talks/julian_treasure_5_ways_to_listen_better', sourceNote: 'TED 官方来源 · Marginalia 原创主题延伸 · 2026 年 10 月审核',
    monogram: 'THE PATIENT WORK OF LISTENING',
    primer: { question: '沉默地等别人说完，就等于认真倾听吗？', choices: ['基本等于', '不一定'], feedback: ['不打断很重要，但倾听还包括注意、理解、检查自己的推断。', '文章会进一步区分“保持安静”和“主动建构理解”。'] },
    quiz: { prompt: '文中所说的 listening posture 最接近什么？', choices: [{ id: 'a', text: '一种愿意被信息修正的注意方式。' }, { id: 'b', text: '把对方每个词都原样记住。' }, { id: 'c', text: '等到轮到自己发言。' }], answer: 'a', correctFeedback: '正确。倾听姿态的核心是让新信息有机会改变自己的理解。', incorrectFeedback: '文章强调的不是记忆或礼貌等待，而是保持注意并允许自己的解释被修正。' },
    closingPrompt: '下一次对话中，先复述你听到的意思，再给出自己的判断。',
    paragraphs: [
      { id: 'noise', original: 'A city is never silent. Engines idle, doors close, messages arrive, and fragments of conversation overlap. Our ears receive all of it, but attention cannot. Listening begins with selection: deciding which signal deserves a place in the foreground.', translation: '城市从不安静。发动机低鸣、门扉合上、消息抵达、谈话片段彼此重叠。耳朵接收了这一切，注意力却做不到。倾听始于选择：决定哪一个信号值得来到前景。', annotations: [{ text: 'fragments', type: 'vocabulary', targetId: 'fragments' }, { text: 'foreground', type: 'vocabulary', targetId: 'foreground' }] },
      { id: 'pause', original: 'In conversation, a pause can feel like empty space that must be filled. Yet a pause often carries work: someone is searching for an accurate word, testing whether it is safe to continue, or noticing an emotion before naming it.', translation: '在对话中，停顿可能像一块必须填满的空白。但停顿往往承载着工作：有人正在寻找准确的词、试探继续说是否安全，或在命名情绪之前先感受它。', annotations: [{ text: 'accurate', type: 'vocabulary', targetId: 'accurate' }] },
      { id: 'prediction', original: 'The mind is a prediction machine. Once we think we know where a sentence is going, we prepare an answer before it ends. This is efficient, but it can turn another person into a familiar script instead of a source of new information.', translation: '大脑是一台预测机器。一旦以为知道一句话会通向哪里，我们便会在它结束前准备答案。这很高效，却也可能把另一个人变成熟悉的脚本，而非新信息的来源。', annotations: [{ text: 'prediction', type: 'concept', targetId: 'confirmation-bias' }] },
      { id: 'posture', original: 'A listening posture is not passive. It asks small questions: What did I assume? Which word did the speaker emphasize? Can I describe their point in a way they would recognise? These questions slow judgment without cancelling it.', translation: '倾听姿态并不被动。它会提出一些小问题：我预设了什么？说话者强调了哪个词？我能否用一种对方也认可的方式复述其观点？这些问题会放慢判断，却不取消判断。', annotations: [{ text: 'passive', type: 'vocabulary', targetId: 'passive' }] },
      { id: 'repair', original: 'Misunderstanding is not proof that listening has failed. Often the important skill is repair: noticing the gap, checking an interpretation, and allowing the other person to correct it without turning the correction into a contest.', translation: '误解并不证明倾听已经失败。更重要的能力往往是修复：察觉理解的缝隙、核对解释，并允许对方纠正，而不把纠正变成一场胜负之争。', annotations: [{ text: 'repair', type: 'vocabulary', targetId: 'repair' }] },
      { id: 'practice', original: 'Better listening is built through ordinary repetitions. Put the phone face down. Leave one breath after the other person stops. Summarise before disagreeing. None of these guarantees agreement; each creates a little more room for reality to enter.', translation: '更好的倾听由日常重复构成：把手机屏幕朝下；对方停下后留出一次呼吸；反驳前先总结。这些做法都不保证达成一致，却各自为现实进入对话多腾出一点空间。', annotations: [] },
    ],
  },
  {
    id: 'good-life-is-plural', title: 'A Good Life Is Built in the Plural', titleZh: '好生活以复数形式建成',
    dek: 'Relationships are not decoration around a life. They are part of its working structure.', dekZh: '关系并非生活外围的装饰，而是生活得以运作的结构之一。',
    language: 'English', topic: 'Life & Society', level: 'B2', minutes: 11,
    source: 'TED · Robert Waldinger', sourceUrl: 'https://www.ted.com/talks/robert_waldinger_what_makes_a_good_life_lessons_from_the_longest_study_on_happiness', sourceNote: 'TED 官方来源 · Marginalia 原创主题延伸 · 2026 年 10 月审核',
    monogram: 'A GOOD LIFE IN THE PLURAL',
    primer: { question: '关系的“数量”越多，就一定越幸福吗？', choices: ['通常是', '质量可能更重要'], feedback: ['文章会区分社交数量、关系质量和可靠支持。', '这是核心线索：关键不只是认识多少人，而是关系如何运作。'] },
    quiz: { prompt: '文章对长期关系最谨慎的结论是什么？', choices: [{ id: 'a', text: '只要结婚就一定更健康。' }, { id: 'b', text: '可靠、可修复的关系能提供长期支持，但没有单一模板。' }, { id: 'c', text: '独处总是有害。' }], answer: 'b', correctFeedback: '正确。文章避免把相关性写成保证，也没有规定唯一的关系形式。', incorrectFeedback: '注意文章反复限定：关系的类型可以不同，冲突也并不等于失败。' },
    closingPrompt: '给一个重要的人发出具体而不笼统的关心。',
    paragraphs: [
      { id: 'images', original: 'When people imagine a good life, they often picture achievements that can be displayed: a title, a home, a journey, a finished project. Relationships are harder to place in a single image because they exist through time, repetition, and mutual adjustment.', translation: '当人们想象好生活时，常会想到能够展示的成就：头衔、房子、旅程、完成的项目。关系却很难被放进一张图片，因为它存在于时间、重复与相互调整之中。', annotations: [{ text: 'mutual', type: 'vocabulary', targetId: 'mutual' }] },
      { id: 'reliable', original: 'The useful question is not simply how many people surround us. It is whether support is reliable. Can a worry be spoken without immediate ridicule? Can help be requested without turning it into a permanent debt?', translation: '有用的问题不只是身边有多少人，而是支持是否可靠：担忧能否被说出而不立刻遭到嘲笑？求助是否不会变成永久的人情债？', annotations: [{ text: 'reliable', type: 'vocabulary', targetId: 'reliable' }] },
      { id: 'conflict', original: 'A close relationship is not one without conflict. It is one with some capacity for repair. People misread tone, forget promises, and protect themselves clumsily. Trust grows when these failures can be named and addressed.', translation: '亲密关系并不是没有冲突的关系，而是具备一定修复能力的关系。人会误读语气、忘记承诺，也会笨拙地保护自己。当这些失败可以被说出并处理时，信任才会生长。', annotations: [{ text: 'capacity', type: 'vocabulary', targetId: 'capacity' }] },
      { id: 'causality', original: 'Long studies can reveal patterns, but patterns are not personal guarantees. Health, income, temperament, and opportunity interact with relationships. A careful conclusion does not promise that one social formula will produce happiness for everyone.', translation: '长期研究可以揭示模式，但模式不是对个人的保证。健康、收入、性情和机会都会与关系相互作用。谨慎的结论不会承诺某种社交公式能为所有人制造幸福。', annotations: [{ text: 'patterns', type: 'vocabulary', targetId: 'patterns' }] },
      { id: 'maintenance', original: 'Connection also requires maintenance. Friendship weakens when every invitation is postponed to a calmer future. Care becomes visible through small acts: remembering a difficult date, asking a second question, or making a plan specific enough to happen.', translation: '连接也需要维护。如果每次邀请都被推迟到更从容的未来，友谊会逐渐变弱。关心通过小行动变得可见：记住一个艰难的日子、追问第二个问题，或把计划具体到能够发生。', annotations: [{ text: 'maintenance', type: 'vocabulary', targetId: 'maintenance' }] },
      { id: 'plural', original: 'There is no single shape for a good relational life. Family, friendship, neighbours, colleagues, and communities can carry different forms of care. The point is plural: a life becomes more resilient when meaning and support do not rest on one fragile connection.', translation: '良好的关系生活没有唯一形状。家人、朋友、邻居、同事与社群能够承载不同形式的照料。重点在“复数”：当意义与支持不只压在一段脆弱的关系上，生活会更有韧性。', annotations: [{ text: 'resilient', type: 'vocabulary', targetId: 'resilient' }] },
    ],
  },
])

export const articles = z.array(articleSchema).parse([idiomArticle, article, ...additionalArticles, ...monthlyEnglishArticles])

export const vocabulary = {
  'down-for-that': { lemma: "I'm down for that", pos: 'expression', pronunciation: '/aɪm daʊn fəðæt/', meaning: '我愿意；算我一个', context: "I'm down for that", example: "Dinner at seven? I'm down for that." },
  'language-chunk': { lemma: 'a whole chunk', pos: 'learning term', pronunciation: '/tʃʌŋk/', meaning: '一个整体语块；不逐词拆分的表达', context: 'learn a whole chunk', example: 'Learn “sounds good” as a whole chunk.' },
  'count-me-in': { lemma: 'count me in', pos: 'expression', pronunciation: '/kaʊnt mi ɪn/', meaning: '算我一个；我参加', context: 'Count me in', example: 'You are going hiking? Count me in.' },
  'works-for-me': { lemma: 'that works for me', pos: 'expression', pronunciation: '/ðæt wɜːks fə miː/', meaning: '那个时间／方案我可以', context: 'That works for me', example: 'We can meet at three. That works for me.' },
  'not-up-for-it': { lemma: "I'm not up for it", pos: 'expression', pronunciation: '/aɪm nɒt ʌp fər ɪt/', meaning: '我现在不太想／没精力做', context: "I'm not up for it tonight", example: "Thanks, but I'm not up for a party tonight." },
  'language-register': { lemma: 'register', pos: 'language term', pronunciation: '/ˈredʒɪstə/', meaning: '语体；由场合与关系决定的表达风格', context: 'Register matters', example: 'The same idea needs a different register in a text to a friend and an email to a client.' },
  'central-claim': { lemma: 'central claim', pos: 'academic expression', pronunciation: '/ˈsentrəl kleɪm/', meaning: '核心主张；文章最想证明的观点', context: 'Its central claim is that…', example: 'The central claim needs evidence and a clear boundary.' },
  'conditions-apply': { lemma: 'the conditions in which it applies', pos: 'academic expression', pronunciation: '', meaning: '它成立／适用的条件', context: 'recognise the conditions in which it applies', example: 'A useful idea also explains the conditions in which it applies.' },
  'rather-than-slogan': { lemma: 'rather than a slogan', pos: 'expression', pronunciation: '', meaning: '而不只是一句口号', context: 'an observation rather than a slogan', example: 'Turn the advice into an experiment rather than a slogan.' },
  'more-plausible': { lemma: 'more plausible', pos: 'expression', pronunciation: '/mɔː ˈplɔːzəbəl/', meaning: '更说得通；更有可能是真的', context: 'which explanation now seems more plausible', example: 'The second explanation became more plausible after the test.' },
  architecture: { lemma: 'architecture', pos: 'noun', pronunciation: '/ˈɑːkɪtektʃə/', meaning: '结构；构造方式', context: 'an invisible architecture around the day', example: 'The policy changed the architecture of everyday choices.' },
  redirect: { lemma: 'redirect', pos: 'verb', pronunciation: '/ˌriːdəˈrekt/', meaning: '使改变方向；重新引导', context: 'those seconds often redirect behaviour', example: 'A small reminder can redirect attention.' },
  agency: { lemma: 'agency', pos: 'noun', pronunciation: '/ˈeɪdʒənsi/', meaning: '自主行动与作出选择的能力', context: 'agency operates inside an environment', example: 'Good design should preserve the user’s agency.' },
  willpower: { lemma: 'willpower', pos: 'noun', pronunciation: '/ˈwɪlpaʊə/', meaning: '意志力；自制力', context: 'Willpower matters, but it is expensive', example: 'Habits can reduce the need for willpower.' },
  inconvenience: { lemma: 'inconvenience', pos: 'noun', pronunciation: '/ˌɪnkənˈviːniəns/', meaning: '不便；麻烦', context: 'That tiny inconvenience repeats every day', example: 'Even a minor inconvenience can change behaviour.' },
  ethical: { lemma: 'ethical', pos: 'adjective', pronunciation: '/ˈeθɪkəl/', meaning: '伦理的；合乎道德的', context: 'There is an ethical question here', example: 'The team discussed the ethical limits of persuasion.' },
  available: { lemma: 'available', pos: 'adjective', pronunciation: '/əˈveɪləbəl/', meaning: '可获得的；可采用的', context: 'make the desired action more available', example: 'Fresh water was not readily available.' },
  fragments: { lemma: 'fragment', pos: 'noun', pronunciation: '/ˈfræɡmənt/', meaning: '片段；碎片', context: 'fragments of conversation overlap', example: 'Only fragments of the conversation were audible.' },
  foreground: { lemma: 'foreground', pos: 'noun', pronunciation: '/ˈfɔːɡraʊnd/', meaning: '前景；注意中心', context: 'a place in the foreground', example: 'The issue moved into the foreground of the debate.' },
  accurate: { lemma: 'accurate', pos: 'adjective', pronunciation: '/ˈækjərət/', meaning: '准确的', context: 'searching for an accurate word', example: 'Her summary was brief but accurate.' },
  passive: { lemma: 'passive', pos: 'adjective', pronunciation: '/ˈpæsɪv/', meaning: '被动的；消极接受的', context: 'A listening posture is not passive', example: 'Reading can be active rather than passive.' },
  repair: { lemma: 'repair', pos: 'noun', pronunciation: '/rɪˈpeə/', meaning: '修复；弥补', context: 'the important skill is repair', example: 'Trust requires honest repair after conflict.' },
  mutual: { lemma: 'mutual', pos: 'adjective', pronunciation: '/ˈmjuːtʃuəl/', meaning: '相互的；共同的', context: 'mutual adjustment', example: 'The partnership depends on mutual respect.' },
  reliable: { lemma: 'reliable', pos: 'adjective', pronunciation: '/rɪˈlaɪəbəl/', meaning: '可靠的', context: 'whether support is reliable', example: 'She is a reliable source of practical advice.' },
  capacity: { lemma: 'capacity', pos: 'noun', pronunciation: '/kəˈpæsəti/', meaning: '能力；容量', context: 'some capacity for repair', example: 'The team has the capacity to adapt.' },
  patterns: { lemma: 'pattern', pos: 'noun', pronunciation: '/ˈpætən/', meaning: '模式；规律', context: 'studies can reveal patterns', example: 'The data revealed a seasonal pattern.' },
  maintenance: { lemma: 'maintenance', pos: 'noun', pronunciation: '/ˈmeɪntənəns/', meaning: '维护；维持', context: 'Connection also requires maintenance', example: 'Good systems need regular maintenance.' },
  resilient: { lemma: 'resilient', pos: 'adjective', pronunciation: '/rɪˈzɪliənt/', meaning: '有韧性的；能恢复的', context: 'a life becomes more resilient', example: 'Resilient communities recover through cooperation.' },
} as const

export const concepts = {
  'choice-friction': { name: 'Choice friction', nameZh: '选择阻力', definition: '在完成某个行动前出现的额外时间、步骤或认知负担；即使很小，也可能改变行为。', note: '阻力不是天然有害：它既能保护用户避免冲动，也能制造不必要的障碍。' },
  'default-effect': { name: 'Default effect', nameZh: '默认效应', definition: '当一个选项被预先设定时，人们更可能保留它，即使其他选项同样可选。', note: '原因可能包括省力、对推荐的推断，以及对改变结果的不确定。' },
} as const

export const filters = ['今日', '日常表达', '沟通与文化', '思维与决策', '学习与成长', '创造与设计', '生活与社会'] as const
