package com.kanban.kanban_board.service;

import com.kanban.kanban_board.entity.CommentEntity;
import com.kanban.kanban_board.mapper.CommentMapper;
import com.kanban.kanban_board.model.Comment;
import com.kanban.kanban_board.repository.CommentRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentService {

    private final CommentRepository commentRepository;

    private final CommentMapper commentMapper;

    public CommentService(CommentRepository commentRepository, CommentMapper commentMapper) {
        this.commentRepository = commentRepository;
        this.commentMapper = commentMapper;
    }

    public ResponseEntity<Void> deleteCommentById(Integer id) {
        if(commentRepository.existsById(id)) {
            commentRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    public ResponseEntity<java.util.List<com.kanban.kanban_board.model.Comment>> getComments() {
        var comments = commentRepository.findAll();
        var commentModels = commentMapper.entitiesToModels(comments);
        return ResponseEntity.ok(commentModels);
    }

    public ResponseEntity<com.kanban.kanban_board.model.Comment> createComment(com.kanban.kanban_board.model.Comment comment) {
        CommentEntity commentEntity = commentMapper.modelToEntity(comment);
        if(commentEntity.getTask() != null && commentEntity.getTask().getId() != 0) {
            var task = new com.kanban.kanban_board.entity.TaskEntity();
            task.setId(commentEntity.getTask().getId());
            commentEntity.setTask(task);
            int savedEntity = commentRepository.saveTaskComment(commentEntity.getDescription(), commentEntity.getCreatedBy(), commentEntity.getModifiedBy(), commentEntity.getCreatedAt(), commentEntity.getModifiedAt(),commentEntity.getTask().getId());
            return ResponseEntity.ok(savedEntity != 0 ? commentMapper.entityToModel(commentEntity) : null);
        } else if(commentEntity.getStory() != null && commentEntity.getStory().getId() != 0) {
            var story = new com.kanban.kanban_board.entity.StoryEntity();
            story.setId(commentEntity.getStory().getId());
            commentEntity.setStory(story);
            int savedEntity = commentRepository.saveStoryComment(commentEntity.getDescription(), commentEntity.getCreatedBy(), commentEntity.getModifiedBy(), commentEntity.getCreatedAt(), commentEntity.getModifiedAt(),commentEntity.getStory().getId());
            return ResponseEntity.ok(savedEntity != 0 ? commentMapper.entityToModel(commentEntity) : null);
        }
        return ResponseEntity.badRequest().build();
    }

    public ResponseEntity<com.kanban.kanban_board.model.Comment> updateComment(com.kanban.kanban_board.model.Comment comment) {
        return commentRepository.findById(comment.getId())
                .map(existingComment -> {
                    existingComment.setDescription(comment.getDescription());
                    existingComment.setTask(commentMapper.modelToEntity(comment).getTask());
                    CommentEntity updatedComment = commentRepository.save(existingComment);
                    Comment commentModel = commentMapper.entityToModel(updatedComment);
                    return ResponseEntity.ok(commentModel);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    public ResponseEntity<Comment> getCommentById(Integer id) {
        return commentRepository.findById(id)
                .map(commentMapper::entityToModel)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    public ResponseEntity<List<Comment>> getCommentsByTaskIdOrStoryId(Integer taskId, Integer storyId) {
        System.out.println("storyId and task id:"+storyId + " " + taskId);
        if(taskId != 0) {
            var comments = commentRepository.findByTaskId(taskId);
            var commentModels = commentMapper.entitiesToModels(comments);
            return ResponseEntity.ok(commentModels.isEmpty() ? null : commentModels);
        } else if(storyId != 0) {
            System.out.println("story id::"+ storyId);
            var comments = commentRepository.findByStoryId(storyId);
            System.out.println("comments:"+comments);
            var commentModels = commentMapper.entitiesToModels(comments);
            System.out.println("commentModels::"+commentModels);
            return ResponseEntity.ok(commentModels.isEmpty() ? null : commentModels);
        } else {
            return ResponseEntity.badRequest().build();
        }
    }
}
