pipeline {
    agent any
    environment {
        DOCKER_IMAGE = 'akashbhamri25/node-docker-k8s-sonarqube'
        SONARQUBE_URL = 'http://localhost:9000'
        SONARQUBE_TOKEN = 'sqa_f323f8657197ea3d1c870d7fa1cf9be706dbb96e'
    }
    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/your-username/node-docker-k8s-sonarqube.git'
            }
        }
        stage('SonarQube Analysis') {
            steps {
                script {
                    withSonarQubeEnv('SonarQube') {
                        sh 'mvn clean verify sonar:sonar'
                    }
                }
            }
        }
        stage('Build Docker Image') {
            steps {
                script {
                    sh 'docker build -t $DOCKER_IMAGE .'
                }
            }
        }
        stage('Push Docker Image to Docker Hub') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USERNAME')]) {
                        sh 'docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD'
                        sh 'docker push $DOCKER_IMAGE'
                    }
                }
            }
        }
        stage('Deploy to Kubernetes') {
            steps {
                script {
                    sh 'kubectl apply -f deployment.yaml'
                }
            }
        }
    }
    post {
        always {
            cleanWs()
        }
    }
}
