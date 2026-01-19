"use client"

import React from "react"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  BookOpen,
  ClipboardList,
  Trophy,
  User,
  LogOut,
  ChevronDown,
  GraduationCap,
  LayoutDashboard,
} from "lucide-react"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, loading, isAuthenticated, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login")
    }
  }, [loading, isAuthenticated, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return null
  }

  const navItems = getNavItems(user.role)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-card">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-primary" />
              <span className="font-semibold text-lg">SETICE</span>
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    pathname.startsWith(item.href)
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary">
                  <User className="h-4 w-4" />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium">{user.prenom} {user.nom}</p>
                  <p className="text-xs text-muted-foreground capitalize">{user.role.replace("_", " ").toLowerCase()}</p>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">{user.prenom} {user.nom}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-destructive cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                Se déconnecter
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-6 px-4">
        {children}
      </main>
    </div>
  )
}

function getNavItems(role: string) {
  switch (role) {
    case "FORMATEUR":
      return [
        { href: "/dashboard/formateur", label: "Tableau de bord", icon: LayoutDashboard },
        { href: "/formateur/travaux", label: "Mes travaux", icon: ClipboardList },
        { href: "/formateur", label: "Mes espaces", icon: BookOpen },
      ]
    case "ETUDIANT":
      return [
        { href: "/dashboard/etudiant", label: "Tableau de bord", icon: LayoutDashboard },
        { href: "/dashboard/etudiant/evaluations", label: "Mes notes", icon: ClipboardList },
        { href: "/dashboard/etudiant/travaux", label: "Mes travaux", icon: BookOpen },
      ]
    case "DIRECTEUR_ETUDES":
      return [
        { href: "/dashboard/directeur", label: "Tableau de bord", icon: LayoutDashboard },
        { href: "/dashboard/directeur/classements", label: "Classements", icon: Trophy },
        { href: "/dashboard/directeur/promotions", label: "Promotions", icon: GraduationCap },
      ]
    default:
      return []
  }
}
