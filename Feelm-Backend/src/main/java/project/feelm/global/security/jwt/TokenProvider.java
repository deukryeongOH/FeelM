package project.feelm.global.security.jwt;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Component;
import project.feelm.domain.user.entity.User;
import project.feelm.domain.user.repository.UserRepository;
import project.feelm.global.security.oauth2.CustomOauth2UserService;
import project.feelm.global.security.spring.CustomUserDetails;
import project.feelm.global.security.spring.CustomUserDetailsService;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Component
@RequiredArgsConstructor
public class TokenProvider {

    @Value("${jwt.secret-key}")
    private String secret;

    @Value("${jwt.access-expiration}")
    private long accessToken;

    @Value("${jwt.refresh-expiration}")
    private long refreshToken;

    private SecretKey key;
    private final CustomUserDetailsService customUserDetailsService;
    private final UserRepository userRepository;

    @PostConstruct
    public void init() {
        byte[] bytes = Decoders.BASE64.decode(secret);
        key = Keys.hmacShaKeyFor(bytes);
    }

    public String createAccessToken(Authentication authentication){
        Date now = new Date();

        Object principal = authentication.getPrincipal();
        System.out.println("현재 Principal 타입: " + principal.getClass().getName());
        Long id = null;

        if (principal instanceof CustomUserDetails) {
            // 일반 로그인 혹은 우리가 만든 OAuth2 서비스에서 반환한 경우
            id = ((CustomUserDetails) principal).getUser().getId();
        } else if (principal instanceof OAuth2User) {
            // CustomUserDetails로 변환되지 않은 일반 OAuth2User가 들어온 경우

        }

        // ID가 없는 경우에 대한 예외 처리
        if (id == null) {
            throw new RuntimeException("인증 정보에서 사용자 ID를 찾을 수 없습니다.");
        }

        List<String> roles = authentication.getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        return Jwts.builder()
                .subject(String.valueOf(id))
                .claim("roles", roles)
                .issuedAt(now)
                .expiration(new Date(now.getTime()+accessToken))
                .signWith(key, Jwts.SIG.HS512)
                .compact();
    }

    public String createRefreshToken(Authentication authentication){
        Date now = new Date();

        Object principal = authentication.getPrincipal();
        Long id = null;

        if (principal instanceof CustomUserDetails) {
            // 일반 로그인 혹은 우리가 만든 OAuth2 서비스에서 반환한 경우
            id = ((CustomUserDetails) principal).getUser().getId();
        } else if (principal instanceof OAuth2User) {
            // CustomUserDetails로 변환되지 않은 일반 OAuth2User가 들어온 경우
            OAuth2User oAuth2User = (OAuth2User) principal;
            String providerId = (String) oAuth2User.getAttributes().get("sub");

            id = userRepository.findByProviderAndProviderId("google", providerId)
                    .map(User::getId)
                    .orElseThrow(() -> new RuntimeException("구글 로그인 유저를 DB에서 찾을 수 없습니다."));
        }

        // ID가 없는 경우에 대한 예외 처리
        if (id == null) {
            throw new RuntimeException("인증 정보에서 사용자 ID를 찾을 수 없습니다.");
        }
        List<String> roles = authentication.getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        return Jwts.builder()
                .subject(String.valueOf(id))
                .claim("roles", roles)
                .issuedAt(now)
                .expiration(new Date(now.getTime()+refreshToken))
                .signWith(key, Jwts.SIG.HS512)
                .compact();
    }



    public boolean validateToken(String token) {
        try{
            Jwts.parser().verifyWith(key).build().parseSignedClaims(token);
            return true;
        } catch(io.jsonwebtoken.security.SecurityException | MalformedJwtException e){
            log.info("잘못된 JWT 서명입니다.");
        } catch (ExpiredJwtException e) {
            log.info("만료된 JWT 토큰입니다.");
        } catch (UnsupportedJwtException e) {
            log.info("지원되지 않는 JWT 토큰입니다.");
        } catch (IllegalArgumentException e) {
            log.info("JWT 토큰이 잘못되었습니다.");
        }
        return false;
    }

    public Authentication getAuthentication(String token) {
        Claims claims = Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload();

        // 토큰 검증 시 user의 ID를 꺼내서 확인한다.
        Long userId = Long.parseLong(claims.getSubject());
        UserDetails userDetails = customUserDetailsService.loadUserById(userId);

        List<?> roles = (List<?>)claims.get("roles");
        List<SimpleGrantedAuthority> auths = roles.stream().map(Object::toString)
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());

        return new UsernamePasswordAuthenticationToken(userDetails, token, auths);
    }
}
