package tn.esprit.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tn.esprit.backend.dto.CreateUserRequest;
import tn.esprit.backend.dto.UserResponseDTO;
import tn.esprit.backend.entity.Client;
import tn.esprit.backend.entity.Role;
import tn.esprit.backend.entity.User;
import tn.esprit.backend.exception.ResourceNotFoundException;
import tn.esprit.backend.repository.ClientRepository;
import tn.esprit.backend.repository.UserRepository;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class UserManagementService {

    private final UserRepository userRepository;
    private final ClientRepository clientRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public UserResponseDTO create(CreateUserRequest request) {
        String email = request.email().trim().toLowerCase();
        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new IllegalArgumentException("Un utilisateur avec cet email existe déjà.");
        }
        validatePassword(request.password());

        User user = new User();
        user.setFirstName(request.firstName().trim());
        user.setLastName(request.lastName().trim());
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setRole(request.role());
        user.setEnabled(true);

        if (request.role() == Role.CLIENT) {
            if (request.clientId() == null) {
                throw new IllegalArgumentException("Un utilisateur CLIENT doit être associé à un client.");
            }
            Client client = clientRepository.findById(request.clientId())
                    .orElseThrow(() -> new ResourceNotFoundException("Client non trouvé"));
            if (client.getClientUser() != null) {
                throw new IllegalArgumentException("Ce client possède déjà un compte.");
            }
            user.setClient(client);
        } else if (request.role() == Role.CONSULTANT) {
            Set<Long> clientIds = request.assignedClientIds() == null ? Set.of() : request.assignedClientIds();
            user.getAssignedClients().addAll(clientRepository.findAllById(clientIds));
            if (user.getAssignedClients().size() != clientIds.size()) {
                throw new ResourceNotFoundException("Un client affecté est introuvable");
            }
        }

        return toResponse(userRepository.save(user));
    }

    @Transactional(readOnly = true)
    public List<UserResponseDTO> findAll() {
        return userRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Transactional
    public void setEnabled(Long id, boolean enabled) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé"));
        user.setEnabled(enabled);
    }

    @Transactional
    public void delete(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("Utilisateur non trouvé");
        }
        userRepository.deleteById(id);
    }

    private void validatePassword(String password) {
        if (password.length() < 8 || !password.matches(".*[A-Z].*")
                || !password.matches(".*[a-z].*") || !password.matches(".*\\d.*")
                || !password.matches(".*[^A-Za-z0-9].*")) {
            throw new IllegalArgumentException("Le mot de passe doit contenir 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.");
        }
    }

    private UserResponseDTO toResponse(User user) {
        return new UserResponseDTO(user.getId(), user.getFirstName(), user.getLastName(), user.getEmail(), user.getRole(), user.isEnabled());
    }
}
