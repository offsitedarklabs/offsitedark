export function MarkKey({ variant = "stack" }: { variant?: "stack" | "strip" }) {
  if (variant === "strip") {
    return (
      <div className="mark-key mark-key--strip" aria-label="How to read the marks">
        <span className="sev sev-critical">9.0+</span>
        <span className="mark-key-text">Critical</span>
        <span className="sev sev-high">7.0</span>
        <span className="mark-key-text">High</span>
        <span className="sev sev-medium">4.0</span>
        <span className="mark-key-text">Medium</span>
        <span className="sev sev-low">&lt;4</span>
        <span className="mark-key-text">Low</span>
        <span className="mark-key-break" aria-hidden />
        <span className="status-kev">KEV</span>
        <span className="mark-key-text">On the CISA catalog</span>
        <span className="status-open">Not KEV</span>
        <span className="mark-key-text">Checked, not listed</span>
      </div>
    );
  }

  return (
    <aside className="mark-key" aria-label="How to read a record">
      <p className="mark-key-label">Key</p>
      <ul className="mark-key-scale">
        <li>
          <span className="sev sev-critical">9.0+</span>
          Critical
        </li>
        <li>
          <span className="sev sev-high">7.0–8.9</span>
          High
        </li>
        <li>
          <span className="sev sev-medium">4.0–6.9</span>
          Medium
        </li>
        <li>
          <span className="sev sev-low">&lt;4.0</span>
          Low
        </li>
      </ul>
      <p className="mark-key-note">Darker blue is more severe. The number is the CVSS score.</p>
      <p className="mark-key-def">
        <span className="status-kev">KEV</span>
        <span>On the CISA Known Exploited Vulnerabilities catalog.</span>
      </p>
      <p className="mark-key-def">
        <span className="status-open">Not KEV</span>
        <span>Checked, and not on that catalog.</span>
      </p>
    </aside>
  );
}
