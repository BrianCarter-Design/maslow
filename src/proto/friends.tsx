import { useState } from 'react'
import type { CSSProperties } from 'react'
import { Link, useNavigate, useParams, Navigate } from 'react-router-dom'
import { useProto } from './store'
import type { InviteMode } from './store'
import { ABOUT_YOU, ACTIVITY, FRIENDS, getFriend, usePendingRequests } from './social'
import type { Activity, Friend, Request } from './social'
import { TESTS, getTest } from './tests'
import type { TestResult } from './tests'
import { Arrow, Blob, CharacterArt, Heading, Scores, Screen, TabBar, TopBar } from './ui'

/* ---------- Shared bits ---------- */

export function FriendAvatar({ friend, size = 44 }: { friend: Friend; size?: number }) {
  return <Blob color={friend.color} shape={friend.shape} size={size} face={Math.round(size * 0.7)} mood={friend.mood} muted={!friend.joined} />
}

const sameResult = (a?: TestResult, b?: TestResult) => Boolean(a && b && a.code === b.code)

const PlusIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
)

/* ---------- Invite sheet (opened from anywhere through the store) ---------- */

export function InviteHost() {
  const { invite, toast } = useProto()
  return (
    <>
      {invite && <InviteSheet />}
      {toast && <div className="sx-toast" role="status">{toast}</div>}
    </>
  )
}

function InviteSheet() {
  const { invite, closeInvite, sendInvite, showToast, results } = useProto()
  const [testId, setTestId] = useState(invite?.testId ?? 'enneagram')
  const [mode, setMode] = useState<InviteMode>(invite?.mode ?? 'self')
  const [picked, setPicked] = useState<string[]>(invite?.friendIds ?? [])
  const test = getTest(testId)!
  const mine = results[testId]

  const alreadyTook = FRIENDS.filter((f) => f.results[testId])
  const aboutCount = new Set(ABOUT_YOU.map((a) => a.friendId)).size
  const message = mode === 'self'
    ? mine
      ? `I just found out I’m ${mine.name} on Maslow 👀 Take the ${test.name} and let’s see how we compare!`
      : `Want to take the ${test.name} with me? It’s 2 minutes and we’ll get a side-by-side comparison.`
    : `Quick favour? Take a 2-minute ${test.name} about me. I’m really curious how you see me 🙈`

  function toggle(id: string) {
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]))
  }
  function send() {
    sendInvite({ testId, mode, friendIds: picked })
    const names = picked.map((id) => getFriend(id)!.first)
    showToast(`Invite sent to ${names.length > 2 ? `${names.slice(0, 2).join(', ')} +${names.length - 2}` : names.join(' & ')} ✨`)
    closeInvite()
  }
  async function shareLink() {
    const url = `${location.origin}/play/test/${testId}${mode === 'about' ? '?for=christopher' : ''}`
    try {
      if (navigator.share) await navigator.share({ title: `Maslow · ${test.name}`, text: message, url })
      else { await navigator.clipboard.writeText(`${message} ${url}`); showToast('Invite link copied') }
    } catch { /* share dismissed */ }
  }

  return (
    <div className="sx-sheet-wrap" onClick={closeInvite}>
      <section className="sx-sheet" role="dialog" aria-label="Invite friends" onClick={(e) => e.stopPropagation()}>
        <span className="sx-grabber" aria-hidden />
        <div className="sx-sheet__crowd" aria-hidden>
          {FRIENDS.slice(0, 4).map((f, i) => <span key={f.id} style={{ '--i': i } as CSSProperties}><FriendAvatar friend={f} size={46} /></span>)}
        </div>
        <h2>{mode === 'self' ? <>Compare <em>{test.name}</em> with friends</> : <>How do your friends <em>see you?</em></>}</h2>
        <p className="sx-sheet__lead">
          {mode === 'self'
            ? 'You’ll both get a side-by-side comparison, and it’s the fastest way to understand each other.'
            : 'You see yourself from the inside. Friends see the rest. Ask someone who knows you well. It only takes them 2 minutes.'}
        </p>

        <div className="sx-seg" role="tablist" aria-label="Who takes it">
          <button role="tab" aria-selected={mode === 'self'} className={mode === 'self' ? 'is-active' : ''} onClick={() => setMode('self')}>For themselves</button>
          <button role="tab" aria-selected={mode === 'about'} className={mode === 'about' ? 'is-active' : ''} onClick={() => setMode('about')}>About me</button>
        </div>

        <div className="sx-tests" aria-label="Assessment">
          {TESTS.map((t) => (
            <button key={t.id} className={t.id === testId ? 'is-active' : ''} style={{ '--blob': t.color } as CSSProperties} onClick={() => setTestId(t.id)}>{t.name}</button>
          ))}
        </div>

        <p className="sx-proof">
          <span className="sx-dot" />
          {mode === 'self'
            ? alreadyTook.length ? `${alreadyTook.map((f) => f.first).slice(0, 2).join(' and ')}${alreadyTook.length > 2 ? ` and ${alreadyTook.length - 2} more` : ''} already took it` : 'Be the first of your friends to take it'
            : `${aboutCount} friends have already shared how they see you`}
        </p>

        <ul className="sx-pick">
          {FRIENDS.map((f) => {
            const on = picked.includes(f.id)
            const theirs = f.results[testId]
            return (
              <li key={f.id}>
                <button className={on ? 'is-on' : ''} onClick={() => toggle(f.id)} aria-pressed={on}>
                  <FriendAvatar friend={f} size={38} />
                  <span className="sx-pick__who">
                    <b>{f.first} {f.last}</b>
                    <small>{!f.joined ? 'Not on Maslow yet' : mode === 'self' && theirs ? `Already took it: ${theirs.code}` : mode === 'self' ? 'Hasn’t taken it yet' : 'Knows you well'}</small>
                  </span>
                  <i className="sx-check" aria-hidden>{on ? '✓' : ''}</i>
                </button>
              </li>
            )
          })}
        </ul>

        <div className="sx-bubble"><small>Your message</small>{message}</div>

        <button className="pf-dark-btn sx-send" disabled={!picked.length} onClick={send}>
          {picked.length ? `Send to ${picked.length} friend${picked.length > 1 ? 's' : ''}` : 'Pick friends to invite'} <Arrow />
        </button>
        <button className="rs-ghost sx-link" onClick={shareLink}>Share invite link</button>
      </section>
    </div>
  )
}

/* ---------- Requests and activity ---------- */

function RequestCard({ req }: { req: Request }) {
  const navigate = useNavigate()
  const { dismissRequest } = useProto()
  const friend = getFriend(req.friendId)!
  const test = getTest(req.testId)!
  const go = () => navigate(`/play/test/${test.id}?req=${req.id}${req.mode === 'about' ? `&for=${friend.id}` : ''}`)
  return (
    <article className="sx-request" style={{ '--blob': test.color } as CSSProperties}>
      <header>
        <FriendAvatar friend={friend} size={44} />
        <p>
          <b>{friend.first}</b> {req.mode === 'about' ? <>wants you to take the <b>{test.name}</b> about them</> : <>invited you to take the <b>{test.name}</b> together</>}
          <small>{req.when} · {test.minutes} min</small>
        </p>
      </header>
      <blockquote>“{req.message}”</blockquote>
      <div className="sx-request__actions">
        <button className="pf-dark-btn" onClick={go}>{req.mode === 'about' ? `Take it for ${friend.first}` : `Take ${test.name}`} <Arrow size={14} /></button>
        <button className="sx-text-btn" onClick={() => dismissRequest(req.id)}>Not now</button>
      </div>
    </article>
  )
}

function ActivityItem({ item }: { item: Activity }) {
  const { social, toggleCheer } = useProto()
  const friend = getFriend(item.friendId)!
  const test = item.testId ? getTest(item.testId) : undefined
  const about = item.kind === 'about-you' ? ABOUT_YOU.find((a) => a.friendId === item.friendId && a.testId === item.testId) : undefined
  const result = about?.result ?? (test ? friend.results[test.id] : undefined)
  const cheered = social.cheers.includes(item.id)
  return (
    <article className={`sx-feed__item ${item.kind === 'about-you' ? 'is-about' : ''}`}>
      <Link to={`/play/friend/${friend.id}`} className="sx-feed__avatar"><FriendAvatar friend={friend} size={40} /></Link>
      <div className="sx-feed__body">
        <p><b>{friend.first}</b> {item.text}</p>
        <small>{item.when}{test ? ` · ${test.name}` : ''}</small>
        {test && result && (
          <Link to={item.to ?? '#'} className="sx-feed__result" style={{ '--blob': test.color } as CSSProperties}>
            <span className="sx-feed__art"><CharacterArt testId={test.id} result={result} color={test.color} size={56} id={`feed-${item.id}`} /></span>
            <span><b>{result.code}</b><small>{result.name}</small></span>
          </Link>
        )}
        <div className="sx-feed__actions">
          <button className={`sx-cheer ${cheered ? 'is-on' : ''}`} onClick={() => toggleCheer(item.id)} aria-pressed={cheered}>👏 {cheered ? 'Cheered' : 'Cheer'}</button>
          {item.cta && item.to && <Link to={item.to} className="sx-text-btn">{item.cta} →</Link>}
        </div>
      </div>
    </article>
  )
}

/* ---------- Friends tab ---------- */

export function FriendsPage() {
  const navigate = useNavigate()
  const { openInvite, social, results } = useProto()
  const pending = usePendingRequests()
  const aboutPeople = [...new Set(ABOUT_YOU.map((a) => a.friendId))]

  return (
    <Screen>
      <TopBar sub="Your circle" title="Friends" right={
        <button className="pf-glass-btn" onClick={() => openInvite()} aria-label="Invite friends"><PlusIcon /></button>
      } />

      <section className="sx-hero">
        <div className="sx-hero__crowd" aria-hidden>
          {FRIENDS.filter((f) => f.joined).map((f, i) => <span key={f.id} style={{ '--i': i } as CSSProperties}><FriendAvatar friend={f} size={52} /></span>)}
        </div>
        <p className="pf-label">{aboutPeople.length} friends have weighed in</p>
        <h1>Friends see the side of you <em>that you can’t.</em></h1>
        <p>Ask the people who know you best to take an assessment about you, then compare it with how you see yourself.</p>
        <button className="pf-dark-btn" onClick={() => openInvite({ mode: 'about', testId: 'enneagram' })}>Ask a friend about me <Arrow size={14} /></button>
      </section>

      {pending.length > 0 && (
        <>
          <Heading title="Waiting on you" aside={`${pending.length} request${pending.length > 1 ? 's' : ''}`} />
          <div className="sx-requests">{pending.map((r) => <RequestCard key={r.id} req={r} />)}</div>
        </>
      )}

      <Heading title="How friends see you" />
      <section className="pf-card sx-about">
        {ABOUT_YOU.map((a) => {
          const friend = getFriend(a.friendId)!
          const test = getTest(a.testId)!
          const mine = results[a.testId]
          return (
            <Link key={a.id} to={`/play/test/${a.testId}/result`} className="sx-about__row">
              <FriendAvatar friend={friend} size={40} />
              <div>
                <b>{friend.first} sees you as {a.result.name.startsWith('Your') ? a.result.code : a.result.name}</b>
                <small>{test.name} · {a.when}</small>
              </div>
              <span className={`sx-tag ${!mine ? 'is-new' : sameResult(mine, a.result) ? 'is-same' : 'is-diff'}`}>
                {!mine ? 'Take it too' : sameResult(mine, a.result) ? 'Agrees' : 'Different'}
              </span>
            </Link>
          )
        })}
      </section>

      <Heading title="Activity" />
      <div className="sx-feed">{ACTIVITY.map((a) => <ActivityItem key={a.id} item={a} />)}</div>

      <Heading title="Your friends" aside={`${FRIENDS.length}`} />
      <div className="pf-threads sx-friends">
        {FRIENDS.map((f) => {
          const top = Object.values(f.results)[0]
          return (
            <Link key={f.id} to={`/play/friend/${f.id}`} className="pf-thread sx-friend" style={{ '--blob': f.color } as CSSProperties}>
              <b>{f.first}</b>
              <small>{f.joined ? (top ? `${top.code} · ${Object.keys(f.results).length} results` : 'No results yet') : 'Invited'}</small>
              <span className="pf-thread__blob"><FriendAvatar friend={f} size={64} /></span>
            </Link>
          )
        })}
        <button className="pf-thread sx-friend sx-friend--add" onClick={() => openInvite()}>
          <b>Invite</b>
          <small>Grow your circle</small>
          <span className="sx-friend__plus" aria-hidden><PlusIcon /></span>
        </button>
      </div>

      {social.sent.length > 0 && (
        <>
          <Heading title="Invites sent" />
          <section className="pf-card sx-sent">
            {social.sent.map((s) => (
              <div key={s.id}>
                <b>{getTest(s.testId)?.name} · {s.mode === 'about' ? 'about you' : 'for themselves'}</b>
                <small>{s.friendIds.map((id) => getFriend(id)?.first).join(', ')} · {s.when} · waiting</small>
              </div>
            ))}
          </section>
        </>
      )}

      <button className="rs-ghost sx-bottom-cta" onClick={() => navigate('/play/tests')}>Find an assessment to share</button>
      <TabBar />
    </Screen>
  )
}

/* ---------- Friend profile ---------- */

export function FriendPage() {
  const { id = '' } = useParams()
  const friend = getFriend(id)
  const { results, social, openInvite } = useProto()
  if (!friend) return <Navigate to="/play/friends" replace />

  const theirTests = TESTS.filter((t) => friend.results[t.id])
  const shared = theirTests.filter((t) => results[t.id])
  const aboutYou = ABOUT_YOU.filter((a) => a.friendId === friend.id)
  const yourTake = TESTS.filter((t) => social.given[`${friend.id}:${t.id}`])
  const lead = theirTests[0]
  const twins = shared.filter((t) => sameResult(results[t.id], friend.results[t.id]))
  const suggest = TESTS.find((t) => results[t.id] && !friend.results[t.id])

  return (
    <Screen>
      <TopBar back sub={friend.joined ? 'Friend' : 'Invited'} title={`${friend.first} ${friend.last}`} />

      <section className="pf-hero">
        <div className="pf-hero__stage sx-friend-stage" style={{ '--blob': friend.color } as CSSProperties}>
          <span className="pf-status"><i />{friend.joined ? `${theirTests.length} results` : 'Hasn’t joined yet'}</span>
          <div className="pf-hero__art">
            {lead ? <CharacterArt testId={lead.id} result={friend.results[lead.id]} color={friend.color} size={190} id={`friend-${friend.id}`} /> : <FriendAvatar friend={friend} size={150} />}
          </div>
          {twins.length > 0 && <span className="pf-chip pf-chip--a">Twins on<br />{twins[0].name}</span>}
        </div>
        <div className="sx-friend-head">
          <div className="ch-tags">{theirTests.map((t) => <span key={t.id}>{friend.results[t.id].code}</span>)}</div>
          {!friend.joined && <p>{friend.first} hasn’t joined Maslow yet. A nudge from you is the #1 reason people sign up.</p>}
        </div>
      </section>

      {shared.length > 0 && (
        <>
          <Heading title={`You vs ${friend.first}`} />
          <section className="pf-card sx-compare">
            {shared.map((t) => {
              const mine = results[t.id]
              const theirs = friend.results[t.id]
              const same = sameResult(mine, theirs)
              return (
                <div key={t.id} className="sx-compare__row">
                  <span className="sx-compare__side"><CharacterArt testId={t.id} result={mine} color={t.color} size={58} id={`cmp-me-${t.id}`} /><b>{mine.code}</b><small>You</small></span>
                  <span className="sx-compare__mid"><small>{t.name}</small><i className={same ? 'is-same' : ''}>{same ? 'Same!' : 'vs'}</i></span>
                  <span className="sx-compare__side"><CharacterArt testId={t.id} result={theirs} color={friend.color} size={58} id={`cmp-them-${friend.id}-${t.id}`} /><b>{theirs.code}</b><small>{friend.first}</small></span>
                </div>
              )
            })}
          </section>
        </>
      )}

      {aboutYou.length > 0 && (
        <>
          <Heading title={`How ${friend.first} sees you`} />
          {aboutYou.map((a) => {
            const t = getTest(a.testId)!
            const mine = results[a.testId]
            return (
              <section key={a.id} className="pf-card sx-seen">
                <header>
                  <span className="sx-seen__art"><CharacterArt testId={t.id} result={a.result} color={t.color} size={72} id={`seen-${a.id}`} /></span>
                  <div>
                    <p className="pf-label">{t.name} · taken for you</p>
                    <b>{a.result.code}</b>
                    <small>{a.result.name}</small>
                  </div>
                </header>
                <blockquote>“{a.note}”</blockquote>
                <p className="sx-seen__vs">
                  {mine ? (sameResult(mine, a.result) ? `You agree: you’re ${mine.name} to both of you.` : `You see yourself as ${mine.code}, ${mine.name}.`) : `You haven’t taken ${t.name} yourself yet.`}
                </p>
              </section>
            )
          })}
        </>
      )}

      {yourTake.length > 0 && (
        <>
          <Heading title={`Your take on ${friend.first}`} />
          <section className="pf-card sx-about">
            {yourTake.map((t) => {
              const r = social.given[`${friend.id}:${t.id}`]
              return (
                <div key={t.id} className="sx-about__row">
                  <span className="sx-mini-art"><CharacterArt testId={t.id} result={r} color={t.color} size={44} id={`take-${friend.id}-${t.id}`} /></span>
                  <div><b>You see {friend.first} as {r.code}</b><small>{t.name} · {r.name}</small></div>
                  <span className={`sx-tag ${friend.results[t.id] ? (sameResult(friend.results[t.id], r) ? 'is-same' : 'is-diff') : 'is-new'}`}>
                    {friend.results[t.id] ? (sameResult(friend.results[t.id], r) ? 'Spot on' : 'Different') : 'Sent'}
                  </span>
                </div>
              )
            })}
          </section>
        </>
      )}

      {theirTests.length > 0 && (
        <>
          <Heading title={`${friend.first}’s results`} />
          <div className="pf-tests">
            {theirTests.map((t) => (
              <section key={t.id} className="pf-card" style={{ '--blob': t.color } as CSSProperties}>
                <div className="pf-card__hero">
                  <p className="pf-card__result">{friend.results[t.id].code}<span>{t.name} · {friend.results[t.id].name}</span></p>
                  <span className="pf-card__art"><CharacterArt testId={t.id} result={friend.results[t.id]} color={t.color} size={80} id={`their-${friend.id}-${t.id}`} /></span>
                </div>
                <Scores scores={friend.results[t.id].scores} />
              </section>
            ))}
          </div>
        </>
      )}

      <div className="rs-actions">
        <button className="pf-dark-btn qz-cta" onClick={() => openInvite({ mode: 'about', friendIds: [friend.id], testId: lead?.id ?? 'enneagram' })}>
          Ask {friend.first} how they see you <Arrow />
        </button>
        {suggest && (
          <button className="rs-ghost" onClick={() => openInvite({ mode: 'self', friendIds: [friend.id], testId: suggest.id })}>
            {friend.joined ? `Invite ${friend.first} to compare ${suggest.name}` : `Resend invite to ${friend.first}`}
          </button>
        )}
      </div>
      <TabBar />
    </Screen>
  )
}

/* ---------- Social sections for your own result page ---------- */

export function ResultSocial({ testId }: { testId: string }) {
  const { results, openInvite } = useProto()
  const test = getTest(testId)!
  const mine = results[testId]
  const about = ABOUT_YOU.filter((a) => a.testId === testId)
  const took = FRIENDS.filter((f) => f.results[testId])
  const twins = took.filter((f) => sameResult(f.results[testId], mine))

  return (
    <>
      <section className="pf-card sx-result">
        <p className="pf-label rs-label">How friends see you</p>
        {about.length === 0 && (
          <div className="sx-empty">
            <Blob color={test.color} size={52} face={36} mood="wow" />
            <p><b>Nobody has taken this for you yet.</b> People who ask a friend learn something new about themselves 8 times out of 10.</p>
          </div>
        )}
        {about.map((a) => {
          const friend = getFriend(a.friendId)!
          const same = sameResult(mine, a.result)
          return (
            <Link key={a.id} to={`/play/friend/${friend.id}`} className="sx-about__row">
              <FriendAvatar friend={friend} size={40} />
              <div>
                <b>{friend.first}: {a.result.code} · {a.result.name.replace('Your love language', '')}</b>
                <small>“{a.note}”</small>
              </div>
              <span className={`sx-tag ${same ? 'is-same' : 'is-diff'}`}>{same ? 'Agrees' : 'Sees you differently'}</span>
            </Link>
          )
        })}
        <button className="rs-ghost sx-inline" onClick={() => openInvite({ mode: 'about', testId })}>
          Ask a friend to take it for me
        </button>
      </section>

      <section className="pf-card sx-result">
        <p className="pf-label rs-label">Friends who took it</p>
        {twins.length > 0 && <p className="sx-twins">🎉 You and {twins.map((f) => f.first).join(' & ')} are both {mine.code}!</p>}
        <div className="sx-took">
          {took.map((f) => (
            <Link key={f.id} to={`/play/friend/${f.id}`}>
              <FriendAvatar friend={f} size={44} />
              <b>{f.first}</b>
              <small>{f.results[testId].code}</small>
            </Link>
          ))}
          <button onClick={() => openInvite({ mode: 'self', testId })}>
            <span className="sx-friend__plus"><PlusIcon /></span>
            <b>Invite</b>
            <small>Compare</small>
          </button>
        </div>
        {took.length === 0 && <p className="sx-twins">None of your friends have taken {test.name} yet. Be the one who starts it.</p>}
      </section>

      <section className="sx-share" style={{ '--blob': test.color } as CSSProperties}>
        <div>
          <b>Share your {mine.code} card</b>
          <span>Friends who see your result are 3× more likely to take it too.</span>
        </div>
        <button className="pf-dark-btn" onClick={() => openInvite({ mode: 'self', testId })}>Share</button>
      </section>
    </>
  )
}

/* ---------- Home: what your friends are up to ---------- */

export function HomeSocial() {
  const navigate = useNavigate()
  const { results } = useProto()
  const pending = usePendingRequests()
  const latest = ABOUT_YOU[0]
  const friend = getFriend(latest.friendId)!
  const test = getTest(latest.testId)!
  const mine = results[latest.testId]

  return (
    <>
      <Heading title="From your friends" aside={<Link to="/play/friends">See all</Link>} />
      <button className="sx-highlight" style={{ '--blob': friend.color } as CSSProperties} onClick={() => navigate(`/play/test/${test.id}/result`)}>
        <div className="sx-highlight__pair" aria-hidden>
          {mine && <span><CharacterArt testId={test.id} result={mine} color={test.color} size={74} id="hl-me" /></span>}
          <span><CharacterArt testId={test.id} result={latest.result} color={friend.color} size={74} id="hl-them" /></span>
        </div>
        <p className="pf-label">{friend.first} took the {test.name} for you</p>
        <b>{friend.first} sees you as {latest.result.name}.</b>
        <span>{mine ? `You see yourself as ${mine.name}. Who’s right?` : 'Take it yourself to compare.'}</span>
        <span className="pf-dark-btn sx-highlight__btn">See both views <Arrow size={14} /></span>
      </button>

      {pending.length > 0 && (
        <Link to="/play/friends" className="sx-waiting">
          <span className="sx-waiting__faces" aria-hidden>
            {pending.map((r) => <span key={r.id}><FriendAvatar friend={getFriend(r.friendId)!} size={34} /></span>)}
          </span>
          <span><b>{pending.length} friend{pending.length > 1 ? 's are' : ' is'} waiting on you</b><small>{pending.map((r) => getFriend(r.friendId)!.first).join(', ')} sent you requests</small></span>
          <Arrow size={14} />
        </Link>
      )}

      <div className="sx-feed">{ACTIVITY.slice(1, 3).map((a) => <ActivityItem key={a.id} item={a} />)}</div>
    </>
  )
}
