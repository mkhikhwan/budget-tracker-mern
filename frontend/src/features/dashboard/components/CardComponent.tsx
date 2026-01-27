import styles from "./CardComponent.module.css"

interface Props{
    title: string,
    children: React.ReactNode,
    className: string
}

function CardComponent({ title, children, className }:Props){
    return (
        <div className={`${styles.card} ${className}`}>
            <div className={styles.cardTitle}>
                { title }
            </div>
            <div className={styles.cardData}>
                { children }
            </div>
        </div> 
    )
}

export default CardComponent