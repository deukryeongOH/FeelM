package project.feelm.domain.feel.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import project.feelm.domain.feel.entity.Feel;
import project.feelm.domain.user.entity.User;

@Repository
public interface FeelRepository extends JpaRepository<Feel, Long> {
}
