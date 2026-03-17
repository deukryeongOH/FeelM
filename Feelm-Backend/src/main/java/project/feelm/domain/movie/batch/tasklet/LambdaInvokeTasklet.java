package project.feelm.domain.movie.batch.tasklet;

import lombok.RequiredArgsConstructor;
import org.springframework.batch.core.StepContribution;
import org.springframework.batch.core.scope.context.ChunkContext;
import org.springframework.batch.core.step.tasklet.Tasklet;
import org.springframework.batch.repeat.RepeatStatus;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import software.amazon.awssdk.core.SdkBytes;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.lambda.LambdaClient;
import software.amazon.awssdk.services.lambda.model.InvokeRequest;

//@Component 여러 개의 경로와 함수명이 들어올 수 있으니 제거
@RequiredArgsConstructor
public class LambdaInvokeTasklet implements Tasklet {

    private final LambdaClient lambdaClient;
    private final String functionName;
    private final String path;

    @Override
    public RepeatStatus execute(StepContribution contribution, ChunkContext chunkContext) throws Exception {
        invokeLambda(this.path);

        return RepeatStatus.FINISHED;
    }

    private void invokeLambda(String path) {
        String payload = "{\"rawPath\": \"" + path + "\"}";
        InvokeRequest request = InvokeRequest.builder()
                .functionName(functionName)
                .payload(SdkBytes.fromUtf8String(payload))
                .build();

        lambdaClient.invoke(request);
    }
}
