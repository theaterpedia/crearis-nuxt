<script lang="ts" setup>
import { Columns } from '@crearis/ui'
</script>

<template>
  <div class="bg-default">
    <PruSection heading="**Headline Headline** Subline Subline">
      <Prose>
          <p>
              Testeintrag Testeintrag
              Testeintrag Testeintrag
              Testeintrag Testeintrag
          </p>
          <p>
              Testeintrag Testeintrag
              Testeintrag Testeintrag
              Testeintrag Testeintrag
              Testeintrag Testeintrag
              Testeintrag Testeintrag
          </p>
          <p>
              Testeintrag Testeintrag
              Testeintrag Testeintrag
              Testeintrag Testeintrag
          </p>                                
      </Prose>
    </PruSection>
    <PruSection background="muted" heading="**Headline Headline** Subline Subline">
      <Prose>
          <p>
              Testeintrag Testeintrag
              Testeintrag Testeintrag
              Testeintrag Testeintrag
          </p>
          <p>
              Testeintrag Testeintrag
              Testeintrag Testeintrag
              Testeintrag Testeintrag
              Testeintrag Testeintrag
              Testeintrag Testeintrag
          </p>
          <p>
              Testeintrag Testeintrag
              Testeintrag Testeintrag
              Testeintrag Testeintrag
          </p>                                
      </Prose>
    </PruSection>
    <SectionContainer>
      <Columns>
        <PostIt rotation="right" width="1/3" heading="_01_ **Ich und Automatisierung** von seinen administrativen Prozessen">
          <Prose>
            <p>
              Jeder Theaterpädagoge benötigt heute eine eigene Webpräsenz, die idealerweise mit Datenbanken kompatibel ist, um Inhalte effektiv teilen und verbreiten zu können.
            </p>
            <p>
              Eine gut gestaltete, vernetzte Website ermöglicht es, Projekte und Veranstaltungen sichtbar zu machen und die eigene Arbeit einem breiteren Publikum zugänglich zu machen.
            </p>
            <h4>
              Erste Schritte mit Obsidian
            </h4>
            <p>
              wie effektiv mit .md-Dateien arbeiten
            </p>
            <p>
              Der Workshop in Rahmen von Theaterpedia-Konferenz von Hans Dönitz wird sich darauf konzentrieren, wie Theaterpädagogen ihre eigene Webpräsenz erstellen und sie mit Datenbanken verbinden können, um Inhalte leichter zu teilen und zu verbreiten.
            </p>
            <a href="#">>>> bin dabei <<<</a>                               
          </Prose>
        </PostIt>
        <PostIt width="1/3" heading="_02_ **Ich und Automatisierung** von seinen administrativen Prozessen">
          <Prose>
            <p>
              Jeder Theaterpädagoge benötigt heute eine eigene Webpräsenz, die idealerweise mit Datenbanken kompatibel ist, um Inhalte effektiv teilen und verbreiten zu können.
            </p>
            <p>
              Eine gut gestaltete, vernetzte Website ermöglicht es, Projekte und Veranstaltungen sichtbar zu machen und die eigene Arbeit einem breiteren Publikum zugänglich zu machen.
            </p>
            <h4>
              Erste Schritte mit Obsidian
            </h4>
            <p>
              wie effektiv mit .md-Dateien arbeiten
            </p>
            <p>
              Der Workshop in Rahmen von Theaterpedia-Konferenz von Hans Dönitz wird sich darauf konzentrieren, wie Theaterpädagogen ihre eigene Webpräsenz erstellen und sie mit Datenbanken verbinden können, um Inhalte leichter zu teilen und zu verbreiten.
            </p>
            <a href="#">>>> bin dabei <<<</a>                               
          </Prose>
        </PostIt>
        <PostIt color="secondary" width="1/3" heading="_03_ **Ich und Automatisierung** von seinen administrativen Prozessen">
          <Prose>
            <p>
              Jeder Theaterpädagoge benötigt heute eine eigene Webpräsenz, die idealerweise mit Datenbanken kompatibel ist, um Inhalte effektiv teilen und verbreiten zu können.
            </p>
            <p>
              Eine gut gestaltete, vernetzte Website ermöglicht es, Projekte und Veranstaltungen sichtbar zu machen und die eigene Arbeit einem breiteren Publikum zugänglich zu machen.
            </p>
            <h4>
              Erste Schritte mit Obsidian
            </h4>
            <p>
              wie effektiv mit .md-Dateien arbeiten
            </p>
            <p>
              Der Workshop in Rahmen von Theaterpedia-Konferenz von Hans Dönitz wird sich darauf konzentrieren, wie Theaterpädagogen ihre eigene Webpräsenz erstellen und sie mit Datenbanken verbinden können, um Inhalte leichter zu teilen und zu verbreiten.
            </p>
            <a href="#">>>> bin dabei <<<</a>                               
          </Prose>
        </PostIt>                
      </Columns>
      <Columns class="flex-row-reverse gap-0 sm:gap-2 md:gap-4">
        <PostIt rotation="right" width="1/5" is="h4" heading="Theaterpedia-Konferenz 21.-24. Nov 2024">
          <Prose>
            <p>
              Jeder Theaterpädagoge benötigt heute eine eigene Webpräsenz, die idealerweise mit Datenbanken kompatibel ist, um Inhalte effektiv teilen und verbreiten zu können.
            </p>
            <a href="#">>>> bin dabei <<<</a>                               
          </Prose>
        </PostIt>
        <PostIt rotation="left" width="1/5" is="h4" heading="Theaterpedia-Konferenz 21.-24. Nov 2024">
          <Prose>
            <p>
              Eine gut gestaltete, vernetzte Website ermöglicht es, Projekte und Veranstaltungen sichtbar zu machen und die eigene Arbeit einem breiteren Publikum zugänglich zu machen.
            </p>
            <a href="#">>>> bin dabei <<<</a>                               
          </Prose>
        </PostIt>              
      </Columns>
    </SectionContainer>
    <PlLayouts />
  </div>
</template>
