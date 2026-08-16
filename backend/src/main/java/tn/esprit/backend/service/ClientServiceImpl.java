package tn.esprit.backend.service;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tn.esprit.backend.dto.ClientRequestDTO;
import tn.esprit.backend.dto.ClientResponseDTO;
import tn.esprit.backend.entity.Client;
import tn.esprit.backend.exception.ResourceNotFoundException;
import tn.esprit.backend.mapper.ClientMapper;
import tn.esprit.backend.repository.ClientRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class ClientServiceImpl implements ClientService {

    private final ClientRepository clientRepository;
    private final ClientMapper clientMapper;

    @Override
    @Tool(name = "createClient", description = "Crée un client dans la plateforme GRC.")
    @Transactional
    public ClientResponseDTO create(ClientRequestDTO dto) {
        log.info("Création d'un nouveau client : {}", dto.getNom());

        if (dto.getEmail() != null && clientRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("Un client avec cet email existe déjà.");
        }

        Client client = clientMapper.toEntity(dto);
        Client saved = clientRepository.save(client);
        return clientMapper.toResponse(saved);
    }

    @Override
    @Tool(name = "updateClient", description = "Met à jour les informations d'un client existant.")
    @Transactional
    public ClientResponseDTO update(Long id, ClientRequestDTO dto) {
        log.info("Mise à jour du client ID : {}", id);
        Client existing = clientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Client non trouvé avec ID : " + id));

        // Vérifier l'email si modifié
        if (dto.getEmail() != null && !dto.getEmail().equals(existing.getEmail()) &&
                clientRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("Cet email est déjà utilisé par un autre client.");
        }

        clientMapper.updateEntity(dto, existing);
        Client updated = clientRepository.save(existing);
        return clientMapper.toResponse(updated);
    }

    @Override
    @Tool(name = "getClientById", description = "Récupère un client par son identifiant.")
    public ClientResponseDTO findById(Long id) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Client non trouvé avec ID : " + id));
        return clientMapper.toResponse(client);
    }

    @Override
    @Tool(name = "listClients", description = "Liste tous les clients enregistrés dans la plateforme GRC.")
    public List<ClientResponseDTO> findAll() {
        return clientMapper.toResponseList(clientRepository.findAll());
    }

    @Override
    @Tool(name = "deleteClient", description = "Supprime un client de la plateforme GRC.")
    @Transactional
    public void delete(Long id) {
        if (!clientRepository.existsById(id)) {
            throw new ResourceNotFoundException("Client non trouvé avec ID : " + id);
        }
        log.warn("Suppression du client ID : {}", id);
        clientRepository.deleteById(id);
    }
}