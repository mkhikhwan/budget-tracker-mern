import styles from "./ImagePicker.module.css"
import { useRef, useEffect, useState } from "react";
import { type Image } from "../Transactions.types";
import ImageViewer from "./ImageViewer";

interface Props{
    images: Image[],
    setImages: React.Dispatch<React.SetStateAction<Image[]>>
    readonly?: boolean 
}

function ImagePicker({ images, setImages, readonly }:Props){
    const [isViewingImage, setIsViewingImage] = useState<Boolean>(false);
    const [selectedImage, setSelectedImage] = useState<Image>({ id: "", url: "" });

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

        const selectedImage = images.find(img => img.id === id);
        if(selectedImage){
            setSelectedImage(selectedImage);
            setIsViewingImage(true);
        }else{
            alert("There's something wrong when viewing this image.");
        }
    };

    const handleViewImageClose = ()=>{
        setIsViewingImage(false);
        setSelectedImage({ id: "", url: "" });
    }

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

    return (
        <div className={styles.container}>
            {
                images.length > 0 ? images.map((img,index)=>{
                    return <div className={styles.imgContainer} key={index}>
                        <div className={styles.deleteButton} onClick={() => handleDelete(img.id)}>
                            <i className="fa-solid fa-trash-can"></i>
                        </div>
                        <img src={"http://localhost:5000" + img.url} className={styles.img} onClick={()=> handleView(img.id)}/>
                    </div>
                }) : <div>No images</div>
            }
            {
                !readonly && (
                    <div className={styles.addButton} onClick={()=> handleAdd()}>
                        <input ref={fileInput} type="file" style={{display:'none'}} onChange={handleUpload} multiple/>
                        <i className="fa-solid fa-plus"></i>
                    </div>
                )
            }
            {
                isViewingImage && <ImageViewer image={selectedImage} onClose={handleViewImageClose}/>
            }
        </div>
    )
}

export default ImagePicker