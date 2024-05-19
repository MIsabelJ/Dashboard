import { IDomicilio } from "../types/Domicilio/IDomicilio";
import { IDomicilioPost } from "../types/Domicilio/IDomicilioPost";
import { BackendClient } from "./BackendClient";

export class DomicilioService extends BackendClient<IDomicilio, IDomicilioPost> {
}