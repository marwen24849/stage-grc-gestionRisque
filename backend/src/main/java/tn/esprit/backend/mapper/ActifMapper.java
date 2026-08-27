package tn.esprit.backend.mapper;


import org.mapstruct.*;
import tn.esprit.backend.dto.ActifRequestDTO;
import tn.esprit.backend.dto.ActifResponseDTO;
import tn.esprit.backend.entity.Actif;

import java.util.List;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ActifMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "niveau", ignore = true)
    @Mapping(target = "activite", ignore = true)
    @Mapping(target = "parent", ignore = true)
    @Mapping(target = "enfants", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Actif toEntity(ActifRequestDTO dto);

    @Mapping(source = "activite.responsable.client.id", target = "activite.clientId")
    @Mapping(source = "activite.responsable.client.classificationImageBase64", target = "activite.clientImageBase64")
    ActifResponseDTO toResponse(Actif entity);

    List<ActifResponseDTO> toResponseList(List<Actif> entities);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "niveau", ignore = true)
    @Mapping(target = "activite", ignore = true)
    @Mapping(target = "parent", ignore = true)
    @Mapping(target = "enfants", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntity(ActifRequestDTO dto, @MappingTarget Actif entity);
}