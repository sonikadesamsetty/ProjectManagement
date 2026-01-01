package com.kanban.kanban_board.service;

import com.kanban.kanban_board.entity.AttachmentEntity;
import com.kanban.kanban_board.entity.StoryEntity;
import com.kanban.kanban_board.model.Attachment;
import com.kanban.kanban_board.repository.AttachmentRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public class AttachmentService {

    private final AttachmentRepository attachmentRepository;
    public AttachmentService(AttachmentRepository attachmentRepository) {
        this.attachmentRepository = attachmentRepository;
    }

    public ResponseEntity<List<Attachment>> addAttachmentsToStory(Integer id, List<MultipartFile> attachments) {
        System.out.println("Adding attachments to story with ID: " + id);
        System.out.println(attachments);
        List<AttachmentEntity> savedAttachments = new java.util.ArrayList<>();
        for(MultipartFile file : attachments) {
            try {
                AttachmentEntity attachmentEntity = new AttachmentEntity();
                attachmentEntity.setFileName(file.getOriginalFilename());
                attachmentEntity.setFileType(file.getContentType());
                attachmentEntity.setData(file.getBytes());
                StoryEntity storyEntity = new StoryEntity();
                storyEntity.setId(id);
                attachmentEntity.setStory(storyEntity);
                AttachmentEntity savedEntity = attachmentRepository.save(attachmentEntity);
                savedAttachments.add(savedEntity);
            } catch ( IOException e) {
                return ResponseEntity.status(500).build();
            }
        }
        return ResponseEntity.ok(
                savedAttachments.stream().map(entity -> {
                    Attachment attachment = new Attachment();
                    attachment.setId(entity.getId());
                    attachment.setFileName(entity.getFileName());
                    attachment.setFileType(entity.getFileType());
                    return attachment;
                }).toList()
        );
    }

    public ResponseEntity<Void> deleteAttachments(List<Integer> attachmentIds) {
        for(Integer id : attachmentIds) {
            attachmentRepository.deleteById(Long.valueOf(id));
        }
        return ResponseEntity.noContent().build();
    }
}
