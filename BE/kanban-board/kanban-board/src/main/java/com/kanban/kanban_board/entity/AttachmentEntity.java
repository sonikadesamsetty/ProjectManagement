package com.kanban.kanban_board.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Objects;

@Entity
@Table(name = "ATTACHMENTS")
public class AttachmentEntity {

    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    @Column(name = "ID")
    private Integer id;

    @Column(name = "FILE_NAME")
    private String fileName;

    @Column(name = "FILE_TYPE")
    private String fileType;

    @Column(name = "DATA", columnDefinition = "BLOB")
    private byte[] data;

    @Column(name = "UPLOADED_BY")
    private String uploadedBy;

    @Column(name = "UPLOADED_AT")
    private java.time.LocalDateTime uploadedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "STORY_ID", referencedColumnName = "ID")
    private StoryEntity story;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getFileType() {
        return fileType;
    }

    public void setFileType(String fileType) {
        this.fileType = fileType;
    }

    public byte[] getData() {
        return data;
    }

    public void setData(byte[] data) {
        this.data = data;
    }

    public String getUploadedBy() {
        return uploadedBy;
    }

    public void setUploadedBy(String uploadedBy) {
        this.uploadedBy = uploadedBy;
    }

    public LocalDateTime getUploadedAt() {
        return uploadedAt;
    }

    public void setUploadedAt(LocalDateTime uploadedAt) {
        this.uploadedAt = uploadedAt;
    }

    public StoryEntity getStory() {
        return story;
    }

    public void setStory(StoryEntity story) {
        this.story = story;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        AttachmentEntity that = (AttachmentEntity) o;
        return Objects.equals(id, that.id) && Objects.equals(fileName, that.fileName) && Objects.equals(fileType, that.fileType) && Objects.deepEquals(data, that.data) && Objects.equals(uploadedBy, that.uploadedBy) && Objects.equals(uploadedAt, that.uploadedAt) && Objects.equals(story, that.story);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, fileName, fileType, Arrays.hashCode(data), uploadedBy, uploadedAt, story);
    }

    @Override
    public String toString() {
        return "AttachmentEntity{" +
                "id=" + id +
                ", fileName='" + fileName + '\'' +
                ", fileType='" + fileType + '\'' +
                ", data=" + Arrays.toString(data) +
                ", uploadedBy='" + uploadedBy + '\'' +
                ", uploadedAt=" + uploadedAt +
                ", story=" + story +
                '}';
    }
}
