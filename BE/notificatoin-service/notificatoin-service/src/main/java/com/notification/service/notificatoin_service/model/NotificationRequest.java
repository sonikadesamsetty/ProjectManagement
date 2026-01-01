package com.notification.service.notificatoin_service.model;

import java.util.List;
import java.util.Objects;

public class NotificationRequest {
    private Integer id;

    private List<String> emailIds;

    private String description;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<String> getEmailIds() {
        return emailIds;
    }

    public void setEmailIds(List<String> emailIds) {
        this.emailIds = emailIds;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        NotificationRequest that = (NotificationRequest) o;
        return Objects.equals(id, that.id) && Objects.equals(emailIds, that.emailIds) && Objects.equals(description, that.description);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, emailIds, description);
    }

    @Override
    public String toString() {
        return "NotificationRequest{" +
                "id=" + id +
                ", emailIds=" + emailIds +
                ", description='" + description + '\'' +
                '}';
    }
}
