package com.example.demo.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BoardFileDTO {

    private Long id;
    private String originalFilename;
    private String savedFilename;
    private Long fileSize;
    private LocalDateTime uploadTime;
}
