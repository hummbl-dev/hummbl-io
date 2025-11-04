import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

/**
 * Placeholder infrastructure stack for HUMMBL
 * This is a minimal implementation that allows the package to build successfully
 */
export class HummblInfrastructureStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Placeholder stack - can be extended with actual infrastructure resources
    // For now, this allows the package to build and the binary to be created
  }
}

