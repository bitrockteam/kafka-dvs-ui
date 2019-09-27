pipeline {
  agent none
  options {
      ansiColor('xterm')
  }
  environment {
      GITHUB_CREDENTIALS = 'BitrockCI token'
      GITHUB_ACCOUNT = 'bitrockteam'
      GITHUB_REPO = 'kafka-flightstream-ui'
      GITHUB_SSH = "centos"
      RELEASE_BRANCH = "master"
  }
  post {
    failure {
        slackSend color: "#FF0000",
                            message: ":exploding_head: ${JOB_NAME} build ${BUILD_NUMBER} failure! (<${BUILD_URL}|Open>)"
    }
    aborted {
        slackSend color: "#FF0000",
                            message: ":exploding_head: ${JOB_NAME} build ${BUILD_NUMBER} aborted! (<${BUILD_URL}|Open>)"
    }
  }
  stages {
    stage('Fetch dependencies') {
      agent {
        docker 'circleci/node:11.6-browsers'
      }
      steps {
        sh 'yarn install --frozen-lockfile'
        stash includes: 'node_modules/', name: 'node_modules'
      }
      post {
          failure {
              setBuildStatus ("ci/jenkins/dep-checkout", 'Dependency Checkout Failed', 'FAILURE')
          }
          success {
              setBuildStatus ("ci/jenkins/dep-checkout", 'Dependency Checkout Success', 'SUCCESS')
          }
      }
    }
    stage('Lint') {
      agent {
        docker 'circleci/node:11.6-browsers'
      }
      steps {
        unstash 'node_modules'
        sh 'yarn lint'
      }
      post {
          failure {
              setBuildStatus ("ci/jenkins/lint", 'Lint failed', 'FAILURE')
          }
          aborted {
              setBuildStatus ("ci/jenkins/lint", 'Lint aborted', 'FAILURE')
          }
          success {
              setBuildStatus ("ci/jenkins/lint", 'Lint completed', 'SUCCESS')
          }
      }
    }
    stage('Unit Test') {
      agent {
        docker 'circleci/node:11.6-browsers'
      }
      steps {
        unstash 'node_modules'
        sh 'yarn test:unit'
        junit '__tests__/results/*.xml'
      }
      post {
          failure {
              setBuildStatus ("ci/jenkins/test", 'Unit tests failed', 'FAILURE')
          }
          aborted {
              setBuildStatus ("ci/jenkins/test", 'Unit tests aborted', 'FAILURE')
          }
          success {
              setBuildStatus ("ci/jenkins/test", 'Unit tests completed', 'SUCCESS')
          }
      }
    }
//    stage('E2E Test') {
//        agent {
//          docker 'circleci/node:11.6-browsers'
//        }
//        steps {
//          unstash 'node_modules'
//          sh 'yarn test:e2e:ci'
//          archiveArtifacts artifacts: 'cypress/screenshots/**,cypress/videos/**', allowEmptyArchive: true
//          junit testResults: "cypress/results/results-*.xml"
//        }
//        post {
//          failure {
//              setBuildStatus ("ci/jenkins/e2e", 'e2e failed', 'FAILURE')
//          }
//          aborted {
//              setBuildStatus ("ci/jenkins/e2e", 'e2e aborted', 'FAILURE')
//          }
//          success {
//              setBuildStatus ("ci/jenkins/e2e", 'e2e completed', 'SUCCESS')
//          }
//        }
//    }
    stage('Compile') {
      agent {
        docker 'circleci/node:11.6-browsers'
      }
      steps {
        unstash 'node_modules'
        sh 'yarn build'
        stash includes: 'dist/', name: 'dist'
        stash includes: 'package.json', name: 'package.json'
      }
      post {
        failure {
            setBuildStatus ("ci/jenkins/build", 'Build failed', 'FAILURE')
        }
        aborted {
            setBuildStatus ("ci/jenkins/build", 'Build aborted', 'FAILURE')
        }
        success {
            setBuildStatus ("ci/jenkins/build", 'Build completed', 'SUCCESS')
        }
      }
    }
    stage('Build and Push Docker Image') {
      agent any
      environment {
        DOCKER_REPOSITORY = '618624782178.dkr.ecr.eu-west-1.amazonaws.com'
        AWS_REGION = 'eu-west-1'
      }
      when {
        expression { GIT_BRANCH ==~ /($RELEASE_BRANCH)/ }
      }
      steps {
        unstash 'dist'
        unstash 'package.json'
        sh """
            set +x
            \$(aws ecr get-login --no-include-email --region ${AWS_REGION})
            set -x
            """
        script {
            TAG = sh(script: 'sed -n "s|.*\\"version\\":.*\\"\\(.*\\)\\",|\\1|p" package.json',
                     returnStdout: true).trim()

        sh """
            docker build -t ${DOCKER_REPOSITORY}/${GITHUB_REPO}:${TAG}-${BUILD_NUMBER} .
            docker push ${DOCKER_REPOSITORY}/${GITHUB_REPO}:${TAG}-${BUILD_NUMBER}
            docker tag ${DOCKER_REPOSITORY}/${GITHUB_REPO}:${TAG}-${BUILD_NUMBER} ${DOCKER_REPOSITORY}/${GITHUB_REPO}:latest
            docker push ${DOCKER_REPOSITORY}/${GITHUB_REPO}:latest
        """

        sshagent(credentials:['centos']) {
            sh """
                git config --local user.name 'Jenkins'
                git config --local user.email 'ci@bitrock.it'
                git tag -d v${TAG}-${BUILD_NUMBER} || true
                git tag -a v${TAG}-${BUILD_NUMBER} -m "added release tag"
                git push --tags
            """
         }
        }
       }
	post {
		failure {
		    setBuildStatus ("cd/jenkins/ecr/push", 'Push docker image failed', 'FAILURE')
		}
		aborted {
		    setBuildStatus ("cd/jenkins/ecr/push", 'Push docker image aborted', 'FAILURE')
		}
		success {
		    setBuildStatus ("cd/jenkins/ecr/push", 'Push docker image completed', 'SUCCESS')
		    slackSend color: "#008000",
						   message: ":star-struck: ${JOB_NAME} released ${TAG}-${BUILD_NUMBER}! (<${BUILD_URL}|Open>)"
		}
	    }
      }
      stage("Trigger deploy") {
            when {
                allOf {
                    branch RELEASE_BRANCH
                }
            }
            steps {
		build job: 'kafka-flightstream-cd/master', wait: false
	    }
    }
  }
}

void setBuildStatus(context, message, state) {
    githubNotify status: state,
                 context: context,
                 credentialsId: GITHUB_CREDENTIALS,
                 description: message,
                 account: GITHUB_ACCOUNT,
                 repo: GITHUB_REPO,
                 sha: GIT_COMMIT
}
