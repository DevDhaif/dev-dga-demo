import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@dev-dga/react';
import type { Service } from '@/data/types';
import { tField, useLang } from '@/i18n';

export function ServiceFaq({ service }: { service: Service }) {
  const lang = useLang();

  return (
    <Accordion type="single" collapsible data-testid="service-faq">
      {service.faq.map((item, i) => (
        <AccordionItem key={i} value={`faq-${i}`}>
          <AccordionTrigger>{tField(item.q, lang)}</AccordionTrigger>
          <AccordionContent>{tField(item.a, lang)}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
