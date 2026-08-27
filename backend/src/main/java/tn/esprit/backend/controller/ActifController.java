package tn.esprit.backend.controller;


import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import tn.esprit.backend.dto.ActifRequestDTO;
import tn.esprit.backend.dto.ActifResponseDTO;
import tn.esprit.backend.service.ActifService;

import java.util.List;

@RestController
@RequestMapping("/api/actifs")
@RequiredArgsConstructor
public class ActifController {

    private final ActifService actifService;

    // Créer un actif
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'CONSULTANT', 'CLIENT')")
    public ResponseEntity<ActifResponseDTO> create(@Valid @RequestBody ActifRequestDTO dto) {
        ActifResponseDTO response = actifService.create(dto);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // Mettre à jour un actif
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CONSULTANT', 'CLIENT')")
    public ResponseEntity<ActifResponseDTO> update(@PathVariable Long id, @Valid @RequestBody ActifRequestDTO dto) {
        // On s'assure que l'ID dans le path correspond à celui du DTO si présent
        dto.setId(id);
        ActifResponseDTO response = actifService.update(id, dto);
        return ResponseEntity.ok(response);
    }

    // Récupérer un actif par ID
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CONSULTANT', 'CLIENT')")
    public ResponseEntity<ActifResponseDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(actifService.findById(id));
    }

    // Lister tous les actifs d'une activité
    @GetMapping("/activite/{activiteId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CONSULTANT', 'CLIENT')")
    public ResponseEntity<List<ActifResponseDTO>> findAllByActivite(@PathVariable Long activiteId) {
        return ResponseEntity.ok(actifService.findAllByActivite(activiteId));
    }

    // Lister les actifs racines d'une activité
    @GetMapping("/activite/{activiteId}/racines")
    @PreAuthorize("hasAnyRole('ADMIN', 'CONSULTANT', 'CLIENT')")
    public ResponseEntity<List<ActifResponseDTO>> findRoots(@PathVariable Long activiteId) {
        return ResponseEntity.ok(actifService.findRootsByActivite(activiteId));
    }

    // Lister les enfants d'un actif parent
    @GetMapping("/{parentId}/enfants")
    @PreAuthorize("hasAnyRole('ADMIN', 'CONSULTANT', 'CLIENT')")
    public ResponseEntity<List<ActifResponseDTO>> findChildren(@PathVariable Long parentId) {
        return ResponseEntity.ok(actifService.findChildren(parentId));
    }

    // Supprimer un actif
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CONSULTANT', 'CLIENT')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        actifService.delete(id);
        return ResponseEntity.noContent().build();
    }
}