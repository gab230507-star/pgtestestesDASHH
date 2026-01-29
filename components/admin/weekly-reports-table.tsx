"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, MoreHorizontal, Edit, Trash2, BookOpen, Plus, Building2, Calendar, Eye } from "lucide-react"

interface WeeklyReport {
  id: string
  client_id: string
  client_name: string
  client_slug: string
  title: string
  content: string
  week_start: string
  week_end: string
  created_at: string
  read_count?: number
}

interface Client {
  id: string
  name: string
  slug: string
}

interface WeeklyReportsTableProps {
  reports: WeeklyReport[]
  clients: Client[]
}

export function WeeklyReportsTable({ reports: initialReports, clients }: WeeklyReportsTableProps) {
  const [reports, setReports] = useState(initialReports)
  const [search, setSearch] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editReport, setEditReport] = useState<WeeklyReport | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [newReport, setNewReport] = useState({
    client_id: "",
    title: "",
    content: "",
    week_start: "",
    week_end: "",
  })
  const [editForm, setEditForm] = useState({
    title: "",
    content: "",
    week_start: "",
    week_end: "",
  })

  const filteredReports = reports.filter(
    (report) =>
      report.title.toLowerCase().includes(search.toLowerCase()) ||
      report.client_name.toLowerCase().includes(search.toLowerCase()) ||
      report.content.toLowerCase().includes(search.toLowerCase())
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  const handleCreateReport = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const res = await fetch("/api/admin/weekly-reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReport),
      })

      if (res.ok) {
        const data = await res.json()
        const client = clients.find((c) => c.id === newReport.client_id)
        setReports([{ ...data.report, client_name: client?.name || "", client_slug: client?.slug || "" }, ...reports])
        setIsDialogOpen(false)
        setNewReport({
          client_id: "",
          title: "",
          content: "",
          week_start: "",
          week_end: "",
        })
      }
    } catch (error) {
      console.error("Error creating report:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (report: WeeklyReport) => {
    setEditReport(report)
    setEditForm({
      title: report.title,
      content: report.content,
      week_start: report.week_start.split("T")[0],
      week_end: report.week_end.split("T")[0],
    })
  }

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editReport) return
    setIsLoading(true)

    try {
      const res = await fetch(`/api/admin/weekly-reports/${editReport.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      })

      if (res.ok) {
        const updated = await res.json()
        setReports(reports.map((r) => (r.id === editReport.id ? { ...r, ...updated.report } : r)))
        setEditReport(null)
      }
    } catch (error) {
      console.error("Error updating report:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setIsLoading(true)

    try {
      const res = await fetch(`/api/admin/weekly-reports/${deleteId}`, {
        method: "DELETE",
      })

      if (res.ok) {
        setReports(reports.filter((r) => r.id !== deleteId))
      }
    } catch (error) {
      console.error("Error deleting report:", error)
    } finally {
      setIsLoading(false)
      setDeleteId(null)
    }
  }

  return (
    <div>
      <div className="p-4 border-b border-zinc-800 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input
            placeholder="Buscar relatórios..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-zinc-900/50 border-zinc-800 text-white placeholder:text-zinc-500 focus:border-purple-500"
          />
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Novo Relatório
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-zinc-900 border-zinc-800 max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-white">Novo Relatório Semanal</DialogTitle>
              <DialogDescription className="text-zinc-400">
                Crie um novo relatório semanal para um cliente
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateReport} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label className="text-zinc-300">Cliente</Label>
                <Select
                  value={newReport.client_id}
                  onValueChange={(value) => setNewReport({ ...newReport, client_id: value })}
                >
                  <SelectTrigger className="bg-zinc-900/50 border-zinc-700 text-white">
                    <SelectValue placeholder="Selecione um cliente" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800">
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id} className="text-zinc-300 focus:text-white focus:bg-zinc-800">
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">Título</Label>
                <Input
                  value={newReport.title}
                  onChange={(e) => setNewReport({ ...newReport, title: e.target.value })}
                  placeholder="Ex: Relatório Semanal - Janeiro Semana 4"
                  required
                  className="bg-zinc-900/50 border-zinc-700 text-white focus:border-purple-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-zinc-300">Início da Semana</Label>
                  <Input
                    type="date"
                    value={newReport.week_start}
                    onChange={(e) => setNewReport({ ...newReport, week_start: e.target.value })}
                    required
                    className="bg-zinc-900/50 border-zinc-700 text-white focus:border-purple-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-300">Fim da Semana</Label>
                  <Input
                    type="date"
                    value={newReport.week_end}
                    onChange={(e) => setNewReport({ ...newReport, week_end: e.target.value })}
                    required
                    className="bg-zinc-900/50 border-zinc-700 text-white focus:border-purple-500"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">Conteúdo do Relatório (HTML)</Label>
                <textarea
                  value={newReport.content}
                  onChange={(e) => setNewReport({ ...newReport, content: e.target.value })}
                  placeholder="<h2>Resumo da Semana</h2><p>...</p>"
                  rows={10}
                  required
                  className="w-full bg-zinc-900/50 border border-zinc-700 text-white rounded-md p-3 resize-none focus:border-purple-500 focus:outline-none"
                />
                <p className="text-xs text-zinc-500">Você pode usar tags HTML como &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt;, etc.</p>
              </div>
              <Button type="submit" disabled={isLoading} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                {isLoading ? "Criando..." : "Criar Relatório"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-zinc-800 hover:bg-zinc-900/50">
            <TableHead className="text-zinc-400">Relatório</TableHead>
            <TableHead className="text-zinc-400">Cliente</TableHead>
            <TableHead className="text-zinc-400">Período</TableHead>
            <TableHead className="text-zinc-400">Leituras</TableHead>
            <TableHead className="text-zinc-400 text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredReports.length > 0 ? (
            filteredReports.map((report) => (
              <TableRow key={report.id} className="border-zinc-800 hover:bg-zinc-900/50">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="font-medium text-white">{report.title}</p>
                      <p className="text-xs text-zinc-500">{formatDate(report.created_at)}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Link href={`/admin/clientes/${report.client_id}`}>
                    <div className="flex items-center gap-2 text-zinc-300 hover:text-white">
                      <Building2 className="w-4 h-4 text-zinc-500" />
                      {report.client_name}
                    </div>
                  </Link>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-zinc-300">
                    <Calendar className="w-4 h-4 text-zinc-500" />
                    {formatDate(report.week_start)} - {formatDate(report.week_end)}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="border-purple-500/50 text-purple-400 bg-purple-500/10">
                    <Eye className="w-3 h-3 mr-1" />
                    {report.read_count || 0}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-zinc-800">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800">
                      <DropdownMenuItem 
                        className="text-zinc-300 focus:text-white focus:bg-zinc-800 cursor-pointer"
                        onClick={() => handleEdit(report)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-red-400 focus:text-red-400 focus:bg-red-950 cursor-pointer"
                        onClick={() => setDeleteId(report.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="h-32 text-center">
                <div className="flex flex-col items-center gap-2 text-zinc-400">
                  <BookOpen className="w-8 h-8 opacity-50" />
                  <p>Nenhum relatório encontrado</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Edit Dialog */}
      <Dialog open={!!editReport} onOpenChange={() => setEditReport(null)}>
        <DialogContent className="bg-zinc-900 border-zinc-800 max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">Editar Relatório</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Atualize o relatório semanal
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveEdit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label className="text-zinc-300">Título</Label>
              <Input
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                required
                className="bg-zinc-900/50 border-zinc-700 text-white focus:border-purple-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-zinc-300">Início da Semana</Label>
                <Input
                  type="date"
                  value={editForm.week_start}
                  onChange={(e) => setEditForm({ ...editForm, week_start: e.target.value })}
                  required
                  className="bg-zinc-900/50 border-zinc-700 text-white focus:border-purple-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">Fim da Semana</Label>
                <Input
                  type="date"
                  value={editForm.week_end}
                  onChange={(e) => setEditForm({ ...editForm, week_end: e.target.value })}
                  required
                  className="bg-zinc-900/50 border-zinc-700 text-white focus:border-purple-500"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300">Conteúdo do Relatório (HTML)</Label>
              <textarea
                value={editForm.content}
                onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                rows={10}
                required
                className="w-full bg-zinc-900/50 border border-zinc-700 text-white rounded-md p-3 resize-none focus:border-purple-500 focus:outline-none"
              />
            </div>
            <Button type="submit" disabled={isLoading} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
              {isLoading ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-zinc-900 border-zinc-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Excluir Relatório</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              Tem certeza que deseja excluir este relatório? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isLoading ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
