import { AbstractBackendClient } from "./AbstractBackendClient";
export abstract class BackendClient<TG, TP, TE> extends AbstractBackendClient<
  TG,
  TP,
  TE
> {
  constructor(baseUrl: string, token: string) {
    super(baseUrl, token);
  }

  async getAll(): Promise<TG[]> {
    const response = await fetch(`${this.baseUrl}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
    const data = await response.json();
    return data as TG[];
  }

  async getById(id: number): Promise<TG | null> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    return data as TG;
  }

  async post(data: TP): Promise<TG> {
    const response = await fetch(`${this.baseUrl}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify(data),
    });
    const newData = await response.json();
    return newData as TG;
  }

  async put(id: number, data: TE): Promise<TG> {
    console.log(this.baseUrl);
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        // "Access-Control-Allow-Origin": "no-cors",
        Authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify(data),
    });
    const newData = await response.json();
    return newData as TG;
  }

  // Método para eliminar un elemento por su ID
  async delete(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${this.token}`,
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
        Authorization: `Bearer ${this.token}`,
      },
    });
    const newData = await response.json();
    return newData as TG;
  }
}
