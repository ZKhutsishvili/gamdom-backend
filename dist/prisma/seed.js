"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        // Clear existing data
        yield prisma.event.deleteMany({});
        // Create sample events
        const events = [
            {
                name: "Champions League Final 2024",
                odds: 1.95,
            },
            {
                name: "World Cup 2026 - Opening Match",
                odds: 2.10,
            },
            {
                name: "NBA Finals 2024 - Game 1",
                odds: 1.85,
            },
            {
                name: "Wimbledon 2024 - Men's Final",
                odds: 1.75,
            },
            {
                name: "F1 Monaco Grand Prix 2024",
                odds: 2.25,
            },
        ];
        for (const event of events) {
            yield prisma.event.create({
                data: event,
            });
        }
        console.log('Seed data created successfully');
    });
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}));
