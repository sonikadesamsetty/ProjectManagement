package com.kanban.kanban_board.repository;

import com.kanban.kanban_board.entity.SprintEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SprintRepository extends JpaRepository<SprintEntity, Integer> {
}
