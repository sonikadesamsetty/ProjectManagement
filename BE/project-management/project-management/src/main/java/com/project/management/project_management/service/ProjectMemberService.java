package com.project.management.project_management.service;

import com.project.management.project_management.entity.ProjectEntity;
import com.project.management.project_management.entity.ProjectMemberEntity;
import com.project.management.project_management.mapper.ProjectMapper;
import com.project.management.project_management.model.Member;
import com.project.management.project_management.repository.ProjectMemberRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectMemberService {

    private final ProjectMemberRepository projectMemberRepository;

    private final ProjectMapper projectMapper;

    public ProjectMemberService(ProjectMemberRepository projectMemberRepository, ProjectMapper projectMapper) {
        this.projectMemberRepository = projectMemberRepository;
        this.projectMapper = projectMapper;
    }


    public ResponseEntity<List<Member>> getAllMembers() {
        List<ProjectMemberEntity> members = projectMemberRepository.findAll();
        List<Member> memberModels = projectMapper.memberEntitiesToModels(members);
        return ResponseEntity.ok(memberModels);
    }

    public ResponseEntity<Member> addMember(Member member) {
        ProjectMemberEntity memberEntity = projectMapper.memberModelToEntity(member);
        ProjectEntity project = new ProjectEntity();
        project.setId(member.getProjectId());
        memberEntity.setProject(project);
        ProjectMemberEntity savedMember = projectMemberRepository.save(memberEntity);
        Member memberModel = projectMapper.memberEntityToModel(savedMember);
        return ResponseEntity.ok(memberModel);
    }

    public ResponseEntity<Void> deleteMemberById(Integer id) {
        if(projectMemberRepository.existsById(id)) {
            projectMemberRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
