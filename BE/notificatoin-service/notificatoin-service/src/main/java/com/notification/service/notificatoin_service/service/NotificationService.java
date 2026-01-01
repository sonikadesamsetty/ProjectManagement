package com.notification.service.notificatoin_service.service;

import com.notification.service.notificatoin_service.entity.Notifications;
import com.notification.service.notificatoin_service.model.NotificationRequest;
import com.notification.service.notificatoin_service.repository.NotificationRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {


    private final JavaMailSender mailSender;

    private final NotificationRepository notificationRepository;
    public NotificationService(JavaMailSender mailSender, NotificationRepository notificationRepository) {
        this.mailSender = mailSender;
        this.notificationRepository = notificationRepository;
    }

    public ResponseEntity sendNotification(NotificationRequest request) {
        // Logic to send notification (e.g., email, SMS, push notification)
        List<String> emailIds = request.getEmailIds();
        for (String emailId : emailIds) {
            sendEmail(emailId, request);
        }
        Notifications notification = new Notifications();
        notification.setEmailSubject("");
        notification.setEmailBody(request.getDescription());
        notification.setRecipientEmails(emailIds);
        notification.setSentAt(java.time.LocalDateTime.now());
        notificationRepository.save(notification);
        return ResponseEntity.ok().build();
    }

    private void sendEmail(String emailId, NotificationRequest request) {
        //send email to emailId
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo();
        message.setTo(emailId);
        message.setSubject("Notification for Story Update ");
        message.setText(request.getDescription());
        mailSender.send(message);
    }
}
