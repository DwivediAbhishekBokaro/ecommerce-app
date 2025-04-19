import { RemovalPolicy } from "aws-cdk-lib";
import { LogGroup, RetentionDays } from "aws-cdk-lib/aws-logs";
import { Construct } from "constructs";

export function createLogGroupForApiGateway(scope: Construct, deploymentStageName: string) {
    return new LogGroup(scope, `EcommerceApiGatewayLogGroup`, {
        logGroupName: `EcommerceApiLogGroupFor-${deploymentStageName}`,
        retention: RetentionDays.ONE_WEEK,
        removalPolicy: RemovalPolicy.DESTROY, // Change this to RETAIN for production
    });
};