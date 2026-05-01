package project.feelm.global.security.spring;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import project.feelm.domain.user.entity.User;
import project.feelm.domain.user.repository.UserRepository;


@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    // 로그인용 (사용자가 입력한 accountId로 찾기)
    @Override
    public UserDetails loadUserByUsername(String accountId) throws UsernameNotFoundException{
        User user = userRepository.findByAccountId(accountId)
                .orElseThrow(() -> new UsernameNotFoundException("해당 아이디의 유저를 찾을 수 없습니다: " + accountId));
        return new CustomUserDetails(user);
    }

    // JWT 인증용 (토큰에 저장된 Long id로 찾기)
    public UserDetails loadUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("해당 ID의 유저를 찾을 수 없습니다."));
        return new CustomUserDetails(user);
    }
}
