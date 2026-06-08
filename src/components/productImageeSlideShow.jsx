import { useState } from "react"

export default function ProductImagesSlideShow(props) {
    const images = props.images
    const [activeImageIndex, setActiveImageIndex] = useState(0)

    return (
        <div className="w-[400px] h-[500px]">
            <img
                src={images[activeImageIndex]}
                className="w-full h-[400px] object-cover rounded-lg shadow-lg"
            />
            <div className="w-full h-[100px] flex gap-2 mt-2">
                {images.map((image, index) => (
                    <img
                        key={index}
                        src={image}
                        className={`w-[80px] h-[80px] object-cover rounded-lg cursor-pointer ${
                            activeImageIndex == index ? "border-4 border-blue-600" : ""
                        }`}
                        onClick={() => setActiveImageIndex(index)}
                    />
                ))}
            </div>
        </div>
    )
}