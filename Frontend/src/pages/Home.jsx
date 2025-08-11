import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
function Home(){
    const Navigate = useNavigate()
    useEffect(()=>{
        Navigate('/login');
    },[])
    return ;
}
export default Home;