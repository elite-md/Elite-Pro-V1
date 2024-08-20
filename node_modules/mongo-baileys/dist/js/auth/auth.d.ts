import { Collection, Document } from "mongodb";
import { AuthenticationState, AuthenticationCreds } from "@whiskeysockets/baileys";
interface AuthDocument extends Document {
    _id: string;
    creds?: AuthenticationCreds;
}
interface MongoDBAuthState {
    state: AuthenticationState;
    saveCreds: () => Promise<void>;
}
declare function useMongoDBAuthState(collection: Collection<AuthDocument>): Promise<MongoDBAuthState>;
export { useMongoDBAuthState };
//# sourceMappingURL=auth.d.ts.map