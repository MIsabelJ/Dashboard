import { IImagenPromocion } from "../types/ImagenPromocion/IImagenPromocion";
import { IImagenPromocionPost } from "../types/ImagenPromocion/IImagenPromocionPost";
import { BackendClient } from "./BackendClient";

export class ImagenPromocionService extends BackendClient<IImagenPromocion, IImagenPromocionPost, IImagenPromocionPost> {

    async getAllById(uuid: string[]): Promise<IImagenPromocion[]> {
        try {
            const queryParams = new URLSearchParams();
            uuid.forEach(id => queryParams.append("uuid", id));  // Asegúrate de que cada UUID se añade como parámetro separado
            const response = await fetch(`${this.baseUrl}/getAllImagesById?${queryParams.toString()}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
    
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
    
            const data = await response.json();
            return data as IImagenPromocion[];
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            throw error;
        }
    }   
}