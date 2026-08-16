package tn.esprit.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tn.esprit.backend.dto.ActiviteRequestDTO;
import tn.esprit.backend.dto.ActiviteResponseDTO;
import tn.esprit.backend.entity.Activite;
import tn.esprit.backend.entity.Responsable;
import tn.esprit.backend.exception.ResourceNotFoundException;
import tn.esprit.backend.mapper.ActiviteMapper;
import tn.esprit.backend.repository.ActiviteRepository;
import tn.esprit.backend.repository.ResponsableRepository;

import java.util.List;


@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class ActiviteServiceImpl implements ActiviteService {

    private final ActiviteRepository activiteRepository;
    private final ResponsableRepository responsableRepository;
    private final ActiviteMapper activiteMapper;

    @Override
    @Tool(name = "createActivite", description = "Crée une activité pour un responsable GRC.")
    @Transactional
    public ActiviteResponseDTO create(ActiviteRequestDTO dto) {
        log.info("Création d'une activité pour le responsable ID : {}", dto.getResponsableId());

        Responsable responsable = responsableRepository.findById(dto.getResponsableId())
                .orElseThrow(() -> new ResourceNotFoundException("Responsable non trouvé avec ID : " + dto.getResponsableId()));

        // Empêcher un doublon de nom pour le même responsable
        if (activiteRepository.existsByNomIgnoreCaseAndResponsableId(dto.getNom(), responsable.getId())) {
            throw new IllegalArgumentException("Une activité avec ce nom existe déjà pour ce responsable.");
        }

        Activite activite = activiteMapper.toEntity(dto);
        activite.setResponsable(responsable);
        Activite saved = activiteRepository.save(activite);
        return activiteMapper.toResponse(saved);
    }

    @Override
    @Tool(name = "updateActivite", description = "Met à jour les informations d'une activité existante.")
    @Transactional
    public ActiviteResponseDTO update(Long id, ActiviteRequestDTO dto) {
        log.info("Mise à jour de l'activité ID : {}", id);
        Activite existing = activiteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Activité non trouvée avec ID : " + id));

        // Vérification de doublon de nom si le nom change ou si le responsable change
        if (dto.getNom() != null && !dto.getNom().equalsIgnoreCase(existing.getNom())) {
            Long responsableId = dto.getResponsableId() != null ? dto.getResponsableId() : existing.getResponsable().getId();
            if (activiteRepository.existsByNomIgnoreCaseAndResponsableId(dto.getNom(), responsableId)) {
                throw new IllegalArgumentException("Une activité avec ce nom existe déjà pour ce responsable.");
            }
        }

        // Mise à jour du responsable si fourni
        if (dto.getResponsableId() != null && !dto.getResponsableId().equals(existing.getResponsable().getId())) {
            Responsable responsable = responsableRepository.findById(dto.getResponsableId())
                    .orElseThrow(() -> new ResourceNotFoundException("Responsable non trouvé avec ID : " + dto.getResponsableId()));
            existing.setResponsable(responsable);
        }

        activiteMapper.updateEntity(dto, existing);
        Activite updated = activiteRepository.save(existing);
        return activiteMapper.toResponse(updated);
    }

    @Override
    @Tool(name = "getActiviteById", description = "Récupère une activité par son identifiant.")
    public ActiviteResponseDTO findById(Long id) {
        Activite activite = activiteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Activité non trouvée avec ID : " + id));
        return activiteMapper.toResponse(activite);
    }

    @Override
    @Tool(name = "listActivites", description = "Liste toutes les activités de la plateforme GRC.")
    public List <ActiviteResponseDTO> findAll() {
        return activiteMapper.toResponseList(activiteRepository.findAll());
    }

    @Override
    @Tool(name = "listActivitesByResponsable", description = "Liste les activités associées à un responsable donné.")
    public List<ActiviteResponseDTO> findByResponsable(Long responsableId) {
        if (!responsableRepository.existsById(responsableId)) {
            throw new ResourceNotFoundException("Responsable non trouvé avec ID : " + responsableId);
        }
        return activiteMapper.toResponseList(activiteRepository.findByResponsableId(responsableId));
    }

    @Override
    @Tool(name = "deleteActivite", description = "Supprime une activité existante.")
    @Transactional
    public void delete(Long id) {
        if (!activiteRepository.existsById(id)) {
            throw new ResourceNotFoundException("Activité non trouvée avec ID : " + id);
        }
        log.warn("Suppression de l'activité ID : {}", id);
        activiteRepository.deleteById(id);
    }
}