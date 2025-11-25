package project.feelm.domain.user.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class JoinRequestDto {
    private String name;
    private int age;
    private String email;
    private String accountId;
    private String password;
}
