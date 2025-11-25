package project.feelm.domain.moviefeeltag.entity;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import project.feelm.domain.feel.entity.Feel;
import project.feelm.domain.movie.entity.Movie;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "movie_feel_tag")
public class MovieFeelTag {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "movie_feel_tag_id")
    private Long Id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "movie_id")
    private Movie movie;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "feel_id")
    private Feel feel;

}
