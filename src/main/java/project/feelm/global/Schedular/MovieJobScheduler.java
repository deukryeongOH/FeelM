package project.feelm.global.Schedular;

import lombok.RequiredArgsConstructor;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class MovieJobScheduler {

    // 배포 시 사용

    private final JobLauncher jobLauncher;
    private final Job fetchMovieJob;

    // 매일 새벽 4시에 실행 (초 분 시 일 월 요일)
//    @Scheduled(cron = "0 0 4 * * *")
//    public void runMovieJob() {
//        try {
//            // Job은 실행할 때마다 고유한 파라미터가 필요함 (여기선 현재 시간)
//            JobParameters jobParameters = new JobParametersBuilder()
//                    .addLong("time", System.currentTimeMillis())
//                    .toJobParameters();
//
//            jobLauncher.run(fetchMovieJob, jobParameters);
//
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
//    }
}
