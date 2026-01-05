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

    @Value("${batch.python.fetch-script}")
    private String fetchScript;

    @Value("${batch.python.analyze-script}")
    private String analyzeScript;


    @Bean
    public Step fetchMovieStep(JobRepository jobRepository, PlatformTransactionManager transactionManager) {
        return new StepBuilder("fetchMovieStep", jobRepository)
                .tasklet((contribution, chunkContext) -> {
                    log.info("1. 영화 데이터 수집 시작");
                    runPythonScript(fetchScript);
                    return RepeatStatus.FINISHED;
                }, transactionManager)
                .build();
    }

    @Bean
    public Step analyzeMovieStep(JobRepository jobRepository, PlatformTransactionManager transactionManager) {
        return new StepBuilder("analyzeMovieStep", jobRepository)
                .tasklet((contribution, chunkContext) -> {
                    log.info("2. 영화 감정 분석 시작");
                    runPythonScript(analyzeScript);
                    return RepeatStatus.FINISHED;
                }, transactionManager)
                .build();
    }

    private void runPythonScript(String scriptPath) {
        try {
            ProcessBuilder pb = new ProcessBuilder(pythonCommand, scriptPath);
            pb.redirectErrorStream(true);
            Process process = pb.start();

            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    log.info("Python: " + line);
                }
            }

            int exitCode = process.waitFor();
            if (exitCode != 0) {
                throw new RuntimeException("스크립트 실행 실패 : " + exitCode);
            }
        } catch (Exception e) {
            throw new RuntimeException("파이썬 실행 중 에러 발생: " + scriptPath, e);
        }
    }


    /**
     * Step을 실행하는 Job
     */
    @Bean
    public Job fetchMovieJob(JobRepository jobRepository, Step fetchMovieStep, Step analyzeMovieStep) {
        return new JobBuilder("fetchMovieJob", jobRepository)
                .start(fetchMovieStep)
                .next(analyzeMovieStep)
                .build();
    }

}
