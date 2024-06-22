import Navbar from "./pages/Navbar";
import {Route, Routes} from "react-router";
import LandingPage from "./pages/LandingPage";
import NotFound from "./pages/NotFound";
import ElementPage from "./pages/ElementPage";
import ProfilePage from "./pages/ProfilePage";
import {SigningCosmWasmProvider} from "./wallet/hooks";

export default function App() {
    return (
        <SigningCosmWasmProvider>
            <Navbar/>
            <Routes>
                <Route path="/" exact element={<LandingPage/>} key="1"/>
                <Route path="/profile" exact element={<ProfilePage/>} key="2"/>
                <Route path="/name/:currentName" exact element={<ElementPage/>} key="4"/>
                <Route path="*" element={<NotFound/>} key="3"/>
            </Routes>
        </SigningCosmWasmProvider>
    );
};
