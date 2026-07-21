pipeline {
  agent any

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Build') {
      steps {
        sh '''
          rm -rf build && mkdir -p build
          cp index.html app.js cart-calc.js response.php build/
        '''
      }
    }

    stage('Test') {
      steps {
        sh 'docker run --rm --volumes-from "$HOSTNAME" -w "$WORKSPACE" php:8.2-cli php -l response.php'
        sh 'docker run --rm --volumes-from "$HOSTNAME" -w "$WORKSPACE" node:20-alpine node --test'
      }
    }

    stage('Deploy') {
      steps {
        // El token de PayPhone se guarda como "Secret text" en
        // Jenkins > Manage Jenkins > Credentials, con el ID "payphone-token"
        // (NUNCA se escribe el token directamente en este archivo).
        withCredentials([string(credentialsId: 'payphone-token', variable: 'PAYPHONE_TOKEN')]) {
          sh '''
            docker build -t closet-payphone:latest .
            docker stop closet-payphone-app || true
            docker rm closet-payphone-app || true
            docker run -d --name closet-payphone-app \
              -e PAYPHONE_TOKEN="$PAYPHONE_TOKEN" \
              -p 8081:80 closet-payphone:latest
          '''
        }
      }
    }
  }
}
