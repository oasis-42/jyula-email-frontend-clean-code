import { z } from "zod";

const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export const sendCampaignSchema = z.object({
  campaignName: z.string().min(1, "Campaign name is required"),
  templateId: z.string().uuid("Invalid template ID"),
  sendTo: z.object({
    contacts: z.array(z.string().uuid()).optional().default([]),
    segments: z.array(z.string().uuid()).optional().default([])
  }).refine(data => (data.contacts?.length || 0) > 0 || (data.segments?.length || 0) > 0, {
    message: "At least one contact or segment must be specified.",
    path: ["sendTo"],
  }),
  schedule: z.optional(z.object({
    dateTime: z.string().datetime("Invalid schedule date/time"),
    cron: z.string().optional() // Cron é opcional dentro do agendamento
  }))
});

export type SendCampaignDTO = z.infer<typeof sendCampaignSchema>;

export async function sendCampaign(dto: SendCampaignDTO): Promise<void> {
  sendCampaignSchema.parse(dto); // Validação do DTO

  const response = await fetch(`${baseUrl}/api/v1/campaigns/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(dto)
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Unauthorized: Please check your login credentials.");
    }
    const errorBody = await response.json().catch(() => ({ message: "Failed to send campaign. Please try again." }));
    throw new Error(errorBody.message || `API Error: ${response.status} - ${response.statusText}`);
  }
  // Não é esperado um corpo JSON na resposta de sucesso para esta operação
}

// Fluent Interface: Builder para SendCampaignDTO
export class SendCampaignDTOBuilder {
  private readonly _dto: Partial<SendCampaignDTO> = {
    sendTo: { contacts: [], segments: [] }
  };

  constructor(campaignName: string, templateId: string) {
    if (!campaignName) throw new Error("Campaign name is required for builder initialization.");
    if (!templateId) throw new Error("Template ID is required for builder initialization.");
    this._dto.campaignName = campaignName;
    this._dto.templateId = templateId;
  }

  withCampaignName(name: string): this {
    this._dto.campaignName = name;
    return this;
  }

  withTemplateId(id: string): this {
    this._dto.templateId = id;
    return this;
  }

  addContact(contactId: string): this {
    this._dto.sendTo = this._dto.sendTo || { contacts: [], segments: [] };
    this._dto.sendTo.contacts = this._dto.sendTo.contacts || [];
    if (!this._dto.sendTo.contacts.includes(contactId)) {
      this._dto.sendTo.contacts.push(contactId);
    }
    return this;
  }
  
  addContacts(contactIds: string[]): this {
    contactIds.forEach(id => this.addContact(id));
    return this;
  }

  addSegment(segmentId: string): this {
    this._dto.sendTo = this._dto.sendTo || { contacts: [], segments: [] };
    this._dto.sendTo.segments = this._dto.sendTo.segments || [];
    if (!this._dto.sendTo.segments.includes(segmentId)) {
      this._dto.sendTo.segments.push(segmentId);
    }
    return this;
  }

  addSegments(segmentIds: string[]): this {
    segmentIds.forEach(id => this.addSegment(id));
    return this;
  }

  withSchedule(dateTime: string, cron?: string): this {
    this._dto.schedule = { dateTime };
    if (cron) {
      this._dto.schedule.cron = cron;
    }
    return this;
  }

  build(): SendCampaignDTO {
    return sendCampaignSchema.parse(this._dto);
  }
}