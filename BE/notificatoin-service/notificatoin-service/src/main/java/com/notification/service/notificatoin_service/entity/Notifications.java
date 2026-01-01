package com.notification.service.notificatoin_service.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "NOTIFICATIONS")
public class Notifications {

    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    @Column(name = "ID")
    private Integer id;

    @Column(name = "EMAIL_SUBJECT")
    private String emailSubject;

    @Column(name = "EMAIL_BODY", length = 5000)
    private String emailBody;

    @Column(name = "RECIPIENT_EMAILS", length = 2000)
    private List<String> recipientEmails;

    @Column(name = "SENT_AT")
    private LocalDateTime sentAt;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getEmailSubject() {
        return emailSubject;
    }

    public void setEmailSubject(String emailSubject) {
        this.emailSubject = emailSubject;
    }

    public String getEmailBody() {
        return emailBody;
    }

    public void setEmailBody(String emailBody) {
        this.emailBody = emailBody;
    }

    public List<String> getRecipientEmails() {
        return recipientEmails;
    }

    public void setRecipientEmails(List<String> recipientEmails) {
        this.recipientEmails = recipientEmails;
    }

    public LocalDateTime getSentAt() {
        return sentAt;
    }

    public void setSentAt(LocalDateTime sentAt) {
        this.sentAt = sentAt;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Notifications that = (Notifications) o;
        return Objects.equals(id, that.id) && Objects.equals(emailSubject, that.emailSubject) && Objects.equals(emailBody, that.emailBody) && Objects.equals(recipientEmails, that.recipientEmails) && Objects.equals(sentAt, that.sentAt);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, emailSubject, emailBody, recipientEmails, sentAt);
    }

    @Override
    public String toString() {
        return "Notifications{" +
                "id=" + id +
                ", emailSubject='" + emailSubject + '\'' +
                ", emailBody='" + emailBody + '\'' +
                ", recipientEmails=" + recipientEmails +
                ", sentAt=" + sentAt +
                '}';
    }
}
