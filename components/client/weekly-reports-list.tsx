"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, Calendar, Eye, Clock } from "lucide-react"
import Link from "next/link"

interface WeeklyReport {
  id: string
  title: string
  content: string
  week_start: string
  week_end: string
  is_read: boolean
  created_at: string
}

interface WeeklyReportsListProps {
  reports: WeeklyReport[]
  clientSlug: string
}

export function WeeklyReportsList({ reports, clientSlug }: WeeklyReportsListProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
    })
  }

  const formatFullDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
  }

  if (reports.length === 0) {
    return (
      <Card className="bg-[#0D0D12] border-purple-500/20 rounded-2xl">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-[#171723] flex items-center justify-center mb-4">
            <BookOpen className="w-8 h-8 text-[rgba(245,245,247,0.52)]" />
          </div>
          <h3 className="text-lg font-medium text-[#F5F5F7] mb-2">Nenhum relatório disponível</h3>
          <p className="text-[rgba(245,245,247,0.52)] text-center max-w-md">
            Os relatórios semanais da operação serão exibidos aqui quando disponíveis.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {reports.map((report) => (
        <Card
          key={report.id}
          className="bg-[#0D0D12] border-purple-500/20 rounded-2xl hover:border-[rgba(168,85,247,0.35)] transition-all duration-300"
        >
          <CardHeader className="pb-2">
            <div className="flex flex-col sm:flex-row sm:items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#171723] flex items-center justify-center shrink-0 text-[#A855F7]">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <CardTitle className="text-[#F5F5F7] text-lg">{report.title}</CardTitle>
                  {!report.is_read && (
                    <Badge className="bg-[#A855F7]/20 text-[#A855F7] border-[#A855F7]/30 rounded-full text-xs">
                      Novo
                    </Badge>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-[rgba(245,245,247,0.52)]">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    {formatDate(report.week_start)} - {formatDate(report.week_end)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {formatFullDate(report.created_at)}
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-[rgba(245,245,247,0.72)] line-clamp-2 mb-4">
              {report.content.replace(/<[^>]*>/g, '').substring(0, 200)}...
            </p>
            <Link href={`/dashboards/${clientSlug}/leitura-semanal/${report.id}`}>
              <Button 
                variant="outline" 
                className="border-[rgba(168,85,247,0.3)] text-[#A855F7] hover:bg-[rgba(168,85,247,0.1)] hover:border-[rgba(168,85,247,0.5)]"
              >
                <Eye className="w-4 h-4 mr-2" />
                Ler Relatório Completo
              </Button>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
