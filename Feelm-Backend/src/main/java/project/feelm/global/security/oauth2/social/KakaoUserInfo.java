package project.feelm.global.security.oauth2.social;

import project.feelm.global.security.oauth2.OAuth2UserInfo;

import java.util.Map;

public class KakaoUserInfo implements OAuth2UserInfo {
    private Map<String, Object> attributes;
    private Map<String, Object> kakaoAccount;
    private Map<String, Object> kakaoProfile;


    public KakaoUserInfo(Map<String, Object> attributes){
        this.attributes = attributes;
        // kakao_account 안에 유저 정보있음
        this.kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
        if (kakaoAccount != null) {
            // kakao_account 안에 profile이라는 Map에 닉네임 있음
            this.kakaoProfile = (Map<String, Object>) kakaoAccount.get("profile");
        }
    }

    @Override
    public String getProviderId() {
        return String.valueOf(attributes.get("id"));
    }

    @Override
    public String getProvider() {
        return "kakao";
    }

    @Override
    public String getEmail() {
        if (kakaoAccount == null) {
            return null;
        }
        return (String) kakaoAccount.get("email");
    }

    @Override
    public String getName() {
        if (kakaoProfile == null) {
            return null;
        }
        return (String) kakaoProfile.get("nickname");
    }
}
