package project.feelm.global.security.oauth2;

import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import project.feelm.domain.user.entity.User;
import project.feelm.domain.user.repository.UserRepository;
import project.feelm.global.security.oauth2.social.GoogleUserInfo;
import project.feelm.global.security.oauth2.social.KakaoUserInfo;
import project.feelm.global.security.oauth2.social.NaverUserInfo;
import project.feelm.global.security.spring.CustomUserDetails;

@Service
@RequiredArgsConstructor
public class CustomOauth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        String provider = userRequest.getClientRegistration().getRegistrationId();
        OAuth2UserInfo oAuth2UserInfo = null;

        if (provider.equals("google")) {
            oAuth2UserInfo = new GoogleUserInfo(oAuth2User.getAttributes());
        } else if (provider.equals("naver")) {
            oAuth2UserInfo = new NaverUserInfo(oAuth2User.getAttributes());
        } else if (provider.equals("kakao")) {
            oAuth2UserInfo = new KakaoUserInfo(oAuth2User.getAttributes());
        }

        if (oAuth2UserInfo == null) {
            System.out.println("oAuth2UserInfo = null");
        }
        // DB 저장 혹은 업데이트 로직
        User user = saveOrUpdate(oAuth2UserInfo);


        // 기존에 만든 CustomUserDetails를 반환 (OAuth2User도 상속받도록 수정 필요)
        return new CustomUserDetails(user, oAuth2User.getAttributes());
    }

    private User saveOrUpdate(OAuth2UserInfo userInfo) {
        return userRepository.findByProviderAndProviderId(userInfo.getProvider(), userInfo.getProviderId()) // provider와 providerId로 기존 유저 확인
                .map(entity -> entity.update(userInfo.getName())) // 있으면 이름 등 업데이트
                .orElseGet(() -> userRepository.save(User.builder() // 없으면 신규 가입
                        .email(userInfo.getEmail())
                        .name(userInfo.getName())
                        .age(0)
                        .password("OAUTH_USER")
                        // 2. accountId도 null 방지를 위해 providerId를 활용하는 것이 안전
                        .accountId(userInfo.getProvider() + "_" + userInfo.getProviderId())
                        .provider(userInfo.getProvider())
                        .providerId(userInfo.getProviderId())
                        .build()));
    }

}
