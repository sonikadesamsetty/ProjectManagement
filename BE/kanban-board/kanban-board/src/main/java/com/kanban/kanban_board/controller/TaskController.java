package com.kanban.kanban_board.controller;

import com.kanban.kanban_board.api.TasksApi;
import com.kanban.kanban_board.model.Task;
import com.kanban.kanban_board.model.TaskSubscription;
import com.kanban.kanban_board.service.TaskService;
import com.kanban.kanban_board.service.TaskSubscriptionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
//@CrossOrigin(origins = "http://localhost:4200") // Adjust the origin as needed
public class TaskController implements TasksApi {

    private final TaskService taskService;

    private final TaskSubscriptionService taskSubscriptionService;

    public TaskController(TaskService taskService, TaskSubscriptionService taskSubscriptionService) {
        this.taskService = taskService;
        this.taskSubscriptionService = taskSubscriptionService;
    }

    @Override
    public ResponseEntity<List<Task>> tasksGet() {
        return taskService.getTasks();
    }

    @Override
    public ResponseEntity<Void> tasksIdDelete(Integer id) {
        return taskService.deleteTaskById(id);
    }

    @Override
    public ResponseEntity<Task> tasksIdGet(Integer id) {
        return taskService.getTaskById(id);
    }

    @Override
    public ResponseEntity<Task> tasksPost(Task task) {
        return taskService.createTask(task);
    }

    @Override
    public ResponseEntity<Task> tasksPut(Task task) {
        return taskService.updateTask(task);
    }

    @Override
    public ResponseEntity<List<TaskSubscription>> tasksSubscriptionsGet() {
        return taskSubscriptionService.getAllSubscriptions();
    }

    @Override
    public ResponseEntity<Void> tasksSubscriptionsIdDelete(Integer id) {
        return taskSubscriptionService.deleteSubscriptionById(id);
    }

    @Override
    public ResponseEntity<TaskSubscription> tasksSubscriptionsPost(TaskSubscription taskSubscription) {
        return taskSubscriptionService.createSubscription(taskSubscription);
    }
}
