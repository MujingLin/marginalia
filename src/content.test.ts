import { describe, expect, it } from 'vitest'
import { articles, concepts, vocabulary } from './content'
import { koreanLessons, stageZeroQuestions } from './koreanContent'
import { conceptDetails, conceptIndex } from './conceptContent'
import { stockChapters, stockLessons } from './stockContent'

describe('Phase 1 learning content', () => {
  it('keeps every annotation connected to a real entry', () => {
    const conceptIds = new Set([...Object.keys(concepts), ...conceptIndex.map((concept) => concept.id)])
    for (const article of articles) {
      for (const paragraph of article.paragraphs) {
        for (const annotation of paragraph.annotations) {
          expect(annotation.type === 'vocabulary' ? annotation.targetId in vocabulary : conceptIds.has(annotation.targetId)).toBe(true)
        }
      }
    }
  })

  it('provides a translation for every paragraph', () => {
    expect(articles.length).toBeGreaterThanOrEqual(30)
    expect(new Set(articles.map((article) => article.id)).size).toBe(articles.length)
    expect(articles.every((article) => article.paragraphs.length >= 4 && article.paragraphs.every((paragraph) => paragraph.translation.trim().length > 0))).toBe(true)
    expect(articles.every((article) => new URL(article.sourceUrl).protocol === 'https:')).toBe(true)
    expect(articles.filter((article) => article.source.startsWith('TED')).every((article) => new URL(article.sourceUrl).hostname.endsWith('ted.com') && new URL(article.sourceUrl).pathname.startsWith('/talks/'))).toBe(true)
    expect(articles.every((article) => article.quiz.choices.some((choice) => choice.id === article.quiz.answer))).toBe(true)
  })
})

describe('Phase 2 Korean course content', () => {
  it('provides a complete short-session path for every lesson', () => {
    expect(koreanLessons.length).toBeGreaterThanOrEqual(30)
    expect(koreanLessons.flatMap((lesson) => lesson.sessions).length).toBeGreaterThanOrEqual(90)
    expect(new Set(koreanLessons.map((lesson) => lesson.id)).size).toBe(koreanLessons.length)
    expect(koreanLessons.map((lesson) => lesson.sequence)).toEqual(koreanLessons.map((_, index) => index + 1))
    for (const lesson of koreanLessons) {
      expect(lesson.sessions.length).toBeGreaterThanOrEqual(3)
      for (const session of lesson.sessions) {
        expect(session.activities.length).toBeGreaterThan(0)
      }
    }
  })

  it('keeps activity ids unique and selectable answers valid', () => {
    const activities = koreanLessons.flatMap((lesson) => lesson.sessions.flatMap((session) => session.activities))
    expect(new Set(activities.map((activity) => activity.id)).size).toBe(activities.length)
    for (const activity of activities) {
      if (activity.type === 'choice' || activity.type === 'listen') {
        expect(activity.choices).toContain(activity.answer)
      }
    }
  })

  it('provides a valid answer for every diagnostic question', () => {
    for (const question of stageZeroQuestions) expect(question.choices).toContain(question.answer)
  })
})

describe('Phase 3 concept content', () => {
  it('keeps ids unique and every relation resolvable', () => {
    expect(conceptDetails.length).toBeGreaterThanOrEqual(6)
    expect(conceptIndex.length).toBeGreaterThanOrEqual(100)
    expect(new Set(conceptIndex.map((concept) => concept.id)).size).toBe(conceptIndex.length)
    const ids = new Set(conceptIndex.map((concept) => concept.id))
    for (const concept of conceptDetails) {
      expect(concept.sources.length).toBeGreaterThan(0)
      expect(concept.related.length).toBeGreaterThanOrEqual(2)
      for (const relation of concept.related) expect(ids.has(relation.targetId)).toBe(true)
    }
  })

  it('keeps quiz answers within their choice arrays', () => {
    for (const concept of conceptDetails) {
      expect(concept.check.answer).toBeLessThan(concept.check.choices.length)
      if (concept.activity.type === 'scenario') {
        expect(concept.activity.answer).toBeLessThan(concept.activity.choices.length)
        expect(concept.activity.explanations.length).toBe(concept.activity.choices.length)
      }
    }
  })
})

describe('Beginner stock curriculum', () => {
  it('provides a sequential five-chapter learning path', () => {
    expect(stockChapters).toHaveLength(5)
    expect(stockLessons).toHaveLength(15)
    expect(stockLessons.map((lesson) => lesson.sequence)).toEqual(stockLessons.map((_, index) => index + 1))
    expect(new Set(stockLessons.map((lesson) => lesson.id)).size).toBe(stockLessons.length)
    for (const chapter of stockChapters) expect(stockLessons.filter((lesson) => lesson.chapter === chapter.number)).toHaveLength(3)
  })

  it('keeps every lesson interactive, sourced, and risk-aware', () => {
    for (const lesson of stockLessons) {
      expect(lesson.essentials).toHaveLength(3)
      expect(lesson.challenge.answer).toBeLessThan(lesson.challenge.choices.length)
      expect(lesson.practice.length).toBeGreaterThan(10)
      expect(lesson.caution.length).toBeGreaterThan(10)
      expect(new URL(lesson.source.url).protocol).toBe('https:')
    }
  })
})
