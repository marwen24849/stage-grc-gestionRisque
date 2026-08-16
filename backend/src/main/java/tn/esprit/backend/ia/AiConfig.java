package tn.esprit.backend.ia;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AiConfig {

    @Bean
    public ChatClient chatClient(ChatClient.Builder builder, ToolDiscovery toolDiscovery) {
        Object[] tools = toolDiscovery.getToolObjects();
        if (tools == null || tools.length == 0) {
            return builder.build();
        }
        return builder.defaultTools(tools).build();
    }
}
