package tn.esprit.backend.dto;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ResponsableRequestDTO {
    private Long id;

    @NotBlank(message = "Le nom du responsable est obligatoire")
    private String nom;

    @NotBlank(message = "Le telephone du responsable est obligatoire")
    private String telephone;

    @Email(message = "Email invalide")
    private String email;

    @NotNull(message = "L'ID du client est obligatoire")
    private Long clientId;
}
