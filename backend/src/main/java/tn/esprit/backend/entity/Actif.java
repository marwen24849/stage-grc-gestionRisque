package tn.esprit.backend.entity;


import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

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

    // Type d'actif (ex: RESEAU, EQUIPEMENT, APPLICATION, DOCUMENT, LOG, etc.)
    private String type;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "niveau_id", nullable = false)
    private NiveauClassification niveau;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "activite_id", nullable = false)
    private Activite activite;

    // Auto-référence : actif parent (pour les actifs secondaires)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private Actif parent;

    // Liste des actifs enfants
    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Actif> enfants = new ArrayList<>();
}