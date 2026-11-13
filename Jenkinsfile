@Library('homelab') _

pipeline {
  agent none
  options {
    timeout(time: 10, unit: 'MINUTES')
    disableConcurrentBuilds()
  }
  environment {
    IMAGE = 'harbor.dreadwrym.my.id/apps/bench-check'
  }
  stages {
    stage('verify') {
      agent { label 'bun' }
      stages {
        stage('install') {
          steps {
            container('bun') {
              sh 'bun install --frozen-lockfile'
            }
          }
        }
        stage('typecheck') {
          steps {
            container('bun') {
              sh 'bun run typecheck'
            }
          }
        }
        stage('lint') {
          steps {
            container('bun') {
              sh 'bun run lint'
            }
          }
        }
      }
    }
    stage('ci') {
      agent { label 'buildah' }
      stages {
        stage('resolve tag') {
          steps {
            script {
              env.TAG = (env.GIT_COMMIT ?: '').take(7) ?: 'latest'
            }
          }
        }

        stage('build image & push') {
          steps {
            container('buildah') {
              script {
                buildImage(
                  dockerFilePath: "./$DOCKERFILE",
                  context: '.',
                  imageName: 'benchcheck',
                  tag: env.TAG,
                )
              }
            }
          }
        }
      }
    }
    stage('bump gitops tag') {
      agent { label 'buildah' }
      steps {
        container('buildah') {
          script {
            bumpGitopsTag(
              repoUrl: "https://github.com/Richie-Z/homelab.git",
              filePath: 'apps/benchcheck/image.yaml',
              scope: 'benchcheck',
              tag: env.TAG,
              credentialsId: 'gh-homelab',
            )
          }
        }
      }
    }
  }
}
