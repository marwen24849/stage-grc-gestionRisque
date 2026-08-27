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
    // Valeurs numériques saisies par le consultant
    private Integer disponibiliteLevel;
    private Integer integriteLevel;
    private Integer confidentialiteLevel;
    private Integer tracabiliteLevel;

    // Valeurs dérivées automatiquement
    private Integer niveauMax;
    private java.math.BigDecimal valeur;
    private String actifSecondaire;
    private String documentsSousFormatPapier;
    private String actifsDeTypeSupportsElectronique;
    private String actifsDeTypeMateriel;
    private String actifsDeTypeLogiciel;
    private String actifsDeTypePersonnes;
    private String actifsDeTypeServices;
    private String actifsDeTypeLocaux;
}