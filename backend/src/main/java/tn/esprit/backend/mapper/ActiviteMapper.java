package tn.esprit.backend.mapper;

import org.mapstruct.*;
import tn.esprit.backend.dto.ActiviteRequestDTO;
import tn.esprit.backend.dto.ActiviteResponseDTO;
import tn.esprit.backend.entity.Activite;

import java.util.List;


@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ActiviteMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "responsable", ignore = true)  // Géré dans le service
    @Mapping(target = "actifs", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Activite toEntity(ActiviteRequestDTO dto);

    @Mapping(source = "responsable.id", target = "responsableId")
    @Mapping(source = "responsable.nom", target = "responsableNom")
    @Mapping(source = "responsable.client.id", target = "clientId")
    @Mapping(source = "responsable.client.classificationImageBase64", target = "clientImageBase64")
    ActiviteResponseDTO toResponse(Activite entity);

    List<ActiviteResponseDTO> toResponseList(List<Activite> entities);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "responsable", ignore = true)
    @Mapping(target = "actifs", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntity(ActiviteRequestDTO dto, @MappingTarget Activite entity);
}
