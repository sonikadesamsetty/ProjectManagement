package com.kanban.kanban_board.repository;

import com.kanban.kanban_board.entity.CommentEntity;
import com.kanban.kanban_board.model.Comment;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.beans.Transient;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<CommentEntity, Integer> {

    @Modifying
    @Transactional
    @Query(value = "INSERT INTO COMMENTS (description, created_by, modified_by, created_at, modified_at, task_id) VALUES (?1, ?2, ?3, ?4, ?5, ?6)", nativeQuery = true)
    int saveTaskComment(String description, String createdBy, String modifiedBy, LocalDateTime createdAt, LocalDateTime modifiedAt, Integer id);

    @Modifying
    @Transactional
    @Query(value = "INSERT INTO COMMENTS (description, created_by, modified_by, created_at, modified_at, story_id) VALUES (?1, ?2, ?3, ?4, ?5, ?6)", nativeQuery = true)
    int saveStoryComment(String description, String createdBy, String modifiedBy, LocalDateTime createdAt, LocalDateTime modifiedAt, Integer id);

    List<CommentEntity> findByStoryId(Integer id);

    List<CommentEntity> findByTaskId(Integer taskId);
}
