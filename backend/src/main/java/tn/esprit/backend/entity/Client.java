package tn.esprit.backend.entity;


import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "clients")
@Getter
@Setter
public class Client extends BaseEntity {

    @NotBlank
    @Column(nullable = false, length = 100)
    private String nom;

    @Email
    @Column(unique = true)
    private String email;

    private String adresse;
    private String telephone;

    @Lob
    @Column(name = "classification_image", columnDefinition = "LONGTEXT")
    private String classificationImageBase64;

    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Responsable> responsables = new ArrayList<>();

    @OneToOne(mappedBy = "client", fetch = FetchType.LAZY)
    private User clientUser;

    @ManyToMany(mappedBy = "assignedClients")
    private List<User> assignedConsultants = new ArrayList<>();
}
