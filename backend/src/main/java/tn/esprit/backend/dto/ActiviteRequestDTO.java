package tn.esprit.backend.dto;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ActiviteRequestDTO {
    private Long id;

    @NotBlank(message = "Le nom de l'activité est obligatoire")
    private String nom;

    private String description;

    @NotNull(message = "L'ID du responsable est obligatoire")
    private Long responsableId;
}