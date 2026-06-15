'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import * as FancyButton from '@/components/ui/fancy-button'
import { FreeLessonModal } from '@/components/ui/free-lesson-modal'
import { site } from '@/lib/site-data'
import { ArrowRight, GraduationCap, Play, TrendingUp } from 'lucide-react'
import { useState } from 'react'

export function FeaturedContent() {
  const [isFreeLessonOpen, setIsFreeLessonOpen] = useState(false)
  const { featured: featuredCourse, others: otherCourses } = site.courses
  const { freeLessonVideoId } = site.youtube

  return (
    <section className="py-16 lg:py-20">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-12">
          <Badge variant="outline" className="px-3 py-1">
            <TrendingUp className="mr-1 h-3 w-3" />
            Conteúdo em Destaque
          </Badge>
          <h2 className="text-3xl font-bold lg:text-4xl">
            Aprenda com quem <span className="gradient-text">chegou lá</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Cursos práticos, artigos detalhados e insights reais de quem saiu do
            Brasil e construiu uma carreira internacional em tech.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Featured Course - Takes 2 columns */}
          <div className="lg:col-span-2">
            <Card className="tech-card h-full">
              <CardHeader>
                <div className="space-y-3">
                  <Badge variant="secondary" className="w-fit">
                    <GraduationCap className="mr-1 h-3 w-3" />
                    Curso Principal
                  </Badge>
                  <CardTitle className="text-2xl">
                    {featuredCourse.title}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {featuredCourse.description}
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Course Stats - Horizontal Layout */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-3xl font-bold">
                      {featuredCourse.students}
                    </div>
                    <div className="text-sm text-muted-foreground">alunos</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold">
                      {featuredCourse.lessons}
                    </div>
                    <div className="text-sm text-muted-foreground">aulas</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold">
                      {featuredCourse.hours}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      de conteúdo
                    </div>
                  </div>
                </div>

                {/* Course Highlights */}
                <div className="flex flex-wrap gap-2">
                  {featuredCourse.highlights.map((highlight) => (
                    <Badge
                      key={highlight}
                      variant="outline"
                      className="text-xs"
                    >
                      {highlight}
                    </Badge>
                  ))}
                </div>

                {/* CTA */}
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full"
                    onClick={() => setIsFreeLessonOpen(true)}
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Assista a primeira aula grátis
                  </Button>

                  <FancyButton.Root
                    size="lg"
                    className="w-full group"
                    asChild={true}
                  >
                    <a
                      href={featuredCourse.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Conheça a estrutura completa do curso e se inscreva
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </FancyButton.Root>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Other Courses */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Mais cursos</h3>
            </div>
            {otherCourses.map((course) => (
              <Card key={course.id} className="tech-card group">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold">
                    {course.title}
                  </CardTitle>
                  <CardDescription className="text-sm line-clamp-3">
                    {course.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild={true}
                    className="group/btn p-0 h-auto font-normal"
                  >
                    <a
                      href={course.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Saiba mais
                      <ArrowRight className="ml-1 h-3 w-3 group-hover/btn:translate-x-1 transition-transform" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Free Lesson Modal */}
        <FreeLessonModal
          isOpen={isFreeLessonOpen}
          onClose={() => setIsFreeLessonOpen(false)}
          courseTitle={featuredCourse.title}
          videoId={freeLessonVideoId}
        />
      </div>
    </section>
  )
}
