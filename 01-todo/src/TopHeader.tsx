// 2. 부모에게서 viewMode와 setViewMode를 Props로 받아옵니다.
interface TopHeaderProps {
  viewMode: string;
  selectedDate: string;
  setViewMode: (mode: string) => void;
}

function TopHeader({ viewMode, selectedDate, setViewMode }: TopHeaderProps) {
  const selectedDateTitle = selectedDate.split('-').join('');
  const selectedYear = selectedDateTitle.slice(0,4)
  const selectedMonth = selectedDateTitle.slice(4,6)
  const selectedYM = selectedYear +'년 ' + selectedMonth + '월'

  return (
    <div className="top-header">
      <h1 className="app-title">
        {selectedYM}
      </h1>
      <div className="view-mode-toggle">
        
        {/* 리스트 버튼 */}
        <button 
          onClick={() => setViewMode('list')}
          className={`view-mode-button ${['list', 'add', 'edit'].includes(viewMode) ? 'active' : ''}`}
        >
          일
        </button>

        {/* 주간 버튼 */}
        <button 
          onClick={() => setViewMode('weekly')}
          className={`view-mode-button ${viewMode === 'weekly' ? 'active' : ''}`}
        >
          주
        </button>

        {/* 월간 버튼 */}
        <button 
          onClick={() => setViewMode('monthly')}
          className={`view-mode-button ${viewMode === 'monthly' ? 'active' : ''}`}
        >
          월
        </button>

      </div>
    </div>
  );
}

export default TopHeader; // 대문자로 내보내기