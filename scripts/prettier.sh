#!/bin/bash
set -e # exit immediately on error
arg=$1
echo "Command argument: $arg"

EXIT_CODE=0

echo ""
if [ "$arg" == "--fix" ]; then
    echo "Prettier. Checking formatting and fixing..."
    prettier --write . --config ./.prettierrc || (($EXIT_CODE)) || EXIT_CODE=$?
else
    echo "Prettier. Checking formatting..."
    prettier --check . || (($EXIT_CODE)) || EXIT_CODE=$?
fi

echo "Prettier. Done"
echo ""
echo "Format script exit code: $EXIT_CODE"
exit $EXIT_CODE