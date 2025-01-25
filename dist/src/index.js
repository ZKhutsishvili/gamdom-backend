"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_route_1 = __importDefault(require("./user/user.route"));
const event_route_1 = __importDefault(require("./event/event.route"));
const client_1 = require("@prisma/client");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 4000;
// Prisma client initialization
exports.prisma = new client_1.PrismaClient();
app.use(express_1.default.json());
// Add request logging middleware BEFORE routes
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});
console.log('Setting up routes...');
app.use('/api/user', user_route_1.default);
app.use('/api/event', event_route_1.default);
console.log('Routes set up completed');
// Add error handling middleware AFTER routes
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).send('Something broke!');
});
app.get('/', (req, res) => {
    res.send('Hello, TypeScript with Express and Prisma!');
});
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
