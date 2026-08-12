import { AnnotationItem } from './types';

const annotationsStore: AnnotationItem[] = [];

export function addAnnotation(
  targetId: string,
  authorName: string,
  selectedText: string,
  note: string
): AnnotationItem {
  const item: AnnotationItem = {
    id: `ann_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    targetId,
    authorName,
    selectedText,
    note,
    createdAt: new Date().toISOString()
  };

  annotationsStore.unshift(item);
  return item;
}

export function getAnnotations(targetId: string): AnnotationItem[] {
  return annotationsStore.filter(a => a.targetId === targetId);
}
