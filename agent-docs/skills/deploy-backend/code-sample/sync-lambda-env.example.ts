import { SSMClient, GetParametersByPathCommand } from '@aws-sdk/client-ssm';
import { LambdaClient, UpdateFunctionConfigurationCommand } from '@aws-sdk/client-lambda';

async function syncEnv(functionName: string, pathPrefix: string, region: string) {
  const ssm = new SSMClient({ region });
  const lambda = new LambdaClient({ region });

  const params = await ssm.send(new GetParametersByPathCommand({ Path: pathPrefix, Recursive: true, WithDecryption: true }));
  const vars = Object.fromEntries((params.Parameters ?? []).map((p) => [p.Name!.split('/').pop()!, p.Value ?? '']));

  await lambda.send(new UpdateFunctionConfigurationCommand({ FunctionName: functionName, Environment: { Variables: vars } }));
}

void syncEnv('openfinance-account', '/openfinance/backend/', 'us-east-1');
