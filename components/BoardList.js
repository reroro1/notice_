// notice/src/components/BoardList.js
import React, { useState } from 'react';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom'; // 페이지 이동
import { getBoardDetail } from '../api/boardAPI'; // 게시글 상세 정보 API 함수
import '../_css/common.css';

function BoardList({ boards, page, size, totalElements }) {
  /*게시글 목록 현재 페이지 항목 전체 게시글 수*/
  const navigate = useNavigate(); // 페이지 이동

  // 비밀번호 팝업 관련 상태
  const [showPwdPopup, setShowPwdPopup] = useState(false); // 비밀번호 입력 팝업 결정
  const [selectedId, setSelectedId] = useState(null); // 비밀번호 필요한 게시글 id
  const [pwdInput, setPwdInput] = useState(''); // 입력한 비밀번호 저장
  const [pwdError, setPwdError] = useState(''); // 에러러

  // 역순 번호 계산
  const getRowNumber = (idx) => totalElements - page * size - idx;

  // 제목 클릭 시 분기 처리
  const handleTitleClick = (board) => {
    if (board.boardPassword && board.boardPassword.trim() !== '') {
      // 비밀번호가 있는 게시글이면 팝업 띄우기
      setSelectedId(board.id);
      setShowPwdPopup(true);
      setPwdInput('');
      setPwdError('');
    } else {
      // 비밀번호가 없는 게시글이면 바로 상세페이지로 이동
      navigate(`/board/detail/${board.id}`);
    }
  };

  // 팝업 내 '확인' 버튼 클릭 시 호출
  const handleCheckPassword = async () => {
    if (!pwdInput.trim()) {
      alert('비밀번호를 입력하세요.');
      return;
    }
    try {
      // boardAPI.js의 getBoardDetail 함수를 통해 비밀번호 검증
      await getBoardDetail(selectedId, pwdInput);
      // 성공하면 상세 페이지로 이동 (쿼리 파라미터로 비밀번호 전달)
      navigate(`/board/detail/${selectedId}?password=${pwdInput}`);
      setShowPwdPopup(false);
    } catch (error) {
      console.error(error);
      setPwdError('비밀번호가 틀렸습니다. 다시 입력해주세요.');
    }
  };

  // 팝업 닫기 처리
  const handleClosePopup = () => {
    setShowPwdPopup(false); // 초기화 시킴
    setSelectedId(null);
    setPwdInput('');
    setPwdError('');
  };

  return (
    <>
      {/* 게시글 목록 테이블 */}
      <table className="tbl_board">
        <thead>
          <tr>
            <th>No</th>
            <th>제목</th>
            <th>첨부파일</th>
            <th>작성자</th>
            <th>작성일</th>
            <th>조회수</th>
          </tr>
        </thead>
        <tbody>
          {boards.map((board, idx) => {
            const noCell = board.notice ? '' : getRowNumber(idx);
            // 아이콘 표시
            const icons = [];
            if (board.notice) {
              icons.push(
                <span key="notice" className="txt_label notice">
                  공지
                </span>
              );
            }
            if (board.boardPassword && board.boardPassword.trim() !== '') {
              icons.push(
                <span key="lock" className="ico_img lock">
                  비밀글
                </span>
              );
            }

            return (
              <tr key={board.id}>
                <td>{noCell}</td>
                <td
                  className="ta_l"
                  style={{ cursor: 'pointer', color: '#0070C0' }}
                  onClick={() => handleTitleClick(board)}
                >
                  {icons}&nbsp;{board.title}
                  {board.commentCount > 0 && (
                    <span className="txt_reply">({board.commentCount})</span>
                  )}
                </td>
                <td>
                  {board.fileCount > 0 && (
                    <span className="link_file">
                      <span className="ico_img flie">첨부파일</span>
                      {board.fileCount}
                    </span>
                  )}
                </td>
                <td>{board.writer}</td>
                <td>
                  {board.regDate ? dayjs(board.regDate).format('YYYY-MM-DD') : ''}
                </td>
                <td>{board.readCount}</td>
              </tr>
            );
          })}
          {boards.length === 0 && (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center' }}>
                게시글이 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* 비밀번호 확인 팝업 */}
      {showPwdPopup && (
        <div
          className="comm_popup"
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            zIndex: 999
          }}
        >
          <div className="wrap_tit">
            <span className="tit_pop">비밀번호 확인</span>
            <button type="button" className="btn_close" onClick={handleClosePopup}>
              닫기
            </button>
          </div>
          <div className="wrap_cont">
            비밀번호{' '}
            <input
              type="password"
              className="comm_inp_text"
              style={{ width: '100px' }}
              value={pwdInput}
              onChange={(e) => setPwdInput(e.target.value)}
            />
            {pwdError && (
              <p style={{ color: 'red', marginTop: '10px' }}>{pwdError}</p>
            )}
          </div>
          <div className="wrap_bottom" style={{ marginTop: '10px' }}>
            <button className="comm_btn_round" onClick={handleClosePopup}>
              닫기
            </button>
            <button className="comm_btn_round fill" onClick={handleCheckPassword}>
              확인
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default BoardList;