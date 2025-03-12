package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "board_file")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BoardFile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 다수의 파일 -> 하나의 게시글
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "board_id")
    private Board board;  // Board 엔티티 참조

    private String originalFilename; // 원본 파일명
    private String savedFilename; // 실제 저장된 파일명 (UUID 등)
    private Long fileSize;// 파일 크기 (옵션)
    private LocalDateTime uploadTime; // 업로드 시각 (옵션)
}
