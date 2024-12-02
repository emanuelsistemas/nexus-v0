#!/bin/bash

APP_DIR="/root/project/nexus/nexus-ia/v0/Backend"
PID_FILE="$APP_DIR/app.pid"
LOG_FILE="$APP_DIR/app.log"

start_server() {
    echo "Starting FastAPI server..."
    cd $APP_DIR
    nohup uvicorn src.main:app --reload --host 0.0.0.0 --port 8000 > $LOG_FILE 2>&1 & echo $! > $PID_FILE
    echo "Server started. PID: $(cat $PID_FILE)"
}

stop_server() {
    if [ -f $PID_FILE ]; then
        echo "Stopping FastAPI server..."
        kill -9 $(cat $PID_FILE) 2>/dev/null
        rm $PID_FILE
        echo "Server stopped"
    else
        echo "Server is not running"
    fi
}

check_status() {
    if [ -f $PID_FILE ] && ps -p $(cat $PID_FILE) > /dev/null; then
        echo "Server is running. PID: $(cat $PID_FILE)"
        echo "Last 10 lines of log:"
        tail -n 10 $LOG_FILE
    else
        echo "Server is not running"
    fi
}

restart_server() {
    stop_server
    sleep 2
    start_server
}

case "$1" in
    start)
        start_server
        ;;
    stop)
        stop_server
        ;;
    restart)
        restart_server
        ;;
    status)
        check_status
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|status}"
        exit 1
        ;;
esac

exit 0
