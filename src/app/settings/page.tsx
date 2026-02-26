import PageHeader from '@/components/layout/PageHeader';
import SafeAreaContainer from '@/components/layout/SafeAreaContainer';

export default function SettingsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader title="설정" />
      <SafeAreaContainer>
        <div className="p-4 space-y-4">
          {/* 앱 정보 */}
          <div className="bg-white rounded-2xl border border-linen-100 p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-oat-100 flex items-center justify-center text-2xl">
                🧶
              </div>
              <div>
                <h2 className="font-semibold text-linen-900">뜨개 노트</h2>
                <p className="text-xs text-linen-400">뜨개질 프로젝트 & 인벤토리 관리</p>
              </div>
            </div>
            <div className="space-y-1 text-xs text-linen-500">
              <p>버전 1.0.0</p>
            </div>
          </div>

          {/* 데이터 섹션 */}
          <div className="bg-white rounded-2xl border border-linen-100 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-linen-100">
              <h3 className="text-sm font-semibold text-linen-700">데이터</h3>
            </div>
            <button className="w-full flex items-center justify-between p-4 min-h-[52px] active:bg-linen-50 transition-colors">
              <span className="text-sm text-linen-800">데이터 내보내기</span>
              <svg className="w-4 h-4 text-linen-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <button className="w-full flex items-center justify-between p-4 min-h-[52px] active:bg-linen-50 transition-colors border-t border-linen-100">
              <span className="text-sm text-linen-800">노션에서 가져오기</span>
              <svg className="w-4 h-4 text-linen-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* 계정 섹션 */}
          <div className="bg-white rounded-2xl border border-linen-100 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-linen-100">
              <h3 className="text-sm font-semibold text-linen-700">계정</h3>
            </div>
            <button className="w-full flex items-center justify-between p-4 min-h-[52px] active:bg-linen-50 transition-colors">
              <span className="text-sm text-linen-800">로그인 / 회원가입</span>
              <svg className="w-4 h-4 text-linen-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </SafeAreaContainer>
    </div>
  );
}
