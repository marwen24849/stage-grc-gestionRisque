package tn.esprit.backend.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.backend.entity.NiveauClassification;

import java.util.Optional;

public interface NiveauClassificationRepository extends JpaRepository<NiveauClassification, Long> {
    Optional<NiveauClassification> findByNiveau(Integer niveau);
}