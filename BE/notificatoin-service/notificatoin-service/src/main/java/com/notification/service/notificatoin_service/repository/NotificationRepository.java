package com.notification.service.notificatoin_service.repository;

import com.notification.service.notificatoin_service.entity.Notifications;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificationRepository extends org.springframework.data.jpa.repository.JpaRepository<Notifications, Integer> {
}
