package com.kanban.kanban_board.repository;

import org.springframework.stereotype.Repository;

@Repository
public interface TaskHistoryRepository extends org.springframework.data.jpa.repository.JpaRepository<com.kanban.kanban_board.entity.TaskHistoryEntity, Integer> {
}
