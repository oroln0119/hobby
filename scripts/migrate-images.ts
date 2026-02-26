/**
 * Notion 첨부 이미지 → Supabase Storage 이전 스크립트
 *
 * 실행 전: Supabase Dashboard → Storage → New Bucket
 *   이름: project-thumbnails, Public: ✓
 *
 * 실행: npx tsx --env-file=.env.local scripts/migrate-images.ts
 */

import { createClient } from '@supabase/supabase-js';

const NOTION_TOKEN = process.env.NOTION_TOKEN!;
const PROJECTS_DB_ID = process.env.NOTION_PROJECTS_DB_ID!;
const BUCKET = 'project-thumbnails';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

async function notionQuery(databaseId: string): Promise<any[]> {
  const results: any[] = [];
  let cursor: string | undefined;
  do {
    const body: any = { page_size: 100 };
    if (cursor) body.start_cursor = cursor;
    const res = await fetch(
      `https://api.notion.com/v1/databases/${databaseId}/query`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${NOTION_TOKEN}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      },
    );
    const data = await res.json();
    if (!res.ok) throw new Error(`Notion API error: ${JSON.stringify(data)}`);
    results.push(...data.results);
    cursor = data.has_more ? data.next_cursor : undefined;
  } while (cursor);
  return results;
}

async function getFirstImageUrl(pageId: string): Promise<string | null> {
  const res = await fetch(
    `https://api.notion.com/v1/blocks/${pageId}/children?page_size=10`,
    {
      headers: {
        Authorization: `Bearer ${NOTION_TOKEN}`,
        'Notion-Version': '2022-06-28',
      },
    },
  );
  const data = await res.json();
  for (const block of data.results ?? []) {
    if (block.type === 'image') {
      const img = block.image;
      if (img.type === 'file') return img.file.url;
      if (img.type === 'external') return img.external.url;
    }
  }
  return null;
}

async function uploadToSupabase(
  projectId: string,
  imageUrl: string,
): Promise<string | null> {
  const res = await fetch(imageUrl);
  if (!res.ok) return null;

  const contentType = res.headers.get('content-type') ?? 'image/jpeg';
  const ext = contentType.includes('png') ? 'png' : contentType.includes('webp') ? 'webp' : 'jpg';
  const path = `${projectId}.${ext}`;
  const buffer = await res.arrayBuffer();

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, buffer, { contentType, upsert: true });

  if (error) {
    console.error(`  ✗ storage upload [${projectId}]:`, error.message);
    return null;
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

async function main() {
  console.log('🖼️  Notion 이미지 → Supabase Storage 이전 시작\n');

  const pages = await notionQuery(PROJECTS_DB_ID);

  for (const page of pages) {
    const pageId = page.id;
    const dbId = pageId.replace(/-/g, '');
    const name = page.properties['이름']?.title
      ?.map((t: any) => t.plain_text)
      .join('') ?? pageId;

    const notionImageUrl = await getFirstImageUrl(pageId);
    if (!notionImageUrl) {
      console.log(`  - ${name}: 이미지 없음`);
      continue;
    }

    const publicUrl = await uploadToSupabase(dbId, notionImageUrl);
    if (!publicUrl) continue;

    const { error } = await supabase
      .from('projects')
      .update({ thumbnail_url: publicUrl })
      .eq('id', dbId);

    if (error) {
      console.error(`  ✗ DB 업데이트 [${name}]:`, error.message);
    } else {
      console.log(`  ✓ ${name}`);
    }
  }

  console.log('\n✅ 완료!');
}

main().catch((err) => {
  console.error('실패:', err);
  process.exit(1);
});
