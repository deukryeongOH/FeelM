package project.feelm.domain.user.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import project.feelm.domain.user.dto.JoinRequestDto;
import project.feelm.domain.user.dto.LoginRequestDto;
import project.feelm.domain.user.dto.LoginResponseDto;
import project.feelm.domain.user.entity.User;
import project.feelm.domain.user.service.UserService;
import project.feelm.global.security.jwt.TokenProvider;
import project.feelm.global.security.spring.CustomUserDetails;

import java.util.Optional;


@RequiredArgsConstructor
@RequestMapping("/api/user")
@RestController
public class UserController {

    private final UserService userService;

    @PostMapping("/join")
    public ResponseEntity<String> join(@RequestBody JoinRequestDto joinRequestDto) {
        String name = userService.join(joinRequestDto);

        return ResponseEntity.ok(name);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@RequestBody LoginRequestDto loginRequestDto) {
        LoginResponseDto loginResponseDto = userService.login(loginRequestDto);

        return ResponseEntity.ok(loginResponseDto);
    }



}
