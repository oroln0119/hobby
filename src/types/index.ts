// ─── 인벤토리 ──────────────────────────────────────────────────────────

export type NeedleCategory = 'Knitting' | 'Crochet' | 'Cable';
export type NeedleMaterial = 'Bamboo' | 'Metal' | 'Plastic' | 'Wood' | 'Carbon';
export type ItemCondition = 'Good' | 'Fair' | 'Poor';

/** 구매 단위 세트 (예: "Clover Takumi 8mm 5개입 세트") */
export interface InventorySet {
  id: string;
  category: NeedleCategory;
  brand: string;
  material: NeedleMaterial;
  size: string;          // "8", "4.5mm", "5.0mm"
  needleLength: string;  // "5in", "9in", "80cm"
  notes?: string;
  items: InventoryItem[];
  createdAt: string;
  updatedAt: string;
}

/** 세트 내 개별 물리적 바늘 */
export interface InventoryItem {
  id: string;
  setId: string;
  quantity: number;
  condition: ItemCondition;
  notes?: string;
}

// ─── 프로젝트 ──────────────────────────────────────────────────────────

export type ProjectStatus = '시작 전' | '진행 중' | '완료';
export type ProjectType   = 'Kit' | 'Pattern';

export interface Gauge {
  stitches: number;    // 10cm당 코 수
  rows: number;        // 10cm당 단 수
  needleSize?: string; // 게이지 스와치에 사용한 바늘 사이즈
}

/** 도안에서 요구하거나 실제 사용한 도구 */
export interface ToolReference {
  category: NeedleCategory;
  size: string;
  needleLength?: string;
  material?: NeedleMaterial;
  brand?: string;
  notes?: string;
}

export interface Project {
  id: string;
  name: string;
  emoji?: string;       // 프로젝트 아이콘 이모지 (예: 👕, 👜)
  status: ProjectStatus;
  type: ProjectType;
  brand?: string;
  startDate?: string;   // ISO date string "YYYY-MM-DD"
  endDate?: string;
  size?: string;        // 의류 사이즈: XS/S/M/L 또는 수치
  yarn?: string;        // 사용 실 자유 텍스트
  thumbnailUrl?: string;
  notes?: string;
  url?: string;         // 도안/키트 구매 URL
  patternGauge?: Gauge;
  myGauge?: Gauge;
  patternTools: ToolReference[];   // 도안 권장 도구
  myTools: ToolReference[];        // 실제 사용한 도구
  createdAt: string;
  updatedAt: string;
}

// ─── 재고 체크 ─────────────────────────────────────────────────────────

export type CheckStatus = 'owned' | 'missing';

export interface ToolCheckResult {
  tool: ToolReference;
  status: CheckStatus;
  matchedSetId?: string;
  matchedQuantity?: number;
}

// ─── UI 상태 ───────────────────────────────────────────────────────────

export type TabId = 'projects' | 'inventory' | 'settings';

export type ProjectFilterStatus = ProjectStatus | 'all';
export type InventoryFilterCategory = NeedleCategory | 'all';
