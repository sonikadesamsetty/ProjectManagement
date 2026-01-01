package com.project.management.project_management.controller;

import com.project.management.project_management.api.ProjectsApi;
import com.project.management.project_management.model.Project;
import com.project.management.project_management.service.ProjectService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
//@CrossOrigin(origins = "http://localhost:4200")
public class ProjectController implements ProjectsApi {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @Override
    public ResponseEntity<List<Project>> projectsGet() {
        return projectService.getAllProjects();
    }

    @Override
    public ResponseEntity<Void> projectsIdDelete(Integer id) {
        return projectService.deleteProjectById(id);
    }

    @Override
    public ResponseEntity<Project> projectsIdGet(Integer id) {
        return projectService.getProjectById(id);
    }

    @Override
    public ResponseEntity<Project> projectsIdPut(Integer id, Project project) {
        return projectService.updateProject(id, project);
    }

    @Override
    public ResponseEntity<Project> projectsPost(Project project) {
        System.out.println(project);
        return projectService.addProject(project);
    }
}
