// com/example/demo/controller/BoardApiController.java
package com.example.demo.controller;

import com.example.demo.dto.BoardDetailDTO;
import com.example.demo.dto.BoardDTO;
import com.example.demo.dto.BoardDeleteRequestDTO;
import com.example.demo.dto.PageRequestDTO;
import com.example.demo.dto.PageResultDTO;
import com.example.demo.service.BoardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/board")
@CrossOrigin(origins = "http://localhost:3000")
public class BoardApiController {

    @Autowired
    private BoardService boardService;

    @GetMapping("/list")
    public PageResultDTO<BoardDTO> list(PageRequestDTO requestDTO) {
        return boardService.getList(requestDTO);
    }

    @PostMapping(value = "/write", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public String write(
            @RequestPart("boardDTO") BoardDTO boardDTO,
            @RequestPart(value = "files", required = false) List<MultipartFile> files
    ) {
        boardService.createBoard(boardDTO, files);
        return "ok";
    }

    // 삭제 API 수정: 요청 DTO(BoardDeleteRequest)를 사용
    @PostMapping("/delete/{id}")
    public String deleteBoard(
            @PathVariable Long id,
            @RequestBody BoardDeleteRequestDTO deleteRequest
    ) {
        boardService.deleteBoard(id, deleteRequest.getPassword());
        return "deleted";
    }

    @GetMapping("/detail/{id}")
    public BoardDetailDTO getDetail(
            @PathVariable Long id,
            @RequestParam(required = false) String password
    ) {
        return boardService.getBoardDetailOrProtected(id, password);
    }
}
