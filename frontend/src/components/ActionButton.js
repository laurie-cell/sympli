function ActionButton({ label, onClick, variant = "primary" }) {
    const getButtonClass = () => {
        switch (variant) {
            case "secondary":
                return "medical-btn medical-btn-secondary";
            case "success":
                return "medical-btn medical-btn-success";
            case "warning":
                return "medical-btn medical-btn-warning";
            default:
                return "medical-btn";
        }
    };

    return (
        <button
            className={getButtonClass()}
            onClick={onClick}
        >
            {label}
        </button>
    )
}

export default ActionButton;
