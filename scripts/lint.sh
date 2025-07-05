#!/bin/bash
set -e # exit immediately on error
arg=$1
echo "Command argument: $arg"

EXIT_CODE=0

echo ""
if [ "$arg" == "--fix" ]; then
    echo "ESLint. Checking rules and fixing..."
    eslint --fix . || (($EXIT_CODE)) || EXIT_CODE=$?
else
    echo "ESLint. Checking rules..."
    eslint --max-warnings=0 . || (($EXIT_CODE)) || EXIT_CODE=$?
fi
echo "ESLint. Done"
echo ""
echo "Lint script exit code: $EXIT_CODE"
exit $EXIT_CODE