package project.feelm.domain.user.entity;

import jakarta.persistence.*;
import lombok.*;
import project.feelm.domain.feel.entity.Feel;
import project.feelm.domain.movie.entity.Movie;

import java.time.LocalDateTime;
import java.util.List;

@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Getter
@Setter
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "age", nullable = false)
    private int age; // 19세 영화 제한을 위해

    @Column(name = "email") // nullable 제거 이유 (소셜 로그인 이메일 못가져와서)
    private String email;

    @Column(name = "account_id", nullable = false, unique = true)
    private String accountId; // 증복 불가능

    @Column(name = "password", nullable = false)
    private String password;

    private String provider; // google, kakao, naver
    private String providerId; // ex) google 아이디, naver 아이디, kakao 아이디

    private LocalDateTime create_date;
    private LocalDateTime update_date;

//    @OneToMany(fetch = FetchType.LAZY, mappedBy = "movie", cascade = CascadeType.ALL)
//    @JoinColumn(name = "movie_id")
//    private List<Movie> movie;

//    @OneToMany(fetch = FetchType.LAZY, mappedBy = "feel", cascade = CascadeType.ALL)
//    @JoinColumn(name = "feel_id")
//    private List<Feel> feel;

    @Builder
    public User(String name, int age, String email, String accountId, String password, String provider, String providerId) {
        this.name = name;
        this.age = age;
        this.email = email;
        this.accountId = accountId;
        this.password = password;
        this.provider = provider;
        this.providerId = providerId;
        this.create_date = LocalDateTime.now();
        this.update_date = LocalDateTime.now();
    }

    public User update(String name) {
        this.name = name;
        this.update_date = LocalDateTime.now();
        return this;
    }
}

