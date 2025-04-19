import { Construct } from 'constructs';
import { Alarm, ComparisonOperator, Metric, TreatMissingData } from 'aws-cdk-lib/aws-cloudwatch';
import { Function } from 'aws-cdk-lib/aws-lambda';
import { RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Duration } from 'aws-cdk-lib';

export function createMonitoringAlarms(scope: Construct, lambdaFn: Function, apiGateway: RestApi, stage: string) {
  // Lambda Error Alarm
  new Alarm(scope, `LambdaErrorAlarm-${stage}`, {
    metric: lambdaFn.metricErrors({ period: Duration.minutes(1) }),
    threshold: 1,
    evaluationPeriods: 1,
    comparisonOperator: ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
    treatMissingData: TreatMissingData.NOT_BREACHING,
    alarmDescription: `Alarm when ${stage} Lambda has errors`,
    alarmName: `LambdaErrorsAlarm-${stage}`,
  });

  // API Gateway 5XX Errors
  new Alarm(scope, `ApiGateway5XXAlarm-${stage}`, {
    metric: new Metric({
      namespace: 'AWS/ApiGateway',
      metricName: '5XXError',
      dimensionsMap: {
        ApiName: apiGateway.restApiName,
      },
      period: Duration.minutes(1),
      statistic: 'Sum',
    }),
    threshold: 1,
    evaluationPeriods: 1,
    comparisonOperator: ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
    treatMissingData: TreatMissingData.NOT_BREACHING,
    alarmDescription: `Alarm when ${stage} API Gateway 5XX Errors exceed threshold`,
    alarmName: `ApiGateway5XXErrorsAlarm-${stage}`,
  });
}
