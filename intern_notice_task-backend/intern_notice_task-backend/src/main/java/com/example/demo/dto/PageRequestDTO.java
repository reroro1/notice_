package com.example.demo.dto;

import lombok.*;

/* PageRequestDTO : 페이지네이션(현재 페이지, 페이지당 개수)과
검색 옵션(검색 타입, 키워드)을 담는 DTO
클라이언트(React 등)에서 넘어온 파라미터를 이 객체로 받아서 사용
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PageRequestDTO {

    private int page; // 현재 페이지 번호 (1부터 시작한다고 가정)
    private int size; // 한 페이지당 보여줄 게시글 개수

    // 검색 관련 필드
    private String type; // 검색 타입 title, writer, titleContent 등
    private String keyword; // 검색어

    public int getPageForJpa() {
        /* 만약 page가 0 이하라면 0을, 그렇지 않으면 (page - 1)을 반환
        예) page=1 -> 0, page=2 -> 1 JPA Pageable에 맞게 보정 */
        return (page <= 0) ? 0 : (page - 1);
    }
}
