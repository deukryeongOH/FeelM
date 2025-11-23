package project.feelm.domain.user.service.impl;

import jakarta.annotation.PostConstruct;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import project.feelm.domain.user.dto.JoinRequestDto;
import project.feelm.domain.user.dto.LoginRequestDto;
import project.feelm.domain.user.entity.User;
import project.feelm.domain.user.repository.UserRepository;
import project.feelm.domain.user.service.UserService;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.*;

@Transactional
@SpringBootTest
class UserServiceImplTest {


    @Autowired private UserService userService;
    @Autowired private UserRepository userRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    @BeforeEach
    void setUp() {
        User user = User.builder()
                .accountId("testAccount")
                .password(passwordEncoder.encode("testPwd"))
                .email("test@example.com")
                .age(21)
                .name("testName")
                .build();

        userRepository.save(user);
    }
    @Test
    void join() {
        JoinRequestDto dto = new JoinRequestDto();
        dto.setAccountId("testAccount1");
        dto.setPassword("testPwd1");
        dto.setAge(22);
        dto.setName("testName1");
        dto.setEmail("testEmail1");

        String name = userService.join(dto);

        assertThat(name).isEqualTo(dto.getName());
    }

    @Test
    void findAccountId() {
        String email = "test@example.com";
        User findUser = userRepository.findByEmail(email)
                .orElseThrow(IllegalArgumentException::new);

        String accountId = userService.findAccountId(findUser.getEmail());

        assertThat(accountId).isEqualTo(findUser.getAccountId());
    }


    @Test
    void findPwd() {
        String email = "test@example.com";
        User findUser = userRepository.findByEmail(email)
                .orElseThrow(IllegalArgumentException::new);

        String tempPwd = userService.recoverPassword(findUser.getAccountId(), email);

        assertTrue(passwordEncoder.matches(tempPwd, findUser.getPassword()));

        String changePwd = "changePwd";
        userService.resetPassword(findUser.getAccountId(), tempPwd, changePwd);

        assertTrue(passwordEncoder.matches(changePwd, findUser.getPassword()));

    }

}