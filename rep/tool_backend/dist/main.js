"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const config_1 = require("@nestjs/config");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const config = app.get(config_1.ConfigService);
    const origin = config
        .get("NODE_ALLOWED_ORIGIN", "http://localhost:3000")
        .split(",")
        .map((host) => host.trim());
    const methods = config
        .get("NODE_ALLOWED_METHODS", "GET,POST")
        .split(",")
        .map((method) => method.trim());
    const allowedHeaders = config
        .get("NODE_ALLOWED_HEADERS", "Content-Type, Accept, Authorization")
        .split(",")
        .map((header) => header.trim());
    const credentials = config
        .get("NODE_ALLOWED_CREDENTIALS", "false").trim() === "true";
    app.enableCors({
        origin, methods, allowedHeaders, credentials
    });
    const port = config.get('NODE_PORT', 8080);
    const host = config.get('NODE_HOST', 'localhost');
    const prefix = config.get("NODE_BACKEND_PREFIX", "tool");
    app.setGlobalPrefix(prefix);
    await app.listen(port, host);
}
bootstrap();
//# sourceMappingURL=main.js.map