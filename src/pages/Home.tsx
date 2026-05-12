import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { ASSESSMENTS } from '../data/assessments'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <Navbar />

      {/* Hero */}
      <div className="max-w-[1280px] mx-auto px-10 pt-20 pb-16 text-center">
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6"
          style={{ background: 'rgba(93,0,150,0.1)', color: '#5d0096' }}
        >
          <span>◈</span>
          <span>Personality Assessments</span>
        </div>
        <h1 className="text-[56px] font-bold text-[#111928] leading-tight tracking-tight mb-6 max-w-3xl mx-auto">
          Understand yourself on a deeper level
        </h1>
        <p className="text-[#6b7280] text-xl max-w-2xl mx-auto leading-relaxed">
          Take science-backed personality assessments and get detailed, personalized insights about who you are, how you
          relate to others, and what drives you.
        </p>
      </div>

      {/* Assessment Cards */}
      <div className="max-w-[1280px] mx-auto px-10 pb-24">
        <h2 className="text-2xl font-bold text-[#535353] mb-8">Choose an assessment</h2>
        <div className="grid grid-cols-3 gap-6">
          {ASSESSMENTS.map((a) => (
            <div
              key={a.id}
              className="bg-white rounded-[30px] overflow-hidden shadow-sm flex flex-col"
            >
              {/* Card header gradient */}
              <div
                className="h-36 flex items-center justify-center"
                style={{ background: a.gradient }}
              >
                <span className="text-6xl text-white opacity-70">{a.icon}</span>
              </div>

              {/* Card body */}
              <div className="p-8 flex flex-col flex-1 gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-bold text-[#111928]">{a.name}</h3>
                    {!a.available && (
                      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-[#f3f4f6] text-[#6b7280]">
                        Coming Soon
                      </span>
                    )}
                  </div>
                  <p className="font-semibold text-[#535353] mb-3">{a.tagline}</p>
                  <p className="text-[#6b7280] text-sm leading-relaxed">{a.description}</p>
                </div>

                <div className="flex items-center gap-6 text-sm text-[#6b7280] mt-auto pt-4 border-t border-[#f3f4f6]">
                  <span>📋 {a.questionCount} questions</span>
                  <span>⏱ {a.duration}</span>
                </div>

                {a.available ? (
                  <Link
                    to={`/assessment/${a.id}`}
                    className="mt-2 w-full py-3 rounded-full font-bold text-white text-center transition-opacity hover:opacity-90"
                    style={{ background: a.gradient }}
                  >
                    Take Test
                  </Link>
                ) : (
                  <button
                    disabled
                    className="mt-2 w-full py-3 rounded-full font-bold text-[#9ca3af] bg-[#f3f4f6] cursor-not-allowed"
                  >
                    Coming Soon
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Why section */}
      <div style={{ background: 'linear-gradient(135deg, #47077b 0%, #8a1fde 100%)' }} className="py-20">
        <div className="max-w-[1280px] mx-auto px-10 text-center">
          <h2 className="text-4xl font-bold text-white mb-6 tracking-tight">Why personality assessments?</h2>
          <p className="text-purple-200 text-lg max-w-2xl mx-auto mb-12 leading-relaxed">
            Understanding your personality helps you make better decisions, build stronger relationships, and live a
            more intentional life.
          </p>
          <div className="grid grid-cols-3 gap-8">
            {[
              { icon: '🧠', title: 'Self-awareness', desc: 'Understand your core motivations, fears, and desires at a deeper level.' },
              { icon: '🤝', title: 'Better relationships', desc: 'Learn how you relate to others and how to communicate more effectively.' },
              { icon: '🚀', title: 'Personal growth', desc: 'Identify growth opportunities and patterns that may be holding you back.' },
            ].map((item) => (
              <div key={item.title} className="bg-white bg-opacity-10 rounded-3xl p-8 text-left">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-purple-200 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
