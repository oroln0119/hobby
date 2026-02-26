/**
 * Notion → Supabase import 스크립트
 *
 * 실행: npx tsx --env-file=.env.local scripts/import-from-notion.ts
 */

import { createClient } from '@supabase/supabase-js';

const NOTION_TOKEN = process.env.NOTION_TOKEN!;
const PROJECTS_DB_ID = process.env.NOTION_PROJECTS_DB_ID!;
const INVENTORY_DB_ID = process.env.NOTION_INVENTORY_DB_ID!;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

// ── Notion API helpers ──────────────────────────────────────────

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

// ── 필드 추출 helpers ────────────────────────────────────────────

const text = (prop: any): string =>
  prop?.rich_text?.map((t: any) => t.plain_text).join('') ?? '';

const title = (prop: any): string =>
  prop?.title?.map((t: any) => t.plain_text).join('') ?? '';

const select = (prop: any): string => prop?.select?.name ?? '';

const status = (prop: any): string => prop?.status?.name ?? '';

const num = (prop: any): number | null => prop?.number ?? null;

const date = (prop: any): string | null => prop?.date?.start ?? null;

const url = (prop: any): string | null => prop?.url ?? null;

// Material 정규화 (Supabase CHECK 제약에 맞게)
function normalizeMaterial(raw: string): string {
  const map: Record<string, string> = {
    bamboo: 'Bamboo',
    metal: 'Metal',
    plastic: 'Plastic',
    wood: 'Wood',
    carbon: 'Carbon',
    stainless: 'Metal',
    steel: 'Metal',
    aluminum: 'Metal',
    aluminium: 'Metal',
  };
  return map[raw.toLowerCase()] ?? 'Metal';
}

// ── 인벤토리 import ──────────────────────────────────────────────

async function importInventory() {
  console.log('📦 인벤토리 가져오는 중...');
  const pages = await notionQuery(INVENTORY_DB_ID);
  console.log(`  ${pages.length}개 항목 발견`);

  const sets = [];
  const items = [];

  for (const page of pages) {
    const p = page.properties;
    const id = page.id.replace(/-/g, '');

    const brand = title(p['Brand']);
    const category = select(p['Tool Type']) as 'Knitting' | 'Crochet' | 'Cable';
    const sizeNum = num(p['Size']);
    const size = sizeNum !== null ? String(sizeNum) : '';
    const needleLength = text(p['Length']);
    const materialRaw = text(p['Material']);
    const material = normalizeMaterial(materialRaw);
    const productName = text(p['Name']);
    const origin = select(p['Origin']);
    const quantity = num(p['Quantity']) ?? 1;

    const notes = [
      productName ? `${productName}` : null,
      origin ? `(${origin})` : null,
    ]
      .filter(Boolean)
      .join(' ') || undefined;

    sets.push({
      id,
      category,
      brand,
      material,
      size,
      needle_length: needleLength,
      notes: notes ?? null,
      created_at: page.created_time,
      updated_at: page.last_edited_time,
    });

    items.push({
      id: `${id}-item`,
      set_id: id,
      quantity,
      condition: 'Good',
    });
  }

  // upsert inventory_sets
  const { error: setsError } = await supabase
    .from('inventory_sets')
    .upsert(sets, { onConflict: 'id' });

  if (setsError) {
    console.error('  ✗ inventory_sets:', setsError.message);
    return;
  }

  // upsert inventory_items
  const { error: itemsError } = await supabase
    .from('inventory_items')
    .upsert(items, { onConflict: 'id' });

  if (itemsError) {
    console.error('  ✗ inventory_items:', itemsError.message);
    return;
  }

  for (const s of sets) {
    console.log(`  ✓ ${s.brand} ${s.size} (${s.category})`);
  }
}

// ── 프로젝트 import ──────────────────────────────────────────────

// Notion Progress 상태를 앱 상태로 변환
function mapStatus(raw: string): '시작 전' | '진행 중' | '완료' {
  if (raw === '완료' || raw === 'Complete') return '완료';
  if (raw === '진행 중' || raw === 'In progress') return '진행 중';
  return '시작 전';
}

async function importProjects() {
  console.log('\n🧶 프로젝트 가져오는 중...');
  const pages = await notionQuery(PROJECTS_DB_ID);
  console.log(`  ${pages.length}개 항목 발견`);

  const rows = [];

  for (const page of pages) {
    const p = page.properties;
    const id = page.id.replace(/-/g, '');

    const name = title(p['이름']);
    const emoji = page.icon?.type === 'emoji' ? page.icon.emoji : null;
    const progressRaw = status(p['Progress']);
    const projectStatus = mapStatus(progressRaw);
    const type = (select(p['Type']) || 'Pattern') as 'Kit' | 'Pattern';
    const brand = text(p['Brand']) || null;
    const yarn = text(p['Yarn']) || null;
    const size = text(p['Size']) || null;
    const projectUrl = url(p['URL']);
    const gaugeText = text(p['Gauge']) || null;
    const needleText = text(p['Needle']) || null;
    const startDate = date(p['Cast On']);
    const endDate = date(p['Finished Object']);

    // Gauge와 Needle 정보는 notes에 보관
    const notesParts = [
      gaugeText && gaugeText !== '-' ? `게이지: ${gaugeText}` : null,
      needleText && needleText !== '-' ? `바늘: ${needleText}` : null,
    ].filter(Boolean);
    const notes = notesParts.length > 0 ? notesParts.join(' / ') : null;

    rows.push({
      id,
      name,
      emoji,
      status: projectStatus,
      type,
      brand,
      yarn,
      size,
      notes,
      url: projectUrl,
      start_date: startDate,
      end_date: endDate,
      pattern_gauge: null,
      my_gauge: null,
      pattern_tools: [],
      my_tools: [],
      created_at: page.created_time,
      updated_at: page.last_edited_time,
    });
  }

  const { error } = await supabase
    .from('projects')
    .upsert(rows, { onConflict: 'id' });

  if (error) {
    console.error('  ✗ projects:', error.message);
    return;
  }

  for (const r of rows) {
    console.log(`  ✓ ${r.emoji ?? ''} ${r.name} (${r.status})`);
  }
}

// ── main ─────────────────────────────────────────────────────────

async function main() {
  console.log('🚀 Notion → Supabase import 시작\n');
  await importInventory();
  await importProjects();
  console.log('\n✅ 완료!');
}

main().catch((err) => {
  console.error('import 실패:', err);
  process.exit(1);
});
