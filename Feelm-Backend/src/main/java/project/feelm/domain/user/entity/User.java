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
@Table(name = "User")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "age", nullable = false)
    private int age; // 19세 영화 제한을 위해

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "accountId", nullable = false, unique = true)
    private String accountId; // 증복 불가능

    @Column(name = "password", nullable = false)
    private String password;

    private LocalDateTime create_date;
    private LocalDateTime update_date;

//    @OneToMany(fetch = FetchType.LAZY, mappedBy = "movie", cascade = CascadeType.ALL)
//    @JoinColumn(name = "movie_id")
//    private List<Movie> movie;

//    @OneToMany(fetch = FetchType.LAZY, mappedBy = "feel", cascade = CascadeType.ALL)
//    @JoinColumn(name = "feel_id")
//    private List<Feel> feel;

    @Builder
    public User(String name, int age, String email, String accountId, String password) {
        this.name = name;
        this.age = age;
        this.email = email;
        this.accountId = accountId;
        this.password = password;
        this.create_date = LocalDateTime.now();
        this.update_date = LocalDateTime.now();
    }
}

