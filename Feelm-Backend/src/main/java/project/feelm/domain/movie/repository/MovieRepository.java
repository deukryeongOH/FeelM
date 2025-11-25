package project.feelm.domain.movie.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import project.feelm.domain.movie.entity.Movie;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Long> {

}
