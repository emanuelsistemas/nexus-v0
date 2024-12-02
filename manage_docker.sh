#!/bin/bash

case "$1" in
    start)
        echo "Starting services..."
        docker-compose up -d
        ;;
    stop)
        echo "Stopping services..."
        docker-compose down
        ;;
    restart)
        echo "Restarting services..."
        docker-compose down
        docker-compose up -d
        ;;
    logs)
        if [ "$2" ]; then
            echo "Showing logs for $2..."
            docker-compose logs -f "$2"
        else
            echo "Showing all logs..."
            docker-compose logs -f
        fi
        ;;
    build)
        echo "Building services..."
        docker-compose build
        ;;
    ps)
        echo "Showing running containers..."
        docker-compose ps
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|logs [service]|build|ps}"
        exit 1
        ;;
esac

exit 0
