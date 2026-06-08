"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/auth-context"
import { Rocket, Eye, EyeOff, AlertCircle, Loader2, Sparkles } from "lucide-react"

export function AuthModal() {
  const { authModalOpen, closeAuthModal, login, register } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showLoginPass, setShowLoginPass] = useState(false)
  const [showRegPass, setShowRegPass] = useState(false)

  const [loginEmail, setLoginEmail] = useState("")
  const [loginSenha, setLoginSenha] = useState("")

  const [regNome, setRegNome] = useState("")
  const [regEmail, setRegEmail] = useState("")
  const [regSenha, setRegSenha] = useState("")

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      await login(loginEmail, loginSenha)
      closeAuthModal()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Credenciais inválidas")
    } finally {
      setLoading(false)
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    if (regSenha.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres")
      return
    }
    setLoading(true)
    try {
      await register(regNome, regEmail, regSenha)
      closeAuthModal()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao criar conta")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={authModalOpen} onOpenChange={closeAuthModal}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden border-border/50 bg-card">
        <DialogTitle className="sr-only">Acesse sua conta OrbitBook</DialogTitle>
        {/* Header com gradiente */}
        <div className="relative bg-gradient-to-br from-primary/20 via-accent/10 to-background px-6 pt-8 pb-6 text-center border-b border-border/30">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none" />
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent mb-3 shadow-lg shadow-primary/20">
            <Rocket className="h-7 w-7 text-primary-foreground" />
          </div>
          <h2 className="text-xl font-bold tracking-tight">OrbitBook</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Sua jornada espacial começa aqui
          </p>
        </div>

        <div className="p-6">
          <Tabs defaultValue="login" onValueChange={() => setError("")}>
            <TabsList className="w-full bg-secondary/50 mb-6">
              <TabsTrigger value="login" className="flex-1 data-[state=active]:bg-card">
                Entrar
              </TabsTrigger>
              <TabsTrigger value="register" className="flex-1 data-[state=active]:bg-card">
                Criar Conta
              </TabsTrigger>
            </TabsList>

            {/* Error message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -8, height: 0 }}
                  className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm mb-4"
                >
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* LOGIN */}
            <TabsContent value="login" className="mt-0">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="login-email" className="text-sm font-medium">
                    Email
                  </Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="astronauta@email.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="bg-secondary/30 border-border/50 focus:border-primary/50 h-10"
                    required
                    autoComplete="email"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="login-senha" className="text-sm font-medium">
                    Senha
                  </Label>
                  <div className="relative">
                    <Input
                      id="login-senha"
                      type={showLoginPass ? "text" : "password"}
                      placeholder="••••••••"
                      value={loginSenha}
                      onChange={(e) => setLoginSenha(e.target.value)}
                      className="bg-secondary/30 border-border/50 focus:border-primary/50 h-10 pr-10"
                      required
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPass((p) => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showLoginPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full h-10 gap-2 mt-2 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Rocket className="h-4 w-4" />
                  )}
                  {loading ? "Entrando..." : "Entrar na Missão"}
                </Button>
              </form>
            </TabsContent>

            {/* REGISTER */}
            <TabsContent value="register" className="mt-0">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="reg-nome" className="text-sm font-medium">
                    Nome completo
                  </Label>
                  <Input
                    id="reg-nome"
                    placeholder="Neil Armstrong"
                    value={regNome}
                    onChange={(e) => setRegNome(e.target.value)}
                    className="bg-secondary/30 border-border/50 focus:border-primary/50 h-10"
                    required
                    autoComplete="name"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="reg-email" className="text-sm font-medium">
                    Email
                  </Label>
                  <Input
                    id="reg-email"
                    type="email"
                    placeholder="astronauta@email.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="bg-secondary/30 border-border/50 focus:border-primary/50 h-10"
                    required
                    autoComplete="email"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="reg-senha" className="text-sm font-medium">
                    Senha
                  </Label>
                  <div className="relative">
                    <Input
                      id="reg-senha"
                      type={showRegPass ? "text" : "password"}
                      placeholder="Mín. 6 caracteres"
                      value={regSenha}
                      onChange={(e) => setRegSenha(e.target.value)}
                      className="bg-secondary/30 border-border/50 focus:border-primary/50 h-10 pr-10"
                      required
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPass((p) => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showRegPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {regSenha.length > 0 && (
                    <div className="flex gap-1 mt-1">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded-full transition-colors ${
                            regSenha.length >= level * 3
                              ? level <= 2
                                ? "bg-destructive"
                                : level === 3
                                ? "bg-yellow-500"
                                : "bg-green-500"
                              : "bg-secondary"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full h-10 gap-2 mt-2 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  {loading ? "Criando conta..." : "Iniciar Jornada"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <p className="text-center text-xs text-muted-foreground mt-5">
            Ao continuar, você concorda com os nossos{" "}
            <span className="text-primary cursor-pointer hover:underline">Termos de Uso</span>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
