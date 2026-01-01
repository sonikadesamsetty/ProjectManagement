package com.kanban.kanban_board.controller;

import com.kanban.kanban_board.api.CommentsApi;
import com.kanban.kanban_board.api.CommentsByIdApi;
import com.kanban.kanban_board.model.Comment;
import com.kanban.kanban_board.service.CommentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class CommentController implements CommentsApi, CommentsByIdApi {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @Override
    public ResponseEntity<Void> commentsIdDelete(Integer id) {
        return commentService.deleteCommentById(id);
    }



    @Override
    public ResponseEntity<List<Comment>> commentsGet() {
        return commentService.getComments();
    }

    @Override
    public ResponseEntity<Comment> commentsPost(Comment comment) {
        System.out.println("comment: " + comment);
        return commentService.createComment(comment);
    }

    @Override
    public ResponseEntity<Comment> commentsPut(Comment comment) {
        return commentService.updateComment(comment);
    }

    @Override
    public ResponseEntity<List<Comment>> commentsByIdGet(Integer taskId, Integer storyId) {
        System.out.println("storyId and task id:"+storyId + " " + taskId);
        return commentService.getCommentsByTaskIdOrStoryId(taskId, storyId);
    }
}
