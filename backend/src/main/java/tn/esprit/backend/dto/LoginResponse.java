package tn.esprit.backend.dto;

public record LoginResponse(
        String token,
        UserResponseDTO user
) {
}
