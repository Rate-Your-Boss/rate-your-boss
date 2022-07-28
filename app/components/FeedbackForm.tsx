import type { Review } from "@prisma/client"
import { z } from "zod"

let QUESTIONS = {
  q1: "My manager assigns stretch opportunities to help me develop in my career.",
  q2: "My manager communicates clear goals for our team.",
  q3: "My manager gives me actionable feedback on a regular basis.",
  q4: 'My manager provides the autonomy I need to do my job (i.e., does not "micro-manage" by getting involved in details that should be handled at other levels).',
  q5: "My manager consistently shows consideration for me as a person.",
  q6: "My manager keeps the team focused on priorities, even when it's difficult (e.g., declining or deprioritizing other projects).",
  q7: "My manager regularly shares relevant information from their manager and senior leadership.",
  q8: "My manager has had a meaningful discussion with me about my career development in the past six months.",
  q9: "My manager has the technical expertise (e.g., technical judgment in Tech, selling in Sales, accounting in Finance) required to effectively manage me.",
  q10: "The actions of my manager show they value the perspective I bring to the team, even if it is different from their own.",
  q11: "My manager makes tough decisions effectively (e.g., decisions involving multiple teams, competing priorities).",
  q12: "My manager effectively collaborates across boundaries (e.g., team, organizational).",
  rating: "I would recommend my managers to others.",
  comment: "Why?",
}

let OPTIONS = [
  "Strongly disagree",
  "Disagree",
  "Neutral",
  "Agree",
  "Strongly agree",
]

interface Props {
  readOnly?: boolean
  initialValues?: Review
}

export default function FeedbackForm({ readOnly, initialValues }: Props) {
  return (
    <div className="space-y-2 divide-y mb-8">
      {Object.entries(QUESTIONS).map(([key, question]) => {
        let initialValue = initialValues?.[key as keyof typeof QUESTIONS]
        return (
          <section key={key}>
            <p>{question}</p>
            {key === "comment" ? (
              <textarea
                name={key}
                disabled={readOnly}
                defaultValue={initialValue}
                required
                rows={3}
                minLength={3}
                maxLength={280}
                className="px-4 py-2 block w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0"
              />
            ) : (
              <fieldset>
                {OPTIONS.map((option, i) => (
                  <label
                    key={option}
                    className="px-4 py-2 flex items-center text-sm font-medium text-gray-700"
                  >
                    <input
                      name={key}
                      value={i + 1}
                      type="radio"
                      disabled={readOnly}
                      defaultChecked={initialValue === i + 1}
                      required
                      className="h-4 w-4 mr-2 text-slate-700 focus:ring-1 focus:ring-offset-2 focus:ring-gray-500"
                    />
                    {option}
                  </label>
                ))}
              </fieldset>
            )}
          </section>
        )
      })}
    </div>
  )
}

let oneToFive = z.enum(["1", "2", "3", "4", "5"]).transform(Number)

export let FeedbackSchema = z.object({
  q1: oneToFive,
  q2: oneToFive,
  q3: oneToFive,
  q4: oneToFive,
  q5: oneToFive,
  q6: oneToFive,
  q7: oneToFive,
  q8: oneToFive,
  q9: oneToFive,
  q10: oneToFive,
  q11: oneToFive,
  q12: oneToFive,
  rating: oneToFive,
  comment: z.string().min(3).max(280),
})
