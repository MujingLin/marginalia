import type { Article } from './content'

export const idiomArticle: Article = {
  id: 'everyday-agreement',
  title: 'The Small Language of Saying Yes',
  titleZh: '说“好啊”的小语言',
  dek: 'How ordinary English expressions signal willingness, warmth, and belonging.',
  dekZh: '日常英语如何用很小的表达，传递意愿、温度与归属感。',
  language: 'English',
  topic: 'Everyday English',
  level: 'B1–B2',
  minutes: 7,
  source: 'Marginalia · Everyday English',
  sourceUrl: 'https://www.merriam-webster.com/dictionary/down%20for',
  sourceNote: 'Marginalia 原创语境精读 · 词义参考 Merriam-Webster；不是 TED 逐字稿',
  monogram: 'I’M DOWN FOR THAT',
  primer: {
    question: '朋友说“Let’s get noodles after class.”你想自然地表示愿意，会选哪句？',
    choices: ['I’m down for that.', 'I’m under that.'],
    feedback: ['对了。down for 在这里是口语“愿意参加”。', 'under 不能在这里表示接受邀请。'],
  },
  quiz: {
    prompt: '哪一句既接受了邀请，又保留轻松的朋友语气？',
    choices: [{ id: 'a', text: 'Your proposal is formally accepted.' }, { id: 'b', text: 'I’m down for that—what time?' }, { id: 'c', text: 'I do not oppose this plan.' }],
    answer: 'b',
    correctFeedback: '正确。它先用口语接受，再用一个具体问题把对话推进。',
    incorrectFeedback: '这两句语法没错，但过于正式，不符合朋友间的轻松语境。',
  },
  closingPrompt: '今天听到一次邀请时，试着先判断关系和语气，再选择回应。',
  paragraphs: [
    { id: 'invitation', original: 'Imagine a friend asking, “Want to try that new café after class?” You could say yes, but “I’m down for that” does a little more. It accepts the invitation while keeping the moment casual and warm.', translation: '想象朋友问：“下课后要去试试那家新咖啡馆吗？”你当然可以只说 yes，但“I’m down for that”还多做了一点：它接受邀请，同时保持轻松和亲近。', annotations: [{ text: 'I’m down for that', type: 'vocabulary', targetId: 'down-for-that' }] },
    { id: 'chunk', original: 'This is why fluent speakers often learn a whole chunk instead of translating one word at a time. In this setting, down does not describe direction or sadness. The phrase works as a social signal: I am willing to join you.', translation: '这就是为什么流利表达常常要记一整块，而不是逐词翻译。在这个语境里，down 既不表示方向，也不表示难过。整句是一个社交信号：我愿意加入。', annotations: [{ text: 'a whole chunk', type: 'vocabulary', targetId: 'language-chunk' }] },
    { id: 'alternatives', original: '“Count me in” is energetic. “Sounds good” is flexible and widely useful. “That works for me” is especially helpful when agreeing on a time or plan. These phrases overlap, but each carries a slightly different social texture.', translation: '“Count me in”显得积极、有劲；“Sounds good”灵活且用途很广；“That works for me”特别适合协商时间或计划。它们意思重叠，但社交质感略有不同。', annotations: [{ text: 'Count me in', type: 'vocabulary', targetId: 'count-me-in' }, { text: 'That works for me', type: 'vocabulary', targetId: 'works-for-me' }] },
    { id: 'boundary', original: 'Register matters. “I’m down for that” fits friends, classmates, and relaxed colleagues, but it may sound too casual in a formal email. Good English is not only correct English; it is language that fits the relationship and the moment.', translation: '语体很重要。“I’m down for that”适合朋友、同学和氛围轻松的同事，却可能不适合正式邮件。好英语不只是语法正确，也要与关系和当下情境匹配。', annotations: [{ text: 'Register', type: 'vocabulary', targetId: 'language-register' }] },
    { id: 'decline', original: 'If you do not want to join, “I’m not up for it tonight” is softer than a bare no. A natural response can protect both clarity and connection: say what you can do, then offer another time only if you genuinely want to.', translation: '如果你不想参加，“I’m not up for it tonight”比生硬的 no 更缓和。自然的回应可以同时保护清晰和联系：先说明自己能做什么，只有在真心想约的时候再提出另一个时间。', annotations: [{ text: 'I’m not up for it', type: 'vocabulary', targetId: 'not-up-for-it' }] },
  ],
}
