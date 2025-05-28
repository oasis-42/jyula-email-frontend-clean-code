import { z } from "zod";
import { getPaginatedSchema } from "./pagination/paginationSchemas";

const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export const templateSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Template name is required"),
  about: z.string().min(1, "Description (about) is required"),
  isFavorite: z.boolean().default(false),
  version: z.string() // Assumindo que version é uma string, pode ser um número ou hash
});

export type Template = z.infer<typeof templateSchema>;

const paginatedTemplatesSchema = getPaginatedSchema(templateSchema);
type PaginatedTemplates = z.infer<typeof paginatedTemplatesSchema>;

export async function getAllTemplates(filter: string = "", page: number = 1, size: number = 10): Promise<PaginatedTemplates> {
  const response = await fetch(`${baseUrl}/api/v1/templates?filter=${filter}&page=${page}&size=${size}`);
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ message: `Failed to fetch templates. Status: ${response.status}` }));
    throw new Error(errorBody.message || `API Error: ${response.status} - ${response.statusText}`);
  }
  const data: unknown = await response.json();
  return paginatedTemplatesSchema.parse(data); // Valida a estrutura da paginação e dos templates
}

// Para a criação de templates, um DTO específico pode ser necessário
// dependendo dos campos que a API espera.
// Por exemplo, a API pode esperar `content` e `subject` além dos campos do templateSchema.
export const createTemplateDTOSchema = z.object({
    name: z.string().min(1, "Template name is required"),
    about: z.string().min(1, "Description (about) is required"),
    subject: z.string().min(1, "Template subject is required"),
    content: z.string().min(1, "Template HTML content is required"),
    // isFavorite pode ser definido no backend ou por outra rota
});
export type CreateTemplateDTO = z.infer<typeof createTemplateDTOSchema>;

export async function createTemplate(dto: CreateTemplateDTO): Promise<Template> {
  createTemplateDTOSchema.parse(dto);

  const response = await fetch(`${baseUrl}/api/v1/templates`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(dto)
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Unauthorized: Please check your credentials.");
    }
    const errorBody = await response.json().catch(() => ({ message: `Failed to create template. Status: ${response.status}` }));
    throw new Error(errorBody.message || `API Error: ${response.status} - ${response.statusText}`);
  }
  
  const newTemplate: unknown = await response.json();
  return templateSchema.parse(newTemplate); // Valida o template retornado
}

// Outras funções CRUD (getById, update, delete) podem ser adicionadas aqui,
