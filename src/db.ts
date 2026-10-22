import Dexie, { type EntityTable } from 'dexie'
import { z } from 'zod'

export interface ReadingProgress {
  articleId: string
  paragraphId: string
  completion: number
  completed: boolean
  updatedAt: string
}

export interface Setting {
  key: string
  value: boolean | string
}

export interface BookmarkRecord {
  id: string
  entityType: 'article' | 'vocabulary' | 'concept'
  entityId: string
  sourceId?: string
  createdAt: string
}

export interface KoreanProgress {
  lessonId: string
  sessionIndex: number
  completedActivityIds: string[]
  correctActivityIds: string[]
  completed: boolean
  updatedAt: string
}

export interface NoteRecord {
  id: string
  targetType: 'article' | 'vocabulary' | 'concept' | 'korean'
  targetId: string
  content: string
  createdAt: string
  updatedAt: string
}

export type ReviewGrade = 'again' | 'hard' | 'good' | 'easy'

export interface ReviewRecord {
  id: string
  entityType: 'vocabulary' | 'concept'
  entityId: string
  sourceId?: string
  mastery: number
  intervalDays: number
  dueAt: string
  updatedAt: string
  history: { grade: ReviewGrade; reviewedAt: string }[]
}

class MarginaliaDatabase extends Dexie {
  progress!: EntityTable<ReadingProgress, 'articleId'>
  settings!: EntityTable<Setting, 'key'>
  bookmarks!: EntityTable<BookmarkRecord, 'id'>
  koreanProgress!: EntityTable<KoreanProgress, 'lessonId'>
  notes!: EntityTable<NoteRecord, 'id'>
  reviews!: EntityTable<ReviewRecord, 'id'>

  constructor() {
    super('marginalia')
    this.version(1).stores({
      progress: 'articleId, updatedAt, completed',
      settings: 'key',
    })
    this.version(2).stores({
      progress: 'articleId, updatedAt, completed',
      settings: 'key',
      bookmarks: 'id, entityType, entityId, createdAt',
    })
    this.version(3).stores({
      progress: 'articleId, updatedAt, completed',
      settings: 'key',
      bookmarks: 'id, entityType, entityId, createdAt',
      koreanProgress: 'lessonId, updatedAt, completed',
    })
    this.version(4).stores({
      progress: 'articleId, updatedAt, completed',
      settings: 'key',
      bookmarks: 'id, entityType, entityId, createdAt',
      koreanProgress: 'lessonId, updatedAt, completed',
      notes: 'id, targetType, targetId, updatedAt',
      reviews: 'id, entityType, entityId, dueAt, updatedAt',
    })
  }
}

export const db = new MarginaliaDatabase()

export async function saveProgress(progress: ReadingProgress) {
  await db.progress.put(progress)
}

export async function getProgress(articleId: string) {
  return db.progress.get(articleId)
}

export async function setSetting(key: string, value: boolean | string) {
  await db.settings.put({ key, value })
}

export async function getSetting(key: string) {
  return db.settings.get(key)
}

export async function isBookmarked(entityType: BookmarkRecord['entityType'], entityId: string) {
  return Boolean(await db.bookmarks.get(`${entityType}:${entityId}`))
}

export async function toggleBookmark(entityType: BookmarkRecord['entityType'], entityId: string, sourceId?: string) {
  const id = `${entityType}:${entityId}`
  const existing = await db.bookmarks.get(id)
  if (existing) {
    await db.bookmarks.delete(id)
    return false
  }
  await db.bookmarks.put({ id, entityType, entityId, sourceId, createdAt: new Date().toISOString() })
  return true
}

export async function getBookmarks() {
  return db.bookmarks.orderBy('createdAt').reverse().toArray()
}

export async function getKoreanProgress(lessonId: string) {
  return db.koreanProgress.get(lessonId)
}

export async function saveKoreanProgress(progress: KoreanProgress) {
  await db.koreanProgress.put(progress)
}

export async function getNotes() {
  return db.notes.orderBy('updatedAt').reverse().toArray()
}

export async function getNote(targetType: NoteRecord['targetType'], targetId: string) {
  return db.notes.get(`${targetType}:${targetId}`)
}

export async function saveNote(targetType: NoteRecord['targetType'], targetId: string, content: string) {
  const id = `${targetType}:${targetId}`
  const existing = await db.notes.get(id)
  const now = new Date().toISOString()
  if (!content.trim()) {
    await db.notes.delete(id)
    return
  }
  await db.notes.put({ id, targetType, targetId, content: content.trim(), createdAt: existing?.createdAt ?? now, updatedAt: now })
}

export async function getReviews() {
  return db.reviews.toArray()
}

export async function gradeReview(entityType: ReviewRecord['entityType'], entityId: string, grade: ReviewGrade, sourceId?: string) {
  const id = `${entityType}:${entityId}`
  const existing = await db.reviews.get(id)
  const now = new Date()
  const base = existing?.intervalDays ?? 0
  const intervalDays = grade === 'again' ? 0 : grade === 'hard' ? Math.max(1, base) : grade === 'good' ? Math.max(3, base * 2) : Math.max(7, base * 3)
  const due = new Date(now)
  due.setDate(due.getDate() + intervalDays)
  const mastery = grade === 'again' ? 0 : grade === 'hard' ? 1 : grade === 'good' ? 2 : 3
  const record: ReviewRecord = {
    id, entityType, entityId, sourceId, mastery, intervalDays,
    dueAt: due.toISOString(), updatedAt: now.toISOString(),
    history: [...(existing?.history ?? []), { grade, reviewedAt: now.toISOString() }],
  }
  await db.reviews.put(record)
  return record
}

const readingProgressSchema = z.object({ articleId: z.string(), paragraphId: z.string(), completion: z.number(), completed: z.boolean(), updatedAt: z.string() })
const settingSchema = z.object({ key: z.string(), value: z.union([z.boolean(), z.string()]) })
const bookmarkSchema = z.object({ id: z.string(), entityType: z.enum(['article', 'vocabulary', 'concept']), entityId: z.string(), sourceId: z.string().optional(), createdAt: z.string() })
const koreanProgressSchema = z.object({ lessonId: z.string(), sessionIndex: z.number(), completedActivityIds: z.array(z.string()), correctActivityIds: z.array(z.string()), completed: z.boolean(), updatedAt: z.string() })
const noteSchema = z.object({ id: z.string(), targetType: z.enum(['article', 'vocabulary', 'concept', 'korean']), targetId: z.string(), content: z.string(), createdAt: z.string(), updatedAt: z.string() })
const reviewSchema = z.object({ id: z.string(), entityType: z.enum(['vocabulary', 'concept']), entityId: z.string(), sourceId: z.string().optional(), mastery: z.number(), intervalDays: z.number(), dueAt: z.string(), updatedAt: z.string(), history: z.array(z.object({ grade: z.enum(['again', 'hard', 'good', 'easy']), reviewedAt: z.string() })) })

const backupSchema = z.object({
  schemaVersion: z.literal(1),
  exportedAt: z.string(),
  data: z.object({
    progress: z.array(readingProgressSchema), settings: z.array(settingSchema), bookmarks: z.array(bookmarkSchema),
    koreanProgress: z.array(koreanProgressSchema), notes: z.array(noteSchema), reviews: z.array(reviewSchema),
  }),
})

export async function exportBackup() {
  const [progress, settings, bookmarks, koreanProgress, notes, reviews] = await Promise.all([
    db.progress.toArray(), db.settings.toArray(), db.bookmarks.toArray(), db.koreanProgress.toArray(), db.notes.toArray(), db.reviews.toArray(),
  ])
  return JSON.stringify({ schemaVersion: 1, exportedAt: new Date().toISOString(), data: { progress, settings, bookmarks, koreanProgress, notes, reviews } }, null, 2)
}

export async function importBackup(raw: string) {
  const parsed = backupSchema.parse(JSON.parse(raw))
  await db.transaction('rw', [db.progress, db.settings, db.bookmarks, db.koreanProgress, db.notes, db.reviews], async () => {
    await db.progress.bulkPut(parsed.data.progress)
    await db.settings.bulkPut(parsed.data.settings)
    await db.bookmarks.bulkPut(parsed.data.bookmarks)
    await db.koreanProgress.bulkPut(parsed.data.koreanProgress)
    await db.notes.bulkPut(parsed.data.notes)
    await db.reviews.bulkPut(parsed.data.reviews)
  })
}
