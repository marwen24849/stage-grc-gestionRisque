package tn.esprit.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;
import tn.esprit.backend.dto.LoginRequest;
import tn.esprit.backend.dto.LoginResponse;
import tn.esprit.backend.dto.UserResponseDTO;
import tn.esprit.backend.entity.User;
import tn.esprit.backend.repository.UserRepository;
import tn.esprit.backend.security.JwtService;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    public LoginResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password()));

        User user = userRepository.findByEmailIgnoreCase(request.email())
                .orElseThrow(() -> new IllegalStateException("Authenticated user not found"));

        return new LoginResponse(jwtService.generateToken(user), toResponse(user));
    }

    private UserResponseDTO toResponse(User user) {
        return new UserResponseDTO(user.getId(), user.getFirstName(), user.getLastName(), user.getEmail(), user.getRole(), user.isEnabled());
    }
}
