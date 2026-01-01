package com.kanban.kanban_board.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "STORY_SUBSCRIPTIONS")
public class StorySubscriptionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "STORY_ID", referencedColumnName = "ID")
    private StoryEntity story;

    @Column(name = "USER_EMAIL")
    private List<String> userEmail;

    @Column(name = "CREATED_AT")
    private LocalDateTime createdAt;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public StoryEntity getStory() {
        return story;
    }
    public void setStory(StoryEntity story) {
        this.story = story;
    }

    public List<String> getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(List<String> userEmail) {
        this.userEmail = userEmail;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        StorySubscriptionEntity that = (StorySubscriptionEntity) o;
        return Objects.equals(id, that.id) && Objects.equals(story, that.story) && Objects.equals(userEmail, that.userEmail) && Objects.equals(createdAt, that.createdAt);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, story, userEmail, createdAt);
    }

    @Override
    public String toString() {
        return "StorySubscriptionEntity{" +
                "id=" + id +
                ", story=" + story +
                ", userEmail=" + userEmail +
                ", createdAt=" + createdAt +
                '}';
    }
}
