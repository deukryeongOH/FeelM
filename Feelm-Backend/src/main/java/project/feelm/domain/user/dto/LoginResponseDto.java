package project.feelm.domain.user.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class LoginResponseDto {
    private Long id;
    private String accountId;
    private int age;
    private String name;
    private String email;
    private String accessToken;
    private String refreshToken;

    public LoginResponseDto(Long id, String accountId, int age, String name, String email, String accessToken, String refreshToken) {
        this.id = id;
        this.accessToken = accessToken;
        this.email = email;
        this.name = name;
        this.age = age;
        this.accountId = accountId;
        this.refreshToken = refreshToken;
    }
}
