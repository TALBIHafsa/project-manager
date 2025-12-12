package com.projectmanager.backend.service;

import com.projectmanager.backend.dto.request.LoginRequest;
import com.projectmanager.backend.dto.response.AuthResponse;
import com.projectmanager.backend.exception.DuplicateResourceException;
import com.projectmanager.backend.model.User;
import com.projectmanager.backend.repository.UserRepository;
import com.projectmanager.backend.security.JwtUtils;
import com.projectmanager.backend.security.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public void registerUser(String email, String password) {
        if (userRepository.existsByEmail(email)) {
            throw new DuplicateResourceException("Email already in use");
        }
        User user = User.builder()
                .email(email)
                .password(passwordEncoder.encode(password))
                .build();
        userRepository.save(user);
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String jwt = jwtUtils.generateToken(userDetails.getUsername());

        return AuthResponse.builder()
                .accessToken(jwt)
                .tokenType("Bearer")
                .userId(userDetails.getUser().getId())
                .email(userDetails.getUsername())
                .build();
    }
}