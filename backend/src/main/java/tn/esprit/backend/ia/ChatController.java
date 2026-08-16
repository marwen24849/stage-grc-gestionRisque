package tn.esprit.backend.ia;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@Slf4j
@CrossOrigin
public class ChatController {

    private final ChatClient chatClient;
    private final ToolDiscovery toolDiscovery;

    @GetMapping("/ai/chat")
    public String chat(@RequestParam String message) {
        try {
            return this.chatClient.prompt()
                    .system(SystemPrompts.SYSTEM_MESSAGE)
                    .user(message)
                    .call()
                    .content();
        } catch (Exception ex) {
            log.error("Erreur lors du traitement de la demande IA : {}", message, ex);
            return "Je ne peux pas traiter votre demande pour le moment. Vérifiez la configuration OpenRouter et la disponibilité des services métier.";
        }
    }

    @GetMapping("/ai/tools")
    public List<Map<String, String>> listTools() {
        return toolDiscovery.getTools();
    }
}