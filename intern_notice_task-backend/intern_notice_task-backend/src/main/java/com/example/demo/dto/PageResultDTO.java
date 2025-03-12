package com.example.demo.dto;

import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PageResultDTO<DTO> {

    private List<DTO> dtoList; // 실제 데이터 목록
    private int totalPage; // 총 페이지 수
    private int page; // 현재 페이지 (1부터)
    private int size; // 페이지당 개수

    // 페이지네이션 계산용
    private int start; // 페이지 그룹 시작
    private int end; // 페이지 그룹 끝
    private boolean prev; // 이전 그룹 존재 여부
    private boolean next; // 다음 그룹 존재 여부

    private long totalElements;
}
