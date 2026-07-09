package tn.esprit.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.backend.entity.Activite;

import java.util.List;

public interface ActiviteRepository extends JpaRepository<Activite, Long> {
    List<Activite> findByResponsableId(Long responsableId);
    boolean existsByNomIgnoreCaseAndResponsableId(String nom, Long responsableId);
}
