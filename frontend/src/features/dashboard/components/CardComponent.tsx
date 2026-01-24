import styles from "./CardComponent.module.css"

interface Props{
    title: string,
    children: React.ReactNode
}

function CardComponent({ title, children }:Props){
    return (
        <div className={`${styles.card}`}>
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