// notice/src/components/BoardDetail.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
          /*URL경로   뒤로가기   URL 위치 정보*/
import { Helmet } from 'react-helmet-async';
import '../_css/common.css';
import { getBoardDetail, getDownloadUrl } from '../api/boardAPI';

function BoardDetail() {
  const { id } = useParams(); // URL에서 id를 추출해 상세정보를 보여줌
  const navigate = useNavigate(); // 목록으로 들어가거나 팝업 닫을 떄 페이지 이동
  const location = useLocation(); // 비밀번호 파싱

  const [detail, setDetail] = useState(null); // 백엔드에서 받은 게시글 상세정보
  const [showPasswordPopup, setShowPasswordPopup] = useState(false); //비밀번호 팝업 결저
  const [inputPassword, setInputPassword] = useState(''); // 비밀번호 저장
  const [errorMsg, setErrorMsg] = useState('');// 비밀번호 검증 에러 메세지
  const [isLoading, setIsLoading] = useState(true); //API 호출 중 로딩 관리


  
  // URL 쿼리 파라미터 파싱 (예: /board/detail/123?password=9999)
  const searchParams = new URLSearchParams(location.search); // URL에서 비밀번호 추출
  const queryPassword = searchParams.get('password'); // 비밀번호가 있으면 이 값을 저장하여 API 호출시 사용

  // 게시글 상세 정보 API 호출 함수 (비밀번호 전달 가능)
  const fetchDetail = async (password) => { // 비밀번호가 필요하면 같이 전달
    setIsLoading(true); // API 호출 전 로딩 상태 활성화
    try {
      const data = await getBoardDetail(id, password);  // id 비밀번호 전달
      setDetail(data); // 받아온 데이터 detail에 저장
      setShowPasswordPopup(false);
      setErrorMsg('');
    } catch (error) { 
      console.error(error);
      setDetail(null); // 실패 시 null
      setShowPasswordPopup(true); // 비밀번호가 필요한 경우 팝업 표시
      setErrorMsg(error.response?.data?.message || '비밀번호가 필요한 글입니다.'); //에러 메시지를 업데이트합니다.
    } finally {
      setIsLoading(false); //로딩 상태를 false로 변경하여 API 호출 종료를 알림
    }
  };

  useEffect(() => { // 처음 렌더링 되거나 id가 변경될 때 실행
    // 쿼리 파라미터에 password가 있으면 전달
    fetchDetail(queryPassword);
    //의존성 누락 경고 id를 변경할 때만 API를 호출하을 하고 싶으므로 생략
    // eslint-disable-next-line
  }, [id]);

  // 팝업에서 확인 버튼 클릭 시 호출
  const handlePasswordConfirm = () => {
    if (!inputPassword.trim()) { //비밀번호 입력란이 비어있으면 경고창을 띄워 입력을 요구
      alert('비밀번호를 입력하세요');
      return;
    }
    fetchDetail(inputPassword); // 사용자가 입력한 비밀번호를 전달하여 상세 정보 요청
  };

  // 팝업 닫기 (비밀번호 입력 취소)
  const handlePopupClose = () => {
    setShowPasswordPopup(false);  // 팝업 닫기 위해 false
    navigate(-1); // 이전 페이지로 돌아감
  };

  // 로딩 중이면 로딩 메시지 표시 (단, 비밀번호 팝업은 보이도록 함)
  if (isLoading && !showPasswordPopup) {
    return <div>로딩 중...</div>;
  }

  return (
    <>
      <Helmet>
        <meta charSet="UTF-8" />
        {/*<title>글 보기</title>*/}
      </Helmet>

      <div id="WrapTitle">
        <div className="container">
          {/*<h1 className="logo"></h1>*/}
        </div>
      </div>

      <div id="WrapContainer">
        <div className="container">
          {detail ? (
            <>
              <div className="wrap_tit">
                <h2 className="tit_cont">자유게시판</h2>
              </div>

              <div className="wrap_view">
                <dl className="view_tit">
                  <dt>제목</dt>
                  <dd>
                    <h3 className="tit">{detail.board.title}</h3>
                  </dd>
                </dl>
                <dl className="view_info">
                  <dt>작성자</dt>
                  <dd>{detail.board.writer}</dd>
                  <dt>이메일</dt>
                  <dd>{detail.board.email}</dd>
                  <dt>작성일</dt>
                  <dd>{detail.board.regDate}</dd>
                  <dt>조회수</dt>
                  <dd>{detail.board.readCount}</dd>
                </dl>
                {/*게시글의 본문 내용 출력*/}
                <div className="view_cont">{detail.board.content}</div>
                {detail.fileList && detail.fileList.length > 0 && (
                  /*파일이 존재하고 하나 이상이면 첨부파일 목록 랜더링*/
                  <div className="view_file">
                    <strong className="tit_file">
                      <span className="ico_img flie">첨부파일</span> 첨부파일
                    </strong>
                    <ul className="list_file">
                      {detail.fileList.map((f) => (
                        <li key={f.id}>
                          <a href={getDownloadUrl(f.id)}> {/*다운로드 링크 생성*/}
                          {f.originalFilename} {/* 원본 파일 이름 표시 */}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="comm_paging_btn">
                <div className="flo_side left">
                  <button className="comm_btn_round fill" onClick={() => navigate(-1)}> {/*이전페이지*/}
                    목록
                  </button>
                  <button className="comm_btn_round">삭제</button>
                </div>
                <div className="flo_side right">
                  <button className="comm_btn_round fill">답글</button>
                  <button className="comm_btn_round fill">수정</button>
                </div>
              </div>
            </>
          ) : (
            <div>상세 정보를 불러오지 못했습니다.</div>
          )}
        </div>
      </div>

      {/* 비밀번호 확인 팝업 */}
      {showPasswordPopup && (
        <div
          className="comm_popup"
          style={{
            position: 'fixed',
            top: '30%',
            left: '30%',
            backgroundColor: '#fff',
            padding: '20px',
            border: '1px solid #ccc'
          }}
        >
          <div className="wrap_tit">
            <span className="tit_pop">비밀번호 확인</span>
            <button type="button" className="btn_close" onClick={handlePopupClose}>
              닫기
            </button>
          </div>
          <div className="wrap_cont">
            {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
            비밀번호{' '}
            <input
              type="text"
              className="comm_inp_text"
              style={{ width: '100px' }}
              value={inputPassword}
              onChange={(e) => setInputPassword(e.target.value)}
            />
          </div>
          <div className="wrap_bottom" style={{ marginTop: '10px' }}>
            <button className="comm_btn_round" onClick={handlePopupClose}>
              닫기
            </button>
            <button className="comm_btn_round fill" onClick={handlePasswordConfirm}>
              확인
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default BoardDetail;