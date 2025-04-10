import UserMenu from "@/components/Header/UserMenu"
import Link from "next/link"
import { adminmenu } from "@/config/adminsidebar"
 
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full">
      <div className="w-full flex justify-between items-center px-5 py-3">
        <Link href='/'>
          <h1>Sleek Studio</h1>
        </Link>
        <UserMenu/>
      </div>
      <div className="w-full border-b">
        <div className="w-[90%] mx-auto overflow-x-auto">
          <div className="flex gap-4 py-2 min-w-max">
            {adminmenu.map((item) => (
              <Link
                key={item.title}
                href={item.url}
                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
              >
                <item.icon className="w-4 h-4" />
                <span>{item.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="w-[90%] mx-auto py-4">
        {children}
      </div>
    </div>
  )
}