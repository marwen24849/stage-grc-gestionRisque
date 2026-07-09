package tn.esprit.backend.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.backend.entity.Actif;

import java.util.List;

public interface ActifRepository extends JpaRepository<Actif, Long> {

    List<Actif> findByActiviteId(Long activiteId);

    List<Actif> findByActiviteIdAndParentIsNull(Long activiteId);

    List<Actif> findByParentId(Long parentId);

    boolean existsByActiviteIdAndNomIgnoreCase(Long activiteId, String nom);
}