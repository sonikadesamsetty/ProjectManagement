package com.kanban.kanban_board.service;

import com.kanban.kanban_board.mapper.TaskMapper;
import com.kanban.kanban_board.model.TaskSubscription;
import com.kanban.kanban_board.repository.TaskSubscriptionRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class TaskSubscriptionService {

    private final TaskSubscriptionRepository taskSubscriptionRepository;

    private final TaskMapper taskMapper;

    public TaskSubscriptionService(TaskSubscriptionRepository taskSubscriptionRepository, TaskMapper taskMapper) {
        this.taskSubscriptionRepository = taskSubscriptionRepository;
        this.taskMapper = taskMapper;
    }

    public ResponseEntity<TaskSubscription> createSubscription(TaskSubscription taskSubscription) {
        var taskSubscriptionEntity = taskMapper.subscriptionModelToEntity(taskSubscription);
        taskSubscriptionEntity.getUserEmail().add(taskSubscription.getUserName());
        var savedSubscription = taskSubscriptionRepository.save(taskSubscriptionEntity);
        var subscriptionModel = taskMapper.subscriptionEntityToModel(savedSubscription);
        return ResponseEntity.ok(subscriptionModel);
    }
    public ResponseEntity<Void> deleteSubscriptionById(Integer id) {
        if (taskSubscriptionRepository.existsById(id)) {
            taskSubscriptionRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    public ResponseEntity<java.util.List<TaskSubscription>> getAllSubscriptions() {
        var subscriptions = taskSubscriptionRepository.findAll();
        var subscriptionModels = taskMapper.subscriptionEntitiesToModels(subscriptions);
        return ResponseEntity.ok(subscriptionModels);
    }
}
