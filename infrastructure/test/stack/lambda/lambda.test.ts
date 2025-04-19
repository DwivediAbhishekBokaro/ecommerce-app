import { Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { createLambdaFunctionUsing } from '../../../src/stack/lambda/Lambda';

describe('Lambda Infrastructure', () => {
  it('should create Lambda function with correct properties', () => {
    const stack = new Stack();

    createLambdaFunctionUsing(stack, 'testStage');

    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::Lambda::Function', {
      FunctionName: 'my-ecommerce-lambda-testStage',
      Runtime: 'java17',
      Timeout: 30,
      MemorySize: 128,
      TracingConfig: {
        Mode: 'Active',
      },
      Environment: {
        Variables: {
          STAGE: 'testStage',
        },
      },
    });
  });
});
