import * as cdk from "aws-cdk-lib";
import { StackProps } from "aws-cdk-lib";
import { InfrastructureStack } from "../src/stack/InfrastructureStack";

const deploymentStackName = process.env.STACK_NAME || "InfrastructureStack";
const deploymentStage = process.env.STAGE || "dev";

const props: StackProps = {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  }
};

const app = new cdk.App();
new InfrastructureStack(app, deploymentStackName, deploymentStage, props);