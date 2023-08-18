import { cleanEnv, port, str } from "envalid"

export default cleanEnv(process.env, {
    MONGO_CONNECTION_STRING: str(),
    PORT: port(),
    SESSION_SECRET: str(),
    DEFAULT_PARENT_ID: str(),
    OPENAI_API_KEY: str()
})