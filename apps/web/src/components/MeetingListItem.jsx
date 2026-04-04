import { Link } from 'react-router-dom'

export default function MeetingListItem({ meeting }) {
  return (
    <li className="list-item">
      <Link to={`/meetings/${meeting.id}`} className="list-item-link">
        <strong>{meeting.title}</strong>
        <span className="list-item-status">{meeting.status}</span>
      </Link>
    </li>
  )
}
