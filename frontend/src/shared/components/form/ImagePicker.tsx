import styles from "./ImagePicker.module.css"
import { useRef, useEffect } from "react";

export interface Image{
    id: string,
    url: string,
    file?: File
};

interface Props{
    images: Image[],
    setImages: React.Dispatch<React.SetStateAction<Image[]>>
    readonly?: boolean 
}

function ImagePicker({ images, setImages, readonly }:Props){
    useEffect(()=>{
        // TODO: Api call here
        console.log("ImagePicker is running!");
    }, []);

    const fileInput = useRef<HTMLInputElement | null>(null);

    const handleDelete = (id:string)=>{
        console.log("Delete Image:", id);
        setImages((prev)=>{
            return prev.filter(img => img.id !== id)
        });
    };

    const handleView = (id:string)=>{
        console.log("View Image:", id);
    };

    const handleAdd = ()=>{
        console.log("Add Image");
        fileInput.current?.click();
    };

    const handleUpload = (event:React.ChangeEvent<HTMLInputElement>)=>{
        const files = event.target.files
        if(!files) return;

        const newFiles:Image[] = Array.from(files).map((file:File)=>{
            const newFile: Image = {
                id: crypto.randomUUID(),
                url: URL.createObjectURL(file),
                file: file
            }

            return newFile
        });

        setImages([...images, ...newFiles]);
    };

    const noImagesSelected = images.length === 0 && !readonly;

    return (
        <div className={styles.container}>
            {
                images.map((img,index)=>{
                    return <div className={styles.imgContainer} key={index}>
                        <div className={styles.deleteButton} onClick={() => handleDelete(img.id)}>
                            <i className="fa-solid fa-trash-can"></i>
                        </div>
                        <img src={img.url} className={styles.img} onClick={()=> handleView(img.id)}/>
                    </div>
                })
            }
            {
                !noImagesSelected && <div>No images</div>
            }
            {
                !readonly && (
                    <div className={styles.addButton} onClick={()=> handleAdd()}>
                        <input ref={fileInput} type="file" style={{display:'none'}} onChange={handleUpload} multiple/>
                        <i className="fa-solid fa-plus"></i>
                    </div>
                )
            }
        </div>
    )
}

export default ImagePicker