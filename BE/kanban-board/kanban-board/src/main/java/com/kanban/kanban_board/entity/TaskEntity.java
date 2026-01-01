package com.kanban.kanban_board.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "TASKS")
public class TaskEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Integer id;

    @Column(name = "TITLE")
    private String title;

    @Column(name = "DESCRIPTION")
    private String description;

    @Column(name = "STATUS")
    private String status;

    @Column(name = "ASSIGNED_TO")
    private String assignedTo;

    @Column(name = "PRIORITY")
    private String priority;

    @Column(name = "TOTAL_HOURS")
    private Integer totalHours;

    @Column(name = "REMAINING_HOURS")
    private Integer remainingHours;

    @Column(name = "COMPLETED_HOURS")
    private Integer completedHours;

    @Column(name = "CREATED_BY")
    private String createdBy;

    @Column(name = "MODIFIED_BY")
    private String modifiedBy;

    @Column(name = "CREATED_AT")
    private LocalDateTime createdAt;

    @Column(name = "MODIFIED_AT")
    private LocalDateTime modifiedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "STORY_ID", referencedColumnName = "ID")
    private StoryEntity story;

    @OneToMany(mappedBy = "task",cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<CommentEntity> discussion;

    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<TaskSubscriptionEntity> subscriptions;

    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<TaskHistoryEntity> histories;

    public List<TaskHistoryEntity> getHistories() {
        return histories;
    }
    public void setHistories(List<TaskHistoryEntity> histories) {
        this.histories = histories;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getAssignedTo() {
        return assignedTo;
    }

    public void setAssignedTo(String assignedTo) {
        this.assignedTo = assignedTo;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public Integer getTotalHours() {
        return totalHours;
    }

    public void setTotalHours(Integer totalHours) {
        this.totalHours = totalHours;
    }

    public Integer getRemainingHours() {
        return remainingHours;
    }

    public void setRemainingHours(Integer remainingHours) {
        this.remainingHours = remainingHours;
    }

    public Integer getCompletedHours() {
        return completedHours;
    }

    public void setCompletedHours(Integer completedHours) {
        this.completedHours = completedHours;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public String getModifiedBy() {
        return modifiedBy;
    }

    public void setModifiedBy(String modifiedBy) {
        this.modifiedBy = modifiedBy;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getModifiedAt() {
        return modifiedAt;
    }

    public void setModifiedAt(LocalDateTime modifiedAt) {
        this.modifiedAt = modifiedAt;
    }

    public StoryEntity getStory() {
        return story;
    }

    public void setStory(StoryEntity story) {
        this.story = story;
    }

    public List<CommentEntity> getDiscussion() {
        return discussion;
    }

    public void setDiscussion(List<CommentEntity> discussion) {
        this.discussion = discussion;
    }

    public List<TaskSubscriptionEntity> getSubscriptions() {
        return subscriptions;
    }

    public void setSubscriptions(List<TaskSubscriptionEntity> subscriptions) {
        this.subscriptions = subscriptions;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        TaskEntity that = (TaskEntity) o;
        return Objects.equals(id, that.id) && Objects.equals(title, that.title) && Objects.equals(description, that.description) && Objects.equals(status, that.status) && Objects.equals(assignedTo, that.assignedTo) && Objects.equals(priority, that.priority) && Objects.equals(totalHours, that.totalHours) && Objects.equals(remainingHours, that.remainingHours) && Objects.equals(completedHours, that.completedHours) && Objects.equals(createdBy, that.createdBy) && Objects.equals(modifiedBy, that.modifiedBy) && Objects.equals(createdAt, that.createdAt) && Objects.equals(modifiedAt, that.modifiedAt) && Objects.equals(story, that.story) && Objects.equals(discussion, that.discussion) && Objects.equals(subscriptions, that.subscriptions) && Objects.equals(histories, that.histories);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, title, description, status, assignedTo, priority, totalHours, remainingHours, completedHours, createdBy, modifiedBy, createdAt, modifiedAt, story, discussion, subscriptions, histories);
    }

    @Override
    public String toString() {
        return "TaskEntity{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", status='" + status + '\'' +
                ", assignedTo='" + assignedTo + '\'' +
                ", priority='" + priority + '\'' +
                ", totalHours=" + totalHours +
                ", remainingHours=" + remainingHours +
                ", completedHours=" + completedHours +
                ", createdBy='" + createdBy + '\'' +
                ", modifiedBy='" + modifiedBy + '\'' +
                ", createdAt=" + createdAt +
                ", modifiedAt=" + modifiedAt +
                ", discussion=" + discussion +
                ", subscriptions=" + subscriptions +
                ", histories=" + histories +
                '}';
    }
}
