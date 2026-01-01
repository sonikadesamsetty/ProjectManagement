package com.kanban.kanban_board.mapper;

import com.kanban.kanban_board.entity.StoryEntity;
import com.kanban.kanban_board.model.Story;
import com.kanban.kanban_board.model.StorySubscription;
import com.kanban.kanban_board.model.TaskSubscription;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;

@Mapper(componentModel = "spring")
public interface StoryMapper {

    @Mapping(source = "createdAt", target = "createdAt", qualifiedByName = "localDateTimeToOffsetDateTime")
    @Mapping(source = "modifiedAt", target = "modifiedAt", qualifiedByName = "localDateTimeToOffsetDateTime")
    @Mapping(source = "sprint.id", target = "sprintId")
    @Mapping(source = "attachments", target = "attachments", ignore = true) // Ignoring attachments to prevent deep mapping
    Story entityToModel(StoryEntity storyEntity);

    @Mapping(source = "createdAt", target = "createdAt", qualifiedByName = "offsetDateTimeToLocalDateTime")
    @Mapping(source = "modifiedAt", target = "modifiedAt", qualifiedByName = "offsetDateTimeToLocalDateTime")
    @Mapping(source = "sprintId", target = "sprint.id")
    @Mapping(source = "attachments", target = "attachments", ignore = true) // Ignoring attachments to prevent deep mapping
    StoryEntity modelToEntity(Story story);

    @Named("localDateTimeToOffsetDateTime")
    default OffsetDateTime localDateTimeToOffsetDateTime(LocalDateTime localDateTime) {
        return localDateTime != null ? localDateTime.atOffset(ZoneOffset.UTC) : null;
    }

    @Named("offsetDateTimeToLocalDateTime")
    default LocalDateTime offsetDateTimeToLocalDateTime(OffsetDateTime offsetDateTime) {
        return offsetDateTime != null ? offsetDateTime.toLocalDateTime() : null;
    }

    List<Story> entitiesToModels(List<StoryEntity> storyEntities);

    List<StoryEntity> modelsToEntities(List<Story> stories);

    @Mapping(source = "createdAt", target = "createdAt", qualifiedByName = "localDateTimeToOffsetDateTime")
    @Mapping(source="story.id", target = "storyId")
    StorySubscription subscriptionEntityToModel(com.kanban.kanban_board.entity.StorySubscriptionEntity entity);

    @Mapping(source = "createdAt", target = "createdAt", qualifiedByName = "offsetDateTimeToLocalDateTime")
    @Mapping(source="storyId", target = "story.id")
    com.kanban.kanban_board.entity.StorySubscriptionEntity subscriptionModelToEntity(StorySubscription model);

    List<StorySubscription> subscriptionEntitiesToModels(List<com.kanban.kanban_board.entity.StorySubscriptionEntity> entities);

    List<com.kanban.kanban_board.entity.StorySubscriptionEntity> subscriptionModelsToEntities(List<StorySubscription> models);

}
