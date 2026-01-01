package com.kanban.kanban_board.repository;

import com.kanban.kanban_board.entity.TaskSubscriptionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskSubscriptionRepository extends JpaRepository<TaskSubscriptionEntity, Integer> {
}
