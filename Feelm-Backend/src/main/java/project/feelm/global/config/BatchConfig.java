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
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.web.client.RestTemplate;

import java.io.BufferedReader;
import java.io.InputStreamReader;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class BatchConfig {

    @Value("${batch.python.url")
    private String batchServiceUrl;

    @Value("${batch.python.command}")
    private String pythonCommand;

    @Value("${batch.python.fetch-script}")
    private String fetchScript;

    @Value("${batch.python.analyze-script}")
    private String analyzeScript;

    private void callPythonApi(String endPoint) {
        String batchUrl = "http://batch-service:5000" + endPoint; // docker-compose 서비스 이름 사용
        RestTemplate restTemplate = new RestTemplate();

        try {
            log.info("Python API 호출: " + batchUrl);
            // Post 요청 전송
            ResponseEntity<String> response = restTemplate.postForEntity(batchUrl, null, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                log.info("Python Job 성공: " + response.getBody());
            } else {
                throw new RuntimeException("Python Job 실패: " + response.getStatusCode());
            }
        } catch (Exception e) {
            throw new RuntimeException("API 호출 에러:" + e.getMessage());
        }
    }

    @Bean
    public Step fetchMovieStep(JobRepository jobRepository, PlatformTransactionManager transactionManager) {
        return new StepBuilder("fetchMovieStep", jobRepository)
                .tasklet((contribution, chunkContext) -> {
                    log.info("1. 영화 데이터 수집 시작");
//                    runPythonScript(fetchScript);
                    callPythonApi("/run-fetch");
                    return RepeatStatus.FINISHED;
                }, transactionManager)
                .build();
    }

    @Bean
    public Step analyzeMovieStep(JobRepository jobRepository, PlatformTransactionManager transactionManager) {
        return new StepBuilder("analyzeMovieStep", jobRepository)
                .tasklet((contribution, chunkContext) -> {
                    log.info("2. 영화 감정 분석 시작");
//                    runPythonScript(analyzeScript);
                    callPythonApi("/run-analyze");
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
