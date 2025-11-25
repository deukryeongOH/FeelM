package project.feelm.domain.movie.controller;


import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import project.feelm.domain.movie.dto.FeelDto;
import project.feelm.domain.movie.dto.MovieDto;
import project.feelm.domain.movie.service.MovieService;
import project.feelm.domain.user.entity.User;
import project.feelm.global.security.spring.CustomUserDetails;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/movie")
public class MovieController {

    private final MovieService movieService;

    @PostMapping("/recommend")
    public ResponseEntity<List<MovieDto>> recommendMovie(@RequestBody FeelDto feelDto,
                                                         @AuthenticationPrincipal CustomUserDetails customUserDetails){
        User user = customUserDetails.getUser();
        // 추천 영화 리스트를 넘김 (5개)
        List<MovieDto> moviesDto = movieService.recommend(feelDto, user);

        return ResponseEntity.ok(moviesDto);
    }
}
