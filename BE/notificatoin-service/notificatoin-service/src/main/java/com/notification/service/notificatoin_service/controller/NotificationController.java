package com.notification.service.notificatoin_service.controller;

import com.notification.service.notificatoin_service.model.NotificationRequest;
import com.notification.service.notificatoin_service.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @PostMapping("/notifyStoryUpdate")
    public ResponseEntity<Object> notifyStoryUpdate(@RequestBody NotificationRequest request) {
        // Logic to send notification about the story update
        notificationService.sendNotification(request);
        return ResponseEntity.ok().build();
    }

}
