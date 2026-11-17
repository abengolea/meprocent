import type { ReactNode } from 'react';
import Link from 'next/link';
import {
  Activity,
  Award,
  Building2,
  ChevronRight,
  Cog,
  Droplets,
  Factory,
  FlaskConical,
  Gauge,
  Mail,
  MapPin,
  Phone,
  Shield,
  Wrench,
} from 'lucide-react';
import { HeroVisual } from '@/components/landing/hero-visual';
import { SiteHeader } from '@/components/landing/site-header';
import { MeprocentBrand } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const SPECIALIZATIONS = [
  {
    n: '01',
    title: 'Ingeniería de confiabilidad',
    text: 'Análisis de fallas, criticidad, estrategias de mantenimiento y mejora del desempeño de activos.',
  },
  {
    n: '02',
    title: 'Mantenimiento predictivo',
    text: 'Vibraciones, monitoreo de condición, lubricación y evaluación técnica de equipos rotantes.',
  },
  {
    n: '03',
    title: 'Integridad mecánica industrial',
    text: 'Evaluación e inspección de equipos estáticos, calderas y recipientes a presión según alcance aplicable.',
  },
] as const;

const SERVICE_BLOCKS = [
  {
    title: 'Ingeniería de confiabilidad',
    items: [
      'Evaluación de criticidad de activos y riesgos de falla',
      'Análisis de causa raíz (RCA) y recomendaciones de mejora',
      'Desarrollo y revisión de planes de mantenimiento',
      'Asistencia en estrategias de gestión de activos',
    ],
    icon: Gauge,
  },
  {
    title: 'Mantenimiento predictivo',
    items: [
      'Diagnóstico y análisis de vibraciones en equipos rotantes',
      'Diseño de programas de monitoreo de condición',
      'Auditorías y planes de lubricación industrial',
      'Informes técnicos, tendencias y recomendaciones',
    ],
    icon: Activity,
  },
  {
    title: 'Integridad mecánica industrial',
    items: [
      'Evaluación técnica de equipos sometidos a presión',
      'Relevamientos de integridad de equipos estáticos',
      'Inspección de tanques de almacenamiento según API 653',
      'Inspección técnica de soldaduras según alcance contratado',
    ],
    icon: Shield,
  },
] as const;

const HIGHLIGHT_SERVICES = [
  { title: 'Tanques API 653', desc: 'Inspección y evaluación según estándar API.', icon: Factory },
  { title: 'Recipientes y calderas', desc: 'Inspección de equipos a presión.', icon: Cog },
  { title: 'Vibraciones', desc: 'Diagnóstico de condición en rotativos.', icon: Activity },
  { title: 'Lubricación', desc: 'Programas y auditorías de confiabilidad.', icon: Droplets },
  { title: 'Soldaduras Nivel 3', desc: 'Inspección técnica especializada.', icon: Wrench },
  { title: 'Piping e integridad', desc: 'Montajes y soporte en planta.', icon: FlaskConical },
] as const;

const METHODOLOGY = [
  { step: '01', title: 'Relevamiento', text: 'Objetivos, equipos, historial y restricciones de planta.' },
  { step: '02', title: 'Propuesta técnica', text: 'Alcance, recursos, plazos y entregables definidos.' },
  { step: '03', title: 'Ejecución', text: 'Ingeniería, mediciones o inspecciones según contrato.' },
  { step: '04', title: 'Informe y seguimiento', text: 'Hallazgos, prioridades y recomendaciones documentadas.' },
] as const;

const CERTIFICATIONS = [
  'Inspector de tanques API 653 (curso IAS y examen API aprobados)',
  'Inspector de calderas y recipientes a presión (INTI)',
  'Analista de vibraciones categoría III (ISO 18436-2)',
  'Analista de lubricantes de máquinas nivel II (ISO 18436-4)',
  'Especialista en confiabilidad industrial (Universidad Austral)',
  'Inspección de soldaduras — especialidad técnica informada',
] as const;

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-primary">{children}</p>
  );
}

function SectionTitle({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h2
      className={cn(
        'font-headline text-3xl font-bold uppercase leading-[1.05] tracking-tight sm:text-4xl lg:text-[2.65rem]',
        className,
      )}
    >
      {children}
    </h2>
  );
}

export function LandingHome() {
  return (
    <div id="top" className="landing-root bg-background text-foreground">
      <SiteHeader />

      {/* Hero */}
      <section
        className="relative isolate overflow-hidden bg-[#14263b] pt-[5.5rem] text-white sm:pt-24"
        aria-labelledby="hero-heading"
      >
        <div className="landing-hero-mesh pointer-events-none absolute inset-0" aria-hidden />
        <div className="landing-hero-glow pointer-events-none absolute inset-0" aria-hidden />
        <div
          className="pointer-events-none absolute -right-24 top-20 h-80 w-80 rounded-full border border-primary/10 bg-primary/[0.04]"
          aria-hidden
        />
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

        <div className="relative mx-auto grid min-h-[calc(100vh-5.5rem)] max-w-6xl items-center gap-12 px-4 py-14 sm:min-h-[calc(100vh-6rem)] sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:px-8 lg:py-20">
          <div className="max-w-xl lg:max-w-none">
            <p className="mb-5 inline-flex items-center gap-2 rounded-sm border border-white/12 bg-white/[0.04] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/85">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
              San Nicolás · Buenos Aires · Argentina
            </p>
            <h1
              id="hero-heading"
              className="font-headline text-[2.15rem] font-bold uppercase leading-[0.97] tracking-tight sm:text-[2.65rem] lg:text-[3.35rem]"
            >
              Inspeccionamos, evaluamos y{' '}
              <span className="bg-gradient-to-r from-primary to-[#ff9a4d] bg-clip-text text-transparent">
                protegemos
              </span>{' '}
              tus activos industriales
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-white/72 sm:text-lg">
              Ingeniería de confiabilidad, mantenimiento predictivo e integridad mecánica para plantas que necesitan
              decisiones de mantenimiento fundamentadas.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button asChild size="lg" className="h-12 px-7 text-base font-semibold shadow-lg shadow-primary/30">
                <a href="#contacto">
                  Agendar relevamiento
                  <ChevronRight className="ml-1 h-4 w-4" />
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 border-white/25 bg-transparent px-7 text-base font-semibold text-white hover:border-white/40 hover:bg-white/[0.06] hover:text-white"
              >
                <a href="#servicios">Ver servicios</a>
              </Button>
            </div>

            <dl className="mt-12 grid gap-6 border-t border-white/10 pt-8 sm:grid-cols-3">
              {[
                { k: 'API 653', v: 'Inspección de tanques certificada' },
                { k: 'ISO 18436', v: 'Vibraciones y lubricación' },
                { k: 'Planta real', v: 'Experiencia en grandes industrias' },
              ].map((item) => (
                <div key={item.k}>
                  <dt className="font-headline text-base font-semibold uppercase tracking-wide text-white">{item.k}</dt>
                  <dd className="mt-1 text-sm leading-snug text-white/55">{item.v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <HeroVisual />
        </div>
      </section>

      {/* Empresa */}
      <section id="empresa" className="scroll-mt-24 border-b border-border bg-background py-20 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-14 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:px-8">
          <div>
            <SectionLabel>Quiénes somos</SectionLabel>
            <SectionTitle className="text-secondary">MEPROCENT SRL</SectionTitle>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              Empresa orientada a brindar soluciones de ingeniería especializada para mejorar la{' '}
              <strong className="font-semibold text-foreground">confiabilidad</strong>, la{' '}
              <strong className="font-semibold text-foreground">disponibilidad</strong> y la{' '}
              <strong className="font-semibold text-foreground">seguridad</strong> de los activos industriales.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Contamos con fuerte especialización en la inspección y evaluación de tanques de almacenamiento según
              normas API, junto con respaldo técnico en recipientes a presión, análisis de vibraciones y gestión de
              lubricación.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-8 shadow-sm">
            <SectionLabel>Propuesta de valor</SectionLabel>
            <p className="text-lg font-medium leading-snug text-secondary">
              Convertimos información técnica, experiencia de planta y metodologías de diagnóstico en decisiones de
              mantenimiento fundamentadas.
            </p>
            <p className="mt-4 text-muted-foreground">
              Adaptamos el alcance de cada servicio a las necesidades del cliente — desde un diagnóstico puntual hasta
              programas periódicos de confiabilidad e integridad.
            </p>
            <ul className="mt-8 space-y-3">
              {SPECIALIZATIONS.map((s) => (
                <li key={s.n} className="flex gap-4 border-l border-primary/40 pl-4">
                  <span className="font-headline text-sm font-bold text-primary">{s.n}</span>
                  <div>
                    <p className="font-semibold text-foreground">{s.title}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">{s.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Servicios destacados */}
      <section id="servicios" className="scroll-mt-24 bg-secondary py-20 text-secondary-foreground sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <SectionLabel>Servicios especializados</SectionLabel>
            <SectionTitle className="text-white">Nuestros servicios principales</SectionTitle>
            <p className="mt-4 text-white/70">
              Cobertura técnica en los tres ejes de nuestra práctica: confiabilidad, condición de equipos e integridad de
              activos estáticos.
            </p>
          </div>

          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {HIGHLIGHT_SERVICES.map((svc) => (
              <li
                key={svc.title}
                className="group rounded-lg border border-white/10 bg-white/[0.04] p-6 transition-colors hover:border-primary/50 hover:bg-white/[0.07]"
              >
                <svc.icon className="h-8 w-8 text-primary" strokeWidth={1.5} aria-hidden />
                <h3 className="mt-4 font-headline text-lg font-semibold uppercase tracking-wide text-white">
                  {svc.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/65">{svc.desc}</p>
              </li>
            ))}
          </ul>

          <div className="mt-16 grid gap-6 lg:grid-cols-3">
            {SERVICE_BLOCKS.map((block) => (
              <article
                key={block.title}
                className="flex flex-col rounded-lg border border-white/10 bg-[#152433] p-7"
              >
                <block.icon className="h-7 w-7 text-primary" strokeWidth={1.5} />
                <h3 className="mt-4 font-headline text-xl font-semibold uppercase tracking-wide text-white">
                  {block.title}
                </h3>
                <ul className="mt-5 flex-1 space-y-2.5 text-sm text-white/75">
                  {block.items.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Mercados */}
      <section className="border-b border-border py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <SectionLabel>Mercados</SectionLabel>
          <SectionTitle className="text-secondary">Cómo trabajamos con vos</SectionTitle>

          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            <article className="rounded-lg border border-border bg-card p-8">
              <div className="flex items-center gap-3">
                <Building2 className="h-8 w-8 text-primary" strokeWidth={1.5} />
                <h3 className="font-headline text-xl font-semibold uppercase text-secondary">Grandes industrias</h3>
              </div>
              <p className="mt-4 text-muted-foreground">
                Proyectos de diagnóstico especializado, auditorías, estudios de fallas, programas de confiabilidad y
                asistencia técnica en paradas de planta.
              </p>
              <p className="mt-3 text-sm font-medium text-foreground">
                Modalidades: servicio puntual, proyecto o contrato periódico.
              </p>
            </article>
            <article className="rounded-lg border border-border bg-card p-8">
              <div className="flex items-center gap-3">
                <Factory className="h-8 w-8 text-primary" strokeWidth={1.5} />
                <h3 className="font-headline text-xl font-semibold uppercase text-secondary">PYMES industriales</h3>
              </div>
              <p className="mt-4 text-muted-foreground">
                Ingeniería externa para empresas sin equipo propio de confiabilidad: diagnóstico inicial, priorización
                de activos y seguimiento programado.
              </p>
              <p className="mt-3 text-sm font-medium text-foreground">
                Modalidades: relevamiento, plan de mejora o abono técnico acordado.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* Metodología */}
      <section id="metodologia" className="scroll-mt-24 bg-muted/50 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <SectionLabel>Metodología de intervención</SectionLabel>
          <SectionTitle className="text-secondary">De la planta al informe</SectionTitle>
          <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {METHODOLOGY.map((m) => (
              <li key={m.step} className="relative rounded-lg border border-border bg-card p-6 pt-10">
                <span className="absolute left-6 top-6 font-headline text-3xl font-bold text-primary/25">{m.step}</span>
                <h3 className="font-headline text-lg font-semibold uppercase text-secondary">{m.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{m.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Certificaciones + Equipo */}
      <section id="equipo" className="scroll-mt-24 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2">
            <div>
              <SectionLabel>Respaldo técnico</SectionLabel>
              <SectionTitle className="text-secondary">Certificaciones y credenciales</SectionTitle>
              <p className="mt-4 text-muted-foreground">
                Personal con formación alineada a estándares internacionales y normas de la industria de proceso.
              </p>
              <ul className="mt-8 space-y-3">
                {CERTIFICATIONS.map((c) => (
                  <li key={c} className="flex gap-3 text-sm">
                    <Award className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-10 inline-flex items-center gap-4 rounded-md border border-border bg-muted/40 px-5 py-4">
                <div className="font-headline text-2xl font-bold tracking-tight text-secondary">API</div>
                <p className="text-sm text-muted-foreground">
                  Inspección de tanques bajo estándares American Petroleum Institute — API 653.
                </p>
              </div>
            </div>

            <div>
              <SectionLabel>Equipo profesional</SectionLabel>
              <SectionTitle className="text-secondary">Quién responde técnicamente</SectionTitle>

              <div className="mt-8 space-y-6">
                <article className="rounded-lg border border-border bg-card p-6">
                  <h3 className="font-headline text-lg font-semibold uppercase tracking-wide text-secondary">
                    Luciano Ramón Centurión
                  </h3>
                  <p className="text-sm font-medium text-primary">Gerente · MEPROCENT SRL</p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    Dirección general, desarrollo comercial, coordinación operativa y gestión de proyectos y relaciones
                    con clientes industriales.
                  </p>
                </article>

                <article className="rounded-lg border border-border bg-card p-6">
                  <h3 className="font-headline text-lg font-semibold uppercase tracking-wide text-secondary">
                    Ing. Mauricio Eduardo Centurión
                  </h3>
                  <p className="text-sm font-medium text-primary">Referente técnico de ingeniería y confiabilidad</p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    Ingeniero mecánico (UTN). Trayectoria industrial documentada desde 2001. Formación en confiabilidad,
                    vibraciones, lubricación, recipientes a presión (INTI), API 653 (IAS + examen API) e inspección de
                    soldaduras.
                  </p>
                </article>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contacto */}
      <section id="contacto" className="scroll-mt-24 border-t border-border bg-secondary py-20 text-white sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <div>
              <SectionLabel>Próximo paso</SectionLabel>
              <SectionTitle className="text-white">Ingeniería para decisiones más confiables</SectionTitle>
              <p className="mt-5 text-lg text-white/75">
                Ofrecemos reuniones de relevamiento técnico para identificar activos críticos, problemas recurrentes y
                oportunidades de mejora. Cada propuesta define objetivos, metodología, entregables y recursos.
              </p>
            </div>

            <div className="rounded-lg border border-white/10 bg-white/[0.04] p-8 backdrop-blur-sm">
              <p className="font-headline text-xl font-semibold uppercase tracking-wide">MEPROCENT Soluciones Industriales SRL</p>
              <ul className="mt-6 space-y-4 text-white/85">
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
                  <span>
                    San Nicolás de los Arroyos
                    <br />
                    Buenos Aires, Argentina
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="h-5 w-5 shrink-0 text-primary" aria-hidden />
                  <a href="tel:+543364322386" className="hover:text-primary transition-colors">
                    +54 336 432-2386
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="h-5 w-5 shrink-0 text-primary" aria-hidden />
                  <a href="mailto:lucianocenturion@meprocent.com.ar" className="hover:text-primary transition-colors">
                    lucianocenturion@meprocent.com.ar
                  </a>
                </li>
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg" className="font-semibold">
                  <a href="mailto:lucianocenturion@meprocent.com.ar?subject=Consulta%20técnica%20MEPROCENT">
                    Escribinos
                  </a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/30 bg-transparent text-white hover:bg-white/10"
                >
                  <Link href="/acceso">Acceso al portal</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-[#172636] py-10 text-white/60">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 sm:flex-row sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:items-start">
            <MeprocentBrand size="md" />
            <p className="max-w-xs text-center text-xs sm:text-left">
              Soluciones industriales con foco en ingeniería especializada.
            </p>
          </div>
          <p className="text-center text-xs sm:text-right">
            © {new Date().getFullYear()} MEPROCENT Soluciones Industriales SRL. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}