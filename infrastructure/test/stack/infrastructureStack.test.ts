import { Template } from "aws-cdk-lib/assertions";
import { InfrastructureStack } from "../../src/stack/InfrastructureStack";
import * as cdk from "aws-cdk-lib";


test('should create a new infrastructure stack', () => {
    const app = new cdk.App();
    const stack = new InfrastructureStack(app, 'TestStack', 'test');
    
    // Check if the stack was created successfully
    expect(stack).toBeDefined();
    
    // Check if the stack has the correct properties
    expect(stack.stackName).toEqual('TestStack');

    Template.fromStack(stack).resourceCountIs("AWS::Lambda::Function", 1);

    Template.fromStack(stack).resourceCountIs("AWS::ApiGateway::RestApi", 1);
});