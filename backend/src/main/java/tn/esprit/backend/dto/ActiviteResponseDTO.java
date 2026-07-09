package tn.esprit.backend.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ActiviteResponseDTO {
    private Long id;
    private String nom;
    private String description;
    private Long responsableId;
    private String responsableNom;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
