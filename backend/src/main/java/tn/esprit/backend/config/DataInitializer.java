package tn.esprit.backend.config;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import tn.esprit.backend.entity.NiveauClassification;
import tn.esprit.backend.repository.NiveauClassificationRepository;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final NiveauClassificationRepository niveauRepository;

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
