package com.kanban.kanban_board.controller;

import com.kanban.kanban_board.api.SprintsApi;
import com.kanban.kanban_board.model.Sprint;
import com.kanban.kanban_board.service.SprintService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
//@CrossOrigin(origins = "http://localhost:4200")
public class SprintController implements SprintsApi {

    private final SprintService sprintService;

    public SprintController(SprintService sprintService) {
        this.sprintService = sprintService;
    }

    @Override
    public ResponseEntity<List<Sprint>> sprintsGet() {
        return sprintService.getAllSprints();
    }

    @Override
    public ResponseEntity<Void> sprintsIdDelete(Integer id) {
        return sprintService.deleteSprintById(id);
    }

    @Override
    public ResponseEntity<Sprint> sprintsIdGet(Integer id) {
        return sprintService.getSprintById(id);
    }

    @Override
    public ResponseEntity<Sprint> sprintsPost(Sprint sprint) {
        return sprintService.createSprint(sprint);
    }

    @Override
    public ResponseEntity<Sprint> sprintsPut(Sprint sprint) {
        return sprintService.updateSprint(sprint);
    }
}
