import { Nav } from "@/app/ui/wrappers";

export default function PagesLayout({ children }) {
  return (
    <>
      {children}
      <Nav />
    </>
  )
}