import { redirect } from 'next/navigation';

export default async function VisualQAStagingPage(props: {
  searchParams: Promise<{ deliverableId?: string }>;
}) {
  const params = await props.searchParams;
  if (params.deliverableId) {
    redirect(`/review-sandbox?deliverableId=${params.deliverableId}`);
  }
  redirect('/review-sandbox');
}
