import { useEffect, useState } from "react";
import { gapi } from "gapi-script";

const CLIENT_ID = "YOUR_CLIENT_ID.apps.googleusercontent.com";
const API_KEY = "YOUR_API_KEY"; // create API key in Google Console too
const SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

function App() {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    function start() {
      gapi.client
        .init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          scope: SCOPES,
          discoveryDocs: [
            "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
          ],
        })
        .then(() => {
          // Load signed-in user’s events
          gapi.auth2.getAuthInstance().signIn().then(() => {
            gapi.client.calendar.events
              .list({
                calendarId: "primary",
                timeMin: new Date().toISOString(),
                showDeleted: false,
                singleEvents: true,
                maxResults: 10,
                orderBy: "startTime",
              })
              .then((response: any) => {
                setEvents(response.result.items);
              });
          });
        });
    }

    gapi.load("client:auth2", start);
  }, []);

  return (
    <div>
      <h1>Upcoming Google Calendar Events</h1>
      <ul>
        {events.map((event, i) => (
          <li key={i}>
            {event.summary} — {event.start.dateTime || event.start.date}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
