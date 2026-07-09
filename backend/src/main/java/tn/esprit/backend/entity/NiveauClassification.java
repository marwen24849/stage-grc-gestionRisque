package tn.esprit.backend.entity;


import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "niveaux_classification")
@Getter
@Setter
public class NiveauClassification extends BaseEntity {

    @Min(1)
    @Max(4)
    @Column(nullable = false, unique = true)
    private Integer niveau;

    @NotBlank
    @Column(columnDefinition = "TEXT")
    private String disponibilite;

    @NotBlank
    @Column(columnDefinition = "TEXT")
    private String integrite;

    @NotBlank
    @Column(columnDefinition = "TEXT")
    private String confidentialite;

    @NotBlank
    @Column(columnDefinition = "TEXT")
    private String tracabilite;
}