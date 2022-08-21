import { toast } from "react-toastify"
import { POST_SINGLE_IMAGE_TO_STORAGE_BUCKET } from "../config/ScreenRoutes";


// returns the url of the newFile; or throws error
export const handleSingleImageUpload = async (key: string, file: File) => {
    const formData = new FormData()
    formData.append(key, file)
    const response = await fetch(POST_SINGLE_IMAGE_TO_STORAGE_BUCKET, {
        method: 'POST',
        body: formData
    });
    const json = await response.json();
    if (json.error) {
        throw new Error(json.message);
    } else {
        return json.url;
    }
}
