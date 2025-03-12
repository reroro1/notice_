// notice/src/components/BoardWrite.js
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { createBoard } from '../api/boardAPI'; // axios 대신 API 호출 함수 import
import '../_css/common.css';

function BoardWrite() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [writer, setWriter] = useState('');
  const [email, setEmail] = useState('');
  const [boardPassword, setBoardPassword] = useState('');
  const [notice, setNotice] = useState(false);

  // 첨부파일 상태 (다중 파일 처리)
  const [files, setFiles] = useState([]);

  // 작성 중인 폼의 변경 여부 판단 (files 배열 길이로 체크)
  const isFormDirty =
    title.trim() !== '' ||
    content.trim() !== '' ||
    writer.trim() !== '' ||
    email.trim() !== '' ||
    boardPassword.trim() !== '' ||
    files.length > 0 ||
    notice !== false;

  // 비밀번호 입력 시 숫자만 허용
  const handlePasswordChange = (e) => {
    const inputValue = e.target.value;
    if (/^[0-9]*$/.test(inputValue)) {
      setBoardPassword(inputValue);
    } else {
      alert('숫자만 입력해주세요');
    }
  };

  // 첨부파일 선택 시 (다중 파일 처리)
  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  // 파일 제거 (인덱스로 식별)
  const removeFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  // 폼 제출 (글 등록)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !writer.trim() || !email.trim() || !content.trim()) {
      alert('모든 칸을 입력해주세요');
      return;
    }
    if (!email.includes('@')) {
      alert('이메일 양식에 맞게 작성해주세요');
      return;
    }
    if (boardPassword && boardPassword.length !== 4) {
      alert('비밀번호는 4자리 숫자여야 합니다.');
      return;
    }

    try {
      // FormData를 이용하여 게시글 정보와 파일들을 함께 전송
      const formData = new FormData();

      // boardDTO JSON 데이터를 Blob으로 변환하여 추가
      const boardData = {
        title,
        content,
        writer,
        email,
        boardPassword,
        notice,
        fileCount: files.length, // files 배열의 길이 사용
        commentCount: 0
      };
      formData.append(
        'boardDTO',
        new Blob([JSON.stringify(boardData)], { type: 'application/json' })
      );

      // 파일들 추가
      files.forEach((file) => {
        formData.append('files', file);
      });

      // API 호출: boardAPI.js의 createBoard 함수 사용
      await createBoard(formData);

      alert('글이 등록되었습니다.');
      window.location.href = '/';
    } catch (error) {
      console.error(error);
      alert('등록 실패');
    }
  };

  // 페이지 이동 시 작성 중인 내용이 있으면 확인 후 이동
  const handleNavigation = (url) => {
    if (isFormDirty) {
      const confirmed = window.confirm('작성중인 글이 있습니다. 페이지를 이동하시겠습니까?');
      if (confirmed) {
        window.location.href = url;
      }
    } else {
      window.location.href = url;
    }
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
      <div id="WrapContainer">
        <div className="container">
          <div className="wrap_tit">
            <h2 className="tit_cont">자유게시판</h2>
          </div>
          <div className="wrap_write">
            <form onSubmit={handleSubmit}>
              <dl className="write_tit">
                <dt>제목</dt>
                <dd>
                  <input
                    type="text"
                    className="comm_inp_text"
                    style={{ width: '100%' }}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </dd>
              </dl>
              <div className="write_info">
                <dl className="info">
                  <dt>작성자</dt>
                  <dd>
                    <input
                      type="text"
                      className="comm_inp_text"
                      style={{ width: '80px' }}
                      value={writer}
                      onChange={(e) => setWriter(e.target.value)}
                    />
                  </dd>
                  <dt>비밀번호</dt>
                  <dd>
                    <input
                      type="password"
                      maxLength={4}
                      className="comm_inp_text"
                      style={{ width: '100px' }}
                      value={boardPassword}
                      onChange={handlePasswordChange}
                    />
                  </dd>
                  <dt>이메일</dt>
                  <dd>
                    <input
                      type="text"
                      className="comm_inp_text"
                      style={{ width: '150px' }}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </dd>
                </dl>
                <dl className="side">
                  <dt>공지사항</dt>
                  <dd>
                    <label className="comm_swich">
                      <input
                        type="checkbox"
                        checked={notice}
                        onChange={(e) => setNotice(e.target.checked)}
                      />
                      <span className="ico_txt"></span>
                    </label>
                  </dd>
                </dl>
              </div>
              <div className="write_cont" style={{ minHeight: '200px' }}>
                <textarea
                  className="comm_textarea"
                  style={{ width: '100%', height: '200px' }}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
              {/* 첨부파일 영역 */}
              <div className="write_file">
                <strong className="tit_file">
                  <span className="ico_img flie">첨부파일</span> 첨부파일
                </strong>
                <div className="cont_file">
                  <input
                    type="file"
                    multiple
                    className="comm_inp_file"
                    style={{ width: '100%' }}
                    onChange={handleFileChange}
                  />
                </div>
                {/* 선택된 파일 목록 표시 */}
                <div style={{ marginTop: '10px' }}>
                  {files.map((file, index) => (
                    <span key={index} style={{ marginRight: '10px' }}>
                      {file.name}{' '}
                      <button type="button" onClick={() => removeFile(index)}>
                        X
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              <div className="comm_paging_btn">
                <div className="flo_side left">
                  <button
                    type="button"
                    className="comm_btn_round fill"
                    onClick={() => handleNavigation('/')}
                  >
                    목록
                  </button>
                </div>
                <div className="flo_side right">
                  <button
                    type="button"
                    className="comm_btn_round"
                    onClick={() => handleNavigation('/')}
                  >
                    취소
                  </button>
                  <button type="submit" className="comm_btn_round fill">
                    등록
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default BoardWrite;
