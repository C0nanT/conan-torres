import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Link } from '@/lib/navigation'
import { site } from '@/lib/site-data'
import {
  ArrowRight,
  Heart,
  Lightbulb,
  Mail,
  MessageCircle,
  Quote,
  Target,
  Users,
} from 'lucide-react'

const coreValueIcons = [Lightbulb, Users, Target, Heart] as const

export function Philosophy() {
  const { philosophy, contact } = site
  const { coreValues, personalInsights } = philosophy

  return (
    <section className="py-16 lg:py-20 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-12">
          <Badge variant="outline" className="px-3 py-1">
            <Heart className="mr-1 h-3 w-3" />
            Filosofia & Valores
          </Badge>
          <h2 className="text-3xl font-bold lg:text-4xl">
            O que me <span className="gradient-text">motiva</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Minha abordagem para ensino, desenvolvimento e vida profissional é
            guiada por alguns princípios fundamentais que desenvolvi ao longo
            dos anos.
          </p>
        </div>

        {/* Core Values */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {coreValues.map((value, index) => {
            const Icon = coreValueIcons[index] ?? Lightbulb
            return (
              <Card key={value.title} className="tech-card">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-bold text-lg">{value.title}</h3>
                      <p className="text-muted-foreground">
                        {value.description}
                      </p>
                    </div>
                  </div>

                  <div className="border-l-4 border-primary/20 pl-4 bg-primary/5 p-3 rounded-r-lg">
                    <div className="flex items-start space-x-2">
                      <Quote className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <p className="text-sm italic text-muted-foreground">
                        {value.quote}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Personal Insights */}
        <div className="space-y-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-2">Insights Pessoais</h3>
            <p className="text-muted-foreground">
              Algumas reflexões que compartilho frequentemente com minha
              audiência
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {personalInsights.map((insight) => (
              <Card key={insight.title} className="tech-card">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-lg">{insight.title}</h4>
                    <Badge variant="secondary" className="text-xs">
                      {insight.category}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {insight.content}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16">
          <Card className="tech-card">
            <CardContent className="p-8 text-center space-y-6">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">Vamos Conversar?</h3>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Estou sempre aberto a discussões sobre tecnologia, carreira e
                  educação. Se você tem dúvidas ou quer compartilhar sua
                  jornada, entre em contato!
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild={true} className="group">
                  <a href={`mailto:${contact.email}`}>
                    <Mail className="mr-2 h-4 w-4" />
                    Entrar em Contato
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                </Button>
              </div>

              <div className="text-sm text-muted-foreground">
                💡 <strong>Dica:</strong> Me siga nas redes sociais para
                acompanhar reflexões diárias sobre carreira em tech e
                desenvolvimento pessoal.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
