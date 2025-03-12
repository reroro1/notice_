// notice/src/components/BoardContainer.js
import React, { useEffect, useState } from 'react';
import BoardList from './BoardList';
import BoardPagination from './BoardPagination';
import '../_css/common.css';
import { Helmet } from 'react-helmet-async'; //메타 정보, 제목
import { getBoardList } from '../api/boardAPI'; // 수정된 API 호출 함수 import

function BoardContainer() {
  const [page, setPage] = useState(1); // 현재 페이지 번호 (1부터 시작)
  const [size, setSize] = useState(10); // 한 페이지에 보여줄 게시글 개수

  // 백엔드에서 받아오는 응답값들
  const [boardList, setBoardList] = useState([]); //실제 게시글 데이터를 배열 형태로 저장
  const [totalPage, setTotalPage] = useState(0); // 전체 페이지 수
  const [start, setStart] = useState(0); // 시작페이지
  const [end, setEnd] = useState(0); // 끝 페이지
  const [prev, setPrev] = useState(false); // 이전
  const [next, setNext] = useState(false); // 다음
  const [totalElements, setTotalElements] = useState(0); // 전체 게시글 수

  // fetchBoardList: API 호출 함수를 사용하여 게시글 목록 데이터를 가져옴
  const fetchBoardList = async (p) => { // 매개변수 p는 요청할 페이지 번호
    try {
      const data = await getBoardList({ page: p, size }); // 백엔드에 get 요청을 보내고 페이지 번화와 한페이지당 게시물을 파라미터로 전달
      // 받아온 data에서 필요한 값들을 상태에 저장
      setBoardList(data.dtoList); // 게시물 목록
      setTotalPage(data.totalPage); // 전체 페이지 수
      setStart(data.start); // 시작 페이지 
      setEnd(data.end);
      setPrev(data.prev);
      setNext(data.next);
      setTotalElements(data.totalElements);
    } catch (error) {
      console.error(error);
    }
  };
  // 컴포넌트 재활용 가능한 독립적인 모듈
  // 랜더링 서버에게 html 파일을 받아 브라우저에 뿌려주는 역할
//조건부 실행 자원관리

  // size 또는 page가 변경되면 해당 페이지 데이터를 다시 가져옴
  useEffect(() => { 
    // 컴포넌트가 처음 렌더링되거나 size 또는 page 상태가 변경될 때마다 fetchBoardList(page)를 호출합니다.
    // 이를 통해 페이지 번호나 보여줄 게시글 개수가 바뀔 때마다 데이터를 다시 불러옴
    fetchBoardList(page);
    // eslint-disable-next-line
  }, [size, page]);

  // 페이지 이동 함수
  const goToPage = (p) => { // 매개변수 p로 전달된 페이지 번호를 setPage에 저장합니다
    setPage(p);// 이 함수는 페이지네이션 컴포넌트에서 호출되기 때문에 번호를 클릭할 때 마다 useEffecr가 트리거 되어 새로운 데이터를 불러옵니다
  };

  return (
    <>
      <Helmet>
        <meta charSet="UTF-8" />
        <title>STN INFOTECH - 게시판 목록</title>
        <link rel="stylesheet" href="_css/common.css" />
      </Helmet>
      <div id="WrapTitle">
        <div className="container">
          <h1 className="logo">STN INFOTECH</h1>
        </div>
      </div>

      <div style={{ width: '1200px', margin: '0 auto' }}>
        <div id="WrapContainer">
          <div className="container">
            <div className="wrap_tit">
              <h2 className="tit_cont">자유게시판</h2>
              <div className="ta_r">
                총 개수 <strong className="fc_p">{totalElements}</strong>건
              </div>
            </div>
          </div>
        </div>
        {/* BoardList: 게시글 목록 테이블 표시 */}
        <BoardList boards={boardList} page={page - 1} size={size} totalElements={totalElements} />
        {/* 목록 렌더링에 필요한 부분만 제공 */}
        {/* 페이지당 개수 선택 */}
        <select value={size} onChange={(e) => setSize(parseInt(e.target.value))}>
          <option value={5}>5개씩 보기</option>
          <option value={10}>10개씩 보기</option>
          <option value={20}>20개씩 보기</option> 
          {/* setSize가 호출되어 size 상태가 업데이트되고, useEffect를 통해 데이터가 다시 호출됩니다.*/}
        </select>
        <div className="comm_paging_btn">
          <div className="flo_side right">
            <button
              type="button"
              className="comm_btn_round fill"
              onClick={() => (window.location.href = '/board/write')}
            >
              {/* /board/write 경로로 변경하여 게시글 작성 페이지로 이동합니다.*/}
              글쓰기
            </button>
          </div>
        </div>
        <div className="box_search">
          등록일
          <input type="date" className="comm_inp_date ml_5" /> ~
          <input type="date" className="comm_inp_date" />
          <select className="comm_sel ml_10">
            <option>제목</option>
            <option>제목+내용</option>
            <option>작성자</option>
          </select>
          <input type="text" className="comm_inp_text" style={{ width: '300px' }} />
          <button className="comm_btn fill">검색</button>
          <button className="comm_btn fill">전체글</button>
        </div>
        {/* 페이지네이션 버튼 */}
        <BoardPagination
          page={page}
          start={start}
          end={end}
          prev={prev}
          next={next}
          totalPage={totalPage}
          goToPage={goToPage}
        />
      </div>
    </>
  );
}

export default BoardContainer;
