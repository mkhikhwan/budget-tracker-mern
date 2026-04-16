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
    const [selectedImage, setSelectedImage] = useState<Image>({ _id: "", url: "", isFromDb: false });

    useEffect(()=>{
        // TODO: Api call here
        console.log("ImagePicker is running!");
    }, []);

    const fileInput = useRef<HTMLInputElement | null>(null);

    const handleDelete = (id:string | undefined)=>{
        if(!id) return

        console.log("Delete Image:", id);
        const newArr:Image[] = images
            .filter(img => !(img._id === id && !img.isFromDb)) //delete out local image
            .map((img:Image) => { //delete db image
                return img._id === id ? { ...img, isDeleted: true } : img
            });

        setImages(newArr);
    };

    const handleView = (id:string | undefined)=>{
        if(!id) return

        console.log("View Image:", id);

        const selectedImage = images.find(img => img._id === id);
        if(selectedImage){
            setSelectedImage(selectedImage);
            setIsViewingImage(true);
        }else{
            alert("There's something wrong when viewing this image.");
        }
    };

    const handleViewImageClose = ()=>{
        setIsViewingImage(false);
        setSelectedImage({ _id: "", url: "", isFromDb: false });
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
                _id: crypto.randomUUID(),
                url: URL.createObjectURL(file),
                isFromDb: false,
                file: file
            }

            return newFile
        });

        setImages([...images, ...newFiles]);
    };

    return (
        <div className={styles.container}>
            {
                images.map((img)=>{
                    return !img.isDeleted && (
                        <div className={styles.imgContainer} key={img._id}>
                            {!readonly && (<div className={styles.deleteButton} onClick={() => handleDelete(img._id)}>
                                <i className="fa-solid fa-trash-can"></i>
                            </div>)}
                            <img src={img.url} className={styles.img} onClick={()=> handleView(img._id)}/>
                        </div>
                    )
                })
            }
            {
                readonly && images.length === 0 && <div className={styles.noImages}>No Images selected.</div>
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