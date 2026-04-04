import { Card } from './ui/card.jsx'

export default function MeetingSummary({ meeting }) {
  if (!meeting) return null

  return (
    <section className="mt-4">
      <h3 className="subheading subheading--flush">Transcript</h3>
      <Card className="card--flush mt-2">
        <pre className="pre-scroll">{meeting.transcript}</pre>
      </Card>

      {meeting.summary && (
        <section className="mt-6">
          <Card className="card--pad">
            <h3 className="subheading subheading--flush">Summary</h3>
            <p className="mt-3">{meeting.summary}</p>

            {meeting.actionItems?.length > 0 && (
              <>
                <h4 className="subheading">Action items</h4>
                <ul className="action-list">
                  {meeting.actionItems.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </>
            )}
          </Card>
        </section>
      )}

      {meeting.status === 'failed' && meeting.error && (
        <p className="error-text mt-4">{meeting.error}</p>
      )}
    </section>
  )
}
