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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middlware_1 = require("../utils/auth.middlware");
const client_1 = require("@prisma/client");
const library_1 = require("@prisma/client/runtime/library");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Heeeree");
        const events = yield prisma.event.findMany();
        res.json(events);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch events' });
    }
}));
router.get('/user/:userId', (0, auth_middlware_1.authenticateToken)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = parseInt(req.params.userId);
        // Validate that userId is a valid number
        if (isNaN(userId)) {
            res.status(400).json({ error: 'Invalid user ID' });
            return;
        }
        const events = yield prisma.event.findMany({
            where: {
                users: {
                    some: {
                        userId: userId
                    }
                }
            }
        });
        res.json(events);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch user events' });
    }
}));
router.post('/', (0, auth_middlware_1.authenticateToken)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, odds } = req.body;
        const event = yield prisma.event.create({
            data: {
                name,
                odds: new library_1.Decimal(odds)
            }
        });
        res.status(201).json(event);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create event' });
    }
}));
router.put('/:id', (0, auth_middlware_1.authenticateToken)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const eventId = parseInt(req.params.id);
        const { name, odds } = req.body;
        const updatedEvent = yield prisma.event.update({
            where: { id: eventId },
            data: {
                name,
                odds: new library_1.Decimal(odds)
            }
        });
        res.json(updatedEvent);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update event' });
    }
}));
router.post('/:id/users', (0, auth_middlware_1.authenticateToken)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const eventId = parseInt(req.params.id);
        const { userId } = req.body;
        const existingParticipant = yield prisma.userOnEvent.findFirst({
            where: {
                eventId,
                userId
            }
        });
        if (existingParticipant) {
            res.status(400).json({ error: 'User has already has a bet' });
            return;
        }
        const participant = yield prisma.userOnEvent.create({
            data: {
                eventId,
                userId
            }
        });
        res.status(201).json(participant);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to add bet to event' });
    }
}));
exports.default = router;
