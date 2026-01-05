package project.feelm.domain.movie.entity;


import jakarta.persistence.*;
import lombok.*;
import project.feelm.domain.moviefeeltag.entity.MovieFeelTag;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "Movie")
public class Movie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String plot; // 줄거리
    private String poster_url; // 포스터 url
    private String genres; // 장르
    private String keywords; // 키워드
    private double rate; // 평점
    private int certification; // 시청 등급

    // 1개의 영화는 여러 개의 MovieFeelTag을 가질 수 있다.
    // mappedBy = movie인 이유 MovieFeelTag 엔티티의 movie에 의해 관리됨
    @OneToMany(mappedBy = "movie", cascade = CascadeType.ALL)
    private List<MovieFeelTag> feelings = new ArrayList<>();

    @Builder
    public Movie(String title, String plot, String poster_url, double rate, int certification) {
        this.title = title;
        this.plot = plot;
        this.poster_url = poster_url;
        this.rate = rate;
        this.certification = certification;
    }
}
