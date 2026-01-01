package com.kanban.kanban_board.repository;

import com.kanban.kanban_board.entity.StorySubscriptionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface StorySubscriptionRepository extends JpaRepository<StorySubscriptionEntity, Integer> {
    @Query(value = "SELECT * FROM STORY_SUBSCRIPTIONS WHERE STORY_ID = ?1", nativeQuery = true)
    StorySubscriptionEntity findByStoryId(Integer id);
}
