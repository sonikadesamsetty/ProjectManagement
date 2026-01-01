package com.kanban.kanban_board.controller;

import com.kanban.kanban_board.model.StorySubscription;
import com.kanban.kanban_board.service.StorySubscriptionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SubscriptionController {

    private final StorySubscriptionService storySubscriptionService;

    public SubscriptionController(StorySubscriptionService storySubscriptionService) {
        this.storySubscriptionService = storySubscriptionService;
    }


    @RequestMapping("/subscriptions")
    public ResponseEntity<StorySubscription> createSubscription(@RequestBody StorySubscription storySubscription) {
        storySubscriptionService.createSubscription(storySubscription);
        // Implementation goes here
        return ResponseEntity.ok(new StorySubscription());
    }
}
