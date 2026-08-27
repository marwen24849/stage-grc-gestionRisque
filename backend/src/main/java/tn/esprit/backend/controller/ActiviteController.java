package tn.esprit.backend.controller;


import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import tn.esprit.backend.dto.ActiviteRequestDTO;
import tn.esprit.backend.dto.ActiviteResponseDTO;
import tn.esprit.backend.service.ActiviteService;

import java.util.List;


@RestController
@RequestMapping("/api/activites")
@RequiredArgsConstructor
public class ActiviteController {

    private final ActiviteService activiteService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'CONSULTANT', 'CLIENT')")
    public ResponseEntity<ActiviteResponseDTO> create(@Valid @RequestBody ActiviteRequestDTO dto) {
        return new ResponseEntity<>(activiteService.create(dto), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CONSULTANT', 'CLIENT')")
    public ResponseEntity<ActiviteResponseDTO> update(@PathVariable Long id, @Valid @RequestBody ActiviteRequestDTO dto) {
        dto.setId(id);
        return ResponseEntity.ok(activiteService.update(id, dto));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CONSULTANT', 'CLIENT')")
    public ResponseEntity<ActiviteResponseDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(activiteService.findById(id));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'CONSULTANT', 'CLIENT')")
    public ResponseEntity<List<ActiviteResponseDTO>> findAll() {
        return ResponseEntity.ok(activiteService.findAll());
    }

    @GetMapping("/responsable/{responsableId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CONSULTANT', 'CLIENT')")
    public ResponseEntity<List<ActiviteResponseDTO>> findByResponsable(@PathVariable Long responsableId) {
        return ResponseEntity.ok(activiteService.findByResponsable(responsableId));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CONSULTANT', 'CLIENT')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        activiteService.delete(id);
        return ResponseEntity.noContent().build();
    }
}