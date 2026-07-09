package tn.esprit.backend.dto;


import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ResponsableResponseDTO {
    private Long id;
    private String nom;
    private String email;
    private String telephone;
    private Long clientId;
    private String clientNom;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
