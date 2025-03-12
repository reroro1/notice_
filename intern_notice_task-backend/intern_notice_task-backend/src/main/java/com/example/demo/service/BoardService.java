package com.example.demo.service;

import com.example.demo.dto.*;
import com.example.demo.entity.Board;
import com.example.demo.entity.BoardFile;
import com.example.demo.repository.BoardFileRepository;
import com.example.demo.repository.BoardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class BoardService {

    @Autowired
    private BoardRepository boardRepository;

    @Autowired
    private BoardFileRepository boardFileRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    // **글 + 파일 등록**
    public void createBoard(BoardDTO boardDTO, List<MultipartFile> files) {
        if (boardDTO.getBoardPassword() != null && !boardDTO.getBoardPassword().isEmpty()) {
            if (boardDTO.getBoardPassword().length() != 4) {
                throw new IllegalArgumentException("비밀번호는 4자리 숫자여야 합니다.");
            }
            boardDTO.setBoardPassword(passwordEncoder.encode(boardDTO.getBoardPassword()));
        }

        Board board = Board.builder()
                .title(boardDTO.getTitle())
                .content(boardDTO.getContent())
                .writer(boardDTO.getWriter())
                .readCount(0)
                .regDate(LocalDateTime.now())
                .fileCount(boardDTO.getFileCount())
                .email(boardDTO.getEmail())
                .boardPassword(boardDTO.getBoardPassword())
                .notice(boardDTO.isNotice())
                .commentCount(boardDTO.getCommentCount())
                .build();
        boardRepository.save(board);

        if (files != null && !files.isEmpty()) {
            for (MultipartFile file : files) {
                if (!file.isEmpty()) {
                    String originalName = file.getOriginalFilename();
                    String ext = "";
                    if (originalName != null && originalName.lastIndexOf(".") != -1) {
                        ext = originalName.substring(originalName.lastIndexOf("."));
                    }
                    String savedFilename = UUID.randomUUID().toString() + ext;

                    File dest = new File("C:/upload/" + savedFilename);
                    try {
                        file.transferTo(dest);
                    } catch (IOException e) {
                        e.printStackTrace();
                    }

                    BoardFile boardFile = BoardFile.builder()
                            .board(board)
                            .originalFilename(originalName)
                            .savedFilename(savedFilename)
                            .fileSize(file.getSize())
                            .uploadTime(LocalDateTime.now())
                            .build();
                    boardFileRepository.save(boardFile);
                }
            }
        }
    }

    // **비밀번호 검증 포함 상세보기**
    // password=null이면 비밀번호 없는 글만 통과, 비밀번호 있으면 예외
    // password!=null이면 매칭 검사
    public BoardDetailDTO getBoardDetailOrProtected(Long id, String rawPassword) {
        Board board = boardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("게시글이 존재하지 않습니다."));

        // 비밀번호가 설정된 글이면 검증
        if (board.getBoardPassword() != null && !board.getBoardPassword().isEmpty()) {
            if (rawPassword == null || !passwordEncoder.matches(rawPassword, board.getBoardPassword())) {
                throw new RuntimeException("비밀번호가 일치하지 않습니다.");
            }
        }

        // 엔티티 -> DTO
        BoardDTO boardDTO = entityToDto(board);

        // 파일 목록
        List<BoardFile> fileEntities = boardFileRepository.findByBoardId(board.getId());
        List<BoardFileDTO> fileDTOList = fileEntities.stream()
                .map(this::fileEntityToDto)
                .collect(Collectors.toList());

        return BoardDetailDTO.builder()
                .board(boardDTO)
                .fileList(fileDTOList)
                .build();
    }

    public void deleteBoard(Long id, String rawPassword) {
        Board board = boardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("게시글이 존재하지 않습니다."));

        if (board.getBoardPassword() == null) {
            throw new RuntimeException("비밀번호가 없는 글입니다.");
        }
        if (!passwordEncoder.matches(rawPassword, board.getBoardPassword())) {
            throw new RuntimeException("비밀번호가 일치하지 않습니다.");
        }

        boardRepository.delete(board);
    }

    // **목록**
    public PageResultDTO<BoardDTO> getList(PageRequestDTO requestDTO) {
        Pageable pageable = PageRequest.of(
                requestDTO.getPageForJpa(),
                requestDTO.getSize(),
                Sort.by(Sort.Order.desc("notice"), Sort.Order.desc("id"))
        );

        Page<Board> result = boardRepository.findAll(pageable);
        List<BoardDTO> dtoList = result.getContent().stream()
                .map(this::entityToDto)
                .collect(Collectors.toList());

        PageResultDTO<BoardDTO> pageResult = PageResultDTO.<BoardDTO>builder()
                .dtoList(dtoList)
                .totalPage(result.getTotalPages())
                .page(requestDTO.getPage())
                .size(requestDTO.getSize())
                .totalElements(result.getTotalElements())
                .build();

        calcPageGroup(pageResult);
        return pageResult;
    }

    // **엔티티 -> DTO**
    private BoardDTO entityToDto(Board board) {
        return BoardDTO.builder()
                .id(board.getId())
                .title(board.getTitle())
                .content(board.getContent())
                .writer(board.getWriter())
                .readCount(board.getReadCount())
                .regDate(board.getRegDate())
                .fileCount(board.getFileCount())
                .email(board.getEmail())
                .boardPassword(board.getBoardPassword())
                .notice(board.isNotice())
                .commentCount(board.getCommentCount())
                .build();
    }

    private BoardFileDTO fileEntityToDto(BoardFile bf) {
        return BoardFileDTO.builder()
                .id(bf.getId())
                .originalFilename(bf.getOriginalFilename())
                .savedFilename(bf.getSavedFilename())
                .fileSize(bf.getFileSize())
                .uploadTime(bf.getUploadTime())
                .build();
    }

    // 페이지 그룹 계산
    private void calcPageGroup(PageResultDTO<BoardDTO> pageResult) {
        int pageGroupSize = 5;
        int page = pageResult.getPage();
        int totalPage = pageResult.getTotalPage();
        int tempEnd = (int)(Math.ceil(page / (double)pageGroupSize)) * pageGroupSize;
        int start = tempEnd - (pageGroupSize - 1);
        if (start < 1) start = 1;
        int end = Math.min(tempEnd, totalPage);
        boolean prev = (start > 1);
        boolean next = (end < totalPage);

        pageResult.setStart(start);
        pageResult.setEnd(end);
        pageResult.setPrev(prev);
        pageResult.setNext(next);
    }
}
