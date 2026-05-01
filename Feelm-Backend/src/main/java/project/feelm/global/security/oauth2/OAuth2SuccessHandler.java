package project.feelm.global.security.oauth2;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;
import project.feelm.global.security.jwt.TokenProvider;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Value("${app.oauth2.redirect-uri}")
    private String redirectUri;

    private final TokenProvider tokenProvider;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException {

        System.out.println("성공 핸들러 진입 완료!!");
        // 1. JWT 토큰 생성
        String accessToken = tokenProvider.createAccessToken(authentication);
        String refreshToken = tokenProvider.createRefreshToken(authentication);

        // 2. 프론트엔드 리다이렉트 주소 설정
        String targetUrl = UriComponentsBuilder.fromUriString(redirectUri)
                .queryParam("accessToken", accessToken)
                .queryParam("refreshToken", refreshToken)
                .build().toUriString();

        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}


/*
* 2. 실무 전문가의 꿀팁: "계정 통합"
소셜 로그인을 도입할 때 가장 골치 아픈 점이 **"이메일이 같은 경우"**입니다.

이미 accountId로 가입한 유저(test@email.com)가 Google로 다시 로그인할 때 어떻게 할 것인가?

해결책: 이메일 기반으로 기존 유저를 찾아서 provider 정보만 업데이트해주는 Account Linking 로직을 OAuth2UserService에 넣는 것이 실무적인 접근입니다.
* */