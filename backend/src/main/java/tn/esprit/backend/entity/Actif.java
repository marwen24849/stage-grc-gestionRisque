package tn.esprit.backend.entity;


import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "actifs")
@Getter
@Setter
public class Actif extends BaseEntity {

    @NotBlank
    @Column(nullable = false, length = 150)
    private String nom;

    private String description;


    private String type;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "niveau_id", nullable = false)
    private NiveauClassification niveau;

    @Column(name = "disponibilite_level")
    private Integer disponibiliteLevel;

    @Column(name = "integrite_level")
    private Integer integriteLevel;

    @Column(name = "confidentialite_level")
    private Integer confidentialiteLevel;

    @Column(name = "tracabilite_level")
    private Integer tracabiliteLevel;

    @Column(name = "niveau_max")
    private Integer niveauMax;

    @Column(name = "valeur", precision = 19, scale = 2)
    private BigDecimal valeur;

    @Column(name = "actif_secondaire", length = 150)
    private String actifSecondaire;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "activite_id", nullable = false)
    private Activite activite;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private Actif parent;

    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Actif> enfants = new ArrayList<>();
}