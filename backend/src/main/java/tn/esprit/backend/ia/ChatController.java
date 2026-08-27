package tn.esprit.backend.ia;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.access.prepost.PreAuthorize;
import tn.esprit.backend.security.AuthorizationService;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@Slf4j
public class ChatController {

    private final ChatClient chatClient;
    private final ToolDiscovery toolDiscovery;
    private final AuthorizationService authorizationService;

    @GetMapping("/ai/chat")
    @PreAuthorize("hasAnyRole('ADMIN', 'CONSULTANT', 'CLIENT')")
    public String chat(@RequestParam String message) {
        try {
            var user = authorizationService.currentUser();
            String clientScope = user.getClient() == null
                ? "clients affectés uniquement via les autorisations du compte"
                : "client associé ID " + user.getClient().getId();
            return this.chatClient.prompt()
                .system(SystemPrompts.SYSTEM_MESSAGE + "\nUtilisateur authentifié: rôle "
                    + user.getRole() + ". Périmètre de données: " + clientScope
                    + ". Ne divulgue aucune donnée hors de ce périmètre.")
                    .user(message)
                    .call()
                    .content();
        } catch (Exception ex) {
            log.error("Erreur lors du traitement de la demande IA : {}", message, ex);
            return "Je ne peux pas traiter votre demande pour le moment. Vérifiez la configuration OpenRouter et la disponibilité des services métier.";
        }
    }

    @GetMapping("/ai/tools")
    @PreAuthorize("hasAnyRole('ADMIN', 'CONSULTANT', 'CLIENT')")
    public List<Map<String, String>> listTools() {
        return toolDiscovery.getTools();
    }
}