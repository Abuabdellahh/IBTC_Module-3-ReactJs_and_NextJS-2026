export default function ConfigDemoPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'Site URL not configured'

  return (
    <div style={{ padding: '1rem 0' }}>
      <h2 style={{ marginBottom: '1rem' }}>Application Configuration</h2>
      <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>
        Only <code>NEXT_PUBLIC_</code> variables are safe to read here — they
        are embedded in the client bundle at build time. Never expose database
        URLs or secrets through a public variable.
      </p>

      <div className="card" style={{ maxWidth: '32rem' }}>
        <p style={{ margin: 0 }}>
          <span style={{ color: 'var(--muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            NEXT_PUBLIC_SITE_URL
          </span>
          <br />
          <strong style={{ color: 'var(--accent)' }}>{siteUrl}</strong>
        </p>
      </div>
    </div>
  )
}
