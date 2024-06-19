#!/usr/bin/env bash

# Update in some automation:
# sed -i '' "s/VERSION=.*/VERSION=1.2.3/g" update.sh
VERSION=1.0.0
DEBUG=0
GITHUB=https://raw.githubusercontent.com
REPOSITORY=druidfi/cypress-testing
BRANCH=main
REPOSITORY_URL=https://github.com/druidfi/cypress-testing

while true; do
  case "$1" in
    -d | --debug ) DEBUG=1; shift ;;
    -b | --branch ) BRANCH="$2"; shift ;;
    * ) break ;;
  esac
done

RED="[0;31m"
GREEN="[0;32m"
YELLOW="[0;33m"
NORMAL="[0m"
CYAN="[0;36m"

declare -a files=(
  "cypress.config.default.js"
  "cypress.config.js"
  "package.json"
  "package-lock.json"
  "cypress/e2e/status-checks.cy.js"
  "cypress/e2e/user-permissions.cy.js"
  "cypress/fixtures/content.json"
  "cypress/fixtures/system.json"
  "cypress/fixtures/test-user.json"
  "cypress/support/commands.js"
  "cypress/support/e2e.js"
)

# If there are some old files, which are not used anymore
declare -a remove_files=(
  #"some-old-file.bak"
)

main() {
  if [[ ${DEBUG} -eq 1 ]]; then
  	rm -rf debug
    mkdir -p debug/cypress/e2e debug/cypress/fixtures debug/cypress/support
    cd debug || exit
  fi

  printf "\n\e%s%s updater (version %s)\e%s\n\n" "${YELLOW}" "${REPOSITORY}" "${VERSION}" "${NORMAL}"

  info "Download following files from ${REPOSITORY_URL}:"
  printf "\n"
  printf '%s\n' "${files[@]}"

  for i in "${!files[@]}"
  do
     file=${files[i]}
     timestamp=$(date +%s)
     urls[${i}]="${GITHUB}/${REPOSITORY}/${BRANCH}/${file}?t=${timestamp}"
  done

  for i in "${!files[@]}"
  do
    if [[ ${DEBUG} -eq 1 ]]; then
      debug "curl -LJs -o ./${files[i]} ${urls[i]}"
    fi

    curl -LJs -o "./${files[i]}" "${urls[i]}"
  done

  for i in "${!remove_files[@]}"
  do
    if [[ ${DEBUG} -eq 1 ]]; then
      debug "Remove ${remove_files[i]}"
    fi

    if [ -f "${remove_files[i]}" ]; then
      rm "${remove_files[i]}"
    fi
  done

  if [[ $? -eq 0 ]]
  then
    printf "\n\e%s[OK]\e%s Update complete!\e%s\n" "${GREEN}" "${YELLOW}" "${NORMAL}"
    printf "\n"
    info "Use git diff or your IDE diff tools to see the changes"
    exit 0
  else
    printf "\n\e%s[ERROR]\e%s Check if update.sh has correct settings\n" "${RED}" "${NORMAL}"
    exit 1
  fi
}

info() {
  printf "\e%s[Info]\e%s %s\n" "${YELLOW}" "${NORMAL}" "${1}"
}

debug() {
  printf "\e%s[Debug]\e%s %s\n" "${CYAN}" "${NORMAL}" "${1}"
}

main
