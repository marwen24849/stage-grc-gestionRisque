package tn.esprit.backend.entity;


import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "activites")
@Getter
@Setter
public class Activite extends BaseEntity {

    @NotBlank
    @Column(nullable = false, length = 150)
    private String nom;

    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "responsable_id", nullable = false)
    private Responsable responsable;

    @OneToMany(mappedBy = "activite", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Actif> actifs = new ArrayList<>();
}