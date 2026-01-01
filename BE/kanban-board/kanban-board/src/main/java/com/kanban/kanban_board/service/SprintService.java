package com.kanban.kanban_board.service;

import com.kanban.kanban_board.entity.SprintEntity;
import com.kanban.kanban_board.mapper.SprintMapper;
import com.kanban.kanban_board.model.Sprint;
import com.kanban.kanban_board.repository.SprintRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SprintService {

    private final SprintRepository sprintRepository;

    private final SprintMapper sprintMapper;

    public SprintService(SprintRepository sprintRepository, SprintMapper sprintMapper) {
        this.sprintRepository = sprintRepository;
        this.sprintMapper = sprintMapper;
    }

    public ResponseEntity<List<Sprint>> getAllSprints() {
        List<SprintEntity> sprints = sprintRepository.findAll();
        List<Sprint> sprintModels = sprintMapper.entitiesToModels(sprints);
        return sprintModels != null ? ResponseEntity.ok(sprintModels) : ResponseEntity.noContent().build();
    }

    public ResponseEntity<Sprint> getSprintById(Integer id) {
        SprintEntity sprintEntity = sprintRepository.findById(id).orElse(null);
        Sprint sprintModel = sprintMapper.entityToModel(sprintEntity);
        return sprintModel != null ? ResponseEntity.ok(sprintModel) : ResponseEntity.notFound().build();
    }

    public ResponseEntity<Sprint> createSprint(Sprint sprint) {
        SprintEntity sprintEntity  = sprintMapper.modelToEntity(sprint);
        sprintEntity.setId(null);
        sprintEntity.setCreatedAt(LocalDateTime.now());
        sprintEntity.setModifiedAt(LocalDateTime.now());
        SprintEntity savedSprint = sprintRepository.save(sprintEntity);
        Sprint sprintModel = sprintMapper.entityToModel(savedSprint);
        return sprintModel != null ? ResponseEntity.ok(sprintModel) : ResponseEntity.badRequest().build();
    }

    public ResponseEntity<Sprint> updateSprint(Sprint sprint) {
        SprintEntity existingSprintEntity = sprintRepository.findById(sprint.getId()).orElse(null);
        if(existingSprintEntity == null) {
            return ResponseEntity.notFound().build();
        }
        existingSprintEntity.setModifiedAt(LocalDateTime.now());
        SprintEntity updatedSprint = sprintRepository.save(existingSprintEntity);
        Sprint sprintModel = sprintMapper.entityToModel(updatedSprint);
        return sprintModel != null ? ResponseEntity.ok(sprintModel) : ResponseEntity.badRequest().build();
    }

    public ResponseEntity<Void> deleteSprintById(Integer id) {
        if(sprintRepository.existsById(id)) {
            sprintRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
