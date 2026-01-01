package com.project.management.project_management.controller;

import com.project.management.project_management.api.MembersApi;
import com.project.management.project_management.model.Member;
import com.project.management.project_management.service.ProjectMemberService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
//@CrossOrigin(origins = "http://localhost:4200") // Adjust the origin as needed
public class ProjectMemberController implements MembersApi {

    private final ProjectMemberService projectMemberService;

    public ProjectMemberController(ProjectMemberService projectMemberService) {
        this.projectMemberService = projectMemberService;
    }


    @Override
    public ResponseEntity<List<Member>> membersGet() {
        return projectMemberService.getAllMembers();
    }

    @Override
    public ResponseEntity<Void> membersIdDelete(Integer id) {
        return projectMemberService.deleteMemberById(id);
    }

    @Override
    public ResponseEntity<Member> membersPost(Member member) {
        return projectMemberService.addMember(member);
    }
}
