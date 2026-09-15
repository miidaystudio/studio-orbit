import { redirect } from 'next/navigation';

export default function RootHomePage() {
  // Redirect root URL (/) to the studio admin projects dashboard
  redirect('/projects');
}
