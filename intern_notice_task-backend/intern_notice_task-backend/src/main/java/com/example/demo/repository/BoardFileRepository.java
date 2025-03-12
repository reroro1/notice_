package com.example.demo.repository;

import com.example.demo.entity.BoardFile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BoardFileRepository extends JpaRepository<BoardFile, Long> {

    // 게시글에 속한 파일 목록 조회
    List<BoardFile> findByBoardId(Long boardId);
}
