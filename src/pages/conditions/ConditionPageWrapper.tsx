import { useParams } from 'react-router-dom';
import { getConditionBySlug } from '../../data/conditions';
import ConditionPage from './ConditionPage';
import NotFound from '../NotFound';

export default function ConditionPageWrapper() {
  const { slug } = useParams<{ slug: string }>();
  const data = slug ? getConditionBySlug(slug) : undefined;

  if (!data) return <NotFound />;
  return <ConditionPage data={data} />;
}
