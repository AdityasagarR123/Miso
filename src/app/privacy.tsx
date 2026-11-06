import { LegalScreen } from '@/components/site/LegalScreen';
import { LEGAL_PAGES } from '@/site/content';

export default function PrivacyScreen() {
  return <LegalScreen page={LEGAL_PAGES.privacy} />;
}
