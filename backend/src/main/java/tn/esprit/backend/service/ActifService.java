package tn.esprit.backend.service;


import tn.esprit.backend.dto.ActifRequestDTO;
import tn.esprit.backend.dto.ActifResponseDTO;

import java.util.List;

public interface ActifService {
    ActifResponseDTO create(ActifRequestDTO dto);
    ActifResponseDTO update(Long id, ActifRequestDTO dto);
    ActifResponseDTO findById(Long id);
    List<ActifResponseDTO> findAllByActivite(Long activiteId);
    List<ActifResponseDTO> findRootsByActivite(Long activiteId);
    List<ActifResponseDTO> findChildren(Long parentId);
    void delete(Long id);
}