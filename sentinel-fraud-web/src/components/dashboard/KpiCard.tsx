import type { LucideIcon } from "lucide-react"

import { motion } from "framer-motion"


interface KpiCardProps {
  title: string

  value: string | number

  helper?: string

  icon: LucideIcon

  tone?:
    | "default"
    | "success"
    | "warning"
    | "error"
}


const toneClasses = {
  default:
    "text-primary",

  success:
    "text-success",

  warning:
    "text-warning",

  error:
    "text-error",
}


export function KpiCard({
  title,
  value,
  helper,
  icon: Icon,
  tone = "default",
}: KpiCardProps) {
  return (
    <motion.div
      layout
      initial={{
        opacity: 0,
        y: 12,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.25,
      }}
      whileHover={{
        y: -4,
      }}
      className="card border border-base-300 bg-base-100 shadow-sm transition-all"
    >
      <div className="card-body">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-base-content/60">
              {title}
            </p>

            <motion.h2
              key={String(value)}
              initial={{
                scale: 1.08,
                opacity: 0.7,
              }}
              animate={{
                scale: 1,
                opacity: 1,
              }}
              transition={{
                duration: 0.25,
              }}
              className="mt-2 text-3xl font-bold"
            >
              {value}
            </motion.h2>

            {helper ? (
              <p className="mt-2 text-sm text-base-content/60">
                {helper}
              </p>
            ) : null}
          </div>

          <div
            className={`rounded-2xl bg-base-200 p-3 ${toneClasses[tone]}`}
          >
            <Icon size={24} />
          </div>
        </div>
      </div>
    </motion.div>
  )
}