pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                echo 'Checking out code...'
                // Add your checkout steps here
                git url: '<your-repo-url>', branch: 'main'
            }
        }

        stage('Build') {
            steps {
                echo 'Docker Building...'
                // Add your build steps here
                sh 'docker build -t portfolio-app:latest .'
            }
        }
        stage('Test') {
            steps {
                echo 'Testing...'
                // Add your test steps here
            }
        }

        stage('Push') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'docker-hub-credentials',
                        usernameVariable: 'DOCKER_USERNAME',
                        passwordVariable: 'DOCKER_PASSWORD'
                    )
                ]) {

                    sh 'echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin'

                    sh "docker tag portfolio-app:latest ${DOCKER_USERNAME}/portfolio-app:latest"

                    sh "docker push ${DOCKER_USERNAME}/portfolio-app:latest"
                }
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying...'
                // Add your deploy steps here
                sh 'docker compose up -d --build'
            }
        }
    }
}