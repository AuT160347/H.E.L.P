import { Outlet } from "react-router-dom";
import AppFooter from "../components/appFooter";
import AppHeader from "../components/appHeader";

const layout = () => {
    return ( 
        <>
            <AppHeader/>
            <Outlet/>
            <AppFooter/>
        </>
     );
}
 
export default layout;