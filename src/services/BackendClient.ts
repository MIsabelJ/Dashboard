import { AbstractBackendClient } from "./AbstractBackendClient";

export abstract class BackendClient<TG, TP, TE> extends AbstractBackendClient<
  TG,
  TP,
  TE
> {
  constructor(baseUrl: string) {
    super(baseUrl);
  }

  async getAll(): Promise<TG[]> {
    const token = localStorage.getItem("token");
    const response = await fetch(`${this.baseUrl}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return data as TG[];
  }

  async getById(id: number): Promise<TG | null> {
    const token = localStorage.getItem("token");
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    return data as TG;
  }

  async post(data: TP): Promise<TG> {
    const token = localStorage.getItem("token");
    const response = await fetch(`${this.baseUrl}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    const newData = await response.json();
    return newData as TG;
  }

  async put(id: number, data: TE): Promise<TG> {
    const token = localStorage.getItem("token");
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    const newData = await response.json();
    return newData as TG;
  }

  // Método para eliminar un elemento por su ID
  async delete(id: number): Promise<void> {
    const token = localStorage.getItem("token");
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Error al eliminar el elemento con ID ${id}`);
    }
  }
  async postWithData(data: FormData): Promise<TG> {
    const response = await fetch(`${this.baseUrl}`, {
      method: "POST",
      body: data,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const newData = await response.json();
    return newData as TG;
  }

  // // Método para dada de baja lógica de un elemento por su ID
  // async logicDelete(id: number): Promise<TP> {
  //   const element = await this.getById(id);
  //   if (element) {
  //     (element as any).eliminado = !element;
  //     await this.put(id, element);
  //   }
  // }
}
