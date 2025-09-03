import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/app/store";
import { createDraft } from "@/features/drafts/draftsSlice";

export default function EmptyDraft() {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div className="flex flex-col items-center justify-center text-center text-gray-600 py-10">
      <div className="text-5xl mb-2" aria-hidden>
        🧾
      </div>
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-100">
        Start a new draft
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-300 mt-1 mb-2">
        Create a service log draft to begin filling out the form.
      </p>

      <button className="btn" onClick={() => dispatch(createDraft())}>
        Create Draft
      </button>
    </div>
  );
}
