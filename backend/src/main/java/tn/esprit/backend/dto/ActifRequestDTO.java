package tn.esprit.backend.dto;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ActifRequestDTO {

    private Long id; // Pour les mises à jour

    @NotBlank(message = "Le nom de l'actif est obligatoire")
    private String nom;

    private String description;

    private String type;

    @NotNull(message = "Le niveau de classification est obligatoire")
    private Long niveauId;

    @NotNull(message = "L'activité est obligatoire")
    private Long activiteId;

    private Long parentId; // null si c'est un actif racine
}