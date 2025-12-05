package project.feelm;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling // 스케줄링 기능 활성화 (배포 후 운영 시)
@SpringBootApplication
public class FeelmApplication {
	public static void main(String[] args) {
		SpringApplication.run(FeelmApplication.class, args);
	}

}
