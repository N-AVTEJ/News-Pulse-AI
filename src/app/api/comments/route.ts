import { NextRequest, NextResponse } from 'next/server';
import { addComment, getComments } from '@/lib/enterprise/comments';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const targetType = (searchParams.get('targetType') as 'CLUSTER' | 'INVESTIGATION') || 'CLUSTER';
  const targetId = searchParams.get('targetId') || '';

  const comments = getComments(targetType, targetId);

  return NextResponse.json({
    totalCount: comments.length,
    comments
  }, { status: 200 });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.targetId || !body.text) {
      return NextResponse.json({ error: 'targetId and text are required.' }, { status: 400 });
    }

    const comment = addComment(
      body.targetType || 'CLUSTER',
      body.targetId,
      body.text,
      body.authorId || 'mem_analyst_01',
      body.authorName || 'Alex Vance',
      body.authorRole || 'ANALYST',
      body.quotedEvidence
    );

    return NextResponse.json({ comment }, { status: 201 });

  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown comments API error';
    return NextResponse.json(
      { error: 'Failed to post comment.', details: errorMsg },
      { status: 500 }
    );
  }
}
