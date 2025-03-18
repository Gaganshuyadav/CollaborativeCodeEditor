import ErrorIcon from "@mui/icons-material/Error";
import { Typography} from "@mui/material";
import { Link} from "react-router-dom";
import "./NotFound.css";

export default function NotFound(){
    return(
        <div className="notfound">
        <ErrorIcon/>
        <Typography>Page Not Found</Typography>
        <Link to="/">Home</Link>
        </div>
    )
};