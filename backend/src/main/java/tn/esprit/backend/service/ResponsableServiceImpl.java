package tn.esprit.backend.service;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tn.esprit.backend.dto.ResponsableRequestDTO;
import tn.esprit.backend.dto.ResponsableResponseDTO;
import tn.esprit.backend.entity.Client;
import tn.esprit.backend.entity.Responsable;
import tn.esprit.backend.exception.ResourceNotFoundException;
import tn.esprit.backend.mapper.ResponsableMapper;
import tn.esprit.backend.repository.ClientRepository;
import tn.esprit.backend.repository.ResponsableRepository;
import tn.esprit.backend.security.AuthorizationService;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class ResponsableServiceImpl implements ResponsableService {

    private final ResponsableRepository responsableRepository;
    private final ClientRepository clientRepository;
    private final ResponsableMapper responsableMapper;
    private final AuthorizationService authorizationService;

    @Override
    @Tool(name = "createResponsable", description = "Crée un responsable pour un client donné.")
    @Transactional
    public ResponsableResponseDTO create(ResponsableRequestDTO dto) {
        log.info("Création d'un responsable pour le client ID : {}", dto.getClientId());

        Client client = clientRepository.findById(dto.getClientId())
                .orElseThrow(() -> new ResourceNotFoundException("Client non trouvé avec ID : " + dto.getClientId()));
        authorizationService.assertClientAccess(client.getId());

        if (dto.getEmail() != null && responsableRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("Un responsable avec cet email existe déjà.");
        }

        Responsable responsable = responsableMapper.toEntity(dto);
        responsable.setClient(client);
        Responsable saved = responsableRepository.save(responsable);
        return responsableMapper.toResponse(saved);
    }

    @Override
    @Tool(name = "updateResponsable", description = "Met à jour les informations d'un responsable existant.")
    @Transactional
    public ResponsableResponseDTO update(Long id, ResponsableRequestDTO dto) {
        log.info("Mise à jour du responsable ID : {}", id);
        Responsable existing = responsableRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Responsable non trouvé avec ID : " + id));
        authorizationService.assertClientAccess(existing.getClient().getId());

        // Vérification email
        if (dto.getEmail() != null && !dto.getEmail().equals(existing.getEmail()) &&
                responsableRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("Cet email est déjà utilisé par un autre responsable.");
        }

        // Mise à jour du client si l'ID change
        if (dto.getClientId() != null && !dto.getClientId().equals(existing.getClient().getId())) {
            Client client = clientRepository.findById(dto.getClientId())
                    .orElseThrow(() -> new ResourceNotFoundException("Client non trouvé avec ID : " + dto.getClientId()));
                authorizationService.assertClientAccess(client.getId());
            existing.setClient(client);
        }

        responsableMapper.updateEntity(dto, existing);
        Responsable updated = responsableRepository.save(existing);
        return responsableMapper.toResponse(updated);
    }

    @Override
    @Tool(name = "getResponsableById", description = "Récupère un responsable par son identifiant.")
    public ResponsableResponseDTO findById(Long id) {
        Responsable responsable = responsableRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Responsable non trouvé avec ID : " + id));
        authorizationService.assertClientAccess(responsable.getClient().getId());
        return responsableMapper.toResponse(responsable);
    }

    @Override
    @Tool(name = "listResponsables", description = "Liste tous les responsables enregistrés dans la plateforme GRC.")
    public List<ResponsableResponseDTO> findAll() {
        return responsableMapper.toResponseList(responsableRepository.findAll().stream()
            .filter(responsable -> authorizationService.canAccessClient(responsable.getClient().getId()))
            .toList());
    }

    @Override
    @Tool(name = "listResponsablesByClient", description = "Liste les responsables associés à un client donné.")
    public List<ResponsableResponseDTO> findByClient(Long clientId) {
        authorizationService.assertClientAccess(clientId);
        if (!clientRepository.existsById(clientId)) {
            throw new ResourceNotFoundException("Client non trouvé avec ID : " + clientId);
        }
        return responsableMapper.toResponseList(responsableRepository.findByClientId(clientId));
    }

    @Override
    @Tool(name = "deleteResponsable", description = "Supprime un responsable de la plateforme GRC.")
    @Transactional
    public void delete(Long id) {
        Responsable responsable = responsableRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Responsable non trouvé avec ID : " + id));
        authorizationService.assertClientAccess(responsable.getClient().getId());
        if (!responsableRepository.existsById(id)) {
            throw new ResourceNotFoundException("Responsable non trouvé avec ID : " + id);
        }
        log.warn("Suppression du responsable ID : {}", id);
        responsableRepository.deleteById(id);
    }
}
