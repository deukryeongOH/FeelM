package project.feelm.domain.user.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class JoinRequestDto {
    private String name;
    private int age;
    private String email;
    private String accountId;
    private String password;
}
