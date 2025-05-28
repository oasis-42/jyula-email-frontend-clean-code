// jyula-email-frontend-clean-code/src/models/campaigns.test.ts
import { describe, it, expect } from 'vitest';
import { SendCampaignDTOBuilder, sendCampaignSchema, SendCampaignDTO } from './campaigns'; // Ajuste o caminho

describe('SendCampaignDTOBuilder', () => {
  const baseCampaignName = 'Test Campaign';
  const baseTemplateId = '00000000-0000-0000-0000-000000000000'; // UUID válido

  it('should build a DTO with minimal required fields', () => {
    const dto = new SendCampaignDTOBuilder(baseCampaignName, baseTemplateId)
                    .addContact('11111111-1111-1111-1111-111111111111') // Precisa de pelo menos um contato ou segmento
                    .build();
    expect(dto.campaignName).toBe(baseCampaignName);
    expect(dto.templateId).toBe(baseTemplateId);
    expect(dto.sendTo.contacts).toEqual(['11111111-1111-1111-1111-111111111111']);
    expect(dto.sendTo.segments).toEqual([]);
    expect(dto.schedule).toBeUndefined();
  });

  it('should add contacts correctly', () => {
    const contact1 = '11111111-1111-1111-1111-111111111111';
    const contact2 = '22222222-2222-2222-2222-222222222222';
    const dto = new SendCampaignDTOBuilder(baseCampaignName, baseTemplateId)
      .addContact(contact1)
      .addContact(contact2)
      .build();
    expect(dto.sendTo.contacts).toEqual([contact1, contact2]);
  });
  
  it('should add multiple contacts via addContacts correctly', () => {
    const contactIds = ['11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222'];
    const dto = new SendCampaignDTOBuilder(baseCampaignName, baseTemplateId)
      .addContacts(contactIds)
      .build();
    expect(dto.sendTo.contacts).toEqual(contactIds);
  });


  it('should add segments correctly', () => {
    const segment1 = '33333333-3333-3333-3333-333333333333';
    const segment2 = '44444444-4444-4444-4444-444444444444';
    const dto = new SendCampaignDTOBuilder(baseCampaignName, baseTemplateId)
      .addSegment(segment1)
      .addSegment(segment2)
      .build();
    expect(dto.sendTo.segments).toEqual([segment1, segment2]);
  });

  it('should set schedule correctly with dateTime only', () => {
    const dateTime = new Date().toISOString();
    const dto = new SendCampaignDTOBuilder(baseCampaignName, baseTemplateId)
      .addContact('11111111-1111-1111-1111-111111111111')
      .withSchedule(dateTime)
      .build();
    expect(dto.schedule?.dateTime).toBe(dateTime);
    expect(dto.schedule?.cron).toBeUndefined();
  });

  it('should set schedule correctly with dateTime and cron', () => {
    const dateTime = new Date().toISOString();
    const cron = '0 0 * * *';
    const dto = new SendCampaignDTOBuilder(baseCampaignName, baseTemplateId)
      .addContact('11111111-1111-1111-1111-111111111111')
      .withSchedule(dateTime, cron)
      .build();
    expect(dto.schedule?.dateTime).toBe(dateTime);
    expect(dto.schedule?.cron).toBe(cron);
  });
  
  it('should conform to Zod schema', () => {
    const dateTime = new Date().toISOString();
    const validDto: SendCampaignDTO = {
        campaignName: baseCampaignName,
        templateId: baseTemplateId,
        sendTo: {
            contacts: ['11111111-1111-1111-1111-111111111111'],
            segments: ['33333333-3333-3333-3333-333333333333']
        },
        schedule: {
            dateTime: dateTime,
            cron: '0 0 1 1 *'
        }
    };
    expect(() => sendCampaignSchema.parse(validDto)).not.toThrow();
  });

  it('should throw Zod error if required fields are missing or invalid in build', () => {
     // Missing campaign name
    expect(() => new SendCampaignDTOBuilder(undefined as any, baseTemplateId).build()).toThrow();
    // Invalid templateId
    expect(() => new SendCampaignDTOBuilder(baseCampaignName, "invalid-uuid").addContact('11111111-1111-1111-1111-111111111111').build()).toThrow();
    // No contacts or segments
    expect(() => new SendCampaignDTOBuilder(baseCampaignName, baseTemplateId).build()).toThrow(/At least one contact or segment must be specified/);

  });
});