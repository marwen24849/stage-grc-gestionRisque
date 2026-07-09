package tn.esprit.backend.dto;


import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ClientResponseDTO {
    private Long id;
    private String nom;
    private String email;
    private String adresse;
    private String telephone;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}