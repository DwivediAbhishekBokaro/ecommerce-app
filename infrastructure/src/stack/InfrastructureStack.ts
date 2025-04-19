import { Construct } from "constructs";
import { createApiGatewayUsing } from "./api-gateway/ApiGateway";
import { createLambdaFunctionUsing } from "./lambda/Lambda";
import * as cdk from 'aws-cdk-lib';
import { createMonitoringAlarms } from "./monitoring/Monitoring";

export class InfrastructureStack extends cdk.Stack {
  constructor(scope: Construct, id: string, deploymentStageName : string, props?: cdk.StackProps) {
    super(scope, id, props);

    const eCommerceLambda = createLambdaFunctionUsing(this, deploymentStageName);  
    const eCommerceApiGateway = createApiGatewayUsing(this, eCommerceLambda, deploymentStageName);

    createMonitoringAlarms(this, eCommerceLambda, eCommerceApiGateway, deploymentStageName);

    // Other resources like logs if needed
  }
}

