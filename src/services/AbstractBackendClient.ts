// Clase abstracta que define métodos para operaciones CRUD en un servicio genérico
export abstract class AbstractBackendClient<TG, TP, TE> {
  protected baseUrl: string;
  protected token: string;
  constructor(baseUrl: string, token: string) {
    this.baseUrl = baseUrl;
    this.token = token;
  }

  abstract getAll(): Promise<TG[]>;

  abstract getById(id: number): Promise<TG | null>;

  abstract post(data: TP): Promise<TG>;
  abstract put(id: number, data: TE): Promise<TG>;

  // Método abstracto para eliminar un elemento por su ID
  abstract delete(id: number): Promise<void>;
}
