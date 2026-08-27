package tn.esprit.backend.config;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import tn.esprit.backend.entity.Role;
import tn.esprit.backend.entity.NiveauClassification;
import tn.esprit.backend.entity.User;
import tn.esprit.backend.repository.NiveauClassificationRepository;
import tn.esprit.backend.repository.UserRepository;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final NiveauClassificationRepository niveauRepository;
        private final UserRepository userRepository;
        private final PasswordEncoder passwordEncoder;

        @Value("${app.admin.email:}")
        private String adminEmail;

        @Value("${app.admin.password:}")
        private String adminPassword;

    @Override
    public void run(String... args) {
        if (niveauRepository.count() == 0) {
            log.info("Initialisation des niveaux de classification...");

            List<NiveauClassification> niveaux = List.of(
                    createNiveau(1,
                            "Long terme - Indisponibilité d'une semaine acceptée",
                            "Faible - Perte d'intégrité acceptée. Cette altération est insignifiante",
                            "Sans Restriction (Libre) - L'information peut être diffusée librement et sans préjudice à l'extérieur",
                            "Faible - Pas de besoin de traçabilité (Qui, quand, où?)"
                    ),
                    createNiveau(2,
                            "Moyen terme - Indisponibilité maximum de 3 jours acceptée",
                            "Moyenne - Toute perte d'intégrité doit être détectée. Altération signifiante",
                            "Restreint - Diffusion autorisée en interne Sofrecam aux personnes qui ont besoin de connaître",
                            "Moyenne - Qui a interagi ? Avec quel système ? quand ? et Où ? Sans les détails"
                    ),
                    createNiveau(3,
                            "Court terme - Indisponibilité inférieure à 1 journée acceptée",
                            "Importante - Toute perte doit être détectée et corrigée automatiquement. Impact important.",
                            "Confidentiel - Diffusion restreinte à un nombre limité de personnes désignées nominativement",
                            "Forte - Qui a interagi ? Avec quel système ? quand ? et Où ? Traces opposables en temps différé"
                    ),
                    createNiveau(4,
                            "Très court terme - Indisponibilité inférieure à 2 heures acceptée",
                            "Totale - Aucune perte d'intégrité tolérée. Impact grave.",
                            "Souverain - Réservée à un nombre restreint de personnes nommément désignées",
                            "Maximale - Toutes les opérations détaillées, exploitable en temps réel, traces opposables"
                    )
            );

            niveauRepository.saveAll(niveaux);
            log.info("4 niveaux de classification initialisés avec succès.");
        } else {
            log.info("Les niveaux de classification existent déjà.");
        }

                initializeAdmin();
    }

        private void initializeAdmin() {
                if (adminEmail == null || adminEmail.isBlank() || adminPassword == null || adminPassword.isBlank()) {
                        log.warn("ADMIN_EMAIL et ADMIN_PASSWORD ne sont pas définis; aucun compte admin initial ne sera créé.");
                        return;
                }
                if (userRepository.existsByEmailIgnoreCase(adminEmail)) {
                        return;
                }
                if (!isStrongEnough(adminPassword)) {
                        throw new IllegalStateException("ADMIN_PASSWORD must contain at least 8 characters, upper/lower case, a digit and a special character");
                }

                User admin = new User();
                admin.setFirstName("GRC");
                admin.setLastName("Administrator");
                admin.setEmail(adminEmail.trim().toLowerCase());
                admin.setPasswordHash(passwordEncoder.encode(adminPassword));
                admin.setRole(Role.ADMIN);
                admin.setEnabled(true);
                userRepository.save(admin);
                log.info("Compte admin initial créé pour {}", admin.getEmail());
        }

        private boolean isStrongEnough(String password) {
                return password.length() >= 8
                                && password.matches(".*[A-Z].*")
                                && password.matches(".*[a-z].*")
                                && password.matches(".*\\d.*")
                                && password.matches(".*[^A-Za-z0-9].*");
        }

    private NiveauClassification createNiveau(Integer niveau, String disponibilite, String integrite,
                                              String confidentialite, String tracabilite) {
        NiveauClassification nc = new NiveauClassification();
        nc.setNiveau(niveau);
        nc.setDisponibilite(disponibilite);
        nc.setIntegrite(integrite);
        nc.setConfidentialite(confidentialite);
        nc.setTracabilite(tracabilite);
        return nc;
    }
}
