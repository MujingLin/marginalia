import { useEffect, useMemo, useRef, useState } from 'react'
import { NavLink, Route, Routes, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import {
  ArrowLeft,
  Bookmark,
  BookOpen,
  Check,
  ChevronDown,
  ChevronRight,
  Compass,
  Download,
  ExternalLink,
  Headphones,
  Home,
  Library,
  Search,
  TrendingUp,
  Upload,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react'
import { articles, concepts, filters, vocabulary, type Annotation } from './content'
import { conceptDetails, conceptIndex, getConceptName, type ConceptDetail } from './conceptContent'
import type { KnowledgeExpansion } from './knowledgeAtlas'
import { koreanLessons, stageZeroQuestions, type KoreanActivity } from './koreanContent'
import { stockChapters, stockLessons } from './stockContent'
import { exportBackup, getBookmarks, getKoreanProgress, getNote, getNotes, getProgress, getReviews, getSetting, gradeReview, importBackup, isBookmarked, saveKoreanProgress, saveNote, saveProgress, setSetting, toggleBookmark, type BookmarkRecord, type KoreanProgress, type NoteRecord, type ReadingProgress, type ReviewGrade, type ReviewRecord } from './db'

const navItems = [
  { to: '/', label: '今日', icon: Home },
  { to: '/read', label: '阅读', icon: BookOpen },
  { to: '/korean', label: '韩语', icon: Headphones },
  { to: '/explore', label: '探索', icon: Compass },
  { to: '/library', label: '书库', icon: Library },
]

function App() {
  const location = useLocation()
  const reading = location.pathname.startsWith('/read/')
  const learning = location.pathname.startsWith('/korean/diagnostic') || location.pathname.startsWith('/korean/lesson/') || location.pathname.startsWith('/explore/')
    || location.pathname.startsWith('/stocks/')
  const immersive = reading || learning
  useEffect(() => {
    if (!immersive) window.scrollTo({ top: 0, behavior: 'auto' })
  }, [location.pathname, immersive])
  return (
    <div className={immersive ? 'app reader-app' : 'app'}>
      <Routes>
        <Route path="/" element={<TodayPage />} />
        <Route path="/read" element={<ReadPage />} />
        <Route path="/read/:articleId" element={<ReaderPage />} />
        <Route path="/korean" element={<KoreanCoursePage />} />
        <Route path="/korean/diagnostic" element={<KoreanDiagnosticPage />} />
        <Route path="/korean/lesson/:lessonId" element={<KoreanLessonPage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/explore/:conceptId" element={<ConceptPage />} />
        <Route path="/stocks" element={<StockCoursePage />} />
        <Route path="/stocks/:lessonId" element={<StockLessonPage />} />
        <Route path="/library" element={<LibraryPage />} />
      </Routes>
      {!immersive && <BottomNavigation />}
    </div>
  )
}

function BottomNavigation() {
  return (
    <nav className="bottom-nav" aria-label="主导航">
      {navItems.map(({ to, label, icon: Icon }) => (
        <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <Icon aria-hidden="true" size={20} strokeWidth={1.65} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}

function BrandHeader({ eyebrow }: { eyebrow?: string }) {
  return (
    <header className="brand-header">
      <span className="wordmark">Marginalia</span>
      {eyebrow && <span className="header-note">{eyebrow}</span>}
    </header>
  )
}

const dailyEditions = [
  { key: 'grid', eyebrow: '今日视觉 · Josef Müller-Brockmann', title: '秩序，来自看不见的线', note: '网格不是把内容关进方框，而是让文字、图像和空白在同一种节奏里呼吸。', word: 'RHYTHM' },
  { key: 'type', eyebrow: '今日视觉 · Massimo Vignelli', title: '少一点字体，多一点性格', note: '真正的层级不依赖夸张字号；字重、位置和留白已经能够让信息发声。', word: 'WEIGHT' },
  { key: 'color', eyebrow: '今日视觉 · Josef Albers', title: '颜色从不独自存在', note: '同一种颜色放在不同背景上，会表现出完全不同的重量、距离与温度。', word: 'ACCENT' },
  { key: 'margin', eyebrow: '今日视觉 · Kenya Hara', title: '空白不是空着', note: '它为注意力留出入口，也让尚未说出的内容拥有位置。', word: 'MARGIN' },
] as const

function DailyEdition() {
  const now = new Date()
  const day = Math.floor(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / 86_400_000)
  const edition = dailyEditions[day % dailyEditions.length]
  const issue = String((day % 365) + 1).padStart(3, '0')
  return (
    <section className={`daily-edition edition-${edition.key}`}>
      <div className="edition-art" aria-hidden="true">
        <span className="edition-word">{edition.word}</span>
        <span className="edition-figure one" />
        <span className="edition-figure two" />
        <span className="edition-axis">M—{issue}</span>
      </div>
      <div className="edition-copy">
        <div className="edition-meta"><span>DAILY EDITION · {issue}</span><span>每日一件好设计</span></div>
        <span>{edition.eyebrow}</span>
        <h1>{edition.title}</h1>
        <p>{edition.note}</p>
      </div>
    </section>
  )
}

function QuestTrack({ stage }: { stage: number }) {
  const steps = ['判断', '概念', '精读', '应用', '收存']
  return (
    <section className="quest-track" aria-label="今日学习路线">
      <div className="quest-heading"><span>今日旅程</span><strong>CHAPTER {String(Math.min(stage + 1, 5)).padStart(2, '0')}</strong></div>
      <div className="quest-steps">
        {steps.map((step, index) => (
          <div key={step} className={index < stage ? 'quest-step done' : index === stage ? 'quest-step current' : 'quest-step'}>
            <span>{index < stage ? '✓' : index + 1}</span>
            <small>{step}</small>
          </div>
        ))}
      </div>
    </section>
  )
}

function TodayPage() {
  const navigate = useNavigate()
  const [progress, setProgressState] = useState<ReadingProgress | undefined>()
  const [quiet, setQuiet] = useState(false)
  const [curiosityChoice, setCuriosityChoice] = useState<'willpower' | 'friction' | 'goal' | null>(null)
  const [showConcept, setShowConcept] = useState(false)
  const todayLabel = useMemo(() => new Intl.DateTimeFormat('zh-CN', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date()), [])
  const dailyArticle = useMemo(() => {
    const now = new Date()
    const day = Math.floor(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / 86_400_000)
    return articles[day % articles.length]
  }, [])

  useEffect(() => {
    void getProgress(dailyArticle.id).then(setProgressState)
    void getSetting('quietMode').then((setting) => setQuiet(Boolean(setting?.value)))
  }, [dailyArticle.id])

  const toggleQuiet = async () => {
    const next = !quiet
    setQuiet(next)
    await setSetting('quietMode', next)
  }

  const percent = Math.max(8, Math.round((progress?.completion ?? 0.08) * 100))

  return (
    <main className="page page-with-nav">
      <BrandHeader eyebrow={todayLabel} />
      <DailyEdition />
      <QuestTrack stage={showConcept ? 2 : curiosityChoice ? 1 : 0} />

      <section className="curiosity-lab" aria-labelledby="curiosity-title">
        <div className="curiosity-topline">
          <span>01</span>
          <span>先凭直觉回答</span>
          <span>60 秒</span>
        </div>
        <p className="question-kicker">TODAY'S QUESTION</p>
        <h2 id="curiosity-title">如果想在通勤时<br />多读一点书，<em>你会先改变什么？</em></h2>
        <div className="choice-list">
          <button className={curiosityChoice === 'willpower' ? 'thought-choice selected' : 'thought-choice'} onClick={() => { setCuriosityChoice('willpower'); setShowConcept(false) }}><span>A</span><strong>提醒自己要更自律</strong><i>↗</i></button>
          <button className={curiosityChoice === 'friction' ? 'thought-choice selected correct' : 'thought-choice'} onClick={() => { setCuriosityChoice('friction'); setShowConcept(false) }}><span>B</span><strong>把书放到一伸手就拿到的外袋</strong><i>↗</i></button>
          <button className={curiosityChoice === 'goal' ? 'thought-choice selected' : 'thought-choice'} onClick={() => { setCuriosityChoice('goal'); setShowConcept(false) }}><span>C</span><strong>给自己定下“一年读 50 本”的目标</strong><i>↗</i></button>
        </div>

        {curiosityChoice && (
          <div className="curiosity-result" aria-live="polite">
            <span className="result-mark">{curiosityChoice === 'friction' ? '你找到了隐藏机关' : '这个答案有用，但还没有碰到机关'}</span>
            <p>{curiosityChoice === 'friction' ? '书的位置减少了开始阅读所需的动作。微小的环境变化，常常比临时调用意志力更稳定。' : '意愿和目标很重要，但仍需要你在当下“再努力一次”。如果让理想行动更容易发生，重复选择会更轻松。'}</p>
            <div className="result-actions">
              <button onClick={() => setShowConcept((value) => !value)}>{showConcept ? '收起线索' : '揭开背后的知识'} <ChevronDown size={16} className={showConcept ? 'rotated' : ''} /></button>
              <button className="read-cta" onClick={() => navigate(`/read/${dailyArticle.id}`)}>进入精读 <ChevronRight size={16} /></button>
            </div>
          </div>
        )}

        {showConcept && (
          <div className="concept-extension">
            <span>概念 01 · 行为设计</span>
            <h3>选择阻力 Choice friction</h3>
            <p>行动前多出的时间、步骤或认知负担。它不一定很大，却会改变哪一个选择最容易被执行。</p>
            <div><strong>继续观察：</strong>阻力既能减少冲动消费，也可能故意阻碍用户取消订阅。判断它时要问：它在帮助谁？</div>
          </div>
        )}
      </section>

      <section className="continue-panel" aria-labelledby="continue-title">
        <div className="continue-art" aria-hidden="true"><span>READ</span><i /></div>
        <div className="continue-content">
          <div className="section-label-row">
            <span className="section-label" id="continue-title">{progress ? '继续上次学习' : '今日双语精读'}</span>
            <span>{percent}%</span>
          </div>
        <button className="continue-link" onClick={() => navigate(`/read/${dailyArticle.id}`)}>
          <span>
            <strong>{dailyArticle.title}</strong>
            <small>{dailyArticle.titleZh} · {progress ? `从第 ${Math.max(1, Math.round(progress.completion * dailyArticle.paragraphs.length))} 段继续` : `约 ${dailyArticle.minutes} 分钟`}</small>
          </span>
          <span className="round-arrow"><ChevronRight size={20} /></span>
        </button>
        <div className="mini-progress" aria-label={`${percent}% read`}><span style={{ width: `${percent}%` }} /></div>
        </div>
      </section>

      <section className="editorial-section">
        <div className="section-heading">
          <h2>接下来可以学</h2>
          <span>任选一个</span>
        </div>
        <Recommendation number="01" category="韩语 · 下一课" title="从耳熟的声音，到真正读懂韩文" meta="约 12 分钟" onClick={() => navigate('/korean')} />
        <Recommendation number="02" category="知识探索 · 一个问题" title="为什么水比钻石更有用，却通常更便宜？" meta="约 8 分钟" onClick={() => navigate('/explore/marginal-utility')} />
        <Recommendation number="03" category="股票入门 · 系统路径" title="先理解所有权，再学习看价格" meta="15 课 · 零基础" onClick={() => navigate('/stocks')} />
      </section>

      <button className="review-row" onClick={() => navigate('/library?view=review')}>
        <div>
          <span className="section-label">复习</span>
          <p>从已收藏的词汇与概念中，完成今天的记忆检查。</p>
        </div>
        <span className="review-time">开始 →</span>
      </button>

      <section className="quiet-row">
        <div className="quiet-icon"><VolumeX size={18} /></div>
        <div className="quiet-copy">
          <strong>静音通勤</strong>
          <span>暂时跳过音频活动，不提前显示听力答案。</span>
        </div>
        <button className={quiet ? 'switch on' : 'switch'} onClick={toggleQuiet} aria-pressed={quiet} aria-label="切换静音通勤模式"><span /></button>
      </section>
    </main>
  )
}

function Recommendation({ number, category, title, meta, onClick }: { number: string; category: string; title: string; meta?: string; onClick: () => void }) {
  return (
    <button className="recommendation" onClick={onClick}>
      <span className="rec-number">{number}</span>
      <span className="rec-copy"><small>{category}</small><strong>{title}</strong></span>
      {meta ? <span className="phase-tag">{meta}</span> : <ChevronRight size={18} />}
    </button>
  )
}

function speakKorean(text: string) {
  if (!('speechSynthesis' in window)) return false
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'ko-KR'
  utterance.rate = 0.82
  const voice = window.speechSynthesis.getVoices().find((item) => item.lang.toLowerCase().startsWith('ko'))
  if (voice) utterance.voice = voice
  window.speechSynthesis.speak(utterance)
  return true
}

function KoreanCoursePage() {
  const navigate = useNavigate()
  const [progress, setProgress] = useState<Record<string, KoreanProgress>>({})
  const [diagnosticDone, setDiagnosticDone] = useState(false)

  useEffect(() => {
    void Promise.all(koreanLessons.map((lesson) => getKoreanProgress(lesson.id))).then((items) => {
      const next: Record<string, KoreanProgress> = {}
      items.forEach((item) => { if (item) next[item.lessonId] = item })
      setProgress(next)
    })
    void getSetting('koreanDiagnosticResult').then((result) => setDiagnosticDone(Boolean(result?.value)))
  }, [])

  const firstIncomplete = koreanLessons.find((lesson) => !progress[lesson.id]?.completed) ?? koreanLessons[0]
  const completedSessions = Object.values(progress).reduce((total, item) => total + item.sessionIndex + (item.completed ? 1 : 0), 0)
  const totalSessions = koreanLessons.reduce((total, lesson) => total + lesson.sessions.length, 0)
  const overall = Math.min(100, Math.round((completedSessions / totalSessions) * 100))

  return (
    <main className="page page-with-nav korean-course">
      <BrandHeader eyebrow="한국어 · LEVEL 1" />
      <section className="korean-hero course-home-hero">
        <div className="korean-level-mark"><span>01</span><small>YONSEI<br />ALIGNED</small></div>
        <div>
          <span className="kicker">소리에서 문장까지</span>
          <h1>从耳熟，<br />到真正会说。</h1>
          <p>先补齐声音与韩文之间的连接，再沿着初级主题一步一步建立句子。</p>
        </div>
      </section>

      <section className="korean-resume">
        <div><span>当前进度</span><strong>{overall}%</strong></div>
        <div className="korean-progress-line"><i style={{ width: `${Math.max(4, overall)}%` }} /></div>
        <button onClick={() => navigate(`/korean/lesson/${firstIncomplete.id}`)}>
          <span><small>下一步 · {firstIncomplete.titleKo}</small><strong>{progress[firstIncomplete.id] ? '继续学习' : '开始本课'}：{firstIncomplete.title}</strong></span>
          <ChevronRight size={20} />
        </button>
      </section>

      <section className="diagnostic-invite">
        <span className="diagnostic-number">00</span>
        <div><small>{diagnosticDone ? '诊断已完成 · 可再次练习' : '建议先做 · 约 3 分钟'}</small><h2>四十音后的桥梁</h2><p>音节组合、听音选字、收音与连音。不是从零开始，而是找出“听得懂但写不出”的缺口。</p></div>
        <button onClick={() => navigate('/korean/diagnostic')}>{diagnosticDone ? '重做诊断' : '开始诊断'} <ChevronRight size={15} /></button>
      </section>

      <section className="course-path lesson-directory">
        <div className="course-path-heading"><span>30 日初级学习路径</span><strong>{koreanLessons.length} 课 · {totalSessions} 个短 Session</strong></div>
        {koreanLessons.map((lesson, index) => {
          const item = progress[lesson.id]
          const locked = index > 0 && !progress[koreanLessons[index - 1].id]?.completed
          return (
            <button key={lesson.id} disabled={locked} className={item?.completed ? 'course-node completed' : item ? 'course-node active' : 'course-node'} onClick={() => navigate(`/korean/lesson/${lesson.id}`)}>
              <span>{item?.completed ? '✓' : String(lesson.sequence).padStart(2, '0')}</span>
              <div><small>{locked ? '完成上一课后解锁' : `${lesson.sessions.length} SESSIONS · ${lesson.sessions.reduce((sum, session) => sum + session.minutes, 0)} MIN`}</small><h2>{lesson.title}</h2><p lang="ko">{lesson.titleKo} · {lesson.theme}</p></div>
              <ChevronRight size={18} />
            </button>
          )
        })}
      </section>

      <section className="source-ledger">
        <div><span>课程依据</span><strong>新延世韩国语 · 初级 1-1 / 1-2</strong></div>
        <p>课程按官方能力框架和初级主题顺序组织，词汇讲解、例句、对话与练习均为原创，不复制教材页面与音频。</p>
        <a href="https://www.yskli.com/course.php?mid=C01_01" target="_blank" rel="noreferrer">查看延世官方课程说明 <ExternalLink size={14} /></a>
      </section>
      <p className="korean-footnote">当前版本已完成阶段 0 诊断及 {koreanLessons.length} 课、{totalSessions} 个短 Session。朗读使用设备内置韩语语音，不替代经核验的教学录音；课程按延世初级主题推进，例句、对话与练习均为原创。</p>
    </main>
  )
}

function KoreanDiagnosticPage() {
  const navigate = useNavigate()
  const [index, setIndex] = useState(0)
  const [answer, setAnswer] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [quiet, setQuiet] = useState(false)
  const [finished, setFinished] = useState(false)
  const question = stageZeroQuestions[index]

  useEffect(() => { void getSetting('quietMode').then((value) => setQuiet(Boolean(value?.value))) }, [])

  const next = async (skipped = false) => {
    const nextScore = score + (!skipped && answer === question.answer ? 1 : 0)
    if (index === stageZeroQuestions.length - 1) {
      setScore(nextScore)
      setFinished(true)
      await setSetting('koreanDiagnosticResult', JSON.stringify({ score: nextScore, total: stageZeroQuestions.length, completedAt: new Date().toISOString() }))
      return
    }
    setScore(nextScore)
    setIndex((value) => value + 1)
    setAnswer(null)
  }

  if (finished) {
    return (
      <main className="page korean-flow-page">
        <FlowHeader title="阶段 0 诊断" onBack={() => navigate('/korean')} />
        <section className="diagnostic-finish">
          <span>DIAGNOSTIC COMPLETE</span><strong>{score}<i> / {stageZeroQuestions.length}</i></strong>
          <h1>{score >= 3 ? '可以进入第一课。' : '先学第一课，同时补一补音形。'}</h1>
          <p>{score >= 3 ? '你已经具备基础音节意识。后续课程仍会穿插收音与听写，避免“会说但写不出”。' : '目前的困难集中在声音与拼写的连接。第一课会保留更多播放与辨形提示，不需要退回从头背字母。'}</p>
          <button className="korean-primary" onClick={() => navigate('/korean/lesson/greetings-introduction')}>进入问候与介绍 <ChevronRight size={17} /></button>
        </section>
      </main>
    )
  }

  const isListening = 'speech' in question
  return (
    <main className="page korean-flow-page">
      <FlowHeader title="阶段 0 · 音形诊断" onBack={() => navigate('/korean')} />
      <div className="lesson-meter"><span style={{ width: `${((index + 1) / stageZeroQuestions.length) * 100}%` }} /></div>
      <section className="diagnostic-question">
        <div className="activity-overline"><span>{question.skill}</span><span>{index + 1} / {stageZeroQuestions.length}</span></div>
        <h1>{question.prompt}</h1>
        {isListening && !quiet && <button className="sound-button" onClick={() => speakKorean(question.speech)}><Volume2 size={19} /> 播放韩语 <small>0.82×</small></button>}
        {isListening && quiet && <div className="quiet-notice"><VolumeX size={18} /><span>当前为静音通勤模式。这道题不会用文字泄露答案。</span><button onClick={() => void next(true)}>稍后做听力</button></div>}
        {(!isListening || !quiet) && <div className="korean-choice-list">
          {question.choices.map((choice) => <button key={choice} className={answer === choice ? `korean-choice selected ${choice === question.answer ? 'correct' : 'wrong'}` : 'korean-choice'} disabled={Boolean(answer)} onClick={() => setAnswer(choice)}><span lang="ko">{choice}</span>{answer === choice && <Check size={18} />}</button>)}
        </div>}
        {answer && <div className={answer === question.answer ? 'activity-feedback correct' : 'activity-feedback'}><strong>{answer === question.answer ? '答对了' : `正确答案：${question.answer}`}</strong><p>{question.explanation}</p><button onClick={() => void next()}>{index === stageZeroQuestions.length - 1 ? '查看诊断结果' : '下一题'} <ChevronRight size={15} /></button></div>}
      </section>
    </main>
  )
}

function FlowHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return <header className="flow-header"><button onClick={onBack} aria-label="返回"><ArrowLeft size={20} /></button><span>{title}</span><i /></header>
}

function KoreanLessonPage() {
  const { lessonId } = useParams()
  const navigate = useNavigate()
  const lesson = koreanLessons.find((item) => item.id === lessonId)
  const [ready, setReady] = useState(false)
  const [sessionIndex, setSessionIndex] = useState(0)
  const [completedIds, setCompletedIds] = useState<string[]>([])
  const [correctIds, setCorrectIds] = useState<string[]>([])
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [arranged, setArranged] = useState<Record<string, string[]>>({})
  const [quiet, setQuiet] = useState(false)
  const [lessonComplete, setLessonComplete] = useState(false)

  useEffect(() => {
    if (!lesson) return
    void Promise.all([getKoreanProgress(lesson.id), getSetting('quietMode')]).then(([saved, quietSetting]) => {
      if (saved) {
        setSessionIndex(Math.min(saved.sessionIndex, lesson.sessions.length - 1))
        setCompletedIds(saved.completedActivityIds)
        setCorrectIds(saved.correctActivityIds)
        setLessonComplete(saved.completed)
      }
      setQuiet(Boolean(quietSetting?.value))
      setReady(true)
    })
  }, [lesson])

  if (!lesson) return <FuturePage section="没有找到这节课" phase="404" message="当前课程轨道中不存在这项内容。" />
  if (!ready) return <main className="page korean-flow-page"><FlowHeader title="载入课程" onBack={() => navigate('/korean')} /></main>

  const session = lesson.sessions[sessionIndex]
  const sessionActivityIds = session.activities.map((item) => item.id)
  const canFinishSession = sessionActivityIds.every((id) => completedIds.includes(id))
  const percent = lessonComplete ? 100 : Math.round(((sessionIndex + (canFinishSession ? 1 : 0)) / lesson.sessions.length) * 100)

  const persist = async (nextCompleted: string[], nextCorrect: string[], nextSession = sessionIndex, completed = false) => {
    await saveKoreanProgress({ lessonId: lesson.id, sessionIndex: nextSession, completedActivityIds: nextCompleted, correctActivityIds: nextCorrect, completed, updatedAt: new Date().toISOString() })
  }

  const answerActivity = (activity: KoreanActivity, value: string, correct: boolean) => {
    if (completedIds.includes(activity.id)) return
    const nextCompleted = [...completedIds, activity.id]
    const nextCorrect = correct ? [...correctIds, activity.id] : correctIds
    setAnswers((current) => ({ ...current, [activity.id]: value }))
    setCompletedIds(nextCompleted)
    setCorrectIds(nextCorrect)
    void persist(nextCompleted, nextCorrect)
  }

  const addBlock = (activity: Extract<KoreanActivity, { type: 'arrange' }>, block: string) => {
    if (completedIds.includes(activity.id)) return
    const current = arranged[activity.id] ?? []
    if (current.includes(block)) return
    const next = [...current, block]
    setArranged((items) => ({ ...items, [activity.id]: next }))
    if (next.length === activity.answer.length) {
      const correct = next.every((item, index) => item === activity.answer[index])
      answerActivity(activity, next.join(' '), correct)
    }
  }

  const finishSession = async () => {
    if (sessionIndex < lesson.sessions.length - 1) {
      const nextIndex = sessionIndex + 1
      setSessionIndex(nextIndex)
      setAnswers({})
      setArranged({})
      window.scrollTo({ top: 0, behavior: 'smooth' })
      await persist(completedIds, correctIds, nextIndex)
    } else {
      setLessonComplete(true)
      await persist(completedIds, correctIds, sessionIndex, true)
    }
  }

  if (lessonComplete) {
    const lessonActivityIds = lesson.sessions.flatMap((item) => item.activities.map((activity) => activity.id))
    const lessonCorrect = lessonActivityIds.filter((id) => correctIds.includes(id)).length
    return (
      <main className="page korean-flow-page">
        <FlowHeader title={`第 ${lesson.sequence} 课完成`} onBack={() => navigate('/korean')} />
        <section className="lesson-finish">
          <span lang="ko">잘했어요!</span><h1>这一课已经走完。</h1><p>完成 {lesson.sessions.length} 个短 Session，首次作答正确 {lessonCorrect}/{lessonActivityIds.length}。完成不等于永远掌握，下一阶段会把听音、拼写和语法放进复习队列。</p>
          <div className="finish-points"><span>会认</span><strong>{lesson.sessions[0].words.map((word) => word.hangul).slice(0, 3).join(' · ')}</strong><span>会用</span><strong>{lesson.sessions.find((item) => item.grammar)?.grammar?.title}</strong></div>
          <button className="korean-primary" onClick={() => navigate('/korean')}>返回课程地图 <ChevronRight size={17} /></button>
        </section>
      </main>
    )
  }

  return (
    <main className="page korean-flow-page lesson-page">
      <FlowHeader title={`${lesson.title} · ${sessionIndex + 1}/${lesson.sessions.length}`} onBack={() => navigate('/korean')} />
      <div className="lesson-meter"><span style={{ width: `${percent}%` }} /></div>
      <header className="lesson-session-header">
        <div><span>{session.subtitle}</span><small>{session.minutes} MIN</small></div>
        <p lang="ko">{lesson.titleKo}</p><h1>{session.title}</h1><blockquote>{session.objective}</blockquote>
      </header>

      {session.words.length > 0 && <section className="word-notebook">
        <div className="lesson-section-title"><span>WORDS</span><h2>今天的 {session.words.length} 个词</h2></div>
        {session.words.map((word, index) => <article className="korean-word" key={word.id}><span>{String(index + 1).padStart(2, '0')}</span><div><h3 lang="ko">{word.hangul}</h3><strong>{word.meaning}</strong><p>{word.note}</p><button onClick={() => speakKorean(word.hangul)} aria-label={`播放 ${word.hangul}`}><Volume2 size={16} /></button><blockquote lang="ko">{word.example}<small>{word.exampleZh}</small></blockquote></div></article>)}
      </section>}

      {session.grammar && <section className="grammar-note">
        <div className="lesson-section-title"><span>GRAMMAR</span><h2>{session.grammar.title}</h2></div>
        <p>{session.grammar.rule}</p>
        {session.grammar.examples.map((example) => <div className="grammar-example" key={example.ko}><strong lang="ko">{example.ko}</strong><span>{example.zh}</span></div>)}
        <aside><span>常见错误</span>{session.grammar.mistake}</aside>
      </section>}

      {session.dialogue.length > 0 && <section className="dialogue-sheet">
        <div className="lesson-section-title"><span>DIALOGUE</span><h2>先读懂，再开口</h2></div>
        <button className="dialogue-play" onClick={() => speakKorean(session.dialogue.map((line) => line.ko).join(' '))}><Volume2 size={18} /> 播放整段对话</button>
        {session.dialogue.map((line) => <div className="dialogue-line" key={`${line.speaker}-${line.ko}`}><span lang="ko">{line.speaker}</span><p lang="ko">{line.ko}<small>{line.zh}</small></p></div>)}
      </section>}

      <section className="lesson-practice">
        <div className="lesson-section-title"><span>PRACTICE</span><h2>轮到你了</h2></div>
        {session.activities.map((activity, activityIndex) => {
          const done = completedIds.includes(activity.id)
          const correct = correctIds.includes(activity.id)
          const selected = answers[activity.id]
          return <article className="lesson-activity" key={activity.id}>
            <div className="activity-overline"><span>0{activityIndex + 1}</span><span>{activity.type === 'listen' ? '听音辨形' : activity.type === 'arrange' ? '句子积木' : '理解检查'}</span></div>
            <h3>{activity.prompt}</h3>
            {activity.type === 'listen' && !quiet && <button className="sound-button compact" onClick={() => speakKorean(activity.speech)}><Volume2 size={18} /> 播放</button>}
            {activity.type === 'listen' && quiet && !done && <div className="quiet-notice"><VolumeX size={17} /><span>静音模式下暂不显示听力文字。</span><button onClick={() => answerActivity(activity, 'skipped', false)}>稍后复习</button></div>}
            {(activity.type === 'choice' || (activity.type === 'listen' && !quiet)) && <div className="korean-choice-list compact-list">{activity.choices.map((choice) => <button key={choice} disabled={done} className={selected === choice ? `korean-choice selected ${choice === activity.answer ? 'correct' : 'wrong'}` : 'korean-choice'} onClick={() => answerActivity(activity, choice, choice === activity.answer)}><span lang="ko">{choice}</span></button>)}</div>}
            {activity.type === 'arrange' && <div className="arrange-area"><div className="arranged-sentence">{(arranged[activity.id] ?? []).map((block) => <span key={block} lang="ko">{block}</span>)}{!(arranged[activity.id]?.length) && <small>按顺序点击下方词块</small>}</div><div className="word-blocks">{activity.blocks.map((block) => <button key={block} disabled={done || arranged[activity.id]?.includes(block)} onClick={() => addBlock(activity, block)} lang="ko">{block}</button>)}</div>{!done && Boolean(arranged[activity.id]?.length) && <button className="reset-arrange" onClick={() => setArranged((items) => ({ ...items, [activity.id]: [] }))}>重新排列</button>}</div>}
            {done && <div className={correct ? 'activity-feedback correct inline-feedback' : 'activity-feedback inline-feedback'}><strong>{correct ? '完成' : activity.type === 'listen' && selected === 'skipped' ? '已加入稍后复习' : '再留意一下'}</strong><p>{activity.explanation}</p></div>}
          </article>
        })}
      </section>

      <footer className="session-footer"><div><span>SESSION {sessionIndex + 1}</span><strong>{canFinishSession ? '这一小节完成了' : `还剩 ${sessionActivityIds.filter((id) => !completedIds.includes(id)).length} 个练习`}</strong></div><button disabled={!canFinishSession} onClick={() => void finishSession()}>{sessionIndex === lesson.sessions.length - 1 ? '完成本课' : '进入下一小节'} <ChevronRight size={17} /></button></footer>
    </main>
  )
}

const stockProgressKey = 'marginalia-stock-progress-v1'

function readStockProgress() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(stockProgressKey) ?? '[]')
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : []
  } catch {
    return []
  }
}

function StockCoursePage() {
  const navigate = useNavigate()
  const [completed, setCompleted] = useState<string[]>([])

  useEffect(() => setCompleted(readStockProgress()), [])
  const percent = Math.round((completed.length / stockLessons.length) * 100)
  const nextLesson = stockLessons.find((lesson) => !completed.includes(lesson.id)) ?? stockLessons[0]

  return (
    <main className="page page-with-nav stock-course-page">
      <BrandHeader eyebrow="STOCKS · FOUNDATION" />
      <section className="stock-cover">
        <div className="stock-cover-index">S—01</div>
        <div>
          <span>零基础 · 15 课</span>
          <h1>先学会理解，<br /><em>再决定是否行动。</em></h1>
          <p>这不是荐股清单，而是一条建立判断框架的路径。每课先做一道直觉题，再学习概念、风险边界和纸面练习。</p>
        </div>
      </section>

      <section className="stock-progress-card">
        <div><span>当前进度</span><strong>{completed.length} / {stockLessons.length}</strong></div>
        <div className="stock-progress-line"><i style={{ width: `${Math.max(3, percent)}%` }} /></div>
        <button onClick={() => navigate(`/stocks/${nextLesson.id}`)}>{completed.length ? '继续学习' : '开始第一课'} <ChevronRight size={16} /></button>
      </section>

      <section className="stock-principles">
        <span>学习约定</span>
        <p>先保护应急资金；不使用杠杆练习；不依据单条消息下单；所有示例只用于教育，不构成投资建议。</p>
      </section>

      <section className="stock-chapter-list">
        {stockChapters.map((chapter) => {
          const lessons = stockLessons.filter((lesson) => lesson.chapter === chapter.number)
          const done = lessons.filter((lesson) => completed.includes(lesson.id)).length
          return <section key={chapter.number} className="stock-chapter">
            <header><span>CHAPTER {String(chapter.number).padStart(2, '0')}</span><small>{done} / {lessons.length}</small><h2>{chapter.title}</h2><p>{chapter.note}</p></header>
            {lessons.map((lesson) => <button key={lesson.id} onClick={() => navigate(`/stocks/${lesson.id}`)} className={completed.includes(lesson.id) ? 'stock-lesson-row completed' : 'stock-lesson-row'}>
              <span>{completed.includes(lesson.id) ? <Check size={14} /> : String(lesson.sequence).padStart(2, '0')}</span>
              <span><strong>{lesson.title}</strong><small>{lesson.titleEn} · {lesson.minutes} MIN</small></span>
              <ChevronRight size={16} />
            </button>)}
          </section>
        })}
      </section>

      <footer className="stock-source-note">
        <strong>课程边界</strong>
        <p>内容依据 Investor.gov / SEC 的投资者教育材料整理，讲解通用概念；不同市场的开户、税务、涨跌幅和交易制度并不相同。</p>
        <a href="https://www.investor.gov/introduction-investing" target="_blank" rel="noreferrer">查看基础来源 <ExternalLink size={13} /></a>
      </footer>
    </main>
  )
}

function StockLessonPage() {
  const navigate = useNavigate()
  const { lessonId } = useParams()
  const lesson = stockLessons.find((item) => item.id === lessonId)
  const [answer, setAnswer] = useState<number | null>(null)
  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    if (lesson) setCompleted(readStockProgress().includes(lesson.id))
  }, [lesson])

  if (!lesson) return <main className="page future-page"><span className="future-number">404</span><h1>这一课不存在。</h1><button className="sheet-deep-link" onClick={() => navigate('/stocks')}>返回股票课程</button></main>
  const nextLesson = stockLessons[lesson.sequence]
  const markComplete = () => {
    const current = readStockProgress()
    if (!current.includes(lesson.id)) window.localStorage.setItem(stockProgressKey, JSON.stringify([...current, lesson.id]))
    setCompleted(true)
  }

  return (
    <main className="stock-lesson-page">
      <header className="stock-lesson-toolbar">
        <button onClick={() => navigate('/stocks')} aria-label="返回课程"><ArrowLeft size={20} /></button>
        <span>第 {lesson.sequence} / {stockLessons.length} 课</span>
        <span>{lesson.minutes} MIN</span>
      </header>

      <article className="stock-lesson-sheet">
        <section className="stock-lesson-hero">
          <span>CHAPTER {String(lesson.chapter).padStart(2, '0')} · {lesson.titleEn.toUpperCase()}</span>
          <h1>{lesson.title}</h1>
          <blockquote>{lesson.question}</blockquote>
        </section>

        <section className="stock-warmup">
          <div><span>01</span><small>先凭直觉判断</small></div>
          <h2>{lesson.challenge.prompt}</h2>
          <div className="stock-choice-list">{lesson.challenge.choices.map((choice, index) => <button key={choice} className={answer === index ? index === lesson.challenge.answer ? 'selected correct' : 'selected wrong' : ''} onClick={() => setAnswer(index)}><span>{String.fromCharCode(65 + index)}</span>{choice}</button>)}</div>
          {answer !== null && <aside className={answer === lesson.challenge.answer ? 'correct' : ''}><strong>{answer === lesson.challenge.answer ? '判断成立' : '先别急着下结论'}</strong><p>{lesson.challenge.explanation}</p></aside>}
        </section>

        <section className="stock-intuition"><span>02 · 一句话抓住它</span><p>{lesson.intuition}</p></section>

        <section className="stock-essentials">
          <div className="lesson-section-title"><span>03 · CORE IDEAS</span><h2>三个必须带走的判断</h2></div>
          <ol>{lesson.essentials.map((item) => <li key={item}>{item}</li>)}</ol>
        </section>

        <section className="stock-term-card"><span>KEY TERM</span><h2>{lesson.term.name}</h2><i>{lesson.term.english}</i><p>{lesson.term.meaning}</p></section>

        <section className="stock-practice-block">
          <span>04 · PAPER PRACTICE</span><h2>今天先不下单</h2><p>{lesson.practice}</p>
        </section>

        <section className="stock-caution"><span>风险边界</span><p>{lesson.caution}</p></section>

        <section className="stock-source">
          <span>核对来源</span><a href={lesson.source.url} target="_blank" rel="noreferrer"><strong>{lesson.source.title}</strong><ExternalLink size={15} /></a>
          <small>来源用于概念核对；课程示例为教学改写，不代表监管机构对任何产品的推荐。</small>
        </section>

        <footer className="stock-lesson-footer">
          <button className={completed ? 'completed' : ''} disabled={answer === null} onClick={markComplete}>{completed ? <><Check size={16} /> 已完成本课</> : '完成本课'}</button>
          {completed && nextLesson && <button onClick={() => { setAnswer(null); navigate(`/stocks/${nextLesson.id}`) }}>下一课 <ChevronRight size={16} /></button>}
          {completed && !nextLesson && <button onClick={() => navigate('/stocks')}>查看完整路径 <ChevronRight size={16} /></button>}
        </footer>
      </article>
    </main>
  )
}

const exploreSubjects = ['全部', '经济学', '心理学', '哲学', '科学', '历史', '冷知识'] as const

function ExplorePage() {
  const navigate = useNavigate()
  const [subject, setSubject] = useState<(typeof exploreSubjects)[number]>('全部')
  const [query, setQuery] = useState('')
  const [lastConcept, setLastConcept] = useState<string | null>(null)
  const [showAllExpansions, setShowAllExpansions] = useState(false)

  useEffect(() => { void getSetting('lastConcept').then((item) => setLastConcept(typeof item?.value === 'string' ? item.value : null)) }, [])
  const visible = conceptDetails.filter((item) => (subject === '全部' || item.subject === subject) && `${item.nameZh} ${item.nameEn} ${item.question}`.toLowerCase().includes(query.toLowerCase()))
  const atlasEntries: KnowledgeExpansion[] = conceptIndex.filter((item) => !conceptDetails.some((detail) => detail.id === item.id)).map((item) => ({ id: item.id, slug: item.slug, nameZh: item.nameZh, nameEn: item.nameEn, subject: item.subject, minutes: item.minutes, question: item.question, teaser: 'teaser' in item ? item.teaser : item.question }))
  const visibleExpansions = atlasEntries.filter((item) => (subject === '全部' || item.subject === subject) && `${item.nameZh} ${item.nameEn} ${item.question} ${item.teaser}`.toLowerCase().includes(query.toLowerCase()))
  const displayedExpansions = query || subject !== '全部' || showAllExpansions ? visibleExpansions : visibleExpansions.slice(0, 16)
  const resume = conceptDetails.find((item) => item.id === lastConcept)

  return (
    <main className="page page-with-nav explore-page">
      <BrandHeader eyebrow="知识探索 · ISSUE 01" />
      <section className="explore-cover">
        <span className="explore-index">B—01</span>
        <div><span className="kicker">从一个反直觉问题开始</span><h1>先猜，<br /><em>再把直觉变成知识。</em></h1><p>不是百科目录。每次只走一条可以亲手验证、继续追问、找到来源的知识路径。</p></div>
      </section>

      {resume && <button className="explore-resume" onClick={() => navigate(`/explore/${resume.slug}`)}><span>继续上次探索</span><strong>{resume.nameZh}</strong><small>{resume.question}</small><ChevronRight size={18} /></button>}

      <section className="featured-question">
        <div className="feature-number">01</div>
        <div><span>经济学 · 8 MIN</span><h2>为什么水比钻石更有用，<br />却通常更便宜？</h2><p>把“总价值”与“再多一个单位的价值”分开，亲手观察边际效用。</p><button onClick={() => navigate('/explore/marginal-utility')}>进入实验 <ChevronRight size={15} /></button></div>
      </section>

      <button className="stock-path-entry" onClick={() => navigate('/stocks')}>
        <span className="stock-path-mark"><TrendingUp size={22} /></span>
        <span><small>NEW PATH · 零基础</small><strong>股票基础学习路径</strong><em>15 课，从所有权、报表到风险管理</em></span>
        <ChevronRight size={18} />
      </button>

      <div className="explore-tools">
        <label className="search-field"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索问题或概念" /></label>
        <div className="filter-scroll">{exploreSubjects.map((item) => <button key={item} className={subject === item ? 'filter active' : 'filter'} onClick={() => setSubject(item)}>{item}</button>)}</div>
      </div>

      <section className="concept-shelf">
        <div className="section-heading"><h2>{conceptDetails.length} 条完整微课</h2><span>可自由浏览 · 互有关联</span></div>
        {visible.map((item, index) => <button key={item.id} className="concept-entry" onClick={() => navigate(`/explore/${item.slug}`)}><span>{String(index + 1).padStart(2, '0')}</span><div><small>{item.subject} · {item.minutes} MIN</small><h3>{item.question}</h3><p>{item.nameZh} <i>{item.nameEn}</i></p></div><ChevronRight size={17} /></button>)}
        {!visible.length && <div className="empty-state"><p>这组筛选暂时没有内容。</p><button onClick={() => { setQuery(''); setSubject('全部') }}>清除筛选</button></div>}
      </section>

      <section className="concept-shelf atlas-shelf">
        <div className="section-heading"><h2>知识拓展</h2><span>{conceptIndex.length} 条知识总量</span></div>
        <p className="atlas-intro">拓展卡不是空标题：每条都能打开，完成定义边界、反例思考与生活观察；适合每天快速探索，再沿关联进入完整微课。</p>
        {displayedExpansions.map((item, index) => <button key={item.id} className="concept-entry atlas-entry" onClick={() => navigate(`/explore/${item.slug}`)}><span>{String(index + 1).padStart(2, '0')}</span><div><small>{item.subject} · {item.minutes} MIN · EXTENSION</small><h3>{item.question}</h3><p>{item.nameZh} <i>{item.nameEn}</i></p></div><ChevronRight size={17} /></button>)}
        {!visibleExpansions.length && <div className="empty-state"><p>这组筛选暂时没有拓展内容。</p></div>}
        {!query && subject === '全部' && visibleExpansions.length > 16 && <button className="atlas-more" onClick={() => setShowAllExpansions((value) => !value)}>{showAllExpansions ? '收起知识地图' : `展开全部 ${visibleExpansions.length} 条拓展`} <ChevronDown size={16} className={showAllExpansions ? 'rotated' : ''} /></button>}
      </section>
    </main>
  )
}

function ConceptActivity({ concept }: { concept: ConceptDetail }) {
  const activity = concept.activity
  const [quantity, setQuantity] = useState(3)
  const [scenarioAnswer, setScenarioAnswer] = useState<number | null>(null)
  const [gain, setGain] = useState(activity.type === 'loss-slider' ? activity.defaultGain : 150)

  if (activity.type === 'marginal-slider') {
    const marginal = activity.values[quantity - 1]
    const total = activity.values.slice(0, quantity).reduce((sum, value) => sum + value, 0)
    return <section className="concept-experiment"><span>TRY IT · 教学假设</span><h2>{activity.title}</h2><p>{activity.prompt}</p><div className="pizza-readout"><div><small>已吃</small><strong>{quantity}<i> 片</i></strong></div><div><small>这一片的边际效用</small><strong>{marginal}</strong></div><div><small>累计总效用</small><strong>{total}</strong></div></div><input aria-label="披萨片数" type="range" min="1" max={activity.values.length} value={quantity} onChange={(event) => setQuantity(Number(event.target.value))} /><div className="utility-bars">{activity.values.map((value, index) => <i key={index} className={index < quantity ? 'active' : ''} style={{ height: `${Math.max(8, Math.abs(value) * 2)}px` }}><span>{index + 1}</span></i>)}</div><aside>{marginal < 0 ? '这一片开始降低总满足；“更多”已经不再更好。' : marginal < 8 ? '总效用仍可能较高，但新增满足已经很小。' : '新增满足仍为正，但正在逐片减少。'}</aside></section>
  }
  if (activity.type === 'scenario') {
    return <section className="concept-experiment"><span>TRY IT · 情境判断</span><h2>{activity.title}</h2><p>{activity.prompt}</p><div className="scenario-choices">{activity.choices.map((choice, index) => <button key={choice} disabled={scenarioAnswer !== null} className={scenarioAnswer === index ? (index === activity.answer ? 'selected correct' : 'selected') : ''} onClick={() => setScenarioAnswer(index)}><span>{String.fromCharCode(65 + index)}</span>{choice}</button>)}</div>{scenarioAnswer !== null && <aside className={scenarioAnswer === activity.answer ? 'correct' : ''}>{activity.explanations[scenarioAnswer]}</aside>}</section>
  }
  const ratio = (gain / 100).toFixed(1)
  return <section className="concept-experiment"><span>TRY IT · 没有标准接受点</span><h2>{activity.title}</h2><p>{activity.prompt}</p><div className="gamble-card"><div><small>可能获得</small><strong>+ ¥{gain}</strong></div><div><small>可能损失</small><strong>− ¥100</strong></div></div><input aria-label="可能获得金额" type="range" min="100" max="300" step="10" value={gain} onChange={(event) => setGain(Number(event.target.value))} /><aside>你的收益与损失比是 {ratio} : 1。经典研究发现很多人需要潜在收益明显大于损失才愿意接受，但这不是个人诊断，也不存在固定的“正确倍数”。</aside></section>
}

function ConceptPage() {
  const { conceptId } = useParams()
  const navigate = useNavigate()
  const concept = conceptDetails.find((item) => item.slug === conceptId || item.id === conceptId)
  const rawExpansion = conceptIndex.find((item) => (item.slug === conceptId || item.id === conceptId) && !conceptDetails.some((detail) => detail.id === item.id))
  const expansion: KnowledgeExpansion | undefined = rawExpansion ? { id: rawExpansion.id, slug: rawExpansion.slug, nameZh: rawExpansion.nameZh, nameEn: rawExpansion.nameEn, subject: rawExpansion.subject, minutes: rawExpansion.minutes, question: rawExpansion.question, teaser: 'teaser' in rawExpansion ? rawExpansion.teaser : rawExpansion.question } : undefined
  const [saved, setSaved] = useState(false)
  const [checkAnswer, setCheckAnswer] = useState<number | null>(null)
  const [note, setNoteState] = useState('')
  const [noteStatus, setNoteStatus] = useState('')
  const [mastery, setMastery] = useState<ReviewGrade | null>(null)

  useEffect(() => {
    if (!concept) return
    void setSetting('lastConcept', concept.id)
    void isBookmarked('concept', concept.id).then(setSaved)
    void getNote('concept', concept.id).then((item) => setNoteState(item?.content ?? ''))
  }, [concept])

  if (!concept && expansion) return <KnowledgeExpansionPage item={expansion} />
  if (!concept) return <FuturePage section="没有找到这个概念" phase="404" message="当前精选探索中还没有这项内容。" />
  const remember = async (grade: ReviewGrade) => {
    await gradeReview('concept', concept.id, grade)
    setMastery(grade)
  }
  return (
    <main className="concept-page">
      <header className="concept-toolbar"><button onClick={() => navigate('/explore')} aria-label="返回探索"><ArrowLeft size={20} /></button><span>CONCEPT · {concept.subject}</span><button className={saved ? 'saved' : ''} onClick={async () => setSaved(await toggleBookmark('concept', concept.id))} aria-label={saved ? '取消收藏概念' : '收藏概念'}><Bookmark size={19} fill={saved ? 'currentColor' : 'none'} /></button></header>
      <article className="concept-sheet">
        <header className="concept-hero"><span>{concept.subject} · {concept.minutes} MIN</span><h1>{concept.nameZh}</h1><p>{concept.nameEn}</p><blockquote>{concept.question}</blockquote></header>
        <section className="concept-intuition"><span>一句话讲明白</span><p>{concept.intuition}</p></section>
        <section className="concept-definition"><div className="lesson-section-title"><span>DEFINITION</span><h2>准确地说</h2></div><p>{concept.formalDefinition}</p>{concept.formula && <div className="formula-card"><strong>{concept.formula}</strong><small>{concept.formulaNote}</small></div>}</section>
        <section className="concept-case"><span>LIFE EXAMPLE</span><h2>{concept.example.title}</h2><p>{concept.example.body}</p></section>
        <ConceptActivity concept={concept} />
        <section className="misconception"><span>容易混淆</span><h2>{concept.misconception.title}</h2><p>{concept.misconception.body}</p></section>
        <section className="concept-check"><span>CHECK UNDERSTANDING</span><h2>{concept.check.prompt}</h2>{concept.check.choices.map((choice, index) => <button key={choice} disabled={checkAnswer !== null} className={checkAnswer === index ? (index === concept.check.answer ? 'selected correct' : 'selected') : ''} onClick={() => setCheckAnswer(index)}><span>{String.fromCharCode(65 + index)}</span>{choice}</button>)}{checkAnswer !== null && <aside className={checkAnswer === concept.check.answer ? 'correct' : ''}>{checkAnswer === concept.check.answer ? '理解正确。' : '这个选项忽略了概念的适用条件。'} {concept.check.explanation}</aside>}</section>
        <section className="related-concepts"><div className="lesson-section-title"><span>EXPLORE DEEPER</span><h2>沿着关系继续</h2></div>{concept.related.map((relation) => { const available = conceptDetails.some((item) => item.id === relation.targetId); return available ? <button key={relation.targetId} onClick={() => navigate(`/explore/${relation.targetId}`)}><small>{relation.type}</small><strong>{getConceptName(relation.targetId)}</strong><p>{relation.reason}</p><ChevronRight size={17} /></button> : <article key={relation.targetId}><small>{relation.type}</small><strong>{getConceptName(relation.targetId)}</strong><p>{relation.reason}</p></article> })}</section>
        <section className="concept-sources"><div className="lesson-section-title"><span>SOURCES</span><h2>可以核验的出处</h2></div>{concept.sources.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer"><div><strong>{source.title}</strong><small>{source.publisher} · {source.note}</small></div><ExternalLink size={15} /></a>)}</section>
        <section className="remember-panel"><span>REMEMBER</span><h2>把理解留下来</h2><textarea value={note} onChange={(event) => { setNoteState(event.target.value); setNoteStatus('') }} placeholder="用自己的话写一句，或记下仍然困惑的地方……" /><button className="save-note" onClick={async () => { await saveNote('concept', concept.id, note); setNoteStatus(note.trim() ? '笔记已保存在本设备' : '空笔记已移除') }}>保存笔记</button>{noteStatus && <small>{noteStatus}</small>}<div className="mastery-row"><p>你现在能应用它吗？</p>{(['again', 'hard', 'good', 'easy'] as ReviewGrade[]).map((grade) => <button key={grade} className={mastery === grade ? 'selected' : ''} onClick={() => void remember(grade)}>{grade === 'again' ? '再学一次' : grade === 'hard' ? '有点难' : grade === 'good' ? '基本会了' : '很熟练'}</button>)}</div><button className={saved ? 'remember-bookmark saved' : 'remember-bookmark'} onClick={async () => setSaved(await toggleBookmark('concept', concept.id))}><Bookmark size={17} fill={saved ? 'currentColor' : 'none'} />{saved ? '已收藏到书库' : '收藏这个概念'}</button></section>
      </article>
    </main>
  )
}

function KnowledgeExpansionPage({ item }: { item: KnowledgeExpansion }) {
  const navigate = useNavigate()
  const [saved, setSaved] = useState(false)
  const [note, setNoteState] = useState('')
  const [activePrompt, setActivePrompt] = useState<number | null>(null)
  const related = conceptDetails.find((concept) => concept.subject === item.subject) ?? conceptDetails[0]
  const prompts = [
    { label: '定义边界', question: `如果要向朋友解释“${item.nameZh}”，哪些情况必须排除？`, guide: '先写一个最小定义，再补一句“它不等于……”。边界能防止概念变成什么都能解释的口号。' },
    { label: '寻找反例', question: `什么观察会让你怀疑自己对“${item.nameZh}”的理解？`, guide: '寻找一个看似符合、实际不符合的例子；再找一个看似相反、实际仍符合的例子。' },
    { label: '生活观察', question: '未来 24 小时，可以在哪里观察到它？', guide: '选择一个具体场景，记录发生了什么、还有哪些解释，不急着给自己或别人贴标签。' },
  ]

  useEffect(() => {
    void setSetting('lastConcept', item.id)
    void isBookmarked('concept', item.id).then(setSaved)
    void getNote('concept', item.id).then((entry) => setNoteState(entry?.content ?? ''))
  }, [item.id])

  return (
    <main className="concept-page">
      <header className="concept-toolbar"><button onClick={() => navigate('/explore')} aria-label="返回探索"><ArrowLeft size={20} /></button><span>EXTENSION · {item.subject}</span><button className={saved ? 'saved' : ''} onClick={async () => setSaved(await toggleBookmark('concept', item.id))} aria-label="收藏知识拓展"><Bookmark size={19} fill={saved ? 'currentColor' : 'none'} /></button></header>
      <article className="concept-sheet expansion-sheet">
        <header className="concept-hero"><span>{item.subject} · {item.minutes} MIN · 知识拓展</span><h1>{item.nameZh}</h1><p>{item.nameEn}</p><blockquote>{item.question}</blockquote></header>
        <section className="concept-intuition"><span>先带走这一句</span><p>{item.teaser}</p></section>
        <section className="expansion-prompts"><div className="lesson-section-title"><span>THINK WITH IT</span><h2>三步建立概念轮廓</h2></div><p>拓展卡不要求背诵定义。依次完成边界、反例和观察，先形成可以继续修正的理解。</p>{prompts.map((prompt, index) => <button key={prompt.label} className={activePrompt === index ? 'active' : ''} onClick={() => setActivePrompt(activePrompt === index ? null : index)}><span>{String(index + 1).padStart(2, '0')}</span><div><small>{prompt.label}</small><strong>{prompt.question}</strong>{activePrompt === index && <p>{prompt.guide}</p>}</div><ChevronDown size={16} className={activePrompt === index ? 'rotated' : ''} /></button>)}</section>
        <section className="related-concepts"><div className="lesson-section-title"><span>GO DEEPER</span><h2>进入完整互动微课</h2></div><button onClick={() => navigate(`/explore/${related.slug}`)}><small>{related.subject} · {related.minutes} MIN</small><strong>{related.nameZh}</strong><p>{related.question}</p><ChevronRight size={17} /></button></section>
        <section className="remember-panel"><span>MONTHLY ATLAS</span><h2>留下你的理解</h2><textarea value={note} onChange={(event) => setNoteState(event.target.value)} placeholder={`我现在怎样理解“${item.nameZh}”？还有什么疑问？`} /><button className="save-note" onClick={() => void saveNote('concept', item.id, note)}>保存笔记</button><div className="mastery-row"><p>这条拓展需要何时再见？</p><button onClick={() => void gradeReview('concept', item.id, 'again')}>今天再看</button><button onClick={() => void gradeReview('concept', item.id, 'good')}>三天后</button><button onClick={() => void gradeReview('concept', item.id, 'easy')}>一周后</button></div><button className={saved ? 'remember-bookmark saved' : 'remember-bookmark'} onClick={async () => setSaved(await toggleBookmark('concept', item.id))}><Bookmark size={17} fill={saved ? 'currentColor' : 'none'} />{saved ? '已收藏到书库' : '收藏这条拓展'}</button></section>
      </article>
    </main>
  )
}

type LibraryView = 'articles' | 'vocabulary' | 'concepts' | 'notes' | 'review'

function LibraryPage() {
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const initial = params.get('view') as LibraryView | null
  const [view, setView] = useState<LibraryView>(initial && ['articles', 'vocabulary', 'concepts', 'notes', 'review'].includes(initial) ? initial : 'articles')
  const [query, setQuery] = useState('')
  const [bookmarks, setBookmarks] = useState<BookmarkRecord[]>([])
  const [notes, setNotes] = useState<NoteRecord[]>([])
  const [reviews, setReviews] = useState<ReviewRecord[]>([])
  const [reading, setReading] = useState<Record<string, ReadingProgress | undefined>>({})
  const [message, setMessage] = useState('')
  const [reviewedNow, setReviewedNow] = useState<string[]>([])

  const refresh = async () => {
    const [nextBookmarks, nextNotes, nextReviews, ...nextReading] = await Promise.all([getBookmarks(), getNotes(), getReviews(), ...articles.map((item) => getProgress(item.id))])
    setBookmarks(nextBookmarks); setNotes(nextNotes); setReviews(nextReviews); setReading(Object.fromEntries(articles.map((item, index) => [item.id, nextReading[index]])))
  }
  useEffect(() => { void refresh() }, [])
  const changeView = (next: LibraryView) => { setView(next); setParams(next === 'articles' ? {} : { view: next }); setMessage('') }
  const bookmarked = (type: BookmarkRecord['entityType']) => bookmarks.filter((item) => item.entityType === type)
  const dueItems = bookmarks.filter((item) => item.entityType === 'vocabulary' || item.entityType === 'concept').filter((item) => { const review = reviews.find((entry) => entry.id === item.id); return !review || new Date(review.dueAt) <= new Date() }).filter((item) => !reviewedNow.includes(item.id))
  const matches = (text: string) => text.toLowerCase().includes(query.toLowerCase())
  const visibleVocabulary = bookmarked('vocabulary').filter((item) => {
    const word = vocabulary[item.entityId as keyof typeof vocabulary]
    return Boolean(word && matches(`${word.lemma} ${word.meaning}`))
  })
  const visibleConcepts = bookmarked('concept').filter((item) => matches(`${getConceptName(item.entityId)} ${item.entityId}`))
  const visibleNotes = notes.filter((item) => matches(`${item.content} ${getConceptName(item.targetId)}`))
  const visibleArticles = articles.filter((item) => (reading[item.id] || bookmarked('article').some((bookmark) => bookmark.entityId === item.id)) && matches(`${item.title} ${item.titleZh}`))
  const sourceName = (sourceId?: string) => articles.find((item) => item.id === sourceId)?.titleZh ?? (sourceId ? '知识探索' : '双语阅读')

  const downloadBackup = async () => {
    const raw = await exportBackup()
    const url = URL.createObjectURL(new Blob([raw], { type: 'application/json' }))
    const link = document.createElement('a'); link.href = url; link.download = `marginalia-backup-${new Date().toISOString().slice(0, 10)}.json`; link.click(); URL.revokeObjectURL(url)
    setMessage('备份已导出')
  }
  const uploadBackup = async (file?: File) => {
    if (!file) return
    try { await importBackup(await file.text()); await refresh(); setMessage('备份已合并到本设备') } catch { setMessage('无法导入：文件格式或版本不正确') }
  }
  const reviewItem = async (item: BookmarkRecord, grade: ReviewGrade) => {
    await gradeReview(item.entityType as 'vocabulary' | 'concept', item.entityId, grade, item.sourceId)
    setReviewedNow((current) => [...current, item.id]); await refresh()
  }

  return (
    <main className="page page-with-nav library-page">
      <BrandHeader eyebrow="仅保存在这台设备" />
      <section className="library-header"><span>MY MARGINALIA</span><h1>个人书库</h1><p>收藏不是终点。这里保留内容从哪里来，也把值得记住的东西送回复习。</p></section>
      <nav className="library-tabs" aria-label="书库视图">{([['articles', '文章'], ['vocabulary', '词汇'], ['concepts', '概念'], ['notes', '笔记'], ['review', '复习']] as [LibraryView, string][]).map(([key, label]) => <button key={key} className={view === key ? 'active' : ''} onClick={() => changeView(key)}>{label}{key === 'review' && dueItems.length > 0 && <i>{dueItems.length}</i>}</button>)}</nav>
      {view !== 'review' && <label className="search-field library-search"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索标题、词汇或笔记" /></label>}

      <section className="library-content">
        {view === 'articles' && (visibleArticles.length ? visibleArticles.map((item) => { const itemProgress = reading[item.id]; return <button className="library-item article-item" key={item.id} onClick={() => navigate(`/read/${item.id}`)}><span>{itemProgress?.completed ? '已读' : itemProgress ? '在读' : '未读'}</span><div><small>英语 · TED 来源</small><h2>{item.title}</h2><p>{item.titleZh}</p>{itemProgress && <div className="entry-progress"><i style={{ width: `${Math.round(itemProgress.completion * 100)}%` }} /></div>}</div><ChevronRight size={17} /></button> }) : <LibraryEmpty text="阅读或收藏一篇文章后，它会出现在这里。" />)}
        {view === 'vocabulary' && (visibleVocabulary.length ? visibleVocabulary.map((item) => { const word = vocabulary[item.entityId as keyof typeof vocabulary]; return <article className="library-item vocab-item" key={item.id}><span>EN</span><div><small>来自《{sourceName(item.sourceId)}》</small><h2>{word.lemma}</h2><p>{word.meaning}</p></div></article> }) : <LibraryEmpty text="在双语阅读器中点按词汇并收藏，即会进入这里。" />)}
        {view === 'concepts' && (visibleConcepts.length ? visibleConcepts.map((item) => { const detail = conceptDetails.find((entry) => entry.id === item.entityId); const legacy = concepts[item.entityId as keyof typeof concepts]; return <button className="library-item concept-item" key={item.id} onClick={() => detail ? navigate(`/explore/${detail.slug}`) : navigate('/explore')}><span>概念</span><div><small>{detail?.subject ?? '来自英语精读'}</small><h2>{detail?.nameZh ?? legacy?.nameZh ?? item.entityId}</h2><p>{detail?.intuition ?? legacy?.definition}</p></div><ChevronRight size={17} /></button> }) : <LibraryEmpty text="收藏一个概念后，它会连同来源一起出现在这里。" />)}
        {view === 'notes' && (visibleNotes.length ? visibleNotes.map((item) => <button className="library-note" key={item.id} onClick={() => item.targetType === 'concept' ? navigate(`/explore/${item.targetId}`) : undefined}><small>{item.targetType === 'concept' ? getConceptName(item.targetId) : item.targetId} · {new Date(item.updatedAt).toLocaleDateString('zh-CN')}</small><p>{item.content}</p></button>) : <LibraryEmpty text="在概念页写下自己的理解，笔记会集中保存在这里。" />)}
        {view === 'review' && <div className="review-deck">{dueItems[0] ? <><div className="review-deck-meta"><span>今日到期</span><strong>{dueItems.length}</strong></div><article><small>{dueItems[0].entityType === 'vocabulary' ? '词汇回想' : '概念回想'}</small><h2>{dueItems[0].entityType === 'vocabulary' ? vocabulary[dueItems[0].entityId as keyof typeof vocabulary]?.lemma : getConceptName(dueItems[0].entityId)}</h2><p>{dueItems[0].entityType === 'vocabulary' ? '先在心里说出中文含义，再翻看原文语境。' : '不用背定义：试着用一句自己的话解释，再想一个生活例子。'}</p><div className="review-origin">来源 · {dueItems[0].entityType === 'concept' && !articles.some((item) => item.id === dueItems[0].sourceId) ? '知识探索' : sourceName(dueItems[0].sourceId)}</div></article><div className="grade-buttons">{([['again', '再来'], ['hard', '困难'], ['good', '记得'], ['easy', '轻松']] as [ReviewGrade, string][]).map(([grade, label]) => <button key={grade} onClick={() => void reviewItem(dueItems[0], grade)}>{label}<small>{grade === 'again' ? '今天' : grade === 'hard' ? '1 天' : grade === 'good' ? '3+ 天' : '7+ 天'}</small></button>)}</div></> : <LibraryEmpty text={reviewedNow.length ? '今天的复习已经完成。' : '收藏词汇或概念后，它们会按到期时间出现在这里。'} />}</div>}
      </section>

      <section className="backup-panel"><div><span>本地数据备份</span><p>无账号版本只保存在当前浏览器。换设备或清理浏览器数据前，请导出 JSON。</p></div><div><button onClick={() => void downloadBackup()}><Download size={16} /> 导出</button><label><Upload size={16} /> 导入<input type="file" accept="application/json" onChange={(event) => void uploadBackup(event.target.files?.[0])} /></label></div>{message && <small>{message}</small>}</section>
    </main>
  )
}

function LibraryEmpty({ text }: { text: string }) {
  return <div className="library-empty"><span>—</span><p>{text}</p></div>
}

function ReadPage() {
  const navigate = useNavigate()
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>('全部')
  const [query, setQuery] = useState('')
  const [progress, setProgressState] = useState<Record<string, ReadingProgress | undefined>>({})
  const [showAllArticles, setShowAllArticles] = useState(false)
  useEffect(() => { void Promise.all(articles.map((item) => getProgress(item.id))).then((items) => setProgressState(Object.fromEntries(articles.map((item, index) => [item.id, items[index]])))) }, [])

  const visibleArticles = articles.filter((item) => {
    const matchesQuery = `${item.title} ${item.titleZh} ${item.dekZh} ${item.topic}`.toLowerCase().includes(query.toLowerCase())
    const matchesFilter = activeFilter === '全部' || activeFilter === '英语' || (activeFilter === '心理学' && item.topic === 'Psychology') || (activeFilter === '学习' && item.topic === 'Learning') || (activeFilter === '社会' && item.topic === 'Society') || (activeFilter === '10 分钟以内' && item.minutes <= 10)
    return matchesQuery && matchesFilter
  })
  const displayedArticles = query || activeFilter !== '全部' || showAllArticles ? visibleArticles : visibleArticles.slice(0, 10)

  return (
    <main className="page page-with-nav read-index">
      <BrandHeader eyebrow="阅读室 · ISSUE 01" />
      <section className="catalog-title">
        <span className="catalog-issue">READING NOTES<br />01—26</span>
        <div>
          <span className="kicker">本期主题 · The invisible hand</span>
          <h1>阅读，<br /><em>从一个问题开始。</em></h1>
          <p>不是信息流。每篇都从一个判断开始，带着批注精读，再用一次理解检查收束。</p>
        </div>
      </section>

      <div className="catalog-tools">
        <label className="search-field">
          <Search size={16} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索标题或主题" />
        </label>
        <div className="filter-scroll" aria-label="阅读筛选">
          {filters.map((filter) => <button key={filter} className={activeFilter === filter ? 'filter active' : 'filter'} onClick={() => setActiveFilter(filter)}>{filter}</button>)}
        </div>
      </div>

      <section className="catalog-section">
        <div className="section-heading">
          <h2>{Object.keys(progress).length ? '继续读下去' : '编辑选择'}</h2>
          <span>{articles.length} 篇 · 持续更新</span>
        </div>
        {visibleArticles.length ? displayedArticles.map((item) => (
          <button className="article-entry" key={item.id} onClick={() => navigate(`/read/${item.id}`)}>
            <div className="article-monogram" aria-hidden="true"><span>{item.monogram}</span><small>TED × MARGINALIA</small><i /></div>
            <div className="article-entry-copy">
              <span className="article-meta">FEATURED ESSAY · ENGLISH {item.level}</span>
              <h3>{item.title}</h3>
              <p>{item.titleZh}：{item.dekZh}</p>
              <div className="article-facts"><span>{item.minutes} MIN READ</span><span>{item.paragraphs.reduce((count, paragraph) => count + paragraph.annotations.length, 0)} NOTES</span><span>TED SOURCE</span></div>
              {progress[item.id] && <div className="entry-progress"><span style={{ width: `${Math.round((progress[item.id]?.completion ?? 0) * 100)}%` }} /></div>}
              <span className="article-open">{progress[item.id] ? '继续阅读' : '开始阅读'} <ChevronRight size={15} /></span>
            </div>
          </button>
        )) : <div className="empty-state"><p>暂时没有符合条件的文章。</p><button onClick={() => { setQuery(''); setActiveFilter('全部') }}>清除筛选</button></div>}
        {!query && activeFilter === '全部' && visibleArticles.length > 10 && <button className="atlas-more" onClick={() => setShowAllArticles((value) => !value)}>{showAllArticles ? '收起月度目录' : `展开全部 ${visibleArticles.length} 篇`} <ChevronDown size={16} className={showAllArticles ? 'rotated' : ''} /></button>}
      </section>

      <div className="catalog-manifesto"><span>EDITOR'S NOTE</span><p>这里会刻意保持小而精。每篇文章出现前，都必须完成来源、内容与学习注释审核。</p></div>
    </main>
  )
}

function ReaderPage() {
  const { articleId } = useParams()
  const navigate = useNavigate()
  const selectedArticle = articles.find((item) => item.id === articleId)
  const [mode, setMode] = useState<'original' | 'bilingual'>('original')
  const [openTranslations, setOpenTranslations] = useState<Set<string>>(new Set())
  const [activeAnnotation, setActiveAnnotation] = useState<Annotation | null>(null)
  const [progress, setProgressState] = useState(0)
  const [restored, setRestored] = useState(false)
  const [answer, setAnswer] = useState<string | null>(null)
  const [primerAnswer, setPrimerAnswer] = useState<number | null>(null)
  const [articleSaved, setArticleSaved] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    if (!selectedArticle) return
    void isBookmarked('article', selectedArticle.id).then(setArticleSaved)
    void getProgress(selectedArticle.id).then((saved) => {
      if (saved && !restored) {
        setProgressState(saved.completion)
        requestAnimationFrame(() => document.getElementById(`paragraph-${saved.paragraphId}`)?.scrollIntoView({ block: 'start' }))
      }
      setRestored(true)
    })
  }, [selectedArticle, restored])

  useEffect(() => {
    if (!restored || !selectedArticle) return
    const nodes = document.querySelectorAll<HTMLElement>('[data-paragraph]')
    observerRef.current = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (!visible) return
      const index = Number((visible.target as HTMLElement).dataset.index)
      const next = Math.min(1, (index + 1) / selectedArticle.paragraphs.length)
      setProgressState(next)
      void saveProgress({ articleId: selectedArticle.id, paragraphId: selectedArticle.paragraphs[index].id, completion: next, completed: next === 1, updatedAt: new Date().toISOString() })
    }, { rootMargin: '-28% 0px -48% 0px', threshold: [0, 0.25, 0.6] })
    nodes.forEach((node) => observerRef.current?.observe(node))
    return () => observerRef.current?.disconnect()
  }, [restored, selectedArticle])

  if (!selectedArticle) return <FuturePage section="没有找到这篇文章" phase="404" message="当前精选阅读中还没有这项内容。" />

  const toggleTranslation = (id: string) => setOpenTranslations((current) => {
    const next = new Set(current)
    next.has(id) ? next.delete(id) : next.add(id)
    return next
  })

  return (
    <main className="reader-page">
      <div className="reader-progress"><span style={{ width: `${Math.round(progress * 100)}%` }} /></div>
      <header className="reader-toolbar">
        <button className="icon-button" onClick={() => navigate('/read')} aria-label="返回阅读目录"><ArrowLeft size={21} /></button>
        <span className="reader-brand">Marginalia</span>
        <button className={articleSaved ? 'icon-button saved' : 'icon-button'} aria-label={articleSaved ? '取消收藏文章' : '收藏文章'} onClick={async () => setArticleSaved(await toggleBookmark('article', selectedArticle.id))}><Bookmark size={20} fill={articleSaved ? 'currentColor' : 'none'} /></button>
      </header>

      <article className="reading-sheet">
        <header className="article-header">
          <div className="article-meta">英语 · 心理学 · {selectedArticle.minutes} 分钟</div>
          <h1>{selectedArticle.title}</h1>
          <p className="article-dek">{selectedArticle.dek}</p>
          <p className="article-dek-zh">{selectedArticle.titleZh}：{selectedArticle.dekZh}</p>
          <div className="byline"><a href={selectedArticle.sourceUrl} target="_blank" rel="noreferrer">{selectedArticle.source} <ExternalLink size={11} /></a><span>{selectedArticle.sourceNote}</span></div>
          <div className="reader-primer">
            <span>读前判断 · 没有答错</span>
            <p>{selectedArticle.primer.question}</p>
            <div>
              {selectedArticle.primer.choices.map((choice, index) => <button key={choice} className={primerAnswer === index ? 'selected' : ''} onClick={() => setPrimerAnswer(index)}>{choice}</button>)}
            </div>
            {primerAnswer !== null && <small>{selectedArticle.primer.feedback[primerAnswer]}</small>}
          </div>
        </header>

        <div className="mode-row">
          <span>阅读模式</span>
          <div className="segmented" role="group" aria-label="阅读模式">
            <button className={mode === 'original' ? 'active' : ''} onClick={() => setMode('original')}>仅原文</button>
            <button className={mode === 'bilingual' ? 'active' : ''} onClick={() => setMode('bilingual')}>双语</button>
          </div>
        </div>

        <div className="reading-body">
          {selectedArticle.paragraphs.map((paragraph, index) => {
            const showTranslation = mode === 'bilingual' || openTranslations.has(paragraph.id)
            return (
              <section className="paragraph-block" id={`paragraph-${paragraph.id}`} data-paragraph data-index={index} key={paragraph.id}>
                <span className="paragraph-number">{String(index + 1).padStart(2, '0')}</span>
                <p>{renderAnnotatedText(paragraph.original, paragraph.annotations, setActiveAnnotation)}</p>
                {showTranslation && <p className="translation" lang="zh-CN">{paragraph.translation}</p>}
                {mode === 'original' && (
                  <button className="translation-toggle" onClick={() => toggleTranslation(paragraph.id)}>
                    {showTranslation ? 'Hide translation' : '查看译文'} <ChevronDown size={15} className={showTranslation ? 'rotated' : ''} />
                  </button>
                )}
              </section>
            )
          })}
        </div>

        <section className="understanding">
          <span className="section-label">理解检查</span>
          <h2>{selectedArticle.quiz.prompt}</h2>
          {selectedArticle.quiz.choices.map((choice) => <button key={choice.id} className={answer === choice.id ? `quiz-option selected ${choice.id === selectedArticle.quiz.answer ? 'correct' : 'incorrect'}` : 'quiz-option'} onClick={() => setAnswer(choice.id)}><span>{choice.id.toUpperCase()}</span>{choice.text}{answer === choice.id && <Check size={18} />}</button>)}
          {answer && <div className={answer === selectedArticle.quiz.answer ? 'answer-note correct' : 'answer-note'}>{answer === selectedArticle.quiz.answer ? selectedArticle.quiz.correctFeedback : selectedArticle.quiz.incorrectFeedback}</div>}
        </section>

        <footer className="reading-footer"><span>阅读结束</span><p>{selectedArticle.closingPrompt}</p><button onClick={() => navigate('/read')}>继续选读</button></footer>
      </article>

      {activeAnnotation && <AnnotationSheet annotation={activeAnnotation} sourceArticleId={selectedArticle.id} onClose={() => setActiveAnnotation(null)} />}
    </main>
  )
}

function renderAnnotatedText(text: string, annotations: Annotation[], onSelect: (annotation: Annotation) => void) {
  if (!annotations.length) return text
  const pattern = new RegExp(`(${annotations.map((item) => item.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi')
  return text.split(pattern).map((part, index) => {
    const annotation = annotations.find((item) => item.text.toLowerCase() === part.toLowerCase())
    return annotation ? <button key={`${part}-${index}`} className={`annotation ${annotation.type}`} onClick={() => onSelect(annotation)}>{part}</button> : part
  })
}

function AnnotationSheet({ annotation, sourceArticleId, onClose }: { annotation: Annotation; sourceArticleId: string; onClose: () => void }) {
  const navigate = useNavigate()
  const isVocab = annotation.type === 'vocabulary'
  const vocabularyEntry = vocabulary[annotation.targetId as keyof typeof vocabulary]
  const legacyConcept = concepts[annotation.targetId as keyof typeof concepts]
  const detailedConcept = conceptDetails.find((item) => item.id === annotation.targetId)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const entityType = isVocab ? 'vocabulary' : 'concept'
    void isBookmarked(entityType, annotation.targetId).then(setSaved)
    const handleEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [annotation.targetId, isVocab, onClose])

  const saveEntry = async () => {
    const entityType = isVocab ? 'vocabulary' : 'concept'
    setSaved(await toggleBookmark(entityType, annotation.targetId, sourceArticleId))
  }
  return (
    <div className="sheet-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className="bottom-sheet" role="dialog" aria-modal="true" aria-label={isVocab ? '词汇解释' : '概念预览'}>
        <div className="sheet-handle" />
        <button className="sheet-close" onClick={onClose} aria-label="关闭"><X size={20} /></button>
        <span className="section-label">{isVocab ? '词汇' : '概念预览'}</span>
        {isVocab ? (
          <>
            <h2>{vocabularyEntry.lemma}</h2>
            <p className="pronunciation">{vocabularyEntry.pos} · {vocabularyEntry.pronunciation}</p>
            <p className="sheet-definition">{vocabularyEntry.meaning}</p>
            <div className="context-example"><small>文章中的语境</small><p>“{vocabularyEntry.context}”</p></div>
            <div className="context-example"><small>例句</small><p>{vocabularyEntry.example}</p></div>
            <button className={saved ? 'primary-action saved-action' : 'primary-action'} onClick={saveEntry}><Bookmark size={17} fill={saved ? 'currentColor' : 'none'} /> {saved ? '已保存到本设备' : '收藏词汇'} <span>{saved ? '等待进入书库' : '本地保存'}</span></button>
          </>
        ) : (
          <>
            <h2>{detailedConcept?.nameEn ?? legacyConcept?.name}</h2>
            <p className="concept-zh">{detailedConcept?.nameZh ?? legacyConcept?.nameZh}</p>
            <p className="sheet-definition">{detailedConcept?.intuition ?? legacyConcept?.definition}</p>
            <div className="context-example"><small>需要分清</small><p>{detailedConcept?.misconception.body ?? legacyConcept?.note}</p></div>
            <button className={saved ? 'primary-action muted-action saved-action' : 'primary-action muted-action'} onClick={saveEntry}><Bookmark size={17} fill={saved ? 'currentColor' : 'none'} /> {saved ? '已收藏概念' : '记住这个概念'} <span>本地保存</span></button>
            <button className="sheet-deep-link" onClick={() => { onClose(); navigate(detailedConcept ? `/explore/${detailedConcept.slug}` : '/explore') }}>进入知识探索 <ChevronRight size={16} /></button>
          </>
        )}
      </section>
    </div>
  )
}

function FuturePage({ section, phase, message }: { section: string; phase: string; message: string }) {
  return (
    <main className="page page-with-nav future-page">
      <BrandHeader eyebrow={phase} />
      <div className="future-number">{phase.replace('Phase ', '0')}</div>
      <span className="kicker">已规划，但不伪装完成</span>
      <h1>{section}</h1>
      <p>{message}</p>
      <div className="future-rule" />
      <small>这一入口用于确认最终信息架构。当前阶段不提供虚假内容或不可用操作。</small>
    </main>
  )
}

export default App
