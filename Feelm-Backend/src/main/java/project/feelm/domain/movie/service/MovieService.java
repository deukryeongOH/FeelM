package project.feelm.domain.movie.service;

import org.springframework.stereotype.Service;
import project.feelm.domain.movie.dto.FeelDto;
import project.feelm.domain.movie.dto.MovieDto;
import project.feelm.domain.movie.dto.SliderDto;
import project.feelm.domain.user.entity.User;

import java.util.List;

@Service
public interface MovieService {
    List<MovieDto> recommend(FeelDto feelDto, User user);
    List<SliderDto> getSlider();
}
