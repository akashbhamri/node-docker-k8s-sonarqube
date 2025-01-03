pipeline {
    agent any
    environment {
        DOCKER_IMAGE = 'akashbhamri25/node-docker-k8s-sonarqube'
        SONARQUBE_URL = 'http://localhost:9000'
        SONARQUBE_TOKEN = 'sqa_f323f8657197ea3d1c870d7fa1cf9be706dbb96e'
        JAVA_HOME = '/opt/homebrew/opt/openjdk'
        PATH = "/usr/local/bin:${JAVA_HOME}/bin:${env.PATH}"
    }
    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/akashbhamri/node-docker-k8s-sonarqube.git'
            }
        }
        
        stage('Build and Test') {
            steps {
                script {
                    // Install dependencies
                    sh 'npm install'
                    
                    // Run tests to generate coverage report
                    sh 'npm test'
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                script {
                    // Run SonarQube analysis
                    withSonarQubeEnv('SonarQube') {
                        sh 'npm run sonar'
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

        stage('Update Manifests and Push to Git') {
            steps {
                script {
                    // Update the Docker image in the manifest file
                    sh """
                    sed -i "" 's|image: .*|image: ${DOCKER_IMAGE}|' manifest/Deployment.yml
                    """
                    
                    // Stage all changes (including untracked files)
                    sh 'git add -A'
                    
                    // Commit and push updated manifests to Git if there are changes
                    sh """
                    git diff-index --quiet HEAD || git commit -m "Update Docker image to $DOCKER_IMAGE"
                    """
                    
                    withCredentials([usernamePassword(credentialsId: 'git-credentials', passwordVariable: 'GIT_PASSWORD', usernameVariable: 'GIT_USERNAME')]) {
                        sh """
                        git config user.name "Jenkins"
                        git config user.email "jenkins@example.com"
                        git push https://$GIT_USERNAME:$GIT_PASSWORD@github.com/akashbhamri/node-docker-k8s-sonarqube.git
                        """
                    }
                }
            }
        }
    }
}
