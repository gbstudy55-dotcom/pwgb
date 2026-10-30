import { Batch, BatchDetails, Subject, Chapter, TopicItem, Announcement, TestItem } from '../types';

export const APP_NAME = 'GB STUDY';
export const TELEGRAM_LINK = 'https://t.me/GBFreestudy';
export const APP_LOGO = '/gb-study-logo.png';
export const FALLBACK_LOGO = 'https://i.ibb.co/Q3g9fGSt/1791541921524.png';
export const DEFAULT_BATCH_BANNER = '/default-batch-banner.png';

const BASE_URL = ''; // Relative path utilizes Vite proxy / server proxy

async function safeFetch(url: string, options: RequestInit = {}): Promise<Response> {
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Accept': 'application/json',
        ...(options.headers || {})
      }
    });
    if (!res.ok && !url.startsWith('https://')) {
      // Fallback directly to heroku backend if local proxy gave a non-200
      const fallbackUrl = `https://pwmarco-og-06656c44b005-d9e101c9f09c.herokuapp.com${url}`;
      return await fetch(fallbackUrl, options);
    }
    return res;
  } catch (err) {
    if (!url.startsWith('https://')) {
      const fallbackUrl = `https://pwmarco-og-06656c44b005-d9e101c9f09c.herokuapp.com${url}`;
      return await fetch(fallbackUrl, options);
    }
    throw err;
  }
}

export async function getAllBatches(page = 1): Promise<{ data: Batch[]; currentPage: number; totalPages: number }> {
  try {
    const res = await safeFetch(`${BASE_URL}/api/AllBatches?page=${page}`);
    if (!res.ok) throw new Error('Failed to fetch batches');
    const json = await res.json();
    return {
      data: json.data || [],
      currentPage: json.currentPage || page,
      totalPages: json.totalPages || (json.data && json.data.length >= 15 ? page + 1 : page)
    };
  } catch (e) {
    console.error('getAllBatches error:', e);
    return { data: [], currentPage: 1, totalPages: 1 };
  }
}

export async function searchBatches(query: string, page = 1): Promise<{ data: Batch[]; currentPage: number; totalPages: number }> {
  if (!query.trim()) return getAllBatches(page);
  try {
    const res = await safeFetch(`${BASE_URL}/api/searchBatch?name=${encodeURIComponent(query)}&page=${page}`);
    if (!res.ok) throw new Error('Failed to search batches');
    const json = await res.json();
    return {
      data: json.data || [],
      currentPage: json.currentPage || page,
      totalPages: json.totalPages || 1
    };
  } catch (e) {
    console.error('searchBatches error:', e);
    return { data: [], currentPage: 1, totalPages: 1 };
  }
}

export async function getBatchDetails(batchId: string): Promise<BatchDetails | null> {
  try {
    const res = await safeFetch(`${BASE_URL}/api/BatchInfo?BatchId=${batchId}&Type=details`);
    if (!res.ok) throw new Error('Failed to fetch batch details');
    const json = await res.json();
    return json.data || null;
  } catch (e) {
    console.error('getBatchDetails error:', e);
    return null;
  }
}

export async function getBatchAnnouncements(batchId: string, page = 1): Promise<Announcement[]> {
  try {
    const res = await safeFetch(`${BASE_URL}/api/BatchInfo?BatchId=${batchId}&Type=announcement&page=${page}`);
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (e) {
    console.error('getBatchAnnouncements error:', e);
    return [];
  }
}

export async function getSubjectChapters(batchId: string, subjectId: string, page = 1): Promise<Chapter[]> {
  try {
    const res = await safeFetch(`${BASE_URL}/api/SubjectInfo?BatchId=${batchId}&SubjectId=${subjectId}&page=${page}`);
    if (!res.ok) throw new Error('Failed to fetch subject chapters');
    const json = await res.json();
    return json.data || [];
  } catch (e) {
    console.error('getSubjectChapters error:', e);
    return [];
  }
}

export async function getTopicContents(
  batchId: string,
  subjectId: string,
  topicId: string,
  contentType = 'all',
  page = 1
): Promise<TopicItem[]> {
  try {
    const typeParam = contentType === 'lectures' ? 'videos' : contentType;
    const res = await safeFetch(
      `${BASE_URL}/api/TopicInfo?BatchId=${batchId}&SubjectId=${subjectId}&TopicId=${topicId}&ContentType=${typeParam}&page=${page}`
    );
    if (!res.ok) throw new Error('Failed to fetch topic contents');
    const json = await res.json();
    return json.data || [];
  } catch (e) {
    console.error('getTopicContents error:', e);
    return [];
  }
}

export async function getTests(batchId: string, isSubjective = false): Promise<TestItem[]> {
  try {
    const res = await safeFetch(`${BASE_URL}/api/tests?batchId=${batchId}&isSubjective=${isSubjective}`);
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (e) {
    console.error('getTests error:', e);
    return [];
  }
}

export async function getSchedule(batchId: string): Promise<any[]> {
  try {
    const res = await safeFetch(`${BASE_URL}/api/todays-schedule`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ batchId })
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (e) {
    console.error('getSchedule error:', e);
    return [];
  }
}

// Local storage enrollment helpers matching original site behavior
export interface EnrolledBatch {
  batchId: string;
  name: string;
  image?: string;
  byName?: string;
  enrolledAt?: number;
}

export function getEnrolledBatches(): EnrolledBatch[] {
  try {
    const data = localStorage.getItem('enrolledBatches');
    if (!data) return [];
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function isBatchEnrolled(batchId: string): boolean {
  const list = getEnrolledBatches();
  return list.some(b => b.batchId === batchId);
}

export function enrollBatch(batch: { batchId: string; name: string; image?: string; byName?: string }): boolean {
  const list = getEnrolledBatches();
  if (list.some(b => b.batchId === batch.batchId)) return false;
  list.unshift({ ...batch, enrolledAt: Date.now() });
  localStorage.setItem('enrolledBatches', JSON.stringify(list));
  window.dispatchEvent(new Event('batchesUpdated'));
  return true;
}

export function unenrollBatch(batchId: string): boolean {
  const list = getEnrolledBatches();
  const filtered = list.filter(b => b.batchId !== batchId);
  localStorage.setItem('enrolledBatches', JSON.stringify(filtered));
  window.dispatchEvent(new Event('batchesUpdated'));
  return true;
}
