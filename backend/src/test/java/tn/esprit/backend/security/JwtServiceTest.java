package tn.esprit.backend.security;

import org.junit.jupiter.api.Test;
import tn.esprit.backend.entity.Role;
import tn.esprit.backend.entity.User;

import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {

    @Test
    void tokenContainsIdentityRoleAndIsValid() {
        JwtService service = new JwtService("test-secret-that-is-at-least-32-characters-long", 86_400_000L);
        service.initializeKey();

        User user = new User();
        user.setId(7L);
        user.setEmail("user@example.com");
        user.setRole(Role.CONSULTANT);

        String token = service.generateToken(user);

        assertEquals("user@example.com", service.extractUsername(token));
        assertTrue(service.isTokenValid(token, "user@example.com"));
        assertFalse(service.isTokenValid(token, "other@example.com"));
    }

    @Test
    void invalidTokenIsRejected() {
        JwtService service = new JwtService("test-secret-that-is-at-least-32-characters-long", 86_400_000L);
        service.initializeKey();

        assertThrows(RuntimeException.class, () -> service.extractUsername("invalid.token.value"));
    }
}
