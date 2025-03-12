package com.example.demo.dto;
import lombok.*;
import java.time.LocalDateTime;
// Java 8 이상에서 날짜/시간을 표현하는 클래스(LocalDateTime)를 사용하기 위한 임포트

/* BoardDTO:
   '게시글(Board)' 정보를
   '데이터 전송용 객체(Data Transfer Object)' 형태로 담는 클래스
    엔티티(실제 DB 매핑 객체)와는 분리하여,
    필요한 필드만 모아 전송하거나,
    추가/가공된 데이터를 담을 수 있음
 */

@Data
/* @Data: Lombok 어노테이션
   @Getter + @Setter + @RequiredArgsConstructor + @ToString + @EqualsAndHashCode
   등을 한꺼번에 적용 */

// Lombok 어노테이션
// 모든 필드를 파라미터로 받는 생성자를 자동 생성
@NoArgsConstructor
@AllArgsConstructor
@Builder
// @Builder: Lombok 어노테이션
// 빌더 패턴(Builder) 메서드를 자동 생성
// BoardDTO.builder().id(1L).title("제목").build() 식으로 객체 생성 가능

public class BoardDTO {
    private Long id;
    private String title;
    private String content;
    private String writer;
    private int readCount;
    private LocalDateTime regDate;

    private int fileCount;
    private String email;

    private String boardPassword;   // 4자리
    private boolean notice;
    private int commentCount;
}


