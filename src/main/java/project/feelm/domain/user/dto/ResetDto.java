package project.feelm.domain.user.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ResetDto {
    private String accountId;
    private String tempPwd;
    private String changePwd;
}

