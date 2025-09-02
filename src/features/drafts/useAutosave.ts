import { useEffect, useRef } from 'react'
import debounce from 'lodash.debounce'
import { useDispatch } from 'react-redux'
import type { AppDispatch } from '@/app/store'
import { markSaved } from './draftsSlice'
import type { ServiceDraft } from '@/types'
import { validateDraft } from '@/lib/validation'

// Lightweight autosave that just flips "saving" -> "saved" after debounce.
// In a real app, you'd POST to a backend here.
export function useAutosave(draft: ServiceDraft | null) {
  const dispatch = useDispatch<AppDispatch>()
  const validateAndSave = useRef(
    debounce((d: ServiceDraft) => {
      validateDraft(d)
      dispatch(markSaved({ id: d.id }))
    }, 500)
  ).current

  useEffect(() => {
    if (!draft) return
    if (draft.savingStatus === 'saving') {
      validateAndSave(draft)
    }
  }, [draft?.updatedAt])
}
