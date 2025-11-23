package project.feelm.global.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.job.builder.JobBuilder;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.batch.repeat.RepeatStatus;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.batch.BatchProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.PlatformTransactionManager;

import java.io.BufferedReader;
import java.io.InputStreamReader;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class BatchConfig {

    @Value("${batch.python.command}")
    private String pythonCommand;

    @Value("${batch.python.script-path}")
    private String scriptPath;

    /**
     * Python 스크립트를 실행하는 Step
     */
    @Bean
    public Step fetchMovieStep(JobRepository jobRepository, PlatformTransactionManager transactionManager) {
        return new StepBuilder("fetchMovieStep", jobRepository)
                .tasklet((contribution, chunkContext) -> {
                    log.info("Python 스크립트 실행 시작: {} {}", pythonCommand, scriptPath);

                    ProcessBuilder pb = new ProcessBuilder(pythonCommand, scriptPath);
                    pb.redirectErrorStream(true); // 에러 출력을 표준 출력으로 병합

                    Process process = pb.start();

                    // 파이썬 스크립트의 출력(print)을 자바 로그로 읽어오기 (디버깅용 필수!)
                    try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                        String line;
                        while ((line = reader.readLine()) != null) {
                            log.info("[Python Log] : " + line);
                        }
                    }

                    int exitCode = process.waitFor();

                    if (exitCode != 0) {
                        log.error("Python 스크립트 비정상 종료. Exit Code: {}", exitCode);
                        throw new RuntimeException("Python script failed");
                    }

                    log.info("Python 스크립트 실행 완료");
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
