import styles from './PageLayout.module.css'

interface ContainerProps{
    header: string,
    children: React.ReactNode
}


function PageLayout({ header, children }:ContainerProps){
    return(
        <section className={styles.pageContainer}>
            <div className={styles.header}>
                { header }
            </div>
            <div className={styles.mainContent}>
                { children }
            </div>
        </section>
    )
}

export default PageLayout;