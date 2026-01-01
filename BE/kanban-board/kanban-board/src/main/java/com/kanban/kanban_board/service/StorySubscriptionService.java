package com.kanban.kanban_board.service;

import com.kanban.kanban_board.entity.StorySubscriptionEntity;
import com.kanban.kanban_board.mapper.StoryMapper;
import com.kanban.kanban_board.model.StorySubscription;
import com.kanban.kanban_board.repository.StorySubscriptionRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class StorySubscriptionService {

    private final StorySubscriptionRepository storySubscriptionRepository;

    private final StoryMapper storyMapper;

    public StorySubscriptionService(StorySubscriptionRepository storySubscriptionRepository, StoryMapper storyMapper) {
        this.storySubscriptionRepository = storySubscriptionRepository;
        this.storyMapper = storyMapper;
    }
    public ResponseEntity<Void> deleteSubscriptionById(Integer id) {
        if (storySubscriptionRepository.existsById(id)) {
            storySubscriptionRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    public ResponseEntity<List<StorySubscription>> getAllSubscriptions() {
        List<StorySubscriptionEntity> subscriptions = storySubscriptionRepository.findAll();
        List<StorySubscription> subscriptionModels = storyMapper.subscriptionEntitiesToModels(subscriptions);
        return ResponseEntity.ok(subscriptionModels);
    }

    public ResponseEntity<StorySubscription> createSubscription(StorySubscription subscription) {
        StorySubscriptionEntity subscriptionEntity = storyMapper.subscriptionModelToEntity(subscription);
        StorySubscriptionEntity existingSubscription = storySubscriptionRepository.findByStoryId(subscription.getStoryId());
        if(existingSubscription!=null) {
            existingSubscription.getUserEmail().add(subscription.getUserEmail().get(0));
            StorySubscriptionEntity savedSubscription = storySubscriptionRepository.save(existingSubscription);
            StorySubscription subscriptionModel = storyMapper.subscriptionEntityToModel(savedSubscription);
            return ResponseEntity.ok(subscriptionModel);
        }
            subscriptionEntity.setCreatedAt(LocalDateTime.now());
            StorySubscriptionEntity savedSubscription = storySubscriptionRepository.save(subscriptionEntity);
            StorySubscription subscriptionModel = storyMapper.subscriptionEntityToModel(savedSubscription);
            return ResponseEntity.ok(subscriptionModel);

    }

    public ResponseEntity<StorySubscription> deleteSubscription(StorySubscription subscription) {
        StorySubscriptionEntity existingSubscription = storySubscriptionRepository.findByStoryId(subscription.getStoryId());
        if(existingSubscription!=null) {

            System.out.println("existing deleting subscription");
            System.out.println(existingSubscription.getUserEmail());
            //System.out.println(existingSubscription);
            existingSubscription.getUserEmail().remove(subscription.getUserEmail().get(0));
            System.out.println(existingSubscription.getUserEmail());
            StorySubscriptionEntity savedSubscription = storySubscriptionRepository.save(existingSubscription);
            StorySubscription subscriptionModel = storyMapper.subscriptionEntityToModel(savedSubscription);
            return ResponseEntity.ok(subscriptionModel);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
