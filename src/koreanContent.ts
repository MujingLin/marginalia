import { z } from 'zod'
import { monthlyKoreanLessons } from './monthlyKorean'

const koreanWordSchema = z.object({
  id: z.string(),
  hangul: z.string(),
  meaning: z.string(),
  note: z.string(),
  example: z.string(),
  exampleZh: z.string(),
})

const activitySchema = z.discriminatedUnion('type', [
  z.object({ id: z.string(), type: z.literal('choice'), prompt: z.string(), choices: z.array(z.string()), answer: z.string(), explanation: z.string() }),
  z.object({ id: z.string(), type: z.literal('listen'), prompt: z.string(), speech: z.string(), choices: z.array(z.string()), answer: z.string(), explanation: z.string() }),
  z.object({ id: z.string(), type: z.literal('arrange'), prompt: z.string(), blocks: z.array(z.string()), answer: z.array(z.string()), explanation: z.string() }),
])

const sessionSchema = z.object({
  id: z.string(),
  title: z.string(),
  subtitle: z.string(),
  minutes: z.number(),
  objective: z.string(),
  words: z.array(koreanWordSchema).default([]),
  grammar: z.object({ title: z.string(), rule: z.string(), examples: z.array(z.object({ ko: z.string(), zh: z.string() })), mistake: z.string() }).optional(),
  dialogue: z.array(z.object({ speaker: z.string(), ko: z.string(), zh: z.string() })).default([]),
  activities: z.array(activitySchema),
})

const lessonSchema = z.object({
  id: z.string(),
  sequence: z.number(),
  title: z.string(),
  titleKo: z.string(),
  theme: z.string(),
  description: z.string(),
  textbookAlignment: z.string(),
  topikSkills: z.array(z.string()),
  sessions: z.array(sessionSchema),
})

export type KoreanActivity = z.infer<typeof activitySchema>
export type KoreanSession = z.infer<typeof sessionSchema>
export type KoreanLesson = z.infer<typeof lessonSchema>

export const koreanLessons = z.array(lessonSchema).parse([
  {
    id: 'greetings-introduction',
    sequence: 1,
    title: '问候与自我介绍',
    titleKo: '인사와 자기소개',
    theme: '第一次见面时，礼貌地介绍自己',
    description: '从听过很多次的 안녕하세요 出发，学会说出自己的名字与身份。',
    textbookAlignment: '新延世韩国语初级 1-1 · 问候与介绍主题及初级交际目标对齐；内容与练习为 Marginalia 原创。',
    topikSkills: ['基础词汇', '短句阅读', '名词谓语'],
    sessions: [
      {
        id: 'greeting-words',
        title: '先把耳熟的声音认出来',
        subtitle: 'Warm-up · Words',
        minutes: 4,
        objective: '认读 6 个见面场景高频词，并区分问候与自我介绍。',
        words: [
          { id: 'annyeonghaseyo', hangul: '안녕하세요', meaning: '您好；你好', note: '礼貌而通用的问候，适合第一次见面及多数日常场合。', example: '안녕하세요? 저는 유진이에요.', exampleZh: '您好，我叫有真。' },
          { id: 'jeo', hangul: '저', meaning: '我（谦称）', note: '礼貌表达中使用；口语非敬语常用 나。', example: '저는 학생이에요.', exampleZh: '我是学生。' },
          { id: 'ireum', hangul: '이름', meaning: '名字', note: '询问他人姓名时，需结合礼貌表达。', example: '이름이 뭐예요?', exampleZh: '您叫什么名字？' },
          { id: 'haksaeng', hangul: '학생', meaning: '学生', note: '学 + 生，可作为身份名词使用。', example: '민수는 학생이에요.', exampleZh: '民秀是学生。' },
          { id: 'saram', hangul: '사람', meaning: '人', note: '可和国家名称组合表达国籍。', example: '저는 중국 사람이에요.', exampleZh: '我是中国人。' },
          { id: 'bangapseumnida', hangul: '반갑습니다', meaning: '很高兴见到您', note: '正式礼貌体，第一次见面时常用。', example: '만나서 반갑습니다.', exampleZh: '很高兴见到您。' },
        ],
        activities: [
          { id: 'greet-listen', type: 'listen', prompt: '播放声音，选择你听到的韩文。', speech: '안녕하세요', choices: ['안녕하세요', '감사합니다', '괜찮아요'], answer: '안녕하세요', explanation: '안녕하세요 是礼貌问候；注意开头是 안녕，不是 감사。' },
          { id: 'greet-context', type: 'choice', prompt: '第一次见到老师，哪一句最合适？', choices: ['안녕하세요.', '안녕.', '잘 가.'], answer: '안녕하세요.', explanation: '안녕하세요 是安全、礼貌的选择。안녕 和 잘 가 更常用于熟人之间的非敬语场景。' },
        ],
      },
      {
        id: 'greeting-grammar',
        title: '把名字变成完整句子',
        subtitle: 'Grammar',
        minutes: 4,
        objective: '使用名词 + 이에요/예요 表达“是……”。',
        grammar: {
          title: '名词 + 이에요 / 예요',
          rule: '前面的名词有收音（받침）时接 이에요；没有收音时接 예요。它们都是礼貌的日常表达。',
          examples: [
            { ko: '저는 학생이에요.', zh: '我是学生。（학생 有收音 ㄱ）' },
            { ko: '저는 유나예요.', zh: '我是允娜。（유나 没有收音）' },
          ],
          mistake: '不要写成 학생예요。학생 末尾有收音 ㄱ，因此需要 이에요。',
        },
        activities: [
          { id: 'copula-choice', type: 'choice', prompt: '저는 의사___。应该填哪一个？', choices: ['이에요', '예요', '아요'], answer: '예요', explanation: '의사 最后一个音节 사 没有收音，所以接 예요：의사예요。' },
          { id: 'copula-arrange', type: 'arrange', prompt: '把词块排成“我是学生”。', blocks: ['학생이에요', '저는'], answer: ['저는', '학생이에요'], explanation: '韩语的基本顺序是“主题 + 说明”：저는 학생이에요。' },
        ],
      },
      {
        id: 'greeting-dialogue',
        title: '完成第一次见面',
        subtitle: 'Dialogue · Output',
        minutes: 4,
        objective: '读懂一段原创初见对话，并完成自我介绍。',
        dialogue: [
          { speaker: '서윤', ko: '안녕하세요? 저는 서윤이에요.', zh: '您好，我叫书允。' },
          { speaker: '민준', ko: '안녕하세요? 저는 민준이에요.', zh: '您好，我叫敏俊。' },
          { speaker: '서윤', ko: '만나서 반갑습니다.', zh: '很高兴见到您。' },
          { speaker: '민준', ko: '네, 반갑습니다.', zh: '是的，我也很高兴见到您。' },
        ],
        activities: [
          { id: 'dialogue-comprehension', type: 'choice', prompt: '서윤 和 민준 正在做什么？', choices: ['第一次互相介绍', '在餐厅点餐', '讨论周末计划'], answer: '第一次互相介绍', explanation: '两人使用 안녕하세요、저는…이에요 和 반갑습니다，构成了完整的初次见面情境。' },
          { id: 'self-intro-arrange', type: 'arrange', prompt: '替换成你的名字前，先排好句子结构。', blocks: ['저는', '지민이에요'], answer: ['저는', '지민이에요'], explanation: '저는 + 名字 + 이에요/예요。你的名字是否有收音，会决定使用哪一个词尾。' },
        ],
      },
    ],
  },
  {
    id: 'objects-demonstratives',
    sequence: 2,
    title: '这是什么？',
    titleKo: '이것은 뭐예요?',
    theme: '辨认身边物品并询问名称',
    description: '学会区分 이것、그것、저것，并用 뭐예요 提出第一个真实问题。',
    textbookAlignment: '新延世韩国语初级 1-1 · 物品主题及初级问答能力对齐；内容与练习为 Marginalia 原创。',
    topikSkills: ['指示词', '物品词汇', '基础问答'],
    sessions: [
      {
        id: 'object-words',
        title: '距离决定用哪个“这个”',
        subtitle: 'Words',
        minutes: 4,
        objective: '根据说话人与听话人的距离选择 이것、그것、저것。',
        words: [
          { id: 'igeot', hangul: '이것', meaning: '这个', note: '靠近说话人的物品。', example: '이것은 책이에요.', exampleZh: '这个是书。' },
          { id: 'geugeot', hangul: '그것', meaning: '那个', note: '靠近听话人，或双方刚提到的物品。', example: '그것은 가방이에요?', exampleZh: '那个是包吗？' },
          { id: 'jeogeot', hangul: '저것', meaning: '那个（远处）', note: '离说话人和听话人都比较远。', example: '저것은 학교예요.', exampleZh: '远处那个是学校。' },
          { id: 'chaek', hangul: '책', meaning: '书', note: '末尾有收音 ㄱ。', example: '한국어 책이에요.', exampleZh: '是韩语书。' },
          { id: 'gabang', hangul: '가방', meaning: '包', note: '末尾有收音 ㅇ。', example: '가방이 커요.', exampleZh: '包很大。' },
          { id: 'mwo', hangul: '뭐', meaning: '什么', note: '무엇 的常用口语缩略形式。', example: '이것은 뭐예요?', exampleZh: '这是什么？' },
        ],
        activities: [
          { id: 'object-distance', type: 'choice', prompt: '物品就在你手里，应该用哪个词？', choices: ['이것', '그것', '저것'], answer: '이것', explanation: '靠近说话人的物品用 이것。' },
        ],
      },
      {
        id: 'object-grammar',
        title: '提出“这是什么？”',
        subtitle: 'Grammar',
        minutes: 4,
        objective: '使用 이것은 뭐예요? 和 명사예요/이에요 完成问答。',
        grammar: {
          title: 'N은/는 뭐예요?',
          rule: '은/는 标记正在谈论的主题。有收音接 은，无收音接 는。回答继续使用 이에요/예요。',
          examples: [
            { ko: '이것은 뭐예요?', zh: '这是什么？' },
            { ko: '책이에요.', zh: '是书。' },
          ],
          mistake: '이것 本身以收音 ㅅ 结尾，因此是 이것은，不是 이것는。',
        },
        activities: [
          { id: 'topic-choice', type: 'choice', prompt: '가방___ 뭐예요? 应该选择？', choices: ['은', '는', '이'], answer: '은', explanation: '가방 最后有收音 ㅇ，所以主题助词使用 은：가방은 뭐예요?' },
        ],
      },
      {
        id: 'object-dialogue',
        title: '在教室里问物品',
        subtitle: 'Dialogue · Output',
        minutes: 3,
        objective: '读懂物品问答，并组合一个完整问题。',
        dialogue: [
          { speaker: '리나', ko: '이것은 뭐예요?', zh: '这是什么？' },
          { speaker: '도윤', ko: '한국어 책이에요.', zh: '是韩语书。' },
          { speaker: '리나', ko: '그것은 우산이에요?', zh: '你那边那个是雨伞吗？' },
          { speaker: '도윤', ko: '아니요, 가방이에요.', zh: '不是，是包。' },
        ],
        activities: [
          { id: 'object-arrange', type: 'arrange', prompt: '排成“这个是什么？”', blocks: ['뭐예요?', '이것은'], answer: ['이것은', '뭐예요?'], explanation: '先提出主题 이것은，再询问 뭐예요?' },
        ],
      },
    ],
  },
  {
    id: 'school-locations', sequence: 3, title: '我在学校', titleKo: '학교에 있어요', theme: '说明人和物品所在的位置',
    description: '把教室、图书馆等校园地点连成真实路线，并学会说“在哪里”。',
    textbookAlignment: '新延世韩国语初级 1-1 · 学校生活与位置表达主题对齐；内容与练习为 Marginalia 原创。',
    topikSkills: ['场所词汇', '位置助词', '信息定位'],
    sessions: [
      { id: 'school-words', title: '认识校园里的位置', subtitle: 'Words', minutes: 5, objective: '认读 6 个校园与位置高频词。', words: [
        { id: 'hakgyo', hangul: '학교', meaning: '学校', note: '장소（场所）名词。', example: '학교에 가요.', exampleZh: '去学校。' },
        { id: 'gyosil', hangul: '교실', meaning: '教室', note: '교（教学）+ 실（室）。', example: '교실에 있어요.', exampleZh: '在教室里。' },
        { id: 'doseogwan', hangul: '도서관', meaning: '图书馆', note: '末尾有收音 ㄴ。', example: '도서관에서 공부해요.', exampleZh: '在图书馆学习。' },
        { id: 'seonsaengnim', hangul: '선생님', meaning: '老师', note: '님 表示尊敬。', example: '선생님이 교실에 있어요.', exampleZh: '老师在教室。' },
        { id: 'chingu', hangul: '친구', meaning: '朋友', note: '没有性别区分。', example: '친구는 도서관에 있어요.', exampleZh: '朋友在图书馆。' },
        { id: 'itda', hangul: '있다', meaning: '有；在', note: '礼貌体常用 있어요。', example: '책이 있어요.', exampleZh: '有书。' },
      ], activities: [
        { id: 'school-place-listen', type: 'listen', prompt: '听声音，选择地点。', speech: '도서관', choices: ['도서관', '교실', '학교'], answer: '도서관', explanation: '도서관 是图书馆，注意中间的 서。' },
        { id: 'school-place-choice', type: 'choice', prompt: '“老师在教室”中，哪个词表示教室？', choices: ['교실', '학교', '친구'], answer: '교실', explanation: '교실 是教室；학교 是学校。' },
      ] },
      { id: 'school-grammar', title: '说清楚“在哪里”', subtitle: 'Grammar', minutes: 5, objective: '使用 N에 있어요 表示静态位置。', grammar: {
        title: '场所 + 에 있어요', rule: '에 标记存在的位置；이/가 标记“谁或什么”在那里。基本结构是 N이/가 장소에 있어요。',
        examples: [{ ko: '민지가 교실에 있어요.', zh: '敏智在教室里。' }, { ko: '책이 가방에 있어요.', zh: '书在包里。' }],
        mistake: '表示静态位置时使用 에；에서 更常标记动作发生的地点，例如 도서관에서 공부해요。',
      }, activities: [
        { id: 'school-particle', type: 'choice', prompt: '책이 가방___ 있어요。', choices: ['에', '에서', '를'], answer: '에', explanation: '있어요 描述存在位置，所以用 에。' },
        { id: 'school-arrange', type: 'arrange', prompt: '排成“朋友在图书馆”。', blocks: ['도서관에', '친구가', '있어요'], answer: ['친구가', '도서관에', '있어요'], explanation: '谁 + 在哪里 + 在：친구가 도서관에 있어요。' },
      ] },
      { id: 'school-dialogue', title: '问到朋友的位置', subtitle: 'Dialogue · Output', minutes: 4, objective: '读懂一个校园寻人对话。', dialogue: [
        { speaker: '수아', ko: '민수 씨가 어디에 있어요?', zh: '民秀在哪里？' }, { speaker: '유진', ko: '도서관에 있어요.', zh: '在图书馆。' },
        { speaker: '수아', ko: '선생님도 도서관에 있어요?', zh: '老师也在图书馆吗？' }, { speaker: '유진', ko: '아니요, 선생님은 교실에 있어요.', zh: '不是，老师在教室。' },
      ], activities: [
        { id: 'school-dialogue-check', type: 'choice', prompt: '谁在教室？', choices: ['민수', '선생님', '수아'], answer: '선생님', explanation: '最后一句明确说 선생님은 교실에 있어요。' },
      ] },
    ],
  },
  {
    id: 'friends-description', sequence: 4, title: '介绍我的朋友', titleKo: '제 친구예요', theme: '描述一个人的性格和共同活动',
    description: '从“是谁”走向“是什么样的人”，同时练习自然的主题转换。',
    textbookAlignment: '新延世韩国语初级 1-1 · 朋友与人物描述主题对齐；内容与练习为 Marginalia 原创。',
    topikSkills: ['人物描述', '形容词礼貌体', '主题对比'],
    sessions: [
      { id: 'friend-words', title: '说出一个人的样子', subtitle: 'Words', minutes: 5, objective: '掌握 6 个描述朋友与相处方式的词。', words: [
        { id: 'chinjeolhada', hangul: '친절하다', meaning: '亲切；友善', note: '礼貌体为 친절해요。', example: '제 친구는 친절해요.', exampleZh: '我的朋友很亲切。' },
        { id: 'jaemiitda', hangul: '재미있다', meaning: '有趣', note: '常描述人、故事或活动。', example: '수업이 재미있어요.', exampleZh: '课很有趣。' },
        { id: 'johahada', hangul: '좋아하다', meaning: '喜欢', note: '喜欢的对象通常用 을/를。', example: '음악을 좋아해요.', exampleZh: '喜欢音乐。' },
        { id: 'gachi', hangul: '같이', meaning: '一起', note: '自然发音接近 가치。', example: '같이 공부해요.', exampleZh: '一起学习。' },
        { id: 'undong', hangul: '운동', meaning: '运动', note: '운동하다 表示做运动。', example: '주말에 운동해요.', exampleZh: '周末运动。' },
        { id: 'eumak', hangul: '음악', meaning: '音乐', note: '末尾有收音 ㄱ。', example: '한국 음악을 들어요.', exampleZh: '听韩国音乐。' },
      ], activities: [
        { id: 'friend-word-listen', type: 'listen', prompt: '听声音，选择“亲切”。', speech: '친절해요', choices: ['친절해요', '재미있어요', '좋아해요'], answer: '친절해요', explanation: '친절해요 来自 친절하다。' },
      ] },
      { id: 'friend-grammar', title: '从主题到描述', subtitle: 'Grammar', minutes: 5, objective: '用 은/는 引出人物，并把 하다 形容词变成 해요。', grammar: {
        title: 'N은/는 + A아요/어요', rule: '은/는 把人物设为谈论主题。하다 结尾的形容词在礼貌口语中通常变成 해요。',
        examples: [{ ko: '제 친구는 친절해요.', zh: '我的朋友很亲切。' }, { ko: '민수는 재미있어요.', zh: '民秀很有趣。' }],
        mistake: '친절하다 不能直接放在礼貌句末；日常礼貌表达使用 친절해요。',
      }, activities: [
        { id: 'friend-ending', type: 'choice', prompt: '친절하다 的礼貌口语形式是？', choices: ['친절해요', '친절이에요', '친절아요'], answer: '친절해요', explanation: '하다 变为 해요：친절해요。' },
        { id: 'friend-arrange', type: 'arrange', prompt: '排成“我的朋友很有趣”。', blocks: ['재미있어요', '제 친구는'], answer: ['제 친구는', '재미있어요'], explanation: '先提出主题，再描述：제 친구는 재미있어요。' },
      ] },
      { id: 'friend-dialogue', title: '把朋友介绍给别人', subtitle: 'Dialogue · Output', minutes: 4, objective: '从对话中提取人物特点与共同爱好。', dialogue: [
        { speaker: '하나', ko: '이 사람은 누구예요?', zh: '这个人是谁？' }, { speaker: '준호', ko: '제 친구 지수예요.', zh: '是我的朋友智秀。' },
        { speaker: '하나', ko: '지수 씨는 어때요?', zh: '智秀怎么样？' }, { speaker: '준호', ko: '친절하고 재미있어요. 같이 음악을 들어요.', zh: '她亲切又有趣。我们一起听音乐。' },
      ], activities: [
        { id: 'friend-dialogue-check', type: 'choice', prompt: '준호 和 지수 一起做什么？', choices: ['听音乐', '去学校', '喝咖啡'], answer: '听音乐', explanation: '같이 음악을 들어요 表示“一起听音乐”。' },
      ] },
    ],
  },
  {
    id: 'food-ordering', sequence: 5, title: '请给我一份拌饭', titleKo: '비빔밥 주세요', theme: '在餐厅看懂菜单并完成点餐',
    description: '把食物名称、数量和礼貌请求组合成一次可以直接使用的点餐。',
    textbookAlignment: '新延世韩国语初级 1-1 · 饮食与餐厅交际主题对齐；内容与练习为 Marginalia 原创。',
    topikSkills: ['饮食词汇', '礼貌请求', '听取价格'],
    sessions: [
      { id: 'food-words', title: '先看懂菜单', subtitle: 'Words', minutes: 5, objective: '掌握 6 个点餐高频词。', words: [
        { id: 'bibimbap', hangul: '비빔밥', meaning: '拌饭', note: '밥 是饭；末尾有收音 ㅂ。', example: '비빔밥을 먹어요.', exampleZh: '吃拌饭。' },
        { id: 'mul', hangul: '물', meaning: '水', note: '常用请求：물 주세요。', example: '물 한 잔 주세요.', exampleZh: '请给我一杯水。' },
        { id: 'keopi', hangul: '커피', meaning: '咖啡', note: '外来词。', example: '커피를 마셔요.', exampleZh: '喝咖啡。' },
        { id: 'masitda', hangul: '맛있다', meaning: '好吃', note: '礼貌体 맛있어요。', example: '김치가 맛있어요.', exampleZh: '泡菜很好吃。' },
        { id: 'meokda', hangul: '먹다', meaning: '吃', note: '礼貌体 먹어요。', example: '점심을 먹어요.', exampleZh: '吃午饭。' },
        { id: 'juseyo', hangul: '주세요', meaning: '请给我', note: '名词后直接接 주세요 可礼貌索取。', example: '메뉴 주세요.', exampleZh: '请给我菜单。' },
      ], activities: [
        { id: 'food-listen', type: 'listen', prompt: '听声音，顾客点了什么？', speech: '비빔밥 주세요', choices: ['拌饭', '水', '咖啡'], answer: '拌饭', explanation: '비빔밥 是拌饭，주세요 表示“请给我”。' },
      ] },
      { id: 'food-grammar', title: '礼貌地提出请求', subtitle: 'Grammar', minutes: 5, objective: '用 N 주세요 点单，用 N하고 N 连接两样东西。', grammar: {
        title: 'N 주세요 / N하고 N', rule: '名词后接 주세요 表示“请给我……”。하고 在名词之间表示“和”，适合口语列举。',
        examples: [{ ko: '비빔밥 주세요.', zh: '请给我一份拌饭。' }, { ko: '물하고 커피 주세요.', zh: '请给我水和咖啡。' }],
        mistake: '주세요 本身已经礼貌，不需要再加 이에요。点餐说 비빔밥 주세요，而不是 비빔밥이에요 주세요。',
      }, activities: [
        { id: 'food-request', type: 'choice', prompt: '想要一杯咖啡，哪句最自然？', choices: ['커피 주세요.', '커피 있어요.', '커피예요.'], answer: '커피 주세요.', explanation: '点单或索取物品使用 N 주세요。' },
        { id: 'food-arrange', type: 'arrange', prompt: '排成“请给我水和咖啡”。', blocks: ['주세요', '물하고', '커피'], answer: ['물하고', '커피', '주세요'], explanation: '列举的物品放在 주세요 前：물하고 커피 주세요。' },
      ] },
      { id: 'food-dialogue', title: '完成一次点餐', subtitle: 'Dialogue · Output', minutes: 4, objective: '读懂点餐、确认与评价。', dialogue: [
        { speaker: '직원', ko: '어서 오세요. 뭐 드릴까요?', zh: '欢迎光临。请问要什么？' }, { speaker: '손님', ko: '비빔밥하고 물 주세요.', zh: '请给我拌饭和水。' },
        { speaker: '직원', ko: '네, 잠시만 기다리세요.', zh: '好的，请稍等。' }, { speaker: '손님', ko: '비빔밥이 정말 맛있어요.', zh: '拌饭真的很好吃。' },
      ], activities: [
        { id: 'food-dialogue-check', type: 'choice', prompt: '顾客没有点什么？', choices: ['咖啡', '拌饭', '水'], answer: '咖啡', explanation: '顾客说 비빔밥하고 물 주세요，没有点 커피。' },
      ] },
    ],
  },
  {
    id: 'daily-routine', sequence: 6, title: '我的一天', titleKo: '나의 하루', theme: '用时间顺序描述日常生活',
    description: '把起床、学习、休息等动作放到一天的时间线上，建立第一个连续叙述。',
    textbookAlignment: '新延世韩国语初级 1-1 · 日常生活与时间表达主题对齐；内容与练习为 Marginalia 原创。',
    topikSkills: ['日常动词', '时间助词', '顺序理解'],
    sessions: [
      { id: 'routine-words', title: '把一天拆成动作', subtitle: 'Words', minutes: 5, objective: '掌握 6 个日常活动动词。', words: [
        { id: 'ireonada', hangul: '일어나다', meaning: '起床', note: '礼貌体 일어나요。', example: '일곱 시에 일어나요.', exampleZh: '七点起床。' },
        { id: 'gongbuhada', hangul: '공부하다', meaning: '学习', note: '하다 动词，礼貌体 공부해요。', example: '오전에 공부해요.', exampleZh: '上午学习。' },
        { id: 'ilhada', hangul: '일하다', meaning: '工作', note: '일 是工作，하다 是做。', example: '회사에서 일해요.', exampleZh: '在公司工作。' },
        { id: 'swida', hangul: '쉬다', meaning: '休息', note: '礼貌体 쉬어요。', example: '집에서 쉬어요.', exampleZh: '在家休息。' },
        { id: 'jada', hangul: '자다', meaning: '睡觉', note: '礼貌体 자요。', example: '열한 시에 자요.', exampleZh: '十一点睡觉。' },
        { id: 'achim', hangul: '아침', meaning: '早晨；早餐', note: '语境决定含义。', example: '아침을 먹어요.', exampleZh: '吃早餐。' },
      ], activities: [
        { id: 'routine-listen', type: 'listen', prompt: '听声音，选择动作。', speech: '일곱 시에 일어나요', choices: ['七点起床', '七点学习', '七点睡觉'], answer: '七点起床', explanation: '일어나다 表示起床；일곱 시 是七点。' },
      ] },
      { id: 'routine-grammar', title: '给动作加上时间', subtitle: 'Grammar', minutes: 5, objective: '用时间 + 에 和动词 아요/어요 描述日常。', grammar: {
        title: '时间 + 에 / V아요·어요', rule: '에 可标记动作发生的具体时间。动词词干按元音变化接 아요/어요；하다 变为 해요。',
        examples: [{ ko: '아침 여덟 시에 공부해요.', zh: '早上八点学习。' }, { ko: '밤 열한 시에 자요.', zh: '晚上十一点睡觉。' }],
        mistake: '오늘、내일、어제 后通常不加 에；但具体钟点如 일곱 시 后使用 에。',
      }, activities: [
        { id: 'routine-time', type: 'choice', prompt: '아침 일곱 시___ 일어나요。', choices: ['에', '에서', '를'], answer: '에', explanation: '具体时间后用 에。' },
        { id: 'routine-arrange', type: 'arrange', prompt: '排成“晚上十一点睡觉”。', blocks: ['자요', '밤 열한 시에'], answer: ['밤 열한 시에', '자요'], explanation: '时间通常放在动词前：밤 열한 시에 자요。' },
      ] },
      { id: 'routine-dialogue', title: '读懂一条生活时间线', subtitle: 'Dialogue · Output', minutes: 4, objective: '根据对话还原一天的顺序。', dialogue: [
        { speaker: '유나', ko: '보통 몇 시에 일어나요?', zh: '一般几点起床？' }, { speaker: '도현', ko: '일곱 시에 일어나요. 오전에는 공부해요.', zh: '七点起床。上午学习。' },
        { speaker: '유나', ko: '저녁에는 뭐 해요?', zh: '晚上做什么？' }, { speaker: '도현', ko: '운동하고 집에서 쉬어요.', zh: '运动，然后在家休息。' },
      ], activities: [
        { id: 'routine-order', type: 'choice', prompt: '도현 上午做什么？', choices: ['学习', '运动', '休息'], answer: '学习', explanation: '오전에는 공부해요 表示“上午学习”。' },
      ] },
    ],
  },
  ...monthlyKoreanLessons,
])

export const stageZeroQuestions = [
  { id: 'compose-ga', skill: '音节组合', prompt: 'ㄱ 和 ㅏ 组合成哪个音节？', choices: ['가', '거', '고'], answer: '가', explanation: '辅音 ㄱ 放在左侧，元音 ㅏ 放在右侧，组合成 가。' },
  { id: 'listen-gwaenchanayo', skill: '声音 → 韩文', prompt: '播放声音后，选择你听到的表达。', speech: '괜찮아요', choices: ['괜찮아요', '감사해요', '안녕하세요'], answer: '괜찮아요', explanation: '괜찮아요 表示“没关系／还好吗／可以”，拼写中包含复合元音 ㅙ。' },
  { id: 'batchim-guk', skill: '收音', prompt: '哪个音节含有收音（받침）？', choices: ['가', '구', '국'], answer: '국', explanation: '국 的下方有终声 ㄱ；가、구 都是开放音节。' },
  { id: 'liaison', skill: '连音', prompt: '한국어 在自然语流中更接近哪一种切分？', choices: ['한-구-거', '한-국-어', '하-누-거'], answer: '한-구-거', explanation: '국 的收音 ㄱ 遇到后面以元音开始的 어，会连到下一音节，听起来接近 구거；拼写仍是 한국어。' },
] as const
