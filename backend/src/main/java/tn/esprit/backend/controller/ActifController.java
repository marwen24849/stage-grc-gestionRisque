package tn.esprit.backend.controller;


import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<ActifResponseDTO> create(@Valid @RequestBody ActifRequestDTO dto) {
        ActifResponseDTO response = actifService.create(dto);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // Mettre à jour un actif
    @PutMapping("/{id}")
    public ResponseEntity<ActifResponseDTO> update(@PathVariable Long id, @Valid @RequestBody ActifRequestDTO dto) {
        // On s'assure que l'ID dans le path correspond à celui du DTO si présent
        dto.setId(id);
        ActifResponseDTO response = actifService.update(id, dto);
        return ResponseEntity.ok(response);
    }

    // Récupérer un actif par ID
    @GetMapping("/{id}")
    public ResponseEntity<ActifResponseDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(actifService.findById(id));
    }

    // Lister tous les actifs d'une activité
    @GetMapping("/activite/{activiteId}")
    public ResponseEntity<List<ActifResponseDTO>> findAllByActivite(@PathVariable Long activiteId) {
        return ResponseEntity.ok(actifService.findAllByActivite(activiteId));
    }

    // Lister les actifs racines d'une activité
    @GetMapping("/activite/{activiteId}/racines")
    public ResponseEntity<List<ActifResponseDTO>> findRoots(@PathVariable Long activiteId) {
        return ResponseEntity.ok(actifService.findRootsByActivite(activiteId));
    }

    // Lister les enfants d'un actif parent
    @GetMapping("/{parentId}/enfants")
    public ResponseEntity<List<ActifResponseDTO>> findChildren(@PathVariable Long parentId) {
        return ResponseEntity.ok(actifService.findChildren(parentId));
    }

    // Supprimer un actif
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        actifService.delete(id);
        return ResponseEntity.noContent().build();
    }
}