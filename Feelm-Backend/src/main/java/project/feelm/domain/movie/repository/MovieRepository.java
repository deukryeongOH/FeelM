package project.feelm.domain.movie.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import project.feelm.domain.movie.entity.Movie;

import java.util.List;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Long> {

    // MySQL 사용시 RAND()
    @Query(value = "SELECT * FROM movie ORDER BY RAND() LIMIT 100", nativeQuery = true)
    List<Movie> findRandomMovies();
}
