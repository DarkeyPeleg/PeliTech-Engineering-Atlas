import { getNavTree } from '@/lib/content/tree';
import { SidebarTree } from './SidebarTree';

/**
 * The documentation sidebar. A server component that reads the content tree and
 * hands it to the interactive list, so navigation stays generated from `docs/`
 * rather than maintained by hand.
 */
export async function Sidebar() {
  const tree = await getNavTree();

  return (
    <nav aria-label="Documentation" className="pb-64">
      <SidebarTree nodes={tree} />
    </nav>
  );
}
