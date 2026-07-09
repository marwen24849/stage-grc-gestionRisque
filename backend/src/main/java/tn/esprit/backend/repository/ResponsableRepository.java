package tn.esprit.backend.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.backend.entity.Responsable;

import java.util.List;
import java.util.Optional;

public interface ResponsableRepository extends JpaRepository<Responsable, Long> {
    List<Responsable> findByClientId(Long clientId);
    Optional<Responsable> findByEmail(String email);
    boolean existsByEmail(String email);
}