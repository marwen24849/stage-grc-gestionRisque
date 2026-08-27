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

    // Valeurs numériques saisies par le consultant (facultatif pour les mises à jour)
    private Integer disponibiliteLevel;
    private Integer integriteLevel;
    private Integer confidentialiteLevel;
    private Integer tracabiliteLevel;

    // Valeurs dérivées automatiquement à partir du niveau de risque maximal
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

    private Long parentId; // null si c'est un actif racine
}