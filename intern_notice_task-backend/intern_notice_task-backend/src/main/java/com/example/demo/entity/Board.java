package com.example.demo.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "board")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Board {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // PK
    private String title; // 제목
    @Column(columnDefinition = "TEXT")
    private String content; // 내용
    private String writer;// 작성자
    private int readCount;// 조회수
    private LocalDateTime regDate; // 작성일/시간
    private int fileCount; // 파일 수
    private String email; // 이메일
    @Column(name = "board_password", length = 60)
    private String boardPassword;
    private boolean notice; // 공지글 T/F
    private int commentCount;// 댓글 수
}


