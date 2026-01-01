package com.kanban.kanban_board.service;

import com.kanban.kanban_board.entity.CommentEntity;
import com.kanban.kanban_board.entity.TaskEntity;
import com.kanban.kanban_board.entity.TaskHistoryEntity;
import com.kanban.kanban_board.mapper.TaskMapper;
import com.kanban.kanban_board.model.Comment;
import com.kanban.kanban_board.model.Task;
import com.kanban.kanban_board.repository.CommentRepository;
import com.kanban.kanban_board.repository.TaskHistoryRepository;
import com.kanban.kanban_board.repository.TaskRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    private final TaskMapper taskMapper;

    private final TaskHistoryRepository taskHistoryRepository;

    private final CommentRepository commentRepository;

    public TaskService(TaskRepository taskRepository, TaskMapper taskMapper, TaskHistoryRepository taskHistoryRepository, CommentRepository commentRepository) {
        this.taskRepository = taskRepository;
        this.taskMapper = taskMapper;
        this.taskHistoryRepository = taskHistoryRepository;
        this.commentRepository = commentRepository;
    }
    public ResponseEntity<Task> createTask(Task task) {
        TaskEntity taskEntity = taskMapper.modelToEntity(task);
        taskEntity.setId(null);
        taskEntity.setCreatedAt(LocalDateTime.now());
        taskEntity.setModifiedAt(LocalDateTime.now());
        System.out.println("task : "+ taskEntity);
        TaskEntity savedEntity = taskRepository.save(taskEntity);
        Task savedTask = taskMapper.entityToModel(savedEntity);
        return ResponseEntity.ok(savedTask);
    }

    public ResponseEntity<Task> getTaskById(Integer id) {
        Task task = taskRepository.findById(id)
                .map(taskMapper::entityToModel)
                .get();
        System.out.println("story id" + id);
        List<CommentEntity> comments = commentRepository.findByTaskId(id);
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
        task.setComments(commentModels);
        return ResponseEntity.ok(task);
    }

    public ResponseEntity<java.util.List<Task>> getTasks() {
        var tasks = taskRepository.findAll();
        var taskModels = taskMapper.entitiesToModels(tasks);
        return ResponseEntity.ok(taskModels);
    }

    public ResponseEntity<Task> updateTask(Task task) {
        TaskEntity existingTask = taskRepository.findById(task.getId()).orElse(null);
        String changes = "";
        if(existingTask.getTitle() != null && !existingTask.getTitle().equals(task.getTitle())) {
            changes+="Title ";
            existingTask.setTitle(task.getTitle());
        }
        if(existingTask.getDescription() != null && !existingTask.getDescription().equals(task.getDescription())) {
            changes+="Description ";
            existingTask.setDescription(task.getDescription());
        }
        if(existingTask.getStatus() != null && !existingTask.getStatus().equals(task.getStatus())) {
            changes+="Status ";
            existingTask.setStatus(task.getStatus());
        }
        if(existingTask.getPriority() != null && !existingTask.getPriority().equals(task.getPriority())) {
            changes+="Priority ";
            existingTask.setPriority(task.getPriority());
        }
        if(existingTask.getTotalHours() != null && !existingTask.getTotalHours().equals(task.getTotalHours())) {
            changes+="Total Hours ";
            existingTask.setTotalHours(task.getTotalHours());
        }
        if(existingTask.getAssignedTo() != null && !existingTask.getAssignedTo().equals(task.getAssignedTo())) {
            changes+="Assignee ";
            existingTask.setAssignedTo(task.getAssignedTo());
        }
        if(existingTask.getCompletedHours() != null && !existingTask.getCompletedHours().equals(task.getCompletedHours())) {
            changes+="Completed Hours Remaining Hours ";
            existingTask.setCompletedHours(task.getCompletedHours());
            existingTask.setRemainingHours(existingTask.getTotalHours() - task.getCompletedHours());
        }
        existingTask.setModifiedAt(LocalDateTime.now());
        existingTask.setModifiedBy(task.getModifiedBy());
        TaskEntity updatedTask = taskRepository.save(existingTask);
        Task taskModel = taskMapper.entityToModel(updatedTask);
        TaskHistoryEntity historyEntity = new TaskHistoryEntity();
        historyEntity.setTask(updatedTask);

        historyEntity.setDescription(updatedTask.getModifiedBy() + " has updated " + changes + "in task " + updatedTask.getTitle());
        historyEntity.setUpdatedAt(LocalDateTime.now());
        historyEntity.setUpdatedBy(updatedTask.getModifiedBy());
        taskHistoryRepository.save(historyEntity);
        return ResponseEntity.ok(taskModel);
    }

    public ResponseEntity<Void> deleteTaskById(Integer id) {
        if(taskRepository.existsById(id)) {
            taskRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
