export interface Batch {
  _id: string;
  batchId: string;
  batchName: string;
  batchPrice?: number;
  batchImage?: string;
  template?: string;
  BatchType?: string;
  language?: string;
  byName?: string;
  startDate?: string;
  endDate?: string;
  batchStatus?: boolean;
  slug?: string;
}

export interface Teacher {
  _id: string;
  firstName?: string;
  lastName?: string;
  qualification?: string;
  experience?: string;
  featuredLine?: string;
  subject?: string;
  imageId?: {
    baseUrl?: string;
    key?: string;
  };
}

export interface Subject {
  _id: string;
  subject: string;
  subjectId?: string;
  description?: string;
  slug: string;
  tagCount?: number;
  lectureCount?: number;
  imageId?: {
    baseUrl?: string;
    key?: string;
  };
  teacherIds?: Teacher[];
}

export interface BatchDetails extends Batch {
  name?: string;
  description?: string;
  shortDescription?: string;
  subjects?: Subject[];
  khazanaProgramId?: string;
}

export interface Chapter {
  _id: string;
  name: string;
  type?: string;
  typeId?: string;
  displayOrder?: number;
  notes?: number;
  exercises?: number;
  videos?: number;
  lectureVideos?: number;
  slug: string;
}

export interface VideoContent {
  _id: string;
  id?: string;
  name?: string;
  image?: string;
  videoUrl?: string;
  description?: string;
  duration?: string;
  status?: string;
  types?: string[];
  drmProtected?: boolean;
  hls_url?: string;
}

export interface HomeworkItem {
  _id: string;
  topic?: string;
  note?: string;
  attachmentIds?: Array<{
    _id: string;
    name?: string;
    baseUrl?: string;
    key?: string;
  }>;
  status?: string;
}

export interface ExerciseItem {
  _id: string;
  title: string;
  slug?: string;
  dppId?: string;
  totalMarks?: number;
  totalQuestions?: number;
}

export interface TopicItem {
  _id: string;
  topic: string;
  lectureType?: string;
  startTime?: string;
  endTime?: string;
  date?: string;
  duration?: string;
  slug?: string;
  status?: string;
  videoDetails?: VideoContent;
  homeworkIds?: HomeworkItem[];
  exerciseIds?: ExerciseItem[];
  hasAttachment?: boolean;
  isVideoLecture?: boolean;
}

export interface Announcement {
  _id: string;
  title?: string;
  description?: string;
  createdAt?: string;
  author?: string;
  bannerImage?: string;
  attachmentUrl?: string;
}

export interface TestItem {
  _id: string;
  title: string;
  duration?: number;
  totalQuestions?: number;
  totalMarks?: number;
  startDate?: string;
  endDate?: string;
  status?: string;
  isSubjective?: boolean;
}
