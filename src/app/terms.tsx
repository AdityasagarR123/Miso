import { LegalScreen } from '@/components/site/LegalScreen';
import { LEGAL_PAGES } from '@/site/content';

export default function TermsScreen() {
  return <LegalScreen page={LEGAL_PAGES.terms} />;
}
