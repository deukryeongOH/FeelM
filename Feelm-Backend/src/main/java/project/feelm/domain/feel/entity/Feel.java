package project.feelm.domain.feel.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import project.feelm.domain.movie.entity.Movie;
import project.feelm.domain.moviefeeltag.entity.MovieFeelTag;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "Feel")
public class Feel {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type; // 감정 유형 (기쁨, 슬픔, 설렘) 3가지

    // feel은 여러 개의 MovieFeelTag를 가질 수 있다.
    @OneToMany(mappedBy = "feel", cascade = CascadeType.ALL)
    private List<MovieFeelTag> movieTags = new ArrayList<>();
}
