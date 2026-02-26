/**
 * Supabase 시드 스크립트
 * mock 데이터를 Supabase에 삽입합니다.
 *
 * 실행: npx tsx scripts/seed.ts
 */

import { createClient } from '@supabase/supabase-js';
import { mockInventorySets, mockProjects } from '../src/data/mock';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // RLS 우회를 위해 service role key 사용
);

async function seedInventory() {
  console.log('📦 인벤토리 데이터 삽입 중...');

  for (const set of mockInventorySets) {
    const { items, createdAt, updatedAt, needleLength, ...rest } = set;

    // inventory_sets 삽입
    const { error: setError } = await supabase
      .from('inventory_sets')
      .upsert({
        ...rest,
        needle_length: needleLength,
        created_at: createdAt,
        updated_at: updatedAt,
      });

    if (setError) {
      console.error(`  ✗ inventory_sets [${set.id}]:`, setError.message);
      continue;
    }

    // inventory_items 삽입
    const itemRows = items.map(({ id, setId, quantity, condition, notes }) => ({
      id,
      set_id: setId,
      quantity,
      condition,
      notes,
    }));

    const { error: itemError } = await supabase
      .from('inventory_items')
      .upsert(itemRows);

    if (itemError) {
      console.error(`  ✗ inventory_items [${set.id}]:`, itemError.message);
    } else {
      console.log(`  ✓ ${set.brand} ${set.size} (${items.length}개)`);
    }
  }
}

async function seedProjects() {
  console.log('\n🧶 프로젝트 데이터 삽입 중...');

  const rows = mockProjects.map(
    ({
      id, name, emoji, status, type, brand,
      startDate, endDate, size, yarn, notes, url,
      patternGauge, myGauge, patternTools, myTools,
      createdAt, updatedAt,
    }) => ({
      id,
      name,
      emoji,
      status,
      type,
      brand,
      start_date: startDate ?? null,
      end_date: endDate ?? null,
      size: size ?? null,
      yarn: yarn ?? null,
      notes: notes ?? null,
      url: url ?? null,
      pattern_gauge: patternGauge ?? null,
      my_gauge: myGauge ?? null,
      pattern_tools: patternTools,
      my_tools: myTools,
      created_at: createdAt,
      updated_at: updatedAt,
    }),
  );

  const { error } = await supabase.from('projects').upsert(rows);

  if (error) {
    console.error('  ✗ projects:', error.message);
  } else {
    for (const p of mockProjects) {
      console.log(`  ✓ ${p.emoji ?? ''} ${p.name} (${p.status})`);
    }
  }
}

async function main() {
  console.log('🚀 Supabase 시드 시작\n');
  await seedInventory();
  await seedProjects();
  console.log('\n✅ 완료!');
}

main().catch((err) => {
  console.error('시드 실패:', err);
  process.exit(1);
});
