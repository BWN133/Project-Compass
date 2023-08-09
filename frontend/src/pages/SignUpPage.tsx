import { AiOutlineAlignLeft } from "react-icons/ai";
// import NavBarLoggedInView from "../component/NavBarLoggedInView";
// import NavBarLoggedOutView from "../component/NavBarLoggedOutView";
import { User } from "../models/user"; 
import SignUpModal2 from '../component/SignUpModal';

const SignUpPage = () => {
    
    return (
        <div>
            <SignUpModal2 onSignUpSuccessful={function (user: User): void {
            } }        
          />
        </div>


    )
}

export default SignUpPage;