@Library('homelab') _

pipeline {
  agent none
  options {
    timeout(time: 10, unit: 'MINUTES')
    disableConcurrentBuilds()
  }
  environment {
    IMAGE = 'harbor.dreadwrym.my.id/apps/bench-check'
    TAG   = "${env.GIT_COMMIT?.take(7) ?: 'latest'}"
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
    stage('build image & push') {
      agent { label 'buildah' }
      stages {
        stage('build image') {
          steps {
            container('buildah') {
              sh '''
                buildah --storage-driver=vfs build --isolation=chroot \
                  -t "$IMAGE:$TAG" -t "$IMAGE:latest" .
              '''
            }
          }
        }
        stage('push') {
          steps {
            container('buildah') {
              sh '''
                buildah --storage-driver=vfs push --authfile /auth/.dockerconfigjson "$IMAGE:$TAG"
                buildah --storage-driver=vfs push --authfile /auth/.dockerconfigjson "$IMAGE:latest"
              '''
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
              branch: 'master',
              filePath: 'apps/benchcheck/values.yaml',
              scope: 'benchcheck',
              tag: env.TAG,
              credentialsId: 'gh-homelab',
              userName: 'jenkins',
              userEmail: 'jenkins@dreadwrym.my.id'
            )
          }
        }
      }
    }
  }
}
