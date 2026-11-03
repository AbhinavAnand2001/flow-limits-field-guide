import { useState, type CSSProperties, type KeyboardEvent } from 'react'
import './App.css'

type ProfileKey = 'low' | 'medium' | 'high' | 'extended'
type FlowKey = 'automated' | 'scheduled' | 'instant'

const profiles: Record<ProfileKey, { label: string; requests: number; loopItems: number; description: string }> = {
  low: {
    label: 'Low',
    requests: 10_000,
    loopItems: 5_000,
    description: 'Free, Microsoft 365, Power Apps Plan 1, Power Automate Plan 1, trials, and more.',
  },
  medium: {
    label: 'Medium',
    requests: 200_000,
    loopItems: 100_000,
    description: 'Power Automate Premium, Power Apps triggered flows, Dynamics 365 plans, and more.',
  },
  high: {
    label: 'High',
    requests: 500_000,
    loopItems: 100_000,
    description: 'Power Automate Process or per-flow plan.',
  },
  extended: {
    label: 'Unlimited Extended',
    requests: 10_000_000,
    loopItems: 100_000,
    description: 'Pay-as-you-go flows and eligible Dynamics in-context flows.',
  },
}

const flowTypes: Record<FlowKey, { title: string; description: string }> = {
  automated: {
    title: 'Event-triggered flow',
    description: 'Starts automatically when something happens, such as a new item arriving. Most limits below apply across cloud flow types.',
  },
  scheduled: {
    title: 'Scheduled flow',
    description: 'Runs on a recurrence you define. The minimum recurrence is 60 seconds and the maximum is 500 days; other cloud-flow limits are shared.',
  },
  instant: {
    title: 'Manually triggered flow',
    description: 'Runs when a person starts it, for example from a button or Power Apps. Manual flows are associated with the Medium profile in Microsoft’s performance-profile table.',
  },
}

const formatNumber = (value: number) => new Intl.NumberFormat('en-US').format(value)

const formatCompact = (value: number) => {
  if (value >= 1_000_000) {
    return `${Number((value / 1_000_000).toFixed(value % 1_000_000 === 0 ? 0 : 1))}M`
  }
  if (value >= 1_000) {
    return `${Number((value / 1_000).toFixed(value % 1_000 === 0 ? 0 : 1))}K`
  }
  return formatNumber(value)
}

function App() {
  const [flow, setFlow] = useState<FlowKey>('automated')
  const [profileKey, setProfileKey] = useState<ProfileKey>('medium')
  const [runs, setRuns] = useState(1_000)
  const [actions, setActions] = useState(8)
  const [concurrencyEnabled, setConcurrencyEnabled] = useState(false)
  const [degree, setDegree] = useState(25)
  const [items, setItems] = useState(2_500)

  const profile = profiles[profileKey]
  const totalActions = runs * actions
  const ratio = totalActions / profile.requests
  const usagePercent = Math.round(ratio * 100)
  const loopIsOver = items > profile.loopItems
  const loopIsNear = !loopIsOver && items >= profile.loopItems * 0.8
  const flowDetails = flowTypes[flow]

  const selectFlow = (nextFlow: FlowKey) => {
    setFlow(nextFlow)
  }

  const handleFlowKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
    event.preventDefault()
    const order: FlowKey[] = ['automated', 'scheduled', 'instant']
    const direction = event.key === 'ArrowRight' ? 1 : -1
    const nextIndex = (order.indexOf(flow) + direction + order.length) % order.length
    setFlow(order[nextIndex])
    document.getElementById(`tab-${order[nextIndex]}`)?.focus()
  }

  const usageState = ratio > 1 ? 'is-over' : ratio >= 0.8 ? 'is-warning' : ''
  const usageStatus = ratio > 1
    ? 'Above the approximate daily limit'
    : ratio >= 0.8
      ? 'Approaching the approximate limit'
      : 'Within the selected profile'

  return (
    <>
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">↗</span>
          <span>Flow limits</span>
          <span className="brand-divider" aria-hidden="true" />
          <span className="brand-sub">Power Automate field guide</span>
        </div>
        <div className="topbar-right"><span className="live-dot" aria-hidden="true" /><span>Interactive demo</span></div>
      </header>

      <main>
        <section className="hero" aria-labelledby="page-title">
          <div>
            <div className="eyebrow"><span className="eyebrow-line" aria-hidden="true" />A practical overview</div>
            <h1 id="page-title">Know the limits.<br />Design with confidence.</h1>
            <p className="hero-copy">A hands-on guide to the limits that shape automated, scheduled, and instant cloud flows. Adjust the scenario to see how license profile, workload, concurrency, and loop size fit together.</p>
          </div>
          <span className="demo-badge">Based on Microsoft Learn</span>
        </section>

        <div className="flow-tabs" role="tablist" aria-label="Flow trigger type">
          {(Object.keys(flowTypes) as FlowKey[]).map((key) => (
            <button
              className="flow-tab"
              id={`tab-${key}`}
              key={key}
              type="button"
              role="tab"
              aria-selected={flow === key}
              aria-controls="flow-description"
              tabIndex={flow === key ? 0 : -1}
              onClick={() => selectFlow(key)}
              onKeyDown={handleFlowKeyDown}
            >
              <span className="tab-icon" aria-hidden="true">{key === 'automated' ? '↻' : key === 'scheduled' ? '◷' : '⌁'}</span>
              {key === 'instant' ? 'Instant' : key[0].toUpperCase() + key.slice(1)}
            </button>
          ))}
        </div>

        <section className="panel scenario-panel" aria-label="Flow workload simulator">
          <div className="scenario-main">
            <h2 className="section-title"><span className="section-icon" aria-hidden="true">✳</span>{flowDetails.title}</h2>
            <p className="panel-intro" id="flow-description" role="tabpanel" aria-labelledby={`tab-${flow}`}>{flowDetails.description}</p>

            <label className="field-heading" htmlFor="profile">Performance profile <span className="field-hint">Determined by your license</span></label>
            <div className="select-wrap">
              <select id="profile" value={profileKey} onChange={(event) => setProfileKey(event.target.value as ProfileKey)}>
                <option value="low">Low · Free, Microsoft 365, and more</option>
                <option value="medium">Medium · Power Automate Premium, and more</option>
                <option value="high">High · Power Automate Process</option>
                <option value="extended">Unlimited Extended · Pay-as-you-go</option>
              </select>
              <span className="select-chevron" aria-hidden="true">⌄</span>
            </div>
            <p className="profile-copy"><strong>{profile.label}:</strong> {formatNumber(profile.requests)} approximate Power Platform requests per 24 hours.</p>

            <div className="range-block">
              <label className="field-heading" htmlFor="runs"><span>Runs per day</span><span className="range-number">{formatNumber(runs)}</span></label>
              <input id="runs" type="range" min="10" max="5000" step="10" value={runs} style={{ '--progress': `${((runs - 10) / 4990) * 100}%` } as CSSProperties} onChange={(event) => setRuns(Number(event.target.value))} />
              <div className="range-labels"><span>10 runs</span><span>5,000 runs</span></div>
            </div>
            <div className="range-block">
              <label className="field-heading" htmlFor="actions"><span>Actions per run</span><span className="range-number">{formatNumber(actions)}</span></label>
              <input id="actions" type="range" min="1" max="500" step="1" value={actions} style={{ '--progress': `${((actions - 1) / 499) * 100}%` } as CSSProperties} onChange={(event) => setActions(Number(event.target.value))} />
              <div className="range-labels"><span>1 action</span><span>500 actions · flow definition max</span></div>
            </div>

            <div className="profile-title">
              <span className="profile-name"><span className="profile-dot" aria-hidden="true" />Daily request estimate</span>
              <span className="profile-limit">of {formatCompact(profile.requests)} / day</span>
            </div>
            <div className="meter" role="progressbar" aria-label="Daily request estimate compared with approximate profile limit" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.min(usagePercent, 100)} aria-valuetext={`${usagePercent}% of approximate profile limit`}>
              <div className={`meter-fill ${usageState}`} style={{ width: `${ratio > 0 ? Math.max(Math.min(usagePercent, 100), 1.5) : 0}%` }} />
            </div>
            <div className="usage-line">
              <span>{ratio > 1 ? 'This estimate exceeds the selected profile’s approximate allowance.' : ratio >= 0.8 ? 'This estimate is close to the selected profile’s approximate allowance.' : 'Requests are estimated as runs × actions.'}</span>
              <strong>{usagePercent}% of profile limit</strong>
            </div>
          </div>

          <aside className="scenario-result" aria-live="polite">
            <div>
              <div className="result-kicker">Estimated daily actions</div>
              <div className="result-number">{formatCompact(totalActions)}</div>
              <div className="result-unit">actions across your flow runs</div>
              <div className={`status-pill ${usageState}`}><span aria-hidden="true">●</span>{usageStatus}</div>
            </div>
            <div>
              <div className="result-divider" />
              <div className="result-caption">At {formatNumber(actions)} actions per run, {formatNumber(runs)} runs use about {usagePercent}% of the selected profile’s daily request allowance.</div>
            </div>
          </aside>
        </section>

        <section className="metrics-grid" aria-label="Core flow limits">
          <Metric label="Actions per workflow" value="500" foot="per flow definition" hint="Maximum actions in a single flow definition" />
          <Metric label="Maximum run duration" value="30 days" foot="pending steps time out" hint="Includes pending steps such as approvals" />
          <Metric label="Run history retention" value="30 days" foot="calculated from run start" hint="Calculated from the run's start time" />
          <Metric label="Maximum nesting" value="8 levels" foot="child flows can help split logic" hint="Use child flows for deeper workflows" />
          <Metric label="Requests per 5 minutes" value="100,000" foot="per cloud flow version" hint="Transition-period limit described by Microsoft Learn" />
          <Metric label="Concurrent outbound calls" value={profileKey === 'low' ? '500' : '2,500'} foot="changes with performance profile" hint="Low profile: 500; all other profiles: 2,500" />
        </section>

        <section aria-labelledby="controls-title">
          <div className="section-heading-row">
            <div>
              <h2 id="controls-title">Concurrency &amp; data limits</h2>
              <p className="section-subtitle">A few settings can change throughput in useful—and sometimes surprising—ways.</p>
            </div>
            <LearnLink />
          </div>
          <div className="controls-grid">
            <article className="limit-card">
              <div className="limit-title">
                <div><h3>Trigger concurrency control</h3><p>Controls how many flow runs can be active at once.</p></div>
                <span className="limit-icon" aria-hidden="true">⇄</span>
              </div>
              <div className="toggle-line">
                <div>
                  <div className="toggle-label" id="concurrency-label">Concurrency control is {concurrencyEnabled ? 'on' : 'off'}</div>
                  <div className="toggle-description" id="concurrency-description">{concurrencyEnabled ? 'Runs are capped; excess trigger events can queue.' : 'Unlimited concurrent runs; waiting-run limit does not apply.'}</div>
                </div>
                <button type="button" className="toggle" role="switch" aria-checked={concurrencyEnabled} aria-labelledby="concurrency-label" aria-describedby="concurrency-description" onClick={() => setConcurrencyEnabled((enabled) => !enabled)} />
              </div>
              {concurrencyEnabled && (
                <div className="concurrency-setting">
                  <div className="range-block">
                    <label className="field-heading" htmlFor="degree"><span>Degree of parallelism</span><span className="range-number">{degree}</span></label>
                    <input id="degree" type="range" min="1" max="100" step="1" value={degree} style={{ '--progress': `${((degree - 1) / 99) * 100}%` } as CSSProperties} onChange={(event) => setDegree(Number(event.target.value))} />
                    <div className="range-labels"><span>1 run at a time</span><span>100 runs at a time</span></div>
                  </div>
                  <div className="mini-stats">
                    <MiniStat label="Concurrent runs" value={`${degree} max`} />
                    <MiniStat label="Waiting runs" value={`${degree + 10} max`} />
                  </div>
                </div>
              )}
            </article>

            <article className="limit-card">
              <div className="limit-title">
                <div><h3>Loop &amp; recurrence limits</h3><p>{profile.label} profile supports up to {formatNumber(profile.loopItems)} items per “Apply to each”.</p></div>
                <span className="limit-icon" aria-hidden="true">⟳</span>
              </div>
              <div className="loop-field">
                <label className="field-heading" htmlFor="items"><span>Items in an “Apply to each”</span><span className="loop-value"><strong>{formatNumber(items)}</strong> items</span></label>
                <input id="items" type="range" min="0" max="110000" step="100" value={items} style={{ '--progress': `${(items / 110000) * 100}%` } as CSSProperties} onChange={(event) => setItems(Number(event.target.value))} />
                <div className="range-labels"><span>0 items</span><span>{formatNumber(profile.loopItems)} max</span></div>
                <p className={`loop-feedback ${loopIsOver ? 'is-over' : loopIsNear ? 'is-warning' : ''}`} aria-live="polite">
                  {loopIsOver
                    ? `Over the ${formatNumber(profile.loopItems)}-item limit for the ${profile.label} profile. Filter the array or use another approach.`
                    : loopIsNear
                      ? `Close to the ${formatNumber(profile.loopItems)}-item limit for the ${profile.label} profile.`
                      : `Within the ${formatNumber(profile.loopItems)}-item limit for the ${profile.label} profile.`}
                </p>
              </div>
              <div className="mini-stats">
                <MiniStat label="Loop parallelism" value="1 default · 50 max" />
                <MiniStat label="Until iterations" value="60 default · 5,000 max" />
                <MiniStat label="Paginated items" value={`${formatNumber(profile.loopItems)} max`} />
                <MiniStat label="Split on items" value={`${formatNumber(concurrencyEnabled ? 100 : profile.loopItems)} max`} />
              </div>
              {flow === 'scheduled' && <div className="mini-stat recurrence-stat"><span>Scheduled recurrence</span><strong>1 min – 500 days</strong></div>}
            </article>
          </div>
          <div className="note"><span className="note-icon" aria-hidden="true">!</span><span>These are platform-level limits, not performance guarantees. Actions include successful and failed actions, retries, pagination, and built-in steps; individual connectors can impose tighter limits. Daily request figures are approximate transition-period limits, so check current licensing and usage before sizing production workloads.</span></div>
        </section>

        <section className="guardrails" aria-labelledby="guardrails-title">
          <div className="section-heading-row">
            <div>
              <h2 id="guardrails-title">Keep your flows healthy</h2>
              <p className="section-subtitle">Operational limits can affect a flow even when its design is within bounds.</p>
            </div>
          </div>
          <div className="guardrail-grid">
            <Guardrail symbol="14" title="Repeated errors or throttling">Consistent failures or throttling can turn off a cloud flow after 14 days. Monitor run history and notifications.</Guardrail>
            <Guardrail symbol="90" title="Trigger inactivity">Flows without trigger activity for 90 days might be turned off. Premium or assigned-capacity flows are exempt from this inactivity suspension.</Guardrail>
            <Guardrail symbol="↗" title="Split large workloads">Use child flows to keep action counts manageable. For very large arrays, filter or query data before looping.</Guardrail>
          </div>
        </section>

        <footer className="footer-note">
          <span>For demonstration and planning only. Actual entitlements depend on your license, flow owner, connector, and current Microsoft terms.</span>
          <span>Source: <LearnLink compact /></span>
        </footer>
      </main>
    </>
  )
}

function Metric({ label, value, foot, hint }: { label: string; value: string; foot: string; hint: string }) {
  return (
    <article className="metric-card">
      <div className="metric-label">{label}<span className="metric-hint" title={hint}>i</span></div>
      <div className="metric-value">{value}</div>
      <div className="metric-foot">{foot}</div>
    </article>
  )
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return <div className="mini-stat"><span>{label}</span><strong>{value}</strong></div>
}

function Guardrail({ symbol, title, children }: { symbol: string; title: string; children: string }) {
  return (
    <article className="guardrail-card">
      <span className="guardrail-symbol" aria-hidden="true">{symbol}</span>
      <div><h3>{title}</h3><p>{children}</p></div>
    </article>
  )
}

function LearnLink({ compact = false }: { compact?: boolean }) {
  return (
    <a className={compact ? 'source-link compact-link' : 'source-link'} href="https://learn.microsoft.com/en-us/power-automate/limits-and-config" target="_blank" rel="noopener noreferrer">
      {compact ? 'Microsoft Learn · Limits and configuration' : 'Read the Microsoft Learn article'} <span aria-hidden="true">↗</span>
    </a>
  )
}

export default App
