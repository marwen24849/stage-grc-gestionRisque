package tn.esprit.backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.backend.dto.ResponsableRequestDTO;
import tn.esprit.backend.dto.ResponsableResponseDTO;
import tn.esprit.backend.service.ResponsableService;

import java.util.List;

@RestController
@RequestMapping("/api/responsables")
@RequiredArgsConstructor
@CrossOrigin
public class ResponsableController {

    private final ResponsableService responsableService;

    @PostMapping
    public ResponseEntity<ResponsableResponseDTO> create(@Valid @RequestBody ResponsableRequestDTO   dto) {
        return new ResponseEntity<>(responsableService.create(dto), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResponsableResponseDTO> update(@PathVariable Long id, @Valid @RequestBody ResponsableRequestDTO dto) {
        dto.setId(id);
        return ResponseEntity.ok(responsableService.update(id, dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResponsableResponseDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(responsableService.findById(id));
    }

    @GetMapping
    public ResponseEntity<List<ResponsableResponseDTO>> findAll() {
        return ResponseEntity.ok(responsableService.findAll());
    }

    @GetMapping("/client/{clientId}")
    public ResponseEntity<List<ResponsableResponseDTO>> findByClient(@PathVariable Long clientId) {
        return ResponseEntity.ok(responsableService.findByClient(clientId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        responsableService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
