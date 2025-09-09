import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";

function ActionButton({ label, onClick, variant = "primary" }) {
    return (
        <Button
            variant={variant}
            onClick={onClick}
            className="me-2 mb-2"
        >
            {label}
        </Button>
    )
}

export default ActionButton;

// Plain Version

// function ActionButton({ name, onClick }) {
//     return (
//         <button
//             onClick={onClick}
//             style={{
//                 marginRight: "10px",
//                 padding: "8px 16px",
//                 fontSize: "14px",
//                 borderRadius: "6px",
//                 border: "1px solid #ccc",
//                 cursor: "pointer",
//                 backgroundColor: "#eee"
//             }}
//         >
//             {name}
//         </button>
//     );
// }
