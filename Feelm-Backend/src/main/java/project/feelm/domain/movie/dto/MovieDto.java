package project.feelm.domain.movie.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
public class MovieDto {
    private String title;
    private String plot; // 줄거리
    private String poster_url; // 포스터 url
    private double rate; // 평점
    private int certification; // 시청 등급

    public MovieDto(String title, String plot, String posterUrl, double rate, int certification) {
        this.title = title;
        this.plot = plot;
        this.poster_url = posterUrl;
        this.rate = rate;
        this.certification = certification;
    }
}
