import styles from "./ImagePicker.module.css"

function ImagePicker(){
    const images = [
        {
            url: "https://placehold.co/150"
        },
        {
            url: "https://placehold.co/150"
        },
        {
            url: "https://placehold.co/150"
        },
        {
            url: "https://placehold.co/150"
        },
    ]

    const handleDelete = (index:number)=>{
        console.log("Delete Image:", index);
    };

    const handleView = (index:number)=>{
        console.log("View Image:", index);
    };

    const handleAdd = ()=>{
        console.log("Add Image");
    };

    return (
        <div className={styles.container}>
            {
                images.map((img,index)=>{
                    return <div className={styles.imgContainer} key={index}>
                        <div className={styles.deleteButton} onClick={() => handleDelete(index)}>
                            <i className="fa-solid fa-trash-can"></i>
                        </div>
                        <img src={img.url} className={styles.img} onClick={()=> handleView(index)}/>
                    </div>
                })
            }
            <div className={styles.addButton} onClick={()=> handleAdd()}>
                <i className="fa-solid fa-plus"></i>
            </div>
        </div>
    )
}

export default ImagePicker