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
