package project.feelm.domain.moviefeeltag.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import project.feelm.domain.feel.entity.Feel;
import project.feelm.domain.movie.entity.Movie;
import project.feelm.domain.moviefeeltag.entity.MovieFeelTag;

import java.util.List;
import java.util.Optional;

@Repository
public interface MovieFeelTagRepository extends JpaRepository<MovieFeelTag, Long> {

    // 특정 Feel 객체에 연결된 모든 태그를 찾는 메서드
    List<Movie> findMoviesByFeelId(Long feelId);

    // 특정 Movie 객체에 연결된 모든 태그를 찾는 메서드
    List<Feel> findFeelByMovieId(Long movieId);

    // 특정 Movie와 Feel이 이미 매핑되어 있는지 확인할 때 사용
    Optional<MovieFeelTag> findByMovieAndFeel(Movie movie, Feel feel);

}
