import SideNav from '@/app/ui/dashboard/sidenav';
import { Metadata } from 'next';
// 1. ここにauthとfetchUserByEmailのインポートを追加
import { auth } from '@/auth'; // NextAuth.js の認証関数
import { fetchUserByEmail } from '@/app/lib/data'; // ステップ1で追加した関数

export const experimental_ppr = true;

// 2. default function Layout を async function Layout に変更
export default async function Layout({ children }: { children: React.ReactNode }) {
  // 3. ここに認証セッションとユーザー名取得のロジックを追加
  const session = await auth(); // ログインセッション情報を取得

  let userName = 'ゲスト'; // ユーザー名がない場合のデフォルト値

  if (session?.user?.email) { // セッションにメールアドレスがあれば
    try {
      const user = await fetchUserByEmail(session.user.email); // DBからユーザー情報を取得
      if (user && user.name) {
        userName = user.name; // ユーザー名があればセット
      }
    } catch (error) {
      console.error("Failed to display user name in dashboard layout:", error);
      // エラーが発生しても、そのまま「ゲスト」で続行
    }
  }

  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">
        {/* 4. ここに「ようこそ、[ユーザー名]」のH1タグを追加 */}
        <h1 className="mb-4 text-2xl font-bold">ようこそ、{userName}さん！</h1>
        {children}
      </div>
    </div>
  );
}

export const metadata: Metadata = {
  title: {
    template: '%s | Acme Dashboard',
    default: 'Acme Dashboard',
  },
  description: 'The official Next.js Course Dashboard, built with App Router.',
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
};