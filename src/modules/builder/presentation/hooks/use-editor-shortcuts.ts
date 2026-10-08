import { useEffect } from 'react';

import { isEditableTarget } from '../dom/editable-target';
import { editRedone, editUndone, nodeSelected } from '../state/builder-actions';
import { useBuilderDispatch } from '../state/builder-hooks';
import { removeSelectedNode } from '../state/editing-thunks';
import { saveDraft } from '../state/save-thunk';

/**
 * Editor shortcuts. Thunks read the current state themselves, so this
 * listener subscribes once. Save works everywhere; undo, redo, escape and
 * delete never hijack text editing, and delete only acts when nothing
 * else has focus and the session may change the structure.
 */
export function useEditorShortcuts(canEditStructure: boolean): void {
  const dispatch = useBuilderDispatch();

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent): void {
      const hasModifier = event.metaKey || event.ctrlKey;
      const key = event.key.toLowerCase();

      if (hasModifier && key === 's') {
        event.preventDefault();
        void dispatch(saveDraft());
        return;
      }
      if (isEditableTarget(event.target)) {return;}

      if (hasModifier && key === 'z') {
        event.preventDefault();
        dispatch(event.shiftKey ? editRedone() : editUndone());
      } else if (hasModifier && key === 'y') {
        event.preventDefault();
        dispatch(editRedone());
      } else if (event.key === 'Escape') {
        dispatch(nodeSelected(null));
      } else if (
        canEditStructure &&
        (event.key === 'Delete' || event.key === 'Backspace') &&
        event.target === document.body
      ) {
        event.preventDefault();
        dispatch(removeSelectedNode());
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => { window.removeEventListener('keydown', handleKeyDown); };
  }, [dispatch, canEditStructure]);
}
