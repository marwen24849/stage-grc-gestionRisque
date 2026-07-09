package tn.esprit.backend.mapper;


import org.mapstruct.*;
import tn.esprit.backend.dto.ClientRequestDTO;
import tn.esprit.backend.dto.ClientResponseDTO;
import tn.esprit.backend.entity.Client;

import java.util.List;


@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ClientMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "responsables", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Client toEntity(ClientRequestDTO dto);

    ClientResponseDTO toResponse(Client entity);

    List<ClientResponseDTO> toResponseList(List<Client> entities);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "responsables", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntity(ClientRequestDTO dto, @MappingTarget Client entity);
}