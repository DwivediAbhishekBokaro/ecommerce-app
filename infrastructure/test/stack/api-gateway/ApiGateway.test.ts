import { Stack } from "aws-cdk-lib";
import { createApiGatewayUsing } from "../../../src/stack/api-gateway/ApiGateway";
import { createLambdaFunctionUsing } from "../../../src/stack/lambda/Lambda";
import { Template } from "aws-cdk-lib/assertions";

describe('API Gateway Infrastructure', () => {
  it('should create an API Gateway with correct properties', () => {
    const stack = new Stack();
    const eCommerceLambda = createLambdaFunctionUsing(stack, 'testStage');
    createApiGatewayUsing(stack, eCommerceLambda, 'testStage');

    const template = Template.fromStack(stack);

    // Validate API Gateway creation
    template.hasResourceProperties('AWS::ApiGateway::RestApi', {
      Name: 'EcoomerceApiGateway- testStage',
      Description: 'API Gateway for E-commerce API',
    });

    // Validate API Key creation
    template.hasResourceProperties('AWS::ApiGateway::ApiKey', {
      Name: 'EcommerceApiKey-testStage',
    });

    // Validate Usage Plan creation with correct throttling and API stages
    template.hasResourceProperties('AWS::ApiGateway::UsagePlan', {
      UsagePlanName: 'EcommerceApiUsagePlan-testStage',
      Description: 'Usage plan for the Ecommerce API - testStage',
      Throttle: {
        RateLimit: 50,
        BurstLimit: 100,
      },
    });
  });
});
