import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import * as logger from "function-sdk-typescript/src/logger"
import * as runtime from "function-sdk-typescript/src/function"
import { runFunction } from './function';

yargs(hideBin(process.argv))
    .command('serve [port]', 'start the server', (yargs) => {
        return yargs
            .env()
            .option('debug', {
                describe: 'Enable debug logging',
                type: "boolean",
                default: false,
            })
            .option('insecure', {
                describe: 'Disable gRPC transport security',
                type: "boolean",
                default: false,
            })
            .option('tls-certs-dir', {
                describe: 'A directory containing mTLS server certs (tls.key and tls.crt), and a CA used to verify clients (ca.crt).',
                type: "string",
                default: "",
            })
    }, (argv) => {
        if (argv.debug) {
            logger.setOpts({
                level: 'debug'
            });
        }

        const mtls = runtime.loadMTLSCertificates(argv.tlsCertsDir)
        runtime.serve(
            (req) => runFunction(req),
            {
                insecure: argv.insecure,
                mtlsCertificates: mtls
            }
        )
    })
    .parse()