package tn.esprit.backend.mapper;


import org.mapstruct.*;
import tn.esprit.backend.dto.ResponsableRequestDTO;
import tn.esprit.backend.dto.ResponsableResponseDTO;
import tn.esprit.backend.entity.Responsable;

import java.util.List;


@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ResponsableMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "client", ignore = true)
    @Mapping(target = "activites", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Responsable toEntity(ResponsableRequestDTO dto);


    @Mapping(source = "client.id", target = "clientId")
    @Mapping(source = "client.nom", target = "clientNom")
    ResponsableResponseDTO toResponse(Responsable entity);

    List<ResponsableResponseDTO> toResponseList(List<Responsable> entities);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "client", ignore = true)
    @Mapping(target = "activites", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntity(ResponsableRequestDTO dto, @MappingTarget Responsable entity);
}
