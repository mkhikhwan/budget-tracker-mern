import styles from "./Button.module.css"

const buttonStyle = {
    primary: styles.primary,
    secondary: styles.secondary,
    warning: styles.warning,
    danger: styles.danger
} as const;

type ButtonType = keyof typeof buttonStyle;

interface Props{
    type: ButtonType,
    children: React.ReactNode,
    style?: React.CSSProperties,
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
}

function Button({ type, children, style, onClick }:Props){
    const buttonSelected = buttonStyle[type];

    return (
        <button className={`${styles.button} ${buttonSelected}`} style={ style } onClick={onClick}>
            { children }
        </button>
    )
}

export default Button