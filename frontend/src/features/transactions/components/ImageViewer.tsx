import styles from "./ImageViewer.module.css"
import { type Image } from "../Transactions.types"
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

interface Props{
    image: Image;
    onClose: ()=>void;
}

function ImageViewer({image, onClose}:Props){
    return (
        <div className={styles.container}>
            <div className={styles.background}></div>
            <div className={styles.closeButton} onClick={onClose}>
                &times;
            </div>
            <div className={styles.imgContainer}>
                <TransformWrapper
                    initialScale={0.9}
                    minScale={0.5}
                    maxScale={5}
                    wheel={{ step: 0.1 }}
                    doubleClick={{ disabled: false }}
                >
                    <TransformComponent
                        wrapperStyle={{
                            width: "100%",
                            height: "100%"
                        }}
                        contentStyle={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                    >
                        <img
                            className={styles.img}
                            src={"http://localhost:5000" + image.url}
                            alt="zoomable"
                            style={{ width: "100%", height: "auto", userSelect: "none" }}
                        />
                    </TransformComponent>
                </TransformWrapper>
            </div>
        </div>
    )
}

export default ImageViewer