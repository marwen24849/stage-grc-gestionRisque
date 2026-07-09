package tn.esprit.backend.dto;


import lombok.Data;

@Data
public class NiveauClassificationResponseDTO {
    private Long id;
    private Integer niveau;
    private String disponibilite;
    private String integrite;
    private String confidentialite;
    private String tracabilite;
}