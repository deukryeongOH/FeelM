package project.feelm.domain.movie.service.impl;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import project.feelm.domain.feel.entity.Feel;
import project.feelm.domain.feel.repository.FeelRepository;
import project.feelm.domain.movie.dto.FeelDto;
import project.feelm.domain.movie.dto.MovieDto;
import project.feelm.domain.movie.dto.SliderDto;
import project.feelm.domain.movie.entity.Movie;
import project.feelm.domain.movie.repository.MovieRepository;
import project.feelm.domain.movie.service.MovieService;
import project.feelm.domain.moviefeeltag.repository.MovieFeelTagRepository;
import project.feelm.domain.user.entity.User;

import java.util.ArrayList;
import java.util.List;

@Transactional
@Service
@RequiredArgsConstructor
public class MovieServiceImpl implements MovieService {

    private final MovieFeelTagRepository movieFeelTagRepository;
    private final FeelRepository feelRepository;
    private final MovieRepository movieRepository;


    @Override
    public List<MovieDto> recommend(FeelDto feelDto, User user) {
        Feel feel = feelRepository.findById(feelDto.getFeelId())
                .orElseThrow(IllegalArgumentException::new);

        List<MovieDto> movies = new ArrayList<>();
        List<MovieDto> result = new ArrayList<>();
        addMovies(movies, feel, user.getAge());

        for (int i = 0; i < 20; i++) {
            randomAddMovies(movies, result);
        }
        // 고도화 평점 순으로 추천(추후)
        return result;
    }

    @Override
    public List<SliderDto> getSlider() {
        List<SliderDto> dtoList = new ArrayList<>();
        for(Movie movie : movieRepository.findRandomMovies()){
            SliderDto dto = new SliderDto(movie.getTitle(), movie.getPoster_url());
            dtoList.add(dto);
        }
        return dtoList;
    }

    private void randomAddMovies(List<MovieDto> movies, List<MovieDto> result) {
        int random = (int)(Math.random() * movies.size());
        if (!result.contains(movies.get(random))) {
            result.add(movies.get(random));
        }
    }

    private void addMovies(List<MovieDto> movies, Feel feel, int age) {
        for (Movie movie : movieFeelTagRepository.findMoviesByFeelId(feel.getId())) {
            MovieDto movieDto = new MovieDto(
                    movie.getTitle(),
                    movie.getPlot(),
                    movie.getPoster_url(),
                    movie.getRate(),
                    movie.getCertification()
            );
            checkCertification(movies, movieDto, age);
        }
    }

    // 시정 연령이 나이보다 낮으면 추천 목록에 추가
    private void checkCertification(List<MovieDto> movies, MovieDto movieDto, int age) {
        if (movieDto.getCertification() <= age) {
            movies.add(movieDto);
        }
    }

}
