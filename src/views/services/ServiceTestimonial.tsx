import { Quote } from '@dev-dga/react';
import { tField, useLang, useT, type Bilingual } from '@/i18n';

const TESTIMONIAL: Record<'text' | 'author' | 'byline', Bilingual> = {
  text: {
    en: 'I submitted the application online in the evening and had the permit on my phone within days , no office visit, no paper.',
    ar: 'قدّمت الطلب إلكترونيًا في المساء واستلمت التصريح على جوالي خلال أيام ، دون زيارة مكتب أو أوراق.',
  },
  author: { en: 'Abdullah Al-Qahtani', ar: 'عبدالله القحطاني' },
  byline: { en: 'Business owner, Riyadh', ar: 'صاحب منشأة، الرياض' },
};

export function ServiceTestimonial() {
  const t = useT();
  const lang = useLang();

  return (
    <section className="flex flex-col gap-3" data-testid="service-testimonial">
      <h2 className="m-0">{t('service.testimonial')}</h2>
      <Quote
        variant="testimonial"
        author={tField(TESTIMONIAL.author, lang)}
        byline={tField(TESTIMONIAL.byline, lang)}
      >
        {tField(TESTIMONIAL.text, lang)}
      </Quote>
    </section>
  );
}
