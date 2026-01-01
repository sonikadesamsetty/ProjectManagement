package com.kanban.kanban_board.controller;

import com.kanban.kanban_board.api.StoriesApi;
import com.kanban.kanban_board.model.Attachment;
import com.kanban.kanban_board.model.Story;
import com.kanban.kanban_board.model.StorySubscription;
import com.kanban.kanban_board.service.AttachmentService;
import com.kanban.kanban_board.service.StoryService;
import com.kanban.kanban_board.service.StorySubscriptionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.time.OffsetDateTime;
import java.util.List;

@RestController
//@CrossOrigin(origins = "http://localhost:4200")
public class StoryController implements StoriesApi {

    private final StoryService storyService;

    private final StorySubscriptionService storySubscriptionService;

    private final AttachmentService attachmentService;

    public StoryController(StoryService storyService, StorySubscriptionService storySubscriptionService, AttachmentService attachmentService) {
        this.storyService = storyService;
        this.storySubscriptionService = storySubscriptionService;
        this.attachmentService = attachmentService;
    }

    @Override
    public ResponseEntity<Void> storiesAttachmentsDelete(List<Integer> attachmentIds) {
        return attachmentService.deleteAttachments(attachmentIds);
    }

    @Override
    public ResponseEntity<List<Story>> storiesGet() {
       return storyService.getStories();
    }

    @Override
    public ResponseEntity<List<Attachment>> storiesIdAttachmentsPost(Integer id, List<MultipartFile> attachments) {
        return attachmentService.addAttachmentsToStory(id, attachments);
    }

    @Override
    public ResponseEntity<Void> storiesIdDelete(Integer id) {
        return storyService.deleteStoryById(id);
    }

    @Override
    public ResponseEntity<Story> storiesIdGet(Integer id) {
        return storyService.getStoryById(id);
    }

    @Override
    public ResponseEntity<Story> storiesPost(Story story, List<MultipartFile> attachments) {
        return storyService.createStory(story, attachments);
    }

    @Override
    public ResponseEntity<Story> storiesPut(Story story) {
        return storyService.updateStory(story);
    }


    @Override
    public ResponseEntity<StorySubscription> storiesSubscriptionsDelete(StorySubscription storySubscription) {
        return storySubscriptionService.deleteSubscription(storySubscription);
    }

    @Override
    public ResponseEntity<List<StorySubscription>> storiesSubscriptionsGet() {
        return storySubscriptionService.getAllSubscriptions();
    }

    @Override
    public ResponseEntity<Void> storiesSubscriptionsIdDelete(Integer id) {
        return storySubscriptionService.deleteSubscriptionById(id);
    }

    @Override
    public ResponseEntity<StorySubscription> storiesSubscriptionsPost(StorySubscription storySubscription) {
        return storySubscriptionService.createSubscription(storySubscription);
    }

    @Override
    public ResponseEntity<String> storiesUpdateStateStoryIdStatePut(Integer storyId, String state) {
        return storyService.updateStoryState(storyId, state);
    }

}
