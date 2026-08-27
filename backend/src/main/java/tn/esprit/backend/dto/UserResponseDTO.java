package tn.esprit.backend.dto;

import tn.esprit.backend.entity.Role;

public record UserResponseDTO(
        Long id,
        String firstName,
        String lastName,
        String email,
        Role role,
        boolean enabled
) {
}
