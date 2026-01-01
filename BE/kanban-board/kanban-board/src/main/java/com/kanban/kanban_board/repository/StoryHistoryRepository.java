package com.kanban.kanban_board.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StoryHistoryRepository extends JpaRepository<com.kanban.kanban_board.entity.StoryHistoryEntity, Integer> {
}
