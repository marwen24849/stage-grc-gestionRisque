package tn.esprit.backend.service;


import tn.esprit.backend.dto.ActiviteRequestDTO;
import tn.esprit.backend.dto.ActiviteResponseDTO;

import java.util.List;

public interface ActiviteService {
    ActiviteResponseDTO create(ActiviteRequestDTO dto);
    ActiviteResponseDTO update(Long id, ActiviteRequestDTO dto);
    ActiviteResponseDTO findById(Long id);
    List<ActiviteResponseDTO> findAll();
    List<ActiviteResponseDTO> findByResponsable(Long responsableId);
    void delete(Long id);
}