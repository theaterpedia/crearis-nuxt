<template>
  <Box layout="full-width">
    <Main>
      <Section>
        <Container>
          <Timeline>
            <li>
              <mark>31. März</mark>
              <div>
                <Prose>
                  <h3><strong>Aktueller Status</strong></h3>
                  <ul>
                    <li>grafisches Design, technisches Design und Proof-of-Concept sind abgeschlossen.</li>
                    <li>
                      die weitere Entstehung des Open-Source-Systems kann verfolgt werden unter:
                      <a href="#">GitHub Link</a>
                      .
                    </li>
                  </ul>
                </Prose>
              </div>
            </li>

            <li>
              <mark>bis 31. Mai</mark>
              <div>
                <Prose>
                  <h3><strong>Relaunch dasei.eu</strong></h3>
                  <p>
                    Neuprogrammierung von
                    <a href="#">https://dasei.eu</a>
                    basierend auf dem Theaterpedia-Code
                  </p>
                </Prose>
              </div>
            </li>

            <li>
              <mark>ab 1. Juni</mark>
              <div>
                <Prose>
                  <h3><strong>Private Previews + Beta-Testing</strong></h3>
                  <p>private Previews + Beta-Testing zu allen 4 Themes, Regio- und Freelancer-Templates</p>
                </Prose>
              </div>
            </li>
          </Timeline>
        </Container>
      </Section>
    </Main>
  </Box>
</template>

<script lang="ts" setup>
import { Box, Container, Main, Prose, Section, Timeline } from '@/index'
</script>
