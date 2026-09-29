import {
  FormspreeForm,
  type FieldSpec,
  type FormKind,
} from "@/components/forms/FormspreeForm";
import type { Dictionary } from "@/dictionaries";
import { localizedPath, routes, type Locale } from "@/lib/i18n";

/**
 * Server-side wrapper around FormspreeForm: builds the labels from the
 * dictionary and the "origem" value from the page, so each page only declares
 * its fields.
 */
export function SiteForm({
  kind,
  locale,
  page,
  dict,
  fields,
}: {
  kind: FormKind;
  locale: Locale;
  /** Route key of the page hosting the form, e.g. routes.comoFunciona. */
  page: string;
  dict: Dictionary;
  fields: FieldSpec[];
}) {
  return (
    <FormspreeForm
      kind={kind}
      origin={localizedPath(locale, page)}
      privacyHref={localizedPath(locale, routes.privacidade)}
      fields={fields}
      labels={{
        submit: dict.forms.submit[kind],
        sending: dict.forms.submit.sending,
        optional: dict.forms.optional,
        successTitle: dict.forms.success.title,
        successBody: dict.forms.success[kind],
        errorTitle: dict.forms.error.title,
        errorBody: dict.forms.error.body,
        notConfigured: dict.forms.notConfigured,
        consent: dict.forms.consent,
        consentLink: dict.forms.consentLink,
        validation: dict.forms.validation,
      }}
    />
  );
}
