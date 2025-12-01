package project.feelm.domain.user.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import project.feelm.domain.user.dto.JoinRequestDto;
import project.feelm.domain.user.dto.LoginRequestDto;
import project.feelm.domain.user.dto.LoginResponseDto;
import project.feelm.domain.user.entity.User;
import project.feelm.domain.user.repository.UserRepository;
import project.feelm.domain.user.service.UserService;
import project.feelm.global.security.jwt.TokenProvider;
import project.feelm.global.security.spring.CustomUserDetails;

import java.util.Random;

@Service
@Transactional
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenProvider tokenProvider;
    private final AuthenticationManager authenticationManager;

    @Override
    public String join(JoinRequestDto dto) {
        validateUser(dto); // 회원이 존재하는지 아닌지

        User user = User.builder()
                .name(dto.getName())
                .age(dto.getAge())
                .email(dto.getEmail())
                .accountId(dto.getAccountId())
                .password(passwordEncoder.encode(dto.getPassword()))
                .build();


        userRepository.save(user);

        return user.getName();

    }

    @Override
    public LoginResponseDto login(LoginRequestDto loginRequestDto) {
        if (loginRequestDto == null) {
            throw new IllegalArgumentException("로그인 정보가 없습니다.");
        }

        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequestDto.getAccountId(),
                        loginRequestDto.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(auth);

        String accessToken = tokenProvider.createAccessToken(auth);
        String refreshToken = tokenProvider.createRefreshToken(auth);

        CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();
        User user = findUser(userDetails.getId());

        return new LoginResponseDto(
                user.getId(),
                user.getAccountId(),
                user.getAge(),
                user.getName(),
                user.getEmail(),
                accessToken,
                refreshToken
        );

    }

    @Override
    public User findUser(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 ID를 가진 회원이 존재하지 않습니다."));
    }


    @Override
    public String findAccountId(String email) {
        return findUserByEmail(email).getAccountId();
    }

    @Override
    public String recoverPassword(String accountId, String email) {
        User findUser = findUserByEmail(email);

        if(!findUser.getAccountId().equals(accountId)){
            throw new IllegalArgumentException("입력하신 계정아이디가 일치하지 않습니다.");
        }

        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@$%^&*";
        int leng = 10;
        String tempPwd = generateRandomString(characters, leng);

        findUser.setPassword(passwordEncoder.encode(tempPwd));
        userRepository.save(findUser);

        return tempPwd;
    }

    @Override
    public void resetPassword(String accountId, String nowPwd, String newPwd) {
        User findUser = userRepository.findByAccountId(accountId)
                .orElseThrow(IllegalAccessError::new);

        if (!passwordEncoder.matches(nowPwd, findUser.getPassword())) {
            throw new IllegalArgumentException("입력하신 현재 비밀번호가 일치하지 않습니다.");
        }

        findUser.setPassword(passwordEncoder.encode(newPwd));
        userRepository.save(findUser);
    }

    private String generateRandomString(String characters, int leng) {
        Random random = new Random();
        StringBuilder sb = new StringBuilder(leng);

        for (int i = 0; i < leng; i++) {
            int randomIdx = random.nextInt(characters.length());
            sb.append(characters.charAt(randomIdx));
        }
        return sb.toString();
    }

    private User findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(IllegalArgumentException::new);

    }
    private void validateUser(JoinRequestDto dto) {
        if (userRepository.existsByAccountId(dto.getAccountId())) {
            throw new IllegalArgumentException("회원이 이미 존재합니다.");
        }
    }
}
