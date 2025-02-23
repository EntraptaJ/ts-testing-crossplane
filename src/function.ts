import { RunFunctionRequest, RunFunctionResponse, Severity } from "function-sdk-typescript/src/gen/v1/run_function_pb"
import * as logger from "function-sdk-typescript/src/logger"
import { PartialMessage } from "@bufbuild/protobuf"
import * as k8s from '@kubernetes/client-node'
import * as test from '../tmp/test2'

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const k8sApi = kc.makeApiClient(k8s.CustomObjectsApi);
const log = logger.getLogger();

export async function runFunction(req: RunFunctionRequest): Promise<PartialMessage<RunFunctionResponse>> {
  log.debug('Running function...');



  //const machineDetails = await k8sApi.getNamespacedCustomObject('infrastructure.cluster.x-k8s.io', 'v1beta1', 'core-prod', 'tinkerbellmachines', '')

  log.debug('I was run!', req.input);
  return {
    conditions: [],
    results: [
      {
        message: `Hello World! ${JSON.stringify(req)}`,
        severity: Severity.NORMAL
      }
    ],
    context: req.context,
    desired: req.desired,
    meta: req.meta
  }
}
