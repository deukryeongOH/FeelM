package project.feelm.global.config;

import lombok.RequiredArgsConstructor;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.job.builder.JobBuilder;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.batch.repeat.RepeatStatus;
import org.springframework.boot.autoconfigure.batch.BatchProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.PlatformTransactionManager;

@Configuration
public class BatchConfig {

    /**
     * Python 스크립트를 실행하는 Step
     */
    @Bean
    public Step fetchMovieStep(JobRepository jobRepository, PlatformTransactionManager transactionManager) {
        return new StepBuilder("fetchMovieStep", jobRepository)
                .tasklet((contribution, chunkContext) -> {

                    ProcessBuilder pb = new ProcessBuilder(
                            "python3",
                            "/home/ec2-user/app/batch/fetch_movies.py"
                    );

                    pb.redirectErrorStream(true);
                    Process process = pb.start();

                    int exitCode = process.waitFor();

                    if (exitCode != 0) {
                        throw new RuntimeException("Python script failed with exit code: " + exitCode);
                    }

                    return RepeatStatus.FINISHED;
                }, transactionManager)
                .build();
    }

    /**
     * Step을 실행하는 Job
     */
    @Bean
    public Job fetchMovieJob(JobRepository jobRepository, Step fetchMovieStep) {
        return new JobBuilder("fetchMovieJob", jobRepository)
                .start(fetchMovieStep)
                .build();
    }
}
