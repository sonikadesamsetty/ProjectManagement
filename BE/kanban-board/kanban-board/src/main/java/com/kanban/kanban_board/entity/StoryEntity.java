package com.kanban.kanban_board.entity;

import jakarta.persistence.*;

import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "STORIES")
public class StoryEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Integer id;

    @Column(name = "TITLE")
    private String title;

    @Column(name = "DESCRIPTION")
    private String description;

    @Column(name = "ACCEPTANCE_CRITERIA")
    private String acceptanceCriteria;

    @Column(name = "PRIORITY")
    private String priority;

    @Column(name = "STATUS")
    private String status;

    @Column(name = "CREATED_BY")
    private String createdBy;

    @Column(name = "MODIFIED_BY")
    private String modifiedBy;

    @Column(name = "CAPACITY")
    private Integer capacity;

    @Column(name = "ASSIGNED_TO")
    private String assignedTo;

    @Column(name = "DOR")
    private Integer dor;

    @Column(name = "CREATED_AT")
    private String createdAt;

    @Column(name = "MODIFIED_AT")
    private String modifiedAt;

    @Column(name = "ITEM_TYPE")
    private String itemType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "SPRINT_ID", referencedColumnName = "ID")
    private SprintEntity sprint;

    @OneToMany(mappedBy = "story",cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<TaskEntity> tasks;

    @OneToMany(mappedBy = "story",cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<CommentEntity> CommentEntitys;

    @OneToMany(mappedBy = "story", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<StorySubscriptionEntity> storySubscriptions;

    @OneToMany(mappedBy = "story", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<StoryHistoryEntity> storyHistories;

    @OneToMany(mappedBy = "story", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<AttachmentEntity> attachments;

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

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
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

    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public String getAssignedTo() {
        return assignedTo;
    }

    public void setAssignedTo(String assignedTo) {
        this.assignedTo = assignedTo;
    }

    public Integer getDor() {
        return dor;
    }

    public void setDor(Integer dor) {
        this.dor = dor;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getModifiedAt() {
        return modifiedAt;
    }

    public void setModifiedAt(String modifiedAt) {
        this.modifiedAt = modifiedAt;
    }

    public SprintEntity getSprint() {
        return sprint;
    }

    public void setSprint(SprintEntity sprint) {
        this.sprint = sprint;
    }

    public List<TaskEntity> getTasks() {
        return tasks;
    }

    public void setTasks(List<TaskEntity> tasks) {
        this.tasks = tasks;
    }

    public List<CommentEntity> getCommentEntitys() {
        return CommentEntitys;
    }

    public void setCommentEntitys(List<CommentEntity> CommentEntitys) {
        this.CommentEntitys = CommentEntitys;
    }

    public List<StorySubscriptionEntity> getStorySubscriptions() {
        return storySubscriptions;
    }

    public void setStorySubscriptions(List<StorySubscriptionEntity> storySubscriptions) {
        this.storySubscriptions = storySubscriptions;
    }

    public String getAcceptanceCriteria() {
        return acceptanceCriteria;
    }

    public void setAcceptanceCriteria(String acceptanceCriteria) {
        this.acceptanceCriteria = acceptanceCriteria;
    }

    public List<StoryHistoryEntity> getStoryHistories() {
        return storyHistories;
    }
    public void setStoryHistories(List<StoryHistoryEntity> storyHistories) {
        this.storyHistories = storyHistories;
    }

    public String getItemType() {
        return itemType;
    }
    public void setItemType(String itemType) {
        this.itemType = itemType;
    }

    public List<AttachmentEntity> getAttachments() {
        return attachments;
    }

    public void setAttachments(List<AttachmentEntity> attachments) {
        this.attachments = attachments;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        StoryEntity that = (StoryEntity) o;
        return Objects.equals(id, that.id) && Objects.equals(title, that.title) && Objects.equals(description, that.description) && Objects.equals(acceptanceCriteria, that.acceptanceCriteria) && Objects.equals(priority, that.priority) && Objects.equals(status, that.status) && Objects.equals(createdBy, that.createdBy) && Objects.equals(modifiedBy, that.modifiedBy) && Objects.equals(capacity, that.capacity) && Objects.equals(assignedTo, that.assignedTo) && Objects.equals(dor, that.dor) && Objects.equals(createdAt, that.createdAt) && Objects.equals(modifiedAt, that.modifiedAt) && Objects.equals(itemType, that.itemType) && Objects.equals(sprint, that.sprint) && Objects.equals(tasks, that.tasks) && Objects.equals(CommentEntitys, that.CommentEntitys) && Objects.equals(storySubscriptions, that.storySubscriptions) && Objects.equals(storyHistories, that.storyHistories) && Objects.equals(attachments, that.attachments);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, title, description, acceptanceCriteria, priority, status, createdBy, modifiedBy, capacity, assignedTo, dor, createdAt, modifiedAt, itemType, sprint, tasks, CommentEntitys, storySubscriptions, storyHistories, attachments);
    }

    @Override
    public String toString() {
        return "StoryEntity{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", acceptanceCriteria='" + acceptanceCriteria + '\'' +
                ", priority='" + priority + '\'' +
                ", status='" + status + '\'' +
                ", createdBy='" + createdBy + '\'' +
                ", modifiedBy='" + modifiedBy + '\'' +
                ", capacity=" + capacity +
                ", assignedTo='" + assignedTo + '\'' +
                ", dor=" + dor +
                ", createdAt='" + createdAt + '\'' +
                ", modifiedAt='" + modifiedAt + '\'' +
                ", itemType='" + itemType + '\'' +
               /* ", sprint=" + sprint +
                ", tasks=" + tasks +
                ", CommentEntitys=" + CommentEntitys +
                ", storySubscriptions=" + storySubscriptions +
                ", storyHistories=" + storyHistories +*/
                //", attachments=" + attachments +
                '}';
    }
}
