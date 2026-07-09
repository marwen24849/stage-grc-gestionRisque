package tn.esprit.backend.dto;


import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class ActifResponseDTO {
    private Long id;
    private String nom;
    private String description;
    private String type;
    private NiveauClassificationResponseDTO niveau;
    private ActiviteResponseDTO activite;
    private Long parentId;
    private List<ActifResponseDTO> enfants; // Pour l'arborescence
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}