import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ENNEAGRAM_QUESTIONS, calculateScores } from '../data/enneagramQuestions'

const LABELS = ['Not like me', 'Slightly like me', 'Mostly like me', 'Very much like me']

export default function Assessment() {
  const navigate = useNavigate()
  const [step, setStep] = useState<'intro' | 'quiz' | 'name'>('intro')
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [selected, setSelected] = useState<number | null>(null)
  const [name, setName] = useState('')

  const questions = ENNEAGRAM_QUESTIONS
  const total = questions.length
  const q = questions[current]
  const progress = Math.round((current / total) * 100)

  function handleAnswer(value: number) {
    setSelected(value)
  }

  function handleNext() {
    if (selected === null) return
    const newAnswers = { ...answers, [q.id]: selected }
    setAnswers(newAnswers)
    setSelected(null)

    if (current + 1 < total) {
      setCurrent(current + 1)
    } else {
      setStep('name')
    }
  }

  function handleFinish() {
    const finalName = name.trim() || 'You'
    const scores = calculateScores(answers)
    navigate('/results/enneagram', { state: { scores, name: finalName } })
  }

  if (step === 'intro') {
    return (
      <div className="min-h-screen bg-[#f7f7f7] flex flex-col items-center justify-center px-6">
        <div className="bg-white rounded-[30px] shadow-sm p-14 max-w-2xl w-full text-center">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-8"
            style={{ background: 'linear-gradient(135deg, #47077b 0%, #8a1fde 100%)' }}
          >
            ◈
          </div>
          <h1 className="text-4xl font-bold text-[#111928] mb-4 tracking-tight">Enneagram Assessment</h1>
          <p className="text-[#6b7280] text-lg leading-relaxed mb-8">
            You'll see <strong className="text-[#535353]">27 statements</strong>. Rate each one from{' '}
            <em>"Not like me"</em> to <em>"Very much like me"</em>. Answer honestly — there are no right or wrong
            answers. This takes about <strong className="text-[#535353]">5–7 minutes</strong>.
          </p>
          <div className="flex flex-col gap-3 text-left bg-[#f7f7f7] rounded-2xl p-6 mb-8">
            {[
              'Answer based on how you typically are, not how you wish you were',
              'Don\'t overthink — go with your first instinct',
              'There are no "good" or "bad" personality types',
            ].map((tip) => (
              <div key={tip} className="flex items-start gap-3 text-[#6b7280]">
                <span className="text-[#5d0096] mt-0.5">✓</span>
                <span>{tip}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => setStep('quiz')}
            className="w-full py-4 rounded-full font-bold text-white text-lg transition-opacity hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #47077b 0%, #8a1fde 100%)' }}
          >
            Start Assessment
          </button>
        </div>
      </div>
    )
  }

  if (step === 'name') {
    return (
      <div className="min-h-screen bg-[#f7f7f7] flex flex-col items-center justify-center px-6">
        <div className="bg-white rounded-[30px] shadow-sm p-14 max-w-2xl w-full text-center">
          <div className="text-5xl mb-6">🎉</div>
          <h1 className="text-3xl font-bold text-[#111928] mb-3 tracking-tight">Assessment complete!</h1>
          <p className="text-[#6b7280] text-lg mb-8">
            Enter your first name to personalize your results.
          </p>
          <input
            type="text"
            placeholder="Your first name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleFinish()}
            className="w-full border-2 border-[#e5e7eb] rounded-2xl px-6 py-4 text-lg text-[#111928] focus:outline-none focus:border-[#5d0096] mb-6 transition-colors"
          />
          <button
            onClick={handleFinish}
            className="w-full py-4 rounded-full font-bold text-white text-lg transition-opacity hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #47077b 0%, #8a1fde 100%)' }}
          >
            See My Results →
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f7f7f7] flex flex-col">
      {/* Progress bar */}
      <div className="bg-white border-b border-[#f3f4f6] px-10 py-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-[#5d0096]">Enneagram Assessment</span>
            <span className="text-sm text-[#6b7280]">
              {current + 1} / {total}
            </span>
          </div>
          <div className="h-2 bg-[#f3f4f6] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #47077b 0%, #8a1fde 100%)',
              }}
            />
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="bg-white rounded-[30px] shadow-sm p-12 max-w-2xl w-full">
          <p className="text-xs font-bold tracking-widest text-[#5d0096] uppercase mb-6">
            Statement {current + 1} of {total}
          </p>
          <h2 className="text-2xl font-semibold text-[#111928] leading-snug mb-10">{q.text}</h2>

          <div className="flex flex-col gap-3">
            {LABELS.map((label, i) => {
              const val = i + 1
              const isSelected = selected === val
              return (
                <button
                  key={val}
                  onClick={() => handleAnswer(val)}
                  className={`flex items-center gap-4 w-full p-4 rounded-2xl border-2 text-left font-medium transition-all ${
                    isSelected
                      ? 'border-[#5d0096] text-[#5d0096]'
                      : 'border-[#e5e7eb] text-[#535353] hover:border-[#d8b4fe]'
                  }`}
                  style={isSelected ? { background: 'rgba(93,0,150,0.06)' } : {}}
                >
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                      isSelected ? 'border-[#5d0096]' : 'border-[#d1d5db]'
                    }`}
                  >
                    {isSelected && (
                      <div className="w-3 h-3 rounded-full" style={{ background: '#5d0096' }} />
                    )}
                  </div>
                  <span>{label}</span>
                </button>
              )
            })}
          </div>

          <div className="flex items-center justify-between mt-8">
            <button
              onClick={() => {
                if (current > 0) {
                  setCurrent(current - 1)
                  setSelected(answers[questions[current - 1].id] ?? null)
                }
              }}
              className="text-[#6b7280] font-medium hover:text-[#535353] transition-colors disabled:opacity-30"
              disabled={current === 0}
            >
              ← Back
            </button>
            <button
              onClick={handleNext}
              disabled={selected === null}
              className="px-10 py-3 rounded-full font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg, #47077b 0%, #8a1fde 100%)' }}
            >
              {current + 1 === total ? 'Finish' : 'Next →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
