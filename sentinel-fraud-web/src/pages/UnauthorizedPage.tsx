import {
  ShieldX,
  ArrowLeft,
} from "lucide-react"

import { useNavigate } from "react-router-dom"


export function UnauthorizedPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
      <div className="w-full max-w-lg rounded-xl border border-base-300 bg-base-100 p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-error/10 text-error">
          <ShieldX size={26} />
        </div>

        <h1 className="text-2xl font-bold">
          Access denied
        </h1>

        <p className="mt-2 text-base-content/70">
          Your current role does not have permission to access this area.
        </p>

        <button
          className="btn btn-primary mt-6"
          onClick={() =>
            navigate(
              "/dashboard",
            )
          }
        >
          <ArrowLeft size={16} />
          Back to dashboard
        </button>
      </div>
    </div>
  )
}
