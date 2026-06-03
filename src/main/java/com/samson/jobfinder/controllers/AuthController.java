package com.samson.jobfinder.controllers;

import com.samson.jobfinder.models.entities.User;
import com.samson.jobfinder.models.requests.LoginRequest;
import com.samson.jobfinder.models.requests.RegisterRequest;
import com.samson.jobfinder.models.responses.AuthResponse;
import com.samson.jobfinder.services.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = userService.register(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = userService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/toggle-company-mode")
    public ResponseEntity<String> toggleCompanyMode(Authentication authentication) {
        User user = userService.toggleCompanyMode(authentication.getName());
        String mode = user.getIsCompanyMode() ? "Company" : "User";
        return ResponseEntity.ok("Switched to " + mode + " mode");
    }

    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(Authentication authentication) {
        User user = userService.getCurrentUser(authentication.getName());
        return ResponseEntity.ok(user);
    }
}