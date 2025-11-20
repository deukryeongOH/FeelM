package project.feelm.domain.user.service;

import org.springframework.stereotype.Service;
import project.feelm.domain.user.dto.JoinRequestDto;
import project.feelm.domain.user.dto.LoginRequestDto;
import project.feelm.domain.user.dto.LoginResponseDto;
import project.feelm.domain.user.entity.User;

import java.util.Optional;

@Service
public interface UserService {
    String join(JoinRequestDto joinRequestDto);
    LoginResponseDto login(LoginRequestDto loginRequestDto);
    User findUser(Long id);
    String findId(String email);
    String recoverPassword(String accountId, String email);
    void resetPassword(String accountId, String tempPwd, String changePwd);
}
