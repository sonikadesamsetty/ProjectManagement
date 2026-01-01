package com.kanban.kanban_board.mapper;

import com.kanban.kanban_board.entity.CommentEntity;
import com.kanban.kanban_board.model.Comment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;

@Mapper(componentModel = "spring")
public interface CommentMapper {

    @Mapping(source = "createdAt", target = "createdAt", qualifiedByName = "localDateTimeToOffsetDateTime")
    @Mapping(source = "modifiedAt", target = "modifiedAt", qualifiedByName = "localDateTimeToOffsetDateTime")
    @Mapping(source = "story.id", target = "storyId")
    @Mapping(source = "task.id", target = "taskId")
    Comment entityToModel(CommentEntity commentEntity);

    @Mapping(source = "createdAt", target = "createdAt", qualifiedByName = "offsetDateTimeToLocalDateTime")
    @Mapping(source = "modifiedAt", target = "modifiedAt", qualifiedByName = "offsetDateTimeToLocalDateTime")
    @Mapping(source = "storyId", target = "story.id")
    @Mapping(source = "taskId", target = "task.id")
    CommentEntity modelToEntity(Comment commentModel);

    List<Comment> entitiesToModels(List<CommentEntity> commentEntities);

    List<CommentEntity> modelsToEntities(List<Comment> commentModels);

    @Named("localDateTimeToOffsetDateTime")
    default OffsetDateTime localDateTimeToOffsetDateTime(LocalDateTime localDateTime) {
        return localDateTime != null ? localDateTime.atOffset(ZoneOffset.UTC) : null;
    }

    @Named("offsetDateTimeToLocalDateTime")
    default LocalDateTime offsetDateTimeToLocalDateTime(OffsetDateTime offsetDateTime) {
        return offsetDateTime != null ? offsetDateTime.toLocalDateTime() : null;
    }
}
