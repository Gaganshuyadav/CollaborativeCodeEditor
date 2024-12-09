import { useEffect, useRef } from "react";
import "./Playgame.css";


export default function PlayGame(){

    const ref = useRef(null);
    const refTop = useRef(null);
    const refRight = useRef(null);
    const refBottom = useRef(null);
    const refLeft = useRef(null);

    useEffect(()=>{

        const resizableEle = ref.current;
        const styles = window.getComputedStyle(resizableEle);
        let width = parseInt(styles.width);
        let height = parseInt(styles.height);
        let x=0;
        let y=0;


        resizableEle.style.top = "50px";
        resizableEle.style.left = "100px";

        
        const onMouseMoveRightResize = (event)=>{
            let dx = event.clientX - x;
            x = event.clientX;
            console.log(event.clientX);
            resizableEle.style.width = `${dx}px`;


        }

        const onMouseUpRightRezise = (event)=>{
            console.log("remove");
            document.removeEventListener("mousemove", onMouseMoveRightResize);
        }

        //Right resize
        const onMouseDownRightResize = ( event)=>{
            // console.log("== ",event.clientX);
            // console.log(resizableEle.style.left);
            // console.log(styles.left);
            // console.log(resizableEle.style.right);
            document.addEventListener("mousemove", onMouseMoveRightResize);
            document.addEventListener("mouseup", onMouseUpRightRezise);
        }

        //Add mouse down event listener
        const resizerRight = refRight.current;
        resizerRight.addEventListener("mousedown", onMouseDownRightResize);
        
        return ()=>{
            resizerRight.removeEventListener("mousedown", onMouseDownRightResize);
        }
    },[])

    return(
        <div className="container-game" >
            <div ref={ref} className="resizable">
                <div ref={refTop} className="resizer resizer-t"></div>
                <div ref={refRight} className="resizer resizer-r"></div>
                <div ref={refBottom} className="resizer resizer-b"></div>
                <div ref={refLeft} className="resizer resizer-l"></div>
            </div>
        </div>
    )
}