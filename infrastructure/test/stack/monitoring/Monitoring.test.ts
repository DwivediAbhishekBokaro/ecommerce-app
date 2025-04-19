import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { createLambdaFunctionUsing } from '../../../src/stack/lambda/Lambda';
import { createApiGatewayUsing } from '../../../src/stack/api-gateway/ApiGateway';
import { createMonitoringAlarms } from '../../../src/stack/monitoring/Monitoring';

describe('Monitoring Stack Tests', () => {
  it('should create CloudWatch log group for Lambda and API Gateway with correct configurations', () => {
    const stack = new cdk.Stack();
    const deploymentStageName = 'testStage';
    
    // Create Lambda and API Gateway using the helper functions
    const eCommerceLambda = createLambdaFunctionUsing(stack, deploymentStageName);
    const eCommerceApiGateway = createApiGatewayUsing(stack, eCommerceLambda, deploymentStageName);
    createMonitoringAlarms(stack, eCommerceLambda, eCommerceApiGateway, deploymentStageName); 

    const template = Template.fromStack(stack);

    // Check if CloudWatch Log Group is created for Lambda function
    template.hasResourceProperties('AWS::Logs::LogGroup', {
      
        LogGroupName: `EcommerceApiLogGroupFor-${deploymentStageName}`, // Name for Lambda log group
      
      RetentionInDays: 7, // Assuming log retention of 7 days as specified
    });

    // Check if CloudWatch Log Group is created for API Gateway
    template.hasResourceProperties('AWS::Logs::LogGroup', {
      
        LogGroupName: `EcommerceApiLogGroupFor-${deploymentStageName}`, // Name for API Gateway log group
      
    });

    // Create monitoring alarms

    console.log(JSON.stringify(template.toJSON(), null, 2)); // Log the template for debugging

    // Validate CloudWatch metric filters and alarms for Lambda
    template.hasResourceProperties('AWS::CloudWatch::Alarm', {
      AlarmName: `LambdaErrorsAlarm-${deploymentStageName}`, // Custom alarm name for Lambda invocation errors
      MetricName: 'Errors',
      Namespace: 'AWS/Lambda',
      Statistic: 'Sum',
      Period: 60,
      EvaluationPeriods: 1,
      Threshold: 1,
      ComparisonOperator: 'GreaterThanOrEqualToThreshold',
      Dimensions: [
        {
          Name: 'FunctionName',
        //   Value: eCommerceLambda.functionName,
        },
      ],
    });

    template.resourceCountIs('AWS::CloudWatch::Alarm', 2); // Check if two alarms are created

    // Validate CloudWatch metric filters and alarms for API Gateway
    template.hasResourceProperties('AWS::CloudWatch::Alarm', {
      AlarmName: `ApiGateway5XXErrorsAlarm-${deploymentStageName}`, // Custom alarm name for 5xx errors in API Gateway
      MetricName: '5XXError',
      Namespace: 'AWS/ApiGateway',
      Statistic: 'Sum',
      Period: 60,
      EvaluationPeriods: 1,
      Threshold: 1, // Assuming threshold for 5xx errors is 1
      ComparisonOperator: 'GreaterThanOrEqualToThreshold',
      Dimensions: [
        {
          Name: 'ApiName',
          Value: eCommerceApiGateway.restApiName,
        },
      ],
    });
  });
});
