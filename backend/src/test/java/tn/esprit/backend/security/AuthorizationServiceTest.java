package tn.esprit.backend.security;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import tn.esprit.backend.entity.Client;
import tn.esprit.backend.entity.Role;
import tn.esprit.backend.entity.User;
import tn.esprit.backend.repository.UserRepository;

import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthorizationServiceTest {

    @Mock
    private UserRepository userRepository;

    @AfterEach
    void clearSecurityContext() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void clientCanAccessOnlyItsOwnClient() {
        User user = user(Role.CLIENT);
        Client ownClient = client(10L);
        user.setClient(ownClient);
        givenAuthenticatedUser(user);

        AuthorizationService service = new AuthorizationService(userRepository);

        assertTrue(service.canAccessClient(10L));
        assertFalse(service.canAccessClient(11L));
        assertThrows(AccessDeniedException.class, () -> service.assertClientAccess(11L));
    }

    @Test
    void consultantCanAccessOnlyAssignedClients() {
        User user = user(Role.CONSULTANT);
        user.setAssignedClients(Set.of(client(10L)));
        givenAuthenticatedUser(user);

        AuthorizationService service = new AuthorizationService(userRepository);

        assertTrue(service.canAccessClient(10L));
        assertFalse(service.canAccessClient(11L));
    }

    private void givenAuthenticatedUser(User user) {
        when(userRepository.findByEmailIgnoreCase("user@example.com")).thenReturn(Optional.of(user));
        SecurityContextHolder.getContext().setAuthentication(
            new UsernamePasswordAuthenticationToken("user@example.com", null, Set.of()));
    }

    private User user(Role role) {
        User user = new User();
        user.setRole(role);
        user.setEmail("user@example.com");
        return user;
    }

    private Client client(Long id) {
        Client client = new Client();
        client.setId(id);
        return client;
    }
}
