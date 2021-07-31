import React,{ useState,useEffect }from 'react'
import {useWindowScroll} from "react-use";
const ScrollToTop = () => {
    const { y: pageYOffset } = useWindowScroll();
    const [visible, setVisibility] =  useState(false);
    useEffect(() => {
        if(pageYOffset > 100){
            setVisibility(true);
        }
        else{
           setVisibility(false);
        }
    }, [pageYOffset]);
    const scrollToTop = () => {
        window.scrollTo({top:0, behavior:"smooth" })
    }
    if(!visible){
        return false;
    }

    return (
        <div className="scroll-to-top cursor-pointer text-center" onClick={scrollToTop}>
        <span className="fas fa-chevron-up icon"></span>
        </div>
    )
}

export default ScrollToTop;