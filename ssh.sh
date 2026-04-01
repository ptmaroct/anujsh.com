#!/bin/sh
# SSH Keys Installer for Anuj's servers
# Run: curl -fsSL https://anujsh.com/ssh.sh | sh

set -e
umask 077

KEY="ecdsa-sha2-nistp256 AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBGdaNTFylN4rZ2OR6D326SPpEOIIoFRHsK1/jvIZjd7S9lahefifkCfQ9DoDT+AyOFBq1+yOsb5UTQoACttQ01M= #ssh.id - @ptmaroct"

echo "Setting up SSH keys for Anuj's servers..."

mkdir -p "$HOME/.ssh"
chmod 700 "$HOME/.ssh"
touch "$HOME/.ssh/authorized_keys"
chmod 600 "$HOME/.ssh/authorized_keys"

if ! grep -qF "$KEY" "$HOME/.ssh/authorized_keys"; then
  echo "$KEY" >> "$HOME/.ssh/authorized_keys"
  echo "Added key: $(echo "$KEY" | cut -c1-50)..."
else
  echo "Key already exists"
fi

echo "Done! SSH keys installed."
