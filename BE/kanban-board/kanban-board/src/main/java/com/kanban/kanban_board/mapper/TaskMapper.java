package com.kanban.kanban_board.mapper;

import com.kanban.kanban_board.entity.TaskEntity;
import com.kanban.kanban_board.model.Task;
import com.kanban.kanban_board.model.TaskSubscription;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;

@Mapper(componentModel = "spring")
public interface TaskMapper {

    @Mapping(source = "createdAt", target = "createdAt", qualifiedByName = "localDateTimeToOffsetDateTime")
    @Mapping(source = "modifiedAt", target = "modifiedAt", qualifiedByName = "localDateTimeToOffsetDateTime")
    @Mapping(source = "story.id", target = "storyId")
    Task entityToModel(TaskEntity taskEntity);

    @Mapping(source = "createdAt", target = "createdAt", qualifiedByName = "offsetDateTimeToLocalDateTime")
    @Mapping(source = "modifiedAt", target = "modifiedAt", qualifiedByName = "offsetDateTimeToLocalDateTime")
    @Mapping(source = "storyId", target = "story.id")
    TaskEntity modelToEntity(Task task);

    java.util.List<Task> entitiesToModels(List<TaskEntity> taskEntities);

    java.util.List<TaskEntity> modelsToEntities(List<Task> tasks);

    @Named("localDateTimeToOffsetDateTime")
    default OffsetDateTime localDateTimeToOffsetDateTime(LocalDateTime localDateTime) {
        return localDateTime != null ? localDateTime.atOffset(ZoneOffset.UTC) : null;
    }

    @Named("offsetDateTimeToLocalDateTime")
    default LocalDateTime offsetDateTimeToLocalDateTime(OffsetDateTime offsetDateTime) {
        return offsetDateTime != null ? offsetDateTime.toLocalDateTime() : null;
    }

    @Mapping(source = "createdAt", target = "createdAt", qualifiedByName = "localDateTimeToOffsetDateTime")
    @Mapping(source="task.id", target = "taskId")
    TaskSubscription subscriptionEntityToModel(com.kanban.kanban_board.entity.TaskSubscriptionEntity entity);

    @Mapping(source = "createdAt", target = "createdAt", qualifiedByName = "offsetDateTimeToLocalDateTime")
    @Mapping(source="taskId", target = "task.id")
    com.kanban.kanban_board.entity.TaskSubscriptionEntity subscriptionModelToEntity(TaskSubscription model);

    List<TaskSubscription> subscriptionEntitiesToModels(List<com.kanban.kanban_board.entity.TaskSubscriptionEntity> entities);

    List<com.kanban.kanban_board.entity.TaskSubscriptionEntity> subscriptionModelsToEntities(List<TaskSubscription> models);

}
