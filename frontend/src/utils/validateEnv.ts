import { cleanEnv, str } from "envalid"

export default cleanEnv(process.env, {
    REACT_APP_DEFAULT_PARENT_ID: str()
})