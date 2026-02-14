package project.feelm.domain.movie.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
public class SliderDto {

    @JsonProperty("poster_path")
    private String poster_url;

    private String title;

    public SliderDto(String title, String poster_url) {
        this.title = title;
        this.poster_url = poster_url;
    }
}
