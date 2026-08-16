package tn.esprit.backend.service;



import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tn.esprit.backend.dto.ActifRequestDTO;
import tn.esprit.backend.dto.ActifResponseDTO;
import tn.esprit.backend.entity.Actif;
import tn.esprit.backend.entity.Activite;
import tn.esprit.backend.entity.NiveauClassification;
import tn.esprit.backend.exception.ResourceNotFoundException;
import tn.esprit.backend.mapper.ActifMapper;
import tn.esprit.backend.repository.ActifRepository;
import tn.esprit.backend.repository.ActiviteRepository;
import tn.esprit.backend.repository.NiveauClassificationRepository;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class ActifServiceImpl implements ActifService {

    private final ActifRepository actifRepository;
    private final ActiviteRepository activiteRepository;
    private final NiveauClassificationRepository niveauRepository;
    private final ActifMapper actifMapper;

    @Override
    @Tool(name = "createActif", description = "Crée un actif associé à une activité et à un niveau de classification.")
    @Transactional
    public ActifResponseDTO create(ActifRequestDTO dto) {
        log.info("Création d'un actif pour l'activité ID : {}", dto.getActiviteId());

        // Vérifier l'activité
        Activite activite = activiteRepository.findById(dto.getActiviteId())
                .orElseThrow(() -> new ResourceNotFoundException("Activité non trouvée avec ID : " + dto.getActiviteId()));

        // Vérifier le niveau
        NiveauClassification niveau = niveauRepository.findById(dto.getNiveauId())
                .orElseThrow(() -> new ResourceNotFoundException("Niveau de classification non trouvé avec ID : " + dto.getNiveauId()));

        // Vérifier le parent (si existe)
        Actif parent = null;
        if (dto.getParentId() != null) {
            parent = actifRepository.findById(dto.getParentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Actif parent non trouvé avec ID : " + dto.getParentId()));
            // Vérifier que le parent appartient à la même activité (contrainte métier)
            if (!parent.getActivite().getId().equals(activite.getId())) {
                throw new IllegalArgumentException("L'actif parent doit appartenir à la même activité");
            }
        }

        // Mapping DTO -> Entity (sans les relations)
        Actif actif = actifMapper.toEntity(dto);
        // Injection des relations
        actif.setActivite(activite);
        actif.setNiveau(niveau);
        actif.setParent(parent);
        applyDerivedClassification(actif);

        // Persistance
        Actif saved = actifRepository.save(actif);
        log.info("Actif créé avec ID : {}", saved.getId());

        return actifMapper.toResponse(saved);
    }

    @Override
    @Tool(name = "updateActif", description = "Met à jour un actif existant.")
    @Transactional
    public ActifResponseDTO update(Long id, ActifRequestDTO dto) {
        log.info("Mise à jour de l'actif ID : {}", id);

        Actif existing = actifRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Actif non trouvé avec ID : " + id));

        // Mise à jour des champs simples
        actifMapper.updateEntity(dto, existing);

        // Mise à jour des relations si fournies
        if (dto.getNiveauId() != null) {
            NiveauClassification niveau = niveauRepository.findById(dto.getNiveauId())
                    .orElseThrow(() -> new ResourceNotFoundException("Niveau non trouvé"));
            existing.setNiveau(niveau);
        }

        if (dto.getActiviteId() != null) {
            Activite activite = activiteRepository.findById(dto.getActiviteId())
                    .orElseThrow(() -> new ResourceNotFoundException("Activité non trouvée"));
            existing.setActivite(activite);
        }

        if (dto.getParentId() != null) {
            Actif parent = actifRepository.findById(dto.getParentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent non trouvé"));
            existing.setParent(parent);
        } else if (dto.getParentId() == null && dto.getId() != null) {
            // Si on envoie null explicitement, on supprime le parent (actif devient racine)
            existing.setParent(null);
        }

        applyDerivedClassification(existing);

        Actif updated = actifRepository.save(existing);
        return actifMapper.toResponse(updated);
    }

    @Override
    @Tool(name = "getActifById", description = "Récupère un actif par son identifiant.")
    public ActifResponseDTO findById(Long id) {
        Actif actif = actifRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Actif non trouvé avec ID : " + id));
        return actifMapper.toResponse(actif);
    }

    @Override
    @Tool(name = "listActifsByActivite", description = "Liste les actifs liés à une activité donnée.")
    public List<ActifResponseDTO> findAllByActivite(Long activiteId) {
        // On vérifie que l'activité existe (bonus)
        if (!activiteRepository.existsById(activiteId)) {
            throw new ResourceNotFoundException("Activité non trouvée avec ID : " + activiteId);
        }
        List<Actif> actifs = actifRepository.findByActiviteId(activiteId);
        return actifMapper.toResponseList(actifs);
    }

    @Override
    @Tool(name = "listRootActifs", description = "Liste les actifs racines d'une activité.")
    public List<ActifResponseDTO> findRootsByActivite(Long activiteId) {
        if (!activiteRepository.existsById(activiteId)) {
            throw new ResourceNotFoundException("Activité non trouvée avec ID : " + activiteId);
        }
        List<Actif> roots = actifRepository.findByActiviteIdAndParentIsNull(activiteId);
        return actifMapper.toResponseList(roots);
    }

    @Override
    @Tool(name = "listChildrenActifs", description = "Liste les sous-actifs enfants d'un actif parent.")
    public List<ActifResponseDTO> findChildren(Long parentId) {
        if (!actifRepository.existsById(parentId)) {
            throw new ResourceNotFoundException("Parent non trouvé avec ID : " + parentId);
        }
        List<Actif> children = actifRepository.findByParentId(parentId);
        return actifMapper.toResponseList(children);
    }

    @Override
    @Tool(name = "deleteActif", description = "Supprime un actif de la plateforme GRC.")
    @Transactional
    public void delete(Long id) {
        if (!actifRepository.existsById(id)) {
            throw new ResourceNotFoundException("Actif non trouvé avec ID : " + id);
        }
        log.warn("Suppression de l'actif ID : {}", id);
        actifRepository.deleteById(id);
    }

    private void applyDerivedClassification(Actif actif) {
        Integer maxLevel = Arrays.stream(new Integer[]{
                actif.getDisponibiliteLevel(),
                actif.getIntegriteLevel(),
                actif.getConfidentialiteLevel(),
                actif.getTracabiliteLevel()
        }).filter(value -> value != null).max(Integer::compareTo).orElse(null);

        if (maxLevel == null && actif.getNiveau() != null && actif.getNiveau().getNiveau() != null) {
            maxLevel = actif.getNiveau().getNiveau();
        }

        if (maxLevel == null) {
            maxLevel = 1;
        }

        actif.setNiveauMax(maxLevel);
        actif.setValeur(BigDecimal.valueOf(maxLevel * 1000L));

        if (actif.getActifSecondaire() == null || actif.getActifSecondaire().isBlank()) {
            actif.setActifSecondaire(actif.getType() != null ? actif.getType() : "Autre");
        }
    }
}