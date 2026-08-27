package tn.esprit.backend.security;

import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import tn.esprit.backend.entity.Client;
import tn.esprit.backend.entity.Role;
import tn.esprit.backend.entity.User;
import tn.esprit.backend.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class AuthorizationService {

    private final UserRepository userRepository;

    public User currentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()
                || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new AccessDeniedException("Authentication required");
        }
        return userRepository.findByEmailIgnoreCase(authentication.getName())
                .orElseThrow(() -> new AccessDeniedException("Authentication required"));
    }

    public boolean isAdmin() {
        return currentUser().getRole() == Role.ADMIN;
    }

    public boolean canAccessClient(Long clientId) {
        User user = currentUser();
        if (user.getRole() == Role.ADMIN) {
            return true;
        }
        if (user.getRole() == Role.CLIENT) {
            return user.getClient() != null && clientId.equals(user.getClient().getId());
        }
        return user.getRole() == Role.CONSULTANT
                && user.getAssignedClients().stream().map(Client::getId).anyMatch(clientId::equals);
    }

    public void assertClientAccess(Long clientId) {
        if (!canAccessClient(clientId)) {
            throw new AccessDeniedException("Access denied");
        }
    }

    public void assertAdmin() {
        if (!isAdmin()) {
            throw new AccessDeniedException("Access denied");
        }
    }
}
