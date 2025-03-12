// notice/src/api/boardAPI.js
import axios from 'axios';

//axios라는 HTTP 라이브러리를 사용해서 요청이나 CORS를 구현

// 비동기 작업(예: HTTP 요청)을 수행할 때 
// await 키워드를 사용하여 결과를 기다릴 수 있음을 의미합니다.

// 게시글 목록 호출 함수
// get으로 해당 url로 게시글 목록을 요청하여 객체를 통해 파라미터를 전달합니다
//list니깐 여기에는 페이지 번호나 검색어 등을 전달하겠네요
export const getBoardList = async (params) => {
  try {
    const response = await axios.get('http://localhost:8080/api/board/list', { params });
    return response.data;
  } catch (error) {
    console.error('axios 통신 에러', error);
    throw error;
  }
};
 
// 게시글 상세정보 호출 함수인데 매개변수로id, password가 있고
// url에 id를 포함하여 만약 비밀버번호가 있으면 파라미터로 추가하고
// 최종 url에 get 요청을 보내 응답에서 데이터를 받아 반환합니다

// 게시글 상세 정보 호출 함수 (비밀번호 포함 가능)
export const getBoardDetail = async (id, password) => {
  try {
    let url = `http://localhost:8080/api/board/detail/${id}`;
    if (password) {
      url += `?password=${password}`;
    }
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching board detail', error);
    throw error;
  }
};

// post로 등로하는 함수입니다
// fomData는 서버로 전송할 데이터고
// 헤더에 글 내용과 파일 타입을 지정하고

// 게시글 등록 함수 (FormData를 받아 multipart/form-data로 전송)

export const createBoard = async (formData) => {
  try {
    const response = await axios.post('http://localhost:8080/api/board/write', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating board', error);
    throw error;
  }
};


export function getDownloadUrl(fileId) {
  /*다운로드할 파일의 UUID */
  return `http://localhost:8080/api/board/download/${fileId}`;
}