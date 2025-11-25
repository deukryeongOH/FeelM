package project.feelm.domain.user.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.feelm.domain.user.dto.*;
import project.feelm.domain.user.service.UserService;

import java.util.Map;


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

    @PostMapping("/findId")
    public ResponseEntity<String> findId(@RequestBody EmailDto emailDto) {
        String accountId = userService.findAccountId(emailDto.getEmail());

        return ResponseEntity.ok(accountId);
    }

    @PostMapping("/recover-password")
    public ResponseEntity<String> recoverPwd(@RequestBody RecoverDto recoverDto) {
        String tempPwd = userService.recoverPassword(recoverDto.getAccountId(), recoverDto.getEmail());

        return ResponseEntity.ok(tempPwd);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPwd(@RequestBody ResetDto resetDto) {
        userService.resetPassword(resetDto.getAccountId(), resetDto.getTempPwd(), resetDto.getChangePwd());

        return ResponseEntity.ok("암호 변경 성공");
    }

}
