package com.kanban.kanban_board.service;

import com.kanban.kanban_board.entity.*;
import com.kanban.kanban_board.mapper.StoryMapper;
import com.kanban.kanban_board.model.Attachment;
import com.kanban.kanban_board.model.Comment;
import com.kanban.kanban_board.model.NotificationRequest;
import com.kanban.kanban_board.model.Story;
import com.kanban.kanban_board.repository.CommentRepository;
import com.kanban.kanban_board.repository.StoryHistoryRepository;
import com.kanban.kanban_board.repository.StoryRepository;
import com.kanban.kanban_board.repository.StorySubscriptionRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.client.WebClient;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class StoryService {

    private final StoryRepository storyRepository;

    private final StoryMapper storyMapper;

    private final StoryHistoryRepository storyHistoryRepository;

    private final StorySubscriptionRepository storySubscriptionRepository;

    private final CommentRepository commentRepository;

    public StoryService(StoryRepository storyRepository, StoryMapper storyMapper, StoryHistoryRepository storyHistoryRepository, StorySubscriptionRepository storySubscriptionRepository, CommentRepository commentRepository) {
        this.storyRepository = storyRepository;
        this.storyMapper = storyMapper;
        this.storyHistoryRepository = storyHistoryRepository;
        this.storySubscriptionRepository = storySubscriptionRepository;
        this.commentRepository = commentRepository;
    }

    public ResponseEntity<List<Story>> getStories() {
        List<StoryEntity> stories = storyRepository.findAll();
        List<Story> storyModels = storyMapper.entitiesToModels(stories);
        return ResponseEntity.ok(storyModels);
    }

    public ResponseEntity<Story> getStoryById(Integer id) {
        StoryEntity storyEntity = storyRepository.findById(id).orElse(null);
        Story storyModel = storyMapper.entityToModel(storyEntity);
        List<Attachment> attachments = new ArrayList<>();
        System.out.println("Fetching story with ID: " + id);
        //System.out.println(storyEntity);
        System.out.println(storyEntity.getAttachments());
        if(storyEntity != null && storyEntity.getAttachments() != null) {
            for(AttachmentEntity attachmentEntity : storyEntity.getAttachments()) {
                Attachment attachment = new Attachment();
                attachment.setId(attachmentEntity.getId());
                attachment.setFileName(attachmentEntity.getFileName());
                attachment.setFileType(attachmentEntity.getFileType());
                attachment.setFileData(attachmentEntity.getData());
                attachments.add(attachment);
            }
            storyModel.setAttachments(attachments);
        }
        System.out.println("story id" + id);
        List<CommentEntity> comments = commentRepository.findByStoryId(id);
        System.out.println("comments: " + comments);
        List<Comment> commentModels = new ArrayList<>();
        for(CommentEntity commentEntity : comments) {
            Comment commentModel = new Comment();
            commentModel.setId(commentEntity.getId());
            commentModel.setDescription(commentEntity.getDescription());
            commentModel.setCreatedBy(commentEntity.getCreatedBy());
            commentModel.setCreatedAt( commentEntity.getCreatedAt().atOffset(ZoneOffset.UTC));
            commentModels.add(commentModel);
        }
        storyModel.setComments(commentModels);

        return storyModel != null ? ResponseEntity.ok(storyModel) : ResponseEntity.notFound().build();
    }

    public ResponseEntity<Story> createStory(Story story, List<MultipartFile> attachments) {
        System.out.println("Creating story: " + story);
        System.out.println("Number of attachments: " + (attachments != null ? attachments.size() : 0));
        StoryEntity storyEntity  = storyMapper.modelToEntity(story);
        storyEntity.setId(null);
        List<AttachmentEntity> attachmentEntities = new ArrayList<>();
        if(attachments != null) {
            for (MultipartFile attachment : attachments) {
                AttachmentEntity attachmentEntity = new AttachmentEntity();
                attachmentEntity.setStory(storyEntity);
                attachmentEntity.setFileName(attachment.getOriginalFilename());
                attachmentEntity.setFileType(attachment.getContentType());
                try {
                    attachmentEntity.setData(attachment.getBytes());
                } catch (IOException e) {
                    System.out.println("Failed to read attachment data: " + e.getMessage());
                    return ResponseEntity.badRequest().build();
                }
                attachmentEntity.setUploadedAt(LocalDateTime.now());
                attachmentEntity.setUploadedBy(story.getCreatedBy());
                attachmentEntities.add(attachmentEntity);
            }
        }
        storyEntity.setAttachments(attachmentEntities);
        StoryEntity savedStory = storyRepository.save(storyEntity);
        Story storyModel = storyMapper.entityToModel(savedStory);
        StorySubscriptionEntity storySubscriptionEntity = new StorySubscriptionEntity();
        storySubscriptionEntity.setStory(storyEntity);
        System.out.println("user 80"+story.getCreatedBy());
        storySubscriptionEntity.setUserEmail(List.of(story.getCreatedBy()));
        storySubscriptionEntity.setCreatedAt(LocalDateTime.now());


        storySubscriptionRepository.save(storySubscriptionEntity);
        System.out.println("Story created with ID: " + savedStory.getId());

        return storyModel != null ? ResponseEntity.ok(storyModel) : ResponseEntity.badRequest().build();
    }

    public ResponseEntity<Void> deleteStoryById(Integer id) {
        if(storyRepository.existsById(id)) {
            storyRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    //find what fields are updated and store it in story history table like "sony has updated state in story name"
    public ResponseEntity<Story> updateStory(Story story) {
        if(story.getId() == null || !storyRepository.existsById(story.getId())) {
            return ResponseEntity.notFound().build();
        }
        System.out.println("Updating story: " + story);
        StoryEntity storyEntity = storyMapper.modelToEntity(story);

        StoryEntity updatedStory = storyRepository.save(storyEntity);
        Story existingStory = getStoryById(story.getId()).getBody();
        String changes = "";
        if(existingStory.getAssignedTo() != null && !existingStory.getAssignedTo().equals(story.getAssignedTo())) {
            changes+="Assignee ";
        }
        if(existingStory.getStatus() != null && !existingStory.getStatus().equals(story.getStatus())) {
            changes+="Status ";
        }
        if(existingStory.getPriority() != null && !existingStory.getPriority().equals(story.getPriority())) {
            changes+="Priority ";
        }
        if(existingStory.getDescription() != null && !existingStory.getDescription().equals(story.getDescription())) {
            changes+="Description ";
        }
        if(existingStory.getTitle() != null && !existingStory.getTitle().equals(story.getTitle())) {
            changes+="Title ";
        }

        Story storyModel = storyMapper.entityToModel(updatedStory);
        StoryHistoryEntity historyEntity = new StoryHistoryEntity();
        historyEntity.setStory(updatedStory);
        historyEntity.setDescription(updatedStory.getModifiedBy() + " has updated " + changes + "in story " + updatedStory.getTitle());
        storyHistoryRepository.save(historyEntity);

        //call notification-service to send email notifications to all subscribers of this story about the changes
        //use webclient

        NotificationRequest updatedStoryNotification = new NotificationRequest();
        updatedStoryNotification.setId(updatedStory.getId());
        StorySubscriptionEntity storySubscriptionEntity = storySubscriptionRepository.findByStoryId(updatedStory.getId());
       if(storySubscriptionEntity==null){
           System.out.println("No subscribers for this story.");
           return ResponseEntity.ok(storyModel);
         }
        updatedStoryNotification.setEmailIds(storySubscriptionEntity.getUserEmail());
        //updatedStoryNotification.setSubject(updatedStory.getTitle());
        updatedStoryNotification.setDescription("The story " + updatedStory.getTitle() + " has been updated. Changes: " + changes);
        System.out.println("calling notification service...");
        try {
            WebClient webClient = WebClient.create();
            webClient.post()
                    .uri("http://localhost:8088/notificatoin-service/notifyStoryUpdate")
                    .bodyValue(updatedStoryNotification)
                    .retrieve()
                    .bodyToMono(Void.class).block();
        } catch (Exception e) {
            System.out.println("Failed to call notification service: " + e.getMessage());
        }
        return ResponseEntity.ok(storyModel);
    }

    public ResponseEntity<String> updateStoryState(Integer storyId, String state) {
        System.out.println("story id:"+ storyId + " state: " + state);
        Optional<StoryEntity> storyEntityOptional = storyRepository.findById(storyId);
        if(storyEntityOptional.isPresent()) {
            StoryEntity storyEntity = storyEntityOptional.get();
            storyEntity.setStatus(state);
            storyRepository.save(storyEntity);
            return ResponseEntity.ok("Story state Updated");
        }
        return ResponseEntity.badRequest().build();
    }
}
