import { Duration } from "aws-cdk-lib";
import { Runtime, Tracing, Function, Code } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import path = require("path");

export function createLambdaFunctionUsing(scope: Construct, deploymentStageName: string){

    return new Function(scope, 'MyEcommerceLambda', {
        functionName: `my-ecommerce-lambda-${deploymentStageName}`,
        runtime: Runtime.JAVA_17,
        code: Code.fromAsset(path.join(__dirname, '../../../../code/target')), // Path to your lambda code
        handler: 'com.ecommerce.order.handler.OrderHandler::handleRequest',
        timeout: Duration.seconds(30),
        memorySize: 128,
        environment: {
            STAGE: deploymentStageName,
            // Add other environment variables as needed
        },
        tracing: Tracing.ACTIVE,
    });
}