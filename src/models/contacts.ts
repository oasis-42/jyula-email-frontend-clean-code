import { z } from "zod";
import { getPaginatedSchema } from "./pagination/paginationSchemas";

const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export const contactSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
});

export type Contact = z.infer<typeof contactSchema>;

const paginatedContacts = getPaginatedSchema(contactSchema);
type PaginatedContacts = z.infer<typeof paginatedContacts>;

export async function getAllContacts(filter: string = "", page: number = 1, size: number = 10): Promise<PaginatedContacts> {
  const response = await fetch(`${baseUrl}/api/v1/contacts?filter=${filter}&page=${page}&size=${size}`);
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ message: `Failed to fetch contacts. Status: ${response.status}` }));
    throw new Error(errorBody.message || `API Error: ${response.status}`);
  }
  return response.json();
}

export const createOrUpdateContactSchema = contactSchema.omit({ id: true });

export type CreateContactDTO = z.infer<typeof createOrUpdateContactSchema>;
export type UpdateContactDTO = z.infer<typeof createOrUpdateContactSchema>;

export async function createContact(dto: CreateContactDTO): Promise<Contact> {
  createOrUpdateContactSchema.parse(dto);

  const response = await fetch(`${baseUrl}/api/v1/contacts`, {
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
    const errorBody = await response.json().catch(() => ({ message: `Failed to create contact. Status: ${response.status}` }));
    throw new Error(errorBody.message || `API Error: ${response.status}`);
  }

  const content: unknown = await response.json();
  return contactSchema.parse(content);
}

export async function deleteContact(id: string): Promise<void> {
  z.string().uuid("Invalid ID format for delete").parse(id);

  const response = await fetch(`${baseUrl}/api/v1/contacts/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Unauthorized: Please check your credentials.");
    }
    // O método DELETE pode retornar 204 No Content (sem corpo JSON) em caso de sucesso.
    if (response.status !== 204) {
        const errorBody = await response.json().catch(() => ({ message: `Failed to delete contact. Status: ${response.status}` }));
        throw new Error(errorBody.message || `API Error: ${response.status}`);
    }
  }
  // Nenhum conteúdo é retornado em um DELETE bem-sucedido (geralmente status 204).
}

export async function getContactById(id: string): Promise<Contact> {
  z.string().uuid("Invalid ID format for getContactById").parse(id);

  const response = await fetch(`${baseUrl}/api/v1/contacts/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Unauthorized: Please check your credentials.");
    }
    const errorBody = await response.json().catch(() => ({ message: `Failed to get contact by ID. Status: ${response.status}` }));
    throw new Error(errorBody.message || `API Error: ${response.status}`);
  }

  const content: unknown = await response.json();
  return contactSchema.parse(content);
}

export async function updateContact(id: string, dto: UpdateContactDTO): Promise<Contact> {
  z.string().uuid("Invalid ID format for update").parse(id);
  createOrUpdateContactSchema.parse(dto);

  const response = await fetch(`${baseUrl}/api/v1/contacts/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(dto)
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Unauthorized: Please check your credentials.");
    }
    const errorBody = await response.json().catch(() => ({ message: `Failed to update contact. Status: ${response.status}` }));
    throw new Error(errorBody.message || `API Error: ${response.status}`);
  }

  const content: unknown = await response.json();
  return contactSchema.parse(content);
}