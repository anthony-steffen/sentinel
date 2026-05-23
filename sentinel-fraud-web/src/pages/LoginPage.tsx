import { ThemeToggle } from "../components/theme-toggle"


export function LoginPage() {
  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center relative px-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="card w-full max-w-sm bg-base-100 shadow-2xl p-2">
        <div className="card-body gap-2">
          <div className="text-center mb-4">
            <h1 className="text-4xl font-bold">
              Sentinel Fraud
            </h1>

            <p className="text-base-content/70 mt-2">
              Anti-Fraud Intelligence Platform
            </p>
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">
                Email
              </span>
            </label>

            <input
              type="email"
              placeholder="admin@sentinel.com"
              className="input input-bordered w-full"
            />
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">
                Password
              </span>
            </label>

            <input
              type="password"
              placeholder="********"
              className="input input-bordered w-full"
            />
          </div>

          <button className="btn btn-primary mt-6">
            Sign In
          </button>
        </div>
      </div>
    </div>
  )
}