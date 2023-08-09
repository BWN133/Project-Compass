import { User } from "../models/user";
import Auth from "../component/Auth";

const LoginPage = () => {
    
    return (
        <div>
            <Auth onLoginSuccessful={function (user: User): void {
            } } onDismiss={function (): void {
            } } />
        </div>


    )
}

export default LoginPage;