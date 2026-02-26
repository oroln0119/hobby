-- ──────────────────────────────────────────────
-- Needle Inventory & Projects Schema
-- ──────────────────────────────────────────────

-- 인벤토리 세트 (구매 단위)
CREATE TABLE IF NOT EXISTS inventory_sets (
  id            TEXT PRIMARY KEY,
  category      TEXT NOT NULL CHECK (category IN ('Knitting', 'Crochet', 'Cable')),
  brand         TEXT NOT NULL,
  material      TEXT NOT NULL CHECK (material IN ('Bamboo', 'Metal', 'Plastic', 'Wood', 'Carbon')),
  size          TEXT NOT NULL,
  needle_length TEXT NOT NULL,
  notes         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 세트 내 개별 바늘
CREATE TABLE IF NOT EXISTS inventory_items (
  id        TEXT PRIMARY KEY,
  set_id    TEXT NOT NULL REFERENCES inventory_sets(id) ON DELETE CASCADE,
  quantity  INTEGER NOT NULL DEFAULT 1,
  condition TEXT NOT NULL CHECK (condition IN ('Good', 'Fair', 'Poor')),
  notes     TEXT
);

-- 썸네일 Storage 버킷 (Dashboard에서 직접 생성하거나 아래 주석 참고)
-- 버킷명: project-thumbnails, Public: true

-- 프로젝트
CREATE TABLE IF NOT EXISTS projects (
  id             TEXT PRIMARY KEY,
  name           TEXT NOT NULL,
  emoji          TEXT,
  status         TEXT NOT NULL CHECK (status IN ('시작 전', '진행 중', '완료')),
  type           TEXT NOT NULL CHECK (type IN ('Kit', 'Pattern')),
  brand          TEXT,
  start_date     DATE,
  end_date       DATE,
  size           TEXT,
  yarn           TEXT,
  notes          TEXT,
  url            TEXT,
  pattern_gauge  JSONB,   -- { stitches, rows, needleSize? }
  my_gauge       JSONB,   -- { stitches, rows, needleSize? }
  thumbnail_url  TEXT,
  pattern_tools  JSONB NOT NULL DEFAULT '[]',  -- ToolReference[]
  my_tools       JSONB NOT NULL DEFAULT '[]',  -- ToolReference[]
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
