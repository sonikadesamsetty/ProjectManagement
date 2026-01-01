package com.kanban.kanban_board.repository;

import com.kanban.kanban_board.entity.StoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StoryRepository extends JpaRepository<StoryEntity, Integer> {
}
