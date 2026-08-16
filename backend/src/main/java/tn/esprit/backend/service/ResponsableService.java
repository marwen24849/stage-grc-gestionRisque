package tn.esprit.backend.service;

import tn.esprit.backend.dto.ResponsableRequestDTO;
import tn.esprit.backend.dto.ResponsableResponseDTO;

import java.util.List;

public interface ResponsableService {
    ResponsableResponseDTO create(ResponsableRequestDTO dto);

    ResponsableResponseDTO update(Long id, ResponsableRequestDTO dto);

    ResponsableResponseDTO findById(Long id);

    List<ResponsableResponseDTO> findAll();

    List<ResponsableResponseDTO> findByClient(Long clientId);

    void delete(Long id);
}