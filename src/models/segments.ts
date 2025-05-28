import { z } from "zod";
import { getPaginatedSchema } from "./pagination/paginationSchemas";
import { contactSchema } from "./contacts";

const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export const segmentSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Segment name is required"),
  // O campo 'contacts' neste schema representa a lista de objetos Contact completos
  // como esperado após buscar um segmento. Para criação/atualização,
  // um DTO pode usar uma lista de contactIds.
  contacts: z.array(contactSchema).optional().default([])
});

export type Segment = z.infer<typeof segmentSchema>;

const paginatedSegmentsSchema = getPaginatedSchema(segmentSchema);
type PaginatedSegments = z.infer<typeof paginatedSegmentsSchema>;

export async function getAllSegments(filter: string = "", page: number = 1, size: number = 10): Promise<PaginatedSegments> {
  const response = await fetch(`${baseUrl}/api/v1/segments?filter=${filter}&page=${page}&size=${size}`);
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ message: `Failed to fetch segments. Status: ${response.status}` }));
    throw new Error(errorBody.message || `API Error: ${response.status} - ${response.statusText}`);
  }
  const data: unknown = await response.json();
  return paginatedSegmentsSchema.parse(data);
}

// DTO para criação de um novo segmento.
// Pode incluir 'contactIds' se a API esperar uma lista de IDs para associar contatos.
export const createSegmentDTOSchema = segmentSchema.omit({ id: true, contacts: true }) // Omitir 'contacts' se for tratado por 'contactIds'
  .extend({
    contactIds: z.array(z.string().uuid()).optional().default([])
  });
export type CreateSegmentDTO = z.infer<typeof createSegmentDTOSchema>;

export async function createSegment(dto: CreateSegmentDTO): Promise<Segment> {
  const validatedDto = createSegmentDTOSchema.parse(dto);

  // Adapte o payload conforme a API espera.
  // Exemplo: se a API espera um campo 'contacts' com os IDs:
  const payload = {
    name: validatedDto.name,
    // Se a API espera um campo 'contacts' com os IDs:
    // contacts: validatedDto.contactIds,
    // Ou se a API espera um campo 'contact_ids' separado:
    contact_ids: validatedDto.contactIds, // Ajuste este nome de campo conforme sua API
  };

  const response = await fetch(`${baseUrl}/api/v1/segments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload) // Envia o payload adaptado
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Unauthorized: Please check your credentials.");
    }
    const errorBody = await response.json().catch(() => ({ message: `Failed to create segment. Status: ${response.status}` }));
    throw new Error(errorBody.message || `API Error: ${response.status} - ${response.statusText}`);
  }
  
  const content: unknown = await response.json();
  return segmentSchema.parse(content);
}

// TODO: Implementar outras funções CRUD para segmentos (getSegmentById, updateSegment, deleteSegment)
// conforme a necessidade da aplicação, seguindo padrões similares de validação e tratamento de erro.