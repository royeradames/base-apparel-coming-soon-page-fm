# Base Apparel coming soon page

An implementation of the [Frontend Mentor Base Apparel coming soon page challenge](https://www.frontendmentor.io/challenges/base-apparel-coming-soon-page-5d46b47f8db8a7063f9331a0), using its supplied logo, hero crops, icons, background pattern, copy and design references.

The email form is an honest demo. TanStack Form handles the field and Zod validates it: an empty field and a badly formatted address each show the design's error state. A valid address gets a visible confirmation that nothing was saved or sent, and the page always says "Demo only: nothing is sent." There is no account, mailing list or network write.

## Development

Node 22.13 or later. Use `npm ci`, `npm run dev`, `npm run lint`, `npm run build`, `npm run typecheck` and `npm test`. Browser tests use installed Chrome and own port 4515.

Next 16.3.6, React 19.2.8, TypeScript 5.9.3, Tailwind 4.2.1, TanStack Form 1.33.5 and Zod 4.4.3 are pinned to the family baseline. Only the form is a client component.

## Sources

Original challenge files are preserved under `reference/`; supplied images moved byte-for-byte to `public/images/`. Josefin Sans 300/400/600 is served through `next/font`.

## Implementation choices

- Where the Figma frames and the supplied JPGs disagree, the decoded Figma wins: 375×250 mobile hero and 311×48 field, 768×400 tablet hero with a centred 445px column, and the 610px full-height hero beside the copy on desktop (from 1024px).
- The design's 13px error text is raised to the family 16px floor. The field keeps a visually hidden "Email address" label because the placeholder disappears while typing.
- Errors appear on submit, then update as the visitor corrects the field. Invalid submits move focus back to the field. The submit button is never disabled; `aria-busy` follows TanStack's submitting state.
- One site name, "Base Apparel coming soon page", appears in the footer, `og:site_name` and `WebSite` JSON-LD. The canonical URL is the planned `base-apparel-coming-soon-page-fm.royeradames.com` production domain, which isn't attached yet.
