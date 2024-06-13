import { extractPublicId } from "cloudinary-build-url";
import { IImagen } from "../types/Imagen/IImagen";
import { IImagenPost } from "../types/Imagen/IImagenPost";
import { BackendClient } from "./BackendClient";

export class ImagenService extends BackendClient<
  IImagen,
  IImagenPost,
  IImagenPost
> {
  async upload(data: File[]): Promise<IImagen[]> {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    Array.from(data).forEach((file) => {
      formData.append("uploads", file);
    });
    try {
      const response = await fetch(`${this.baseUrl}/uploads`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const responseData = await response.json();
        const images: IImagen[] = responseData.body.map((item: any) => ({
          id: item.id,
          name: item.name,
          url: item.url,
        }));
        return images;
      } else {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      throw error;
    }
  }
  async getAllById(uuid: string[]): Promise<IImagen[]> {
    try {
      const token = localStorage.getItem("token");
      const queryParams = new URLSearchParams();
      uuid.forEach((id) => queryParams.append("uuid", id)); // Asegúrate de que cada UUID se añade como parámetro separado
      const response = await fetch(
        `${this.baseUrl}/getAllImagesById?${queryParams.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const data = await response.json();
      return data as IImagen[];
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      throw error;
    }
  }
  async deleteImg(uuid: string, url: string): Promise<void> {
    try {
      const token = localStorage.getItem("token");
      const publicId = extractPublicId(url);
      const formData = new FormData();
      formData.append("publicId", publicId);
      formData.append("uuid", uuid);

      const response = await fetch(`${this.baseUrl}/deleteImg`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      throw error;
    }
  }
}
