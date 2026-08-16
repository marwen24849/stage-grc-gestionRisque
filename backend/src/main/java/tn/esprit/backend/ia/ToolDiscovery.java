package tn.esprit.backend.ia;

import lombok.RequiredArgsConstructor;
import org.springframework.aop.support.AopUtils;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;

import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class ToolDiscovery {

    private final ApplicationContext applicationContext;

    public Object[] getToolObjects() {
        List<Object> tools = new ArrayList<>();
        for (Object bean : applicationContext.getBeansOfType(Object.class).values()) {
            Class<?> targetClass = AopUtils.getTargetClass(bean);
            for (Method method : targetClass.getMethods()) {
                if (method.getAnnotation(Tool.class) != null) {
                    tools.add(bean);
                    break;
                }
            }
        }
        return tools.toArray();
    }

    public List<Map<String, String>> getTools() {
        List<Map<String, String>> result = new ArrayList<>();

        for (Object bean : applicationContext.getBeansOfType(Object.class).values()) {
            Class<?> targetClass = AopUtils.getTargetClass(bean);
            for (Method method : targetClass.getMethods()) {
                Tool annotation = method.getAnnotation(Tool.class);
                if (annotation != null) {
                    result.add(Map.of(
                            "name", annotation.name().isBlank() ? method.getName() : annotation.name(),
                            "description", annotation.description()
                    ));
                }
            }
        }

        result.sort(Comparator.comparing(tool -> tool.get("name")));
        return result;
    }
}
