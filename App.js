import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// 라우터의 컴포넌트들을 불러옴
import BoardContainer from './components/BoardContainer'; // 해당 경로에 매핑
import BoardWrite from './components/BoardWrite'; // 해당 경로에 매핑
import BoardDetail from './components/BoardDetail'; // 해당 경로에 매핑

function App() {
  return (
    <BrowserRouter> {/*전체에 브라우저 라우터를 씌워서 라우터 기능을 사용*/}
      <Routes>{/*명확한 경로 매칭을 위해 필요*/}
        <Route path="/" element={<BoardContainer />} />
        {/*기본 주소에 접근하면 게시판 목록 보여주기 위함*/}
        <Route path="/board/write" element={<BoardWrite />} />
                {/*url이 /board/write일 때 BoardWrite 경로로*/}
        <Route path="/board/detail/:id" element={<BoardDetail />} /> {/* 상세 */}
          {/*url이 /board/detail/:id일 때 id에 맞춰 상세로 이동*/}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
