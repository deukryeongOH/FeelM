package project.feelm.domain.user.service.impl;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
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

    @Test
    void join() {
        JoinRequestDto dto = new JoinRequestDto();
        dto.setAccountId("testAccount");
        dto.setPassword("testPwd");
        dto.setAge(21);
        dto.setName("testName");
        dto.setEmail("testEmail");

        String name = userService.join(dto);

        assertThat(name).isEqualTo(dto.getName());
    }

}