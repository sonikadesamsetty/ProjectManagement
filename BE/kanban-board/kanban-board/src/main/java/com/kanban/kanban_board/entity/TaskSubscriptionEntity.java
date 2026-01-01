package com.kanban.kanban_board.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "TASK_SUBSCRIPTIONS")
public class TaskSubscriptionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "TASK_ID", referencedColumnName = "ID")
    private TaskEntity task;

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

    public TaskEntity getTask() {
        return task;
    }
    public void setTask(TaskEntity task) {
        this.task = task;
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
        TaskSubscriptionEntity that = (TaskSubscriptionEntity) o;
        return Objects.equals(id, that.id) && Objects.equals(task, that.task) && Objects.equals(userEmail, that.userEmail) && Objects.equals(createdAt, that.createdAt);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, task, userEmail, createdAt);
    }

    @Override
    public String toString() {
        return "TaskSubscriptionEntity{" +
                "id=" + id +
                ", task=" + task +
                ", userEmail=" + userEmail +
                ", createdAt=" + createdAt +
                '}';
    }
}
