package tn.esprit.backend.dto;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ClientRequestDTO {
    private Long id;

    @NotBlank(message = "Le nom du client est obligatoire")
    private String nom;

    @Email(message = "Email invalide")
    private String email;

    private String adresse;
    private String telephone;
}