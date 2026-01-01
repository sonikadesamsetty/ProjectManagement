package com.kanban.kanban_board.mapper;

import com.kanban.kanban_board.entity.SprintEntity;
import com.kanban.kanban_board.model.Sprint;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;

@Mapper(componentModel = "spring")
public interface SprintMapper {

    @Mapping(source = "startDate", target = "startDate", qualifiedByName = "offsetDateTimeToLocalDateTime")
    @Mapping(source = "endDate", target = "endDate", qualifiedByName = "offsetDateTimeToLocalDateTime")
    @Mapping(source = "createdAt", target = "createdAt", qualifiedByName = "offsetDateTimeToLocalDateTime")
    @Mapping(source = "modifiedAt", target = "modifiedAt", qualifiedByName = "offsetDateTimeToLocalDateTime")
    @Mapping(source = "projectId", target = "projectId")
    SprintEntity modelToEntity(Sprint sprint);

    @Mapping(source = "startDate", target = "startDate", qualifiedByName = "localDateTimeToOffsetDateTime")
    @Mapping(source = "endDate", target = "endDate", qualifiedByName = "localDateTimeToOffsetDateTime")
    @Mapping(source = "createdAt", target = "createdAt", qualifiedByName = "localDateTimeToOffsetDateTime")
    @Mapping(source = "modifiedAt", target = "modifiedAt", qualifiedByName = "localDateTimeToOffsetDateTime")
    @Mapping(source = "projectId", target = "projectId")
    Sprint entityToModel(SprintEntity sprintEntity);

    java.util.List<Sprint> entitiesToModels(java.util.List<SprintEntity> sprintEntities);

    @Named("localDateTimeToOffsetDateTime")
    default OffsetDateTime localDateTimeToOffsetDateTime(LocalDateTime localDateTime) {
        return localDateTime != null ? localDateTime.atOffset(ZoneOffset.UTC) : null;
    }

    @Named("offsetDateTimeToLocalDateTime")
    default LocalDateTime offsetDateTimeToLocalDateTime(OffsetDateTime offsetDateTime) {
        return offsetDateTime != null ? offsetDateTime.toLocalDateTime() : null;
    }
}
