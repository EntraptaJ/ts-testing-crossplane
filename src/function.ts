import { RunFunctionRequest, RunFunctionResponse } from "function-sdk-typescript/src/gen/v1/run_function_pb"
import * as logger from "function-sdk-typescript/src/logger"
import { PartialMessage } from "@bufbuild/protobuf"

const log = logger.getLogger();

export async function runFunction(req: RunFunctionRequest): Promise<PartialMessage<RunFunctionResponse>> {
    log.debug("Running function...");

    // TODO: Add your function logic here

    log.debug("I was run!");
    return {
        conditions: [],
        context: req.context,
        desired: req.desired,
        meta: req.meta
    }
}
