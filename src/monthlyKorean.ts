import type { KoreanLesson } from './koreanContent'

type KoreanSeed = {
  id: string
  title: string
  titleKo: string
  theme: string
  words: [string, string][]
  grammar: string
  rule: string
  exampleKo: string
  exampleZh: string
  askKo: string
  askZh: string
  answerKo: string
  answerZh: string
}

const seeds: KoreanSeed[] = [
  { id: 'home-family', title: '我的家人', titleKo: '우리 가족', theme: '介绍家庭成员与人数', words: [['가족', '家人'], ['부모님', '父母'], ['언니', '姐姐（女性称）'], ['동생', '弟弟或妹妹']], grammar: 'N이/가 있어요', rule: '用 이/가 있어요 表示“有……”。名词有收音接 이，无收音接 가。', exampleKo: '저는 동생이 있어요.', exampleZh: '我有弟弟或妹妹。', askKo: '가족이 몇 명이에요?', askZh: '家里有几口人？', answerKo: '네 명이에요.', answerZh: '四口人。' },
  { id: 'home-rooms', title: '我的房间', titleKo: '제 방', theme: '描述住宅与家具位置', words: [['방', '房间'], ['부엌', '厨房'], ['창문', '窗户'], ['책상', '书桌']], grammar: 'N 위/아래/옆에', rule: '位置名词放在物品后：책상 위에 表示“在书桌上”。', exampleKo: '책이 책상 위에 있어요.', exampleZh: '书在桌子上。', askKo: '가방이 어디에 있어요?', askZh: '包在哪里？', answerKo: '의자 옆에 있어요.', answerZh: '在椅子旁边。' },
  { id: 'weather-today', title: '今天天气怎么样？', titleKo: '오늘 날씨가 어때요?', theme: '谈论天气与体感', words: [['날씨', '天气'], ['맑다', '晴朗'], ['비', '雨'], ['춥다', '冷']], grammar: 'A아요/어요', rule: '形容词词干接 아요/어요构成礼貌体；ㅂ 不规则会发生变化。', exampleKo: '오늘은 추워요.', exampleZh: '今天很冷。', askKo: '오늘 날씨가 어때요?', askZh: '今天天气怎么样？', answerKo: '맑지만 조금 추워요.', answerZh: '晴朗，但是有点冷。' },
  { id: 'clothes-choice', title: '穿什么？', titleKo: '뭐 입어요?', theme: '选择衣服并描述颜色', words: [['옷', '衣服'], ['바지', '裤子'], ['치마', '裙子'], ['파란색', '蓝色']], grammar: 'N을/를 입어요', rule: '穿衣物使用 입다；宾语有收音接 을，无收音接 를。', exampleKo: '파란색 바지를 입어요.', exampleZh: '穿蓝色裤子。', askKo: '오늘 뭐 입어요?', askZh: '今天穿什么？', answerKo: '검은색 치마를 입어요.', answerZh: '穿黑色裙子。' },
  { id: 'shopping-price', title: '这个多少钱？', titleKo: '이거 얼마예요?', theme: '询问价格并购买商品', words: [['가게', '商店'], ['가격', '价格'], ['원', '韩元'], ['싸다', '便宜']], grammar: '얼마예요?', rule: '用 N은/는 얼마예요? 询问价格，回答数字 + 원이에요。', exampleKo: '이 가방은 삼만 원이에요.', exampleZh: '这个包三万韩元。', askKo: '이거 얼마예요?', askZh: '这个多少钱？', answerKo: '만 이천 원이에요.', answerZh: '一万两千韩元。' },
  { id: 'shopping-count', title: '请给我两个', titleKo: '두 개 주세요', theme: '使用固有数词与量词购物', words: [['하나', '一个'], ['둘', '两个'], ['개', '个'], ['병', '瓶']], grammar: '固有数词 + 量词', rule: '하나、둘、셋、넷 在量词前变为 한、두、세、네。', exampleKo: '사과 두 개 주세요.', exampleZh: '请给我两个苹果。', askKo: '물을 몇 병 드릴까요?', askZh: '要几瓶水？', answerKo: '두 병 주세요.', answerZh: '请给我两瓶。' },
  { id: 'transportation', title: '坐地铁去', titleKo: '지하철로 가요', theme: '说明交通方式', words: [['버스', '公交车'], ['지하철', '地铁'], ['택시', '出租车'], ['걷다', '走路']], grammar: 'N(으)로 가요', rule: '交通工具后接 (으)로 表示“乘坐／通过……去”。', exampleKo: '학교에 버스로 가요.', exampleZh: '坐公交去学校。', askKo: '회사에 어떻게 가요?', askZh: '怎么去公司？', answerKo: '지하철로 가요.', answerZh: '坐地铁去。' },
  { id: 'directions', title: '一直往前走', titleKo: '쭉 가세요', theme: '问路并理解方向指令', words: [['길', '路'], ['왼쪽', '左边'], ['오른쪽', '右边'], ['앞', '前面']], grammar: 'V(으)세요', rule: '用 (으)세요 礼貌地给出指令或请求。', exampleKo: '오른쪽으로 가세요.', exampleZh: '请往右走。', askKo: '은행이 어디에 있어요?', askZh: '银行在哪里？', answerKo: '쭉 가서 왼쪽으로 가세요.', answerZh: '一直走，然后往左。' },
  { id: 'calendar-date', title: '今天几月几号？', titleKo: '오늘이 몇 월 며칠이에요?', theme: '表达日期与星期', words: [['월', '月'], ['일', '日'], ['요일', '星期'], ['오늘', '今天']], grammar: '汉字数词 + 월/일', rule: '月份和日期通常使用汉字数词；六月和十月读作 유월、시월。', exampleKo: '오늘은 오월 십일이에요.', exampleZh: '今天是五月十一日。', askKo: '시험이 언제예요?', askZh: '考试什么时候？', answerKo: '유월 이십 일이에요.', answerZh: '六月二十日。' },
  { id: 'appointment-time', title: '三点见', titleKo: '세 시에 만나요', theme: '约定时间与地点', words: [['약속', '约定'], ['시간', '时间'], ['만나다', '见面'], ['늦다', '迟到']], grammar: '时间에 만나요', rule: '具体时间后用 에，见面地点也可用 에서。', exampleKo: '세 시에 카페에서 만나요.', exampleZh: '三点在咖啡馆见。', askKo: '몇 시에 만날까요?', askZh: '几点见？', answerKo: '오후 세 시에 만나요.', answerZh: '下午三点见。' },
  { id: 'weekend-plan', title: '周末打算做什么？', titleKo: '주말에 뭐 할 거예요?', theme: '谈论近期计划', words: [['주말', '周末'], ['계획', '计划'], ['여행', '旅行'], ['영화', '电影']], grammar: 'V(으)ㄹ 거예요', rule: '动词词干后接 (으)ㄹ 거예요 表达计划或预测。', exampleKo: '주말에 영화를 볼 거예요.', exampleZh: '周末打算看电影。', askKo: '주말에 뭐 할 거예요?', askZh: '周末打算做什么？', answerKo: '친구하고 여행할 거예요.', answerZh: '打算和朋友旅行。' },
  { id: 'past-day', title: '昨天做了什么？', titleKo: '어제 뭐 했어요?', theme: '描述已经发生的事情', words: [['어제', '昨天'], ['지난주', '上周'], ['보다', '看'], ['만들다', '制作']], grammar: 'V았/었어요', rule: '动词词干接 았/었어요 表示过去；하다 变为 했어요。', exampleKo: '어제 영화를 봤어요.', exampleZh: '昨天看了电影。', askKo: '어제 뭐 했어요?', askZh: '昨天做了什么？', answerKo: '집에서 요리했어요.', answerZh: '在家做饭了。' },
  { id: 'travel-station', title: '在车站', titleKo: '기차역에서', theme: '购买车票与确认站台', words: [['기차역', '火车站'], ['표', '票'], ['출발', '出发'], ['도착', '到达']], grammar: 'N행 표', rule: '地点 + 행 表示“开往……”，与 표 组合表达车票。', exampleKo: '부산행 표 한 장 주세요.', exampleZh: '请给我一张去釜山的票。', askKo: '서울행 기차는 몇 시예요?', askZh: '去首尔的火车几点？', answerKo: '열 시에 출발해요.', answerZh: '十点出发。' },
  { id: 'travel-hotel', title: '办理入住', titleKo: '체크인할게요', theme: '在酒店确认预订', words: [['예약', '预订'], ['호텔', '酒店'], ['열쇠', '钥匙'], ['방', '房间']], grammar: 'V(으)ㄹ게요', rule: '说话人当场作出意愿或承诺时使用 (으)ㄹ게요。', exampleKo: '지금 체크인할게요.', exampleZh: '我现在办理入住。', askKo: '예약하셨어요?', askZh: '您预订了吗？', answerKo: '네, 제 이름으로 예약했어요.', answerZh: '是的，用我的名字预订了。' },
  { id: 'health-symptom', title: '哪里不舒服？', titleKo: '어디가 아파요?', theme: '描述常见身体不适', words: [['머리', '头'], ['배', '肚子'], ['감기', '感冒'], ['아프다', '疼；不舒服']], grammar: 'N이/가 아파요', rule: '身体部位用 이/가 标记，再接 아파요。', exampleKo: '머리가 아파요.', exampleZh: '头疼。', askKo: '어디가 아파요?', askZh: '哪里不舒服？', answerKo: '배가 아프고 열이 나요.', answerZh: '肚子疼，而且发烧。' },
  { id: 'pharmacy', title: '请饭后服用', titleKo: '식후에 드세요', theme: '理解药店与用药说明', words: [['약', '药'], ['식후', '饭后'], ['하루', '一天'], ['번', '次']], grammar: '次数 + V(으)세요', rule: '用 하루에 N번 表示一天几次，并用 (으)세요 给出礼貌说明。', exampleKo: '하루에 두 번 드세요.', exampleZh: '请一天服用两次。', askKo: '이 약은 언제 먹어요?', askZh: '这个药什么时候吃？', answerKo: '식후에 드세요.', answerZh: '请饭后服用。' },
  { id: 'phone-message', title: '请给我留言', titleKo: '메시지를 남겨 주세요', theme: '打电话与转达信息', words: [['전화', '电话'], ['메시지', '留言'], ['번호', '号码'], ['연락하다', '联系']], grammar: 'V아/어 주세요', rule: '动词后接 아/어 주세요，礼貌请求对方做某事。', exampleKo: '다시 전화해 주세요.', exampleZh: '请再打电话。', askKo: '민지 씨 있어요?', askZh: '敏智在吗？', answerKo: '지금 없어요. 메시지를 남겨 주세요.', answerZh: '现在不在，请留言。' },
  { id: 'hobby-frequency', title: '我常常画画', titleKo: '자주 그림을 그려요', theme: '介绍爱好与频率', words: [['취미', '爱好'], ['그림', '画'], ['자주', '经常'], ['가끔', '偶尔']], grammar: '频率副词 + V', rule: '자주、가끔、별로 等频率副词通常放在动词前。', exampleKo: '저는 가끔 그림을 그려요.', exampleZh: '我偶尔画画。', askKo: '취미가 뭐예요?', askZh: '你的爱好是什么？', answerKo: '사진 찍기예요. 주말에 자주 찍어요.', answerZh: '是摄影。周末经常拍。' },
  { id: 'chores', title: '一起做家务', titleKo: '같이 집안일해요', theme: '分配家务与顺序', words: [['청소', '打扫'], ['빨래', '洗衣'], ['설거지', '洗碗'], ['먼저', '先']], grammar: 'V고 V', rule: '连接两个连续或并列动作时，可在前一个动词词干后接 고。', exampleKo: '청소하고 빨래해요.', exampleZh: '打扫并洗衣服。', askKo: '먼저 뭐 할까요?', askZh: '先做什么？', answerKo: '청소하고 설거지해요.', answerZh: '先打扫，然后洗碗。' },
  { id: 'seasons', title: '我喜欢春天', titleKo: '봄을 좋아해요', theme: '比较季节与天气', words: [['봄', '春天'], ['여름', '夏天'], ['가을', '秋天'], ['겨울', '冬天']], grammar: 'N보다 더', rule: 'N보다 더 表示“比 N 更……”。', exampleKo: '봄이 겨울보다 더 따뜻해요.', exampleZh: '春天比冬天更暖和。', askKo: '어떤 계절을 좋아해요?', askZh: '喜欢哪个季节？', answerKo: '가을을 제일 좋아해요.', answerZh: '最喜欢秋天。' },
  { id: 'invitation', title: '一起去吧', titleKo: '같이 갈까요?', theme: '发出邀请并回应', words: [['같이', '一起'], ['공연', '演出'], ['시간', '时间'], ['괜찮다', '可以；没关系']], grammar: 'V(으)ㄹ까요? → 좋아요', rule: '用 (으)ㄹ까요? 温和地征求意见或发出邀请；可用 좋아요. 같이 가요/갑시다. 接受，也可先说 미안해요 再婉拒。', exampleKo: '같이 갈까요? 좋아요. 같이 가요.', exampleZh: '要一起去吗？好啊，一起去。', askKo: '오늘 공연을 볼까요?', askZh: '今天看演出吗？', answerKo: '좋아요. 같이 가요.', answerZh: '好啊，一起去。' },
  { id: 'reason-because', title: '因为下雨', titleKo: '비가 와서', theme: '说明原因与结果', words: [['이유', '理由'], ['비', '雨'], ['그래서', '所以'], ['우산', '雨伞']], grammar: 'V/A아서·어서', rule: '用 아서/어서连接自然原因与结果；命令和建议常需使用其他表达。', exampleKo: '비가 와서 집에 있어요.', exampleZh: '因为下雨，所以在家。', askKo: '왜 늦었어요?', askZh: '为什么迟到了？', answerKo: '버스가 늦게 와서 늦었어요.', answerZh: '因为公交来晚了，所以迟到了。' },
  { id: 'experience', title: '去过济州岛', titleKo: '제주도에 가 봤어요', theme: '谈论尝试与经历', words: [['경험', '经历'], ['여행하다', '旅行'], ['먹어 보다', '试着吃'], ['가 보다', '去过；试着去']], grammar: 'V아/어 보다', rule: '动词后接 아/어 보다 表示尝试；过去式 봤어요 常表达经历。', exampleKo: '한복을 입어 봤어요.', exampleZh: '穿过韩服。', askKo: '제주도에 가 봤어요?', askZh: '去过济州岛吗？', answerKo: '네, 두 번 가 봤어요.', answerZh: '去过两次。' },
  { id: 'goals', title: '今年的目标', titleKo: '올해의 목표', theme: '表达目标与决心', words: [['목표', '目标'], ['올해', '今年'], ['매일', '每天'], ['계속', '继续']], grammar: 'V기로 하다', rule: '用 V기로 하다 表示作出决定或约定。', exampleKo: '매일 한국어를 공부하기로 했어요.', exampleZh: '决定每天学韩语。', askKo: '올해 목표가 뭐예요?', askZh: '今年的目标是什么？', answerKo: '매일 일기를 쓰기로 했어요.', answerZh: '决定每天写日记。' },
]

function buildLesson(seed: KoreanSeed, index: number): KoreanLesson {
  const sequence = index + 7
  const wordChoices = seed.words.map(([, meaning]) => meaning)
  const words = seed.words.map(([hangul, meaning], wordIndex) => ({
    id: `${seed.id}-word-${wordIndex + 1}`, hangul, meaning,
    note: `第 ${sequence} 课核心表达；先认读，再放回情境。`,
    example: `오늘 “${hangul}” 표현을 배워요.`, exampleZh: `今天学习“${meaning}”这个表达。`,
  }))
  return {
    id: seed.id, sequence, title: seed.title, titleKo: seed.titleKo, theme: seed.theme,
    description: `${seed.theme}，完成理解、句型判断与情境输出。`,
    textbookAlignment: `新延世韩国语初级 1-1/1-2 · ${seed.theme}主题与初级交际目标对齐；内容与练习为 Marginalia 原创。`,
    topikSkills: ['主题词汇', '语法判断', '情境理解'],
    sessions: [
      { id: `${seed.id}-words`, title: '先认识情境里的词', subtitle: 'Words', minutes: 5, objective: `认读与${seed.theme}有关的四个核心词。`, words, dialogue: [], activities: [
        { id: `${seed.id}-word-check`, type: 'choice', prompt: `“${seed.words[0][0]}”是什么意思？`, choices: wordChoices, answer: seed.words[0][1], explanation: `${seed.words[0][0]} 表示“${seed.words[0][1]}”。` },
        { id: `${seed.id}-listen`, type: 'listen', prompt: '播放声音，选择你听到的词。', speech: seed.words[1][0], choices: seed.words.map(([hangul]) => hangul), answer: seed.words[1][0], explanation: `你听到的是 ${seed.words[1][0]}。` },
      ] },
      { id: `${seed.id}-grammar`, title: seed.grammar, subtitle: 'Grammar', minutes: 5, objective: `理解并判断 ${seed.grammar}。`, words: [], dialogue: [], grammar: {
        title: seed.grammar, rule: seed.rule, examples: [{ ko: seed.exampleKo, zh: seed.exampleZh }], mistake: '先确认名词是否有收音、动词词干如何结尾，再选择助词或词尾；不要只按中文词序逐字替换。',
      }, activities: [
        { id: `${seed.id}-grammar-check`, type: 'choice', prompt: '哪一句符合本课句型？', choices: [seed.exampleKo, `${seed.words[0][0]} 뭐예요?`, `${seed.words[1][0]} 아니에요.`], answer: seed.exampleKo, explanation: `本课目标句是：${seed.exampleKo} ${seed.exampleZh}` },
      ] },
      { id: `${seed.id}-dialogue`, title: '在真实情境中使用', subtitle: 'Dialogue · Output', minutes: 5, objective: `读懂关于${seed.theme}的两轮对话。`, words: [], dialogue: [
        { speaker: '가', ko: seed.askKo, zh: seed.askZh }, { speaker: '나', ko: seed.answerKo, zh: seed.answerZh },
        { speaker: '가', ko: '아, 그래요? 알겠어요.', zh: '啊，是吗？我知道了。' }, { speaker: '나', ko: '네, 좋아요.', zh: '好的。' },
      ], activities: [
        { id: `${seed.id}-dialogue-check`, type: 'choice', prompt: `对方如何回答“${seed.askZh}”？`, choices: [seed.answerZh, seed.exampleZh, '对话中没有回答'], answer: seed.answerZh, explanation: `${seed.answerKo} 对应“${seed.answerZh}”。` },
        { id: `${seed.id}-arrange`, type: 'arrange', prompt: '按对话顺序排列问答。', blocks: [seed.answerKo, seed.askKo], answer: [seed.askKo, seed.answerKo], explanation: '先提出问题，再给出回应。' },
      ] },
    ],
  }
}

export const monthlyKoreanLessons: KoreanLesson[] = seeds.map(buildLesson)

