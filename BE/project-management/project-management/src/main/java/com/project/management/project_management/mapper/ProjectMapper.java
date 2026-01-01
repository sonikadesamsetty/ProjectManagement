package com.project.management.project_management.mapper;

import com.project.management.project_management.entity.ProjectEntity;
import com.project.management.project_management.entity.ProjectMemberEntity;
import com.project.management.project_management.model.Member;
import com.project.management.project_management.model.Project;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;

@Mapper(componentModel = "spring")
public interface ProjectMapper {

    //provide mappings
    @Mapping(source = "startDate", target = "startDate", qualifiedByName = "localDateTimeToOffsetDateTime")
    @Mapping(source = "endDate", target = "endDate", qualifiedByName = "localDateTimeToOffsetDateTime")
    @Mapping(source = "createdAt", target = "createdAt", qualifiedByName = "localDateTimeToOffsetDateTime")
    @Mapping(source = "modifiedAt", target = "modifiedAt", qualifiedByName = "localDateTimeToOffsetDateTime")
    Project projectEntitytoModel(ProjectEntity projectEntity);

    List<Project> projectEntitiestoModels(List<ProjectEntity> projectEntities);

   //provide all mappings
    @Mapping(source = "startDate", target = "startDate", qualifiedByName = "offsetDateTimeToLocalDateTime")
    @Mapping(source = "endDate", target = "endDate", qualifiedByName = "offsetDateTimeToLocalDateTime")
    @Mapping(source = "createdAt", target = "createdAt", qualifiedByName = "offsetDateTimeToLocalDateTime")
    @Mapping(source = "modifiedAt", target = "modifiedAt", qualifiedByName = "offsetDateTimeToLocalDateTime")
    ProjectEntity projectModelToProject(Project projectModel);

    List<ProjectEntity> projectModelsToEntities(List<Project> projectModels);

    @Mapping(source = "createdAt", target = "createdAt", qualifiedByName = "localDateTimeToOffsetDateTime")
    @Mapping(source="project.id", target = "projectId")
    Member memberEntityToModel(ProjectMemberEntity memberEntity);

    @Mapping(source = "createdAt", target = "createdAt", qualifiedByName = "offsetDateTimeToLocalDateTime")
    @Mapping(source="projectId", target = "project.id")
    ProjectMemberEntity memberModelToEntity(Member memberModel);

    List<Member> memberEntitiesToModels(List<ProjectMemberEntity> memberEntities);

    @Named("localDateTimeToOffsetDateTime")
    default OffsetDateTime localDateTimeToOffsetDateTime(LocalDateTime localDateTime) {
        return localDateTime != null ? localDateTime.atOffset(ZoneOffset.UTC) : null;
    }

    @Named("offsetDateTimeToLocalDateTime")
    default LocalDateTime offsetDateTimeToLocalDateTime(OffsetDateTime offsetDateTime) {
        return offsetDateTime != null ? offsetDateTime.toLocalDateTime() : null;
    }
}
