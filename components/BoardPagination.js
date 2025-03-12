import React from 'react'; // React 라이브러리를 불러옴 (컴포넌트 생성을 위해 필요)
import '../_css/common.css'; // 공통 CSS 스타일을 불러옴

// BoardPagination 컴포넌트: 페이지네이션 UI를 구성하는 컴포넌트
function BoardPagination({
  page,     // 현재 활성화된 페이지 번호 (예: 1)
  start,    // 현재 페이지 그룹의 시작 번호 (예: 6)
  end,      // 현재 페이지 그룹의 끝 번호 (예: 10)
  prev,     // 이전 페이지 그룹의 존재 여부 (Boolean: true/false)
  next,     // 다음 페이지 그룹의 존재 여부 (Boolean: true/false)
  totalPage, // 전체 페이지 수 (예: 20)
  goToPage  // 페이지 이동을 처리하는 함수 (페이지 번호를 인자로 받아 해당 페이지로 이동)
}) {

  const pages = [];
  // start부터 end까지의 숫자를 배열에 추가 (예: start=6, end=10이면 [6,7,8,9,10]이 됨)
  for (let p = start; p <= end; p++) {
    pages.push(p);
  }

  return (
    <div className="comm_paging_btn">
      {/* 왼쪽 영역: 현재 페이지와 전체 페이지 수 표시 */}
      <div className="flo_side leftx">
        페이지 <strong className="fc_p">{page}</strong> / {totalPage}
      </div>

      {/* 중앙 영역: 페이지 이동 버튼 및 페이지 번호 표시 */}
      <div className="wr_paging">
        {/* 첫 페이지 버튼 */}
        <button
          className="btn_page first"
          onClick={() => goToPage(1)} // 클릭 시 1페이지로 이동하도록 goToPage 함수 호출
          disabled={page === 1}       // 현재 페이지가 1이면 버튼 비활성화
        >
          첫 페이지
        </button>

        {/* 이전 그룹으로 이동하는 버튼 */}
        <button
          className="btn_page prev"
          onClick={() => goToPage(start - 1)} // 클릭 시 현재 그룹의 시작 번호보다 1 작은 페이지로 이동 (이전 그룹의 마지막 페이지)
          disabled={!prev}                   // 이전 그룹이 없으면 (prev가 false이면) 버튼 비활성화
        >
          이전
        </button>

        {/* 페이지 번호들을 순회하여 출력 */}
        <span className="wr_page">
          {pages.map((p) =>
            p === page ? (
              // 만약 현재 페이지 번호와 p가 같다면, 굵게 표시하여 활성화된 페이지임을 표시
              <strong key={p} className="page on">
                {p}
              </strong>
            ) : (
              // 현재 페이지가 아니라면 일반 페이지 번호로 표시하며, 클릭 시 해당 페이지로 이동
              <span
                key={p}
                className="page"
                onClick={() => goToPage(p)}
                style={{ cursor: 'pointer' }} // 클릭 가능한 영역임을 시각적으로 표시
              >
                {p}
              </span>
            )
          )}
        </span>

        {/* 다음 그룹으로 이동하는 버튼 */}
        <button
          className="btn_page next"
          onClick={() => goToPage(end + 1)} // 클릭 시 현재 그룹의 마지막 번호보다 1 큰 페이지로 이동 (다음 그룹의 첫 페이지)
          disabled={!next}                // 다음 그룹이 없으면 (next가 false이면) 버튼 비활성화
        >
          다음
        </button>

        {/* 마지막 페이지로 이동하는 버튼 */}
        <button
          className="btn_page last"
          onClick={() => goToPage(totalPage)} // 클릭 시 전체 페이지 수(totalPage)로 이동하여 마지막 페이지로 이동
          disabled={page === totalPage}       // 현재 페이지가 이미 마지막 페이지라면 버튼 비활성화
        >
          마지막 페이지
        </button>
      </div>
    </div>
  );
}

export default BoardPagination; // BoardPagination 컴포넌트를 내보내어 다른 곳에서 사용 가능하도록 함
