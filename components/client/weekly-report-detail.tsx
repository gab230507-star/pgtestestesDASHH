"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface WeeklyReport {
  id: string
  title: string
  content: string
  week_start: string
  week_end: string
  created_at: string
}

interface WeeklyReportDetailProps {
  report: WeeklyReport
  clientSlug: string
}

export function WeeklyReportDetail({ report, clientSlug }: WeeklyReportDetailProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      <Link href={`/dashboards/${clientSlug}/leitura-semanal`}>
        <Button 
          variant="ghost" 
          className="text-[rgba(245,245,247,0.52)] hover:text-[#F5F5F7] hover:bg-[#141424] mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para Lista
        </Button>
      </Link>

      <Card className="bg-[#0D0D12] border-purple-500/20 rounded-2xl">
        <CardContent className="p-6 md:p-8">
          {/* Header Info */}
          <div className="flex flex-wrap items-center gap-4 mb-8 pb-6 border-b border-[rgba(255,255,255,0.06)]">
            <div className="flex items-center gap-2 text-[rgba(245,245,247,0.52)]">
              <Calendar className="w-5 h-5" />
              <span>Período: {formatDate(report.week_start)} - {formatDate(report.week_end)}</span>
            </div>
            <div className="text-[rgba(245,245,247,0.52)]">
              Publicado em {formatDate(report.created_at)}
            </div>
          </div>

          {/* Report Content */}
          <div 
            className="prose prose-invert max-w-none
              prose-headings:text-[#F5F5F7] prose-headings:font-semibold
              prose-h1:text-2xl prose-h1:mb-4 prose-h1:mt-8
              prose-h2:text-xl prose-h2:mb-3 prose-h2:mt-6
              prose-h3:text-lg prose-h3:mb-2 prose-h3:mt-4
              prose-p:text-[rgba(245,245,247,0.72)] prose-p:leading-relaxed prose-p:mb-4
              prose-ul:text-[rgba(245,245,247,0.72)] prose-ul:my-4
              prose-ol:text-[rgba(245,245,247,0.72)] prose-ol:my-4
              prose-li:mb-2
              prose-strong:text-[#F5F5F7] prose-strong:font-semibold
              prose-a:text-[#A855F7] prose-a:no-underline hover:prose-a:underline
              prose-blockquote:border-l-[#A855F7] prose-blockquote:bg-[#141424] prose-blockquote:rounded-r-lg prose-blockquote:py-2 prose-blockquote:px-4
              prose-code:bg-[#141424] prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-[#A855F7]
              prose-pre:bg-[#141424] prose-pre:rounded-xl
              prose-table:border-collapse
              prose-th:bg-[#141424] prose-th:p-3 prose-th:text-left prose-th:text-[#F5F5F7] prose-th:border prose-th:border-[rgba(255,255,255,0.06)]
              prose-td:p-3 prose-td:border prose-td:border-[rgba(255,255,255,0.06)] prose-td:text-[rgba(245,245,247,0.72)]
            "
            dangerouslySetInnerHTML={{ __html: report.content }}
          />
        </CardContent>
      </Card>
    </div>
  )
}
