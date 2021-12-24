const MenuBarButton = ({ id, label, onClick, className }) => {
    return (
        <button
            id={id}
            onClick={onClick}
            className={className}
            type="button"
        >
            {label}
        </button>
    );
}

export default MenuBarButton;