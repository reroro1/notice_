package com.example.demo.dto;

import lombok.*;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BoardDetailDTO {

    private BoardDTO board; // 게시글 기본 정보 (제목, 작성자, 내용 등)
    private List<BoardFileDTO> fileList; // 첨부파일 목록
    // private List<ReplyDTO> replies;
}
