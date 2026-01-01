package com.project.management.project_management.service;

import com.project.management.project_management.entity.ProjectEntity;
import com.project.management.project_management.entity.ProjectMemberEntity;
import com.project.management.project_management.mapper.ProjectMapper;
import com.project.management.project_management.model.Project;
import com.project.management.project_management.repository.ProjectRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;

    private final ProjectMapper projectMapper;

    private final ProjectMemberService projectMemberService;

    public ProjectService(ProjectRepository projectRepository, ProjectMapper projectMapper, ProjectMemberService projectMemberService) {
        this.projectRepository = projectRepository;
        this.projectMapper = projectMapper;
        this.projectMemberService = projectMemberService;
    }

    public ResponseEntity<List<Project>> getAllProjects() {

        List<ProjectEntity> projects = projectRepository.findAll();
        List<Project> projectModels = projectMapper.projectEntitiestoModels(projects);

        return ResponseEntity.ok(projectModels);
    }

    public ResponseEntity<Project> getProjectById(Integer id) {
        return projectRepository.findById(id)
                .map(projectMapper::projectEntitytoModel)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    public ResponseEntity<Project> addProject(Project project) {
        ProjectEntity projectEntity = projectMapper.projectModelToProject(project);
        projectEntity.setId(null);
        projectEntity.setCreatedAt(LocalDateTime.now());
        projectEntity.setModifiedAt(LocalDateTime.now());
        List<ProjectMemberEntity> list = new ArrayList<>();
        project.getProjectMembers().forEach(member -> {
            ProjectMemberEntity projectMemberEntity = new ProjectMemberEntity();
            projectMemberEntity.setName(member.getName());
            projectMemberEntity.setRole(member.getRole());
            projectMemberEntity.setId(null);
            projectMemberEntity.setCreatedAt(LocalDateTime.now());
            projectMemberEntity.setProject(projectEntity);
            list.add(projectMemberEntity);
        });
        projectEntity.setProjectMembers(list);
        ProjectEntity savedProject = projectRepository.save(projectEntity);
        Project projectModel = projectMapper.projectEntitytoModel(savedProject);
        return ResponseEntity.ok(projectModel);
    }

    public ResponseEntity<Project> updateProject(Integer id, Project project) {
        Optional<ProjectEntity> existingProjectOpt = projectRepository.findById(id);
        ProjectEntity projectEntity = projectMapper.projectModelToProject(project);
        if(existingProjectOpt.isPresent()) {
           /* projectEntity.setId(id);
            System.out.println("updated project");
            System.out.println(projectEntity);
           *//* List<ProjectMemberEntity> projectMemberEntity = projectEntity.getProjectMembers();
            List<ProjectMemberEntity> projectMemberEntities = projectMemberEntity.stream().filter(member->member.getId()==0).collect(Collectors.toList());
            projectMemberEntities.forEach(member -> {member.setProject(projectEntity);
                member.setId(null);});
            projectEntity.setProjectMembers(projectMemberEntities);*//*
            System.out.println("project entity:");
            System.out.println(projectEntity);
            ProjectEntity updatedProject = projectRepository.save(projectEntity);*/
           /* projectMemberEntities = projectMemberEntity.stream().filter(member->member.getId()!=null && member.getId()!=0).collect(Collectors.toList());
            System.out.println("project member entities:");
            System.out.println(projectMemberEntities);
            projectMemberEntities.forEach(projectMemberEntity1 -> {
                projectMemberService.deleteMemberById(projectMemberEntity1.getId());
            });*/
            System.out.println("existing project found, updating...");
            System.out.println(project);
            ProjectEntity existingProjectEntity = existingProjectOpt.get();
            if(project.getName() != null) {
                existingProjectEntity.setName(project.getName());
            }
            existingProjectEntity.setModifiedAt(LocalDateTime.now());
            if(project.getDescription() != null) {
                existingProjectEntity.setDescription(project.getDescription());
            }
            if(project.getStartDate() != null) {
                existingProjectEntity.setStartDate(project.getStartDate().toLocalDateTime());
            }
            if(project.getEndDate() != null) {
                existingProjectEntity.setEndDate(project.getEndDate().toLocalDateTime());
            }
            ProjectEntity updatedProject = projectRepository.save(existingProjectEntity);
            Project projectModel = projectMapper.projectEntitytoModel(updatedProject);
            return ResponseEntity.ok(projectModel);
        }

        return ResponseEntity.notFound().build();
    }

    public ResponseEntity<Void> deleteProjectById(Integer id) {
        return projectRepository.findById(id)
                .map(existingProject -> {
                    projectRepository.delete(existingProject);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }


}
