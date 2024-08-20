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
exports.useMongoDBAuthState = useMongoDBAuthState;
const mongodb_1 = require("mongodb");
const WAProto_1 = require("@whiskeysockets/baileys/WAProto");
const crypto_1 = require("@whiskeysockets/baileys/lib/Utils/crypto");
const generics_1 = require("@whiskeysockets/baileys/lib/Utils/generics");
const crypto_2 = require("crypto");
const uuid_1 = require("uuid");
const initAuthCreds = () => {
    const identityKey = crypto_1.Curve.generateKeyPair();
    return {
        noiseKey: crypto_1.Curve.generateKeyPair(),
        signedIdentityKey: identityKey,
        signedPreKey: (0, crypto_1.signedKeyPair)(identityKey, 1),
        registrationId: (0, generics_1.generateRegistrationId)(),
        advSecretKey: (0, crypto_2.randomBytes)(32).toString('base64'),
        processedHistoryMessages: [],
        nextPreKeyId: 1,
        firstUnuploadedPreKeyId: 1,
        accountSyncCounter: 0,
        accountSettings: {
            unarchiveChats: false
        },
        deviceId: (0, crypto_2.randomBytes)(16).toString('base64'),
        phoneId: (0, uuid_1.v4)(),
        identityId: (0, crypto_2.randomBytes)(20),
        registered: false,
        backupToken: (0, crypto_2.randomBytes)(20),
        registration: {},
        pairingEphemeralKeyPair: crypto_1.Curve.generateKeyPair(),
        pairingCode: undefined,
        lastPropHash: undefined,
        routingInfo: undefined,
    };
};
function useMongoDBAuthState(collection) {
    return __awaiter(this, void 0, void 0, function* () {
        const convertBinaryToBuffer = (obj) => {
            if (obj instanceof mongodb_1.Binary) {
                return obj.buffer;
            }
            if (Array.isArray(obj)) {
                return obj.map(convertBinaryToBuffer);
            }
            if (typeof obj === 'object' && obj !== null) {
                const newObj = {};
                for (const key in obj) {
                    newObj[key] = convertBinaryToBuffer(obj[key]);
                }
                return newObj;
            }
            return obj;
        };
        const writeData = (data, id) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield collection.updateOne({ _id: id }, { $set: data }, { upsert: true });
            }
            catch (error) {
                console.error("Error writing data:", error);
            }
        });
        const readData = (id) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield collection.findOne({ _id: id });
                return data ? convertBinaryToBuffer(data) : null;
            }
            catch (error) {
                console.error("Error reading data:", error);
                return null;
            }
        });
        const removeData = (id) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield collection.deleteOne({ _id: id });
            }
            catch (error) {
                console.error("Error removing data:", error);
            }
        });
        let creds;
        const data = yield readData("auth_creds");
        creds = data ? data.creds : initAuthCreds();
        const state = {
            creds,
            keys: {
                get: (type, ids) => __awaiter(this, void 0, void 0, function* () {
                    const data = {};
                    yield Promise.all(ids.map((id) => __awaiter(this, void 0, void 0, function* () {
                        let value = yield readData(`${type}-${id}`);
                        if (type === "app-state-sync-key" && value) {
                            value = WAProto_1.proto.Message.AppStateSyncKeyData.fromObject(value);
                        }
                        data[id] = value;
                    })));
                    return data;
                }),
                set: (data) => __awaiter(this, void 0, void 0, function* () {
                    const tasks = [];
                    for (const category in data) {
                        const categoryData = data[category];
                        if (categoryData) {
                            for (const id in categoryData) {
                                const value = categoryData[id];
                                const key = `${category}-${id}`;
                                tasks.push(value ? writeData(value, key) : removeData(key));
                            }
                        }
                    }
                    yield Promise.all(tasks);
                }),
            },
        };
        return {
            state,
            saveCreds: () => __awaiter(this, void 0, void 0, function* () {
                yield writeData({ creds: state.creds }, "auth_creds");
            }),
        };
    });
}
;
//# sourceMappingURL=auth.js.map