import { createContext, useContext } from 'react';

/**
 * Click-to-edit on the page itself. The editor wraps the main resume in this
 * context; thumbnails, the print copy and shared views don't, so there `Editable`
 * renders plain text with no extra behaviour.
 *
 * Context value: { commit(path, value) }
 */
export const EditContext = createContext(null);
export const useEdit = () => useContext(EditContext);
