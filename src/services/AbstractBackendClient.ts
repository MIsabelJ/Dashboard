// Clase abstracta que define métodos para operaciones CRUD en un servicio genérico
export abstract class AbstractBackendClient<TG, TP> {
    protected baseUrl: string;
    constructor(baseUrl: string) {
      this.baseUrl = baseUrl;
    }
  
    abstract getAll(): Promise<TG[]>;
  
    abstract getById(id: number): Promise<TG | null>;
  
    abstract post(data: TP): Promise<TP>;
    abstract put(id: number, data: TP): Promise<TP>;
  
    // Método abstracto para eliminar un elemento por su ID
    abstract delete(id: number): Promise<void>;

}