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
        stage('build') {
          steps {
            container('bun') {
              sh 'bun run build'
            }
          }
        }
      }
    }
    stage('build image & push') {
      agent { label 'buildah' }
      environment {
        TAG = "${env.GIT_COMMIT?.take(7) ?: 'latest'}"
      }
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
  }
}
